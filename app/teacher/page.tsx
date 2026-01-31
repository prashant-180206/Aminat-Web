"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  FileText,
  GraduationCap,
  ListChecks,
  Plus,
  Settings,
} from "lucide-react";

export default function TeacherDashboard() {
  const stats = [
    { label: "Topics", value: "0", icon: BookOpen, href: "/teacher/topics" },
    { label: "Subtopics", value: "0", icon: FileText, href: "/teacher/topics" },
    {
      label: "Tutorials",
      value: "0",
      icon: GraduationCap,
      href: "/teacher/topics",
    },
    { label: "Tests", value: "0", icon: ListChecks, href: "/teacher/topics" },
  ];

  const quickActions = [
    {
      title: "Create Topic",
      description: "Start a new learning topic",
      icon: BookOpen,
      href: "/teacher/topics/create",
    },
    {
      title: "Manage Content",
      description: "View and edit existing content",
      icon: Settings,
      href: "/teacher/topics",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage learning content, tutorials, and assessments
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <GraduationCap className="h-3.5 w-3.5 mr-1" />
          Teacher Portal
        </Badge>
      </div>

      <Separator className="my-6" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:border-primary transition cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:border-primary transition"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={action.href}>
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity. Start by creating your first topic!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
