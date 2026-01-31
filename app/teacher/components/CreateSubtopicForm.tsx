"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateSubtopic } from "@/hooks/useSubtopics";
import { toast } from "sonner";
import { Save } from "lucide-react";
import type { CreateSubtopicData } from "@/types/teacher";

interface CreateSubtopicFormProps {
  topicId: string;
  onSuccess?: () => void;
}

export function CreateSubtopicForm({
  topicId,
  onSuccess,
}: CreateSubtopicFormProps) {
  const createSubtopic = useCreateSubtopic();
  const [formData, setFormData] = useState<CreateSubtopicData>({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createSubtopic.mutate(
      { topicId, data: formData },
      {
        onSuccess: () => {
          toast.success("Subtopic created successfully!");
          setFormData({ title: "", description: "" });
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create subtopic");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Subtopic</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Linear Equations"
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
              placeholder="Brief description of the subtopic"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <Button type="submit" disabled={createSubtopic.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {createSubtopic.isPending ? "Creating..." : "Create Subtopic"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
