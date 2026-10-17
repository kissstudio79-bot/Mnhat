# Veo 3 Tool

Công cụ điều khiển Veo 3 / 3.1 tạo video qua **Gemini API** — CLI + giao diện web, không cần cài thư viện (Node 18+).

## Cài đặt
1. Lấy API key: <https://aistudio.google.com/apikey> (tạo video Veo cần bật thanh toán, tính phí theo giây video).
2. Chép `.env.example` thành `.env` và dán key vào, hoặc `export GEMINI_API_KEY=...`.

## Dùng
```bash
node veo3.js ui 8080                                   # giao diện web: http://localhost:8080
node veo3.js generate "Mèo cam chạy trên bãi biển" --ratio 9:16 --model veo3-fast
node veo3.js generate "Cô gái mỉm cười" --image anh.png   # ảnh → video
node veo3.js batch cac-canh-mau.json --concurrency 2   # hàng loạt (.json hoặc .txt, cảnh cách nhau bằng dòng ---)
```

| Tuỳ chọn | Giá trị |
|---|---|
| `--model` | `veo3` · `veo3-fast` · `veo3.1` · `veo3.1-fast` (hoặc tên model đầy đủ) |
| `--ratio` | `16:9` · `9:16` |
| `--res` | `720p` · `1080p` (1080p chỉ 8 giây) |
| `--duration` | `4` · `6` · `8` |
| `--negative`, `--seed`, `--name`, `--image`, `--last-frame` (3.1) | tuỳ chọn |

Video lưu ở `output/` (đổi bằng `VEO3_OUT`). Mỗi video mất ~1–3 phút. Prompt bị bộ lọc an toàn chặn sẽ báo lý do.

Mẹo: để nối nhiều cảnh khớp nhau, dùng `--last-frame`/`--image` hoặc dán lại khối mô tả nhân vật vào mọi cảnh (xem `huong-dan-flow-veo3-noi-canh.md`). Tên model/tham số có thể thay đổi theo Google — chạy `node veo3.js models` hoặc dùng tên model đầy đủ.
