"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

const steps = ["Brand", "Competitors", "Audience"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  return (
    <main className="min-h-screen bg-paper p-4 text-ink">
      <section className="mx-auto max-w-3xl py-10">
        <div className="flex gap-2">
          {steps.map((item, index) => (
            <div key={item} className={`h-4 flex-1 rounded-full border-2 border-ink ${index <= step ? "bg-hot" : "bg-white"}`} />
          ))}
        </div>
        <Card className="mt-6 bg-white">
          <p className="text-sm font-black uppercase">Step {step + 1} of 3</p>
          <h1 className="mt-2 text-4xl font-black">{steps[step]} setup</h1>
          <div className="mt-6 space-y-4">
            {step === 0 && (
              <>
                <Input placeholder="What do you sell?" />
                <Textarea placeholder="Describe your offer, positioning, and best customers." />
              </>
            )}
            {step === 1 && (
              <>
                <Input placeholder="Competitor URL" />
                <Input placeholder="Another competitor URL" />
              </>
            )}
            {step === 2 && (
              <>
                <Input placeholder="Subreddits, keywords, or YouTube topics" />
                <Textarea placeholder="What should the AI look for?" />
              </>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Back</Button>
            {step < 2 ? (
              <Button onClick={() => setStep((value) => value + 1)}>
                Continue <ArrowRight className="size-5" />
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard">Enter dashboard</Link>
              </Button>
            )}
          </div>
        </Card>
      </section>
    </main>
  );
}
