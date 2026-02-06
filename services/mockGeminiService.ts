import { AIActionType, NovelNode } from "../types";

// Mock data for demo purposes
const mockResponses = {
  [AIActionType.WRITE_CONTINUE]: [
    "Bóng đêm dần buông xuống trên thành phố, những ngọn đèn đường bắt đầu bật sáng như những vì sao sa xuống trần gian. Trong căn hộ nhỏ trên tầng cao, cô gái ngồi bên cửa sổ, ngắm nhìn dòng xe cộ hối hả bên dưới. Tim cô đập nhanh hơn bình thường, không phải vì lo lắng, mà vì sự háo hức của một đêm định mệnh sắp bắt đầu.",
    
    "Gió đêm thổi qua khe cửa, mang theo hơi lạnh của mùa đông. Anh khoác chiếc áo len dày, bước đi trên con đường quen thuộc. Mỗi bước chân như đang đếm ngược thời gian, mỗi hơi thở mang theo nỗi nhớ về một người đã xa cách. Đêm nay, mọi thứ sẽ được giải đáp.",
    
    "Trăng tròn treo lơ lửng trên bầu trời đêm, ánh sáng bạc của nó phủ lên mặt hồ phẳng lặng. Hai người ngồi bên nhau trên bờ hồ, không cần lời nói, chỉ có tiếng gió và tiếng sóng vỗ rì rào. Tình yêu của họ như mặt hồ này, sâu lắng và bình yên."
  ],
  
  [AIActionType.SUMMARIZE]: [
    '{"TomTat": "Nhân vật chính đối mặt với một đêm định mệnh, nơi mọi bí mật sẽ được giải đáp và tương lai sẽ được định hình."}',
    '{"TomTat": "Câu chuyện kể về cuộc gặp gỡ định mệnh giữa hai người dưới ánh trăng, nơi tình yêu nảy nở một cách tự nhiên."}',
    '{"TomTat": "Nhân vật chính trải qua một đêm đầy cảm xúc, đối diện với quá khứ và tìm kiếm câu trả lời cho tương lai."}'
  ],
  
  [AIActionType.GENERATE_TITLE]: [
    "Đêm Định Mệnh\nBóng Đêm và Ánh Trăng\nKhoảnh Khắc Gặp Gỡ\nLời Hẹn Ước Dưới Trăng\nCon Đường Tình Yêu",
    
    "Khi Gió Qua\nĐêm Đông Lạnh Lẽo\nTrở Về Nơi Xưa\nNỗi Nhớ Đêm Mưa\nHành Trình Tìm Lại",
    
    "Trăng Tròn Tình Yêu\nHồ Nước Lặng Lẽ\nBên Nhau Dưới Trăng\nKhoảnh Khắc Bình Yên\nTình Yêu Sâu Lắng"
  ],
  
  [AIActionType.END_NODE]: [
    '{"KetThuc": "Và như vậy, đêm định mệnh đã đến hồi kết. Mọi bí mật được giải đáp, mọi câu chuyện có cái kết trọn vẹn. Họ nhìn nhau, hiểu rằng từ đây cuộc đời họ sẽ mãi mãi gắn kết.", "DanChuyen": "Nhưng đó chưa phải là kết thúc, mà chỉ là sự bắt đầu của một chương mới, một hành trình mới đầy hứa hẹn."}',
    '{"KetThuc": "Ánh bình minh đầu tiên ló dạng, báo hiệu một ngày mới bắt đầu. Họ biết rằng dù tương lai có ra sao, họ sẽ luôn có nhau để cùng bước đi.", "DanChuyen": "Câu chuyện của họ vẫn tiếp diễn, và chúng ta hãy cùng xem những điều bất ngờ sắp tới."}',
    '{"KetThuc": "Mọi thứ đã kết thúc như cách nó đã bắt đầu - một cách hoàn hảo. Tình yêu đã chiến thắng, và hạnh phúc cuối cùng cũng mỉm cười với họ.", "DanChuyen": "Nhưng cuộc sống vẫn còn nhiều điều đang chờ đợi, hãy cùng khám phá những chương tiếp theo."}'
  ],
  
  [AIActionType.DIRECT_NARRATOR]: [
    '{"KetThuc": "Và đó là câu chuyện về đêm định mệnh ấy. Một đêm đã thay đổi tất cả, một đêm đã viết nên hạnh phúc.", "DanChuyen": "Hôm nay tôi lại xin tiếp tục nối tiếp mục trước, và xin mời lắng nghe và cùng thưởng thức cà phê."}',
    '{"KetThuc": "Câu chuyện tình yêu này đến đây là kết thúc, nhưng tình yêu của họ thì sẽ còn mãi mãi.", "DanChuyen": "Hôm nay tôi lại xin tiếp tục nối tiếp mục trước, và xin mời lắng nghe và cùng thưởng thức cà phê."}',
    '{"KetThuc": "Một câu chuyện đẹp đã đến hồi kết, và tôi tin rằng bạn cũng cảm nhận được hạnh phúc của họ.", "DanChuyen": "Hôm nay tôi lại xin tiếp tục nối tiếp mục trước, và xin mời lắng nghe và cùng thưởng thức cà phê."}'
  ]
};

export const generateMockNovelContent = async (
  node: NovelNode, 
  action: AIActionType, 
  extraContext: string = '',
  style: string = ''
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = mockResponses[action];
  if (!responses) {
    return `Chức năng ${action} đang được phát triển cho phiên bản demo.`;
  }
  
  // Return random response from the array
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};
