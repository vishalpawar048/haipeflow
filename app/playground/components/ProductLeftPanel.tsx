import React, { useState, useRef } from "react";
import {
  ProductDetails,
  GenerationState,
  AspectRatio,
} from "@/app/playground/types";
import { TONES, VIDEO_DURATIONS } from "@/app/playground/constants";
import { Dropzone } from "./Dropzone";
import { Icon } from "./Icon";
import { CustomDropdown, DropdownOption } from "./CustomDropdown";

interface ProductLeftPanelProps {
  details: ProductDetails;
  setDetails: React.Dispatch<React.SetStateAction<ProductDetails>>;
  onGenerateConcepts: () => void;
  generationState: GenerationState;
  onBack?: () => void;
  userId: string | null;
}

export const ProductLeftPanel: React.FC<ProductLeftPanelProps> = ({
  details,
  setDetails,
  onGenerateConcepts,
  generationState,
  onBack,
  userId
}) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTextChange = (field: keyof ProductDetails, value: any) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setDetails((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleProductPhotosUpload = async (files: File[]) => {
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    try {
      const results = await Promise.all(readers);
      setDetails((prev) => {
        const currentCount = prev.productPhotos.length;
        const availableSlots = 5 - currentCount;
        if (availableSlots <= 0) return prev;
        const newPhotos = results.slice(0, availableSlots);
        return {
          ...prev,
          productPhotos: [...prev.productPhotos, ...newPhotos],
        };
      });
    } catch (error) {
      console.error("Error reading files", error);
    }
  };

  const removeProductPhoto = (index: number) => {
    setDetails((prev) => ({
      ...prev,
      productPhotos: prev.productPhotos.filter((_, i) => i !== index),
    }));
  };

  const isGenerating =
    generationState !== GenerationState.IDLE &&
    generationState !== GenerationState.COMPLETE &&
    generationState !== GenerationState.AWAITING_SELECTION;
  const isReady = details.productName && details.productType && details.sellingPoint && details.logo;

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
          Generate high-conversion product promotion videos.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Core Identity */}
        <section className="space-y-4">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100 pb-2">
            1. Product Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={details.productName}
                onChange={(e) => handleTextChange("productName", e.target.value)}
                placeholder="e.g. UltraPhone X"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Type of Product
              </label>
              <input
                type="text"
                value={details.productType}
                onChange={(e) => handleTextChange("productType", e.target.value)}
                placeholder="e.g. Electronics"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dropzone
              label="Upload Brand Logo"
              subLabel="PNG or JPG"
              preview={details.logo || undefined}
              onFileSelect={handleLogoUpload}
            />
            <div className="space-y-2">
              <Dropzone
                label="Upload Product Photos"
                subLabel="Max 5 photos (Select multiple)"
                multiple={true}
                onFilesSelect={handleProductPhotosUpload}
              />

              {/* Photo thumbnails */}
              {details.productPhotos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {details.productPhotos.map((s, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden group border border-slate-200 shadow-sm"
                    >
                      <img
                        src={s}
                        alt={`Product ${i}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeProductPhoto(i)}
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
              Product Description / Selling Point
            </label>
            <textarea
              value={details.sellingPoint}
              onChange={(e) => handleTextChange("sellingPoint", e.target.value)}
              placeholder="e.g. The most advanced smartphone with a revolutionary camera system."
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

