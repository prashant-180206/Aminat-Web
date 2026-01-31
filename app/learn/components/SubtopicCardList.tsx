import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearnSubtopic } from "@/lib/api/learn";

interface SubtopicCardListProps {
  topicId: string;
  subtopics: LearnSubtopic[];
}

export default function SubtopicCardList({
  topicId,
  subtopics,
}: SubtopicCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {subtopics.map((subtopic) => (
        <Card key={subtopic.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{subtopic.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              {subtopic.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {subtopic.tutorials?.length || 0} tutorials
              </Badge>
              {subtopic.tests?.length ? (
                <Badge variant="outline">{subtopic.tests.length} tests</Badge>
              ) : null}
            </div>
            <Link href={`/learn/${topicId}/${subtopic.id}`} className="w-full">
              <Button size="sm" className="w-full">
                Explore {subtopic.title}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
