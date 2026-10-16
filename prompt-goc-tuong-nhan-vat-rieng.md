# "Oan ức lắm luôn á": kịch bản khóa cứng, dùng nhân vật riêng của bạn

## 0. Ảnh nhân vật đã cắt sẵn (thư mục `nhan-vat/`)
| File | Dùng làm |
|---|---|
| `nhan-vat/me-mat-can.png` | Khuôn mặt mẹ |
| `nhan-vat/me-chinh-dien.png` | Toàn thân / trang phục mẹ |
| `nhan-vat/be-mat-can.png` | Khuôn mặt bé |
| `nhan-vat/be-chinh-dien.png` | Toàn thân / trang phục bé |

Lý do cắt: ảnh "character sheet" có nhiều tư thế và có chữ (FRONT, BACK…). Đưa cả tấm vào, Veo dễ bị rối hoặc vẽ cả chữ vào video. Ảnh cắt riêng từng người thì Veo giữ mặt tốt hơn.

---

## 1. Kịch bản khóa cứng (giống y video gốc, 17 giây)
**Bố cục:** Mẹ tự quay selfie bằng điện thoại cầm tay, khung dọc. **Mẹ ở tiền cảnh bên trái**, lấy từ ngực trở lên. **Bé đứng úp mặt vào góc tường bên phải.** Tường sơn hiệu ứng màu be ấm, phía trên có mép bức tranh sơn dầu khung vàng.

| Giây | Hành động | Thoại |
|---|---|---|
| 0–2,5 | Bé úp mặt vào tường, nghiêng mặt mếu máo. Mẹ nhắm mắt, mỉm cười thản nhiên | **Bé:** Con sai thì nói một lần thôi, con biết mà. |
| 2,5–4,5 | Mẹ mở mắt, khua tay nhẹ, giọng trêu | **Mẹ:** Đã ai làm gì đâu, đã ai chửi gì đâu? |
| 4,5–7,5 | Bé quay đầu nhìn mẹ, một tay áp lên tường, mếu | **Bé:** Đang đây cứ chửi hoài vậy, chửi từ sáng tới chiều luôn! |
| 7,5–9,5 | Bé dỗi, quay mặt vào tường | **Bé:** Khổ tâm lắm luôn á! |
| 9,5–11 | Mẹ với tay kéo bé lại | **Mẹ:** Mẹ thương á. |
| 11–14,5 | Mẹ ôm bé, má bé sát mặt mẹ, bé mếu nhìn mẹ | **Bé:** Thế mà bảo yêu... |
| 14,5–17 | Mẹ bật cười to, bé vẫn phụng phịu trong lòng mẹ | *(tiếng mẹ cười)* |

Chia làm 2 cảnh: **Cảnh 1 = 0–8 giây**, **Cảnh 2 = 8–16 giây**.

---

## 2. Cách tạo để GIỮ NGUYÊN MẶT (Google Flow)

### Cách A (khuyên dùng): Tạo ảnh khung đầu, rồi dùng Frames to Video
1. **Tạo ảnh khung đầu:** Trong Flow, chọn **tạo ảnh** (Nano Banana / Imagen). Nếu dùng Gemini app thì tải 4 ảnh nhân vật lên. Dán **Prompt ảnh khung đầu** (mục 3).
2. Tạo vài lần, chọn ảnh nào **mặt giống nhân vật nhất**.
3. **Cảnh 1:** Chọn **Frames to Video**, tải ảnh vừa chọn vào **khung đầu**, dán **Prompt Cảnh 1**.
4. **Cảnh 2:** Lấy **khung hình cuối của Cảnh 1** → **Frames to Video** → dán **Prompt Cảnh 2**.
5. Ghép 2 clip sát nhau (Scenebuilder hoặc CapCut), không dùng hiệu ứng chuyển cảnh.

### Cách B: Ingredients to Video (Veo 3.1)
1. Chọn **Ingredients to Video**.
2. Tải lên `me-mat-can.png`, `be-mat-can.png` và `be-chinh-dien.png` (tối đa 3 ảnh).
3. Dán **Prompt Cảnh 1**, rồi dán **Prompt Cảnh 2** với cùng bộ ảnh.
4. Cách này nhanh hơn nhưng bố cục giữa 2 cảnh dễ lệch hơn Cách A.

> Nếu Veo **từ chối ảnh có trẻ em**, dùng Cách A nhưng tạo ảnh khung đầu trong **Gemini app (Nano Banana)**, rồi đưa ảnh đó vào Flow.

---

