namespace api.Infrashtructure.Middlewares
{
    public class IpMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _allowedIp = "192.168.1.1";

        public IpMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            // Lấy IP từ header hoặc connection
            var remoteIp = context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                            ?? context.Connection.RemoteIpAddress?.ToString();

            if (remoteIp != _allowedIp)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Access denied.");
                return;
            }

            await _next(context);
        }
    }
}
