import React, { useState } from 'react';
import { GeneratedConcept, GenerationState, VideoResult, GenerationProgress, PreviewPlatform, PreviewDevice } from '@/app/playground/types';
import { PREVIEW_PLATFORMS } from '@/app/playground/constants';
import { Icon } from './Icon';
import { CustomDropdown } from './CustomDropdown';

interface RightPanelProps {
  generationState: GenerationState;
  concepts: GeneratedConcept[];
  selectedConceptId: string | null;
  onSelectConcept: (id: string) => void;
  onGenerateVideo: () => void;
  videoResult: VideoResult | null;
  progress?: GenerationProgress | null;
}

// --- Helper Components for Preview Frames ---

const PlatformOverlay = ({ children }: { children?: React.ReactNode }) => (
  <div className="absolute inset-0 pointer-events-none z-10">{children}</div>
);

const InstagramReelFrame = ({ children }: { children?: React.ReactNode }) => (
  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black shadow-2xl">
    <div className="absolute inset-0">{children}</div>
    <PlatformOverlay>
      <div className="flex flex-col h-full justify-between p-4 pb-8">
        <div className="flex justify-between items-center text-white/90">
           <span className="font-bold text-lg">Reels</span>
           <Icon name="Camera" className="w-6 h-6" />
        </div>
        <div className="flex items-end justify-between">
           <div className="space-y-2 mb-4 text-white">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-slate-200 rounded-full" />
                 <span className="font-semibold text-sm">HaipeFlow</span>
                 <span className="text-xs border border-white/50 rounded px-1">Follow</span>
              </div>
              <p className="text-sm line-clamp-2">The best app for your daily needs. #app #tech #download</p>
              <div className="flex items-center gap-2 text-xs opacity-90">
                 <Icon name="Music2" className="w-3 h-3" />
                 <span>Original Audio</span>
              </div>
           </div>
           <div className="flex flex-col gap-6 items-center text-white mb-2">
              <div className="flex flex-col items-center gap-1">
                 <Icon name="Heart" className="w-7 h-7" />
                 <span className="text-xs">12.5K</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="MessageCircle" className="w-7 h-7" />
                 <span className="text-xs">432</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="Send" className="w-7 h-7" />
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="MoreHorizontal" className="w-7 h-7" />
              </div>
              <div className="w-8 h-8 bg-slate-800 border-2 border-white rounded-lg" />
           </div>
        </div>
      </div>
    </PlatformOverlay>
  </div>
);

const TikTokFrame = ({ children }: { children?: React.ReactNode }) => (
  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black shadow-2xl">
    <div className="absolute inset-0">{children}</div>
    <PlatformOverlay>
      <div className="flex flex-col h-full justify-between p-4 pb-4">
        <div className="flex justify-center text-white/50 font-bold pt-2">
           <span className="mr-4 text-white border-b-2 border-white pb-1">For You</span>
           <span>Following</span>
        </div>
        <div className="flex items-end justify-between">
           <div className="space-y-2 mb-2 text-white w-[80%]">
              <div className="font-bold text-shadow-sm">@HaipeFlow</div>
              <p className="text-sm line-clamp-2 text-shadow-sm">Stop scrolling! Check this out. #fyp #viral #app</p>
              <div className="flex items-center gap-2 text-xs opacity-90">
                 <Icon name="Music" className="w-3 h-3" />
                 <span className="sliding-text">Original Sound - Haipe Flow</span>
              </div>
           </div>
           <div className="flex flex-col gap-5 items-center text-white mb-2">
              <div className="relative">
                 <div className="w-10 h-10 bg-slate-200 rounded-full border border-white" />
                 <div className="absolute -bottom-1 left-3 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                    <Icon name="Plus" className="w-3 h-3 text-white" />
                 </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="Heart" className="w-8 h-8 fill-white/10" />
                 <span className="text-xs font-semibold">85.4K</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="MessageCircle" className="w-8 h-8 fill-white/10" />
                 <span className="text-xs font-semibold">1024</span>
              </div>
               <div className="flex flex-col items-center gap-1">
                 <Icon name="Bookmark" className="w-8 h-8 fill-white/10" />
                 <span className="text-xs font-semibold">4.2K</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="Share2" className="w-8 h-8 fill-white/10" />
                 <span className="text-xs font-semibold">Share</span>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full animate-spin border-4 border-slate-700" />
           </div>
        </div>
      </div>
    </PlatformOverlay>
  </div>
);

