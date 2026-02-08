import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { NovelNode, AIActionType } from './types';
import { generateNovelContent } from './services/geminiService';
import { generateMockNovelContent } from './services/mockGeminiService';
import { generateSmartNovelContent, getAPIStatus } from './services/smartGeminiService';
import { saveToLocalStorage, loadFromLocalStorage, exportToFile, importFromFile } from './services/localStorageService';
import TreeNavigation from './components/TreeNavigation';
import VoiceStudio from './components/VoiceStudio';
import APIStatusPanel from './components/APIStatusPanel';
import HybridAIService, { HybridConfig } from './services/hybridAIService';
import GamificationService from './services/gamificationService';
import CreateProjectPanelFinal from './components/CreateProjectPanelFinal';

// Lazy load heavy components
const LocalLLMPanel = lazy(() => import('./components/LocalLLMPanel'));
const HybridAIPanel = lazy(() => import('./components/HybridAIPanel'));
const GamificationPanel = lazy(() => import('./components/GamificationPanel'));
const AICharacterChatPanel = lazy(() => import('./components/AICharacterChatPanel'));
const AnalyticsDashboardPanel = lazy(() => import('./components/AnalyticsDashboardPanel'));
const BlockchainPanel = lazy(() => import('./components/BlockchainPanel'));
const CharacterDevelopmentPanel = lazy(() => import('./components/CharacterDevelopmentPanel'));
const CharacterVoicePanel = lazy(() => import('./components/CharacterVoicePanel'));
const CinematicScenePanel = lazy(() => import('./components/CinematicScenePanel'));
const CollaborationPanel = lazy(() => import('./components/CollaborationPanel'));
const InteractiveStoryPanel = lazy(() => import('./components/InteractiveStoryPanel'));
const MobileAppPanel = lazy(() => import('./components/MobileAppPanel'));
const MultiLanguagePanel = lazy(() => import('./components/MultiLanguagePanel'));
const MultiModalPanel = lazy(() => import('./components/MultiModalPanel'));
const MusicSoundPanel = lazy(() => import('./components/MusicSoundPanel'));
const NovelStructurePanel = lazy(() => import('./components/NovelStructurePanel'));
const ProjectLibraryPanel = lazy(() => import('./components/ProjectLibraryPanel'));
const StoryArchitecturePanel = lazy(() => import('./components/StoryArchitecturePanel'));
const StoryReaderPanel = lazy(() => import('./components/StoryReaderPanel'));
const TrainingPanel = lazy(() => import('./components/TrainingPanel'));
const UltimateAIPanel = lazy(() => import('./components/UltimateAIPanel'));
const VisualEditorPanel = lazy(() => import('./components/VisualEditorPanel'));
const VoiceLibraryPanel = lazy(() => import('./components/VoiceLibraryPanel'));

import { 
  Plus, 
  Wand2, 
  Save, 
  Share2, 
  Feather, 
  Layout, 
  ListTree, 
  Sparkles,
  ChevronRight,
  Loader2,
  Settings,
  Gamepad2,
  X
} from 'lucide-react';

const INITIAL_TREE: NovelNode = {
  id: 'root',
  type: 'novel',
  title: 'Tiểu Thuyết Mới',
  content: '',
  summary: 'Tóm tắt tiểu thuyết sẽ hiện ở đây.',
  isExpanded: true,
  children: [
    {
      id: 'part-1',
      type: 'part',
      title: 'Phần 1: Khởi Nguyên',
      content: '',
      summary: '',
      isExpanded: true,
      children: [
        {
          id: 'chap-1',
          type: 'chapter',
          title: 'Chương 1: Bóng Đêm',
          content: '',
          summary: '',
          isExpanded: false,
          children: []
        }
      ]
    }
  ]
};

