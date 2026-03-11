/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Box, Image as ImageIcon, Wand2, Layers, Plus, Trash2, Download, Sparkles, Shirt, ArrowRight, Package, Menu, X, Check, SprayCan, Maximize } from 'lucide-react';
import { Button } from './Button';
import { FileUploader } from './FileUploader';
import { generateMockup, generateAsset } from '../services/geminiService';
import { Asset, GeneratedMockup, AppView, LoadingState, PlacedLayer } from '../types';
import { useApiKey } from '../hooks/useApiKey';
import ApiKeyDialog from './ApiKeyDialog';

// --- Intro Animation Component ---

const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'enter' | 'wait' | 'spray' | 'admire' | 'exit' | 'prism' | 'explode'>('enter');

  useEffect(() => {
    const schedule = [
      { t: 100, fn: () => setPhase('enter') },
      { t: 1800, fn: () => setPhase('wait') },
      { t: 2400, fn: () => setPhase('spray') },
      { t: 4000, fn: () => setPhase('admire') },
      { t: 5000, fn: () => setPhase('exit') },
      { t: 5600, fn: () => setPhase('prism') },
      { t: 7800, fn: () => setPhase('explode') },
      { t: 8500, fn: () => onComplete() }
    ];

    const timers = schedule.map(s => setTimeout(s.fn, s.t));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-parchment flex items-center justify-center overflow-hidden font-sans select-none
      ${phase === 'explode' ? 'animate-[fadeOut_1s_ease-out_forwards] pointer-events-none' : ''}
    `}>
      <div className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-300 ease-out ${phase === 'explode' ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative w-full max-w-4xl h-96 flex items-center justify-center scale-[0.6] md:scale-100">
        {(phase !== 'prism' && phase !== 'explode') && (
          <div className={`relative z-10 flex flex-col items-center transition-transform will-change-transform
             ${phase === 'enter' ? 'animate-[hopIn_1.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]' : ''}
             ${phase === 'exit' ? 'animate-[anticipateSprint_0.8s_ease-in_forwards]' : ''}
          `}>
             <div className={`w-32 h-36 bg-white rounded-xl relative overflow-hidden shadow-2xl transition-all duration-300 border-4
                ${phase === 'spray' || phase === 'admire' || phase === 'exit' 
                  ? 'border-gold shadow-[0_0_40px_rgba(212,175,55,0.3)]' 
                  : 'border-ink/10'}
             `}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-ink/5 border-x border-ink/5 transition-opacity duration-200 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-ink rounded-md flex items-center justify-center gap-4 overflow-hidden border border-ink/20 shadow-inner z-20">
                   <div className={`w-2 h-2 bg-gold rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-white' : 'animate-pulse'}`}></div>
                   <div className={`w-2 h-2 bg-gold rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-white' : 'animate-pulse'}`}></div>
                </div>
                <div className={`absolute inset-0 bg-ink transition-opacity duration-500 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute inset-0 bg-gold mix-blend-overlay pointer-events-none ${phase === 'spray' ? 'animate-[flash_0.2s_ease-out]' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 transform z-20
                   ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                `}>
                   <div className="w-10 h-10 bg-white text-gold rounded flex items-center justify-center shadow-lg">
                      <Package size={24} strokeWidth={3} />
                   </div>
                </div>
             </div>
             <div className="flex gap-10 -mt-1 z-0">
                <div className={`w-3 h-8 bg-ink rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate]' : ''}`}></div>
                <div className={`w-3 h-8 bg-ink rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate-reverse]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate-reverse]' : ''}`}></div>
             </div>
          </div>
        )}

        {phase === 'spray' && (
          <div className="absolute z-20 animate-[swoopIn_0.4s_cubic-bezier(0.17,0.67,0.83,0.67)_forwards]" style={{ right: '22%', top: '5%' }}>
             <div className="relative animate-[shake_0.15s_infinite]">
                <SprayCan size={80} className="text-gold fill-gold rotate-[-15deg] drop-shadow-2xl" />
                <div className="absolute top-0 -left-4 w-6 h-6 bg-white rounded-full blur-md animate-ping"></div>
                <div className="absolute top-4 -left-8 w-40 h-40 pointer-events-none overflow-visible">
                   {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-gold rounded-full animate-[sprayParticle_0.4s_linear_forwards]"
                        style={{ 
                           top: Math.random() * 20, 
                           left: 0,
                           animationDelay: `${Math.random() * 0.3}s`,
                        }}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        {(phase === 'prism' || phase === 'explode') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
             <div className={`relative w-32 h-32 animate-[spinAppear_1.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                   <path 
                      d="M50 10 L90 85 L10 85 Z" 
                      fill="none" 
                      stroke="#D4AF37" 
                      strokeWidth="4" 
                      strokeLinejoin="round"
                      className="animate-[drawStroke_1s_ease-out_forwards]"
                   />
                   <path 
                      d="M50 10 L50 85 M50 50 L90 85 M50 50 L10 85" 
                      stroke="#D4AF37" 
                      strokeWidth="1.5" 
                      className="opacity-40"
                   />
                </svg>
             </div>
             
             <div className="text-center animate-[popIn_0.8s_cubic-bezier(0.17,0.67,0.83,0.67)_0.5s_forwards] opacity-0">
                <h1 className="text-5xl font-serif italic text-ink tracking-tight mb-2">SKU Foundry</h1>
                <p className="text-xs text-gold font-mono tracking-[0.3em] uppercase">AI Product Visualization</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- UI Components ---

const NavButton = ({ icon, label, active, onClick, number }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, number?: number }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
      ${active ? 'bg-gold/10 text-ink border-l-2 border-gold' : 'text-ink/40 hover:bg-ink/5 hover:text-ink'}`}
  >
    <span className={`${active ? 'text-gold' : 'text-ink/20 group-hover:text-ink/40'} transition-colors`}>
      {icon}
    </span>
    <span className="font-mono uppercase text-[10px] tracking-widest flex-1 text-left">{label}</span>
    {number && (
      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded min-w-[1.5rem] text-center transition-colors ${active ? 'bg-gold text-white' : 'bg-ink/5 text-ink/40'}`}>
        {number}
      </span>
    )}
  </button>
);

const WorkflowStepper = ({ currentView, onViewChange }: { currentView: AppView, onViewChange: (view: AppView) => void }) => {
  const steps = [
    { id: 'assets', label: 'Upload Assets', number: 1 },
    { id: 'studio', label: 'Design Mockup', number: 2 },
    { id: 'gallery', label: 'Download Result', number: 3 },
  ];

  const viewOrder = ['assets', 'studio', 'gallery'];
  const currentIndex = viewOrder.indexOf(currentView);
  const progress = Math.max(0, (currentIndex / (steps.length - 1)) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 hidden md:block animate-fade-in px-4">
      <div className="relative">
         <div className="absolute top-1/2 left-0 right-0 h-px bg-ink/10 -translate-y-1/2"></div>
         
         <div 
            className="absolute top-1/2 left-0 h-px bg-gold -translate-y-1/2 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
         ></div>

         <div className="relative flex justify-between w-full">
            {steps.map((step, index) => {
               const isCompleted = currentIndex > index;
               const isCurrent = currentIndex === index;
               
               return (
                  <button 
                    key={step.id}
                    onClick={() => onViewChange(step.id as AppView)}
                    className={`group flex flex-col items-center focus:outline-none relative z-10 cursor-pointer`}
                  >
                     <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 bg-parchment
                        ${isCurrent 
                           ? 'border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] scale-110' 
                           : isCompleted 
                              ? 'border-gold bg-gold text-white' 
                              : 'border-ink/10 text-ink/20 group-hover:border-ink/30 group-hover:text-ink/40'}
                     `}>
                        {isCompleted ? (
                           <Check size={18} strokeWidth={3} />
                        ) : (
                           <span className="text-xs font-mono">{step.number}</span>
                        )}
                     </div>
                     <span className={`
                        absolute top-14 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                        ${isCurrent ? 'text-gold opacity-100 transform translate-y-0' : isCompleted ? 'text-ink/40 opacity-80' : 'text-ink/20 opacity-60 group-hover:opacity-100'}
                     `}>
                        {step.label}
                     </span>
                  </button>
               )
            })}
         </div>
      </div>
    </div>
  )
};

