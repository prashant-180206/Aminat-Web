export type TutorialLevel = "Beginner" | "Intermediate" | "Advanced";

export type Tutorial = {
  id: string;
  title: string;
  duration: string;
  level: TutorialLevel;
  description: string;
  steps: string[];
  hasScene: boolean;
};

export type Test = {
  id: string;
  title: string;
  duration: string;
  questions: number;
  description: string;
};

export type Subtopic = {
  id: string;
  title: string;
  description: string;
  tutorials: Tutorial[];
  tests?: Test[];
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  subtopics: Subtopic[];
};

export const syllabus: Topic[] = [
  {
    id: "algebra",
    title: "Algebra",
    description: "Build foundations in equations, functions, and expressions.",
    subtopics: [
      {
        id: "linear-equations",
        title: "Linear Equations",
        description: "Solve, graph, and interpret linear relationships.",
        tutorials: [
          {
            id: "solve-one-variable",
            title: "Solving One-Variable Equations",
            duration: "8 min",
            level: "Beginner",
            description:
              "Balance and isolate variables using inverse operations.",
            steps: [
              "Understand equation structure",
              "Apply inverse operations",
              "Check solution",
              "Visualize on number line",
            ],
            hasScene: true,
          },
          {
            id: "graphing-lines",
            title: "Graphing Lines from Equations",
            duration: "10 min",
            level: "Beginner",
            description:
              "Translate equations into graphs using slope-intercept form.",
            steps: [
              "Identify slope and intercept",
              "Plot intercept",
              "Use slope to find another point",
              "Draw the line",
            ],
            hasScene: true,
          },
        ],
        tests: [
          {
            id: "linear-basics-quiz",
            title: "Linear Equations Quiz",
            duration: "12 min",
            questions: 10,
            description: "Check fundamentals on solving and graphing lines.",
          },
        ],
      },
      {
        id: "quadratic-functions",
        title: "Quadratic Functions",
        description: "Explore parabolas, roots, and transformations.",
        tutorials: [
          {
            id: "vertex-form",
            title: "Understanding Vertex Form",
            duration: "12 min",
            level: "Intermediate",
            description: "Explore parabolas, vertex, and axis of symmetry.",
            steps: [
              "Recognize vertex form",
              "Find vertex and axis",
              "Sketch the parabola",
              "Compare transformations",
            ],
            hasScene: true,
          },
          {
            id: "factoring-intro",
            title: "Factoring Basics",
            duration: "9 min",
            level: "Beginner",
            description: "Practice factoring quadratics without visuals.",
            steps: [
              "Identify coefficient patterns",
              "Apply grouping",
              "Verify by expansion",
            ],
            hasScene: false,
          },
        ],
      },
    ],
  },
  {
    id: "calculus",
    title: "Calculus",
    description: "Learn limits, derivatives, and integrals with visuals.",
    subtopics: [
      {
        id: "limits",
        title: "Limits",
        description: "Understand function behavior near a point.",
        tutorials: [
          {
            id: "intro-limits",
            title: "Introduction to Limits",
            duration: "9 min",
            level: "Beginner",
            description: "See how functions behave near a point.",
            steps: [
              "Understand approaching values",
              "Evaluate from left and right",
              "Identify continuity",
              "Visualize with graphs",
            ],
            hasScene: true,
          },
          {
            id: "limit-laws",
            title: "Limit Laws",
            duration: "11 min",
            level: "Intermediate",
            description: "Apply algebraic rules to simplify limits.",
            steps: [
              "Review algebraic rules",
              "Combine limits",
              "Simplify expressions",
              "Check with graphs",
            ],
            hasScene: false,
          },
        ],
        tests: [
          {
            id: "limits-checkpoint",
            title: "Limits Checkpoint",
            duration: "15 min",
            questions: 12,
            description: "Assess limit intuition and rules.",
          },
        ],
      },
    ],
  },
];

export const getTopic = (topicId: string) =>
  syllabus.find((topic) => topic.id === topicId) ?? null;

export const getSubtopic = (topicId: string, subtopicId: string) => {
  const topic = getTopic(topicId);
  if (!topic) return null;
  return topic.subtopics.find((subtopic) => subtopic.id === subtopicId) ?? null;
};

export const getTutorial = (
  topicId: string,
  subtopicId: string,
  tutorialId: string,
) => {
  const subtopic = getSubtopic(topicId, subtopicId);
  if (!subtopic) return null;
  return (
    subtopic.tutorials.find((tutorial) => tutorial.id === tutorialId) ?? null
  );
};

export const getTest = (
  topicId: string,
  subtopicId: string,
  testId: string,
) => {
  const subtopic = getSubtopic(topicId, subtopicId);
  if (!subtopic?.tests?.length) return null;
  return subtopic.tests.find((test) => test.id === testId) ?? null;
};
