# Cảnh 2: nối tiếp Cảnh 1 (giữ nguyên nhân vật)

## Vì sao 2 cảnh bị lệch
Cảnh 2 được tạo bằng text-to-video, tức là Veo vẽ lại từ đầu, nên ra người khác, phòng khác:
- Đèn dồn sang trái, kệ có cây trên nóc, thêm bàn trà phía trước.
- Mặt ba, mẹ, bé khác hẳn.
- Góc máy thấp và gần hơn.

Prompt chữ **không thể** giữ đúng khuôn mặt. Phải cho Veo **nhìn thấy Cảnh 1**.

## Cách làm (Google Flow) — chọn 1
1. **Extend (khuyên dùng):** Trong Flow, mở clip Cảnh 1 → bấm **Extend / Mở rộng** → dán prompt bên dưới.
2. **Frames to Video:** Tải ảnh `khung-hinh/canh1-khung-cuoi.png` (khung hình cuối của Cảnh 1) làm **khung bắt đầu** → dán prompt bên dưới.

Lưu ý: Khi đã có ảnh hoặc clip làm gốc, prompt **chỉ nên tả hành động**. Không tả lại ngoại hình, vì tả lại dễ làm Veo đổi mặt nhân vật.

## Prompt Cảnh 2 (dùng cho Extend hoặc Frames to Video)
```
Continue the exact same shot with the exact same people, clothes, room, lighting and camera framing. Do not change any face or outfit. Static camera, vertical 9:16, photorealistic, sharp 4K detail. Wholesome, family-friendly comedy.

Dad (left, glasses, olive-green sweater) loosens his hug and Dâu, the little girl in the yellow cardigan, sits in the middle of the sofa between Dad and Mom (right, cream linen shirt, white flower in her hair). Dâu stays in the center for the whole shot.

0–2s: Dâu crosses her arms, shakes her head, then raises one hand showing two fingers in a V sign toward Dad and says in a cute, bossy child's voice, in Vietnamese: "Không được! Phải 2 cái!"
2–4s: Mom turns to Dâu with raised eyebrows and an amused smile and asks in Vietnamese: "Sao Dâu được tới 2 cái?"
4–6s: Dâu turns to Mom, tilts her head and answers confidently in Vietnamese: "Tại Dâu nhỏ hơn mẹ, nên phải được nhiều hơn!"
6–8s: Dad and Mom look at each other and the whole family bursts out laughing together, "hahaha" — Dad laughs out loud, Mom covers her mouth laughing, Dâu giggles proudly in the middle.

Audio: clear Vietnamese dialogue, cheerful child voice, gentle female voice, genuine family laughter, quiet room ambience, no music. No text, no subtitles.
```