const App: React.FC = () => {
  const [tree, setTree] = useState<NovelNode>(INITIAL_TREE);
  const [selectedId, setSelectedId] = useState<string>('root');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptContext, setPromptContext] = useState('');
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [gamificationPanelOpen, setGamificationPanelOpen] = useState(false);
  const [storyTemplateOpen, setStoryTemplateOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [storyDevelopmentOpen, setStoryDevelopmentOpen] = useState(false);
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  const gamificationService = GamificationService.getInstance();

  // Helper to find node by ID (BFS)
  const findNode = useCallback((root: NovelNode, id: string): NovelNode | null => {
    if (root.id === id) return root;
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  // Find currently selected node
  const selectedNode = findNode(tree, selectedId);

  // Update tree state immutably
  const updateNode = (id: string, updates: Partial<NovelNode>) => {
    const updateRecursive = (node: NovelNode): NovelNode => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      return {
        ...node,
        children: node.children.map(updateRecursive)
      };
    };
    setTree(updateRecursive(tree));
  };

  const handleToggle = (node: NovelNode) => {
    updateNode(node.id, { isExpanded: !node.isExpanded });
  };

  const togglePanel = (panelName: string) => {
    setOpenPanels(prev => ({ ...prev, [panelName]: !prev[panelName] }));
  };

  const handleProjectCreated = (project: any) => {
    // Handle project creation
    console.log('Project created:', project);
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setTree(savedData);
    }
  }, []);

  // Auto-save to localStorage when tree changes
  useEffect(() => {
    if (tree !== INITIAL_TREE) {
      saveToLocalStorage(tree);
    }
  }, [tree]);

  const handleAIAction = async (action: AIActionType) => {
    if (!selectedNode) return;
    setIsGenerating(true);
    try {
      // Check if API key is available, otherwise use mock
      const hasApiKey = (import.meta.env?.GEMINI_API_KEY) && 
                       (import.meta.env.GEMINI_API_KEY) !== 'YOUR_API_KEY_HERE';
      const result = hasApiKey 
        ? await generateSmartNovelContent(selectedNode, action, promptContext)
        : await generateMockNovelContent(selectedNode, action, promptContext);
      
      let newContent = selectedNode.content;
      
      if (action === AIActionType.WRITE_CONTINUE) {
        newContent += `\n\n${result}`;
        updateNode(selectedNode.id, { content: newContent });
        
        // Track words written for gamification
        const wordCount = result.split(/\s+/).length;
        gamificationService.trackWordsWritten(wordCount);
      } else if (action === AIActionType.SUMMARIZE) {
        // Try parsing JSON
        try {
            const cleanJson = result.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            updateNode(selectedNode.id, { summary: parsed.TomTat || result });
        } catch (e) {
            updateNode(selectedNode.id, { summary: result });
        }
      } else if (action === AIActionType.GENERATE_TITLE) {
          setPromptContext(result); // Show suggestions in context box
      } else if (action === AIActionType.END_NODE || action === AIActionType.DIRECT_NARRATOR) {
        try {
            const cleanJson = result.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            newContent += `\n\n--- KẾT THÚC ---\n${parsed.KetThuc}\n\n>>> LỜI DẪN: ${parsed.DanChuyen || ''}`;
            updateNode(selectedNode.id, { content: newContent });
            
            // Track chapter completion for gamification
            gamificationService.trackChapterCompletion();
        } catch (e) {
            newContent += `\n\n${result}`;
            updateNode(selectedNode.id, { content: newContent });
        }
      }

      // Track AI usage for gamification
      gamificationService.trackAIUsage();

    } catch (error) {
      alert("Lỗi khi gọi AI. Vui lòng kiểm tra API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addChildNode = () => {
    if (!selectedNode) return;
    const newId = Math.random().toString(36).substr(2, 9);
    let newType: any = 'section';
    if (selectedNode.type === 'novel') newType = 'part';
    else if (selectedNode.type === 'part') newType = 'chapter';
    else if (selectedNode.type === 'chapter') newType = 'act';
    
    const newNode: NovelNode = {
      id: newId,
      type: newType,
      title: `Mục Mới (${newType})`,
      content: '',
      summary: '',
      children: [],
      isExpanded: false
    };

    const updateRecursive = (node: NovelNode): NovelNode => {
        if (node.id === selectedNode.id) {
          return { ...node, children: [...node.children, newNode], isExpanded: true };
        }
        return { ...node, children: node.children.map(updateRecursive) };
      };
      setTree(updateRecursive(tree));
      setSelectedId(newId);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-vip-900 text-gray-100 font-sans">
      {/* HEADER - VIP PRO */}
      <header className="h-20 bg-gradient-to-r from-vip-900 via-vip-800 to-vip-900 border-b border-vip-700 flex items-center justify-center relative shadow-2xl z-20">
        <div className="absolute left-6 flex items-center gap-2 text-vip-gold opacity-80">
          <Feather size={24} />
          <span className="font-bold tracking-widest text-xs hidden md:block">SIÊU APP VIẾT TIỂU THUYẾT</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-vip-gold to-yellow-600 text-center tracking-tight drop-shadow-sm">
          TIỂU THUYẾT GIAI ĐẠI TÀI
        </h1>

        <div className="absolute right-6 flex gap-3">
             <button 
                 onClick={() => setGamificationPanelOpen(true)}
                 className="p-2 rounded-full hover:bg-vip-700 transition-colors text-vip-300"
                 title="Hệ Thống Game Hóa"
             >
                <Gamepad2 size={20} />
             </button>
             <button className="p-2 rounded-full hover:bg-vip-700 transition-colors text-vip-300">
                <Share2 size={20} />
             </button>
             <button className="p-2 rounded-full hover:bg-vip-700 transition-colors text-vip-300">
                <Save size={20} />
             </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - TREE NAVIGATION */}
        <aside className="w-80 bg-vip-800/40 border-r border-vip-700/50 flex flex-col shadow-2xl z-10">
          <div className="p-4 border-b border-vip-800 bg-vip-800/50">
            <h2 className="font-bold text-vip-gold flex items-center gap-2 text-sm uppercase tracking-wider mb-3">
              <ListTree size={16} /> CẤU TRÚC TÁC PHẨM
            </h2>
            <button 
              onClick={addChildNode}
              className="w-full bg-vip-500 hover:bg-vip-400 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-vip-500/20"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 sidebar-scrollbar">
            <TreeNavigation 
              node={tree} 
              selectedId={selectedId} 
              onSelect={(n) => setSelectedId(n.id)}
              onToggle={handleToggle}
            />
          </div>
          <div className="p-4 bg-vip-800/30 text-xs text-center text-gray-500 border-t border-vip-800">
            v1.0.0 - Powered by Gemini 3.0
          </div>
        </aside>

        {/* MAIN EDITOR AREA */}
        <main className="flex-1 flex flex-col bg-[#130f1c] relative overflow-hidden">
          {/* Toolbar */}
          <div className="h-14 bg-vip-800/20 border-b border-vip-700/30 flex items-center px-6 justify-between backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-vip-gold">
                {selectedNode?.title || 'Chọn mục để chỉnh sửa'}
              </h3>
              <span className="text-xs px-2 py-1 rounded bg-vip-700/50 text-vip-300 border border-vip-600/50">
                {selectedNode?.type?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-vip-700/50 rounded-lg transition-colors text-vip-300">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Editor Input */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto h-full flex flex-col gap-4">
              {selectedNode ? (
                  <>
                       {selectedNode.summary && (
                          <div className="bg-vip-800/40 border-l-4 border-vip-500 p-4 rounded-r-lg mb-4 italic text-vip-100 text-sm">
                              <span className="font-bold text-vip-gold not-italic block mb-1">Tóm tắt:</span>
                              {selectedNode.summary}
                          </div>
                       )}

                      <textarea
                          className="w-full flex-1 bg-transparent text-lg text-gray-200 resize-none focus:outline-none leading-relaxed font-serif placeholder-vip-700"
                          placeholder="Bắt đầu viết tiểu thuyết tại đây..."
                          value={selectedNode.content}
                          onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
                      />
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-vip-700">
                      <Layout size={64} className="mb-4 opacity-50" />
                      <p>Chọn một mục từ danh sách bên trái để bắt đầu.</p>
                  </div>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR - AI TOOLS */}
        <aside className={`${aiPanelOpen ? 'w-80' : 'w-12'} transition-all duration-300 bg-vip-900 border-l border-vip-700/50 flex flex-col shadow-2xl z-20`}>
            <div className="p-3 border-b border-vip-800 flex justify-between items-center bg-vip-800/50">
              {aiPanelOpen && <h2 className="font-bold text-vip-gold flex items-center gap-2 text-sm uppercase tracking-wider"><Sparkles size={16} /> CÔNG CỤ AI</h2>}
              <button onClick={() => setAiPanelOpen(!aiPanelOpen)} className="p-1 hover:bg-vip-700 rounded text-gray-400">
                {aiPanelOpen ? <ChevronRight size={18} /> : <Wand2 size={18} />}
              </button>
            </div>

            {aiPanelOpen && (
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Context Input */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Ngữ cảnh / Ý tưởng bổ sung</label>
                        <textarea
                            className="w-full bg-vip-950 border border-vip-700 rounded-lg p-3 text-sm text-gray-300 focus:border-vip-gold focus:outline-none transition-colors"
                            rows={3}
                            placeholder="Nhập ý tưởng chi tiết cho đoạn này... (hỗ trợ lên đến 50,000 từ để phát triển nội dung sâu rộng)"
                            value={promptContext}
                            onChange={(e) => setPromptContext(e.target.value)}
                            maxLength={300000}
                        />
                        <div className="mt-1 text-xs text-vip-400 text-right">
                            {promptContext.length.toLocaleString()} / 300,000 ký tự
                        </div>
                    </div>

                    {/* AI Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            disabled={isGenerating || !selectedNode}
                            onClick={() => handleAIAction(AIActionType.WRITE_CONTINUE)}
                            className="col-span-2 bg-gradient-to-r from-vip-500 to-indigo-600 hover:from-vip-400 hover:to-indigo-500 text-white p-3 rounded-xl font-bold text-sm shadow-lg shadow-vip-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                           {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />} VIẾT TIẾP (20k TỪ)
                        </button>
                        
                        <button 
                            disabled={isGenerating || !selectedNode}
                            onClick={() => handleAIAction(AIActionType.SUMMARIZE)}
                            className="bg-vip-800 hover:bg-vip-700 border border-vip-600 rounded-lg p-2 text-xs font-medium text-gray-200 transition-colors"
                        >
                            Tóm tắt (JSON)
                        </button>
                         <button 
                            disabled={isGenerating || !selectedNode}
                            onClick={() => handleAIAction(AIActionType.GENERATE_TITLE)}
                            className="bg-vip-800 hover:bg-vip-700 border border-vip-600 rounded-lg p-2 text-xs font-medium text-gray-200 transition-colors"
                        >
                            Đặt Tiêu Đề
                        </button>
                         <button 
                            disabled={isGenerating || !selectedNode}
                            onClick={() => handleAIAction(AIActionType.END_NODE)}
                            className="bg-vip-800 hover:bg-vip-700 border border-vip-600 rounded-lg p-2 text-xs font-medium text-gray-200 transition-colors"
                        >
                            Kết Thúc Mục
                        </button>
                         <button 
                            disabled={isGenerating || !selectedNode}
                            onClick={() => handleAIAction(AIActionType.DIRECT_NARRATOR)}
                            className="bg-vip-800 hover:bg-vip-700 border border-vip-600 rounded-lg p-2 text-xs font-medium text-gray-200 transition-colors"
                        >
                            Người Kể Chuyện
                        </button>
                    </div>

                    <div className="border-t border-vip-800 pt-4">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cài đặt nâng cao</label>
                         <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 rounded bg-vip-800 text-vip-300 border border-vip-700">Độ sáng tạo: 0.7</span>
                            <span className="text-xs px-2 py-1 rounded bg-vip-800 text-vip-300 border border-vip-700">Model: Gemini 3.0</span>
                         </div>
                    </div>

                    <VoiceStudio text={selectedNode?.content || ''} />
                </div>
            )}
        </aside>
      </div>

      {/* MODALS AND PANELS */}
      {gamificationPanelOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>}>
          <GamificationPanel 
            isOpen={gamificationPanelOpen} 
            onClose={() => setGamificationPanelOpen(false)} 
          />
        </Suspense>
      )}

      {storyTemplateOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-vip-900 rounded-xl border border-vip-700 max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-vip-800 flex justify-between items-center">
              <h3 className="text-vip-gold font-bold">Story Templates</h3>
              <button 
                onClick={() => setStoryTemplateOpen(false)}
                className="p-1 hover:bg-vip-700 rounded text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <p className="text-vip-300">Story Templates Panel - Coming Soon</p>
            </div>
          </div>
        </div>
      )}

      {createProjectOpen && (
        <CreateProjectPanelFinal 
          isOpen={createProjectOpen}
          onClose={() => setCreateProjectOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {storyDevelopmentOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-vip-900 rounded-xl border border-vip-700 max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-vip-800 flex justify-between items-center">
              <h3 className="text-vip-gold font-bold">Story Development</h3>
              <button 
                onClick={() => setStoryDevelopmentOpen(false)}
                className="p-1 hover:bg-vip-700 rounded text-gray-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <p className="text-vip-300">Story Development Panel - Coming Soon</p>
            </div>
          </div>
        </div>
      )}

      {/* API STATUS PANEL */}
      <APIStatusPanel />
      
      {/* LAZY LOADED PANELS */}
      <Suspense fallback={null}>
        <LocalLLMPanel />
        <HybridAIPanel />
        <AICharacterChatPanel />
        <AnalyticsDashboardPanel />
        <BlockchainPanel />
        <CharacterDevelopmentPanel />
        <CharacterVoicePanel />
        <CinematicScenePanel />
        <CollaborationPanel />
        <InteractiveStoryPanel />
        <MobileAppPanel />
        <MultiLanguagePanel />
        <MultiModalPanel />
        <MusicSoundPanel />
        <NovelStructurePanel />
        <ProjectLibraryPanel />
        <StoryArchitecturePanel />
        <StoryReaderPanel />
        <TrainingPanel />
        <UltimateAIPanel />
        <VisualEditorPanel />
        <VoiceLibraryPanel />
      </Suspense>
    </div>
  );
};

export default App;
