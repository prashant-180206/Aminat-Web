"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTopics, useDeleteTopic } from "@/hooks/useTopics";
import { TopicCard } from "../components/TopicCard";

export default function TopicsPage() {
  const { data: topics, isLoading } = useTopics();
  const deleteTopic = useDeleteTopic();

  const handleDelete = (topicId: string) => {
    deleteTopic.mutate(topicId, {
      onSuccess: () => {
        toast.success("Topic deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete topic");
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Topics</h1>
          <p className="text-sm text-muted-foreground">
            Manage your learning topics and content
          </p>
        </div>
        <Link href="/teacher/topics/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Topic
          </Button>
        </Link>
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : !topics || topics.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No topics yet. Create your first topic to get started!
              </p>
              <Link href="/teacher/topics/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Topic
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic._id || topic.id}
              topic={topic}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
