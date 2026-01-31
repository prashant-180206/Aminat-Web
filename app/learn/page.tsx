"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import LearnShell from "./components/LearnShell";
import { useLearnTopics } from "@/hooks/useLearn";

export default function LearnPage() {
  const { data: topics, isLoading, error } = useLearnTopics();

  React.useEffect(() => {
    console.log("Learn Page Data:", { topics, isLoading, error });
  }, [topics, isLoading, error]);

  if (isLoading) {
    return (
      <LearnShell
        title="Learning Module"
        description="Learn by exploring topics, scene-based tutorials, and tests."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </LearnShell>
    );
  }

  if (error) {
    return (
      <LearnShell
        title="Learning Module"
        description="Learn by exploring topics, scene-based tutorials, and tests."
      >
        <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
          Error loading topics. Please try again later.
        </div>
      </LearnShell>
    );
  }

  return (
    <LearnShell
      title="Learning Module"
      description="Learn by exploring topics, scene-based tutorials, and tests."
      actions={
        <>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            New Module
          </Badge>
          <Button size="sm" variant="outline">
            Browse Syllabus
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
        {!topics || topics.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Topics Available</h3>
            <p className="text-muted-foreground max-w-md">
              There are no published topics yet. Teachers need to create and
              publish topics for them to appear here.
            </p>
          </div>
        ) : (
          topics?.map((topic) => (
            <Card key={topic.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="p-2 rounded-md bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </span>
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground">
                  {topic.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {topic.subtopics?.map((subtopic) => (
                    <Badge key={subtopic.id} variant="outline">
                      {subtopic.title}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Link href={`/learn/${topic.id}`} className="w-full">
                    <Button size="sm" className="w-full">
                      View {topic.title}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </LearnShell>
  );
}
