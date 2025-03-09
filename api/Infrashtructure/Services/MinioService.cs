using Minio;
using Minio.DataModel.Args;

namespace api.Infrashtructure.Services
{
    public class MinioService
    {
        private readonly IMinioClient _minioClient;

        public MinioService()
        {
                _minioClient = new MinioClient()
                .WithEndpoint("localhost:9000")  // Địa chỉ MinIO
                .WithCredentials("DqcCzm99tXrLHxwn2b1l", "5wf7RjMpQBW638RFsZZikQmfE76nj2UgKWkip0n2")  // Thông tin người dùng root
                .Build();
        }

        /// <summary>
        /// Upload file lên MinIO và trả về URL của file.
        /// </summary>
        /// <param name="fileStream">Dữ liệu file cần upload</param>
        /// <param name="fileName">Tên file sẽ lưu trên MinIO</param>
        /// <param name="bucketName">Tên bucket chứa file</param>
        /// <returns>URL của file sau khi upload</returns>
        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string bucketName)
        {
            // Kiểm tra xem bucket đã tồn tại chưa
            var bucketExistsArgs = new BucketExistsArgs().WithBucket(bucketName);
            bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs);

            if (!found)
            {
                // Tạo bucket nếu chưa tồn tại
                var makeBucketArgs = new MakeBucketArgs().WithBucket(bucketName);
                await _minioClient.MakeBucketAsync(makeBucketArgs);
            }

            // Tải tệp lên MinIO
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(fileName)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length);

            await _minioClient.PutObjectAsync(putObjectArgs);

            // Trả về URL công khai của tệp tin
            return $"http://localhost:9000/{bucketName}/{fileName}";
        }
    }
}
