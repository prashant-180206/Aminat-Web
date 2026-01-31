import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LearnTopic } from "@/lib/api/learn";

interface SyllabusSidebarProps {
  topics: LearnTopic[];
  activeTopicId?: string;
  activeSubtopicId?: string;
}

export default function SyllabusSidebar({
  topics,
  activeTopicId,
  activeSubtopicId,
}: SyllabusSidebarProps) {
  return (
    <Card className="h-[70vh] lg:h-[calc(100vh-200px)] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Syllabus</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="px-3 pb-4 flex flex-col gap-4">
            {topics.map((topic) => (
              <div key={topic.id} className="space-y-2">
                <Link
                  href={`/learn/${topic.id}`}
                  className={`block text-sm font-semibold transition ${
                    topic.id === activeTopicId
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {topic.title}
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  {topic.description}
                </p>
                <div className="flex flex-col gap-1.5">
                  {topic.subtopics?.map((subtopic) => (
                    <Link
                      key={subtopic.id}
                      href={`/learn/${topic.id}/${subtopic.id}`}
                      className={`rounded-md px-2 py-1 text-left text-xs border transition ${
                        subtopic.id === activeSubtopicId
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {subtopic.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
