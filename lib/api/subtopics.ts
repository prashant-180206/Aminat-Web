import { apiClient } from "./client";
import type {
  Subtopic,
  CreateSubtopicData,
  Tutorial,
  Test,
} from "@/types/teacher";

export const subtopicsAPI = {
  // Get all subtopics for a topic
  getAll: async (topicId: string): Promise<Subtopic[]> => {
    return apiClient<Subtopic[]>(`/api/teacher/topics/${topicId}/subtopics`);
  },

  // Get single subtopic with tutorials and tests
  getById: async (
    topicId: string,
    subtopicId: string,
  ): Promise<{ subtopic: Subtopic; tutorials: Tutorial[]; tests: Test[] }> => {
    return apiClient(`/api/teacher/topics/${topicId}/subtopics/${subtopicId}`);
  },

  // Create new subtopic
  create: async (
    topicId: string,
    data: CreateSubtopicData,
  ): Promise<Subtopic> => {
    return apiClient<Subtopic>(`/api/teacher/topics/${topicId}/subtopics`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update subtopic
  update: async (
    topicId: string,
    subtopicId: string,
    data: Partial<Subtopic>,
  ): Promise<Subtopic> => {
    return apiClient<Subtopic>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  // Delete subtopic
  delete: async (
    topicId: string,
    subtopicId: string,
  ): Promise<{ success: boolean }> => {
    return apiClient(`/api/teacher/topics/${topicId}/subtopics/${subtopicId}`, {
      method: "DELETE",
    });
  },
};
