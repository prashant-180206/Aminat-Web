import { apiClient } from "./client";

export interface LearnTopic {
  _id?: string;
  id: string;
  title: string;
  description: string;
  published: boolean;
  subtopics?: LearnSubtopic[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LearnSubtopic {
  _id?: string;
  id: string;
  title: string;
  description: string;
  topicId: string;
  published: boolean;
  tutorials?: LearnTutorial[];
  tests?: LearnTest[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LearnTutorial {
  _id?: string;
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  steps: string[];
  hasScene: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sceneData?: any;
  subtopicId: string;
  topicId: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LearnTest {
  _id?: string;
  id: string;
  title: string;
  description: string;
  duration: string;
  questions: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questionsData?: any[];
  subtopicId: string;
  topicId: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const learnAPI = {
  // Get all published topics with subtopics
  getAllTopics: async (): Promise<LearnTopic[]> => {
    return apiClient<LearnTopic[]>("/api/learn/topics");
  },

  // Get single topic with subtopics
  getTopic: async (topicId: string): Promise<LearnTopic> => {
    return apiClient<LearnTopic>(`/api/learn/topics/${topicId}`);
  },

  // Get single subtopic with tutorials and tests
  getSubtopic: async (
    topicId: string,
    subtopicId: string,
  ): Promise<LearnSubtopic> => {
    return apiClient<LearnSubtopic>(
      `/api/learn/topics/${topicId}/${subtopicId}`,
    );
  },

  // Get single tutorial
  getTutorial: async (
    topicId: string,
    subtopicId: string,
    tutorialId: string,
  ): Promise<LearnTutorial> => {
    return apiClient<LearnTutorial>(
      `/api/learn/topics/${topicId}/${subtopicId}/tutorials/${tutorialId}`,
    );
  },

  // Get single test
  getTest: async (
    topicId: string,
    subtopicId: string,
    testId: string,
  ): Promise<LearnTest> => {
    return apiClient<LearnTest>(
      `/api/learn/topics/${topicId}/${subtopicId}/tests/${testId}`,
    );
  },
};
