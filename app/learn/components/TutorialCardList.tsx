import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearnSubtopic } from "@/lib/api/learn";

interface TutorialCardListProps {
  topicId: string;
  subtopic: LearnSubtopic;
}

export default function TutorialCardList({
  topicId,
  subtopic,
}: TutorialCardListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {subtopic.tutorials?.map((tutorial) => (
        <Link
          key={tutorial.id}
          href={`/learn/${topicId}/${subtopic.id}/tutorials/${tutorial.id}`}
          className="block"
        >
          <Card className="h-full hover:border-primary transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{tutorial.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                {tutorial.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{tutorial.level}</Badge>
                <Badge variant="outline">{tutorial.duration}</Badge>
                <Badge variant={tutorial.hasScene ? "secondary" : "outline"}>
                  {tutorial.hasScene ? "Scene" : "No scene"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
