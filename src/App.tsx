import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, 
  Heart, MonitorSpeaker, Share2, MoreHorizontal, Settings2, 
  ChevronDown, ListMusic, Upload, Download, Disc, Square, X,
  Music, Volume2, VolumeX
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';

import ReactPlayer from 'react-player';

type Track = { url: string; name: string; type: 'local' | 'youtube'; thumbnail?: string };

export default function App() {
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop');
  const [songName, setSongName] = useState('Midnight City');
  const [artistName, setArtistName] = useState('M83');
  const [bgType, setBgType] = useState<'blur' | 'color'>('blur');
  const [bgColor, setBgColor] = useState('#121212');
  const [progress, setProgress] = useState(35);
  const [currentTime, setCurrentTime] = useState(84); // 1:24
  const [duration, setDuration] = useState(219); // 3:39
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [imageStyle, setImageStyle] = useState<'square' | 'vinyl'>('square');
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
  const [imageZoom, setImageZoom] = useState(1);
  const [imageOffsetX, setImageOffsetX] = useState(0);
  const [imageOffsetY, setImageOffsetY] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [volume, setVolume] = useState(1);
  
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [overlayEffect, setOverlayEffect] = useState<'none' | 'snow' | 'rain'>('none');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isAddingYoutube, setIsAddingYoutube] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const currentTrack = playlist[currentTrackIndex];
    if (currentTrack?.type === 'youtube' && audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentTrackIndex, playlist]);

  const backgroundStyle = () => {
    if (bgType === 'blur') {
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {
      backgroundColor: bgColor,
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newTracks: Track[] = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name.replace(/\.[^/.]+$/, ""),
        type: 'local'
      }));
      
      setPlaylist(prev => {
        const updated = [...prev, ...newTracks];
        if (prev.length === 0) {
          setSongName(updated[0].name);
          setIsPlaying(true);
        }
        return updated;
      });
    }
  };

  const handleAddYoutube = async () => {
    if (!youtubeLink) return;
    setIsAddingYoutube(true);
    try {
      // Extract video ID to get a better thumbnail
      const videoIdMatch = youtubeLink.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      
      const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(youtubeLink)}`);
      const data = await response.json();
      
      if (data.error) {
        alert('Không thể lấy thông tin từ link YouTube này.');
        return;
      }

      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : data.thumbnail_url;

      const newTrack: Track = {
        url: youtubeLink,
        name: data.title,
        type: 'youtube',
        thumbnail: thumbnail
      };

      setPlaylist(prev => {
        const updated = [...prev, newTrack];
        if (prev.length === 0) {
          setSongName(newTrack.name);
          setImageUrl(newTrack.thumbnail || imageUrl);
          setIsPlaying(true);
        }
        return updated;
      });
      setYoutubeLink('');
    } catch (error) {
      console.error('Error adding youtube link:', error);
      alert('Có lỗi xảy ra khi thêm link YouTube.');
    } finally {
      setIsAddingYoutube(false);
    }
  };

  const playTrack = (index: number) => {
    const track = playlist[index];
    setSongName(track.name);
    if (track.thumbnail) {
      setImageUrl(track.thumbnail);
    }
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    playTrack(nextIndex);
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    playTrack(prevIndex);
  };

  const setupAudioContext = () => {
    if (!audioCtxRef.current && audioRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 256; // 128 frequency bins
        analyserRef.current.smoothingTimeConstant = 0.85;
        sourceNodeRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      } catch (e) {
        console.error("AudioContext setup failed", e);
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentTrack = playlist[currentTrackIndex];
    const isYoutube = currentTrack?.type === 'youtube';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const visualBins = 38; // Math.floor(64 * 0.6)
    const barHeight = (canvas.height / visualBins) * 0.7;
    const gap = (canvas.height / visualBins) * 0.3;
    let y = canvas.height - barHeight;

    if (isYoutube) {
      const time = Date.now() / 200;
      for (let i = 0; i < visualBins; i++) {
        let percent = 0.05;
        if (isPlaying) {
          const noise = Math.sin(time * 2 + i * 1.5) * Math.cos(time * 1.5 - i * 0.5);
          const beat = Math.pow(Math.sin(time * 3), 8) * 0.3;
          const bassBoost = i < 10 ? beat * (1 - i/10) : 0;
          percent = Math.abs(noise) * 0.5 + bassBoost + 0.1;
        }
        
        const barWidth = Math.max(percent * canvas.width, 4);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + percent * 0.7})`;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(canvas.width - barWidth, y, barWidth, barHeight, [4, 0, 0, 4]);
          ctx.fill();
        } else {
          ctx.fillRect(canvas.width - barWidth, y, barWidth, barHeight);
        }
        y -= (barHeight + gap);
      }
      return;
    }

    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    for (let i = 0; i < visualBins; i++) {
      const percent = dataArray[i] / 255;
      const barWidth = Math.max(percent * canvas.width, 4);
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + percent * 0.7})`;
      
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(canvas.width - barWidth, y, barWidth, barHeight, [4, 0, 0, 4]);
        ctx.fill();
      } else {
        ctx.fillRect(canvas.width - barWidth, y, barWidth, barHeight);
      }
      
      y -= (barHeight + gap);
    }
  };

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    
    const currentTrack = playlist[currentTrackIndex];
    if (!currentTrack || currentTrack.type === 'local') {
      setupAudioContext();
      if (audioRef.current) {
        if (nextState) {
          audioRef.current.play().catch(e => {
            if (e.name !== 'AbortError') console.error(e);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    const currentTrack = playlist[currentTrackIndex];
    if (currentTrack?.type === 'local' && audioRef.current && !isCapturing) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    }
  };

  const handleLoadedMetadata = () => {
    const currentTrack = playlist[currentTrackIndex];
    if (currentTrack?.type === 'local' && audioRef.current) {
      setDuration(audioRef.current.duration);
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.error(e);
        });
      }
    }
  };

  const handleYoutubeProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!isCapturing) {
      const target = e.target as HTMLVideoElement;
      setCurrentTime(target.currentTime);
      setProgress((target.currentTime / target.duration) * 100 || 0);
    }
  };

  const handleYoutubeDuration = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.target as HTMLVideoElement;
    setDuration(target.duration);
  };

  const handleManualProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    const newTime = (val / 100) * duration;
    setCurrentTime(newTime);
    
    const currentTrack = playlist[currentTrackIndex];
    if (currentTrack?.type === 'local' && audioRef.current) {
      audioRef.current.currentTime = newTime;
    } else if (currentTrack?.type === 'youtube' && playerRef.current) {
      (playerRef.current as any).currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (!frameRef.current) return;
    setIsDownloading(true);
    setIsCapturing(true); // Pauses vinyl animation without stopping audio
    
    try {
      // Wait a tiny bit for the CSS animation to stop
      await new Promise(resolve => setTimeout(resolve, 50));

      const dataUrl = await htmlToImage.toPng(frameRef.current, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
        backgroundColor: 'rgba(0,0,0,0)',
        style: {
          transform: 'scale(1)',
          borderRadius: '40px',
          overflow: 'hidden',
          margin: '0',
        }
      });
      
      const link = document.createElement('a');
      link.download = `${songName || 'spotify-frame'}.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại. (Lưu ý: Một số ảnh từ link ngoài có thể chặn tải xuống do bảo mật CORS. Hãy thử tải ảnh lên từ máy của bạn)');
    } finally {
      setIsDownloading(false);
      setIsCapturing(false);
    }
  };

  // Weather Effects
  useEffect(() => {
    const canvas = effectCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (overlayEffect === 'none') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationId: number;
    let particles: any[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particleCount = overlayEffect === 'rain' ? 120 : overlayEffect === 'snow' ? 100 : 0;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedY: overlayEffect === 'rain' ? 10 + Math.random() * 6 : 1 + Math.random() * 2,
        speedX: overlayEffect === 'rain' ? 0 : -1 + Math.random() * 2,
        size: overlayEffect === 'rain' ? Math.random() * 1.5 + 0.5 : Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        angle: overlayEffect === 'rain' ? 0 : Math.random() * Math.PI * 2,
        spin: overlayEffect === 'rain' ? 0 : (Math.random() - 0.5) * 0.1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;
        
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        if (overlayEffect === 'rain') {
          ctx.fillStyle = `rgba(200, 220, 255, ${p.opacity * 0.6})`;
          ctx.fillRect(0, 0, p.size, p.size * 15);
        } else if (overlayEffect === 'snow') {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [overlayEffect]);

  useEffect(() => {
    if (isPlaying) {
      setupAudioContext();
      const draw = () => {
        drawVisualizer();
        animationRef.current = requestAnimationFrame(draw);
      };
      draw();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        canvas.width = entry.contentRect.width * (window.devicePixelRatio || 1);
        canvas.height = entry.contentRect.height * (window.devicePixelRatio || 1);
      }
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="min-h-[100dvh] relative flex items-center justify-center overflow-hidden font-sans text-white bg-black">
      {/* Weather Effects Canvas */}
      <canvas 
        ref={effectCanvasRef} 
        className="fixed inset-0 pointer-events-none z-20" 
      />

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={playlist[currentTrackIndex]?.type === 'local' ? playlist[currentTrackIndex].url : undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        crossOrigin="anonymous"
      />
      
      {/* Hidden YouTube Player */}
      {playlist[currentTrackIndex]?.type === 'youtube' && (
        <div className="hidden">
          {/* @ts-ignore */}
          <ReactPlayer
            ref={playerRef}
            src={playlist[currentTrackIndex].url}
            playing={isPlaying}
            volume={volume}
            onTimeUpdate={handleYoutubeProgress}
            onLoadedMetadata={handleYoutubeDuration}
            onEnded={handleNext}
            width="0"
            height="0"
            config={{
              youtube: {
                playerVars: { showinfo: 0, controls: 0 }
              }
            } as any}
          />
        </div>
      )}

      {/* Background */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-1000 ${bgType === 'blur' ? 'blur-3xl scale-110 opacity-60' : 'opacity-100'}`}
        style={backgroundStyle()}
      />
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.8)_100%)]" />

      {/* Main Content */}
      <div className="relative z-10 flex w-full p-4 sm:p-6 items-center justify-center min-h-[100dvh]">
        
        <div className="relative w-full max-w-[400px] mx-auto">
          {/* Glow Behind Player */}
          <div className="absolute inset-0 bg-white/10 blur-[100px] rounded-full z-0 pointer-events-none" />

          {/* Vertical Visualizer */}
          <div className="absolute right-full top-8 bottom-8 w-12 md:w-16 mr-2 md:mr-4 pointer-events-none z-0 opacity-80 hidden sm:block">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Spotify Player Frame */}
          <div 
            ref={frameRef}
            className="w-full bg-black/40 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col relative overflow-hidden"
          >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 relative z-10">
            <button className="p-3 -ml-3 text-white/70 hover:text-white transition-colors">
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-medium tracking-widest uppercase text-white/70">Playing from playlist</span>
              <span className="text-xs font-bold text-white">Liked Songs</span>
            </div>
            <button className="p-3 -mr-3 text-white/70 hover:text-white transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Album Art */}
          <div className={`relative w-full aspect-square mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden group flex items-center justify-center z-10 ${imageStyle === 'vinyl' ? 'rounded-full' : 'rounded-xl'}`}>
            {imageStyle === 'vinyl' && (
              <div className="absolute inset-0 z-20 rounded-full border-[12px] border-black/80 shadow-inner flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/90 border border-white/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
              </div>
            )}
            <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 ${imageStyle === 'vinyl' ? (isPlaying && !isCapturing ? 'animate-[spin_10s_linear_infinite]' : '') : 'group-hover:scale-105'}`}>
              <img 
                src={imageUrl || undefined} 
                alt="Album Art" 
                className="w-full h-full"
                style={{ 
                  objectFit: imageFit,
                  transform: imageStyle === 'square' ? `scale(${imageZoom}) translate(${imageOffsetX}%, ${imageOffsetY}%)` : undefined
                }}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop';
                }}
              />
            </div>
          </div>

          {/* Song Info */}
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex flex-col overflow-hidden pr-4">
              <h2 className="text-2xl font-bold text-white truncate mb-1 tracking-tight">{songName}</h2>
              <p className="text-base text-white/70 truncate">{artistName}</p>
            </div>
            <button className="p-3 -mr-3 text-green-500 hover:scale-110 transition-transform flex-shrink-0">
              <Heart className="w-7 h-7" fill="currentColor" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 relative z-10">
            <div className="relative w-full h-8 flex items-center cursor-pointer group mb-1">
              {/* Visible Track */}
              <div className="h-1.5 bg-white/20 rounded-full w-full overflow-hidden relative pointer-events-none">
                <div 
                  className="h-full bg-white group-hover:bg-green-500 transition-colors relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow" />
                </div>
              </div>
              {/* Invisible Input for Touch */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.1"
                value={progress}
                onChange={handleManualProgress}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[11px] text-white/60 font-medium px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{playlist.length > 0 ? formatTime(duration) : "0:00"}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6 px-2 relative z-10">
            <button className="p-3 -ml-3 text-green-500 hover:text-green-400 transition-colors relative">
              <Shuffle className="w-5 h-5" />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
            </button>
            <button className="p-3 text-white hover:text-white/80 transition-colors" onClick={handlePrev}>
              <SkipBack className="w-9 h-9 fill-current" />
            </button>
            <button 
              className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>
            <button className="p-3 text-white hover:text-white/80 transition-colors" onClick={handleNext}>
              <SkipForward className="w-9 h-9 fill-current" />
            </button>
            <button className="p-3 -mr-3 text-white/70 hover:text-white transition-colors">
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-between items-center text-white/70 mt-2 relative z-10">
            <div className="flex items-center gap-2 group relative">
              <button 
                className="p-3 -ml-3 hover:text-white transition-colors"
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
              >
                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <MonitorSpeaker className="w-5 h-5" />}
              </button>
              <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 ease-in-out flex items-center h-10">
                <input 
                  type="range" 
                  min="0" max="1" step="0.01" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
              <button className="p-3 -mr-3 hover:text-white transition-colors"><ListMusic className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Settings Panel Drawer */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-sm bg-black/90 backdrop-blur-2xl border-l border-white/10 p-6 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${showControls ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 mt-[env(safe-area-inset-top,1rem)]">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-bold tracking-tight">Tùy chỉnh</h3>
          </div>
          <button 
            onClick={() => setShowControls(false)} 
            className="text-white/50 hover:text-white transition-colors p-3 -mr-3"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Audio Upload */}
          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">File nhạc (Audio)</label>
            <div className="flex gap-2 mb-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/70 truncate flex items-center">
                {playlist.length > 0 ? `Đã tải ${playlist.length} bài hát` : 'Chưa có file nhạc'}
              </div>
              <label className="flex-shrink-0 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 cursor-pointer flex items-center justify-center" title="Tải nhạc lên">
                <Music className="w-4 h-4" />
                <input type="file" accept="audio/*" multiple className="hidden" onChange={handleAudioUpload} />
              </label>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nhập link YouTube..." 
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
              />
              <button 
                onClick={handleAddYoutube}
                disabled={!youtubeLink || isAddingYoutube}
                className="flex-shrink-0 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                {isAddingYoutube ? 'Đang tải...' : 'Thêm'}
              </button>
            </div>
          </div>

          {/* Effects */}
          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-widest">Hiệu ứng (Effects)</label>
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setOverlayEffect('none')}
                className={`py-2 text-xs rounded-lg font-medium transition-all ${overlayEffect === 'none' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Không (None)
              </button>
              <button 
                onClick={() => setOverlayEffect('snow')}
                className={`py-2 text-xs rounded-lg font-medium transition-all ${overlayEffect === 'snow' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Tuyết (Snow)
              </button>
              <button 
                onClick={() => setOverlayEffect('rain')}
                className={`py-2 text-xs rounded-lg font-medium transition-all ${overlayEffect === 'rain' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Mưa (Rain)
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">Ảnh bài hát (Image)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:bg-white/10 transition-all min-w-0"
                placeholder="https://..."
              />
              <label className="flex-shrink-0 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 cursor-pointer flex items-center justify-center" title="Tải ảnh lên">
                <Upload className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setImageUrl)} />
              </label>
            </div>
          </div>

          {/* Image Style */}
          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-widest">Kiểu ảnh (Image Style)</label>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 mb-3">
              <button 
                onClick={() => setImageStyle('square')}
                className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${imageStyle === 'square' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <Square className="w-4 h-4" /> Vuông
              </button>
              <button 
                onClick={() => setImageStyle('vinyl')}
                className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${imageStyle === 'vinyl' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <Disc className="w-4 h-4" /> Đĩa than
              </button>
            </div>

            <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-widest">Hiển thị ảnh (Image Fit)</label>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 mb-3">
              <button 
                onClick={() => setImageFit('cover')}
                className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all ${imageFit === 'cover' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Lấp đầy (Cover)
              </button>
              <button 
                onClick={() => setImageFit('contain')}
                className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all ${imageFit === 'contain' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Vừa vặn (Contain)
              </button>
            </div>

            {imageStyle === 'square' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest flex justify-between">
                    <span>Thu phóng ảnh (Zoom)</span>
                    <span className="text-green-500">{imageZoom.toFixed(1)}x</span>
                  </label>
                  <div className="relative w-full h-8 flex items-center cursor-pointer">
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.1"
                      value={imageZoom}
                      onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                      className="w-full accent-green-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest flex justify-between">
                    <span>Căn ngang (Pan X)</span>
                    <span className="text-green-500">{imageOffsetX}%</span>
                  </label>
                  <div className="relative w-full h-8 flex items-center cursor-pointer">
                    <input 
                      type="range" 
                      min="-50" 
                      max="50" 
                      step="1"
                      value={imageOffsetX}
                      onChange={(e) => setImageOffsetX(parseInt(e.target.value))}
                      className="w-full accent-green-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest flex justify-between">
                    <span>Căn dọc (Pan Y)</span>
                    <span className="text-green-500">{imageOffsetY}%</span>
                  </label>
                  <div className="relative w-full h-8 flex items-center cursor-pointer">
                    <input 
                      type="range" 
                      min="-50" 
                      max="50" 
                      step="1"
                      value={imageOffsetY}
                      onChange={(e) => setImageOffsetY(parseInt(e.target.value))}
                      className="w-full accent-green-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">Tên bài hát (Song Name)</label>
            <input 
              type="text" 
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:bg-white/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">Tên ca sĩ (Artist Name)</label>
            <input 
              type="text" 
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:bg-white/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest flex justify-between">
              <span>Tiến trình (Progress)</span>
              <span className="text-green-500">{formatTime(currentTime)}</span>
            </label>
            <div className="relative w-full h-8 flex items-center cursor-pointer">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.1"
                value={progress}
                onChange={handleManualProgress}
                className="w-full accent-green-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest flex justify-between">
              <span>Âm lượng (Volume)</span>
              <span className="text-green-500">{Math.round(volume * 100)}%</span>
            </label>
            <div className="flex items-center gap-3">
              <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="p-2 -ml-2 text-white/50 hover:text-white transition-colors">
                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="relative w-full h-8 flex items-center cursor-pointer">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-green-500 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/50 mb-2 uppercase tracking-widest">Kiểu nền (Background Type)</label>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setBgType('blur')}
                className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all ${bgType === 'blur' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Mờ (Blur)
              </button>
              <button 
                onClick={() => setBgType('color')}
                className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all ${bgType === 'color' ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                Màu (Color)
              </button>
            </div>
          </div>

          {bgType === 'color' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">Màu nền (Background Color)</label>
              <div className="flex gap-3 items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                  <input 
                    type="color" 
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                  />
                </div>
                <input 
                  type="text" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:bg-white/10 transition-all font-mono uppercase"
                />
              </div>
            </div>
          )}

          {/* Download Button */}
          <div className="pt-4 border-t border-white/10 mt-6">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isDownloading ? 'Đang tải...' : 'Tải ảnh xuống (Download)'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setShowControls(true)}
        className={`fixed bottom-6 right-6 z-40 bg-green-500 text-black p-4 rounded-full shadow-[0_8px_30px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 ${showControls ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Settings2 className="w-6 h-6" />
      </button>
    </div>
  );
}
