"use client";

import React, { useState, useEffect } from "react";
import { ServiceLeftPanel } from "@/app/playground/components/ServiceLeftPanel";
import { RightPanel } from "@/app/playground/components/RightPanel";
import {
  ServiceDetails,
  Tone,
  GeneratedConcept,
  GenerationState,
  VideoResult,
  AspectRatio,
  VideoDuration,
  GenerationProgress,
} from "@/app/playground/types";
import { DEFAULT_THEME_COLOR } from "@/app/playground/constants";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SignInModal } from "@/app/components/SignInModal";
import { InsufficientCreditsModal } from "@/app/components/InsufficientCreditsModal";
import { BuyCreditsModal } from "@/app/components/BuyCreditsModal";

export default function ServicePlayground() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | undefined>(undefined);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/user/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch (e) {
      console.error("Failed to fetch credits", e);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await authClient.getSession();
      if (!session) {
        setShowSignIn(true);
        setIsAuthChecking(false);
      } else {
        setUserId(session.user.id);
        setIsAuthChecking(false);
        fetchCredits();
      }
    };
    checkAuth();
  }, []);

  const [details, setDetails] = useState<ServiceDetails>({
    brandName: "",
    serviceType: "",
    themeColor: DEFAULT_THEME_COLOR,
    sellingPoint: "",
    tone: Tone.PROFESSIONAL,
    logo: null,
    aspectRatio: AspectRatio.PORTRAIT,
    customWidth: 1080,
    customHeight: 1920,
    duration: VideoDuration.SHORT,
  });

  const [generationState, setGenerationState] = useState<GenerationState>(
    GenerationState.IDLE
  );
  const [concepts, setConcepts] = useState<GeneratedConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);

  const handleGenerateConcepts = async () => {
    setGenerationState(GenerationState.GENERATING_CONCEPTS);
    setConcepts([]);

    try {
      // We might need to adapt the payload for the API or update the API to handle ServiceDetails
      // For now, sending details as is.
      const response = await fetch("/api/generate-service-concepts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        if (response.status === 402) {
          setShowInsufficientCredits(true);
          setGenerationState(GenerationState.IDLE);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const generated = await response.json();

      if (generated && generated.length > 0) {
        setConcepts(generated);
        setGenerationState(GenerationState.AWAITING_SELECTION);
        fetchCredits();
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
    setProgress({
      currentStep: 0,
      totalSteps: details.duration === VideoDuration.LONG ? 4 : 2,
      message: "Initializing...",
    });

    const concept = concepts.find((c) => c.id === selectedConceptId);
    if (!concept) return;

    let step = 0;
    const totalSteps = details.duration === VideoDuration.LONG ? 4 : 2;
    const progressInterval = setInterval(() => {
      if (step < totalSteps - 1) {
        step++;
        setProgress({
          currentStep: step,
          totalSteps,
          message: `Generating Scene ${step}...`,
        });
      }
    }, 10000);

    try {
      const response = await fetch("/api/generate-service-video-veo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ concept, details }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        if (response.status === 402) {
          setShowInsufficientCredits(true);
          setGenerationState(GenerationState.AWAITING_SELECTION);
          setProgress(null);
          return;
        }
        const err = await response.json();
        throw new Error(err.error || "Video generation failed");
      }

      const result = await response.json();

      if (result && result.videoUrl) {
        let scriptText = `${concept.script.scene1} || ${concept.script.scene2}`;
        if (concept.script.scene3 && concept.script.scene4) {
          scriptText += ` || ${concept.script.scene3} || ${concept.script.scene4}`;
        }

        setVideoResult({
          videoUrl: result.videoUrl,
          script: scriptText,
          aspectRatio: result.aspectRatio,
        });
        setGenerationState(GenerationState.COMPLETE);
        setProgress(null);
        fetchCredits();
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
      <SignInModal isOpen={showSignIn} onClose={() => router.push("/")} />
      <InsufficientCreditsModal
        isOpen={showInsufficientCredits}
        onClose={() => setShowInsufficientCredits(false)}
        onBuyCredits={() => setShowBuyCredits(true)}
      />
      <BuyCreditsModal
        isOpen={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
      />
      <ServiceLeftPanel
        details={details}
        setDetails={setDetails}
        onGenerateConcepts={handleGenerateConcepts}
        generationState={generationState}
        onBack={() => {
          router.push("/");
        }}
        userId={userId}
        credits={credits}
        onBuyCredits={() => setShowBuyCredits(true)}
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
