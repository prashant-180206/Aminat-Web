"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { topicsAPI } from "@/lib/api";
import type { Topic, CreateTopicData } from "@/types/teacher";

// Query keys
export const topicKeys = {
  all: ["topics"] as const,
  lists: () => [...topicKeys.all, "list"] as const,
  list: (filters: string) => [...topicKeys.lists(), { filters }] as const,
  details: () => [...topicKeys.all, "detail"] as const,
  detail: (id: string) => [...topicKeys.details(), id] as const,
};

// Get all topics
export function useTopics() {
  return useQuery({
    queryKey: topicKeys.lists(),
    queryFn: () => topicsAPI.getAll(),
  });
}

// Get single topic with subtopics
export function useTopic(topicId: string) {
  return useQuery({
    queryKey: topicKeys.detail(topicId),
    queryFn: () => topicsAPI.getById(topicId),
    enabled: !!topicId,
  });
}

// Create topic mutation
export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTopicData) => topicsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}

// Update topic mutation
export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      topicId,
      data,
    }: {
      topicId: string;
      data: Partial<Topic>;
    }) => topicsAPI.update(topicId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: topicKeys.detail(variables.topicId),
      });
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}

// Delete topic mutation
export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => topicsAPI.delete(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}
