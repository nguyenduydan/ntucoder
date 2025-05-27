# NTUCoder

NTUCoder là một hệ thống quản lý và luyện tập lập trình trực tuyến, hướng tới hỗ trợ sinh viên và các lập trình viên rèn luyện kỹ năng giải bài tập lập trình, tham gia các khóa học, bài thi và quản lý tiến trình học tập.

## 🏗️ Tổng quan

- **Chức năng chính:**
  - Quản lý khóa học lập trình (Course)    
  - Quản lý bài tập lập trình (Problem)
  - Quản lý tài khoản lập trình viên (Coder)
  - Hệ thống khóa học, chủ đề, bài học và danh mục
  - Theo dõi tiến trình học tập và thành tích
  - Tích hợp hệ thống chấm bài tự động, badge, bảng xếp hạng
  - Quản trị vai trò người dùng, quản lý nhãn (badge), bài blog, bình luận...

- **Công nghệ:**
  - Backend: ASP.NET Core, Entity Framework Core, Minio, JWT, Oauth2
  - Frontend: ReactJS + Vite, ChakraUI
  - Database: MySQL

## 📁 Cấu trúc thư mục

```
api/                # Backend API
  ├─ Infrashtructure/Repositories/  # Các repository thao tác dữ liệu (Problem, Coder, Course, ...)
  ├─ Models/                       # Định nghĩa các model và context EF
  └─ ...                          
front-end/           # Giao diện ReactJS
  └─ src/views/      # Các trang giao diện (admin, user, ...)
```

## 🚀 Hướng dẫn cài đặt

### Backend

1. Cài đặt .NET 7 SDK và SQL Server.
2. Clone repo và chuyển vào thư mục `api/`
3. Cấu hình chuỗi kết nối database trong `appsettings.json`
4. Chạy lệnh:
    ```bash
    dotnet ef database update
    dotnet run
    ```
5. (Tùy chọn) Thiết lập Minio/Cloud Storage để lưu trữ file.

### Frontend

1. Cài Node.js (>=16)
2. Chuyển vào thư mục `front-end/`
3. Chạy lệnh:
    ```bash
    npm install
    npm run dev
    ```
4. Truy cập giao diện tại `http://localhost:3000`

## 📝 Một số chức năng nổi bật

- Đăng ký tài khoản, đăng nhập, khôi phục mật khẩu
- Tìm kiếm, giải, tạo và quản lý bài tập
- Xem bảng xếp hạng, nhận huy hiệu (badge), theo dõi tiến trình học
- Tham gia khóa học, bài thi, xem blog, bình luận
- Phân quyền vai trò: Admin, User, ... 
- Quản trị hệ thống (admin dashboard)

## 💡 Đóng góp

Mọi đóng góp xây dựng hoặc báo lỗi xin gửi Pull Request hoặc Issue lên repo.

## 📬 Liên hệ

- Tác giả: nguyenduydan
- Email: [Liên hệ qua GitHub](https://github.com/nguyenduydan)

---

> Dự án vẫn đang trong quá trình phát triển.
```
