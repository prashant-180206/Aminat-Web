"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plus,
  BookOpen,
  FileQuestion,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useSubtopic, useUpdateSubtopic } from "@/hooks/useSubtopics";
import { useDeleteTutorial, useUpdateTutorial } from "@/hooks/useTutorials";
import { useDeleteTest, useUpdateTest } from "@/hooks/useTests";
import { CreateTutorialForm } from "../../../../components/CreateTutorialForm";
import { CreateTestForm } from "../../../../components/CreateTestForm";

export default function SubtopicDetailPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const subtopicId = params.subtopicId as string;
  const { data, isLoading } = useSubtopic(topicId, subtopicId);
  const deleteTutorial = useDeleteTutorial();
  const deleteTest = useDeleteTest();
  const updateSubtopic = useUpdateSubtopic();
  const updateTutorial = useUpdateTutorial();
  const updateTest = useUpdateTest();
  const [showTutorialForm, setShowTutorialForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);

  const handleTogglePublish = () => {
    if (!data?.subtopic) return;

    updateSubtopic.mutate(
      {
        topicId,
        subtopicId,
        data: {
          title: data.subtopic.title,
          description: data.subtopic.description,
          published: !data.subtopic.published,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            data.subtopic.published
              ? "Subtopic unpublished"
              : "Subtopic published",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update subtopic");
        },
      },
    );
  };

  const handleToggleTutorialPublish = (tutorial: any) => {
    updateTutorial.mutate(
      {
        topicId,
        subtopicId,
        tutorialId: tutorial.id,
        data: {
          title: tutorial.title,
          description: tutorial.description,
          duration: tutorial.duration,
          level: tutorial.level,
          steps: tutorial.steps,
          hasScene: tutorial.hasScene,
          published: !tutorial.published,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            tutorial.published ? "Tutorial unpublished" : "Tutorial published",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update tutorial");
        },
      },
    );
  };

  const handleToggleTestPublish = (test: any) => {
    updateTest.mutate(
      {
        topicId,
        subtopicId,
        testId: test.id,
        data: {
          title: test.title,
          description: test.description,
          duration: test.duration,
          questions: test.questions,
          questionsData: test.questionsData,
          published: !test.published,
        },
      },
      {
        onSuccess: () => {
          toast.success(test.published ? "Test unpublished" : "Test published");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update test");
        },
      },
    );
  };

  const handleDeleteTutorial = (tutorialId: string) => {
    if (!confirm("Are you sure you want to delete this tutorial?")) return;

    deleteTutorial.mutate(
      { topicId, subtopicId, tutorialId },
      {
        onSuccess: () => toast.success("Tutorial deleted successfully"),
        onError: (error) =>
          toast.error(error.message || "Failed to delete tutorial"),
      },
    );
  };

  const handleDeleteTest = (testId: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    deleteTest.mutate(
      { topicId, subtopicId, testId },
      {
        onSuccess: () => toast.success("Test deleted successfully"),
        onError: (error) =>
          toast.error(error.message || "Failed to delete test"),
      },
    );
  };

  if (isLoading) return <p className="text-center py-8">Loading...</p>;
  if (!data) return <p className="text-center py-8">Subtopic not found</p>;

  const { subtopic, tutorials, tests } = data;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/teacher/topics/${topicId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{subtopic.title}</h1>
          <p className="text-sm text-muted-foreground">
            {subtopic.description}
          </p>
        </div>
        <Badge variant={subtopic.published ? "default" : "secondary"}>
          {subtopic.published ? "Published" : "Draft"}
        </Badge>
        <Button
          variant={subtopic.published ? "outline" : "default"}
          size="sm"
          onClick={handleTogglePublish}
          disabled={updateSubtopic.isPending}
        >
          {subtopic.published ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </>
          )}
        </Button>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="tutorials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tutorials">
            <BookOpen className="h-4 w-4 mr-2" />
            Tutorials ({tutorials.length})
          </TabsTrigger>
          <TabsTrigger value="tests">
            <FileQuestion className="h-4 w-4 mr-2" />
            Tests ({tests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tutorials</h2>
            <Button
              size="sm"
              onClick={() => setShowTutorialForm(!showTutorialForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showTutorialForm ? "Cancel" : "Add Tutorial"}
            </Button>
          </div>

          {showTutorialForm && (
            <CreateTutorialForm
              topicId={topicId}
              subtopicId={subtopicId}
              onSuccess={() => setShowTutorialForm(false)}
            />
          )}

          {tutorials.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tutorials yet. Create one to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorials.map((tutorial) => (
                <Card
                  key={tutorial._id || tutorial.id}
                  className="flex flex-col"
                >
                  <CardContent className="pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{tutorial.title}</h3>
                        <Badge
                          variant={tutorial.published ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {tutorial.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {tutorial.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{tutorial.duration}</Badge>
                        <Badge variant="outline">{tutorial.level}</Badge>
                        {tutorial.hasScene && <Badge>Has Scene</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={tutorial.published ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleTutorialPublish(tutorial)}
                        className="flex-1"
                      >
                        {tutorial.published ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTutorial(tutorial.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tests</h2>
            <Button size="sm" onClick={() => setShowTestForm(!showTestForm)}>
              <Plus className="h-4 w-4 mr-2" />
              {showTestForm ? "Cancel" : "Add Test"}
            </Button>
          </div>

          {showTestForm && (
            <CreateTestForm
              topicId={topicId}
              subtopicId={subtopicId}
              onSuccess={() => setShowTestForm(false)}
            />
          )}

          {tests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tests yet. Create one to assess students!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tests.map((test) => (
                <Card key={test._id || test.id} className="flex flex-col">
                  <CardContent className="pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{test.title}</h3>
                        <Badge
                          variant={test.published ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {test.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {test.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{test.duration}</Badge>
                        <Badge variant="outline">
                          {test.questions} Questions
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={test.published ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleTestPublish(test)}
                        className="flex-1"
                      >
                        {test.published ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTest(test.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
