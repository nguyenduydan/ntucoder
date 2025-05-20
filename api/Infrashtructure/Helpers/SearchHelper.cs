using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace api.Infrastructure.Helpers
{
    public static class SearchHelper<T>
    {
        // Tokenize keyword thành các từ riêng biệt, phân cách bởi space
        private static string[] Tokenize(string keyword)
        {
            return keyword
                .Trim()
                .ToLower()
                .Split(new[] { ' ', ',', '.', ';', '-', '_', '/' }, StringSplitOptions.RemoveEmptyEntries);
        }

        // Search nhiều trường, nhiều token
        // useAnd = true: tất cả token phải match (AND)
        // useAnd = false: ít nhất 1 token match (OR)
        public static IQueryable<T> ApplySearchMultiField(
             IQueryable<T> query,
             string? keyword,
             bool useAnd,
             params Expression<Func<T, string>>[] selectors)
        {
            if (string.IsNullOrWhiteSpace(keyword) || selectors == null || selectors.Length == 0)
                return query;

            var tokens = Tokenize(keyword);

            if (tokens.Length == 0)
                return query;

            var predicate = useAnd ? PredicateBuilder.True<T>() : PredicateBuilder.False<T>();

            foreach (var token in tokens)
            {
                Expression<Func<T, bool>> tokenPredicate = item => false;

                foreach (var selector in selectors)
                {
                    // Build predicate expression: EF.Functions.Like(selector(item).ToLower(), $"%{token}%")
                    var parameter = selector.Parameters[0];

                    // Expression: selector.Body.ToLower()
                    var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
                    var toLowerCall = Expression.Call(selector.Body, toLowerMethod!);

                    // EF.Functions.Like(selector.Body.ToLower(), $"%{token}%")
                    var efFunctionsProperty = Expression.Property(null, typeof(EF).GetProperty(nameof(EF.Functions))!);
                    var likeMethod = typeof(DbFunctionsExtensions).GetMethod("Like", new[] { typeof(DbFunctions), typeof(string), typeof(string) })!;

                    var likeCall = Expression.Call(
                        likeMethod,
                        efFunctionsProperty,
                        toLowerCall,
                        Expression.Constant($"%{token}%")
                    );

                    var lambda = Expression.Lambda<Func<T, bool>>(likeCall, parameter);

                    tokenPredicate = tokenPredicate.Or(lambda);
                }

                if (useAnd)
                    predicate = predicate.And(tokenPredicate);
                else
                    predicate = predicate.Or(tokenPredicate);
            }

            return query.Where(predicate);
        }


        private static string GetPropertyName(Expression<Func<T, string>> selector)
        {
            if (selector.Body is MemberExpression member)
                return member.Member.Name;

            if (selector.Body is UnaryExpression unary && unary.Operand is MemberExpression unaryMember)
                return unaryMember.Member.Name;

            throw new ArgumentException("Selector must be a member expression");
        }
    }

    // PredicateBuilder mở rộng thêm And
    public static class PredicateBuilder
    {
        public static Expression<Func<T, bool>> True<T>() { return f => true; }
        public static Expression<Func<T, bool>> False<T>() { return f => false; }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> expr1,
                                                        Expression<Func<T, bool>> expr2)
        {
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
            return Expression.Lambda<Func<T, bool>>
                (Expression.OrElse(expr1.Body, invokedExpr), expr1.Parameters);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr1,
                                                        Expression<Func<T, bool>> expr2)
        {
            var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
            return Expression.Lambda<Func<T, bool>>
                (Expression.AndAlso(expr1.Body, invokedExpr), expr1.Parameters);
        }
    }
}
