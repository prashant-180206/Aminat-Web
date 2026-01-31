"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import LearnShell from "../../components/LearnShell";
import SyllabusSidebar from "../../components/SyllabusSidebar";
import TutorialCardList from "../../components/TutorialCardList";
import TestCardList from "../../components/TestCardList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useLearnSubtopic,
  useLearnTopics,
  useLearnTopic,
} from "@/hooks/useLearn";

interface SubtopicPageProps {
  params: Promise<{ topicId: string; subtopicId: string }>;
}

export default function SubtopicPage({ params }: SubtopicPageProps) {
  const [ids, setIds] = React.useState<{
    topicId: string;
    subtopicId: string;
  } | null>(null);

  React.useEffect(() => {
    params.then((p) =>
      setIds({ topicId: p.topicId, subtopicId: p.subtopicId }),
    );
  }, [params]);

  const { data: topics } = useLearnTopics();
  const { data: topic } = useLearnTopic(ids?.topicId || "");
  const {
    data: subtopic,
    isLoading,
    error,
  } = useLearnSubtopic(ids?.topicId || "", ids?.subtopicId || "");

  if (!ids || isLoading) {
    return (
      <LearnShell title="Loading..." description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </LearnShell>
    );
  }

  if (error || !topic || !subtopic) {
    return notFound();
  }

  return (
    <LearnShell
      title={`${topic.title} · ${subtopic.title}`}
      description={subtopic.description}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 pb-10">
        <SyllabusSidebar
          topics={topics || []}
          activeTopicId={topic.id}
          activeSubtopicId={subtopic.id}
        />

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <TutorialCardList topicId={topic.id} subtopic={subtopic} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <TestCardList topicId={topic.id} subtopic={subtopic} />
            </CardContent>
          </Card>
        </div>
      </div>
    </LearnShell>
  );
}
