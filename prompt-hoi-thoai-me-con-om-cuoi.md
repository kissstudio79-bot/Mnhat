# Prompt Veo 3: Hội thoại mẹ con (bé bị phạt, mẹ dỗ, hai mẹ con ôm nhau cười)

Lời thoại lấy đúng theo nội dung bạn gửi. Nhân vật dùng ảnh trong thư mục `nhan-vat/`.
Video gồm 2 clip, mỗi clip 8 giây, tổng 16 giây.

**Cách làm:**
1. Tạo ảnh khung đầu bằng Prompt 0, kèm ảnh nhân vật.
2. Clip 1: dùng Frames to Video với ảnh khung đầu, dán Prompt 1.
3. Clip 2: lấy khung cuối của Clip 1 làm khung đầu, dán Prompt 2.
4. Ghép 2 clip sát nhau.

> Veo đọc đúng chữ được viết trong prompt. Prompt đang giữ nguyên chữ **"trạm"** và **"bao"** như bạn gửi. Nếu bạn muốn bé và mẹ nói "chạm" hoặc "bảo", hãy sửa trong prompt.

## Prompt 0: Ảnh khung đầu
```
Use the uploaded reference photos: keep the woman's face and the little girl's face exactly the same as in the references, same hairstyles, same outfits.
Vertical 9:16 photo, photorealistic, candid smartphone home-video still, eye-level, soft warm yellow indoor lighting.
Corner of a cozy room with a warm beige textured plaster wall; the bottom edge of a gold-framed colorful oil painting in the top-right corner.
LEFT: the mom (shoulder-length wavy chestnut-brown hair, cream linen button-up shirt) seated, visible from the chest up, body turned toward the right, head tilted toward the girl, looking at her with a soft loving smile, hands resting on her knees.
RIGHT: the toddler girl (small top bun with a strawberry hair tie, pastel yellow knit cardigan over a white floral dress with lace collar) standing in a time-out facing the wall, her back toward the camera, face turned slightly sideways, teary and pouting, arms hanging down.
No text, no watermark.
```

## Prompt 1: Clip 1 (0–8 giây), bé vừa khóc vừa nói, mẹ đáp lại
```
Keep the exact same faces, hairstyles, outfits and room as the start frame / reference images. Do not change any face.
Vertical 9:16, 8 seconds, photorealistic, natural skin texture, candid handheld smartphone home video, eye-level medium close-up, almost static with slight natural hand shake, soft warm yellow indoor lighting, one continuous shot, no cuts.

SETTING: corner of a cozy room, warm beige textured plaster wall, gold-framed colorful oil painting edge in the top-right corner.

CHARACTERS:
- MOM: young East Asian woman, shoulder-length wavy chestnut-brown hair, cream linen button-up shirt, seated on the LEFT side of the frame, chest up, turned toward the girl.
- GIRL: toddler girl about 2-3 years old, small top bun with a strawberry hair tie, pastel yellow knit cardigan over a white floral dress with lace collar, standing on the RIGHT side facing the wall in a time-out.

TIMELINE (Vietnamese dialogue, say exactly these words, nothing else):
0.0-2.5s: The girl stands facing the wall, shoulders shaking as she cries, turns her face slightly sideways and says through sobs in a high, whiny toddler voice: "Con sai thì nói một lần thôi, con biết mà". Mom watches her tenderly with a soft smile.
2.5-4.3s: Mom leans slightly toward her, raises one open palm gently, and answers in a warm, soft, loving voice: "Đã ai làm gì đâu, đã ai trạm vào đâu".
4.3-8.0s: The girl turns her head over her shoulder toward Mom, tears on her cheeks, lips trembling, wipes her eye with one little hand and complains while crying: "Đằng đây cứ chửi hoài vậy, chửi từ sáng tới chiều luôn, khổ tâm lắm luôn á". Mom lowers her hand, her eyes full of love, pressing her lips together to hold back a tender smile.

AUDIO: clear Vietnamese dialogue only, the girl's voice cracking with soft sobs and sniffles, the mom's voice gentle and warm, quiet room tone, no music.
No text, no subtitles, no watermark.
```

## Prompt 2: Clip 2 (8–16 giây), mẹ dỗ, ôm nhau, cười lớn
```
Keep the exact same faces, hairstyles, outfits and room as the start frame / reference images. Do not change any face. Direct continuation of the previous shot, one continuous shot, no cuts.
Vertical 9:16, 8 seconds, photorealistic, candid handheld smartphone home video, eye-level, soft warm yellow indoor lighting, warm beige textured wall, gold-framed oil painting edge in the top-right corner.

CHARACTERS:
- MOM: young East Asian woman, shoulder-length wavy chestnut-brown hair, cream linen button-up shirt, seated on the LEFT side of the frame.
- GIRL: toddler girl, small top bun with a strawberry hair tie, pastel yellow knit cardigan over a white floral dress, standing by the wall on the RIGHT side, teary.

TIMELINE (Vietnamese dialogue, say exactly these words, nothing else):
0.0-2.0s: Mom opens her arms, gently pulls the girl toward her and says softly and lovingly: "Mẹ thương". The girl, still sniffling, turns and walks into Mom's arms. The camera slowly pans left and moves closer.
2.0-4.0s: Close-up of both faces. Mom hugs her tightly, one hand stroking her back; the girl rests her cheek against Mom's cheek, looks at the camera with wet eyes and a pouty trembling lip, and says in a sulky, hurt toddler voice: "Thế mà bao yêu".
4.0-8.0s: Mom bursts out laughing; the girl looks at her, her pout breaks and she starts giggling too. Both laugh loudly and happily together, mouths open, eyes squinting, hugging tight and swaying a little, cheeks pressed together.

AUDIO: clear Vietnamese dialogue, a last little sniffle, then loud, joyful laughter of both mom and toddler, quiet room tone, no music.
No text, no subtitles, no watermark.
```

## Khi Veo làm sai
- **Veo nói thừa chữ:** tạo lại và thêm câu `Speak only the quoted Vietnamese words.`
- **Veo từ chối ảnh có trẻ em:** tạo ảnh khung đầu trong Gemini app (Nano Banana), rồi đưa ảnh đó vào Flow.
- **Câu thoại ở Clip 1 bị cắt mất:** câu cuối dài, nên tách câu "khổ tâm lắm luôn á" sang đầu Clip 2 (0–1,5 giây) và lùi các mốc phía sau của Clip 2 thêm 1,5 giây.
