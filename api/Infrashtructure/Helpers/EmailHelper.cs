using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;

namespace api.Infrastructure.Helpers
{
    public class EmailHelper
    {
        private readonly IConfiguration _config;

        public EmailHelper(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpHost = _config["Smtp:Host"] ?? "smtp.gmail.com";
            var smtpPort = int.TryParse(_config["Smtp:Port"], out var port) ? port : 587;
            var email = _config["Smtp:User"];
            var password = _config["Smtp:Pass"];
            var from = _config["Smtp:From"] ?? email;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                throw new InvalidOperationException("Missing SMTP credentials.");

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(from));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html") { Text = body };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(email, password);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}
