## Flow

- Client gửi mail để reset -> server check mail có hợp lệ ko? => gửi mail + kèm theo link (password change token)
- Client check mail => click mail
- Client gửi api kèm token
- Check token có giống với token mà server gửi mail hay ko => nếu giống thì cho phép reset password

## gửi mail

- Phải có `app password` của mail google. Phải bật xác minh 2 bước trong phần bảo mật
- search `google app password`
- Tiến hành tạo `app password`: chọn mail, windows computer sau đó generate ra 1 mã và tạo trong file `.env`
