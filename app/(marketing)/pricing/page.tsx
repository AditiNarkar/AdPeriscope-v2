import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  { name: "Creator", price: "$29", color: "bg-bolt", features: ["1 workspace", "500 AI credits", "Pain-point explorer", "Persona generator"] },
  { name: "Startup", price: "$99", color: "bg-acid", features: ["5 workspaces", "5K AI credits", "Competitor tracking", "PDF reports"] },
  { name: "Agency", price: "$249", color: "bg-hot", features: ["Unlimited workspaces", "Scheduled agents", "White-label exports", "Priority workflows"] }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <MarketingNav />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h1 className="max-w-3xl text-5xl font-black md:text-7xl">Plans for creators and businesses that ship marketing every week.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.color}>
              <h2 className="text-3xl font-black">{plan.name}</h2>
              <p className="mt-4 text-5xl font-black">{plan.price}<span className="text-base">/mo</span></p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 font-black">
                    <Check className="size-5" /> {feature}
                  </li>
                ))}
              </ul>
              <Button asChild variant="secondary" className="mt-8 w-full">
                <Link href="/onboarding">Start {plan.name}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
