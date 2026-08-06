# 🏀 Bảng điểm bóng rổ (layout nghiêng) cho vMix & OBS

Bảng điểm bóng rổ dùng cho livestream — nền trong suốt để phủ lên video trong **OBS hoặc vMix**, **bấm điểm real-time** từ máy tính / điện thoại / tablet, hoặc điều khiển bằng **phím tắt vMix / Stream Deck** qua API HTTP.

Đúng theo layout mẫu (thanh nghiêng góc dưới‑trái):

- Hàng trên: **nhãn (U16)** · **tên giải (INVITATION CUP)** · **thời gian** — tất cả đổi được.
- 2 hàng đội: **chip màu** (chọn theo màu áo) · **ô đen tên đội** · **điểm** · **Fouls**.

![Bảng điểm](docs/preview.png)

---

## 1. Yêu cầu

- **Node.js** (14 trở lên) — tải tại <https://nodejs.org> (bản LTS).
- **OBS** (nguồn *Browser*) **hoặc vMix** (input *Web Browser*).
- Không cần cài thêm thư viện nào khác.

## 2. Chạy máy chủ

**Cách dễ nhất:** bấm đúp **`start.bat`** (Windows) hoặc **`start.command`** (macOS). Giữ cửa sổ đó mở suốt buổi live.

Hoặc mở Terminal / CMD tại thư mục dự án:

```bash
node server.js
```

Sẽ in ra:

```
• Bảng điều khiển : http://localhost:8000/control
• Bảng điểm (OBS) : http://localhost:8000/scoreboard
```

> Đổi cổng: `PORT=9000 node server.js` (Windows CMD: `set PORT=9000 && node server.js`).

## 3. Đưa bảng điểm vào OBS hoặc vMix

**OBS:** Sources **+ → Browser** → **URL** `http://localhost:8000/scoreboard` → **Width 1920 / Height 1080** → bỏ tick *"Shutdown source when not visible"* → **OK**. Nền trong suốt sẵn (bảng nằm góc dưới‑trái).

**vMix:** **Add Input → Web Browser** → URL như trên → **1920 × 1080** → kéo lên Overlay.

Tinh chỉnh bằng tham số URL (thêm vào cuối URL):

| Tham số | Ý nghĩa | Ví dụ |
|---|---|---|
| `scale` | Phóng to / thu nhỏ | `/scoreboard?scale=1.1` |
| `x` | Cách cạnh trái (px) | `/scoreboard?x=80` |
| `y` | Cách cạnh dưới (px) | `/scoreboard?y=90` |

## 4. Bấm điểm (bảng điều khiển)

Mở `http://localhost:8000/control` — trên **máy chạy OBS**, hoặc trên **điện thoại/tablet** cùng Wi‑Fi (dùng địa chỉ IP in trong cửa sổ đen, ví dụ `http://192.168.1.10:8000/control`).

- **Điểm:** +1 / +2 / +3 và −1 để sửa.
- **Fouls:** +1 / −1 cho mỗi đội.
- **Thời gian:** Chạy/Dừng, Reset, ±1 giây, hoặc gõ `mm:ss` rồi **Đặt giờ**.
- **Ẩn/Hiện bảng**, **Đổi bên**, **Trận mới**.
- **Cài đặt:** tên đội (ô đen), **màu chip** (theo màu áo), **nhãn** (U16…), **tên giải** (INVITATION CUP…), phút/trận.

### Phím tắt (khi con trỏ không nằm trong ô nhập)

| Phím | Tác dụng |
|---|---|
| `Q` / `W` / `E` | Đội 1 +1 / +2 / +3 |
| `A` · `Z` | Đội 1 −1 · Đội 1 foul +1 |
| `U` / `I` / `O` | Đội 2 +1 / +2 / +3 |
| `K` · `M` | Đội 2 −1 · Đội 2 foul +1 |
| `Space` · `R` | Chạy/dừng đồng hồ · reset đồng hồ |
| `H` | Ẩn / hiện bảng |

## 5. Điều khiển bằng vMix / Stream Deck (nâng cao)

Mọi thao tác là một URL HTTP `GET`. Trong vMix tạo input **Web Browser** ẩn rồi dùng shortcut **Navigate** tới URL; Stream Deck dùng action **Website**.

```
http://localhost:8000/cmd?action=score&team=home&points=2   → đội 1 +2
http://localhost:8000/cmd?action=foul&team=away&delta=1     → foul đội 2 +1
http://localhost:8000/cmd?action=clock&op=toggle            → chạy/dừng đồng hồ
http://localhost:8000/cmd?action=clock&op=set&value=10:00   → đặt giờ 10:00
```

## 6. Bảng lệnh API

Gọi `GET /cmd?...` (hoặc `POST /cmd` JSON). `team` = `home` (đội 1 / hàng trên) | `away` (đội 2 / hàng dưới).

| action | Tham số | Mô tả |
|---|---|---|
| `score` | `team`, `points` (1, 2, 3, -1) | Cộng/trừ điểm |
| `setScore` | `team`, `value` | Đặt điểm cụ thể |
| `foul` | `team`, `delta` | Cộng/trừ foul |
| `setFoul` | `team`, `value` | Đặt số foul |
| `clock` | `op=start\|stop\|toggle\|reset\|set\|adjust`, `value` | Thời gian (`value` = `mm:ss` hoặc giây) |
| `set` | `path`, `value` | Đặt trường bất kỳ: `category`, `tournament`, `teams.home.name`, `teams.away.color`, `periodMinutes` |
| `visible` | `value=true\|false\|toggle` | Ẩn / hiện bảng |
| `swap` | — | Đổi bên hai đội |
| `resetScores` | — | Xoá điểm & foul |
| `reset` | — | Trận mới (giữ tên & màu đội) |

Khác: `GET /state` (JSON), `GET /events` (SSE real-time).

## 7. Cấu trúc thư mục

```
server.js            Máy chủ Node (tĩnh + SSE + API) — không cần thư viện ngoài
start.bat / .command Bấm đúp để chạy (Windows / macOS)
public/
  index.html         Trang chọn (control / scoreboard)
  scoreboard.*       Bảng điểm on-air (thêm vào OBS/vMix)
  control.*          Bảng điều khiển bấm điểm
  fonts.css, fonts/  Font Oswald (kèm tiếng Việt) — nhúng nội bộ, chạy offline
```

## 8. Mẹo

- Trạng thái lưu trong bộ nhớ server; **khởi động lại** sẽ về mặc định (0–0, 10:00).
- Đồng hồ chạy **mượt** vì tính theo mốc thời gian server — nhiều máy xem vẫn khớp.
- Bộ này chạy **offline ngay trên máy bạn**, không hết hạn, không tài khoản, không phí.
