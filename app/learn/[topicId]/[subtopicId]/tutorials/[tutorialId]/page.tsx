"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, PlayCircle, Loader2 } from "lucide-react";
import LearnShell from "../../../../components/LearnShell";
import SyllabusSidebar from "../../../../components/SyllabusSidebar";
import SubtopicRail from "../../../../components/SubtopicRail";
import LearnSceneView from "../../../../components/LearnSceneView";
import ScenePlaceholder from "../../../../components/ScenePlaceholder";
import {
  useLearnTutorial,
  useLearnTopics,
  useLearnTopic,
  useLearnSubtopic,
} from "@/hooks/useLearn";

interface TutorialPageProps {
  params: Promise<{
    topicId: string;
    subtopicId: string;
    tutorialId: string;
  }>;
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const [ids, setIds] = React.useState<{
    topicId: string;
    subtopicId: string;
    tutorialId: string;
  } | null>(null);

  React.useEffect(() => {
    params.then((p) =>
      setIds({
        topicId: p.topicId,
        subtopicId: p.subtopicId,
        tutorialId: p.tutorialId,
      }),
    );
  }, [params]);

  const { data: topics } = useLearnTopics();
  const { data: topic } = useLearnTopic(ids?.topicId || "");
  const { data: subtopic } = useLearnSubtopic(
    ids?.topicId || "",
    ids?.subtopicId || "",
  );
  const {
    data: tutorial,
    isLoading,
    error,
  } = useLearnTutorial(
    ids?.topicId || "",
    ids?.subtopicId || "",
    ids?.tutorialId || "",
  );

  if (!ids || isLoading) {
    return (
      <LearnShell title="Loading..." description="">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </LearnShell>
    );
  }

  if (error || !topic || !subtopic || !tutorial) {
    return notFound();
  }

  return (
    <LearnShell
      title={tutorial.title}
      description={tutorial.description}
      actions={<Badge variant="secondary">{tutorial.level}</Badge>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-4 pb-10">
        <SyllabusSidebar
          topics={topics || []}
          activeTopicId={topic.id}
          activeSubtopicId={subtopic.id}
        />

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {tutorial.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <PlayCircle className="h-3.5 w-3.5" />
                  {tutorial.hasScene ? "Scene-based" : "Text-based"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Start Tutorial</Button>
                <Button size="sm" variant="outline">
                  View Notes
                </Button>
                <Button size="sm" variant="ghost">
                  Save Progress
                </Button>
              </div>
              {tutorial.hasScene ? <LearnSceneView /> : <ScenePlaceholder />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Walkthrough</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-xs sm:text-sm">
                {tutorial.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-2">
                    <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <SubtopicRail
          topicId={topic.id}
          subtopic={subtopic}
          activeTutorialId={tutorial.id}
        />
      </div>
    </LearnShell>
  );
}
