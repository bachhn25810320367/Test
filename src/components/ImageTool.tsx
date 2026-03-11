import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Download, Trash2, Loader2, Check, Scissors, Camera, Aperture } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'enter' | 'scan' | 'develop' | 'exit'>('enter');

  useEffect(() => {
    const schedule = [
      { t: 100, fn: () => setPhase('enter') },
      { t: 1500, fn: () => setPhase('scan') },
      { t: 3500, fn: () => setPhase('develop') },
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
      {/* Darkroom Atmosphere */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full bg-gold/5 transition-opacity duration-1000 ${phase === 'scan' ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative w-full max-w-2xl aspect-square flex flex-col items-center justify-center">
        {/* Darkroom / Camera Lens Feel */}
        <div className={`relative w-64 h-64 border-2 border-ink/20 rounded-full flex items-center justify-center transition-all duration-1000
          ${phase === 'scan' ? 'scale-110 border-gold shadow-[0_0_80px_rgba(197,160,89,0.3)]' : ''}
          ${phase === 'develop' ? 'scale-100 border-ink/40' : ''}
        `}>
          <Aperture className={`w-32 h-32 text-ink/40 transition-transform duration-[2000ms] ${phase === 'scan' ? 'rotate-180 text-gold' : ''}`} />
          
          {/* Scan Line */}
          {phase === 'scan' && (
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute left-0 right-0 h-1 bg-gold shadow-[0_0_25px_rgba(197,160,89,1)] animate-[scanLine_1.5s_linear_infinite]" />
            </div>
          )}

          {/* Developing Flash */}
          {phase === 'develop' && (
            <div className="absolute inset-0 bg-white animate-[flash_0.5s_ease-out_forwards] rounded-full" />
          )}
        </div>

        <div className="mt-12 text-center relative z-10">
          <div className="overflow-hidden">
            <h1 className="text-5xl font-serif italic text-ink mb-2 animate-[inkBleed_1.5s_ease-out]">Image Studio</h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-mono uppercase tracking-[0.6em] text-gold opacity-60 animate-[popIn_1s_ease-out_0.5s_both]">Developing Visual Truth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageTool = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [removeBg, setRemoveBg] = useState(true);
  const [enhanceQuality, setEnhanceQuality] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (showIntro) {
    return <IntroSequence onComplete={() => setShowIntro(false)} />;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedMimeType(file.type);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processChromaKey = (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Image);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Chroma key parameters
        const keyColor = { r: 0, g: 255, b: 0 };
        const similarity = 0.4; // How close to green to start making transparent
        const smoothness = 0.08; // Edge softening
        const spill = 0.1; // Spill suppression
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate green dominance using a more robust formula
          // We want to detect pixels where green is significantly higher than red and blue
          const rbMax = Math.max(r, b);
          const diff = g - rbMax;
          
          // Normalize the difference (0 to 255)
          // A pure green (0, 255, 0) gives diff = 255
          // A grey (128, 128, 128) gives diff = 0
          
          // Better detection: use a ratio-based approach combined with difference
          const isGreen = g > r && g > b;
          
          if (isGreen) {
            // Calculate how "green" it is
            // 0.0 means not green at all, 1.0 means very green
            const greenness = Math.max(0, Math.min(1, diff / 60));
            
            if (greenness > 0.1) {
              // Apply transparency
              let alpha = 255;
              if (greenness > 0.5) {
                alpha = 0;
              } else {
                // Smooth transition
                alpha = 255 * (1 - (greenness - 0.1) / 0.4);
              }
              
              // Only update alpha if it's more transparent than current
              data[i + 3] = Math.min(data[i + 3], Math.floor(alpha));
              
              // Spill suppression: remove green tint from edges
              // If it's green-ish, pull the green channel down to the level of red/blue
              if (g > rbMax) {
                data[i + 1] = rbMax + (g - rbMax) * (1 - greenness);
              }
            }
          }
          
          // Secondary pass: subtle spill suppression for all pixels
          // This helps remove that "green glow" around the subject
          const r2 = data[i];
          const g2 = data[i + 1];
          const b2 = data[i + 2];
          if (g2 > r2 && g2 > b2) {
            const spillDiff = g2 - Math.max(r2, b2);
            if (spillDiff > 5) {
               data[i + 1] = Math.max(r2, b2) + spillDiff * 0.2;
            }
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(base64Image);
      img.src = base64Image;
    });
  };

  const handleProcess = async () => {
    if (!selectedImage || !selectedMimeType) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = selectedImage.split(',')[1];
      
      let prompt = "Edit this image.";
      const promptParts = [];
      
      if (removeBg) {
        promptParts.push("Extract the main subject of this image with extreme precision. Identify the subject and replace the entire background with a pure, solid, vibrant neon green color (hex code #00FF00). Ensure the edges of the subject are perfectly clean, sharp, and free of any background fringing or artifacts. The green background must be perfectly uniform, flat, and matte, with absolutely no shadows, gradients, reflections, or textures. The subject should look like it was professionally cut out and placed on a green screen.");
      }
      if (removeWatermark) {
        promptParts.push("Carefully remove any watermarks, text, logos, or signatures from the image, especially at the bottom, blending the removed area seamlessly with the surrounding content.");
      }
      if (enhanceQuality) {
        promptParts.push("Enhance the quality, sharpness, and details of the main subject. Reduce noise and improve clarity.");
      }

      if (promptParts.length > 0) {
        prompt = promptParts.join(" ");
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: selectedMimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          let imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          
          if (removeBg) {
            imageUrl = await processChromaKey(imageUrl);
          }
          
          setProcessedImage(imageUrl);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        setError("Could not generate the processed image. Please try again.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const a = document.createElement('a');
      a.href = processedImage;
      a.download = 'processed-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setSelectedMimeType(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 bg-parchment/40 backdrop-blur-xl rounded-3xl border border-ink/10 shadow-2xl max-w-6xl mx-auto animate-[inkBleed_1s_ease-out]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gold/20 rounded-lg">
          <Scissors className="w-5 h-5 text-gold" />
        </div>
        <h2 className="text-2xl font-serif italic text-ink">AI Image Studio</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/30 border border-ink/5 rounded-2xl p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">Processing Options</h3>
            
            <div className="space-y-3">
              <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${removeBg ? 'bg-gold/10 border-gold/30' : 'bg-white/50 border-ink/10 hover:border-gold/30'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center mr-4 transition-colors ${removeBg ? 'bg-gold text-white' : 'bg-white border border-ink/10'}`}>
                  {removeBg && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${removeBg ? 'text-gold' : 'text-ink'}`}>Remove Background</div>
                  <div className="text-[10px] opacity-50">High-precision extraction</div>
                </div>
                <input type="checkbox" className="hidden" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
              </label>

              <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${enhanceQuality ? 'bg-gold/10 border-gold/30' : 'bg-white/50 border-ink/10 hover:border-gold/30'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center mr-4 transition-colors ${enhanceQuality ? 'bg-gold text-white' : 'bg-white border border-ink/10'}`}>
                  {enhanceQuality && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${enhanceQuality ? 'text-gold' : 'text-ink'}`}>Enhance Quality</div>
                  <div className="text-[10px] opacity-50">Sharpen & refine details</div>
                </div>
                <input type="checkbox" className="hidden" checked={enhanceQuality} onChange={(e) => setEnhanceQuality(e.target.checked)} />
              </label>

              <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${removeWatermark ? 'bg-gold/10 border-gold/30' : 'bg-white/50 border-ink/10 hover:border-gold/30'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center mr-4 transition-colors ${removeWatermark ? 'bg-gold text-white' : 'bg-white border border-ink/10'}`}>
                  {removeWatermark && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${removeWatermark ? 'text-gold' : 'text-ink'}`}>Remove Watermark</div>
                  <div className="text-[10px] opacity-50">Erase logos & text</div>
                </div>
                <input type="checkbox" className="hidden" checked={removeWatermark} onChange={(e) => setRemoveWatermark(e.target.checked)} />
              </label>
            </div>

            <div className="mt-8">
              <button
                onClick={handleProcess}
                disabled={!selectedImage || isProcessing || (!removeBg && !enhanceQuality && !removeWatermark)}
                className="w-full py-4 px-6 bg-ink text-parchment hover:bg-gold rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Process Image
                  </>
                )}
              </button>
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-[10px] font-mono uppercase">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8">
          {!selectedImage ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`h-[500px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-gold bg-gold/5' 
                  : 'border-ink/10 bg-white/20 hover:bg-white/40 hover:border-gold/30'
              }`}
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border border-ink/5">
                <Upload className={`w-6 h-6 ${isDragging ? 'text-gold' : 'opacity-30'}`} />
              </div>
              <h3 className="text-lg font-serif italic mb-2 text-ink">Upload Image</h3>
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 text-center max-w-xs text-ink">
                Drag and drop or click to browse
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-white/20 border border-ink/5 rounded-3xl p-6 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2 text-ink">
                  <ImageIcon className="w-4 h-4" />
                  Preview
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="p-2 text-ink/40 hover:text-red-500 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {processedImage && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg text-[10px] font-mono uppercase tracking-widest transition-colors shadow-lg"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 relative rounded-2xl overflow-hidden bg-white/50 border border-ink/5">
                <style dangerouslySetInnerHTML={{__html: `
                  .checkerboard-bg {
                    background-image: 
                      linear-gradient(45deg, #f5f2ed 25%, transparent 25%), 
                      linear-gradient(-45deg, #f5f2ed 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #f5f2ed 75%), 
                      linear-gradient(-45deg, transparent 75%, #f5f2ed 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                  }
                `}} />
                <div className="absolute inset-0 checkerboard-bg opacity-50"></div>
                
                {processedImage ? (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <img 
                      src={processedImage} 
                      alt="Processed" 
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-gold/20 backdrop-blur-md border border-gold/30 text-gold text-[8px] font-mono uppercase tracking-widest rounded-lg">
                      Result
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <img 
                      src={selectedImage} 
                      alt="Original" 
                      className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-ink/10 backdrop-blur-md border border-ink/20 text-ink/60 text-[8px] font-mono uppercase tracking-widest rounded-lg">
                      Original
                    </div>
                    {isProcessing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
                        <div className="text-ink font-serif italic">Applying AI Magic...</div>
                        <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 mt-1">Refining pixels</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
