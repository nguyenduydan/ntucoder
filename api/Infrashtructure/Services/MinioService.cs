using Minio;
using Minio.DataModel.Args;

namespace api.Infrashtructure.Services
{
    public class MinioService: IMinioService
    {
        private readonly IMinioClient _minioClient;

        public MinioService()
        {
            _minioClient = new MinioClient()
                .WithEndpoint("localhost:9000")  // Địa chỉ MinIO
                .WithCredentials("DqcCzm99tXrLHxwn2b1l", "5wf7RjMpQBW638RFsZZikQmfE76nj2UgKWkip0n2")  // Thông tin người dùng root của MinIO
                .Build();
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string bucketName)
        {
            // Kiểm tra xem bucket đã tồn tại chưa
            var bucketExistsArgs = new BucketExistsArgs().WithBucket(bucketName); // Sử dụng BucketExistsArgs
            bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs);

            if (!found)
            {
                // Tạo bucket nếu chưa tồn tại
                var makeBucketArgs = new MakeBucketArgs().WithBucket(bucketName); // Sử dụng MakeBucketArgs
                await _minioClient.MakeBucketAsync(makeBucketArgs);
            }

            // Tải tệp lên MinIO
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucketName)  // Sử dụng bucketName nhập vào thay vì _bucketName
                .WithObject(fileName)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length);

            await _minioClient.PutObjectAsync(putObjectArgs);

            // Trả về URL công khai của tệp tin
            return $"http://localhost:9000/{bucketName}/{fileName}";  // Sử dụng bucketName nhập vào
        }


    }
}
