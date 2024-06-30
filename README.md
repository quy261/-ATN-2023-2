1. Clone project về máy

2. Dùng Visual Studio Code mở folder bên trong có 3 thư mục frontend, backend và data

3.
- frontend: 
+ cd frontend
+ npm install
+ npm start

- backend: 
+ cd backend
+ npm install
+ npm start

- data:
+ import 9 file data vào database school trên local của mongodb

4. Kịch bản giới thiệu hệ thống

- Landing page: Giới thiệu vài thông tin về trung tâm

- Đăng nhập: Chọn 1 trong 3 role để đăng nhập, nếu là: Quản trị viên (Quản trị viên, Kế toán), Giáo viên/Trợ giảng và Học sinh

- Tài khoản đăng nhập: Dùng email của các đối tượng trong CSDL để đăng nhập, mật khẩu mặc định là 123456, các tài khoản test: 
+ QTV: admin1@admin.com
+ Kế toán: nv1@nv.com
+ Giáo viên: nguyenvanc@example.com
+ Trợ giảng: nguyenthilan@example.com
+ Học sinh: huongnguyen@example.com

- Admin:
+ Dashboard: Hiển thị một số thông tin thống kê về trung tâm, doanh thu và lịch học trong ngày nếu có
+ Quản lý lớp học: Xem danh sách, xem chi tiết, thêm, sửa, xóa lớp học
+ Quản lý giáo viên: Xem danh sách, xem chi tiết, thêm, sửa, xóa giáo viên
+ Quản lý trợ giảng: Xem danh sách, xem chi tiết, thêm, sửa, xóa trợ giảng
+ Quản lý học sinh: Xem danh sách, xem chi tiết, thêm, sửa, xóa học sinh
+ Quản lý phòng học: Xem danh sách, xem chi tiết, thêm, sửa, xóa phòng học
+ Quản lý lịch học: Xem danh sách, xem chi tiết, thêm, sửa, xóa lịch học
+ Quản lý tài khoản quản trị: Xem danh sách, thêm, xóa (chỉ xóa kế toán) tài khoản quản trị
+ Xem thông tin tài khoản, đổi mật khẩu
+ Đăng xuất

- Kế toán:
+ Dashboard: giống Admin
+ Quản lý lớp học: Xem danh sách, xem chi tiết lớp học
+ Quản lý giáo viên: Xem danh sách, xem chi tiết giáo viên
+ Quản lý trợ giảng: Xem danh sách, xem chi tiết trợ giảng
+ Quản lý học sinh: Xem danh sách, xem chi tiết học sinh
+ Quản lý doanh thu: Xem danh sách các khoản thu/chi, thêm khoản thu (học phí), khoản chi (lương)
+ Quản lý lịch học: Xem danh sách, xem chi tiết lịch học
+ Quản lý tài khoản quản trị: Xem danh sách tài khoản quản trị
+ Xem thông tin tài khoản, đổi mật khẩu
+ Đăng xuất

- Giáo viên/Trợ giảng:
+ Dashboard: Các thông tin liên quan đến giáo viên/trợ giảng: Thông tin cá nhân, lương, lịch giảng dạy/trợ giảng
+ Danh sách lớp học: Xem danh sách, xem chi tiết lớp học, thêm nhận xét đối với học sinh
+ Danh sách giáo viên: Xem danh sách, xem chi tiết giáo viên
+ Danh sách trợ giảng: Xem danh sách, xem chi tiết trợ giảng
+ Danh sách lịch dạy: Xem danh sách, xem chi tiết lịch dạy, thêm thông tin buổi học, điểm danh
+ Xem thông tin tài khoản, đổi mật khẩu
+ Đăng xuất

- Học sinh:
+ Dashboard: Các thông tin liên quan đến học sinh: Thông tin cá nhân, học phí, lịch học
+ Danh sách lớp học: Xem danh sách, xem chi tiết lớp học
+ Danh sách giáo viên: Xem danh sách, xem chi tiết giáo viên
+ Danh sách trợ giảng: Xem danh sách, xem chi tiết trợ giảng
+ Danh sách lịch học: Xem danh sách, xem chi tiết lịch học, xin/hủy xin nghỉ học
+ Xem thông tin tài khoản, đổi mật khẩu
+ Đăng xuất
# -ATN-2023-2
