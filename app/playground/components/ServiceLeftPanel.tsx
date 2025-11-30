import React, { useState, useRef } from "react";
import {
  ServiceDetails,
  GenerationState,
  AspectRatio,
} from "@/app/playground/types";
import { TONES, VIDEO_DURATIONS } from "@/app/playground/constants";
import { Dropzone } from "./Dropzone";
import { Icon } from "./Icon";
import { CustomDropdown, DropdownOption } from "./CustomDropdown";

interface ServiceLeftPanelProps {
  details: ServiceDetails;
  setDetails: React.Dispatch<React.SetStateAction<ServiceDetails>>;
  onGenerateConcepts: () => void;
  generationState: GenerationState;
  onBack?: () => void;
  userId: string | null;
  credits?: number;
  onBuyCredits?: () => void;
}

export const ServiceLeftPanel: React.FC<ServiceLeftPanelProps> = ({
  details,
  setDetails,
  onGenerateConcepts,
  generationState,
  onBack,
  userId,
  credits,
  onBuyCredits,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTextChange = (field: keyof ServiceDetails, value: any) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setDetails((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const isGenerating =
    generationState !== GenerationState.IDLE &&
    generationState !== GenerationState.COMPLETE &&
    generationState !== GenerationState.AWAITING_SELECTION;
  const isReady =
    details.brandName && details.serviceType && details.sellingPoint;

  const toneOptions: DropdownOption[] = TONES.map((t) => ({
    label: t,
    value: t,
    icon: "Music2",
  }));

  const aspectRatioOptions: DropdownOption[] = [
    {
      label: "Vertical (9:16)",
      subLabel: "Best for Stories/Reels",
      value: AspectRatio.PORTRAIT,
      icon: "Smartphone",
    },
    {
      label: "Landscape (16:9)",
      subLabel: "Best for YouTube",
      value: AspectRatio.LANDSCAPE,
      icon: "Monitor",
    },
    {
      label: "Square (1:1)",
      subLabel: "Best for Feed",
      value: AspectRatio.SQUARE,
      icon: "Square",
    },
    {
      label: "Custom Size",
      subLabel: "Define px",
      value: AspectRatio.CUSTOM,
      icon: "Settings",
    },
  ];

  const durationOptions: DropdownOption[] = VIDEO_DURATIONS.map((d) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label: d.label,
    value: d.value,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: d.icon as any,
  }));

  return (
    <div className="w-full md:w-[70%] h-full overflow-y-auto bg-white border-r border-slate-200 p-6 md:p-10 pb-32">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              Back to Home
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200 whitespace-nowrap">
              {credits !== undefined
                ? `${Math.round(credits)} Credits`
                : "Loading..."}
            </div>
            {onBuyCredits && (
              <button
                onClick={onBuyCredits}
                className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap"
              >
                + Buy
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <img
            src="/logo.png"
            alt="Haipe Flow Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Haipe Flow
          </h1>
        </div>
        <p className="text-slate-500">
          Generate high-conversion service promotion videos.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Core Identity */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">
            1. Service Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={details.brandName}
                onChange={(e) => handleTextChange("brandName", e.target.value)}
                placeholder="e.g. Apex Consulting"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Type of Service
              </label>
              <input
                type="text"
                value={details.serviceType}
                onChange={(e) =>
                  handleTextChange("serviceType", e.target.value)
                }
                placeholder="e.g. Digital Marketing"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Theme Color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <input
                  type="color"
                  value={details.themeColor}
                  onChange={(e) =>
                    handleTextChange("themeColor", e.target.value)
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none overflow-hidden"
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-slate-200 pointer-events-none group-hover:ring-slate-300" />
              </div>
              <input
                type="text"
                value={details.themeColor}
                onChange={(e) => handleTextChange("themeColor", e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 uppercase w-32 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Assets */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">
            2. Visual Assets
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Dropzone
              label="Upload Brand Logo"
              subLabel="PNG or JPG"
              preview={details.logo || undefined}
              onFileSelect={handleLogoUpload}
            />
          </div>
        </section>

        {/* Section 3: Output Settings */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">
            3. Output Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomDropdown
              label="Duration"
              value={details.duration}
              options={durationOptions}
              onChange={(val) => handleTextChange("duration", val)}
              triggerIcon="Timer"
            />

            <CustomDropdown
              label="Size / Aspect Ratio"
              value={details.aspectRatio}
              options={aspectRatioOptions}
              onChange={(val) => handleTextChange("aspectRatio", val)}
              triggerIcon="Maximize"
            />
          </div>

          {details.aspectRatio === AspectRatio.CUSTOM && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={details.customWidth}
                  onChange={(e) =>
                    handleTextChange("customWidth", parseInt(e.target.value))
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  min="256"
                  max="4096"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={details.customHeight}
                  onChange={(e) =>
                    handleTextChange("customHeight", parseInt(e.target.value))
                  }
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
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">
            4. Marketing Context
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Key Selling Point
            </label>
            <textarea
              value={details.sellingPoint}
              onChange={(e) => handleTextChange("sellingPoint", e.target.value)}
              placeholder="e.g. We help you grow your business 10x faster."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none placeholder:text-slate-400"
            />
          </div>

          <CustomDropdown
            label="Video Tone"
            value={details.tone}
            options={toneOptions}
            onChange={(val) => handleTextChange("tone", val)}
            triggerIcon="Sparkles"
          />
        </section>

        <button
          onClick={onGenerateConcepts}
          disabled={!isReady || isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg mt-4 ${
            !isReady || isGenerating
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:translate-y-[-1px]"
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
