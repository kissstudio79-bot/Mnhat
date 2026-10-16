# Câu lệnh mẫu: nhờ Claude xem video và viết lại kịch bản giống 100%

## Cách dùng
1. Đính kèm **video gốc** (và **ảnh nhân vật** của bạn nếu có).
2. Copy câu lệnh bên dưới và sửa các chỗ trong **[ngoặc vuông]**.
3. Gửi đi.

> Lưu ý: Claude Code (môi trường bạn đang dùng) xem được video, tức là cả hình lẫn tiếng. Một số giao diện chat khác của Claude chỉ nhận ảnh. Khi đó, bạn phải gửi ảnh chụp màn hình từng đoạn và tự gõ lời thoại.

---

## CÂU LỆNH MẪU (copy toàn bộ)

```
Xem video tôi gửi (cả hình ảnh lẫn âm thanh) và làm theo đúng các bước sau:

BƯỚC 1 – PHÂN TÍCH VIDEO GỐC
- Xem từng giây: trích khung hình dày (ít nhất 2 khung/giây) và tách lời thoại từ âm thanh có mốc thời gian.
- Phát hiện các chỗ cắt cảnh hoặc chỗ nối (nếu có).
- Mô tả bối cảnh: địa điểm, đồ vật, màu tường, ánh sáng, thời điểm trong ngày.
- Mô tả máy quay: tỉ lệ khung, góc máy, cỡ cảnh, máy đứng yên hay cầm tay/selfie, có di chuyển không.
- Mô tả từng nhân vật: vị trí trong khung (trái/giữa/phải, tiền cảnh/hậu cảnh), tư thế (đứng/ngồi), trang phục, kiểu tóc, biểu cảm.
- Lập bảng diễn biến theo từng giây: Thời gian | Hành động & biểu cảm từng người | Ai nói | Lời thoại nguyên văn.
- Đánh dấu chỗ nào nghe không rõ hoặc không chắc ai nói, để tôi tự kiểm tra.

BƯỚC 2 – KỊCH BẢN KHÓA CỨNG
- Giữ đúng 100% lời thoại, thứ tự hành động, bố cục, vị trí nhân vật và nhịp thời gian của video gốc.
- Chia thành các cảnh, mỗi cảnh tối đa 8 giây (giới hạn của Veo 3), cắt ở chỗ tự nhiên nhất.

BƯỚC 3 – NHÂN VẬT CỦA TÔI
[Chọn 1 trong 2 dòng dưới, xóa dòng còn lại]
- Thay nhân vật gốc bằng nhân vật trong ảnh tôi gửi: [ảnh 1 = mẹ, ảnh 2 = bé]. Giữ nguyên khuôn mặt, kiểu tóc, trang phục trong ảnh. Nếu ảnh là character sheet nhiều góc, hãy cắt riêng ảnh mặt và ảnh toàn thân cho tôi để làm ảnh tham chiếu.
- Giữ nguyên nhân vật như video gốc.

BƯỚC 4 – VIẾT PROMPT CHO VEO 3 (Google Flow)
- Viết prompt tiếng Anh, lời thoại giữ nguyên tiếng Việt trong ngoặc kép.
- Chất lượng: dọc 9:16, 4K, sắc nét, photorealistic.
- Mỗi cảnh có các khối: SETTING, CHARACTERS, ACTION & DIALOGUE (chia theo giây), STYLE, AUDIO.
- Khối SETTING và CHARACTERS phải giống y nguyên chữ ở mọi cảnh để nhân vật không bị đổi.
- Nếu có ảnh nhân vật: viết thêm prompt tạo ẢNH KHUNG ĐẦU (dùng ảnh tham chiếu) cho Cảnh 1.
- Ghi rõ cách nối cảnh: Cảnh 1 dùng Frames to Video (hoặc Text to Video), các cảnh sau dùng khung hình cuối của cảnh trước làm khung đầu.
- Viết an toàn theo chính sách Veo 3: không tả cơ thể trẻ em, không hôn má/môi trẻ em (thay bằng ôm hoặc thơm lên đầu), trang phục kín đáo, ghi rõ "wholesome, family-friendly". Nếu phải đổi chi tiết nào so với video gốc vì lý do này, hãy liệt kê cho tôi biết.
- Thêm negative prompt.

BƯỚC 5 – TRẢ KẾT QUẢ
- Trả lời bằng tiếng Việt, theo thứ tự: bảng phân tích → kịch bản → các prompt (mỗi prompt trong 1 khung code riêng để tôi copy).
- Lưu tất cả vào 1 file .md.
```

---

## Mẹo
- Video càng ngắn (dưới 30 giây) thì phân tích càng chính xác.
- Nên gửi video **gốc, không có chữ hay sticker che mặt**. Nếu là video tải từ TikTok/Facebook thì nên tải bản không logo.
- Muốn đổi lời thoại hay tên nhân vật (ví dụ đổi "Kem" thành "Dâu"), hãy ghi thêm vào BƯỚC 3: `Đổi tên [Kem] thành [Dâu]`.
