"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Folder, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTopic, useUpdateTopic } from "@/hooks/useTopics";
import { useDeleteSubtopic } from "@/hooks/useSubtopics";
import { SubtopicCard } from "../../components/SubtopicCard";

export default function TopicDetailPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const { data, isLoading } = useTopic(topicId);
  const deleteSubtopic = useDeleteSubtopic();
  const updateTopic = useUpdateTopic();

  const handleTogglePublish = () => {
    if (!data?.topic) return;

    updateTopic.mutate(
      {
        topicId,
        data: {
          title: data.topic.title,
          description: data.topic.description,
          published: !data.topic.published,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            data.topic.published ? "Topic unpublished" : "Topic published",
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update topic");
        },
      },
    );
  };

  const handleDeleteSubtopic = (subtopicId: string) => {
    deleteSubtopic.mutate(
      { topicId, subtopicId },
      {
        onSuccess: () => {
          toast.success("Subtopic deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete subtopic");
        },
      },
    );
  };

  if (isLoading) return <p className="text-center py-8">Loading...</p>;
  if (!data) return <p className="text-center py-8">Topic not found</p>;

  const { topic, subtopics } = data;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/teacher/topics">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <p className="text-sm text-muted-foreground">{topic.description}</p>
        </div>
        <Badge variant={topic.published ? "default" : "secondary"}>
          {topic.published ? "Published" : "Draft"}
        </Badge>
        <Button
          variant={topic.published ? "outline" : "default"}
          size="sm"
          onClick={handleTogglePublish}
          disabled={updateTopic.isPending}
        >
          {topic.published ? (
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
        <Link href={`/teacher/topics/${topicId}/subtopics/create`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subtopic
          </Button>
        </Link>
      </div>

      <Separator className="my-6" />

      {subtopics.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No subtopics yet. Add one to get started!
              </p>
              <Link href={`/teacher/topics/${topicId}/subtopics/create`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subtopic
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subtopics.map((subtopic) => (
            <SubtopicCard
              key={subtopic._id || subtopic.id}
              subtopic={subtopic}
              topicId={topicId}
              onDelete={handleDeleteSubtopic}
            />
          ))}
        </div>
      )}
    </div>
  );
}
