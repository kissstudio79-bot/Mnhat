# 🏀 Bảng điểm bóng rổ livestream cho vMix

Bảng điểm bóng rổ **chuyên nghiệp**, nền trong suốt để phủ lên video trong vMix, **bấm điểm real-time** từ bảng điều khiển trên máy tính / điện thoại / tablet, hoặc điều khiển bằng **phím tắt vMix / Stream Deck** qua API HTTP.

Thiết kế bám theo mẫu: ô logo bên trái · panel **đội nhà** (nền trắng chữ xanh) · panel **đội khách** (nền xanh chữ vàng) · vạch **lỗi** vàng · dòng **Record (W–L)** · ô **hiệp** (1st/2nd/3rd/4th/OT) · **đồng hồ trận** trong viên thuốc trắng · **đồng hồ 24s** đỏ · **tên giải** phía dưới.

![Bảng điểm](docs/preview.png)

---

## 1. Yêu cầu

- **Node.js** (phiên bản 14 trở lên) — tải tại <https://nodejs.org> (bản LTS).
- vMix (bất kỳ bản nào có input **Web Browser**).
- Không cần cài thêm thư viện nào khác.

## 2. Chạy máy chủ

Mở Terminal / CMD tại thư mục dự án và chạy:

```bash
node server.js
```

Màn hình sẽ in ra các đường dẫn, ví dụ:

```
• Bảng điều khiển : http://localhost:8000/control
• Bảng điểm (vMix): http://localhost:8000/scoreboard
```

> Đổi cổng: `PORT=9000 node server.js` (Windows CMD: `set PORT=9000 && node server.js`).

## 3. Đưa bảng điểm vào vMix

1. Trong vMix: **Add Input → Web Browser**.
2. **URL**: `http://localhost:8000/scoreboard`
3. **Width 1920 – Height 1080**, bấm **OK**.
4. Kéo input này lên làm **Overlay** (hoặc lớp trên) — nền bảng điểm trong suốt nên chỉ hiện thanh điểm, phần còn lại xuyên thấu video.

Tinh chỉnh bằng tham số URL (tùy chọn):

| Tham số | Ý nghĩa | Ví dụ |
|---|---|---|
| `pos` | Vị trí `top` hoặc `bottom` | `/scoreboard?pos=top` |
| `scale` | Phóng to / thu nhỏ | `/scoreboard?scale=0.9` |
| `y` | Khoảng cách tới cạnh (px) | `/scoreboard?y=40` |

## 4. Bấm điểm (bảng điều khiển)

Mở `http://localhost:8000/control`:

- Trên **cùng máy chạy vMix**: mở bằng trình duyệt bất kỳ.
- Trên **điện thoại / tablet** (cùng Wi-Fi): dùng địa chỉ IP máy tính, ví dụ `http://192.168.1.10:8000/control` (địa chỉ IP được in ra khi khởi động server).

Chức năng:

- **+1 / +2 / +3** và **−1** cho mỗi đội.
- **Lỗi** (foul) +1 / −1 — vạch vàng sáng dần, đủ ngưỡng là “bonus”. Lỗi tự reset mỗi hiệp.
- **Đồng hồ trận**: Chạy/Dừng, Reset, ±1 giây, hoặc gõ `mm:ss` rồi **Đặt giờ**.
- **Đồng hồ 24s**: nút `24s`, `14s`, Chạy/Dừng, Ẩn/Hiện.
- **Hiệp**: ◀ ▶ chuyển hiệp (1st → 2nd → 3rd → 4th → OT…).
- **Ẩn / Hiện** cả bảng (hiệu ứng trượt), **Đổi bên**, **Trận mới**.
- **Cài đặt**: tên đội, màu nền & màu chữ, logo, số trận Thắng–Thua, tên giải, số hiệp, phút/hiệp, số vạch lỗi.

### Phím tắt (khi con trỏ không nằm trong ô nhập)

| Phím | Tác dụng |
|---|---|
| `Q` `W` `E` | Đội nhà +1 / +2 / +3 |
| `A` | Đội nhà −1 |
| `U` `I` `O` | Đội khách +1 / +2 / +3 |
| `J` | Đội khách −1 |
| `Space` | Chạy / dừng đồng hồ trận |
| `S` / `D` | Reset 24s / 14s |
| `F` | Chạy / dừng đồng hồ 24s |
| `[` / `]` | Lùi / tới hiệp |
| `H` | Ẩn / hiện bảng điểm |

