"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

const Roadmap = () => {
  const phases = [
    {
      phase: "Current",
      status: "done",
      items: [
        "Interactive visual editor",
        "Mobject system with properties",
        "Value & point trackers",
        "Basic animations",
        "Slider controls",
      ],
    },
    {
      phase: "Soon",
      status: "in-progress",
      items: [
        "Property keyframing & timeline UI",
        "Group transforms and hierarchies",
        "Snapping and rulers",
        "Better selection handles",
        "User accounts & save/load",
      ],
    },
    {
      phase: "Future",
      status: "planned",
      items: [
        "Export to MP4/GIF",
        "Headless frame rendering",
        "Collaborative editing",
        "More mobject types",
        "Advanced easing functions",
      ],
    },
  ];

  const statusColor = {
    done: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    planned: "bg-gray-100 text-gray-800",
  };

  return (
    <section
      id="roadmap"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch Animat evolve with new features and capabilities
          </p>
        </div>

        {/* Roadmap Phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {phases.map((phase, idx) => (
            <Card key={idx} className="p-6">
              <div className="mb-4">
                <Badge
                  className={`capitalize ${
                    statusColor[phase.status as keyof typeof statusColor]
                  }`}
                >
                  {phase.status}
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {phase.phase}
              </h3>
              <ul className="space-y-3">
                {phase.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
