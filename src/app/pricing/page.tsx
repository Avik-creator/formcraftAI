"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useBillingInfoQuery } from "@/data-fetching/client/billing";

type Feature = {
  text: string;
  included: boolean;
};

type Plan = {
  name: string;
  description: string;
  price: number;
  isPopular?: boolean;
  buttonText: string;
  buttonColorClass: string;
  features: Feature[];
};

const plans: Plan[] = [
  {
    name: "Free",
    description: "Perfect for getting started with form building",
    price: 0,
    buttonText: "Get started",
    buttonColorClass: "bg-black hover:bg-gray-800 text-white",
    features: [
      { text: "Up to 3 forms", included: true },
      { text: "100 submissions per month", included: true },
      { text: "Basic form templates", included: true },
    ]
  },
  {
    name: "Pro",
    description: "For professionals and growing teams",
    price: 20,
    isPopular: true,
    buttonText: "Get lifetime access",
    buttonColorClass: "bg-black hover:bg-gray-800 text-white",
    features: [
      { text: "Unlimited forms", included: true },
      { text: "Unlimited submissions", included: true },
      { text: "Google Sheets integration", included: true },
    ]
  }
];

export default function PricingSection() {
  const { user } = useUser();
  const proProductId = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID;
  const { data: billingInfo } = useBillingInfoQuery();
  const isPro = Boolean(billingInfo?.isPro);
  const maxForms = billingInfo?.limits?.maxForms ?? 0;
  const formsCount = billingInfo?.usage?.formsCount ?? 0;

  function getProCheckoutHref() {
    const params = new URLSearchParams();
    if (proProductId) params.set("products", String(proProductId));
    if (user?.id) params.set("customerExternalId", user.id);
    const email = user?.primaryEmailAddress?.emailAddress;
    if (email) params.set("customerEmail", email);
    if (user?.fullName) params.set("customerName", user.fullName);
    if (user?.id) params.set("metadata", JSON.stringify({ appUserId: user.id }));
    return `/checkout?${params.toString()}`;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full px-4 py-2 mb-6">
          <span className="text-xs font-medium text-zinc-300">💎 LIFETIME DEAL</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-400">
          Simple, Transparent Pricing
        </h2>
        <p className="text-zinc-300 text-lg md:text-xl mb-4 leading-relaxed">
          Choose the plan that&apos;s right for you. Pay once, use forever.
        </p>
        <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
          Once you reach the Free plan limit (3 forms, 100 submissions/month), you&apos;ll be redirected here automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-2xl border p-8 transition-all duration-500 hover:scale-[1.02] group",
              plan.isPopular 
                ? "bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border-zinc-600/50 shadow-2xl shadow-zinc-900/50 ring-1 ring-zinc-600/20" 
                : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/60"
            )}>
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-zinc-600 to-zinc-700 text-white px-4 py-2 rounded-full text-xs font-semibold border border-zinc-500/50 shadow-lg">
                  ⭐ Most Popular
                </div>
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
              <p className="text-zinc-400 text-base leading-relaxed">{plan.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold text-white">
                  ${plan.price}
                </span>
                <span className="text-zinc-400 text-xl font-medium">
                  {plan.price === 0 ? "/forever" : "/lifetime"}
                </span>
              </div>
              <p className="text-zinc-400 text-sm font-medium">
                {plan.price === 0 ? "Free forever • No credit card required" : "One-time payment • No recurring fees"}
              </p>
            </div>

            <div className="flex-grow mb-8">
              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-900/30 border border-green-700/50 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center mt-0.5">
                        <XCircle className="w-3 h-3 text-red-400" />
                      </div>
                    )}
                    <span className="text-zinc-300 text-sm font-medium leading-relaxed">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {plan.name === "Pro" ? (
                isPro ? (
                  <Link href="/dashboard">
                    <Button className="w-full h-12 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 border-zinc-600/50 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href={user ? getProCheckoutHref() : `/sign-in?redirect_url=${encodeURIComponent(getProCheckoutHref())}` }>
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-white to-zinc-100 hover:from-zinc-100 hover:to-zinc-200 text-black font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl border-0"
                      disabled={!proProductId}
                    >
                      {proProductId ? plan.buttonText : "Configure product to enable checkout"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )
              ) : (
                <Link href={user ? "/dashboard" : `/sign-in?redirect_url=${encodeURIComponent('/dashboard')}` }>
                  <Button className="w-full h-12 bg-zinc-800/60 hover:bg-zinc-700/80 border border-zinc-700/50 text-white font-semibold text-base transition-all duration-300">
                    {user ? "Go to Dashboard" : "Sign in to get started"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}

              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-zinc-500 text-xs">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    {plan.name === 'Pro' ? (isPro ? "✨ You're Pro" : '🔒 Lifetime access') : maxForms ? `📊 ${formsCount}/${maxForms} forms used` : '🆓 Free forever'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-zinc-400 text-sm mb-6">
            Need help choosing? Our support team is here to assist you.
          </p>
          <Button variant="ghost" className="bg-zinc-800/40 hover:bg-zinc-700/60 border border-zinc-700/50 text-zinc-300 hover:text-white px-8 py-3 rounded-lg transition-all duration-300" onClick={() => window.location.href = 'mailto:avikm744@gmail.com'}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}