## 5. Điều khiển bằng phím tắt vMix / Stream Deck (nâng cao)

Mọi thao tác đều là một URL HTTP `GET`, nên có thể kích hoạt từ vMix hoặc Stream Deck:

**Cách làm trong vMix:** tạo một input **Web Browser** ẩn (không lên hình). Tạo **Shortcut** → chức năng **Navigate** cho input đó, dán URL lệnh. Mỗi lần chạy shortcut, server nhận lệnh và cập nhật bảng điểm on-air ngay lập tức.

Ví dụ URL:

```
http://localhost:8000/cmd?action=score&team=home&points=2   → đội nhà +2
http://localhost:8000/cmd?action=score&team=away&points=3   → đội khách +3
http://localhost:8000/cmd?action=foul&team=home&delta=1     → lỗi đội nhà +1
http://localhost:8000/cmd?action=clock&op=toggle            → chạy/dừng đồng hồ
http://localhost:8000/cmd?action=shotclock&op=reset&value=24→ 24 giây
http://localhost:8000/cmd?action=period&delta=1             → sang hiệp kế
```

> Với Stream Deck: dùng action **Website** (hoặc **System → Open**) trỏ tới URL tương ứng cho từng nút.

## 6. Bảng lệnh API đầy đủ

Gọi `GET /cmd?...` (hoặc `POST /cmd` với JSON). `team` = `home` | `away`.

| action | Tham số | Mô tả |
|---|---|---|
| `score` | `team`, `points` (vd 2, -1) | Cộng/trừ điểm |
| `setScore` | `team`, `value` | Đặt điểm cụ thể |
| `foul` | `team`, `delta` | Cộng/trừ lỗi |
| `setFoul` | `team`, `value` | Đặt số lỗi |
| `win` / `loss` | `team`, `delta` | Cộng/trừ Thắng / Thua |
| `period` | `delta` hoặc `value` | Đổi hiệp (lỗi tự reset) |
| `clock` | `op=start\|stop\|toggle\|reset\|set\|adjust`, `value` | Đồng hồ trận (`value` dạng `mm:ss` hoặc giây) |
| `shotclock` | `op=start\|stop\|toggle\|reset\|set\|show\|hide`, `value` | Đồng hồ 24s |
| `set` | `path`, `value` | Đặt bất kỳ trường nào, vd `path=teams.home.name&value=Lakers`, `path=teams.away.color&value=%23ff0000`, `path=tournament&value=...` |
| `visible` | `value=true\|false\|toggle` | Ẩn / hiện bảng |
| `swap` | — | Đổi bên hai đội |
| `resetScores` | — | Xoá điểm & lỗi |
| `reset` | — | Trận mới (giữ nhận diện đội) |

Endpoint khác: `GET /state` (JSON trạng thái), `GET /events` (luồng SSE real-time).

## 7. Cấu trúc thư mục

```
server.js            Máy chủ Node (tĩnh + SSE + API) — không cần thư viện ngoài
public/
  index.html         Trang chọn (control / scoreboard)
  scoreboard.html    Bảng điểm on-air (thêm vào vMix)
  scoreboard.css/js  Giao diện & logic bảng điểm
  control.html       Bảng điều khiển
  control.css/js     Giao diện & logic điều khiển
  fonts.css          Font Oswald (kèm tiếng Việt) — nhúng nội bộ, chạy offline
  fonts/             File .woff2
```

## 8. Mẹo

- **Logo:** ô logo bên trái dùng logo **đội nhà**. Đặt đường dẫn ở mục *Cài đặt → Đội nhà → Logo (URL)*: có thể là link online hoặc bỏ file ảnh vào thư mục `public/` rồi dùng `/ten-file.png`.
- **Đổi màu đội** theo đúng nhận diện: chỉnh *Nền* và *Chữ* cho từng đội trong phần Cài đặt.
- Trạng thái lưu trong bộ nhớ server; **khởi động lại server** sẽ về mặc định (0–0, 10:00).
- Đồng hồ chạy **mượt** vì tính theo mốc thời gian của server — nhiều máy xem vẫn khớp nhau.
