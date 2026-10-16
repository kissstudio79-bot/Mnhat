# Prompt Veo 3 sẵn dùng: "Oan ức lắm lun á" (tái dựng 1:1)

Nguồn: `kich-ban-tai-dung-1-1-oan-uc.md`. Ảnh nhân vật: thư mục `nhan-vat/`.

## Lời thoại
Lời thoại đã được chốt theo bản bạn tự nghe và gửi: "trạm", "bao", "Đằng đây". Các mốc giây và hành động lấy từ phân tích khung hình của video gốc.

## Quy trình (Google Flow)
1. **Ảnh khung đầu:**
   - Tạo ảnh bằng Prompt 0, kèm ảnh `me-mat-can.png`, `be-mat-can.png` và `be-chinh-dien.png`.
   - Chọn ảnh có mặt giống nhân vật nhất.
2. **Clip 1:** Dùng Frames to Video, đưa ảnh khung đầu vào, dán Prompt 1. Cắt clip còn **7,3 giây**.
3. **Clip 2:** Lấy **khung cuối** của Clip 1 làm khung đầu, dán Prompt 2. Cắt còn **5,9 giây**.
4. **Clip 3:** Lấy **khung cuối** của Clip 2 làm khung đầu, dán Prompt 3. Cắt còn **3,75 giây**.
5. **Ghép:** Ghép 3 clip sát nhau, không dùng hiệu ứng chuyển cảnh. Tổng dài khoảng 16,95 giây.

---

## Prompt 0: Ảnh khung đầu
```
Use the uploaded reference photos: keep the woman's face and the little girl's face exactly the same as in the references, same hairstyles, same outfits.
Vertical 9:16 photo, photorealistic, candid smartphone home-video still, eye-level, soft warm yellow indoor lighting.
Corner of a cozy room with a warm beige textured plaster wall; the bottom edge of a gold-framed colorful oil painting in the top-right corner of the frame.
LEFT EDGE: the woman (shoulder-length wavy chestnut-brown hair, cream linen button-up shirt) seated, partly cut off by the left frame edge, visible from the chest up, body turned three-quarters toward the right, head tilted toward the girl, eyes half-closed looking down at the girl, calm closed-lip smile, her left hand resting on her knee at the bottom of the frame.
RIGHT THIRD: the toddler girl (small top bun with a strawberry hair tie, pastel yellow knit cardigan over a white floral dress with lace collar) standing facing the wall in a time-out, her back and left shoulder toward the camera, head slightly lowered, arms hanging straight down, feet together, visible from head to calves.
No text, no watermark, no phone UI.
```

## Prompt 1: Clip 1 (giữ 7,3 giây)
```
Keep the exact same faces, hairstyles, outfits, room and framing as the start frame / reference images. Do not change any face.
Vertical 9:16, photorealistic, natural skin texture, candid handheld smartphone home video, eye-level, almost static medium close-up with slight natural hand shake, soft warm yellow indoor lighting, one continuous shot, no cuts.

SETTING: corner of a cozy room, warm beige textured plaster wall, bottom edge of a gold-framed colorful oil painting in the top-right corner of the frame.

CHARACTERS:
- MOM: young East Asian woman, shoulder-length wavy chestnut-brown hair, cream linen button-up shirt. Seated at the far LEFT edge of the frame, partly cut off, chest up, body turned three-quarters toward the right, head tilted toward the girl, left hand resting on her knee at the bottom of the frame.
- GIRL: toddler girl about 2-3 years old, small top bun with a strawberry hair tie, pastel yellow knit cardigan over a white floral dress with lace collar. Standing in the RIGHT third of the frame facing the wall in a time-out, back and left shoulder toward the camera, arms hanging down, feet together.

TIMELINE (Vietnamese dialogue, exact words, no extra words):
0.0-2.3s: Nobody moves. The girl, still facing the wall so her mouth is hidden, says fast in a high whiny toddler voice: "Con sai thì nói một lần thôi, con biết mà". Mom keeps her eyes half-closed, looking down at the girl, closed-lip smile, lips not moving.
2.3-4.1s: Mom lifts her head and speaks in a natural lower female voice, teasing and innocent: "Đã ai làm gì đâu, đã ai trạm vào đâu". At 2.5s her left hand quickly rises from her knee to an open flat palm facing the camera, fingers pointing up, beside the girl's waist, then slowly drifts up to chest height; eyebrows raised, wide innocent eyes. At 3.5s the girl glances slightly over her left shoulder.
4.1-4.4s: Short pause, Mom still holding her hand up, smiling.
4.4-7.3s: At 4.75s the girl turns her head over her left shoulder toward Mom and the camera, pouting, teary, and says in a high whiny voice that breaks into crying: "Đằng đây cứ chửi hoài vậy, chửi từ sáng tới chiều luôn". Mom closes her lips into a smile and slowly lowers her hand back to her knee by 5.0s. At 6.0s the girl's mouth opens in a cry and her eyes squeeze shut; from 6.5s to 7.25s she raises one hand and rubs her eye and nose, head down, shoulders hunched. Mom only smiles, head tilted toward her.

AUDIO: only the dialogue and quiet room tone, no music, no sound effects.
No text, no subtitles, no watermark, no phone UI.
```

