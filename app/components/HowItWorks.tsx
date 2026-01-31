"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Build in the Editor",
      description:
        "Create scenes with mobjects, trackers, and real-time property editing.",
    },
    {
      number: 2,
      title: "Organize in Teacher Portal",
      description:
        "Create topics, subtopics, tutorials, and tests for structured lessons.",
    },
    {
      number: 3,
      title: "Publish Content",
      description:
        "Toggle publish to make content visible in the learning module.",
    },
    {
      number: 4,
      title: "Students Learn",
      description:
        "Students browse lessons, follow tutorials, and take assessments.",
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
            "Editor, teacher portal, and learning module in one app",
            "Role-based access for students and teachers",
            "Works entirely in your browser",
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