const YouTubeShortsFrame = ({ children }: { children?: React.ReactNode }) => (
  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black shadow-2xl">
    <div className="absolute inset-0">{children}</div>
    <PlatformOverlay>
      <div className="flex flex-col h-full justify-between p-4 pb-4">
         <div className="flex justify-between items-center text-white">
            <Icon name="Search" className="w-6 h-6" />
            <div className="flex gap-4">
               <Icon name="Camera" className="w-6 h-6" />
               <Icon name="MoreVertical" className="w-6 h-6" />
            </div>
         </div>
         <div className="flex items-end justify-between">
           <div className="space-y-3 mb-2 text-white w-[85%]">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-slate-500 rounded-full" />
                 <span className="font-semibold text-sm">Haipe Flow Official</span>
                 <button className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full">Subscribe</button>
              </div>
              <p className="text-sm line-clamp-2">Best productivity app 2024! 🚀 Link in bio.</p>
              <div className="bg-white/20 backdrop-blur-md rounded px-2 py-1 text-xs inline-flex items-center gap-1">
                 <Icon name="Music2" className="w-3 h-3" />
                 <span>Promo Sound</span>
              </div>
           </div>
           <div className="flex flex-col gap-6 items-center text-white mb-2">
              <div className="flex flex-col items-center gap-1">
                 <Icon name="ThumbsUp" className="w-7 h-7" />
                 <span className="text-xs font-semibold">12K</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="ThumbsDown" className="w-7 h-7" />
                 <span className="text-xs font-semibold">Dislike</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="MessageSquare" className="w-7 h-7" />
                 <span className="text-xs font-semibold">455</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <Icon name="Share" className="w-7 h-7" />
                 <span className="text-xs font-semibold">Share</span>
              </div>
               <div className="w-9 h-9 bg-slate-700 rounded-lg" />
           </div>
         </div>
      </div>
    </PlatformOverlay>
  </div>
);

const MetaAdsFrame = ({ children }: { children?: React.ReactNode }) => (
   <div className="bg-white text-black w-full h-full flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-gray-100 bg-white">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full" />
            <div>
               <p className="text-sm font-bold leading-tight">Haipe Flow <span className="text-blue-500 ml-1 text-[10px]">&#10003;</span></p>
               <p className="text-[10px] text-gray-500">Sponsored • <Icon name="Globe" className="w-3 h-3 inline" /></p>
            </div>
         </div>
         <Icon name="MoreHorizontal" className="text-gray-500 w-5 h-5" />
      </div>
      
      {/* Text */}
      <div className="px-3 py-2 text-sm text-gray-800 bg-white">
         <p>Stop wasting time. Get organized instantly with our new AI-powered tools. 👇</p>
      </div>

      {/* Video Area (Slot) */}
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
           {children}
      </div>

      {/* CTA Bar */}
      <div className="bg-slate-50 p-2 flex justify-between items-center border-t border-gray-200">
         <div className="text-xs text-gray-600 pl-1">
            <p className="font-bold">HAIPEFLOW.COM</p>
            <p>Install Now</p>
         </div>
         <button className="bg-slate-200 text-slate-800 text-sm font-semibold px-4 py-1.5 rounded border border-slate-300">Learn More</button>
      </div>
      
      {/* Interaction Bar */}
      <div className="p-2 flex justify-around items-center border-t border-gray-100 text-gray-500 bg-white">
         <div className="flex items-center gap-1"><Icon name="ThumbsUp" className="w-5 h-5" /> <span className="text-xs">Like</span></div>
         <div className="flex items-center gap-1"><Icon name="MessageCircle" className="w-5 h-5" /> <span className="text-xs">Comment</span></div>
         <div className="flex items-center gap-1"><Icon name="Share2" className="w-5 h-5" /> <span className="text-xs">Share</span></div>
      </div>
   </div>
);

const YouTubeVideoFrame = ({ children }: { children?: React.ReactNode }) => (
   <div className="flex flex-col h-full bg-white text-black rounded-xl overflow-hidden border border-slate-200 shadow-xl">
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          {children}
      </div>
      <div className="p-4 space-y-4 bg-white">
         <div className="space-y-1">
           <h3 className="text-lg font-bold line-clamp-2">Introducing Haipe Flow: The Future of Marketing</h3>
           <div className="flex text-xs text-gray-600 gap-1">
              <span>1.2M views</span>
              <span>•</span>
              <span>2 hours ago</span>
           </div>
         </div>
         
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-purple-600 rounded-full" />
               <div>
                  <p className="text-sm font-bold">Haipe Flow Official</p>
                  <p className="text-xs text-gray-500">250K subscribers</p>
               </div>
               <button className="bg-black text-white text-sm font-bold px-4 py-2 rounded-full ml-2">Subscribe</button>
            </div>
            <div className="flex items-center gap-2">
               <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm font-medium"><Icon name="ThumbsUp" className="w-4 h-4" /> 24K | <Icon name="ThumbsDown" className="w-4 h-4" /></button>
               <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm font-medium"><Icon name="Share2" className="w-4 h-4" /> Share</button>
            </div>
         </div>
      </div>
   </div>
);