## Prompt 2: Clip 2 (giữ 5,9 giây)
```
Keep the exact same faces, hairstyles, outfits, room and framing as the start frame / reference images. Do not change any face. Direct continuation of the previous shot, one continuous shot, no cuts.
Vertical 9:16, photorealistic, candid handheld smartphone home video, eye-level, soft warm yellow indoor lighting.

SETTING: same room corner, warm beige textured plaster wall, gold-framed oil painting edge in the top-right corner.

CHARACTERS:
- MOM: young East Asian woman, shoulder-length wavy chestnut-brown hair, cream linen button-up shirt, seated at the far LEFT edge of the frame, chest up.
- GIRL: toddler girl, small top bun with a strawberry hair tie, pastel yellow knit cardigan over a white floral dress, standing by the wall in the RIGHT third of the frame, body toward the wall, face turned toward the camera.

TIMELINE (Vietnamese dialogue, exact words, no extra words):
0.0-0.5s: The girl lowers her hand and stands straight, sulking. Nobody speaks.
0.5-2.0s: The girl, pouting with pushed-out lips, eyes looking down then straight ahead, says slowly in a drawn-out, choked, high toddler voice: "Khổ tâm lắm luôn á". Mom watches with a small closed-lip smile; at about 1.95s Mom closes her eyes, smiling, and reaches out her left hand, palm open, touching the girl's hip.
2.5-3.1s: Mom wraps her arm behind the girl's back, gently pulling her closer, and says softly and slowly in a low gentle voice: "Mẹ thương". The girl lowers her head and turns her body toward Mom.
3.2-4.0s: The girl quickly takes one or two small steps into Mom's lap, her back to the camera, whimpering. The camera pans left and moves closer, following her, slight motion blur.
4.2-5.4s: Close-up of both. The girl hugs Mom and buries her face in Mom's shoulder, sniffling; Mom's left hand rests on the girl's back; Mom looks at the camera with a contented closed-lip smile.
5.45-5.9s: The girl turns her face toward the camera, cheek pressed against Mom's cheek, red face, wet eyes, trembling lip, a small hiccup sob.

AUDIO: only the dialogue, soft toddler whimpers and sniffles, quiet room tone, no music.
No text, no subtitles, no watermark, no phone UI.
```

## Prompt 3: Clip 3 (giữ 3,75 giây)
```
Keep the exact same faces, hairstyles, outfits, room and framing as the start frame / reference images. Do not change any face. Direct continuation of the previous shot, one continuous shot, no cuts.
Vertical 9:16, photorealistic, candid handheld smartphone home video, stable close-up of two faces at eye level, slight natural hand shake, soft warm yellow indoor lighting, warm beige textured wall, gold-framed oil painting edge in the top-right corner.

CHARACTERS:
- MOM: young East Asian woman, shoulder-length wavy chestnut-brown hair, cream linen button-up shirt, on the LEFT of the frame, hugging the girl, her left hand on the girl's back.
- GIRL: toddler girl, small top bun with a strawberry hair tie, pastel yellow knit cardigan over a white floral dress, in Mom's arms on the RIGHT of the frame, cheek against Mom's cheek.

TIMELINE (Vietnamese dialogue, exact words, no extra words):
0.0-1.1s: The girl, frowning, red-faced, lip trembling, eyes glancing sideways then at the camera, says in a shaky, hurt, high toddler voice: "Thế mà bao yêu". Mom keeps a closed-lip smile with squinting eyes, looking at the camera, lips not moving.
1.1-1.7s: Short pause, a small breath in; both hold still.
1.8-3.3s: Mom bursts out laughing loudly: mouth wide open showing teeth, eyes squeezed shut, head tipping back slightly, shoulders shaking, in bursts of laughter. The girl keeps pouting, looking at the camera, not laughing.
3.5-3.75s: Mom's laughter fades into a big smile.

AUDIO: only the girl's line, a breath, then Mom's genuine loud laughter fading out, quiet room tone, no music.
No text, no subtitles, no watermark, no phone UI.
```

---

## Mẹo khi Veo làm sai
- **Veo thêm chữ hoặc nói thừa:** tạo lại. Có thể thêm `Speak only the quoted Vietnamese words.`
- **Bé nói khi đang quay mặt vào tường mà Veo cho bé quay ra:** thêm `The girl must stay facing the wall until 4.75s.`
- **Veo từ chối ảnh có trẻ em:** tạo ảnh khung đầu trong Gemini app (Nano Banana), rồi đưa ảnh đó vào Flow.
- **Khẩu hình lệch:** cắt chỉnh từng clip trong CapCut cho khớp mốc giây trong bảng timeline của `kich-ban-tai-dung-1-1-oan-uc.md`.
