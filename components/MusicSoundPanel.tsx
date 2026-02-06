import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Volume2, 
  Play, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Sliders,
  Headphones,
  Mic,
  Radio,
  Settings,
  Library,
  Clock,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react';
import MusicSoundLibrary from '../services/musicSoundLibrary';

interface MusicSoundPanelProps {
  onTrackCreated?: (track: any) => void;
  onSFXCreated?: (sfx: any) => void;
}

const MusicSoundPanel: React.FC<MusicSoundPanelProps> = ({ 
  onTrackCreated,
  onSFXCreated
}) => {
  const [musicLibrary] = useState(() => new MusicSoundLibrary());
  const [activeTab, setActiveTab] = useState<'music' | 'sfx' | 'playlists' | 'adaptive'>('music');
  const [musicTracks, setMusicTracks] = useState<any[]>([]);
  const [soundEffects, setSoundEffects] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<any>({});

  // Music generation form
  const [musicForm, setMusicForm] = useState({
    mood: 'neutral',
    genre: 'cinematic',
    duration: 120,
    tempo: 120,
    key: 'C',
    style: 'cinematic',
    instrumentation: 'piano,strings,percussion'
  });

  // SFX generation form
  const [sfxForm, setSfxForm] = useState({
    category: 'ambient',
    description: '',
    duration: 2,
    quality: 'high',
    style: 'realistic'
  });

  // Playlist form
  const [playlistForm, setPlaylistForm] = useState({
    name: '',
    description: '',
    mood: 'neutral',
    genre: 'mixed',
    crossfade: false,
    shuffle: false,
    repeat: false
  });

  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [isGeneratingSFX, setIsGeneratingSFX] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = () => {
    const library = musicLibrary.getActiveLibrary();
    if (library) {
      setMusicTracks(library.musicTracks);
      setSoundEffects(library.soundEffects);
      setPlaylists(library.playlists);
    }
  };

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    try {
      const track = await musicLibrary.generateBackgroundMusic(
        musicForm.mood,
        musicForm.genre,
        musicForm.duration,
        {
          style: musicForm.style,
          tempo: musicForm.tempo,
          key: musicForm.key,
          instrumentation: musicForm.instrumentation
        }
      );
      
      setMusicTracks([...musicTracks, track]);
      onTrackCreated?.(track);
      
      // Reset form
      setMusicForm({
        mood: 'neutral',
        genre: 'cinematic',
        duration: 120,
        tempo: 120,
        key: 'C',
        style: 'cinematic',
        instrumentation: 'piano,strings,percussion'
      });
      
    } catch (error) {
      console.error('Failed to generate music:', error);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handleGenerateSFX = async () => {
    if (!sfxForm.description) return;

    setIsGeneratingSFX(true);
    try {
      const sfx = await musicLibrary.generateSoundEffect(
        sfxForm.category as any,
        sfxForm.description,
        {
          duration: sfxForm.duration,
          quality: sfxForm.quality,
          style: sfxForm.style
        }
      );
      
      setSoundEffects([...soundEffects, sfx]);
      onSFXCreated?.(sfx);
      
      // Reset form
      setSfxForm({
        category: 'ambient',
        description: '',
        duration: 2,
        quality: 'high',
        style: 'realistic'
      });
      
    } catch (error) {
      console.error('Failed to generate SFX:', error);
    } finally {
      setIsGeneratingSFX(false);
    }
  };

  const handleSearch = () => {
    const results = musicLibrary.searchLibrary(searchQuery, searchFilters);
    setSearchResults(results);
  };

  const renderMusic = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Music Library</h3>
        
        {/* Generate Music Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Generate Background Music</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
              <select
                value={musicForm.mood}
                onChange={(e) => setMusicForm({...musicForm, mood: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="neutral">Neutral</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="dramatic">Dramatic</option>
                <option value="mysterious">Mysterious</option>
                <option value="romantic">Romantic</option>
                <option value="action">Action</option>
                <option value="horror">Horror</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={musicForm.genre}
                onChange={(e) => setMusicForm({...musicForm, genre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cinematic">Cinematic</option>
                <option value="classical">Classical</option>
                <option value="jazz">Jazz</option>
                <option value="rock">Rock</option>
                <option value="electronic">Electronic</option>
                <option value="ambient">Ambient</option>
                <option value="folk">Folk</option>
                <option value="pop">Pop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
              <input
                type="number"
                value={musicForm.duration}
                onChange={(e) => setMusicForm({...musicForm, duration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="30"
                max="600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tempo (BPM)</label>
              <input
                type="number"
                value={musicForm.tempo}
                onChange={(e) => setMusicForm({...musicForm, tempo: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="60"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
              <select
                value={musicForm.key}
                onChange={(e) => setMusicForm({...musicForm, key: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Instrumentation</label>
            <input
              type="text"
              value={musicForm.instrumentation}
              onChange={(e) => setMusicForm({...musicForm, instrumentation: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="piano,strings,percussion"
            />
          </div>

          <button
            onClick={handleGenerateMusic}
            disabled={isGeneratingMusic}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Music className="w-4 h-4" />
            <span>{isGeneratingMusic ? 'Generating...' : 'Generate Music'}</span>
          </button>
        </div>

        {/* Music Tracks List */}
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Music Tracks</h4>
          {musicTracks.map((track) => (
            <div key={track.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Music className="w-8 h-8 text-blue-500" />
                  <div>
                    <h5 className="font-medium">{track.title}</h5>
                    <p className="text-sm text-gray-600">{track.artist}</p>
                    <p className="text-xs text-gray-500">{track.genre} • {track.mood}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-green-500">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span>{track.tempo} BPM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gray-500" />
                  <span>{track.key}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span>{track.energy.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSFX = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Sound Effects Library</h3>
        
        {/* Generate SFX Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Generate Sound Effect</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={sfxForm.category}
                onChange={(e) => setSfxForm({...sfxForm, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ambient">Ambient</option>
                <option value="nature">Nature</option>
                <option value="weather">Weather</option>
                <option value="character">Character</option>
                <option value="action">Action</option>
                <option value="magic">Magic</option>
                <option value="technology">Technology</option>
                <option value="vehicles">Vehicles</option>
                <option value="weapons">Weapons</option>
                <option value="footsteps">Footsteps</option>
                <option value="doors">Doors</option>
                <option value="interface">Interface</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value={sfxForm.quality}
                onChange={(e) => setSfxForm({...sfxForm, quality: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={sfxForm.description}
              onChange={(e) => setSfxForm({...sfxForm, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the sound effect you want to generate"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
              <input
                type="number"
                value={sfxForm.duration}
                onChange={(e) => setSfxForm({...sfxForm, duration: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select
                value={sfxForm.style}
                onChange={(e) => setSfxForm({...sfxForm, style: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="realistic">Realistic</option>
                <option value="stylized">Stylized</option>
                <option value="synthetic">Synthetic</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateSFX}
            disabled={!sfxForm.description || isGeneratingSFX}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Mic className="w-4 h-4" />
            <span>{isGeneratingSFX ? 'Generating...' : 'Generate SFX'}</span>
          </button>
        </div>

        {/* Sound Effects List */}
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Sound Effects</h4>
          {soundEffects.map((sfx) => (
            <div key={sfx.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-8 h-8 text-green-500" />
                  <div>
                    <h5 className="font-medium">{sfx.name}</h5>
                    <p className="text-sm text-gray-600">{sfx.category}</p>
                    <p className="text-xs text-gray-500">{sfx.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-green-500">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{sfx.duration}s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-gray-500" />
                  <span>{sfx.metadata.sampleRate} Hz</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>{sfx.metadata.quality}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Headphones className="w-4 h-4 text-gray-500" />
                  <span>{sfx.metadata.channels}ch</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlaylists = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Playlists</h3>
        
        {/* Create Playlist Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Create Playlist</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Playlist Name</label>
              <input
                type="text"
                value={playlistForm.name}
                onChange={(e) => setPlaylistForm({...playlistForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter playlist name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={playlistForm.genre}
                onChange={(e) => setPlaylistForm({...playlistForm, genre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mixed">Mixed</option>
                <option value="cinematic">Cinematic</option>
                <option value="classical">Classical</option>
                <option value="jazz">Jazz</option>
                <option value="rock">Rock</option>
                <option value="electronic">Electronic</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={playlistForm.description}
              onChange={(e) => setPlaylistForm({...playlistForm, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your playlist"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={playlistForm.crossfade}
                  onChange={(e) => setPlaylistForm({...playlistForm, crossfade: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Crossfade</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={playlistForm.shuffle}
                  onChange={(e) => setPlaylistForm({...playlistForm, shuffle: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Shuffle</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={playlistForm.repeat}
                  onChange={(e) => setPlaylistForm({...playlistForm, repeat: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Repeat</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              if (playlistForm.name) {
                const playlist = musicLibrary.createPlaylist(
                  playlistForm.name,
                  playlistForm.description,
                  [],
                  playlistForm
                );
                setPlaylists([...playlists, playlist]);
                
                setPlaylistForm({
                  name: '',
                  description: '',
                  mood: 'neutral',
                  genre: 'mixed',
                  crossfade: false,
                  shuffle: false,
                  repeat: false
                });
              }
            }}
            disabled={!playlistForm.name}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Library className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        </div>

        {/* Playlists List */}
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Your Playlists</h4>
          {playlists.map((playlist) => (
            <div key={playlist.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Library className="w-8 h-8 text-purple-500" />
                  <div>
                    <h5 className="font-medium">{playlist.name}</h5>
                    <p className="text-sm text-gray-600">{playlist.genre}</p>
                    <p className="text-xs text-gray-500">{playlist.tracks.length} tracks</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-green-500">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{Math.floor(playlist.duration / 60)}:{(playlist.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>{playlist.crossfade ? 'Crossfade' : 'No Crossfade'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-gray-500" />
                  <span>{playlist.shuffle ? 'Shuffle' : 'Sequential'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-gray-500" />
                  <span>{playlist.repeat ? 'Repeat' : 'No Repeat'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdaptive = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Adaptive Audio</h3>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Adaptive Audio Profiles</h4>
          <p className="text-gray-600 mb-4">
            Create adaptive audio profiles that respond to story context, emotions, and actions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium mb-2">Emotion Triggers</h5>
              <p className="text-sm text-gray-600">Music changes based on character emotions</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium mb-2">Action Triggers</h5>
              <p className="text-sm text-gray-600">SFX respond to story actions</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-medium mb-2">Location Triggers</h5>
              <p className="text-sm text-gray-600">Ambient sounds adapt to locations</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h5 className="font-medium mb-2">Time Triggers</h5>
              <p className="text-sm text-gray-600">Audio changes with time of day</p>
            </div>
          </div>

          <button
            onClick={() => {
              const profile = musicLibrary.createAdaptiveProfile(
                'Default Adaptive Profile',
                'Automatically adjusts audio based on story context',
                [
                  { type: 'emotion', condition: 'happy', threshold: 0.7, parameters: {} },
                  { type: 'action', condition: 'combat', threshold: 0.8, parameters: {} }
                ],
                [
                  { triggerId: 'emotion', audioType: 'music', audioId: 'happy-music', blendMode: 'crossfade', parameters: { volume: 0.8 } }
                ]
              );
              console.log('Adaptive profile created:', profile);
            }}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Create Adaptive Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Music className="w-6 h-6 text-green-500 mr-2" />
          <h2 className="text-xl font-bold">Music & Sound Effects Library</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'music', label: 'Music', icon: Music },
            { id: 'sfx', label: 'Sound Effects', icon: Volume2 },
            { id: 'playlists', label: 'Playlists', icon: Library },
            { id: 'adaptive', label: 'Adaptive', icon: Zap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search music and sound effects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Search Results ({searchResults.length})</h4>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">{result.item.title || result.item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({result.type})</span>
                  </div>
                  <span className="text-sm text-gray-500">Relevance: {result.relevance}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'music' && renderMusic()}
        {activeTab === 'sfx' && renderSFX()}
        {activeTab === 'playlists' && renderPlaylists()}
        {activeTab === 'adaptive' && renderAdaptive()}
      </div>
    </div>
  );
};

export default MusicSoundPanel;
