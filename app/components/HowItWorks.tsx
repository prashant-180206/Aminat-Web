"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Create a Scene",
      description:
        "Start with a blank canvas. The editor provides a centered math coordinate system by default.",
    },
    {
      number: 2,
      title: "Add Mobjects",
      description:
        "Insert shapes, curves, text, and vectors from the sidebar. Each object has typed properties.",
    },
    {
      number: 3,
      title: "Edit Properties",
      description:
        "Adjust position, color, scale, rotation, and more in real-time with instant preview.",
    },
    {
      number: 4,
      title: "Animate & Control",
      description:
        "Use value/point trackers and sliders to control animations dynamically with expressions.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in just a few simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
                    <span className="text-primary-foreground font-bold">
                      {step.number}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            "Works entirely in your browser",
            "No installation required",
            "Built on modern tech stack",
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success shrink-0" />
              <p className="text-foreground">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
