import { apiClient } from "./client";
import type { Test, CreateTestData } from "@/types/teacher";

export const testsAPI = {
  // Get all tests for a subtopic
  getAll: async (topicId: string, subtopicId: string): Promise<Test[]> => {
    return apiClient<Test[]>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tests`,
    );
  },

  // Get single test
  getById: async (
    topicId: string,
    subtopicId: string,
    testId: string,
  ): Promise<Test> => {
    return apiClient<Test>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tests/${testId}`,
    );
  },

  // Create new test
  create: async (
    topicId: string,
    subtopicId: string,
    data: CreateTestData,
  ): Promise<Test> => {
    return apiClient<Test>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tests`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  // Update test
  update: async (
    topicId: string,
    subtopicId: string,
    testId: string,
    data: Partial<Test>,
  ): Promise<Test> => {
    return apiClient<Test>(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tests/${testId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  // Delete test
  delete: async (
    topicId: string,
    subtopicId: string,
    testId: string,
  ): Promise<{ success: boolean }> => {
    return apiClient(
      `/api/teacher/topics/${topicId}/subtopics/${subtopicId}/tests/${testId}`,
      {
        method: "DELETE",
      },
    );
  },
};
