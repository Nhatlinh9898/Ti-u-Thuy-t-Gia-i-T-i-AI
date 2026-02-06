import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  User, 
  Bot, 
  Send, 
  Plus, 
  Settings, 
  UserPlus, 
  Brain, 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  Zap, 
  Clock, 
  TrendingUp,
  Activity,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  MoreVertical,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  BarChart3,
  Users,
  Star,
  Target,
  Eye,
  EyeOff
} from 'lucide-react';
import AICharacterChatService from '../services/aiCharacterChatService';

interface AICharacterChatPanelProps {
  onCharacterCreated?: (character: any) => void;
  onSessionStarted?: (session: any) => void;
}

const AICharacterChatPanel: React.FC<AICharacterChatPanelProps> = ({ 
  onCharacterCreated,
  onSessionStarted
}) => {
  const [chatService] = useState(() => new AICharacterChatService());
  const [activeTab, setActiveTab] = useState<'characters' | 'chat' | 'sessions' | 'analytics'>('characters');
  const [characters, setCharacters] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCharacterDetails, setShowCharacterDetails] = useState(false);
  const [showSessionAnalytics, setShowSessionAnalytics] = useState(false);

  // Character creation form
  const [characterForm, setCharacterForm] = useState({
    name: '',
    description: '',
    personality: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
      creativity: 50,
      humor: 50,
      empathy: 50,
      curiosity: 50,
      confidence: 50
    },
    background: {
      age: 25,
      occupation: '',
      education: '',
      hometown: '',
      family: '',
      skills: '',
      hobbies: '',
      beliefs: '',
      goals: '',
      fears: ''
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = () => {
    setCharacters(chatService.getAllCharacters());
    setSessions(chatService.getAllSessions());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateCharacter = async () => {
    try {
      const character = await chatService.createCharacterProfile(
        characterForm.name,
        characterForm.description,
        characterForm.personality,
        characterForm.background
      );
      
      setCharacters([...characters, character]);
      onCharacterCreated?.(character);
      
      // Reset form
      setCharacterForm({
        name: '',
        description: '',
        personality: {
          openness: 50,
          conscientiousness: 50,
          extraversion: 50,
          agreeableness: 50,
          neuroticism: 50,
          creativity: 50,
          humor: 50,
          empathy: 50,
          curiosity: 50,
          confidence: 50
        },
        background: {
          age: 25,
          occupation: '',
          education: '',
          hometown: '',
          family: '',
          skills: '',
          hobbies: '',
          beliefs: '',
          goals: '',
          fears: ''
        }
      });
      
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const handleStartChat = (character: any) => {
    const session = chatService.startChatSession(character.id, 'user', {
      location: 'chat-room',
      timeOfDay: 'day',
      weather: 'clear',
      situation: 'casual'
    });
    
    setActiveCharacter(character);
    setActiveSession(session);
    setMessages([]);
    setActiveTab('chat');
    onSessionStarted?.(session);
    loadData();
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeSession) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      emotion: 'neutral',
      intent: 'statement'
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(activeSession.id, inputMessage);
      
      const characterMessage = {
        id: `character-${Date.now()}`,
        sender: 'character',
        content: response.content,
        timestamp: new Date(),
        emotion: response.emotion,
        intent: response.intent,
        metadata: response.metadata
      };

      setMessages(prev => [...prev, characterMessage]);
      loadData();
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndSession = () => {
    if (activeSession) {
      chatService.endSession(activeSession.id);
      setActiveSession(null);
      setActiveCharacter(null);
      setMessages([]);
      setActiveTab('sessions');
      loadData();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="w-4 h-4 text-green-500" />;
      case 'sad': return <Frown className="w-4 h-4 text-blue-500" />;
      case 'angry': return <Zap className="w-4 h-4 text-red-500" />;
      case 'neutral': return <Meh className="w-4 h-4 text-gray-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderCharacters = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Character Library</h3>
        
        {/* Create Character Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Create New Character</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Character Name</label>
              <input
                type="text"
                value={characterForm.name}
                onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter character name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={characterForm.description}
                onChange={(e) => setCharacterForm({...characterForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Describe your character"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Personality Traits</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(characterForm.personality).map(([trait, value]) => (
                <div key={trait}>
                  <label className="block text-xs text-gray-600 mb-1 capitalize">{trait}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setCharacterForm({
                      ...characterForm,
                      personality: {
                        ...characterForm.personality,
                        [trait]: parseInt(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Age</label>
                <input
                  type="number"
                  value={characterForm.background.age}
                  onChange={(e) => setCharacterForm({
                    ...characterForm,
                    background: {
                      ...characterForm.background,
                      age: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Occupation</label>
                <input
                  type="text"
                  value={characterForm.background.occupation}
                  onChange={(e) => setCharacterForm({
                    ...characterForm,
                    background: {
                      ...characterForm.background,
                      occupation: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Occupation"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Education</label>
                <input
                  type="text"
                  value={characterForm.background.education}
                  onChange={(e) => setCharacterForm({
                    ...characterForm,
                    background: {
                      ...characterForm.background,
                      education: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Education"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hometown</label>
                <input
                  type="text"
                  value={characterForm.background.hometown}
                  onChange={(e) => setCharacterForm({
                    ...characterForm,
                    background: {
                      ...characterForm.background,
                      hometown: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hometown"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateCharacter}
            disabled={!characterForm.name || !characterForm.description}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Character</span>
          </button>
        </div>

        {/* Characters List */}
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Your Characters</h4>
          {characters.map((character) => (
            <div key={character.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h5 className="font-medium">{character.name}</h5>
                    <p className="text-sm text-gray-600">{character.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">Age: {character.background.age}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{character.background.occupation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCharacterDetails(!showCharacterDetails)}
                    className="p-2 text-gray-500 hover:text-blue-500"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStartChat(character)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Chat</span>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showCharacterDetails && (
                <div className="border-t pt-4 mt-4">
                  <h5 className="font-medium mb-2">Personality Traits</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                    {Object.entries(character.personality).map(([trait, value]) => (
                      <div key={trait} className="text-xs">
                        <span className="capitalize">{trait}:</span>
                        <span className="ml-1 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h5 className="font-medium mb-2">Background</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Education:</span> {character.background.education}</div>
                    <div><span className="font-medium">Hometown:</span> {character.background.hometown}</div>
                    <div><span className="font-medium">Family:</span> {character.background.family}</div>
                    <div><span className="font-medium">Skills:</span> {character.background.skills}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">{activeCharacter?.name || 'Character'}</h3>
              <p className="text-sm text-gray-600">
                {activeSession ? 'Active' : 'No active session'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-gray-500 hover:text-blue-500"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 ${isRecording ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={handleEndSession}
              className="p-2 text-gray-500 hover:text-red-500"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.sender === 'character' && getEmotionIcon(message.emotion)}
                <span className="text-xs opacity-75">
                  {message.sender === 'user' ? 'You' : activeCharacter?.name}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
              <div className="text-xs opacity-75 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span className="text-sm">Character is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!activeSession}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !activeSession}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Chat Sessions</h3>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h5 className="font-medium">
                      {characters.find(c => c.id === session.characterId)?.name || 'Unknown Character'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {new Date(session.startTime).toLocaleDateString()} • {session.metadata.messageCount} messages
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        Duration: {Math.floor(session.metadata.duration / 60000)}m
                      </span>
                      <span className="text-xs text-gray-500">
                        Quality: {session.metadata.quality}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSessionAnalytics(!showSessionAnalytics)}
                    className="p-2 text-gray-500 hover:text-blue-500"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showSessionAnalytics && (
                <div className="border-t pt-4 mt-4">
                  <h5 className="font-medium mb-2">Session Analytics</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{session.state.engagementLevel}%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{session.state.satisfactionLevel}%</div>
                      <div className="text-xs text-gray-500">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">{session.state.trustLevel}%</div>
                      <div className="text-xs text-gray-500">Trust</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">{session.state.intimacyLevel}%</div>
                      <div className="text-xs text-gray-500">Intimacy</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h6 className="font-medium mb-2">Topics Discussed</h6>
                    <div className="flex flex-wrap gap-2">
                      {session.metadata.topicsDiscussed.map((topic: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Character Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{characters.length}</span>
            </div>
            <div className="text-sm text-gray-600">Total Characters</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{sessions.length}</span>
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">
                {sessions.filter(s => !s.endTime).length}
              </span>
            </div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">
                {sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.metadata.quality, 0) / sessions.length) : 0}%
              </span>
            </div>
            <div className="text-sm text-gray-600">Avg Quality</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Character Performance</h4>
            <div className="space-y-3">
              {characters.map((character) => {
                const characterSessions = sessions.filter(s => s.characterId === character.id);
                const avgQuality = characterSessions.length > 0 
                  ? Math.round(characterSessions.reduce((acc, s) => acc + s.metadata.quality, 0) / characterSessions.length)
                  : 0;
                
                return (
                  <div key={character.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">{character.name}</div>
                        <div className="text-sm text-gray-500">{characterSessions.length} sessions</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-medium">{avgQuality}%</div>
                        <div className="text-xs text-gray-500">Quality</div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${avgQuality}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {sessions
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .slice(0, 5)
                .map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">
                          {characters.find(c => c.id === session.characterId)?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.startTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{session.metadata.messageCount}</div>
                      <div className="text-xs text-gray-500">Messages</div>
                    </div>
                  </div>
                ))}
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
          <MessageCircle className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">AI Character Chat System</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'characters', label: 'Characters', icon: Users },
            { id: 'chat', label: 'Chat', icon: MessageCircle },
            { id: 'sessions', label: 'Sessions', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default AICharacterChatPanel;