## 3. Prompt ảnh khung đầu (dùng kèm ảnh nhân vật)
```
Use the uploaded reference photos: keep the woman's face and the little girl's face exactly the same as in the references, same hairstyles and same outfits.

Vertical 9:16 photo, 4K, ultra-sharp, photorealistic, smartphone front-camera selfie look, soft warm indoor lighting.
A corner of a cozy home with a warm beige textured plaster wall; the bottom edge of a gold-framed colorful oil painting is visible at the top of the frame.
LEFT FOREGROUND: the woman from the reference (shoulder-length wavy chestnut-brown hair, cream linen button-up shirt with rolled sleeves), framed from the chest up, holding the phone to film herself, eyes closed, calm amused little smile.
RIGHT SIDE: the little girl from the reference (brown hair in a small top bun with a strawberry hair tie, wispy bangs, pastel yellow knit cardigan with wooden buttons over a white floral dress with a white eyelet lace collar) standing in the corner facing the wall, her face turned slightly sideways, pouting.
No text, no watermark.
```

## 4. Prompt CẢNH 1 (0–8 giây)
```
Keep the exact same faces, hairstyles, outfits, room and framing as the start frame / reference images. Do not change any face.
A wholesome, funny family moment. Vertical 9:16, 4K ultra-sharp, photorealistic, natural skin texture, smartphone front-camera selfie video, handheld with slight natural movement, soft warm indoor lighting.

SETTING: a corner of a cozy home, a warm beige textured plaster wall, the bottom edge of a gold-framed colorful oil painting visible at the top of the frame.

CHARACTERS:
- MOM: young East Asian woman, shoulder-length wavy chestnut-brown hair with face-framing layers, soft natural makeup with rosy lips, cream linen button-up shirt with rolled sleeves. Left foreground, filming herself, framed from the chest up.
- BÉ: her little daughter, brown hair in a small top bun with a strawberry hair tie, wispy bangs, pastel yellow knit cardigan with wooden buttons over a white floral dress with a white eyelet lace collar. She stands in the corner on the right side, facing the wall, in a playful time-out.

ACTION & DIALOGUE (spoken in Vietnamese):
0–2.5s: Bé faces the wall, turns her face slightly sideways, pouting, and says in a whiny, cute child voice: "Con sai thì nói một lần thôi, con biết mà."
Mom keeps her eyes closed with a calm, amused little smile.
2.5–4.5s: Mom opens her eyes, waves one hand casually and says in a teasing, innocent tone: "Đã ai làm gì đâu, đã ai chửi gì đâu?"
4.5–8s: Bé turns her head to look at Mom, pouting, one little hand on the wall, and complains dramatically: "Đang đây cứ chửi hoài vậy, chửi từ sáng tới chiều luôn! Khổ tâm lắm luôn á!" Mom presses her lips together, trying not to laugh.

STYLE: heartwarming, funny, candid home video feel, realistic expressions, no text, no subtitles, no watermark.
AUDIO: clear Vietnamese dialogue, whiny cute child voice for Bé, soft teasing female voice for Mom, quiet indoor ambience, no music.
```

## 5. Prompt CẢNH 2 (8–16 giây)
```
Keep the exact same faces, hairstyles, outfits, room and framing as the start frame / reference images. Do not change any face. Direct continuation of the previous shot.
A wholesome, funny family moment. Vertical 9:16, 4K ultra-sharp, photorealistic, natural skin texture, smartphone front-camera selfie video, handheld with slight natural movement, soft warm indoor lighting.

SETTING: a corner of a cozy home, a warm beige textured plaster wall, the bottom edge of a gold-framed colorful oil painting visible at the top of the frame.

CHARACTERS:
- MOM: young East Asian woman, shoulder-length wavy chestnut-brown hair with face-framing layers, soft natural makeup with rosy lips, cream linen button-up shirt with rolled sleeves. Left foreground, filming herself, framed from the chest up.
- BÉ: her little daughter, brown hair in a small top bun with a strawberry hair tie, wispy bangs, pastel yellow knit cardigan with wooden buttons over a white floral dress with a white eyelet lace collar.

ACTION & DIALOGUE (spoken in Vietnamese):
0–2s: Bé is still standing by the wall, sulking. Mom reaches out and gently pulls her closer, saying softly and lovingly: "Mẹ thương á."
2–5s: Mom hugs Bé warmly; Bé is now close to the camera, her cheek next to Mom's face, still pouting with a trembling lip, looks up at Mom and says in a whiny, hurt little voice: "Thế mà bảo yêu..."
5–8s: Mom bursts out laughing loudly with a big smile and squinting eyes, while Bé keeps pouting in her arms, looking at Mom.

STYLE: heartwarming, funny, candid home video feel, realistic expressions, no text, no subtitles, no watermark.
AUDIO: clear Vietnamese dialogue, same whiny cute child voice for Bé, same soft female voice for Mom, genuine warm laughter at the end, quiet indoor ambience, no music.
```
