import React, { useState, useEffect, useRef } from 'react';
import { 
  Brush, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Move, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Download, 
  Upload, 
  Save, 
  Undo, 
  Redo, 
  Copy, 
  Paste, 
  Settings, 
  Palette, 
  Wand2, 
  Image, 
  FileImage, 
  User, 
  Sparkles, 
  RefreshCw, 
  Grid, 
  Ruler, 
  Maximize2, 
  Minimize2,
  Plus,
  Edit,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX
} from 'lucide-react';
import VisualEditorService from '../services/visualEditorService';

interface VisualEditorPanelProps {
  onEditorCreated?: (editor: any) => void;
  onImageGenerated?: (image: any) => void;
}

const VisualEditorPanel: React.FC<VisualEditorPanelProps> = ({ 
  onEditorCreated,
  onImageGenerated
}) => {
  const [visualService] = useState(() => new VisualEditorService());
  const [activeTab, setActiveTab] = useState<'canvas' | 'layers' | 'assets' | 'ai-tools' | 'settings'>('canvas');
  const [editors, setEditors] = useState<any[]>([]);
  const [activeEditor, setActiveEditor] = useState<any>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState('brush');
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const [zoom, setZoom] = useState(100);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [rulersEnabled, setRulersEnabled] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [brushSettings, setBrushSettings] = useState({
    size: 10,
    opacity: 1,
    hardness: 0.5,
    flow: 1,
    color: '#000000'
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadEditors();
    loadAssets();
  }, []);

  useEffect(() => {
    if (activeEditor) {
      loadLayers();
    }
  }, [activeEditor]);

  const loadEditors = () => {
    const allEditors = visualService.getAllEditors();
    setEditors(allEditors);
    
    if (allEditors.length > 0 && !activeEditor) {
      setActiveEditor(allEditors[0]);
    }
  };

  const loadAssets = () => {
    const allAssets = visualService.getAssets();
    setAssets(allAssets);
  };

  const loadLayers = () => {
    if (activeEditor) {
      setLayers(activeEditor.layers || []);
    }
  };

  const handleCreateEditor = async () => {
    try {
      const editor = await visualService.createEditor(
        'New Visual Editor',
        'illustration',
        canvasSize
      );
      
      setEditors([...editors, editor]);
      setActiveEditor(editor);
      onEditorCreated?.(editor);
      
    } catch (error) {
      console.error('Failed to create editor:', error);
    }
  };

  const handleGenerateIllustration = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const result = await visualService.generateIllustration(
        activeEditor?.id || 'default',
        aiPrompt,
        {
          width: canvasSize.width,
          height: canvasSize.height,
          quality: 'high',
          style: selectedStyle
        }
      );

      if (result.status === 'completed' && result.images.length > 0) {
        // Add generated image as new layer
        const layer = visualService.addLayer(
          activeEditor?.id || 'default',
          'ai_generated',
          'AI Generated Illustration',
          result.images[0].url
        );
        
        setLayers([...layers, layer]);
        onImageGenerated?.(result.images[0]);
      }

    } catch (error) {
      console.error('Failed to generate illustration:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleGenerateCharacterPortrait = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const portrait = await visualService.generateCharacterPortrait(
        aiPrompt,
        {
          age: 25,
          gender: 'other',
          ethnicity: 'mixed'
        },
        {
          traits: ['creative', 'empathetic'],
          mood: 'optimistic',
          attitude: 'friendly'
        }
      );

      // Add character portrait as layers
      const portraitLayer = visualService.addLayer(
        activeEditor?.id || 'default',
        'ai_generated',
        'Character Portrait',
        portrait.poses[0]?.image || ''
      );

      setLayers([...layers, portraitLayer]);
      onImageGenerated?.(portrait);

    } catch (error) {
      console.error('Failed to generate character portrait:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleApplyStyleTransfer = async () => {
    if (!activeEditor || layers.length === 0) return;

    try {
      const baseLayer = layers.find(l => l.type === 'raster');
      if (!baseLayer) return;

      const result = await visualService.applyStyleTransfer(
        activeEditor.id,
        baseLayer.content.data,
        selectedStyle
      );

      // Add styled image as new layer
      const styledLayer = visualService.addLayer(
        activeEditor.id,
        'ai_generated',
        'Style Transfer Result',
        result
      );

      setLayers([...layers, styledLayer]);

    } catch (error) {
      console.error('Failed to apply style transfer:', error);
    }
  };

  const handleEnhanceImage = async (layerId: string) => {
    try {
      const layer = layers.find(l => l.id === layerId);
      if (!layer) return;

      const enhanced = await visualService.enhanceImage(
        activeEditor?.id || 'default',
        layer.content.data,
        'upscale'
      );

      // Update layer with enhanced image
      const updatedLayers = layers.map(l => 
        l.id === layerId 
          ? { ...l, content: { ...l.content, data: enhanced } }
          : l
      );
      
      setLayers(updatedLayers);

    } catch (error) {
      console.error('Failed to enhance image:', error);
    }
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 500));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 10));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  const getToolIcon = (toolId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      brush: <Brush className="w-5 h-5" />,
      eraser: <Eraser className="w-5 h-5" />,
      fill: <Square className="w-5 h-5" />,
      circle: <Circle className="w-5 h-5" />,
      text: <Type className="w-5 h-5" />,
      move: <Move className="w-5 h-5" />,
      rotate: <RotateCw className="w-5 h-5" />,
      selection: <Square className="w-5 h-5" />,
      ai_generate: <Sparkles className="w-5 h-5" />
    };

    return iconMap[toolId] || <Brush className="w-5 h-5" />;
  };

  const renderCanvas = () => (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Canvas</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="border-l pl-2 flex items-center space-x-2">
              <button
                onClick={() => setGridEnabled(!gridEnabled)}
                className={`p-2 ${gridEnabled ? 'text-blue-500' : 'text-gray-500'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRulersEnabled(!rulersEnabled)}
                className={`p-2 ${rulersEnabled ? 'text-blue-500' : 'text-gray-500'}`}
              >
                <Ruler className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tool Palette */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          {[
            { id: 'brush', name: 'Brush' },
            { id: 'eraser', name: 'Eraser' },
            { id: 'fill', name: 'Fill' },
            { id: 'circle', name: 'Circle' },
            { id: 'square', name: 'Rectangle' },
            { id: 'text', name: 'Text' },
            { id: 'move', name: 'Move' },
            { id: 'rotate', name: 'Rotate' }
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`p-3 rounded flex flex-col items-center space-y-1 transition-colors ${
                selectedTool === tool.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getToolIcon(tool.id)}
              <span className="text-xs">{tool.name}</span>
            </button>
          ))}
        </div>

        {/* Brush Settings */}
        {selectedTool === 'brush' && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Brush Settings</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={brushSettings.size}
                  onChange={(e) => setBrushSettings({...brushSettings, size: parseInt(e.target.value)})}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{brushSettings.size}px</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={brushSettings.opacity}
                  onChange={(e) => setBrushSettings({...brushSettings, opacity: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{Math.round(brushSettings.opacity * 100)}%</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hardness</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={brushSettings.hardness}
                  onChange={(e) => setBrushSettings({...brushSettings, hardness: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{Math.round(brushSettings.hardness * 100)}%</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  value={brushSettings.color}
                  onChange={(e) => setBrushSettings({...brushSettings, color: e.target.value})}
                  className="w-full h-8"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Area */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="border-2 border-gray-300 rounded" style={{ height: '600px' }}>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="w-full h-full"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left'
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderLayers = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Layers</h3>
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Add Layer</span>
          </button>
        </div>

        <div className="space-y-2">
          {layers.map((layer, index) => (
            <div key={layer.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {/* Toggle visibility */}}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {/* Toggle lock */}}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <div className="w-12 h-12 bg-gray-200 rounded border-2 border-gray-300" />
                <div>
                  <div className="font-medium">{layer.name}</div>
                  <div className="text-sm text-gray-500">{layer.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={layer.opacity}
                  onChange={(e) => {/* Update opacity */}}
                  className="w-20"
                />
                <span className="text-sm text-gray-500 w-10">{Math.round(layer.opacity * 100)}%</span>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Assets</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-full h-20 bg-gray-200 rounded mb-2" />
              <div className="text-sm font-medium truncate">{asset.name}</div>
              <div className="text-xs text-gray-500">{asset.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAITools = () => (
    <div className="space-y-6">
      {/* AI Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Generation</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe what you want to generate..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="realistic">Realistic</option>
                <option value="anime">Anime</option>
                <option value="cartoon">Cartoon</option>
                <option value="oil_painting">Oil Painting</option>
                <option value="watercolor">Watercolor</option>
                <option value="pixel_art">Pixel Art</option>
                <option value="concept_art">Concept Art</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Canvas Size</label>
              <select
                value={`${canvasSize.width}x${canvasSize.height}`}
                onChange={(e) => {
                  const [width, height] = e.target.value.split('x').map(Number);
                  setCanvasSize({ width, height });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="512x512">512x512</option>
                <option value="1024x1024">1024x1024</option>
                <option value="1920x1080">1920x1080</option>
                <option value="2048x2048">2048x2048</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleGenerateIllustration}
              disabled={isGenerating || !aiPrompt.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Image className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Generate Illustration'}</span>
            </button>
            <button
              onClick={handleGenerateCharacterPortrait}
              disabled={isGenerating || !aiPrompt.trim()}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Character Portrait'}</span>
            </button>
            <button
              onClick={handleApplyStyleTransfer}
              disabled={isGenerating || layers.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>Style Transfer</span>
            </button>
          </div>

          {isGenerating && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Generating...</span>
                <span className="text-sm text-gray-500">{generationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Enhancement */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Enhancement</h3>
        
        <div className="space-y-3">
          {layers.filter(l => l.type === 'raster' || l.type === 'ai_generated').map((layer) => (
            <div key={layer.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded border-2 border-gray-300" />
                <div>
                  <div className="font-medium">{layer.name}</div>
                  <div className="text-sm text-gray-500">{layer.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEnhanceImage(layer.id)}
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                >
                  Upscale
                </button>
                <button
                  onClick={() => handleEnhanceImage(layer.id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  Denoise
                </button>
                <button
                  onClick={() => handleEnhanceImage(layer.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Sharpen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Editor Settings</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Canvas Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <input
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => setCanvasSize({...canvasSize, width: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <input
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => setCanvasSize({...canvasSize, height: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Display Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={gridEnabled}
                  onChange={(e) => setGridEnabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Grid</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rulersEnabled}
                  onChange={(e) => setRulersEnabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Rulers</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Performance Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="rounded"
                />
                <span className="text-sm">GPU Acceleration</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Brush className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Visual Editor</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'canvas', label: 'Canvas', icon: Brush },
            { id: 'layers', label: 'Layers', icon: Layers },
            { id: 'assets', label: 'Assets', icon: FileImage },
            { id: 'ai-tools', label: 'AI Tools', icon: Sparkles },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'canvas' && renderCanvas()}
        {activeTab === 'layers' && renderLayers()}
        {activeTab === 'assets' && renderAssets()}
        {activeTab === 'ai-tools' && renderAITools()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default VisualEditorPanel;
