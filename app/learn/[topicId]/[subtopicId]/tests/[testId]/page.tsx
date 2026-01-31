"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Clock, Loader2 } from "lucide-react";
import LearnShell from "../../../../components/LearnShell";
import SyllabusSidebar from "../../../../components/SyllabusSidebar";
import SubtopicRail from "../../../../components/SubtopicRail";
import {
  useLearnTest,
  useLearnTopics,
  useLearnTopic,
  useLearnSubtopic,
} from "@/hooks/useLearn";

interface TestPageProps {
  params: Promise<{ topicId: string; subtopicId: string; testId: string }>;
}

export default function TestPage({ params }: TestPageProps) {
  const [ids, setIds] = React.useState<{
    topicId: string;
    subtopicId: string;
    testId: string;
  } | null>(null);

  React.useEffect(() => {
    params.then((p) =>
      setIds({
        topicId: p.topicId,
        subtopicId: p.subtopicId,
        testId: p.testId,
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
    data: test,
    isLoading,
    error,
  } = useLearnTest(
    ids?.topicId || "",
    ids?.subtopicId || "",
    ids?.testId || "",
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

  if (error || !topic || !subtopic || !test) {
    return notFound();
  }

  return (
    <LearnShell
      title={test.title}
      description={test.description}
      actions={<Badge variant="secondary">Assessment</Badge>}
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
              <CardTitle className="text-sm">Test Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {test.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  {test.questions} questions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Start Test</Button>
                <Button size="sm" variant="outline">
                  Review Concepts
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>Allocate uninterrupted time to complete the test.</li>
                <li>Questions mix conceptual and application problems.</li>
                <li>Results will appear after submission.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <SubtopicRail
          topicId={topic.id}
          subtopic={subtopic}
          activeTestId={test.id}
        />
      </div>
    </LearnShell>
  );
}
