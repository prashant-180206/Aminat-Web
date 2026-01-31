"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Zap,
  Pencil,
  Sparkles,
  Infinity,
  GraduationCap,
  School,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Pencil,
      title: "Interactive Editor",
      description:
        "Build scenes visually with mobjects, properties, and live preview.",
    },
    {
      icon: Zap,
      title: "High-Performance Canvas",
      description: "Konva-powered rendering for smooth, responsive editing.",
    },
    {
      icon: Sparkles,
      title: "Math-First Coordinates",
      description: "Work in centered math coordinates instead of pixel space.",
    },
    {
      icon: Infinity,
      title: "Trackers & Expressions",
      description:
        "Bind properties to dynamic values, sliders, and expressions.",
    },
    {
      icon: School,
      title: "Teacher Portal",
      description:
        "Create topics, subtopics, tutorials, and tests with publish control.",
    },
    {
      icon: GraduationCap,
      title: "Learning Module",
      description: "Deliver published lessons and assessments to students.",
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
