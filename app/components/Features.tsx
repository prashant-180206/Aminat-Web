"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Zap, Pencil, Sparkles, Infinity, Code2, Layers } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Pencil,
      title: "Interactive Editor",
      description:
        "Intuitive UI to add shapes, curves, and text with real-time preview",
    },
    {
      icon: Zap,
      title: "Fast Rendering",
      description: "Powered by Konva for smooth 2D canvas performance",
    },
    {
      icon: Sparkles,
      title: "Math-First Coordinates",
      description:
        "Work in centered math coordinates, not pixels. Intuitive and natural.",
    },
    {
      icon: Infinity,
      title: "Animated Trackers",
      description:
        "Value and point trackers with sliders for dynamic parameter control",
    },
    {
      icon: Code2,
      title: "Extensible",
      description:
        "Composable mobject system with typed properties and uniform APIs",
    },
    {
      icon: Layers,
      title: "Property Keyframing",
      description:
        "Timeline-based animations with frame-level control coming soon",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create beautiful mathematical visualizations
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="p-6 hover:shadow-lg transition">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
