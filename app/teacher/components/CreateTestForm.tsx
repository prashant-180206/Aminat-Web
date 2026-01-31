"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTest } from "@/hooks/useTests";
import { toast } from "sonner";
import { Save } from "lucide-react";
import type { CreateTestData } from "@/types/teacher";

interface CreateTestFormProps {
  topicId: string;
  subtopicId: string;
  onSuccess?: () => void;
}

export function CreateTestForm({
  topicId,
  subtopicId,
  onSuccess,
}: CreateTestFormProps) {
  const createTest = useCreateTest();
  const [formData, setFormData] = useState<CreateTestData>({
    title: "",
    description: "",
    duration: "",
    questions: 0,
    questionsData: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createTest.mutate(
      { topicId, subtopicId, data: formData },
      {
        onSuccess: () => {
          toast.success("Test created successfully!");
          setFormData({
            title: "",
            description: "",
            duration: "",
            questions: 0,
            questionsData: [],
          });
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create test");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Chapter 1 Quiz"
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
              placeholder="Brief description of the test"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 30 min"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questions">Number of Questions</Label>
              <Input
                id="questions"
                type="number"
                placeholder="10"
                value={formData.questions || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    questions: parseInt(e.target.value) || 0,
                  })
                }
                required
                min="1"
              />
            </div>
          </div>

          <Button type="submit" disabled={createTest.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {createTest.isPending ? "Creating..." : "Create Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
