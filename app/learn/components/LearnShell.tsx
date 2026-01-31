import React from "react";
import Navigation from "@/app/components/Navigation";
import { Separator } from "@/components/ui/separator";

interface LearnShellProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function LearnShell({
  title,
  description,
  actions,
  children,
}: LearnShellProps) {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            {actions ? (
              <div className="flex items-center gap-2">{actions}</div>
            ) : null}
          </div>
          <Separator className="my-4" />
          {children}
        </div>
      </div>
    </main>
  );
}
