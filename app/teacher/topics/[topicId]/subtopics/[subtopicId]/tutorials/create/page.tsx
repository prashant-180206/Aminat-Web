"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";

export default function CreateTutorialPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;
  const subtopicId = params.subtopicId as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    hasScene: false,
    steps: [""],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tutorials`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to create tutorial");

      //   const data = await response.json();
      toast.success("Tutorial created successfully!");
      router.push(`/teacher/topics/${topicId}/subtopics/${subtopicId}`);
    } catch (error) {
      toast.error("Failed to create tutorial");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ""] });
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index),
    });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/teacher/topics/${topicId}/subtopics/${subtopicId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Tutorial</h1>
          <p className="text-sm text-muted-foreground">
            Add a new tutorial with optional scene
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tutorial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Solving One-Variable Equations"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 10 min"
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
                  onValueChange={(value: string) =>
                    setFormData({
                      ...formData,
                      level: value as "Beginner" | "Intermediate" | "Advanced",
                    })
                  }
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

            <div className="flex items-center space-x-2">
              <Switch
                id="hasScene"
                checked={formData.hasScene}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, hasScene: checked })
                }
              />
              <Label htmlFor="hasScene">Include Scene</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tutorial Steps</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addStep}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Step
                </Button>
              </div>
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                  />
                  {formData.steps.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeStep(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {formData.hasScene && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    Scene editor will be available after creating the tutorial.
                    You can add and configure the scene in the edit page.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Tutorial"}
              </Button>
              <Link href={`/teacher/topics/${topicId}/subtopics/${subtopicId}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
