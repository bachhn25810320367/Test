import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, 
  Heart, MonitorSpeaker, Share2, MoreHorizontal, Settings2, 
  ChevronDown, ListMusic, Upload, Download, Disc, Square, X,
  Music, Volume2, VolumeX, Radio
} from 'lucide-react';
import html2canvas from 'html2canvas';
import ReactPlayer from 'react-player';

const Player = ReactPlayer as any;

const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'enter' | 'spin' | 'vibrate' | 'exit'>('enter');

  useEffect(() => {
    const schedule = [
      { t: 100, fn: () => setPhase('enter') },
      { t: 1500, fn: () => setPhase('spin') },
      { t: 3500, fn: () => setPhase('vibrate') },
      { t: 5500, fn: () => setPhase('exit') },
      { t: 6500, fn: () => onComplete() }
    ];
    const timers = schedule.map(s => setTimeout(s.fn, s.t));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-parchment flex items-center justify-center overflow-hidden font-sans select-none
      ${phase === 'exit' ? 'animate-[fadeOut_1s_ease-out_forwards] pointer-events-none' : ''}
    `}>
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold/10 blur-[120px] transition-all duration-[3000ms] ${phase === 'spin' ? 'translate-x-[50%] translate-y-[50%]' : ''}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold/5 blur-[120px] transition-all duration-[3000ms] ${phase === 'spin' ? 'translate-x-[-50%] translate-y-[-50%]' : ''}`} />
      </div>

      <div className="relative w-full max-w-2xl aspect-square flex flex-col items-center justify-center">
        <div className={`relative w-64 h-64 border-2 border-ink/10 rounded-full flex items-center justify-center transition-all duration-1000
          ${phase === 'spin' ? 'rotate-[360deg] border-gold shadow-[0_0_60px_rgba(197,160,89,0.1)]' : ''}
          ${phase === 'vibrate' ? 'animate-pulse scale-110' : ''}
        `}>
          <Disc className={`w-32 h-32 text-ink/20 transition-colors duration-1000 ${phase === 'spin' ? 'text-gold' : ''}`} />
          
          {/* Floating Notes */}
          {(phase === 'vibrate' || phase === 'spin') && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <Music 
                  key={i} 
                  className="absolute text-gold animate-[noteFloat_2.5s_ease-out_infinite]" 
                  style={{ 
                    left: `${15 + Math.random() * 70}%`, 
                    top: `${15 + Math.random() * 70}%`,
                    animationDelay: `${i * 0.4}s`,
                    opacity: 0.6
                  }} 
                  size={20 + Math.random() * 10}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center relative z-10">
          <div className="overflow-hidden">
            <h1 className="text-5xl font-serif italic text-ink mb-2 animate-[inkBleed_1.5s_ease-out]">Sonic Archive</h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-gold opacity-60 animate-[popIn_1s_ease-out_0.5s_both]">Capturing Celestial Harmonies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

type Track = { url: string; name: string; type: 'local' | 'youtube'; thumbnail?: string };

export const SpotifyTool = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop');
  const [songName, setSongName] = useState('Midnight City');
  const [artistName, setArtistName] = useState('M83');
  const [bgType, setBgType] = useState<'blur' | 'color'>('color');
  const [bgColor, setBgColor] = useState('#f5f2ed');
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
      try {
        audioRef.current.src = '';
        audioRef.current.load();
      } catch (e) {
        // Ignore abort errors
      }
    }
  }, [currentTrackIndex, playlist]);

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
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
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

  if (showIntro) {
    return <IntroSequence onComplete={() => setShowIntro(false)} />;
  }

  const backgroundStyle = () => {
    return {
      backgroundColor: '#f5f2ed',
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

  const addYoutubeTrack = async () => {
    if (!youtubeLink) return;
    setIsAddingYoutube(true);
    try {
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

  const removeTrack = (index: number) => {
    setPlaylist(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (currentTrackIndex === index) {
        const nextIndex = updated.length > 0 ? Math.min(index, updated.length - 1) : 0;
        setCurrentTrackIndex(nextIndex);
        if (updated.length > 0) playTrack(nextIndex);
        else setIsPlaying(false);
      } else if (currentTrackIndex > index) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      }
      return updated;
    });
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
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.5;
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
    
    const visualBins = 38;
    const barHeight = (canvas.height / visualBins) * 0.7;
    const gap = (canvas.height / visualBins) * 0.3;
    let y = canvas.height - barHeight;

    if (isYoutube) {
      const time = Date.now() / 150;
      for (let i = 0; i < visualBins; i++) {
        let percent = 0.05;
        if (isPlaying) {
          const noise = Math.sin(time * 3 + i * 2) * Math.cos(time * 2 - i * 0.8);
          const beat = Math.pow(Math.sin(time * 4), 16) * 0.8; 
          const bassBoost = i < 15 ? beat * (1 - i/15) : 0;
          percent = Math.abs(noise) * 0.4 + bassBoost + 0.05;
          percent = Math.pow(percent, 1.5);
        }
        
        const barWidth = Math.max(percent * canvas.width, 4);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + percent * 0.7})`;
        
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(canvas.width - barWidth, y, barWidth, barHeight, [4, 0, 0, 4]);
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
      let rawPercent = dataArray[i] / 255;
      const percent = Math.pow(rawPercent, 2.5) * 1.2; 
      const barWidth = Math.max(percent * canvas.width, 4);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + percent * 0.7})`;
      ctx.beginPath();
      if ((ctx as any).roundRect) {
        (ctx as any).roundRect(canvas.width - barWidth, y, barWidth, barHeight, [4, 0, 0, 4]);
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

  const handleYoutubeProgress = (e: any) => {
    if (!isCapturing && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  const handleYoutubeDuration = (duration: number) => {
    setDuration(duration);
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
      playerRef.current.seekTo(newTime, 'seconds');
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
    setIsCapturing(true);
    
    try {
      // Ensure we're at the top to avoid offset issues
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(frameRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 3, // Higher scale for better quality
        logging: false,
        width: frameRef.current.offsetWidth,
        height: frameRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          const el = clonedDoc.querySelector('[ref="frameRef"]') as HTMLElement;
          if (el) {
            el.style.transform = 'none';
            el.style.borderRadius = '40px';
            el.style.boxShadow = 'none';
            el.style.margin = '0';
            el.style.padding = '40px'; // Increased padding
            el.style.height = 'auto'; // Allow it to grow
            el.style.overflow = 'visible'; // Don't clip
          }
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${songName || 'spotify-frame'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại.');
    } finally {
      setIsDownloading(false);
      setIsCapturing(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-parchment">
      <canvas ref={effectCanvasRef} className="fixed inset-0 pointer-events-none z-20" />
      <audio 
        ref={audioRef}
        src={playlist[currentTrackIndex]?.type === 'local' ? playlist[currentTrackIndex].url : undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        crossOrigin="anonymous"
      />
      
      {playlist[currentTrackIndex]?.type === 'youtube' && (
        <div className="hidden">
          <Player
            ref={playerRef}
            url={playlist[currentTrackIndex].url}
            playing={isPlaying}
            volume={volume}
            onProgress={handleYoutubeProgress}
            onDuration={handleYoutubeDuration}
            onEnded={handleNext}
            width={0}
            height={0}
          />
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-6xl flex-col lg:flex-row gap-8 items-center justify-center">
        <div className="relative w-full max-w-[400px]">
          <div className="absolute inset-0 bg-white/10 blur-[100px] rounded-full z-0 pointer-events-none" />
          <div className="absolute right-full top-8 bottom-8 w-12 md:w-16 mr-2 md:mr-4 pointer-events-none z-0 opacity-80 hidden sm:block">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div 
            ref={frameRef}
            className="w-full bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-ink/5 flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8 relative z-10">
              <button className="p-3 -ml-3 text-ink/40 hover:text-ink transition-colors">
                <ChevronDown className="w-6 h-6" />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mb-1">Playing from playlist</span>
                <span className="text-xs font-serif italic text-ink">Celestial Harmonies</span>
              </div>
              <button className="p-3 -mr-3 text-ink/40 hover:text-ink transition-colors">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            <div className={`relative w-full aspect-square mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden group flex items-center justify-center z-10 ${imageStyle === 'vinyl' ? 'rounded-full' : 'rounded-xl'} border-4 border-white`}>
              {imageStyle === 'vinyl' && (
                <div className="absolute inset-0 z-20 rounded-full border-[12px] border-ink/5 shadow-inner flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white border border-ink/5 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-ink/10" />
                  </div>
                </div>
              )}
              <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 ${imageStyle === 'vinyl' ? (isPlaying && !isCapturing ? 'animate-[spin_10s_linear_infinite]' : '') : 'group-hover:scale-105'}`}>
                <img 
                  src={imageUrl || undefined} 
                  alt="" 
                  className="w-full h-full"
                  style={{ 
                    objectFit: imageFit,
                    transform: imageStyle === 'square' ? `scale(${imageZoom}) translate(${imageOffsetX}%, ${imageOffsetY}%)` : undefined
                  }}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex flex-col overflow-hidden pr-4">
                <h2 className="text-2xl font-serif italic text-ink truncate mb-1 tracking-tight">{songName}</h2>
                <p className="text-sm font-mono uppercase tracking-widest text-gold truncate">{artistName}</p>
              </div>
              <button className="p-3 -mr-3 text-gold hover:scale-110 transition-transform flex-shrink-0">
                <Heart className="w-7 h-7" fill="currentColor" />
              </button>
            </div>

            <div className="mb-8 relative z-10">
              <div className="relative h-1 bg-ink/5 rounded-full mb-2">
                <div 
                  className="absolute top-0 left-0 h-full bg-gold rounded-full" 
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gold rounded-full shadow-md border-2 border-white"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-ink/40 uppercase tracking-widest">
                <span>{formatTime(currentTime)}</span>
                <span>{playlist.length > 0 ? formatTime(duration) : "0:00"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <Shuffle className="w-5 h-5 text-ink/20" />
              <div className="flex items-center gap-8">
                <SkipBack className="w-8 h-8 text-ink fill-ink cursor-pointer" onClick={handlePrev} />
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 bg-ink rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                </button>
                <SkipForward className="w-8 h-8 text-ink fill-ink cursor-pointer" onClick={handleNext} />
              </div>
              <Repeat className="w-5 h-5 text-ink/20" />
            </div>

            <div className="flex justify-between items-center text-ink/40 mt-8 relative z-10">
              <div className="flex items-center gap-2 group relative">
                <button className="p-3 -ml-3 hover:text-ink transition-colors" onClick={() => setVolume(volume === 0 ? 1 : 0)}>
                  {volume === 0 ? <VolumeX className="w-5 h-5" /> : <MonitorSpeaker className="w-5 h-5" />}
                </button>
                <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 ease-in-out flex items-center h-10">
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-1 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-gold" />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 hover:text-ink transition-colors"><Share2 className="w-5 h-5" /></button>
                <button className="p-3 -mr-3 hover:text-ink transition-colors"><ListMusic className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className={`w-full lg:w-[400px] flex flex-col gap-6`}>
          <div className="bg-white/50 backdrop-blur-xl border border-ink/10 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Settings2 className="w-5 h-5 text-gold" />
              <h3 className="text-sm font-mono uppercase tracking-widest text-ink">Tùy chỉnh (Settings)</h3>
            </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-ink/50 mb-3 uppercase tracking-widest">Danh sách nhạc (Playlist)</label>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {playlist.map((track, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${currentTrackIndex === index ? 'bg-gold/10 border-gold/30' : 'bg-ink/5 border-transparent hover:border-ink/10'}`}
                    onClick={() => setCurrentTrackIndex(index)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 bg-ink/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {track.type === 'youtube' ? <Radio className="w-4 h-4 text-gold" /> : <Music className="w-4 h-4 text-gold" />}
                      </div>
                      <span className={`text-xs truncate ${currentTrackIndex === index ? 'text-gold font-bold' : 'text-ink'}`}>{track.name}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeTrack(index); }}
                      className="p-1.5 text-ink/20 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {playlist.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-ink/10 rounded-2xl">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-ink/30">Chưa có bài hát nào</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAddingYoutube(!isAddingYoutube)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAddingYoutube ? 'bg-ink text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
                >
                  <Radio className="w-4 h-4" /> YouTube
                </button>
                <label className="flex-1 py-2.5 bg-ink/5 text-ink hover:bg-ink/10 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Local
                  <input type="file" accept="audio/*" multiple className="hidden" onChange={handleAudioUpload} />
                </label>
              </div>

              {isAddingYoutube && (
                <div className="mt-3 flex gap-2 animate-[inkBleed_0.3s_ease-out]">
                  <input 
                    type="text" 
                    value={youtubeLink} 
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="Dán link YouTube..."
                    className="flex-1 bg-ink/5 border border-ink/10 rounded-xl px-4 py-2 text-xs text-ink focus:outline-none focus:border-gold"
                  />
                  <button 
                    onClick={addYoutubeTrack}
                    className="px-4 bg-gold text-white rounded-xl text-xs font-bold"
                  >
                    Thêm
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-ink/50 mb-2 uppercase tracking-widest">Hiệu ứng (Effects)</label>
              <div className="grid grid-cols-2 gap-2 bg-ink/5 p-1 rounded-xl border border-ink/5">
                <button onClick={() => setOverlayEffect('none')} className={`py-2 text-xs rounded-lg font-medium transition-all ${overlayEffect === 'none' ? 'bg-gold text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-ink/5'}`}>Không</button>
                <button onClick={() => setOverlayEffect('snow')} className={`py-2 text-xs rounded-lg font-medium transition-all ${overlayEffect === 'snow' ? 'bg-gold text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-ink/5'}`}>Tuyết</button>
                <button onClick={() => setOverlayEffect('rain')} className={`py-2 text-xs rounded-lg font-medium transition-all ${overlayEffect === 'rain' ? 'bg-gold text-white shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-ink/5'}`}>Mưa</button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-ink/50 mb-1.5 uppercase tracking-widest">Ảnh bài hát (Image)</label>
              <div className="flex gap-2">
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 bg-ink/5 border border-ink/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold transition-all" placeholder="https://..." />
                <label className="flex-shrink-0 bg-ink/10 hover:bg-ink/20 transition-colors rounded-xl px-4 py-2.5 cursor-pointer flex items-center justify-center text-ink" title="Tải ảnh lên">
                  <Upload className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setImageUrl)} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-ink/50 mb-2 uppercase tracking-widest">Kiểu ảnh (Style)</label>
              <div className="flex gap-2 bg-ink/5 p-1 rounded-xl border border-ink/5">
                <button onClick={() => setImageStyle('square')} className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${imageStyle === 'square' ? 'bg-gold text-white' : 'text-ink/60'}`}><Square className="w-4 h-4" /> Vuông</button>
                <button onClick={() => setImageStyle('vinyl')} className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${imageStyle === 'vinyl' ? 'bg-gold text-white' : 'text-ink/60'}`}><Disc className="w-4 h-4" /> Đĩa than</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-ink/50 mb-1.5 uppercase tracking-widest">Tên bài hát</label>
                <input type="text" value={songName} onChange={(e) => setSongName(e.target.value)} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink/50 mb-1.5 uppercase tracking-widest">Tên ca sĩ</label>
                <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none" />
              </div>
            </div>

            <button onClick={handleDownload} disabled={isDownloading} className="w-full bg-gold hover:bg-gold/80 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xl">
              {isDownloading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Download className="w-5 h-5" />}
              {isDownloading ? 'Đang tải...' : 'Tải ảnh xuống'}
            </button>
          </div>
        </div>
      </div>
    </div>

    <button onClick={() => setShowControls(true)} className={`lg:hidden fixed bottom-6 right-6 z-40 bg-green-500 text-black p-4 rounded-full shadow-lg transition-all ${showControls ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <Settings2 className="w-6 h-6" />
      </button>
    </div>
  );
};

