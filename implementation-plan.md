# Kế hoạch triển khai Echo Crater

## Phạm vi

- Game core thuần và unit test Node `node:test`.
- HTML/CSS/Canvas với căn cứ, khoang khí, địa hình bề mặt và trạm nghiên cứu cũ.
- HUD tiếng Việt, di chuyển phím/chạm, tương tác, kho đồ và quản lý tài nguyên.
- Nhiệm vụ khứ hồi, lưu tiến trình, static server local.

## Các lát triển khai

1. Viết test đỏ cho state khởi tạo, chuẩn bị, chuyển vùng, thu hồi thiết bị, giao nộp và cạn tài nguyên.
2. Cài đặt game core tối thiểu và xác nhận test xanh.
3. Dựng Canvas, hai khu vực, input bàn phím/chạm và HUD responsive.
4. Nối vòng nhiệm vụ, kho đồ, thông báo, lưu/khôi phục và reset.
5. Chạy unit tests, static check, server local và browser smoke test desktop/mobile; rà soát diff và cập nhật Handoff.

## Rủi ro

- Workspace không có repo Git; chỉ tạo thư mục output để người dùng tự push.
- Cần cân bằng thời gian/tài nguyên để chuyến đi khả thi nhưng vẫn có áp lực.
- Nếu browser automation không khả dụng, ghi rõ giới hạn kiểm thử runtime.
