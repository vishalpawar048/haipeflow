"use client";

import React, { useState, useEffect } from 'react';
import { LeftPanel } from '@/app/playground/components/LeftPanel';
import { RightPanel } from '@/app/playground/components/RightPanel';
import { AppDetails, AppCategory, Tone, GeneratedConcept, GenerationState, VideoResult, AspectRatio, VideoDuration, GenerationProgress } from '@/app/playground/types';
import { DEFAULT_THEME_COLOR } from '@/app/playground/constants';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Playground() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await authClient.getSession();
      if (!session) {
        router.push('/sign-in');
      } else {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const [details, setDetails] = useState<AppDetails>({
    name: '',
    category: AppCategory.UTILITY,
    themeColor: DEFAULT_THEME_COLOR,
    sellingPoint: '',
    tone: Tone.PROFESSIONAL,
    logo: null,
    screenshots: [],
    aspectRatio: AspectRatio.PORTRAIT,
    customWidth: 1080,
    customHeight: 1920,
    duration: VideoDuration.SHORT // Default 15s
  });

  const [generationState, setGenerationState] = useState<GenerationState>(GenerationState.IDLE);
  const [concepts, setConcepts] = useState<GeneratedConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);

  const handleGenerateConcepts = async () => {
    setGenerationState(GenerationState.GENERATING_CONCEPTS);
    setConcepts([]);
    
    try {
      const response = await fetch('/api/generate-concepts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const generated = await response.json();
      
      if (generated && generated.length > 0) {
        setConcepts(generated);
        setGenerationState(GenerationState.AWAITING_SELECTION);
      } else {
        throw new Error("No concepts generated.");
      }
    } catch (error) {
      console.error("Concept generation failed", error);
      setGenerationState(GenerationState.IDLE);
      alert("Failed to generate concepts. Please try again.");
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedConceptId) return;
    
    setGenerationState(GenerationState.GENERATING_VIDEO);
    // Initial progress
    setProgress({ currentStep: 0, totalSteps: details.duration === VideoDuration.LONG ? 4 : 2, message: "Initializing..." });
    
    const concept = concepts.find(c => c.id === selectedConceptId);
    if (!concept) return;

    // We can simulate progress steps for UI feedback while the request is pending
    // since the real API call is a single long-running request in this version.
    // (In a more advanced version, use Server-Sent Events for real-time progress)
    let step = 0;
    const totalSteps = details.duration === VideoDuration.LONG ? 4 : 2;
    const progressInterval = setInterval(() => {
        if (step < totalSteps - 1) {
            step++;
            setProgress({ 
                currentStep: step, 
                totalSteps, 
                message: `Generating Scene ${step}...` 
            });
        }
    }, 10000); // update every 10s as a guess

    try {
      const response = await fetch('/api/generate-video-veo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ concept, details }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Video generation failed");
      }

      const result = await response.json();
      
      if (result && result.videoUrl) {
        // Construct a display script
        let scriptText = `${concept.script.scene1} || ${concept.script.scene2}`;
        if (concept.script.scene3 && concept.script.scene4) {
            scriptText += ` || ${concept.script.scene3} || ${concept.script.scene4}`;
        }

        setVideoResult({
          videoUrl: result.videoUrl,
          script: scriptText,
          aspectRatio: result.aspectRatio
        });
        setGenerationState(GenerationState.COMPLETE);
        setProgress(null);
      } else {
        throw new Error("Video generation returned invalid result");
      }

    } catch (error: any) {
      clearInterval(progressInterval);
      console.error("Video generation failed", error);
      setGenerationState(GenerationState.AWAITING_SELECTION);
      setProgress(null);
      alert(`Video generation failed: ${error.message}`);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      <LeftPanel 
        details={details}
        setDetails={setDetails}
        onGenerateConcepts={handleGenerateConcepts}
        generationState={generationState}
        onBack={() => {
            authClient.signOut().then(() => {
                router.push('/');
            });
        }}
      />
      <RightPanel 
        generationState={generationState}
        concepts={concepts}
        selectedConceptId={selectedConceptId}
        onSelectConcept={setSelectedConceptId}
        onGenerateVideo={handleGenerateVideo}
        videoResult={videoResult}
        progress={progress}
      />
    </div>
  );
}
