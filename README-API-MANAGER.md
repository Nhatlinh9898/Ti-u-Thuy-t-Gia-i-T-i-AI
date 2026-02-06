# 🔄 API MANAGER - HỆ THỐNG QUẢN LÝ API TỰ ĐỘNG

## 🎯 TÍNH NĂNG

### **Multi-API Support**
- ✅ **Gemini API** - Google AI (Free tier available)
- ✅ **Groq API** - Super fast inference (Free tier)
- ✅ **OpenAI API** - GPT models (Paid)
- ✅ **Custom APIs** - Add any API endpoint

### **Smart Rate Limiting**
- 🔄 **Auto-switch** - Chuyển API khi hết limit
- ⏱️ **Time tracking** - Đếm ngược đến reset time
- 📊 **Usage monitoring** - Real-time usage stats
- 🎯 **Priority system** - API ưu tiên cao trước

### **Intelligent Failover**
- 🚀 **Seamless switching** - Không gián đoạn trải nghiệm
- 📈 **Load balancing** - Phân bổ request
- ⚡ **Performance optimization** - Dùng API nhanh nhất
- 🛡️ **Error handling** - Xử lý lỗi tự động

---

## 🛠️ CẤU HÌNH

### **1. Environment Variables**
```bash
# .env.local
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_openai_key_here
```

### **2. API Priority**
```javascript
// Mặc định priority (1 = cao nhất)
1. Gemini (Free tier)
2. Groq (Free tier)  
3. OpenAI (Paid)
```

### **3. Rate Limits**
| API | Requests/Min | Requests/Day | Reset Time |
|------|---------------|---------------|------------|
| Gemini | 15 | 50 | 00:00 UTC |
| Groq | 30 | 14,400 | 00:00 UTC |
| OpenAI | 60 | 1,000 | 00:00 UTC |

---

## 📊 DASHBOARD

### **API Status Panel**
- 🟢 **Real-time status** - Cập nhật mỗi 5 giây
- 📊 **Usage bars** - Visual rate limit indicators
- ⏰ **Reset countdown** - Thời gian còn lại
- 🔑 **Key status** - Kiểm tra API key availability

### **Color Coding**
- 🟢 **Green** - Dưới 70% usage
- 🟡 **Yellow** - 70-90% usage  
- 🔴 **Red** - Trên 90% usage

---

## 🚀 CÁCH SỬ DỤNG

### **Basic Usage**
```typescript
import { generateSmartNovelContent } from './services/smartGeminiService';

// Tự động chọn API tốt nhất
const result = await generateSmartNovelContent(node, action, context);
```

### **Manual API Switch**
```typescript
import { switchAPI } from './services/smartGeminiService';

// Chuyển sang API cụ thể
switchAPI('Groq');
switchAPI('OpenAI');
```

### **Add Custom API**
```typescript
import { addCustomAPI } from './services/smartGeminiService';

addCustomAPI({
  name: 'MyAPI',
  key: 'my_api_key',
  baseUrl: 'https://api.example.com',
  model: 'my-model',
  priority: 1,
  rateLimit: {
    requestsPerMinute: 20,
    requestsPerDay: 500,
    resetTime: '00:00:00'
  }
});
```

---

## 🎯 STRATEGY TỐI ƯU

### **Free Tier Maximization**
1. **Gemini** - Dùng cho writing tasks (50 requests/day)
2. **Groq** - Dùng cho quick responses (14,400 requests/day)
3. **Rotate** - Chuyển giữa 2 API để tối đa

### **Time-based Optimization**
- **00:00-06:00 UTC** - Dùng Gemini (ít người dùng)
- **06:00-18:00 UTC** - Dùng Groq (high limit)
- **18:00-24:00 UTC** - Dùng API còn lại

### **Request Distribution**
```javascript
// Smart request allocation
const dailyLimit = 50; // Gemini
const requestsPerHour = dailyLimit / 24;
const currentHour = new Date().getUTCHours();

if (currentHour < 6) {
  // Use Gemini - ít competition
} else if (currentHour < 18) {
  // Use Groq - high limit
} else {
  // Use remaining API
}
```

---

## 📈 MONITORING

### **Usage Tracking**
- ✅ **Real-time counters** - Requests/tokens per minute
- ✅ **Daily limits** - Reset tự động tại midnight UTC
- ✅ **Historical data** - Lưu trong localStorage
- ✅ **Visual indicators** - Color-coded status bars

### **Alert System**
- ⚠️ **70% warning** - Sắp hết limit
- 🔴 **90% critical** - Cần chuyển API
- 🚫 **100% blocked** - Tự động chờ reset

---

## 🔧 ADVANCED CONFIG

### **Load Balancing**
```typescript
// Cấu hình load balancing
const config = {
  strategy: 'round-robin', // hoặc 'priority', 'least-used'
  healthCheck: true,
  retryAttempts: 3,
  timeoutMs: 10000
};
```

### **Custom Rules**
```typescript
// Rule-based API selection
const rules = {
  'writing': { preferred: 'Gemini', fallback: 'Groq' },
  'chat': { preferred: 'Groq', fallback: 'Gemini' },
  'analysis': { preferred: 'OpenAI', fallback: 'Gemini' }
};
```

---

## 🎉 KẾT QUẢ

Với **API Manager**, bạn có:

- ✅ **Unlimited requests** - Qua nhiều API providers
- ✅ **Zero downtime** - Auto-failover khi API lỗi
- ✅ **Cost optimization** - Tối ưu free tiers
- ✅ **Smart scheduling** - Đúng thời điểm reset
- ✅ **Easy integration** - Chỉ cần 1 dòng code

**Không bao giờ hết token nữa! 🚀**
