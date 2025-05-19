using System.Net.Mail;
using System.Net;
using MimeKit;

namespace api.Infrashtructure.Helpers
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
            var email = _config["Smtp:User"];
            var password = _config["Smtp:Pass"];

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_config["Smtp:From"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html") // hoặc "plain" nếu body thuần text
            {
                Text = body
            };

            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            // Kết nối đến SMTP server với SSL trên port 
            await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

            // Xác thực với email và mật khẩu (app password)
            await smtp.AuthenticateAsync(email, password);

            // Gửi email
            await smtp.SendAsync(message);

            // Ngắt kết nối
            await smtp.DisconnectAsync(true);
        }


    }
}
