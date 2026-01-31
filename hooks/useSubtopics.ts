"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subtopicsAPI } from "@/lib/api";
import type { Subtopic, CreateSubtopicData } from "@/types/teacher";
import { topicKeys } from "./useTopics";

// Query keys
export const subtopicKeys = {
  all: ["subtopics"] as const,
  lists: () => [...subtopicKeys.all, "list"] as const,
  list: (topicId: string) => [...subtopicKeys.lists(), topicId] as const,
  details: () => [...subtopicKeys.all, "detail"] as const,
  detail: (topicId: string, subtopicId: string) =>
    [...subtopicKeys.details(), topicId, subtopicId] as const,
};

// Get all subtopics for a topic
export function useSubtopics(topicId: string) {
  return useQuery({
    queryKey: subtopicKeys.list(topicId),
    queryFn: () => subtopicsAPI.getAll(topicId),
    enabled: !!topicId,
  });
}

// Get single subtopic with tutorials and tests
export function useSubtopic(topicId: string, subtopicId: string) {
  return useQuery({
    queryKey: subtopicKeys.detail(topicId, subtopicId),
    queryFn: () => subtopicsAPI.getById(topicId, subtopicId),
    enabled: !!topicId && !!subtopicId,
  });
}

// Create subtopic mutation
export function useCreateSubtopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      data,
    }: {
      topicId: string;
      data: CreateSubtopicData;
    }) => subtopicsAPI.create(topicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.list(variables.topicId),
      });
      queryClient.invalidateQueries({
        queryKey: topicKeys.detail(variables.topicId),
      });
    },
  });
}

// Update subtopic mutation
export function useUpdateSubtopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      data,
    }: {
      topicId: string;
      subtopicId: string;
      data: Partial<Subtopic>;
    }) => subtopicsAPI.update(topicId, subtopicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.detail(variables.topicId, variables.subtopicId),
      });
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.list(variables.topicId),
      });
      queryClient.invalidateQueries({
        queryKey: topicKeys.detail(variables.topicId),
      });
    },
  });
}

// Delete subtopic mutation
export function useDeleteSubtopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
    }: {
      topicId: string;
      subtopicId: string;
    }) => subtopicsAPI.delete(topicId, subtopicId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subtopicKeys.list(variables.topicId),
      });
      queryClient.invalidateQueries({
        queryKey: topicKeys.detail(variables.topicId),
      });
    },
  });
}
