import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearnSubtopic } from "@/lib/api/learn";

interface TestCardListProps {
  topicId: string;
  subtopic: LearnSubtopic;
}

export default function TestCardList({ topicId, subtopic }: TestCardListProps) {
  if (!subtopic.tests?.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {subtopic.tests.map((test) => (
        <Link
          key={test.id}
          href={`/learn/${topicId}/${subtopic.id}/tests/${test.id}`}
          className="block"
        >
          <Card className="h-full hover:border-primary transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{test.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                {test.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{test.duration}</Badge>
                <Badge variant="outline">{test.questions} questions</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
