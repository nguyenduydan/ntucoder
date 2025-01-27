namespace api.Infrashtructure.Services
{
    public interface IMinioService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string bucketName);
    }
}
