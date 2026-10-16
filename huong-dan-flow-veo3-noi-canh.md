# Hướng dẫn cho người mới: làm video Veo 3 nhiều cảnh khớp nhau trên Google Flow

## Ý tưởng chính
Veo 3 chỉ tạo **8 giây mỗi lần**. Muốn video dài 16–26 giây mà khớp nhau thì **không tạo từng cảnh riêng**, mà làm như sau:
1. Tạo **Cảnh 1** bằng chữ (Text to Video).
2. Dùng **Extend (Mở rộng)** để Veo **diễn tiếp từ khung hình cuối** của Cảnh 1. Veo nhìn thấy đúng người, đúng phòng nên không vẽ lại người khác.
3. Xuất ra **một video liền**.

> Giao diện Flow thay đổi khá thường xuyên. Nếu tên nút hơi khác, hãy tìm nút có ý nghĩa tương tự.

---

## BƯỚC 0: Vào Flow
1. Mở trình duyệt Chrome và vào **labs.google/flow**.
2. Đăng nhập bằng tài khoản Google có gói **AI Ultra**.
3. Bấm **New project (Dự án mới)**.

## BƯỚC 1: Cài đặt trước khi tạo
Tìm biểu tượng **bánh răng / Settings** cạnh ô nhập prompt:
- **Model:** chọn **Veo 3 – Quality** (đẹp nhất, có tiếng). Veo 3 Fast rẻ hơn, dùng để thử nháp.
- **Aspect ratio (Tỉ lệ):** chọn **9:16 (dọc)** để đăng TikTok/Reels.
- **Outputs per prompt (Số video mỗi lần):** chọn **2–4** để có nhiều bản mà chọn.

## BƯỚC 2: Tạo Cảnh 1
1. Ở ô chọn chế độ, chọn **Text to Video**.
2. Dán prompt Cảnh 1 (mục "Prompt mẫu" ở cuối file) rồi bấm **mũi tên Tạo**.
3. Chờ 1–3 phút. Xem các bản và **chọn bản đẹp nhất**: mặt rõ, đúng bố cục, đúng lời thoại.
4. Bản nào cũng chưa ưng thì sửa prompt một chút rồi tạo lại.

**Mẹo:** Bố cục, trang phục, ánh sáng của Cảnh 1 sẽ được giữ cho cả video, nên **hãy chọn Cảnh 1 thật kỹ**.

## BƯỚC 3: Đưa Cảnh 1 vào Scenebuilder
1. Rê chuột vào video vừa chọn.
2. Bấm **Add to scene (Thêm vào cảnh)**. Flow sẽ mở **Scenebuilder**, là thanh dòng thời gian (timeline) ở dưới.

## BƯỚC 4: Nối tiếp bằng Extend
1. Trong Scenebuilder, bấm nút **+** ngay sau clip Cảnh 1.
2. Chọn **Extend (Mở rộng)**.
   - Đừng chọn "Jump to", vì đó là nhảy sang cảnh khác.
3. Kiểm tra model vẫn là **Veo 3**.
4. Dán prompt Cảnh 2. Prompt này **chỉ tả hành động và lời thoại**, không tả lại khuôn mặt.
5. Bấm **Tạo**, chờ xong rồi xem lại. Không ưng thì bấm tạo lại.

**Cắt bớt đuôi:** Nếu cuối Cảnh 1 có đoạn thừa (ví dụ nhân vật đứng im), kéo **mép phải** của clip trên timeline vào để cắt bớt. Nên cắt **trước khi Extend**, vì Extend sẽ nối tiếp từ đúng điểm cuối.

## BƯỚC 5: Muốn dài hơn (cảnh 3, 4…)
Lặp lại Bước 4: bấm **+ → Extend** trên clip mới nhất. 3 lần Extend sẽ được khoảng 24–26 giây, giống video mẫu bạn gửi.

## BƯỚC 6: Xuất video
1. Trong Scenebuilder, bấm **Download / Tải xuống**.
2. Chọn bản tải **toàn bộ cảnh** (whole scene), độ phân giải cao nhất có (1080p, hoặc **Upscale** nếu có).
3. Muốn chỉnh màu hay thêm nhạc thì đưa file này vào CapCut.

---

## Nếu Extend bị lỗi, không có tiếng, hoặc không chọn được Veo 3
Dùng **Frames to Video** thay thế:
1. Tải Cảnh 1 về máy và lấy **khung hình cuối** (chụp màn hình khung cuối, hoặc trong CapCut xuất khung hình đó ra ảnh).
2. Trong Flow, chọn chế độ **Frames to Video**.
3. Bấm ô **First frame (Khung đầu)** và tải ảnh khung cuối lên.
4. Dán prompt Cảnh 2 rồi bấm **Tạo**.
5. Tải về rồi ghép 2 clip trong CapCut, đặt sát nhau, **không thêm hiệu ứng chuyển cảnh**.

