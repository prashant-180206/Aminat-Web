"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTutorial } from "@/hooks/useTutorials";
import { toast } from "sonner";
import { Save } from "lucide-react";
import type { CreateTutorialData } from "@/types/teacher";

interface CreateTutorialFormProps {
  topicId: string;
  subtopicId: string;
  onSuccess?: () => void;
}

export function CreateTutorialForm({
  topicId,
  subtopicId,
  onSuccess,
}: CreateTutorialFormProps) {
  const createTutorial = useCreateTutorial();
  const [formData, setFormData] = useState<CreateTutorialData>({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    steps: [],
    hasScene: false,
  });
  const [stepInput, setStepInput] = useState("");

  const addStep = () => {
    if (stepInput.trim()) {
      setFormData({
        ...formData,
        steps: [...(formData.steps || []), stepInput.trim()],
      });
      setStepInput("");
    }
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createTutorial.mutate(
      { topicId, subtopicId, data: formData },
      {
        onSuccess: () => {
          toast.success("Tutorial created successfully!");
          setFormData({
            title: "",
            description: "",
            duration: "",
            level: "Beginner",
            steps: [],
            hasScene: false,
          });
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create tutorial");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Tutorial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Solving Simple Equations"
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
              placeholder="Brief description of the tutorial"
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
                placeholder="e.g., 15 min"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(
                  value: "Beginner" | "Intermediate" | "Advanced",
                ) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Steps</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a step..."
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addStep())
                }
              />
              <Button type="button" onClick={addStep} variant="outline">
                Add
              </Button>
            </div>
            {formData.steps && formData.steps.length > 0 && (
              <ul className="space-y-1 mt-2">
                {formData.steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                  >
                    <span>{step}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasScene"
              checked={formData.hasScene}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, hasScene: checked })
              }
            />
            <Label htmlFor="hasScene">Include Scene Animation</Label>
          </div>

          <Button type="submit" disabled={createTutorial.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {createTutorial.isPending ? "Creating..." : "Create Tutorial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
