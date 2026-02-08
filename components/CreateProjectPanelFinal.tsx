import React, { useState } from 'react';
import { Plus, Wand2, BookOpen, Users, MapPin, Lightbulb, Target, Clock, FileText, Sparkles, Loader2, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, X, Search, Star, TrendingUp } from 'lucide-react';
import StoryTemplateService, { StoryTemplate } from '../services/storyTemplateService';

interface StoryIdea {
  title: string;
  genre: string;
  theme: string;
  targetAudience: string;
  mainCharacter?: string;
  setting?: string;
  plotSummary?: string;
  tone: string;
  length: string;
  complexity: string;
}

interface CreateProjectPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (projectData: any) => void;
}

const CreateProjectPanelFinal: React.FC<CreateProjectPanelProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Template states
  const [useTemplate, setUseTemplate] = useState(false);
  const [templates, setTemplates] = useState<StoryTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [templateSearch, setTemplateSearch] = useState('');
  
  const templateService = StoryTemplateService.getInstance();

  const [storyIdea, setStoryIdea] = useState<StoryIdea>({
    title: '',
    genre: '',
    theme: '',
    targetAudience: '',
    mainCharacter: '',
    setting: '',
    plotSummary: '',
    tone: 'dramatic',
    length: 'medium',
    complexity: 'moderate'
  });

  // Load templates
  useState(() => {
    const allTemplates = templateService.getAllTemplates();
    setTemplates(allTemplates);
  });

  const genres = ['Kinh dị', 'Lãng mạn', 'Khoa học viễn tưởng', 'Phiêu lưu', 'Hài hước', 'Kịch tính', 'Bí ẩn', 'Gây cấn', 'Fantasy'];
  const audiences = ['Thiếu nhi (6-12)', 'Thiếu niên (13-18)', 'Thanh niên (19-25)', 'Người lớn (26-40)', 'Trung niên (41-60)'];
  const tones = ['Nghiêm túc', 'Hài hước', 'Kịch tính', 'Lãng mạn', 'Gây cấn', 'Bí ẩn'];
  const lengths = ['Ngắn', 'Trung bình', 'Dài', 'Sử thi'];
  const complexities = ['Đơn giản', 'Vừa phải', 'Phức tạp'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Đơn giản': return 'text-green-400';
      case 'Trung bình': return 'text-yellow-400';
      case 'Phức tạp': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleNext = () => {
    const newErrors: string[] = [];
    
    if (currentStep === 1) {
      if (!useTemplate) {
        // Validate manual input
        if (!storyIdea.title.trim()) newErrors.push('Tiêu đề là bắt buộc');
        if (!storyIdea.genre.trim()) newErrors.push('Thể loại là bắt buộc');
        if (!storyIdea.theme.trim()) newErrors.push('Chủ đề là bắt buộc');
        if (!storyIdea.targetAudience.trim()) newErrors.push('Đối tượng độc giả là bắt buộc');
        if (!storyIdea.mainCharacter.trim()) newErrors.push('Nhân vật chính là bắt buộc');
        if (!storyIdea.setting.trim()) newErrors.push('Bối cảnh là bắt buộc');
        if (!storyIdea.plotSummary.trim() || storyIdea.plotSummary.length < 50) {
          newErrors.push('Tóm tắt cốt truyện cần ít nhất 50 ký tự');
        }
      } else {
        // Validate template selection
        if (!selectedTemplate) {
          newErrors.push('Vui lòng chọn một template');
        }
      }
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors([]);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleGenerateStructure = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentStep(4);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCreateProject = () => {
    let projectData: any;
    
    if (useTemplate && selectedTemplate) {
      // Use template data
      projectData = {
        title: selectedTemplate.title,
        genre: selectedTemplate.genre,
        theme: selectedTemplate.template.plotDetails.theme,
        targetAudience: 'Thanh niên (19-25)', // Default for templates
        mainCharacter: selectedTemplate.template.mainCharacters.map(char => char.name).join(', '),
        setting: selectedTemplate.template.generalContext,
        plotSummary: selectedTemplate.description,
        tone: 'dramatic',
        length: selectedTemplate.estimatedLength,
        complexity: selectedTemplate.difficulty,
        createdAt: new Date(),
        fromTemplate: selectedTemplate.id
      };
    } else {
      // Use manual input
      projectData = {
        title: storyIdea.title,
        genre: storyIdea.genre,
        theme: storyIdea.theme,
        targetAudience: storyIdea.targetAudience,
        mainCharacter: storyIdea.mainCharacter,
        setting: storyIdea.setting,
        plotSummary: storyIdea.plotSummary,
        tone: storyIdea.tone,
        length: storyIdea.length,
        complexity: storyIdea.complexity,
        createdAt: new Date()
      };
    }
    
    onProjectCreated(projectData);
    onClose();
  };

  const updateStoryIdea = (field: keyof StoryIdea, value: any) => {
    setStoryIdea(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-vip-900 rounded-xl border border-vip-700 max-w-4xl max-h-[90vh] overflow-hidden w-full">
        <div className="p-4 border-b border-vip-800 flex justify-between items-center bg-vip-800/50">
          <h3 className="text-vip-gold font-bold flex items-center gap-2">
            <Wand2 size={20} />
            AI sẽ giúp bạn tạo cấu trúc tiểu thuyết
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-vip-700 rounded text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          <div className="w-1/2 border-r border-vip-800 overflow-y-auto p-6">
            <div className="mb-4 space-y-3">
              <div className="flex items-center gap-4 p-4 bg-vip-800/50 border border-vip-700 rounded-lg">
                <button
                  onClick={() => setUseTemplate(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    !useTemplate 
                      ? 'bg-vip-600 text-white' 
                      : 'bg-vip-700 text-vip-300'
                  }`}
                >
                  <BookOpen size={16} className="mr-2" />
                  Nhập thủ công
                </button>
                <button
                  onClick={() => setUseTemplate(true)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    useTemplate 
                      ? 'bg-vip-600 text-white' 
                      : 'bg-vip-700 text-vip-300'
                  }`}
                >
                  <Sparkles size={16} className="mr-2" />
                  Sử dụng Template
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {currentStep === 1 && (
                <>
                  {useTemplate ? (
                    /* Template Selection */
                    <>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-vip-300 mb-2">
                            <Sparkles size={16} className="inline mr-2" />
                            Chọn Template Cốt Truyện
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Tìm kiếm template..."
                              value={templateSearch}
                              onChange={(e) => setTemplateSearch(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vip-400" size={16} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
                          {templates
                            .filter(template => 
                              template.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
                              template.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
                              template.tags.some(tag => tag.toLowerCase().includes(templateSearch.toLowerCase()))
                            )
                            .map((template) => (
                              <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                  selectedTemplate?.id === template.id
                                    ? 'border-vip-gold bg-vip-700/50'
                                    : 'border-vip-700 hover:border-vip-600 hover:bg-vip-800/50'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-vip-gold font-bold">{template.title}</h4>
                                  <div className="flex items-center gap-2">
                                    <Star className="text-yellow-400" size={14} />
                                    <span className="text-xs text-vip-400">Template</span>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-vip-200 mb-2">{template.description}</p>

                                <div className="flex flex-wrap gap-2 mb-2">
                                  {template.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-vip-700 rounded text-xs text-vip-300">
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex justify-between items-center text-xs text-vip-400">
                                  <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                      <BookOpen size={12} />
                                      {template.genre}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {template.estimatedLength}
                                    </span>
                                  </div>
                                  <span className={`flex items-center gap-1 ${getDifficultyColor(template.difficulty)}`}>
                                    <TrendingUp size={12} />
                                    {template.difficulty}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>

                        {selectedTemplate && (
                          <div className="mt-4 p-4 bg-vip-800/50 border border-vip-700 rounded-lg">
                            <h5 className="text-vip-gold font-bold mb-2">Template đã chọn: {selectedTemplate.title}</h5>
                            <div className="text-sm text-vip-200">
                              <p><strong>Thể loại:</strong> {selectedTemplate.genre}</p>
                              <p><strong>Độ dài:</strong> {selectedTemplate.estimatedLength}</p>
                              <p><strong>Độ khó:</strong> {selectedTemplate.difficulty}</p>
                              <p><strong>Mô tả:</strong> {selectedTemplate.description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Manual Input Fields */
                    <>
                      <div>
                        <label className="block text-sm font-medium text-vip-300 mb-2">
                          <BookOpen size={16} className="inline mr-2" />
                          Tiêu đề tiểu thuyết *
                        </label>
                        <input
                          type="text"
                          value={storyIdea.title}
                          onChange={(e) => updateStoryIdea('title', e.target.value)}
                          className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors"
                          placeholder="Nhập tiêu đề tiểu thuyết..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vip-300 mb-2">
                          <Target size={16} className="inline mr-2" />
                          Thể loại *
                        </label>
                        <select
                          value={storyIdea.genre}
                          onChange={(e) => updateStoryIdea('genre', e.target.value)}
                          className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors"
                        >
                          <option value="">Chọn thể loại...</option>
                          {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vip-300 mb-2">
                          <Lightbulb size={16} className="inline mr-2" />
                          Chủ đề chính *
                        </label>
                        <input
                          type="text"
                          value={storyIdea.theme}
                          onChange={(e) => updateStoryIdea('theme', e.target.value)}
                          className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors"
                          placeholder="Ví dụ: Tình bạn, Sự hy sinh, Trưởng thành..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vip-300 mb-2">
                          <Users size={16} className="inline mr-2" />
                          Đối tượng độc giả *
                        </label>
                        <select
                          value={storyIdea.targetAudience}
                          onChange={(e) => updateStoryIdea('targetAudience', e.target.value)}
                          className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors"
                        >
                          <option value="">Chọn đối tượng...</option>
                          {audiences.map(audience => (
                            <option key={audience} value={audience}>{audience}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vip-300 mb-2">
                          <Users size={16} className="inline mr-2" />
                          Nhân vật chính *
                        </label>
                        <input
                          type="text"
                          value={storyIdea.mainCharacter}
                          onChange={(e) => updateStoryIdea('mainCharacter', e.target.value)}
                          className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors"
                          placeholder="Tên và mô tả ngắn về nhân vật chính..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vip-300 mb-2">
                          <MapPin size={16} className="inline mr-2" />
                          Bối cảnh *
                        </label>
                        <input
                          type="text"
                          value={storyIdea.setting}
                          onChange={(e) => updateStoryIdea('setting', e.target.value)}
                          className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors"
                          placeholder="Thời gian và không gian câu chuyện..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-vip-300 mb-2">
                          <FileText size={16} className="inline mr-2" />
                          Tóm tắt cốt truyện *
                        </label>
                        <textarea
                          value={storyIdea.plotSummary}
                          onChange={(e) => updateStoryIdea('plotSummary', e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors resize-none"
                          placeholder="Mô tả chi tiết về cốt truyện, nhân vật, bối cảnh và các sự kiện chính..."
                        />
                        <p className="text-xs text-vip-400 mt-2">
                          {storyIdea.plotSummary.length}/50 ký tự tối thiểu
                          {storyIdea.plotSummary.length < 50 && (
                            <span className="text-red-400 ml-2">• Cần ít nhất 50 ký tự</span>
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

          {/* Step indicators */}
          <div className="p-4 border-b border-vip-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step <= currentStep ? 'bg-vip-600 text-vip-gold' : 'bg-vip-800 text-vip-400'
                }`}>
                  {step < currentStep ? <CheckCircle size={16} /> : step}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-vip-400">
              <span>Thông tin cơ bản</span>
              <span>Chi tiết ý tưởng</span>
              <span>Cấu hình</span>
              <span>Kết quả</span>
            </div>
          </div>

          {/* Error display */}
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-400 mb-1">Lỗi:</p>
                  <ul className="text-xs text-red-300 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-vip-300 mb-2">
                    <Users size={16} className="inline mr-2" />
                    Chi tiết nhân vật chính
                  </label>
                  <textarea
                    value={storyIdea.mainCharacter}
                    onChange={(e) => updateStoryIdea('mainCharacter', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-vip-800 border border-vip-700 rounded-lg text-vip-200 focus:border-vip-gold focus:outline-none transition-colors resize-none"
                    placeholder="Mô tả chi tiết nhân vật chính: tính cách, ngoại hình, nền tảng, động lực, xung đột..."
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-vip-300 mb-2">
                    <Clock size={16} className="inline mr-2" />
                    Tông giọng
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {tones.map((tone, index) => (
                      <button
                        key={index}
                        onClick={() => updateStoryIdea('tone', tone)}
                        className={`p-3 rounded-lg border transition-colors ${
                          storyIdea.tone === tone
                            ? 'bg-vip-600 text-white border-vip-600'
                            : 'bg-vip-800 text-vip-200 border-vip-700 hover:border-vip-600'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-vip-300 mb-2">
                    <Clock size={16} className="inline mr-2" />
                    Độ dài
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {lengths.map((length, index) => (
                      <button
                        key={index}
                        onClick={() => updateStoryIdea('length', length)}
                        className={`p-3 rounded-lg border transition-colors ${
                          storyIdea.length === length
                            ? 'bg-vip-600 text-white border-vip-600'
                            : 'bg-vip-800 text-vip-200 border-vip-700 hover:border-vip-600'
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-vip-300 mb-2">
                    <TrendingUp size={16} className="inline mr-2" />
                    Độ phức tạp
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {complexities.map((complexity, index) => (
                      <button
                        key={index}
                        onClick={() => updateStoryIdea('complexity', complexity)}
                        className={`p-3 rounded-lg border transition-colors ${
                          storyIdea.complexity === complexity
                            ? 'bg-vip-600 text-white border-vip-600'
                            : 'bg-vip-800 text-vip-200 border-vip-700 hover:border-vip-600'
                        }`}
                      >
                        {complexity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="mb-8">
                  <h3 className="text-vip-gold font-bold text-lg mb-4">Cấu trúc đã tạo!</h3>
                  <div className="bg-vip-800/50 border border-vip-700 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="text-vip-300" size={24} />
                        <div>
                          <h4 className="text-vip-gold font-bold">{storyIdea.title}</h4>
                          <p className="text-sm text-vip-200">{storyIdea.genre}</p>
                          <p className="text-sm text-vip-200">{storyIdea.theme}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="text-vip-300" size={24} />
                        <div>
                          <h4 className="text-vip-gold font-bold">Nhân vật chính</h4>
                          <p className="text-sm text-vip-200">{storyIdea.mainCharacter}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="text-vip-300" size={24} />
                        <div>
                          <h4 className="text-vip-gold font-bold">Bối cảnh</h4>
                          <p className="text-sm text-vip-200">{storyIdea.setting}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-vip-300" size={24} />
                    <div>
                      <h4 className="text-vip-gold font-bold">Tóm tắt cốt truyện</h4>
                      <p className="text-sm text-vip-200">{storyIdea.plotSummary}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCreateProject}
                    className="flex-1 bg-vip-600 hover:bg-vip-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Tạo Dự Án
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-vip-700 hover:bg-vip-600 text-vip-200 rounded-lg font-medium transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="p-4 border-t border-vip-800 flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-vip-700 hover:bg-vip-600 text-vip-200 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              <ChevronRight size={16} />
              Quay lại
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 4 || isGenerating}
              className="px-4 py-2 bg-vip-600 hover:bg-vip-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-transparent animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  Tiếp tục
                  <ChevronRight size={16} />
                </>
              )}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPanelFinal;
