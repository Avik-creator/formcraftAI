"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { useBillingInfoQuery } from "@/data-fetching/client/billing";
import { Suspense } from "react";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const checkoutId = params.get("checkout_id") || params.get("checkoutId");
  const { data: billingInfo, isLoading } = useBillingInfoQuery();

  const isPro = Boolean(billingInfo?.isPro);

  return (
    <div className="relative w-full max-w-2xl bg-zinc-900/40 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center">
      <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-green-900/20 flex items-center justify-center border border-green-800">
        <CheckCircle2 className="h-7 w-7 text-green-400" />
      </div>
      <h1 className="text-3xl font-bold text-white">Payment successful</h1>
      <p className="text-zinc-400 mt-2">
        {isLoading
          ? "Finalizing your purchase..."
          : isPro
          ? "You're now on Pro. Enjoy unlimited forms and submissions!"
          : "Your order is confirmed. Pro access will be activated shortly."}
      </p>

      {checkoutId && (
        <p className="mt-3 text-xs text-zinc-500">
          Checkout ID: <span className="text-zinc-300">{checkoutId}</span>
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 mt-8">
        <Button
          className="w-full bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/60"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </Button>

        <Link href="/">
          <Button variant="ghost" className="w-full border border-zinc-700/60 bg-zinc-800/60 hover:bg-zinc-700/60">
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
        <Info className="h-3.5 w-3.5" />
        <span>
          Keep this tab open for a few seconds if Pro isn't active yet. We apply upgrades as soon as webhooks arrive.
        </span>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-[70vh] w-full flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="relative w-full max-w-2xl bg-zinc-900/40 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-green-900/20 flex items-center justify-center border border-green-800">
            <CheckCircle2 className="h-7 w-7 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Payment successful</h1>
          <p className="text-zinc-400 mt-2">Finalizing your purchase...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}