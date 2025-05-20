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
                var efFunctions = Expression.Constant(EF.Functions);
                var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);

                foreach (var selector in selectors)
                {
                    var parameter = selector.Parameters[0];

                    Expression selectorBody = selector.Body;
                    if (selectorBody.Type != typeof(string))
                    {
                        selectorBody = Expression.Convert(selectorBody, typeof(string));
                    }

                    var toLowerCall = Expression.Call(selectorBody, toLowerMethod!);

                    var likeCall = Expression.Call(
                        typeof(DbFunctionsExtensions),
                        nameof(DbFunctionsExtensions.Like),
                        Type.EmptyTypes,
                        efFunctions,
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
