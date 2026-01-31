import { apiClient } from "./client";
import type { Tutorial, CreateTutorialData } from "@/types/teacher";

export const tutorialsAPI = {
  // Get all tutorials for a subtopic
  getAll: async (topicId: string, subtopicId: string): Promise<Tutorial[]> => {
    return apiClient<Tutorial[]>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tutorials`,
    );
  },

  // Get single tutorial
  getById: async (
    topicId: string,
    subtopicId: string,
    tutorialId: string,
  ): Promise<Tutorial> => {
    return apiClient<Tutorial>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tutorials/${tutorialId}`,
    );
  },

  // Create new tutorial
  create: async (
    topicId: string,
    subtopicId: string,
    data: CreateTutorialData,
  ): Promise<Tutorial> => {
    return apiClient<Tutorial>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tutorials`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  // Update tutorial
  update: async (
    topicId: string,
    subtopicId: string,
    tutorialId: string,
    data: Partial<Tutorial>,
  ): Promise<Tutorial> => {
    return apiClient<Tutorial>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tutorials/${tutorialId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  // Delete tutorial
  delete: async (
    topicId: string,
    subtopicId: string,
    tutorialId: string,
  ): Promise<{ success: boolean }> => {
    return apiClient(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tutorials/${tutorialId}`,
      {
        method: "DELETE",
      },
    );
  },
};