// Helper component for Asset Sections
const AssetSection = ({ 
  title, 
  icon, 
  type, 
  assets, 
  onAdd, 
  onRemove,
  validateApiKey,
  onApiError
}: { 
  title: string, 
  icon: React.ReactNode, 
  type: 'logo' | 'product', 
  assets: Asset[], 
  onAdd: (a: Asset) => void, 
  onRemove: (id: string) => void,
  validateApiKey: () => Promise<boolean>,
  onApiError: (e: any) => void
}) => {
  const [mode, setMode] = useState<'upload' | 'generate'>('upload');
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!genPrompt) return;
    if (!(await validateApiKey())) return;

    setIsGenerating(true);
    try {
      const b64 = await generateAsset(genPrompt, type);
      onAdd({
        id: Math.random().toString(36).substring(7),
        type,
        name: `AI Generated ${type}`,
        data: b64,
        mimeType: 'image/png'
      });
      setGenPrompt('');
    } catch (e: any) {
      console.error(e);
      onApiError(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-ink/10 p-8 rounded-[2.5rem] h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-mono uppercase tracking-widest text-ink flex items-center gap-3">
            <span className="text-gold">{icon}</span>
            {title}
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-widest text-ink/30">{assets.length} items</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {assets.map(asset => (
            <div key={asset.id} className="relative group aspect-square bg-white rounded-2xl overflow-hidden border border-ink/5 shadow-sm">
                <img src={asset.data} className="w-full h-full object-contain p-3" alt={asset.name} />
                <button onClick={() => onRemove(asset.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg">
                  <Trash2 size={12} />
                </button>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center h-32 text-ink/20 border-2 border-dashed border-ink/10 rounded-2xl">
              <p className="text-[10px] font-mono uppercase tracking-widest">No {type}s yet</p>
            </div>
          )}
      </div>

      <div className="mt-auto pt-6 border-t border-ink/5">
        <div className="flex gap-6 mb-6">
           <button 
             onClick={() => setMode('upload')}
             className={`text-[10px] font-mono uppercase tracking-widest pb-2 border-b-2 transition-all ${mode === 'upload' ? 'border-gold text-ink' : 'border-transparent text-ink/30 hover:text-ink/50'}`}
           >
             Upload
           </button>
           <button 
             onClick={() => setMode('generate')}
             className={`text-[10px] font-mono uppercase tracking-widest pb-2 border-b-2 transition-all ${mode === 'generate' ? 'border-gold text-ink' : 'border-transparent text-ink/30 hover:text-ink/50'}`}
           >
             Generate with AI
           </button>
        </div>

        {mode === 'upload' ? (
           <FileUploader label={`Upload ${type}`} onFileSelect={(f) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                onAdd({
                  id: Math.random().toString(36).substring(7),
                  type,
                  name: f.name,
                  data: e.target?.result as string,
                  mimeType: f.type
                });
              };
              reader.readAsDataURL(f);
           }} />
        ) : (
           <div className="space-y-4">
              <textarea 
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder={`Describe the ${type} you want to create...`}
                className="w-full bg-ink/5 border border-ink/10 rounded-2xl p-4 text-sm text-ink focus:outline-none focus:border-gold resize-none h-28 placeholder:text-ink/20"
              />
              <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating} 
                disabled={!genPrompt}
                className="w-full bg-gold hover:bg-gold/80 text-white shadow-lg"
                icon={<Sparkles size={16} />}
              >
                Generate {type}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};


