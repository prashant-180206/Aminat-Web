"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateTopicForm } from "../../components/CreateTopicForm";

export default function CreateTopicPage() {
  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/teacher/topics">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Topic</h1>
          <p className="text-sm text-muted-foreground">
            Add a new learning topic to your syllabus
          </p>
        </div>
      </div>

      <CreateTopicForm />
    </div>
  );
}
