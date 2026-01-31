"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tutorialsAPI } from "@/lib/api";
import type { Tutorial, CreateTutorialData } from "@/types/teacher";
import { subtopicKeys } from "./useSubtopics";

// Query keys
export const tutorialKeys = {
  all: ["tutorials"] as const,
  lists: () => [...tutorialKeys.all, "list"] as const,
  list: (topicId: string, subtopicId: string) =>
    [...tutorialKeys.lists(), topicId, subtopicId] as const,
  details: () => [...tutorialKeys.all, "detail"] as const,
  detail: (topicId: string, subtopicId: string, tutorialId: string) =>
    [...tutorialKeys.details(), topicId, subtopicId, tutorialId] as const,
};

// Get all tutorials for a subtopic
export function useTutorials(topicId: string, subtopicId: string) {
  return useQuery({
    queryKey: tutorialKeys.list(topicId, subtopicId),
    queryFn: () => tutorialsAPI.getAll(topicId, subtopicId),
    enabled: !!topicId && !!subtopicId,
  });
}

// Get single tutorial
export function useTutorial(
  topicId: string,
  subtopicId: string,
  tutorialId: string,
) {
  return useQuery({
    queryKey: tutorialKeys.detail(topicId, subtopicId, tutorialId),
    queryFn: () => tutorialsAPI.getById(topicId, subtopicId, tutorialId),
    enabled: !!topicId && !!subtopicId && !!tutorialId,
  });
}

// Create tutorial mutation
export function useCreateTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      data,
    }: {
      topicId: string;
      subtopicId: string;
      data: CreateTutorialData;
    }) => tutorialsAPI.create(topicId, subtopicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tutorialKeys.list(variables.topicId, variables.subtopicId),
      });
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.detail(variables.topicId, variables.subtopicId),
      });
    },
  });
}

// Update tutorial mutation
export function useUpdateTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      tutorialId,
      data,
    }: {
      topicId: string;
      subtopicId: string;
      tutorialId: string;
      data: Partial<Tutorial>;
    }) => tutorialsAPI.update(topicId, subtopicId, tutorialId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tutorialKeys.detail(
          variables.topicId,
          variables.subtopicId,
          variables.tutorialId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: tutorialKeys.list(variables.topicId, variables.subtopicId),
      });
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.detail(variables.topicId, variables.subtopicId),
      });
    },
  });
}

// Delete tutorial mutation
export function useDeleteTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      tutorialId,
    }: {
      topicId: string;
      subtopicId: string;
      tutorialId: string;
    }) => tutorialsAPI.delete(topicId, subtopicId, tutorialId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tutorialKeys.list(variables.topicId, variables.subtopicId),
      });
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.detail(variables.topicId, variables.subtopicId),
      });
    },
  });
}