// --- Main Component ---

export const ProductMockupTool = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<AppView>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [generatedMockups, setGeneratedMockups] = useState<GeneratedMockup[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<GeneratedMockup | null>(null);

  // Form states for generation
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [placedLogos, setPlacedLogos] = useState<PlacedLayer[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>({ isGenerating: false, message: '' });

  // API Key Management
  const { showApiKeyDialog, setShowApiKeyDialog, validateApiKey, handleApiKeyDialogContinue } = useApiKey();

  // API Error Handling Logic
  const handleApiError = (error: any) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let shouldOpenDialog = false;

    if (errorMessage.includes('Requested entity was not found')) {
      shouldOpenDialog = true;
    } else if (
      errorMessage.includes('API_KEY_INVALID') ||
      errorMessage.includes('API key not valid') ||
      errorMessage.includes('PERMISSION_DENIED') || 
      errorMessage.includes('403')
    ) {
      shouldOpenDialog = true;
    }

    if (shouldOpenDialog) {
      setShowApiKeyDialog(true);
    } else {
      alert(`Operation failed: ${errorMessage}`);
    }
  };

  // State for Dragging
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<{ uid: string, startX: number, startY: number, initX: number, initY: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // -- LOGO PLACEMENT HANDLERS --

  const addLogoToCanvas = (assetId: string) => {
    const newLayer: PlacedLayer = {
      uid: Math.random().toString(36).substr(2, 9),
      assetId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setPlacedLogos(prev => [...prev, newLayer]);
  };

  const removeLogoFromCanvas = (uid: string, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setPlacedLogos(prev => prev.filter(l => l.uid !== uid));
  };

  const handleStart = (clientX: number, clientY: number, layer: PlacedLayer) => {
    setDraggedItem({
      uid: layer.uid,
      startX: clientX,
      startY: clientY,
      initX: layer.x,
      initY: layer.y
    });
  };

  const handleMouseDown = (e: React.MouseEvent, layer: PlacedLayer) => {
    e.preventDefault();
    e.stopPropagation();
    handleStart(e.clientX, e.clientY, layer);
  };

  const handleTouchStart = (e: React.TouchEvent, layer: PlacedLayer) => {
    e.stopPropagation();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, layer);
  };

  const handleWheel = (e: React.WheelEvent, layerId: string) => {
     e.stopPropagation();
     const delta = e.deltaY > 0 ? -0.1 : 0.1;
     setPlacedLogos(prev => prev.map(l => {
        if (l.uid !== layerId) return l;
        const newScale = Math.max(0.2, Math.min(3.0, l.scale + delta));
        return { ...l, scale: newScale };
     }));
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!draggedItem || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = clientX - draggedItem.startX;
      const deltaY = clientY - draggedItem.startY;
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;
      setPlacedLogos(prev => prev.map(l => {
        if (l.uid !== draggedItem.uid) return l;
        return {
          ...l,
          x: Math.max(0, Math.min(100, draggedItem.initX + deltaXPercent)),
          y: Math.max(0, Math.min(100, draggedItem.initY + deltaYPercent))
        };
      }));
    };
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => setDraggedItem(null);
    const onTouchMove = (e: TouchEvent) => {
      if (draggedItem) {
         e.preventDefault();
         handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => setDraggedItem(null);
    if (draggedItem) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [draggedItem]);


  const handleGenerate = async () => {
    if (!selectedProductId && placedLogos.length === 0) return;
    const product = assets.find(a => a.id === selectedProductId);
    if (!product) {
        alert("Selected product not found.");
        setSelectedProductId(null);
        return;
    }
    const layers = placedLogos.map(layer => {
        const asset = assets.find(a => a.id === layer.assetId);
        return asset ? { asset, placement: layer } : null;
    }).filter(Boolean) as { asset: Asset, placement: PlacedLayer }[];
    if (layers.length === 0) {
         alert("No valid logos found on canvas.");
         return;
    }
    if (!(await validateApiKey())) return;
    const currentPrompt = prompt;
    setLoading({ isGenerating: true, message: 'Analyzing composite geometry...' });
    try {
      const resultImage = await generateMockup(product, layers, currentPrompt);
      const newMockup: GeneratedMockup = {
        id: Math.random().toString(36).substring(7),
        imageUrl: resultImage,
        prompt: currentPrompt,
        createdAt: Date.now(),
        layers: placedLogos,
        productId: selectedProductId
      };
      setGeneratedMockups(prev => [newMockup, ...prev]);
      setView('gallery');
    } catch (e: any) {
      console.error(e);
      handleApiError(e);
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  if (showIntro) {
    return <IntroSequence onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-parchment text-ink font-sans flex overflow-hidden relative rounded-3xl border border-ink/10">
      {showApiKeyDialog && <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />}

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-ink/10 bg-white/30 hidden md:flex flex-col">
        <div className="h-16 border-b border-ink/10 flex items-center px-6">
          <Package className="text-gold mr-2" />
          <span className="font-serif italic text-lg tracking-tight">SKU Foundry</span>
        </div>
        <div className="p-4 space-y-2 flex-1">
          <NavButton icon={<Layout size={18} />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavButton icon={<Box size={18} />} label="Assets" active={view === 'assets'} number={1} onClick={() => setView('assets')} />
          <NavButton icon={<Wand2 size={18} />} label="Studio" active={view === 'studio'} number={2} onClick={() => setView('studio')} />
          <NavButton icon={<ImageIcon size={18} />} label="Gallery" active={view === 'gallery'} number={3} onClick={() => setView('gallery')} />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-ink/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          <Package className="text-gold mr-2" />
          <span className="font-serif italic text-lg">SKU Foundry</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-ink/40 hover:text-ink">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-xl p-4 animate-fade-in flex flex-col">
          <div className="space-y-2">
            <NavButton icon={<Layout size={18} />} label="Dashboard" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} />
            <NavButton icon={<Box size={18} />} label="Assets" active={view === 'assets'} number={1} onClick={() => { setView('assets'); setIsMobileMenuOpen(false); }} />
            <NavButton icon={<Wand2 size={18} />} label="Studio" active={view === 'studio'} number={2} onClick={() => { setView('studio'); setIsMobileMenuOpen(false); }} />
            <NavButton icon={<ImageIcon size={18} />} label="Gallery" active={view === 'gallery'} number={3} onClick={() => { setView('gallery'); setIsMobileMenuOpen(false); }} />
          </div>
        </div>
      )}

      {selectedMockup && (
        <div className="fixed inset-0 z-[100] bg-parchment/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedMockup(null)}>
          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedMockup(null)} className="absolute top-4 right-4 p-3 bg-white text-ink rounded-full hover:bg-gold hover:text-white transition-all z-50 border border-ink/10 shadow-xl"><X size={24} /></button>
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-ink/5">
              <img src={selectedMockup.imageUrl} alt="Full size preview" className="max-w-full max-h-[85vh] object-contain" />
            </div>
            <div className="mt-6 bg-white/80 backdrop-blur border border-ink/10 px-8 py-4 rounded-full flex items-center gap-6 shadow-xl">
               <p className="text-[10px] font-mono uppercase tracking-widest text-ink/40 max-w-[200px] md:max-w-md truncate">{selectedMockup.prompt || "Generated Mockup"}</p>
               <div className="h-4 w-px bg-ink/10"></div>
               <a href={selectedMockup.imageUrl} download={`mockup-${selectedMockup.id}.png`} className="text-gold hover:text-gold/80 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors"><Download size={16} />Download</a>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto p-6 md:p-12">
           {view === 'dashboard' && (
              <div className="animate-fade-in space-y-12">
                 <div className="text-center py-16">
                    <h1 className="text-4xl md:text-7xl font-serif italic mb-8 text-ink tracking-tight">Create Realistic <br/><span className="text-gold">Merchandise Mockups</span></h1>
                    <p className="text-ink/40 text-lg max-w-2xl mx-auto mb-12 font-serif">Upload your logos and products, and let our AI composite them perfectly with realistic lighting, shadows, and warping.</p>
                    <Button size="lg" onClick={() => setView('assets')} className="bg-gold hover:bg-gold/80 text-white shadow-xl px-12" icon={<ArrowRight size={20} />}>Start Creating</Button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                       { icon: <Box className="text-gold" />, title: 'Asset Management', desc: 'Organize logos and product bases.' },
                       { icon: <Wand2 className="text-gold" />, title: 'AI Compositing', desc: 'Smart blending and surface mapping.' },
                       { icon: <Download className="text-gold" />, title: 'High-Res Export', desc: 'Production-ready visuals.' }
                    ].map((feat, i) => (
                       <div key={i} className="p-8 rounded-[2.5rem] bg-white/50 backdrop-blur-xl border border-ink/10 hover:border-gold/30 transition-all shadow-lg group">
                          <div className="mb-6 p-4 bg-white w-fit rounded-2xl shadow-sm group-hover:scale-110 transition-transform">{feat.icon}</div>
                          <h3 className="text-sm font-mono uppercase tracking-widest mb-3 text-ink">{feat.title}</h3>
                          <p className="text-ink/40 text-xs leading-relaxed">{feat.desc}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {view === 'assets' && (
              <div className="animate-fade-in">
                <WorkflowStepper currentView="assets" onViewChange={setView} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <AssetSection title="Products" icon={<Box size={20} />} type="product" assets={assets.filter(a => a.type === 'product')} onAdd={(a) => setAssets(prev => [...prev, a])} onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))} validateApiKey={validateApiKey} onApiError={handleApiError} />
                  <AssetSection title="Logos & Graphics" icon={<Layers size={20} />} type="logo" assets={assets.filter(a => a.type === 'logo')} onAdd={(a) => setAssets(prev => [...prev, a])} onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))} validateApiKey={validateApiKey} onApiError={handleApiError} />
                </div>
                <div className="mt-8 flex justify-end">
                   <Button onClick={() => setView('studio')} disabled={assets.length < 2} icon={<ArrowRight size={16} />}>Continue to Studio</Button>
                </div>
              </div>
           )}

           {view === 'studio' && (
             <div className="animate-fade-in h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
                <div className="w-full lg:w-80 flex flex-col gap-8 bg-white/50 backdrop-blur-xl border border-ink/10 p-8 rounded-[2.5rem] overflow-y-auto flex-1 lg:flex-none shadow-xl">
                   <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink/50 mb-4">1. Select Product</h3>
                      <div className="grid grid-cols-3 gap-3">
                         {assets.filter(a => a.type === 'product').map(a => (
                            <div key={a.id} onClick={() => setSelectedProductId(selectedProductId === a.id ? null : a.id)} className={`aspect-square rounded-xl border-2 cursor-pointer p-1 transition-all ${selectedProductId === a.id ? 'border-gold bg-gold/10' : 'border-ink/5 hover:border-ink/20 bg-white shadow-sm'}`}><img src={a.data} className="w-full h-full object-contain" alt={a.name} /></div>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink/50 mb-4">2. Add Logos</h3>
                      <div className="grid grid-cols-3 gap-3">
                         {assets.filter(a => a.type === 'logo').map(a => (
                            <div key={a.id} onClick={() => addLogoToCanvas(a.id)} className={`relative aspect-square rounded-xl border-2 cursor-pointer p-1 transition-all border-ink/5 hover:border-ink/20 bg-white shadow-sm`}><img src={a.data} className="w-full h-full object-contain" alt={a.name} /></div>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink/50 mb-4">3. Instructions</h3>
                      <textarea className="w-full bg-ink/5 border border-ink/10 rounded-2xl p-4 text-sm text-ink focus:outline-none focus:border-gold resize-none h-28 placeholder:text-ink/20" placeholder="E.g. Embed the logos into the fabric texture..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                   </div>
                   <Button onClick={handleGenerate} isLoading={loading.isGenerating} disabled={!selectedProductId || placedLogos.length === 0} size="lg" className="mt-auto bg-gold hover:bg-gold/80 text-white shadow-xl" icon={<Wand2 size={18} />}>Generate Mockup</Button>
                </div>
                <div className="h-[45vh] lg:h-auto lg:flex-1 bg-white/30 border border-ink/10 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden select-none flex-shrink-0 shadow-inner">
                   {loading.isGenerating && (
                      <div className="absolute inset-0 z-20 bg-parchment/80 backdrop-blur-sm flex flex-col items-center justify-center">
                         <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
                         <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">{loading.message}</p>
                      </div>
                   )}
                   {selectedProductId ? (
                      <div ref={canvasRef} className="relative w-full h-full max-h-[600px] p-8">
                         <img src={assets.find(a => a.id === selectedProductId)?.data} className="w-full h-full object-contain drop-shadow-2xl pointer-events-none select-none" alt="Preview" draggable={false} />
                         {placedLogos.map((layer) => {
                            const logoAsset = assets.find(a => a.id === layer.assetId);
                            if (!logoAsset) return null;
                            return (
                               <div key={layer.uid} className={`absolute cursor-move group z-10`} style={{ left: `${layer.x}%`, top: `${layer.y}%`, transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`, width: '15%', aspectRatio: '1/1' }} onMouseDown={(e) => handleMouseDown(e, layer)} onTouchStart={(e) => handleTouchStart(e, layer)} onWheel={(e) => handleWheel(e, layer.uid)}>
                                  <div className="absolute -inset-2 border-2 border-gold/0 group-hover:border-gold/50 rounded-xl transition-all pointer-events-none"></div>
                                  <button onClick={(e) => removeLogoFromCanvas(layer.uid, e)} className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg z-50"><X size={12} /></button>
                                  <img src={logoAsset.data} className="w-full h-full object-contain drop-shadow-lg pointer-events-none" draggable={false} alt="layer" />
                               </div>
                            );
                         })}
                      </div>
                   ) : (
                      <div className="text-center text-ink/20"><Shirt size={64} className="mx-auto mb-6 opacity-20" /><p className="text-[10px] font-mono uppercase tracking-widest">Select a product to start designing</p></div>
                   )}
                </div>
             </div>
           )}

           {view === 'gallery' && (
              <div className="animate-fade-in">
                 <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl font-serif italic text-ink">Generated Mockups</h2>
                    <Button variant="outline" onClick={() => setView('studio')} className="border-gold text-gold hover:bg-gold hover:text-white" icon={<Plus size={16}/>}>New Mockup</Button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {generatedMockups.map(mockup => (
                       <div key={mockup.id} className="group bg-white/50 backdrop-blur-xl border border-ink/10 rounded-[2.5rem] overflow-hidden shadow-lg transition-all hover:shadow-2xl">
                          <div className="aspect-square bg-white relative overflow-hidden">
                             <img src={mockup.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Mockup" />
                             <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button size="sm" variant="secondary" className="bg-white text-ink hover:bg-gold hover:text-white border-none" icon={<Maximize size={16}/>} onClick={() => setSelectedMockup(mockup)}>View</Button>
                                <a href={mockup.imageUrl} download={`mockup-${mockup.id}.png`}><Button size="sm" variant="primary" className="bg-gold text-white border-none" icon={<Download size={16}/>}>Save</Button></a>
                             </div>
                          </div>
                          <div className="p-6">
                             <p className="text-[10px] font-mono uppercase tracking-widest text-gold mb-2">{new Date(mockup.createdAt).toLocaleDateString()}</p>
                             <p className="text-xs text-ink/60 line-clamp-2 font-serif italic">{mockup.prompt || "Auto-generated mockup"}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>
      </main>
    </div>
  );
};
