import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LearnSubtopic } from "@/lib/api/learn";

interface SubtopicRailProps {
  topicId: string;
  subtopic: LearnSubtopic;
  activeTutorialId?: string;
  activeTestId?: string;
}

export default function SubtopicRail({
  topicId,
  subtopic,
  activeTutorialId,
  activeTestId,
}: SubtopicRailProps) {
  return (
    <Card className="h-[70vh] lg:h-[calc(100vh-200px)] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{subtopic.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="px-3 pb-4 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Tutorials
              </p>
              {subtopic.tutorials?.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/learn/${topicId}/${subtopic.id}/tutorials/${tutorial.id}`}
                  className={`rounded-md border p-2 text-left transition ${
                    tutorial.id === activeTutorialId
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">{tutorial.title}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {tutorial.duration}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {tutorial.description}
                  </p>
                </Link>
              ))}
            </div>

            {subtopic.tests?.length ? (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Tests
                </p>
                {subtopic.tests.map((test) => (
                  <Link
                    key={test.id}
                    href={`/learn/${topicId}/${subtopic.id}/tests/${test.id}`}
                    className={`rounded-md border p-2 text-left transition ${
                      test.id === activeTestId
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{test.title}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {test.duration}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {test.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
