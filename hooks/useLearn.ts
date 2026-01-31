"use client";

import { useQuery } from "@tanstack/react-query";
import { learnAPI } from "@/lib/api";

// Query keys
export const learnKeys = {
  all: ["learn"] as const,
  topics: () => [...learnKeys.all, "topics"] as const,
  topic: (topicId: string) => [...learnKeys.topics(), topicId] as const,
  subtopic: (topicId: string, subtopicId: string) =>
    [...learnKeys.topic(topicId), "subtopic", subtopicId] as const,
  tutorial: (topicId: string, subtopicId: string, tutorialId: string) =>
    [
      ...learnKeys.subtopic(topicId, subtopicId),
      "tutorial",
      tutorialId,
    ] as const,
  test: (topicId: string, subtopicId: string, testId: string) =>
    [...learnKeys.subtopic(topicId, subtopicId), "test", testId] as const,
};

// Get all published topics with subtopics
export function useLearnTopics() {
  return useQuery({
    queryKey: learnKeys.topics(),
    queryFn: () => learnAPI.getAllTopics(),
  });
}

// Get single topic with subtopics
export function useLearnTopic(topicId: string) {
  return useQuery({
    queryKey: learnKeys.topic(topicId),
    queryFn: () => learnAPI.getTopic(topicId),
    enabled: !!topicId,
  });
}

// Get single subtopic with tutorials and tests
export function useLearnSubtopic(topicId: string, subtopicId: string) {
  return useQuery({
    queryKey: learnKeys.subtopic(topicId, subtopicId),
    queryFn: () => learnAPI.getSubtopic(topicId, subtopicId),
    enabled: !!topicId && !!subtopicId,
  });
}

// Get single tutorial
export function useLearnTutorial(
  topicId: string,
  subtopicId: string,
  tutorialId: string,
) {
  return useQuery({
    queryKey: learnKeys.tutorial(topicId, subtopicId, tutorialId),
    queryFn: () => learnAPI.getTutorial(topicId, subtopicId, tutorialId),
    enabled: !!topicId && !!subtopicId && !!tutorialId,
  });
}

// Get single test
export function useLearnTest(
  topicId: string,
  subtopicId: string,
  testId: string,
) {
  return useQuery({
    queryKey: learnKeys.test(topicId, subtopicId, testId),
    queryFn: () => learnAPI.getTest(topicId, subtopicId, testId),
    enabled: !!topicId && !!subtopicId && !!testId,
  });
}
