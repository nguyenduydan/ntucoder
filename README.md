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
  - Frontend: <img src="https://vitejs.dev/logo.svg" alt="Vite" width="20"/> Vite + <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" alt="React" width="20"/> ReactJS, ChakraUI
  - Database: MySQL

## 🌐 Truy cập thử nghiệm

- Website: [https://ntucoder-nguyenduydans-projects.vercel.app/](https://ntucoder-nguyenduydans-projects.vercel.app/)

## 📁 Cấu trúc thư mục

```
NTUCoder/
│
├── api/                         # Backend API (ASP.NET Core)
│   ├── Controllers/             # Các controller xử lý HTTP request
│   ├── Infrashtructure/
│   │   ├── Repositories/        # Các repository thao tác dữ liệu (Problem, Coder, Course, ...)
│   │   └── ...                  # Các thành phần hạ tầng khác
│   ├── Models/                  # Định nghĩa các model, entity và DbContext cho EF Core
│   ├── DTOs/                    # Các Data Transfer Object (Request, Response)
│   ├── Services/                # Xử lý logic nghiệp vụ
│   ├── Helpers/                 # Các lớp tiện ích, helper
│   ├── Middleware/              # Các middleware cho pipeline ASP.NET Core
│   ├── appsettings.json         # File cấu hình ứng dụng
│   └── Program.cs, Startup.cs   # Điểm khởi tạo ứng dụng
│
├── front-end/                   # Frontend ReactJS (Vite)
│   ├── public/                  # Tài nguyên tĩnh (favicon, index.html, ...)
│   └── src/
│       ├── assets/              # Ảnh, icon, font, style tĩnh
│       ├── components/          # Các component dùng lại cho toàn app
│       ├── hooks/               # Custom React hooks
│       ├── layouts/             # Các layout dùng chung (MainLayout, AdminLayout, ...)
│       ├── pages/               # Các trang chính (CoursePage, ProblemPage, ...)
│       ├── routes/              # Định nghĩa route cho app
│       ├── services/            # Giao tiếp API, xử lý dữ liệu
│       ├── store/               # Quản lý state (Redux/Zustand, ...)
│       ├── theme/               # Tuỳ chỉnh giao diện ChakraUI, theme
│       └── views/               # Các view (giao diện) phân quyền (admin, user, ...)
│
├── README.md                    # File hướng dẫn (bạn đang đọc)
└── ...                          # Các tệp/thư mục khác (LICENSE, .gitignore, ...)
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

### ⚡️ Công nghệ Frontend

- <img src="https://vitejs.dev/logo.svg" alt="Vite" width="20"/> **Vite**: Công cụ build siêu nhanh cho frontend hiện đại.
- <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" alt="React" width="20"/> **ReactJS**: Thư viện xây dựng giao diện người dùng.
- ChakraUI: Thư viện UI hiện đại, dễ tuỳ biến.

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
