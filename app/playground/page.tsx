"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// --- Icons ---

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

const MagicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --- Components ---

const ImagePreview = ({ src, isSelected, onToggle }: { src: string; isSelected: boolean; onToggle: () => void }) => {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div 
        onClick={onToggle}
        className={`aspect-square rounded-md border cursor-pointer relative group overflow-hidden transition-all ${
            isSelected 
                ? "border-blue-600 ring-2 ring-blue-100" 
                : "border-gray-100 bg-gray-50 hover:border-blue-200"
        }`}
    >
      <img 
        src={src} 
        alt="" 
        className="h-full w-full object-cover transition-transform group-hover:scale-105" 
        onError={() => setError(true)}
        loading="lazy"
      />
      <div className={`absolute inset-0 transition-colors ${isSelected ? "bg-blue-900/10" : "bg-black/0 group-hover:bg-black/5"}`} />
      
      {/* Selection Checkbox */}
      <div className={`absolute top-1.5 right-1.5 h-4 w-4 rounded-full flex items-center justify-center border transition-all ${
          isSelected 
            ? "bg-blue-600 border-blue-600 text-white" 
            : "bg-white/80 border-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100"
      }`}>
          {isSelected && <CheckIcon />}
      </div>
    </div>
  );
};

const ScrapeModal = ({ 
    isOpen, 
    onClose, 
    isLoading, 
    scrapedContent, 
    selectedImages, 
    onToggleImage,
    onContinue,
    isGeneratingScript
}: { 
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    scrapedContent: { markdown: string; images: string[] } | null;
    selectedImages: string[];
    onToggleImage: (src: string) => void;
    onContinue: () => void;
    isGeneratingScript: boolean;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState(scrapedContent?.markdown || "");

    // Update local content state when scrapedContent changes
    useEffect(() => {
        if (scrapedContent?.markdown) {
            setContent(scrapedContent.markdown);
        }
    }, [scrapedContent]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-semibold">Generate Script</h2>
                    {!isGeneratingScript && (
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <XIcon />
                        </button>
                    )}
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                                    🔮
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-medium">Scanning Website...</h3>
                                <p className="text-sm text-gray-500">Extracting assets, text, and metadata</p>
                            </div>
                        </div>
                    ) : isGeneratingScript ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                                    ✍️
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-medium">Writing Script...</h3>
                                <p className="text-sm text-gray-500">Using GPT-5.1 to craft your video scenes</p>
                            </div>
                        </div>
                    ) : scrapedContent ? (
                        <div className="space-y-8">
                            {/* Images Gallery */}
                            {scrapedContent.images.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Detected Assets</h3>
                                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {selectedImages.length} selected
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                                        {scrapedContent.images.map((img, i) => (
                                            <ImagePreview 
                                                key={i} 
                                                src={img} 
                                                isSelected={selectedImages.includes(img)}
                                                onToggle={() => onToggleImage(img)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Markdown Content */}
                            <div>
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="flex items-center justify-between w-full mb-3 hover:text-gray-700 transition-colors group"
                                >
                                     <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 group-hover:text-blue-600 transition-colors">Extracted Content</h3>
                                     <div className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-blue-600">
                                        {isExpanded ? "Collapse" : "Expand to edit"}
                                        <ChevronDownIcon className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                     </div>
                                </button>
                                
                                {isExpanded && (
                                    <div className="relative animate-in slide-in-from-top-2 duration-200">
                                        <textarea 
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full min-h-[300px] whitespace-pre-wrap text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono leading-relaxed resize-y"
                                            placeholder="Extracted content..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-400">
                            <p>Enter a URL to start generating.</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                {!isLoading && !isGeneratingScript && scrapedContent && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onContinue}
                            className="px-8 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 shadow-lg shadow-black/10 transition-all flex items-center gap-2"
                        >
                            Continue
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Playground() {
  const [url, setUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [scrapedContent, setScrapedContent] = useState<{ markdown: string; images: string[] } | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<"content" | "ad">("ad");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleImage = (src: string) => {
      setSelectedImages(prev => 
          prev.includes(src) 
            ? prev.filter(i => i !== src) 
            : [...prev, src]
      );
  };

  const handleGenerate = async () => {
      if (generatedScript) {
          // Generate Video
          setIsGeneratingVideo(true);
          setGeneratedVideoUrl(null);
          
          try {
              const response = await fetch("/api/generate-video", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      script: generatedScript,
                      selectedImages: selectedImages,
                  }),
              });

              if (!response.ok) {
                  throw new Error("Failed to generate video");
              }

              const data = await response.json();
              setGeneratedVideoUrl(data.videoUrl);
          } catch (error) {
              console.error("Video generation error:", error);
              alert("Failed to generate video. Please try again.");
          } finally {
              setIsGeneratingVideo(false);
          }
          return;
      }

    if (!url) return;
    
    setIsModalOpen(true);
    setIsScraping(true);
    setScrapedContent(null);
    setSelectedImages([]);
    setGeneratedScript(null);
    setGeneratedVideoUrl(null);

    try {
      // Ensure URL has protocol
      let targetUrl = url;
      if (!targetUrl.startsWith("http")) {
         targetUrl = `https://${targetUrl}`;
         setUrl(targetUrl);
      }

      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape URL");
      }

      const data = await response.json();
      setScrapedContent(data);
      // No default selection as per requirement
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to scrape content. Please check the URL and try again.");
      setIsModalOpen(false); // Close modal on error
    } finally {
      setIsScraping(false);
    }
  };

  const handleContinue = async () => {
      if (!scrapedContent) return;

      setIsGeneratingScript(true);
      
      try {
          const response = await fetch("/api/generate-script", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  content: scrapedContent.markdown,
                  selectedImages: selectedImages,
                  videoType: videoType === 'ad' ? 'Advertisement' : 'Social Media Content',
              }),
          });

          if (!response.ok) {
              throw new Error("Failed to generate script");
          }

          const data = await response.json();
          setGeneratedScript(data.script);
          setIsModalOpen(false);
      } catch (error) {
          console.error("Script generation error:", error);
          alert("Failed to generate script. Please try again.");
      } finally {
          setIsGeneratingScript(false);
      }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white text-gray-900">
      <ScrapeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isScraping}
        isGeneratingScript={isGeneratingScript}
        scrapedContent={scrapedContent}
        selectedImages={selectedImages}
        onToggleImage={handleToggleImage}
        onContinue={handleContinue}
      />

      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-6 bg-white z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <BackIcon />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-black" />
            <span className="font-semibold tracking-tight">AppCine Playground</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-gray-50 rounded-full text-gray-600 border border-gray-100">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              System Operational
           </div>
           <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500">
              <SettingsIcon />
           </button>
           <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls (Expanded Width) */}
        <aside className="w-[70%] shrink-0 border-r border-gray-100 bg-gray-50/30 p-6 overflow-y-auto flex flex-col gap-8">
            
            {/* Input & Config */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Source</label>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Target URL</label>
                        <input 
                        type="url" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..." 
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* New Configuration */}
                <div className="space-y-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Configuration</label>
                    
                    <div className="space-y-4">
                        {/* Size */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">Size</label>
                            <div className="flex items-center justify-center w-full h-12 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-500 cursor-not-allowed">
                                9:16 Vertical
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-600">Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Content', 'Advertisement'].map((t) => {
                                    const value = t.toLowerCase() === 'content' ? 'content' : 'ad';
                                    const isSelected = videoType === value;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => setVideoType(value as "content" | "ad")}
                                            className={`flex h-10 w-full items-center justify-center rounded-lg border text-xs font-medium transition-all ${
                                                isSelected
                                                    ? "border-black bg-black text-white shadow-sm"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Script Section */}
            {generatedScript && (
                <div className="pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Generated Script</h3>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            AI Generated
                        </span>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                            {generatedScript}
                        </pre>
                    </div>
                </div>
            )}
            
            {/* Generate Button (Sticky at bottom if needed, but here flows with content) */}
             <button 
              onClick={handleGenerate}
              disabled={(!url && !generatedScript) || isScraping || isGeneratingVideo}
              className={`group relative flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold text-white transition-all shadow-lg shadow-black/5 ${
                (!url && !generatedScript) || isScraping || isGeneratingVideo
                  ? "cursor-not-allowed bg-gray-300 text-gray-500 shadow-none" 
                  : "bg-black hover:bg-gray-800 hover:shadow-xl"
              }`}
            >
               {isScraping ? (
                 <>
                   <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Scanning Website...
                 </>
               ) : isGeneratingVideo ? (
                   <>
                   <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Creating Video...
                   </>
               ) : generatedScript ? (
                  <>
                    <PlayIcon />
                    Generate Video
                  </>
               ) : (
                 <>
                   <MagicIcon />
                   {scrapedContent ? "Regenerate Script" : "Generate Script"}
                 </>
               )}
            </button>

        </aside>

        {/* Main Canvas (Centered & Smaller) */}
        <main className="w-[30%] shrink-0 flex flex-col bg-gray-100 p-4 overflow-hidden items-center justify-center relative border-l border-gray-200 shadow-inner">
            {/* Dotted Background Pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
             
            <div className="w-full max-w-[280px] aspect-[9/16] flex flex-col overflow-hidden rounded-3xl border-8 border-white bg-black shadow-2xl relative z-10 ring-1 ring-black/5">
                {/* Phone Status Bar Mockup */}
                <div className="h-6 bg-black flex items-center justify-between px-4 shrink-0 z-20">
                    <span className="text-[10px] text-white font-medium">9:41</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                        <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-gray-900 relative overflow-hidden">
                    {!scrapedContent && !isScraping && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/30 flex-col gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center">
                                <span className="text-2xl">📱</span>
                            </div>
                            <p className="text-xs font-medium">Preview Area</p>
                        </div>
                    )}

                    {isScraping && (
                         <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-black/50 backdrop-blur-sm">
                             <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                             <p className="text-xs text-blue-400 font-medium animate-pulse">Generating preview...</p>
                         </div>
                    )}
                    
                    {isGeneratingVideo && (
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-black/80 backdrop-blur-sm z-50 text-center px-6">
                             <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                             <div>
                                <p className="text-sm text-white font-bold animate-pulse">Rendering Video</p>
                                <p className="text-xs text-gray-400 mt-1">This might take a minute...</p>
                             </div>
                         </div>
                    )}

                    {generatedVideoUrl ? (
                        <div className="absolute inset-0 flex flex-col bg-black group">
                            <video 
                                src={generatedVideoUrl} 
                                className="w-full h-full object-cover" 
                                controls 
                                autoPlay 
                                loop 
                                playsInline
                            />
                            {/* Download Button */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <a 
                                    href={generatedVideoUrl}
                                    download="generated-video.mp4"
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-white/30 transition-all"
                                >
                                    <DownloadIcon />
                                    Download Video
                                </a>
                            </div>
                        </div>
                    ) : scrapedContent && !isScraping && (
                         <div className="absolute inset-0 flex flex-col">
                             {/* Simulated Generated Video Frame (Placeholder until video is generated) */}
                             <div className="flex-1 bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedImages.length > 0 ? selectedImages[0] : scrapedContent.images[0]})` }}>
                                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90"></div>
                                 <div className="absolute bottom-8 left-4 right-4 space-y-2">
                                     <div className="inline-block px-2 py-1 bg-blue-600 rounded text-[10px] text-white font-bold uppercase tracking-wider">New Drop</div>
                                     <h1 className="text-xl font-bold text-white leading-tight line-clamp-2">
                                         {scrapedContent.markdown.slice(0, 50)}...
                                     </h1>
                                     <button className="mt-2 w-full py-3 bg-white text-black font-bold rounded-lg text-sm">Shop Now</button>
                                 </div>
                             </div>
                         </div>
                    )}
                </div>
                
                 {/* Phone Home Indicator */}
                 <div className="h-4 bg-black shrink-0 flex justify-center items-end pb-1">
                     <div className="w-1/3 h-1 bg-white/20 rounded-full"></div>
                 </div>
            </div>
            
            <div className="mt-6 text-xs text-gray-400 font-medium">
                Preview Mode: 9:16 {videoType === 'ad' ? 'Advertisement' : 'Content'}
            </div>
        </main>
      </div>
    </div>
  );
}
