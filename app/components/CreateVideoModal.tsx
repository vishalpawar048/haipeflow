import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Briefcase, ShoppingBag, Smartphone, ArrowRight } from "lucide-react";

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VideoType = "service" | "product" | "app";

export const CreateVideoModal: React.FC<CreateVideoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<VideoType | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (!selectedType) return;

    switch (selectedType) {
      case "service":
        router.push("/service-promotion/playground");
        break;
      case "product":
        router.push("/product-promotion/playground");
        break;
      case "app":
        router.push("/app-promotion/playground");
        break;
    }
    onClose();
  };

  const options = [
    {
      id: "service",
      title: "Service Promotion",
      description: "Promote your agency, consultancy, or local service.",
      icon: Briefcase,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "peer-checked:border-emerald-500",
      ring: "peer-checked:ring-emerald-500",
    },
    {
      id: "product",
      title: "Product Promotion",
      description: "Showcase physical or digital products for social commerce.",
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "peer-checked:border-purple-500",
      ring: "peer-checked:ring-purple-500",
    },
    {
      id: "app",
      title: "App Promotion",
      description: "Create high-converting ads for iOS or Android apps.",
      icon: Smartphone,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "peer-checked:border-blue-500",
      ring: "peer-checked:ring-blue-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Video</h2>
            <p className="text-sm text-slate-500">Select the type of video you want to generate</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid gap-4">
          {options.map((option) => (
            <label
              key={option.id}
              className="relative flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 cursor-pointer transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <input
                type="radio"
                name="videoType"
                value={option.id}
                checked={selectedType === option.id}
                onChange={() => setSelectedType(option.id as VideoType)}
                className="peer sr-only"
              />
              {/* Active State Styling */}
              <div className={`absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none transition-all ${option.border} peer-checked:bg-slate-50/50`} />
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${option.bg} ${option.color}`}>
                <option.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{option.title}</h3>
                <p className="text-sm text-slate-500">{option.description}</p>
              </div>

              {/* Checkbox Indicator */}
              <div className={`w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center transition-colors peer-checked:border-transparent peer-checked:bg-blue-600`}>
                <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
              </div>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedType}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all shadow-lg ${
              selectedType
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 hover:translate-y-[-1px]"
                : "bg-slate-300 cursor-not-allowed shadow-none"
            }`}
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

