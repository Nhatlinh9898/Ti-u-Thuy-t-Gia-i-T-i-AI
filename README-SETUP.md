# 🚀 Hướng Dẫn Cài Đặt Tự Động

## Cách 1: Chạy Script Tự Động

### Windows
```bash
setup.bat
```

### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
```

## Cách 2: Cài Đặt Thủ Công

### 1. Cài Dependencies
```bash
npm install
```

### 2. Cấu Hình API Key
Tạo file `.env.local` với nội dung:
```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**Lấy API Key tại:** https://makersuite.google.com/app/apikey

### 3. Chạy Ứng Dụng
```bash
npm run dev
```

Mở trình duyệt tại: http://localhost:5173

## ✅ Kiểm Tra Cài Đặt

- Dependencies đã được cài đặt
- File `.env.local` đã được tạo
- Ứng dụng chạy tại port 5173

## 🔧 Khắc Phục Lỗi

1. **Lỗi npm install:** 
   - Chạy `npm cache clean --force`
   - Xóa `node_modules` và `package-lock.json`
   - Chạy lại `npm install`

2. **Lỗi API Key:**
   - Kiểm tra file `.env.local`
   - Đảm bảo API key hợp lệ
   - Kiểm tra kết nối internet

3. **Lỗi port:**
   - Port 5173 đang bị sử dụng
   - Chạy `npm run dev -- --port 3000`

## 📱 Tính Năng

- ✅ Editor tiểu thuyết với cây cấu trúc
- ✅ AI viết tiểu thuyết (Gemini 3.0)
- ✅ Voice Studio (text-to-speech)
- ✅ Tự động lưu và tóm tắt
- ✅ UI đẹp với theme VIP

---

**Version:** 1.0.0  
**Powered by:** Gemini 3.0
