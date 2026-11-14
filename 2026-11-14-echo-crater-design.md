# Thiết kế: Echo Crater

## Mục tiêu

Tạo một prototype browser game để nhóm thử ý tưởng căn cứ nghiên cứu ở cực Nam Mặt Trăng và dùng mã nguồn làm điểm bắt đầu cho repo NASA.

## Vòng chơi

Người chơi ở căn cứ an toàn, kiểm tra hệ thống và chuẩn bị oxy/pin trước khi qua khoang khí. Bên ngoài, người chơi di chuyển qua địa hình bụi đá tới tiền đồn cũ, thu hồi module lọc nước và sửa relay. Oxy, pin bộ đồ và nhiệt độ giảm trong chuyến đi; mang vật phẩm về khoang khí hoàn tất nhiệm vụ. Chạm mức nguy hiểm sẽ kết thúc chuyến đi và cho phép bắt đầu lại.

## Màn chơi và tương tác

- Canvas 2D top-down với hai khu vực: căn cứ module bên trong và địa hình Mặt Trăng bên ngoài.
- Bàn phím WASD/mũi tên; tương tác E; kho đồ I. Có nút cảm ứng cho màn hình nhỏ.
- HUD hiển thị khu vực, mục tiêu, oxy, pin, nhiệt và vật tư.
- Bảng căn cứ thể hiện trạng thái lọc nước/không khí, điện mặt trời, nhà kính, kho và hầm trú.
- Thông tin quan trọng dùng nhãn và biểu tượng; không dựa riêng vào màu.

## Hướng hình ảnh

HUD sci-fi tiết chế trên nền tối; cảnh chơi dùng tro, khoáng sáng, than và ánh vàng ấm trong căn cứ, tương phản với bề mặt lạnh và vắng. Hình khối dễ nhận biết, chữ đọc được, giảm chuyển động theo `prefers-reduced-motion`.

## Kiến trúc

- `game-core.mjs`: trạng thái và luật chơi thuần, độc lập DOM.
- `app.mjs`: input, Canvas render, HUD và lưu/khôi phục localStorage.
- `index.html`/`styles.css`: bố cục responsive và ngữ nghĩa truy cập.
- `tests/`: `node:test` cho chuyển vùng, tài nguyên, tương tác nhiệm vụ và thất bại.
- `server.mjs`: static server local, không dependency ngoài.

## Tiêu chí nghiệm thu

1. Trang local hiển thị cảnh căn cứ/HUD không lỗi JavaScript.
2. Nhân vật di chuyển, vật cản và vùng chuyển cảnh hoạt động.
3. Có thể ra ngoài, thu hồi module, sửa relay và trở về giao nộp.
4. Oxy/pin/nhiệt có giới hạn, cảnh báo và điều kiện thất bại.
5. Có thể reset hoặc khôi phục sau tải lại; bố cục chạy ở desktop và màn hình hẹp.
6. Unit test và browser smoke test cho luồng chơi chính.

## Giới hạn và rủi ro

Đây là prototype vòng chơi, không phải mô phỏng khoa học chính xác. Chưa có co-op, AI, backend, âm thanh hoặc nhiều nhiệm vụ. Tiến trình lưu trên trình duyệt bằng localStorage.
