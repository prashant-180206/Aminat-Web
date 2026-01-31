// Teacher Portal Types

export interface Topic {
  _id: string;
  id: string;
  title: string;
  description: string;
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subtopic {
  _id: string;
  id: string;
  title: string;
  description: string;
  topicId: string;
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tutorial {
  _id: string;
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  steps: string[];
  hasScene: boolean;
  sceneData?: Record<string, unknown>;
  subtopicId: string;
  topicId: string;
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  _id: string;
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  questionsData?: Question[];
  subtopicId: string;
  topicId: string;
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points?: number;
}

export interface CreateTopicData {
  title: string;
  description: string;
}

export interface CreateSubtopicData {
  title: string;
  description: string;
}

export interface CreateTutorialData {
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  hasScene: boolean;
  steps: string[];
  sceneData?: Record<string, unknown>;
}

export interface CreateTestData {
  title: string;
  description: string;
  duration: string;
  questions: number;
  questionsData?: Question[];
}
