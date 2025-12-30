"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="w-6 h-6 text-brand-from" />
            <span className="bg-linear-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              Animat
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="border-t pt-6 flex flex-col gap-3">
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
