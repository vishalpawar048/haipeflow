import React from "react";
import { X, AlertCircle } from "lucide-react";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyCredits: () => void;
}

export const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({
  isOpen,
  onClose,
  onBuyCredits,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Insufficient Credits
          </h2>
          
          <p className="text-slate-600 mb-6">
            You have run out of credits to perform this action. Please purchase more credits to continue generating high-quality content.
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onBuyCredits();
                onClose();
              }}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              Buy Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

