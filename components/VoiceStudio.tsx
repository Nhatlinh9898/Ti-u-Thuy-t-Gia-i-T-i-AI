import React, { useState, useEffect } from 'react';
import { Play, Square, Settings, Volume2, Download } from 'lucide-react';

interface VoiceStudioProps {
  text: string;
}

const VoiceStudio: React.FC<VoiceStudioProps> = ({ text }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      // Filter for Vietnamese if possible, otherwise list all
      const viVoices = available.filter(v => v.lang.includes('vi'));
      setVoices(viVoices.length > 0 ? viVoices : available);
      if (viVoices.length > 0 && !selectedVoice) setSelectedVoice(viVoices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = () => {
    if (!text) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate;
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="bg-vip-800/50 backdrop-blur-md border border-vip-500/30 rounded-xl p-4 mt-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3 text-vip-300">
        <Volume2 size={20} />
        <h3 className="font-serif font-bold text-lg text-vip-gold">VOICE STUDIO PRO</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <select 
            className="flex-1 bg-vip-900 border border-vip-500/50 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:border-vip-gold"
            onChange={(e) => {
              const voice = voices.find(v => v.name === e.target.value);
              setSelectedVoice(voice || null);
            }}
            value={selectedVoice?.name || ''}
          >
            {voices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-vip-300">
          <span>Tốc độ: {rate}x</span>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={rate} 
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="flex-1 accent-vip-gold h-1 bg-vip-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex gap-2 mt-2">
          {!isPlaying ? (
            <button 
              onClick={handleSpeak}
              disabled={!text}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-vip-500 to-indigo-600 hover:from-vip-400 hover:to-indigo-500 text-white py-2 rounded-lg font-medium transition-all shadow-lg disabled:opacity-50"
            >
              <Play size={16} fill="currentColor" /> Đọc Ngay
            </button>
          ) : (
            <button 
              onClick={handleStop}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-500 text-white py-2 rounded-lg font-medium transition-all shadow-lg"
            >
              <Square size={16} fill="currentColor" /> Dừng
            </button>
          )}
          
          <button className="px-3 py-2 bg-vip-700/50 hover:bg-vip-700 rounded-lg text-vip-300 transition-colors" title="Tải xuống MP3 (Giả lập)">
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceStudio;
