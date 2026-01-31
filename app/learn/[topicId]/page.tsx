"use client";

import React from "react";
import { notFound } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import LearnShell from "../components/LearnShell";
import SyllabusSidebar from "../components/SyllabusSidebar";
import SubtopicCardList from "../components/SubtopicCardList";
import { Badge } from "@/components/ui/badge";
import { useLearnTopic, useLearnTopics } from "@/hooks/useLearn";

interface TopicPageProps {
  params: Promise<{ topicId: string }>;
}

export default function TopicPage({ params }: TopicPageProps) {
  const [topicId, setTopicId] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then((p) => setTopicId(p.topicId));
  }, [params]);

  const { data: topics } = useLearnTopics();
  const { data: topic, isLoading, error } = useLearnTopic(topicId || "");

  if (!topicId || isLoading) {
    return (
      <LearnShell title="Loading..." description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </LearnShell>
    );
  }

  if (error || !topic) {
    return notFound();
  }

  return (
    <LearnShell
      title={topic.title}
      description={topic.description}
      actions={
        <Badge variant="secondary" className="gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          {topic.subtopics?.length || 0} chapters
        </Badge>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 pb-10">
        <SyllabusSidebar topics={topics || []} activeTopicId={topic.id} />
        <div className="flex flex-col gap-4">
          <SubtopicCardList
            topicId={topic.id}
            subtopics={topic.subtopics || []}
          />
        </div>
      </div>
    </LearnShell>
  );
}
