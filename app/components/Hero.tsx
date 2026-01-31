"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-950 to-purple-950">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          ✨ Editor • Learning • Teacher Portal
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-txt mb-6 leading-tight">
          Create, Teach, and Learn
          <br />
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Animations
          </span>
          <br />
          in One Platform
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-txt-sec mb-8 max-w-2xl mx-auto">
          Build scenes in the visual editor, publish lessons in the teacher
          portal, and deliver interactive tutorials and tests in the learning
          module—directly in your browser.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/project">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-5 h-5 mr-2" />
              Open the Editor
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Explore Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Demo Image Placeholder */}
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-xl bg-linear-to-br from-blue-800 to-purple-800 border border-blue-200 shadow-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">🎨</div>
              <p className="text-gray-600">Your animations will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
