using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace api.Infrastructure.Helpers
{
    public static class SearchHelper<T>
    {
        public static IQueryable<T> ApplySearch(IQueryable<T> query, string keyword, Expression<Func<T, string>> searchField)
        {
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(searchField.Compose(search => search.Contains(keyword)));
            }
            return query;
        }
    }

    public static class ExpressionExtensions
    {
        public static Expression<Func<T, bool>> Compose<T>(this Expression<Func<T, string>> selector, Expression<Func<string, bool>> condition)
        {
            var parameter = selector.Parameters[0];
            var body = Expression.Invoke(condition, selector.Body);
            return Expression.Lambda<Func<T, bool>>(body, parameter);
        }
    }
}
