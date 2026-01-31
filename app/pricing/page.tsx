import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Explore the editor and learning module",
      features: [
        "Interactive visual editor",
        "All mobject types",
        "Basic animations",
        "Value & point trackers",
        "Learning module access",
        "Demo mode (no save)",
      ],
      cta: {
        text: "Get Started",
        href: "/auth/signup",
        variant: "outline" as const,
      },
      highlighted: false,
    },
    {
      name: "Creator",
      price: 9,
      description: "For individual creators and educators",
      features: [
        "Everything in Free",
        "Save & load projects",
        "Teacher portal access",
        "Publish topics, tutorials, and tests",
        "Priority support",
        "No watermark",
      ],
      cta: {
        text: "Start Free Trial",
        href: "/auth/signup",
        variant: "default" as const,
      },
      highlighted: true,
    },
    {
      name: "Team",
      price: 29,
      description: "For teams, schools, and departments",
      features: [
        "Everything in Creator",
        "Unlimited projects",
        "Multi-teacher publishing",
        "Role management",
        "Shared content library",
        "Dedicated support",
      ],
      cta: { text: "Contact Sales", href: "#", variant: "outline" as const },
      highlighted: false,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-txt">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-txt-sec max-w-2xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                className={`p-8 transition-all ${
                  plan.highlighted
                    ? "border-blue-900 border-2 shadow-xl scale-105"
                    : "border border-bg-light hover:shadow-lg"
                }`}
              >
                {/* Badge */}
                {plan.highlighted && (
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1 bg-card-foreground text-blue-500 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Name & Price */}
                <h3 className="text-2xl font-bold text-txt mb-2">
                  {plan.name}
                </h3>
                <p className="text-txt-sec text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-txt">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-txt-sec ml-2">/month</span>
                  )}
                </div>

                {/* CTA Button */}
                <Link href={plan.cta.href} className="block mb-8">
                  <Button
                    className={`w-full ${
                      plan.cta.variant === "default"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                    variant={plan.cta.variant}
                  >
                    {plan.cta.text}
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-txt-sec">Includes:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-txt-sec">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-txt-sec text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Can I use Animat for free?",
                  a: "Yes! Our Free tier gives you full access to the editor and all mobject types. You can create and play with animations without any cost.",
                },
                {
                  q: "Do you offer a free trial for Creator?",
                  a: "Yes, new users get a 14-day free trial of the Creator plan with full features.",
                },
                {
                  q: "What happens to my projects if I cancel?",
                  a: "Your projects remain accessible. You'll just lose access to Creator features like exports and galleries.",
                },
                {
                  q: "Is there a Student discount?",
                  a: "Contact us for educational pricing. We offer special rates for students and academic institutions.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-bg-light rounded-lg p-6 border border-border"
                >
                  <h4 className="font-semibold text-txt mb-2">{item.q}</h4>
                  <p className="text-txt-sec">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
