import React, { useState, useEffect, useRef } from 'react';
import { AppDetails, GenerationState, AspectRatio } from '@/app/playground/types';
import { CATEGORIES, TONES, VIDEO_DURATIONS } from '@/app/playground/constants';
import { Dropzone } from './Dropzone';
import { Icon } from './Icon';
import { CustomDropdown, DropdownOption } from './CustomDropdown';

interface LeftPanelProps {
  details: AppDetails;
  setDetails: React.Dispatch<React.SetStateAction<AppDetails>>;
  onGenerateConcepts: () => void;
  generationState: GenerationState;
  onBack?: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  icon: string;
  platform: 'ios' | 'android';
  developer: string;
  description: string;
  screenshots: string[];
  url?: string;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ 
  details, 
  setDetails, 
  onGenerateConcepts, 
  generationState,
  onBack
}) => {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'ios' | 'android'>('all');
  const [isFetchingAssets, setIsFetchingAssets] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const isSelectionRef = useRef(false);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Skip search if update came from selection
    if (isSelectionRef.current) {
        isSelectionRef.current = false;
        return;
    }

    const timer = setTimeout(() => {
        if (searchQuery.trim()) {
            handleSearch(searchQuery);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, platformFilter]);

  const handleSearch = async (query: string, limit = 5) => {
    if (!query.trim()) return;
    setIsSearching(true);
    if (limit === 5) {
        setSearchResults([]); // Clear previous results immediately only for new search
        setShowResults(true);
    }

    try {
      const response = await fetch(`/api/search?term=${encodeURIComponent(query)}&platform=${platformFilter}&limit=${limit}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isSearching && searchResults.length < 50) {
        // Load more
        handleSearch(searchQuery, searchResults.length + 10);
    }
  };

  // Helper to convert URL to Base64 via Backend Proxy
  const urlToBase64 = async (url: string): Promise<string> => {
    try {
      // Skip fetching if URL is empty
      if (!url) return "";
      
      const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Proxy failed");
      const data = await res.json();
      return data.base64 || "";
    } catch (e) {
      console.warn("Failed to load image via proxy", url, e);
      return "";
    }
  };

  const handleSelectApp = async (app: SearchResult) => {
    setShowResults(false);
    isSelectionRef.current = true; // Flag that this update is from selection
    setSearchQuery(app.name); // Update input to show selected app name
    
    // Clear previous assets immediately
    setDetails(prev => ({
      ...prev,
      name: app.name,
      sellingPoint: app.description || prev.sellingPoint,
      logo: '', // Clear logo
      screenshots: [] // Clear screenshots
    }));

    setIsFetchingAssets(true); // Start loading

    // Process images in background
    try {
      if (app.icon) {
          const logoBase64 = await urlToBase64(app.icon);
          if (logoBase64) setDetails(prev => ({ ...prev, logo: logoBase64 }));
      }

      if (app.screenshots && app.screenshots.length > 0) {
          const shotUrls = app.screenshots.slice(0, 5);
          const shots = await Promise.all(shotUrls.map(urlToBase64));
          const validShots = shots.filter(s => s && s.startsWith('data:image'));
          if (validShots.length > 0) {
              setDetails(prev => ({ ...prev, screenshots: validShots }));
          }
      } else if (app.url) {
         // If no screenshots in search result (e.g. Google Play), try to scrape details
         try {
            const response = await fetch('/api/scrape', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: app.url })
            });
            const data = await response.json();
            if (data.screenshots && data.screenshots.length > 0) {
               const shotUrls = data.screenshots.slice(0, 5);
               const shots = await Promise.all(shotUrls.map(urlToBase64));
               const validShots = shots.filter((s: string) => s && s.startsWith('data:image'));
               if (validShots.length > 0) {
                  setDetails(prev => ({ ...prev, screenshots: validShots }));
               }
            }
            // Update description if scrape gave better one
            if (data.description && data.description.length > (app.description?.length || 0)) {
               setDetails(prev => ({ ...prev, sellingPoint: data.description }));
            }
         } catch (e) {
           console.error("Failed to fetch extra details", e);
         }
      }
    } catch (error) {
       console.error("Asset fetch failed", error);
    } finally {
       setIsFetchingAssets(false); // Stop loading
    }
  };

  const handleTextChange = (field: keyof AppDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setDetails(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotsUpload = async (files: File[]) => {
    const readers = files.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    }));

    try {
      const results = await Promise.all(readers);
      setDetails(prev => {
        const currentCount = prev.screenshots.length;
        const availableSlots = 5 - currentCount;
        if (availableSlots <= 0) return prev;
        const newScreenshots = results.slice(0, availableSlots);
        return {
          ...prev,
          screenshots: [...prev.screenshots, ...newScreenshots]
        };
      });
    } catch (error) {
      console.error("Error reading files", error);
    }
  };

  const removeScreenshot = (index: number) => {
    setDetails(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const isGenerating = generationState !== GenerationState.IDLE && generationState !== GenerationState.COMPLETE && generationState !== GenerationState.AWAITING_SELECTION;
  const isReady = details.name && details.sellingPoint && details.logo;

  const categoryOptions: DropdownOption[] = CATEGORIES.map(c => ({
    label: c, value: c, icon: 'Tag'
  }));

  const toneOptions: DropdownOption[] = TONES.map(t => ({
    label: t, value: t, icon: 'Music2'
  }));

  const aspectRatioOptions: DropdownOption[] = [
    { label: 'Vertical (9:16)', subLabel: 'Best for Stories/Reels', value: AspectRatio.PORTRAIT, icon: 'Smartphone' },
    { label: 'Landscape (16:9)', subLabel: 'Best for YouTube', value: AspectRatio.LANDSCAPE, icon: 'Monitor' },
    { label: 'Square (1:1)', subLabel: 'Best for Feed', value: AspectRatio.SQUARE, icon: 'Square' },
    { label: 'Custom Size', subLabel: 'Define px', value: AspectRatio.CUSTOM, icon: 'Settings' }
  ];

  const durationOptions: DropdownOption[] = VIDEO_DURATIONS.map(d => ({
    label: d.label, value: d.value, icon: d.icon as any
  }));

  return (
    <div className="w-full md:w-[70%] h-full overflow-y-auto bg-white border-r border-slate-200 p-6 md:p-10 pb-32">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
             {onBack && (
               <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
                 <Icon name="ArrowLeft" className="w-4 h-4" />
                 Back to Home
               </button>
             )}
        </div>
        
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
             <Icon name="Zap" className="w-6 h-6 text-white" />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Haipe Flow</h1>
        </div>
        <p className="text-slate-500">Generate high-conversion mobile video ads in seconds.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Core Identity */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">1. App Identity</h2>
          
          {/* App Search Input */}
          <div className="relative" ref={searchRef}>
             <label className="block text-xs font-medium text-slate-600 mb-2">Search App</label>
             <div className="flex gap-2 mb-2">
               <div className="relative flex-1">
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search App Store or Play Store..."
                   className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                 />
                 <div className="absolute left-3 top-2.5 text-slate-400">
                    <Icon name="Search" className="w-4 h-4" />
                 </div>
               </div>
               <div className="flex bg-slate-100 rounded-lg p-1">
                 <button
                   onClick={() => setPlatformFilter('all')}
                   className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                     platformFilter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   All
                 </button>
                 <button
                   onClick={() => setPlatformFilter('ios')}
                   className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                     platformFilter === 'ios' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   iOS
                 </button>
                 <button
                   onClick={() => setPlatformFilter('android')}
                   className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                     platformFilter === 'android' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500 hover:text-slate-700'
                   }`}
                 >
                   Android
                 </button>
               </div>
             </div>

             {/* Search Results Dropdown */}
             {showResults && (
              <div 
                ref={searchResultsRef}
                onScroll={handleScroll}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-[300px] overflow-y-auto"
              >
                {isSearching && searchResults.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                    <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                    Searching...
                  </div>
                )}
                
                {searchResults.length > 0 && searchResults.map((result) => (
                   <button
                      key={result.id}
                      onClick={() => handleSelectApp(result)}
                      className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <img src={result.icon} alt={result.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 truncate">{result.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            {result.platform === 'ios' ? (
                              <>
                                <Icon name="Smartphone" className="w-3 h-3 text-slate-400" /> 
                                <span className="text-blue-600 font-medium">iOS</span>
                              </>
                            ) : (
                              <>
                                <Icon name="Smartphone" className="w-3 h-3 text-slate-400" /> 
                                <span className="text-green-600 font-medium">Android</span>
                              </>
                            )} 
                            <span className="text-slate-300">•</span>
                            <span className="truncate">{result.developer}</span>
                          </div>
                      </div>
                    </button>
                ))}

                {isSearching && searchResults.length > 0 && (
                   <div className="p-2 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <Icon name="Loader2" className="w-3 h-3 animate-spin" />
                      Loading more...
                   </div>
                )}

                {!isSearching && searchResults.length === 0 && searchQuery && (
                  <div className="p-4 text-center text-slate-500 text-sm">
                     No apps found.
                  </div>
                )}
              </div>
             )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">App Name</label>
              <input 
                type="text" 
                value={details.name}
                onChange={(e) => handleTextChange('name', e.target.value)}
                placeholder="e.g. FinTrack Pro"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <CustomDropdown
                label="Category"
                value={details.category}
                options={categoryOptions}
                onChange={(val) => handleTextChange('category', val)}
                triggerIcon="LayoutGrid"
              />
            </div>
          </div>

          <div>
             <label className="block text-xs font-medium text-slate-600 mb-1">Theme Color</label>
             <div className="flex items-center gap-3">
               <div className="relative group">
                 <input 
                   type="color" 
                   value={details.themeColor}
                   onChange={(e) => handleTextChange('themeColor', e.target.value)}
                   className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none overflow-hidden"
                 />
                 <div className="absolute inset-0 rounded-lg ring-1 ring-slate-200 pointer-events-none group-hover:ring-slate-300" />
               </div>
               <input 
                  type="text" 
                  value={details.themeColor}
                  onChange={(e) => handleTextChange('themeColor', e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 uppercase w-32 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
               />
             </div>
          </div>
        </section>

        {/* Section 2: Assets */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">2. Visual Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dropzone 
              label="Upload App Logo" 
              subLabel="PNG or JPG" 
              preview={details.logo || undefined}
              onFileSelect={handleLogoUpload} 
            />
            <div className="space-y-2">
              <Dropzone 
                label="Upload Screenshots" 
                subLabel="Max 5 screens (Select multiple)" 
                multiple={true}
                onFilesSelect={handleScreenshotsUpload} 
              />
              
              {/* Loading State */}
              {isFetchingAssets && (
                 <div className="flex items-center justify-center p-4 text-slate-500 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                    <Icon name="Loader2" className="w-5 h-5 animate-spin mr-2" />
                    <span className="text-sm">Fetching screenshots...</span>
                 </div>
              )}

              {/* Screenshot thumbnails */}
              {!isFetchingAssets && details.screenshots.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {details.screenshots.map((s, i) => (
                    <div key={i} className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden group border border-slate-200 shadow-sm">
                      <img src={s} alt={`Screen ${i}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeScreenshot(i)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="X" className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Output Settings */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">3. Output Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomDropdown
              label="Duration"
              value={details.duration}
              options={durationOptions}
              onChange={(val) => handleTextChange('duration', val)}
              triggerIcon="Timer"
            />
            
            <CustomDropdown
              label="Size / Aspect Ratio"
              value={details.aspectRatio}
              options={aspectRatioOptions}
              onChange={(val) => handleTextChange('aspectRatio', val)}
              triggerIcon="Maximize"
            />
          </div>

          {details.aspectRatio === AspectRatio.CUSTOM && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Width (px)</label>
                <input 
                  type="number" 
                  value={details.customWidth}
                  onChange={(e) => handleTextChange('customWidth', parseInt(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  min="256"
                  max="4096"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Height (px)</label>
                <input 
                  type="number" 
                  value={details.customHeight}
                  onChange={(e) => handleTextChange('customHeight', parseInt(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  min="256"
                  max="4096"
                />
              </div>
            </div>
          )}
        </section>

        {/* Section 4: Context */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">4. Marketing Context</h2>
          
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Key Selling Point</label>
            <textarea 
              value={details.sellingPoint}
              onChange={(e) => handleTextChange('sellingPoint', e.target.value)}
              placeholder="e.g. Save money automatically with AI-driven insights."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none placeholder:text-slate-400"
            />
          </div>

          <CustomDropdown
            label="Video Tone"
            value={details.tone}
            options={toneOptions}
            onChange={(val) => handleTextChange('tone', val)}
            triggerIcon="Sparkles"
          />
        </section>

        <button
          onClick={onGenerateConcepts}
          disabled={!isReady || isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg mt-4 ${
             !isReady || isGenerating
               ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
               : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:translate-y-[-1px]'
          }`}
        >
          {generationState === GenerationState.GENERATING_CONCEPTS ? (
            <>
              <Icon name="Loader2" className="w-5 h-5 animate-spin" />
              Generating Concepts...
            </>
          ) : (
            <>
              <Icon name="Sparkles" className="w-5 h-5" />
              Generate Concepts
            </>
          )}
        </button>
      </div>
    </div>
  );
};