---

## 7 nguyên tắc để các cảnh khớp như video mẫu
1. **Máy quay đứng yên** (ghi "static camera" trong prompt). Không zoom, không đổi góc.
2. **Phòng gọn, ánh sáng đều.** Càng ít đồ vật lộn xộn càng ít bị lệch.
3. **Nhân vật có đặc điểm nổi bật:** màu áo riêng, kẹp tóc, kính… Veo dễ giữ hơn.
4. **Prompt Extend chỉ tả hành động.** Tả lại khuôn mặt dễ làm Veo đổi người.
5. **Giọng nói tả giống nhau ở mọi cảnh** (ví dụ luôn ghi "cute bossy child voice") để giọng không bị đổi.
6. **Lời thoại nối tiếp nhau.** Câu đầu cảnh sau trả lời câu cuối cảnh trước.
7. **Không dồn quá nhiều hành động vào 8 giây:** tối đa 3–4 câu thoại ngắn.

---

## Prompt mẫu cho video "Dâu"

### Cảnh 1: Text to Video
(Đã có bản bạn ưng thì giữ nguyên, không cần tạo lại.)
```
A wholesome, family-friendly comedy moment. Vertical 9:16, 4K, cinematic photorealistic, sharp focus, soft warm indoor evening lighting, static camera, front-facing eye-level medium-wide shot showing the whole sofa.

SETTING: cozy living room in the evening. Three amber glass pendant lamps hanging at the top of the frame, warm beige wall, a dark walnut bookshelf centered behind the family, a framed picture on the left wall, green plants on both sides, an orange cushion on the left end of a cream fabric sofa.

CHARACTERS: DAD on the left, East Asian man in his mid-30s, short wavy dark-brown hair, thin metal-frame glasses, olive-green knit sweater, beige trousers. DÂU in the middle, their young daughter, hair in two small buns, soft yellow cardigan over a white floral dress with a white collar. MOM on the right, East Asian woman in her early 30s, shoulder-length wavy brown hair, a small white flower clip above her left ear, cream linen shirt and trousers.

ACTION & DIALOGUE (in Vietnamese):
0–2s: Dad gives Mom a quick sweet peck on the cheek; Mom smiles. Dâu watches, surprised, points at Mom and says in a cute bossy child voice: "Ba thơm mẹ..."
2–4s: Dâu points at herself, crosses her arms and pouts playfully: "...mà không thơm Dâu!"
4–6s: Dad laughs and turns to Dâu: "Ba thơm Dâu nè!"
6–8s: Dad gives Dâu a warm fatherly hug and a quick peck on the top of her head. Dâu keeps pouting, arms crossed.

Audio: clear Vietnamese dialogue, cute bossy child voice for Dâu, warm male voice for Dad, quiet room ambience, no music. No text, no subtitles.
```

### Cảnh 2: Extend (hoặc Frames to Video)
```
Continue the exact same shot with the exact same people, clothes, room, lighting and camera framing. Do not change any face or outfit. Static camera. Wholesome, family-friendly comedy.

Dad loosens his hug and Dâu sits in the middle of the sofa between Dad and Mom.

0–2s: Dâu crosses her arms, shakes her head, then raises one hand showing two fingers in a V sign toward Dad and says in the same cute bossy child voice, in Vietnamese: "Không được! Phải 2 cái!"
2–4s: Mom turns to Dâu with raised eyebrows and an amused smile and asks in Vietnamese: "Sao Dâu được tới 2 cái?"
4–6s: Dâu turns to Mom, tilts her head and answers confidently in Vietnamese: "Tại Dâu nhỏ hơn mẹ, nên phải được nhiều hơn!"
6–8s: Dad and Mom look at each other and the whole family bursts out laughing together, "hahaha".

Audio: same voices as before, clear Vietnamese dialogue, genuine family laughter, quiet room ambience, no music. No text, no subtitles.
```

## Lỗi thường gặp
| Lỗi | Cách xử lý |
|---|---|
| Báo vi phạm chính sách | Bỏ các chi tiết như hôn má bé hay tả cơ thể trẻ em; thêm "wholesome, family-friendly" |
| Nhân vật đổi mặt ở cảnh sau | Bạn đang dùng Text to Video. Chuyển sang **Extend** hoặc **Frames to Video** |
| Giọng bé đổi | Ghi y hệt mô tả giọng ở mọi cảnh, tạo lại 2–3 lần rồi chọn bản giống nhất |
| Nói sai tiếng Việt hoặc thiếu chữ | Rút ngắn câu thoại, mỗi câu dưới 10 chữ |
| Hết credit | Dùng Veo 3 Fast để thử, khi prompt đã ổn mới dùng Quality |
