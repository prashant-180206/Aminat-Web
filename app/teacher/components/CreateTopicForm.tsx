"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTopic } from "@/hooks/useTopics";
import { toast } from "sonner";
import { Save } from "lucide-react";
import type { CreateTopicData } from "@/types/teacher";

export function CreateTopicForm() {
  const router = useRouter();
  const createTopic = useCreateTopic();
  const [formData, setFormData] = useState<CreateTopicData>({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createTopic.mutate(formData, {
      onSuccess: (data) => {
        toast.success("Topic created successfully!");
        router.push(`/teacher/topics/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create topic");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Algebra"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the topic"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createTopic.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createTopic.isPending ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
