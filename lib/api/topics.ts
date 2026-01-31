import { apiClient } from "./client";
import type { Topic, CreateTopicData, Subtopic } from "@/types/teacher";

export const topicsAPI = {
  // Get all topics
  getAll: async (): Promise<Topic[]> => {
    return apiClient<Topic[]>("/api/teacher/topics");
  },

  // Get single topic with subtopics
  getById: async (
    topicId: string,
  ): Promise<{ topic: Topic; subtopics: Subtopic[] }> => {
    return apiClient(`/api/teacher/topics/${topicId}`);
  },

  // Create new topic
  create: async (data: CreateTopicData): Promise<Topic> => {
    return apiClient<Topic>("/api/teacher/topics", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update topic
  update: async (topicId: string, data: Partial<Topic>): Promise<Topic> => {
    return apiClient<Topic>(`/api/teacher/topics/${topicId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Delete topic
  delete: async (topicId: string): Promise<{ success: boolean }> => {
    return apiClient(`/api/teacher/topics/${topicId}`, {
      method: "DELETE",
    });
  },
};
