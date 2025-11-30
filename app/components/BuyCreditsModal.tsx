import React from "react";
import { X, Zap, Check } from "lucide-react";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PricingTier {
  price: number;
  credits: number;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  { price: 9.99, credits: 1000 },
  { price: 49, credits: 5500, popular: true },
  { price: 99, credits: 12000 },
];

const SHORT_VIDEO_COST = 950; // Credits per short video
const LONG_VIDEO_COST = 1900; // Credits per long video

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleBuy = (tier: PricingTier) => {
    alert(`Buying ${tier.credits} credits for $${tier.price} (Integration coming soon)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Value Prop */}
        <div className="bg-slate-900 p-8 md:p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
           {/* Abstract Background */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-indigo-500 to-transparent"></div>
           
           <div className="relative z-10">
             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-blue-200 mb-6 border border-white/10">
               <Zap className="w-3 h-3 fill-blue-200" />
               Scale your production
             </div>
             <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
               Fuel your <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                 Creative Engine
               </span>
             </h2>
             <p className="text-slate-400 text-sm leading-relaxed">
               Purchase credits to generate high-converting video ads instantly. No monthly commitments, pay as you go.
             </p>
           </div>

           <div className="relative z-10 mt-8 space-y-4">
             <div className="flex items-center gap-3 text-sm text-slate-300">
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                 <Check className="w-4 h-4 text-blue-400" />
               </div>
               <span>Unused credits never expire</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-300">
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                 <Check className="w-4 h-4 text-blue-400" />
               </div>
               <span>Access to all AI models</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-300">
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                 <Check className="w-4 h-4 text-blue-400" />
               </div>
               <span>Commercial usage rights</span>
             </div>
           </div>
        </div>

        {/* Right Side: Pricing Options */}
        <div className="p-8 md:p-10 flex-1 bg-slate-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Select a Package</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4">
            {PRICING_TIERS.map((tier, index) => {
              const shortVideoCount = Math.floor(tier.credits / SHORT_VIDEO_COST);
              const longVideoCount = Math.floor(tier.credits / LONG_VIDEO_COST);
              
              return (
                <button
                  key={index}
                  onClick={() => handleBuy(tier)}
                  className={`relative flex items-center p-4 rounded-2xl border-2 transition-all hover:shadow-lg group text-left
                    ${tier.popular 
                      ? "border-blue-500 bg-white ring-4 ring-blue-500/10" 
                      : "border-slate-200 bg-white hover:border-blue-300"
                    }
                  `}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-bold text-slate-900">{tier.credits}</span>
                      <span className="text-sm font-medium text-slate-500">Credits</span>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-md w-fit">
                        Generate ~{shortVideoCount} Short Videos (15s)
                      </div>
                      {longVideoCount > 0 && (
                        <div className="text-xs font-medium text-purple-600 bg-purple-50 inline-block px-2 py-1 rounded-md w-fit">
                          Or ~{longVideoCount} Long Videos (30s)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xl font-bold text-slate-900">
                      ${tier.price}
                    </div>
                    {/* Optional: Show savings if calculated */}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Secure payment processing powered by Stripe.
          </p>
        </div>

      </div>
    </div>
  );
};
