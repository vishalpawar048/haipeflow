"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@/app/playground/components/Icon";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.status === "PAID") {
          setStatus("success");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification failed", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Icon name="Loader2" className="w-12 h-12 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-slate-900">Verifying Payment...</h2>
            <p className="text-slate-500">Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Icon name="Check" className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
            <p className="text-slate-500">Credits have been added to your account.</p>
            <p className="text-sm text-blue-600 font-medium">Redirecting to home...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <Icon name="X" className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Payment Failed</h2>
            <p className="text-slate-500">Something went wrong. Please try again or contact support.</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Icon name="Loader2" className="w-8 h-8 animate-spin" /></div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}

