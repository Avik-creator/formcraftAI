"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      { text: "Form analytics", included: true }
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
      { text: "Advanced analytics", included: true }
    ]
  }
];

export default function PricingSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          Simple, Transparent Pricing
        </h2>
        <p className="text-zinc-300">Choose the plan that's right for you. Pay once, use forever.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "bg-zinc-900/30 relative flex flex-col rounded-xl border p-6 border-zinc-800 hover:border-zinc-700 transition-all duration-300",
              plan.isPopular && "border-2 border-zinc-600 shadow-xl shadow-zinc-900/20"
            )}>
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-zinc-700 px-3 py-1 text-xs font-semibold text-white border border-zinc-600">
                Most Popular
              </div>
            )}
            <h2 className="mb-2 text-2xl font-semibold text-white">{plan.name}</h2>
            <p className="text-zinc-400 mb-4 text-sm">{plan.description}</p>

            <div className="mb-6 flex items-baseline">
              <span className="text-5xl font-bold text-white">
                ${plan.price}
              </span>
              <span className="text-zinc-400 text-xl">
                {plan.price === 0 ? "/forever" : "/lifetime"}
              </span>
            </div>
            <p className="text-zinc-400 mb-6 text-sm">
              {plan.price === 0 ? "Free forever" : "One-time payment"}
            </p>

            <Button className={cn("font-medium", plan.buttonColorClass)}>
              {plan.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-zinc-500 mt-4 mb-6 flex items-center justify-center text-xs">
              <Info className="mr-1 size-3" />
              <span>Lifetime access</span>
            </div>

            <div className="flex-grow">
              <ul className="text-zinc-300 space-y-3 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    {feature.included ? (
                      <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-zinc-400" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4 flex-shrink-0 text-zinc-600" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

            </div>

            <Button variant="ghost" className="text-zinc-400 hover:text-zinc-300 mt-8 w-full border border-zinc-700 hover:bg-zinc-800">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}