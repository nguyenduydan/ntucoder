using System.Text;

namespace api.Infrashtructure.Helpers
{
    public class CodeHelper
    {
        public static string GenerateNumericCode(int length)
        {
            var rng = new Random();
            var code = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                code.Append(rng.Next(0, 10));
            }
            return code.ToString();
        }
    }
}
