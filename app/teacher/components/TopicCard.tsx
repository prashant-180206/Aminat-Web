"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Topic } from "@/types/teacher";

interface TopicCardProps {
  topic: Topic;
  onDelete: (topicId: string) => void;
}

export function TopicCard({ topic, onDelete }: TopicCardProps) {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you sure you want to delete this topic? This will delete all related content.",
      )
    ) {
      onDelete(topic.id);
    }
  };

  const handleCardClick = () => {
    router.push(`/teacher/topics/${topic.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/teacher/topics/${topic.id}`);
  };

  return (
    <Card
      className="flex flex-col h-full transition-shadow hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-1">
            {topic.title}
          </CardTitle>
          <Badge variant={topic.published ? "default" : "secondary"}>
            {topic.published ? "Published" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {topic.description}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex-1"
            onClick={handleEdit}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
