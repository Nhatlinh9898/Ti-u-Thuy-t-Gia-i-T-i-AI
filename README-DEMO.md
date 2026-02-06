# 🚀 CHẠY DEMO KHÔNG CẦN API KEY

## CÀI ĐẶT NHANH

### Bước 1: Cài Dependencies
```bash
npm install
```

### Bước 2: Chạy Demo
```bash
npm run dev
```

Mở trình duyệt tại: http://localhost:3000

## ✅ TÍNH NĂNG DEMO

### **Chế độ Mock AI**
- ✅ **VIẾT TIẾP** - Tự động viết nội dung mẫu
- ✅ **TÓM TẮT** - Tạo tóm tắt JSON mẫu  
- ✅ **ĐẶT TIÊU ĐỀ** - Gợi ý tiêu đề mẫu
- ✅ **KẾT THÚC MỤC** - Viết đoạn kết mẫu
- ✅ **NGƯỜI KỂ CHUYỆN** - Dẫn chuyện mẫu

### **Lưu Trữ Local**
- ✅ **Auto-save** - Tự động lưu vào localStorage
- ✅ **Export/Import** - Xuất/nhập file JSON
- ✅ **Persistent Data** - Dữ liệu không mất khi refresh

## 🎯 CÁCH SỬ DỤNG

1. **Chạy ứng dụng** - `npm run dev`
2. **Thêm mục mới** - Click nút + trong sidebar
3. **Viết nội dung** - Gõ trực tiếp vào editor
4. **Dùng AI Demo** - Click các nút AI để thấy nội dung mẫu
5. **Lưu trữ** - Dữ liệu tự động lưu, có thể xuất file

## 📱 CÁC TÍNH NĂNG

### **Editor Tiểu Thuyết**
- Cấu trúc cây: Tiểu thuyết → Phần → Chương → Hồi → Mục
- Editor rich text với font đẹp
- Tóm tắt tự động cho mỗi mục

### **AI Tools (Demo)**
- Mock responses với nội dung tiếng Việt
- Simulate API delay cho realistic体验
- Random responses từ database mẫu

### **Data Management**
- LocalStorage auto-save
- Export JSON với timestamp
- Import từ file JSON

## 🔧 NÂNG CẤP LÊN PRO

Khi có API key, app sẽ tự động chuyển sang chế độ AI thật:

1. **Lấy API Key** tại: https://makersuite.google.com/app/apikey
2. **Tạo file `.env.local`**:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. **Restart app** - Sẽ tự động dùng AI thật

## 🎨 GIAO DIỆN

- **Theme VIP Gold** - Sang trọng, chuyên nghiệp
- **Responsive** - Hoạt động tốt trên mobile
- **Smooth Animations** - Chuyển động mượt mà
- **Custom Scrollbar** - Thanh cuộn đẹp

## 📝 DEMO DATA

App có sẵn data mẫu:
- Tiểu thuyết "Tiểu Thuyết Mới"
- Phần 1: "Khởi Nguyên"  
- Chương 1: "Bóng Đêm"

---

**Version:** 1.0.0 Demo  
**Status:** Ready to run without API Key
