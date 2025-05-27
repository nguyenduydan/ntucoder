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

        // Helper: Thay thế tất cả parameter trong expression bằng parameter mới
        private class ParameterReplacer : ExpressionVisitor
        {
            private readonly ParameterExpression _parameter;
            public ParameterReplacer(ParameterExpression parameter)
            {
                _parameter = parameter;
            }
            protected override Expression VisitParameter(ParameterExpression node) => _parameter;
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

            var parameter = Expression.Parameter(typeof(T), "b");
            var efFunctions = Expression.Constant(EF.Functions);
            var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);

            Expression? fullPredicate = null;

            foreach (var token in tokens)
            {
                Expression? tokenPredicate = null;
                foreach (var selector in selectors)
                {
                    // Replace parameter in selector with our single parameter
                    var selectorBody = new ParameterReplacer(parameter).Visit(selector.Body);

                    // Convert về string nếu cần
                    if (selectorBody!.Type != typeof(string))
                        selectorBody = Expression.Convert(selectorBody, typeof(string));

                    var toLowerCall = Expression.Call(selectorBody, toLowerMethod!);

                    // Exact match: selector.ToLower() == token
                    var exactMatch = Expression.Equal(
                        toLowerCall,
                        Expression.Constant(token)
                    );

                    // Like match: LIKE %token%
                    var likeCall = Expression.Call(
                        typeof(DbFunctionsExtensions),
                        nameof(DbFunctionsExtensions.Like),
                        Type.EmptyTypes,
                        efFunctions,
                        toLowerCall,
                        Expression.Constant($"%{token}%")
                    );

                    var combined = Expression.OrElse(exactMatch, likeCall);

                    tokenPredicate = tokenPredicate == null
                        ? combined
                        : Expression.OrElse(tokenPredicate, combined);
                }

                fullPredicate = fullPredicate == null
                    ? tokenPredicate
                    : (useAnd
                        ? Expression.AndAlso(fullPredicate, tokenPredicate!)
                        : Expression.OrElse(fullPredicate, tokenPredicate!));
            }

            if (fullPredicate == null)
                return query;

            var lambda = Expression.Lambda<Func<T, bool>>(fullPredicate, parameter);
            return query.Where(lambda);
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

    // PredicateBuilder giữ lại cho các trường hợp cần thiết, không dùng trực tiếp trong ApplySearchMultiField nữa.
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