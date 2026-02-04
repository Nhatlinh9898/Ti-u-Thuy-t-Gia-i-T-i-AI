import { GoogleGenAI, Type } from "@google/genai";
import { AIActionType, NovelNode } from "../types";

const apiKey = process.env.API_KEY || ''; // Injected by environment

const ai = new GoogleGenAI({ apiKey });

// Helper to construct prompts based on the architecture
const constructPrompt = (node: NovelNode, action: AIActionType, extraContext: string = '', style: string = ''): string => {
  const nodePath = `${node.type.toUpperCase()}: ${node.title}`;
  const baseContent = node.content ? `Nội dung hiện tại:\n${node.content.slice(-2000)}` : 'Chưa có nội dung.';
  
  switch (action) {
    case AIActionType.WRITE_CONTINUE:
      return `
        Bạn là một công cụ viết tiểu thuyết. Hãy viết tiếp nội dung cho node: [${nodePath}].
        Yêu cầu:
        - Giữ đúng mạch truyện và phong cách đã thiết lập.
        - Viết chi tiết, có miêu tả nhân vật, bối cảnh, cảm xúc.
        - Độ dài tối thiểu: 1000 từ.
        - Kết thúc mở để có thể tiếp tục ở node sau.
        Chủ đề/Gợi ý thêm: ${extraContext}
        ${baseContent}
      `;
    
    case AIActionType.SUMMARIZE:
      return `
        Bạn là một công cụ tóm tắt tiểu thuyết. Hãy tóm tắt nội dung cho node: [${nodePath}].
        Yêu cầu:
        - Tóm tắt súc tích trong 3–5 câu.
        - Giữ đúng mạch truyện và nhân vật.
        - Nêu rõ bối cảnh, sự kiện chính và cảm xúc nổi bật.
        - Xuất ra dưới dạng JSON thuần túy.
        ${baseContent}
      `;

    case AIActionType.GENERATE_TITLE:
      return `
        Bạn là một công cụ đặt tiêu đề tiểu thuyết. Hãy tạo 5 tiêu đề ngắn gọn và hấp dẫn cho node: [${nodePath}].
        Dựa trên nội dung: ${baseContent}
        Chỉ trả về danh sách các tiêu đề.
      `;

    case AIActionType.END_NODE:
      return `
        Bạn là một công cụ viết tiểu thuyết. Hãy viết đoạn kết cho node: [${nodePath}].
        Yêu cầu:
        - Kết thúc súc tích, làm rõ nội dung chính.
        - Viết thêm đoạn dẫn chuyện 2–3 câu để mở sang Mục tiếp theo.
        - Xuất ra JSON: { "KetThuc": "...", "DanChuyen": "..." }
        ${baseContent}
      `;

    case AIActionType.GENERATE_CHOICES:
      return `
        Bạn là một công cụ viết tiểu thuyết. Sau khi kết thúc node [${nodePath}], hãy viết 3–5 đoạn dẫn chuyện khác nhau.
        Yêu cầu:
        - Mỗi đoạn dài 2–4 câu.
        - Đa dạng cảm xúc: lãng mạn, kịch tính, bí ẩn, nhẹ nhàng.
        - Xuất ra JSON.
        ${baseContent}
      `;

    case AIActionType.DIRECT_NARRATOR:
      return `
        Bạn là một người kể chuyện. Sau khi kết thúc node [${nodePath}], hãy viết đoạn dẫn chuyện theo phong cách trò chuyện trực tiếp.
        Yêu cầu:
        - Bắt đầu bằng: "Hôm nay tôi lại xin tiếp tục nối tiếp mục trước..."
        - Tóm tắt mục trước trong 2–3 câu.
        - Viết đoạn mở đầu cho mục tiếp theo với giọng văn tò mò, gợi mở.
        - Kết thúc bằng: "Xin mời lắng nghe và cùng thưởng thức cà phê."
        - Xuất ra JSON.
        ${baseContent}
      `;

    case AIActionType.STRUCT_MARKDOWN:
      return `
        Bạn là một kiến trúc sư tiểu thuyết. Hãy tạo ra một cấu trúc tiểu thuyết chi tiết (Phần -> Chương -> Hồi -> Mục) cho ý tưởng sau:
        "${extraContext}"
        Xuất ra dưới dạng Markdown danh sách.
      `;

    default:
      return `Hãy thực hiện yêu cầu sau cho tiểu thuyết: ${extraContext}`;
  }
};

export const generateNovelContent = async (
  node: NovelNode, 
  action: AIActionType, 
  extraContext: string = '',
  style: string = ''
): Promise<string> => {
  if (!apiKey) throw new Error("API Key chưa được cấu hình.");

  const modelName = "gemini-3-flash-preview";
  const prompt = constructPrompt(node, action, extraContext, style);

  try {
    let responseSchema;
    let responseMimeType = "text/plain";

    // Setup JSON schema for specific actions
    if ([AIActionType.SUMMARIZE, AIActionType.END_NODE, AIActionType.GENERATE_CHOICES, AIActionType.DIRECT_NARRATOR].includes(action)) {
      responseMimeType = "application/json";
      // We are being lenient with schema here and letting the model infer from prompt examples for flexibility
      // But for production, explicit schema is better.
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: responseMimeType,
        temperature: 0.7,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
