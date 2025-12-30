import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
// import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen bg-background text-txt-sec">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              About Animat
            </h1>
            <p className="text-xl text-txt-sec">
              The browser-based animation toolkit for mathematical
              visualizations
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <div className="space-y-6 text">
              <p>
                <strong>Animat Web</strong> is an interactive, browser-based
                animation toolkit focused on mathematical visualizations,
                inspired by <strong>Manim</strong>. It leverages Konva for 2D
                canvas rendering and a composable mobject class system to build
                scenes with shapes, vectors, curves, text, and coordinate
                planes.
              </p>

              <p>
                Our mission is to make mathematical animation creation{" "}
                <strong>approachable and intuitive</strong>. Instead of writing
                code for every animation, users can use our visual editor to
                craft beautiful visualizations while expressing positions and
                sizes in a centered math coordinate system.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8">
                Core Philosophy
              </h3>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <span>
                    <strong>Math-First:</strong> Work in math coordinates, not
                    pixels
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <span>
                    <strong>Composable:</strong> Build complex scenes from
                    simple, reusable mobjects
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <span>
                    <strong>Extensible:</strong> Uniform APIs make it easy to
                    add new object types
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <span>
                    <strong>Interactive:</strong> Real-time preview with instant
                    feedback
                  </span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8">
                Technology Stack
              </h3>
              <p>Built with modern web technologies:</p>
              <ul className="space-y-2 ml-4">
                <li>
                  • <strong>Next.js 16</strong> - React framework for production
                </li>
                <li>
                  • <strong>React 19</strong> - UI library
                </li>
                <li>
                  • <strong>Konva</strong> - High-performance 2D canvas
                  rendering
                </li>
                <li>
                  • <strong>TypeScript</strong> - Type-safe development
                </li>
                <li>
                  • <strong>Radix UI</strong> - Accessible component primitives
                </li>
                <li>
                  • <strong>Tailwind CSS</strong> - Utility-first styling
                </li>
              </ul>
            </div>
          </div>

          {/* Team Section (Placeholder) */}
          <div className="bg-linear-to-br from-blue-950 to-purple-950 rounded-xl p-12 text-center border border-blue-200">
            <h3 className="text-2xl font-bold text-txt mb-4">Made with ❤️</h3>
            <p className="text-txt-sec mb-6">
              Animat is built by a passionate team dedicated to making
              mathematical visualization accessible and fun for everyone.
            </p>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 font-medium transition"
            >
              Learn about our team →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
