# Handoff

## Trạng thái

- Prototype browser game Lunar Shift theo brief Drive.
- Có vòng 10 ca, 4 phi hành gia, 5 action, 5 event, dự báo, delayed harvest, lesson, replay, win/loss.
- Tài liệu Drive gồm brief DOCX, PDF phân việc và XLSX Game Contract/QA đã được đối chiếu; bản trích xuất tạm nằm trong `work/`.
- Chạy local; không đụng repo, tài khoản, GitHub hay deploy. Người dùng tự chép/push.

## Quyết định

- Core logic vanilla JS module, deterministic theo seed; Node built-in test.
- 10 shift là đơn vị gameplay, không gọi là 10 ngày Mặt Trăng.
- DONKI là archive; chưa xác minh record cụ thể, không tạo ID/timestamp giả.
- Chỉ số 0–100 là simulation units, không phải measurement NASA.
- Greenhouse thu hoạch sau 2 ca; forecast chỉ resolve sau lần xác nhận thứ hai.

## Workflow và kỹ năng

- Superpowers: brainstorming, TDD và verification áp dụng.
- Claude-Mem: không áp dụng trong Codex; workspace không có repo/git history.
- Agent Skills: tiếng Việt và UI/UX Pro Max áp dụng; điều phối agent không khả dụng.
- RTK: dùng cho lệnh có wrapper; patch UTF-8 truyền qua Node do PowerShell phá newline.
- UI/UX Pro Max: dùng HUD navy/cyan/cam, responsive, reduced motion.
- Impeccable/Hallmark: không có skill khả dụng; dùng UI/UX Pro Max tạm thời.

## Kiểm thử

- `npm test`: 12/12 pass, gồm đường thắng 10 ca và thất bại.
- `npm run check`: pass.
- HTTP server local trả 200 cho trang và asset sau khi sửa path guard Windows.
- Headless Edge/CDP: intro, start, chọn event, phân công, forecast lần một không resolve; lần hai mở lesson. 4 crew render, console rỗng, viewport 375px không tràn ngang.
- Path guard trả 403 cho traversal encoded và 404 cho file ngoài; asset hợp lệ trả 200.

## Rủi ro còn lại

- Đường thắng deterministic được core test xác nhận; cần playtest người thật để cân bằng.
- NASA evidence cần DEV3 xác minh record DONKI cụ thể theo brief trước khi nộp.
- Browser smoke dùng Edge headless/CDP; Computer Use/Orca UI không khả dụng trong phiên.
- Workspace không phải Git worktree; không có diff/commit/remote để review hay push. Người dùng cần chép `outputs/echo-crater/` vào repo đích khi sẵn sàng.
