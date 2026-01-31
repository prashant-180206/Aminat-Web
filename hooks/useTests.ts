"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { testsAPI } from "@/lib/api";
import type { Test, CreateTestData } from "@/types/teacher";
import { subtopicKeys } from "./useSubtopics";

// Query keys
export const testKeys = {
  all: ["tests"] as const,
  lists: () => [...testKeys.all, "list"] as const,
  list: (topicId: string, subtopicId: string) =>
    [...testKeys.lists(), topicId, subtopicId] as const,
  details: () => [...testKeys.all, "detail"] as const,
  detail: (topicId: string, subtopicId: string, testId: string) =>
    [...testKeys.details(), topicId, subtopicId, testId] as const,
};

// Get all tests for a subtopic
export function useTests(topicId: string, subtopicId: string) {
  return useQuery({
    queryKey: testKeys.list(topicId, subtopicId),
    queryFn: () => testsAPI.getAll(topicId, subtopicId),
    enabled: !!topicId && !!subtopicId,
  });
}

// Get single test
export function useTest(topicId: string, subtopicId: string, testId: string) {
  return useQuery({
    queryKey: testKeys.detail(topicId, subtopicId, testId),
    queryFn: () => testsAPI.getById(topicId, subtopicId, testId),
    enabled: !!topicId && !!subtopicId && !!testId,
  });
}

// Create test mutation
export function useCreateTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      data,
    }: {
      topicId: string;
      subtopicId: string;
      data: CreateTestData;
    }) => testsAPI.create(topicId, subtopicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: testKeys.list(variables.topicId, variables.subtopicId),
      });
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.detail(variables.topicId, variables.subtopicId),
      });
    },
  });
}

// Update test mutation
export function useUpdateTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      testId,
      data,
    }: {
      topicId: string;
      subtopicId: string;
      testId: string;
      data: Partial<Test>;
    }) => testsAPI.update(topicId, subtopicId, testId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: testKeys.detail(
          variables.topicId,
          variables.subtopicId,
          variables.testId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: testKeys.list(variables.topicId, variables.subtopicId),
      });
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.detail(variables.topicId, variables.subtopicId),
      });
    },
  });
}

// Delete test mutation
export function useDeleteTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      testId,
    }: {
      topicId: string;
      subtopicId: string;
      testId: string;
    }) => testsAPI.delete(topicId, subtopicId, testId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: testKeys.list(variables.topicId, variables.subtopicId),
      });
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.detail(variables.topicId, variables.subtopicId),
      });
    },
  });
}