export const RightPanel: React.FC<RightPanelProps> = ({
  generationState,
  concepts,
  selectedConceptId,
  onSelectConcept,
  onGenerateVideo,
  videoResult,
  progress
}) => {
  const [previewPlatform, setPreviewPlatform] = useState<PreviewPlatform>(PreviewPlatform.INSTAGRAM_REEL);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>(PreviewDevice.MOBILE);

  // State A: Empty
  if (generationState === GenerationState.IDLE) {
    return (
      <div className="w-full md:w-[30%] h-full bg-slate-50 flex flex-col items-center justify-center text-slate-500 p-10 border-l border-slate-200">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-200">
          <Icon name="Video" className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Ready to Create</h2>
        <p className="text-center max-w-sm">Configure your app details on the left and hit generate to see magic happen.</p>
      </div>
    );
  }

  // State: Loading Concepts
  if (generationState === GenerationState.GENERATING_CONCEPTS) {
     return (
      <div className="w-full md:w-[30%] h-full bg-slate-50 flex flex-col items-center justify-center p-10 border-l border-slate-200">
        <div className="relative w-32 h-32 mb-8">
           <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <Icon name="BrainCircuit" className="w-10 h-10 text-blue-500" />
           </div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Assets</h2>
        <p className="text-slate-500 text-center animate-pulse">Designing visual hooks and writing scripts...</p>
      </div>
     );
  }

  // State B: Selection Mode
  if (generationState === GenerationState.AWAITING_SELECTION || (generationState === GenerationState.GENERATING_VIDEO && !videoResult)) {
    return (
      <div className="w-full md:w-[30%] h-full bg-slate-50 overflow-y-auto p-6 md:p-10 relative border-l border-slate-200">
        <header className="flex flex-col gap-4 mb-8 sticky top-0 bg-slate-50 z-10 py-4 border-b border-slate-200">
           <div>
             <h2 className="text-2xl font-bold text-slate-900">Select Concept</h2>
             <p className="text-slate-500 text-sm">Choose the best visual direction & script.</p>
           </div>
           {selectedConceptId && (
             <button
               onClick={onGenerateVideo}
               disabled={generationState === GenerationState.GENERATING_VIDEO}
               className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full shadow-lg shadow-green-500/20"
             >
               {generationState === GenerationState.GENERATING_VIDEO ? (
                 <>
                   <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                   Synthesizing...
                 </>
               ) : (
                 <>
                   Create Video <Icon name="ArrowRight" className="w-4 h-4" />
                 </>
               )}
             </button>
           )}
        </header>

        <div className="grid grid-cols-1 gap-6 pb-20">
           {concepts.map((concept) => (
             <div 
               key={concept.id}
               onClick={() => generationState !== GenerationState.GENERATING_VIDEO && onSelectConcept(concept.id)}
               className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white shadow-sm ${
                 selectedConceptId === concept.id 
                   ? 'border-green-500 ring-2 ring-green-100 scale-[1.02]' 
                   : 'border-slate-200 hover:border-slate-300'
               }`}
             >
               {/* Visual Preview */}
               <div className="h-48 flex">
                  <div className="w-1/2 relative border-r border-slate-100">
                    <img src={concept.startFrame} className="w-full h-full object-cover" alt="Start" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">Start</span>
                  </div>
                  <div className="w-1/2 relative">
                    <img src={concept.endFrame} className="w-full h-full object-cover" alt="End" />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">End</span>
                  </div>
               </div>
               
               {/* Metadata */}
               <div className="p-4 bg-white h-full">
                 <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-1">{concept.description}</h3>
                 <div className="text-xs text-slate-500 space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    <div>
                        <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Scene 1</span>
                        <p className="line-clamp-2 text-slate-600">{concept.script.scene1}</p>
                    </div>
                    <div>
                        <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Scene 2</span>
                        <p className="line-clamp-2 text-slate-600">{concept.script.scene2}</p>
                    </div>
                    {concept.script.scene3 && (
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Scene 3</span>
                        <p className="line-clamp-2 text-slate-600">{concept.script.scene3}</p>
                      </div>
                    )}
                     {concept.script.scene4 && (
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Scene 4</span>
                        <p className="line-clamp-2 text-slate-600">{concept.script.scene4}</p>
                      </div>
                    )}
                 </div>
               </div>

               {/* Selection Indicator */}
               {selectedConceptId === concept.id && (
                 <div className="absolute top-2 right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                   <Icon name="Check" className="w-5 h-5" />
                 </div>
               )}
             </div>
           ))}
        </div>

        {generationState === GenerationState.GENERATING_VIDEO && (
           <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md w-full text-center m-4 shadow-2xl">
                 <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Generating Video</h3>
                 
                 {progress ? (
                   <div className="space-y-4">
                     <p className="text-slate-600 font-medium">{progress.message}</p>
                     <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <span className="text-xs font-semibold inline-block text-green-600">
                             Scene {progress.currentStep} of {progress.totalSteps}
                          </span>
                          <span className="text-xs font-semibold inline-block text-green-600">
                             {Math.round((progress.currentStep / progress.totalSteps) * 100)}%
                          </span>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                          <div style={{ width: `${(progress.currentStep / progress.totalSteps) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                        </div>
                     </div>
                   </div>
                 ) : (
                    <p className="text-slate-500 mb-6">Initializing video pipeline...</p>
                 )}
                 
                 <p className="text-xs text-slate-400 mt-4">Creating scenes and ensuring character consistency...</p>
              </div>
           </div>
        )}
      </div>
    );
  }

  // State C: Final Preview
  if (videoResult) {
    let FrameContent = InstagramReelFrame; // Default
    let containerClass = "";
    
    if (previewPlatform === PreviewPlatform.INSTAGRAM_REEL) {
        FrameContent = InstagramReelFrame;
        containerClass = "aspect-[9/16] max-h-[650px] w-full max-w-[360px]";
    } else if (previewPlatform === PreviewPlatform.TIKTOK) {
        FrameContent = TikTokFrame;
        containerClass = "aspect-[9/16] max-h-[650px] w-full max-w-[360px]";
    } else if (previewPlatform === PreviewPlatform.YOUTUBE_SHORTS) {
        FrameContent = YouTubeShortsFrame;
        containerClass = "aspect-[9/16] max-h-[650px] w-full max-w-[360px]";
    } else if (previewPlatform === PreviewPlatform.META_ADS) {
        FrameContent = MetaAdsFrame;
        containerClass = "max-w-[400px] w-full h-[600px]"; // Sizing only, radius handled by component
    } else if (previewPlatform === PreviewPlatform.YOUTUBE_VIDEO) {
        FrameContent = YouTubeVideoFrame;
        containerClass = "w-full aspect-[16/9] max-h-[500px]"; // Sizing only, radius handled by component
    }

    const VideoElement = (
       <video 
          src={videoResult.videoUrl} 
          controls={true}
          autoPlay 
          loop
          playsInline
          className="w-full h-full object-cover"
        />
    );

    return (
      <div className="w-full md:w-[30%] h-full bg-slate-50 flex flex-col relative border-l border-slate-200">
        {/* Preview Header */}
        <header className="px-6 py-4 border-b border-slate-200 flex flex-col gap-4 bg-white">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Icon name="Smartphone" className="text-green-600" />
                Preview
              </h2>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                New Project
              </button>
           </div>
           
           <div className="space-y-3">
             {/* Device Toggle */}
             <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium border border-slate-200">
               <button 
                 onClick={() => setPreviewDevice(PreviewDevice.MOBILE)}
                 className={`flex-1 py-1.5 rounded flex items-center justify-center gap-2 transition-colors ${previewDevice === PreviewDevice.MOBILE ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Icon name="Smartphone" className="w-3 h-3" /> Mobile
               </button>
               <button 
                  onClick={() => setPreviewDevice(PreviewDevice.DESKTOP)}
                  className={`flex-1 py-1.5 rounded flex items-center justify-center gap-2 transition-colors ${previewDevice === PreviewDevice.DESKTOP ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Icon name="Monitor" className="w-3 h-3" /> Desktop
               </button>
             </div>

             {/* Platform Selector */}
             <CustomDropdown 
                label=""
                value={previewPlatform}
                options={PREVIEW_PLATFORMS.map(p => ({ 
                   value: p.value, 
                   label: p.label, 
                   icon: p.icon as any 
                }))}
                onChange={(val) => setPreviewPlatform(val)}
                className="w-full"
             />
           </div>
        </header>

        {/* Preview Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-100 overflow-hidden relative">
           
           <div className={`relative transition-all duration-500 ${containerClass}`}>
              <FrameContent>
                 {VideoElement}
              </FrameContent>
           </div>

           {/* Action Buttons */}
           <div className="mt-6 flex gap-3 w-full max-w-xs">
             <a 
               href={videoResult.videoUrl} 
               download="haipe-flow.mp4"
               className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
             >
               <Icon name="Download" className="w-4 h-4" />
               Save
             </a>
             <button className="bg-white text-slate-700 p-2 rounded-lg hover:bg-slate-50 border border-slate-200 shadow-sm">
               <Icon name="Share2" className="w-4 h-4" />
             </button>
           </div>
        </div>

      </div>
    );
  }

  return null;
};

