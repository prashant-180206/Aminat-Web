# Teacher Portal - Backend & React Query Architecture

## Overview
Complete backend API and frontend architecture for the Animat teacher portal, allowing teachers to create and manage topics, subtopics, tutorials, and tests with scene animations.

## Backend Architecture

### API Structure
All teacher APIs are located under `/api/teacher/` with RESTful endpoints for full CRUD operations.

#### Topics API (`/api/teacher/topics`)
- `GET /api/teacher/topics` - List all topics
- `POST /api/teacher/topics` - Create new topic
- `GET /api/teacher/topics/:topicId` - Get topic with subtopics
- `PATCH /api/teacher/topics/:topicId` - Update topic
- `DELETE /api/teacher/topics/:topicId` - Delete topic (cascades to all related content)

#### Subtopics API (`/api/teacher/topics/:topicId/subtopics`)
- `GET /api/teacher/topics/:topicId/subtopics` - List all subtopics for a topic
- `POST /api/teacher/topics/:topicId/subtopics` - Create new subtopic
- `GET /api/teacher/topics/:topicId/subtopics/:subtopicId` - Get subtopic with tutorials/tests
- `PATCH /api/teacher/topics/:topicId/subtopics/:subtopicId` - Update subtopic
- `DELETE /api/teacher/topics/:topicId/subtopics/:subtopicId` - Delete subtopic (cascades)

#### Tutorials API (`/api/teacher/topics/:topicId/subtopics/:subtopicId/tutorials`)
- `GET` - List all tutorials for a subtopic
- `POST` - Create new tutorial
- `GET /:tutorialId` - Get single tutorial
- `PATCH /:tutorialId` - Update tutorial
- `DELETE /:tutorialId` - Delete tutorial

#### Tests API (`/api/teacher/topics/:topicId/subtopics/:subtopicId/tests`)
- `GET` - List all tests for a subtopic
- `POST` - Create new test
- `GET /:testId` - Get single test
- `PATCH /:testId` - Update test
- `DELETE /:testId` - Delete test

### Database Models

#### Topic Model (`lib/models/Topic.ts`)
```typescript
{
  id: string (unique, generated from title)
  title: string
  description: string
  createdBy: ObjectId (ref: User)
  published: boolean
  timestamps: true
}
```

#### Subtopic Model (`lib/models/Subtopic.ts`)
```typescript
{
  id: string (unique)
  title: string
  description: string
  topicId: string
  createdBy: ObjectId
  published: boolean
  timestamps: true
}
```

#### Tutorial Model (`lib/models/Tutorial.ts`)
```typescript
{
  id: string (unique)
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  steps: string[]
  hasScene: boolean
  sceneData: object (scene configuration)
  subtopicId: string
  topicId: string
  createdBy: ObjectId
  published: boolean
  timestamps: true
}
```

#### Test Model (`lib/models/Test.ts`)
```typescript
{
  id: string (unique)
  title: string
  description: string
  duration: string
  questions: number
  questionsData: object[]
  subtopicId: string
  topicId: string
  createdBy: ObjectId
  published: boolean
  timestamps: true
}
```

## Frontend Architecture

### API Service Layer (`lib/api/`)

Modular API client with centralized error handling:

- **`client.ts`** - Base API client with fetch wrapper and error handling
- **`topics.ts`** - Topics API service
- **`subtopics.ts`** - Subtopics API service
- **`tutorials.ts`** - Tutorials API service
- **`tests.ts`** - Tests API service
- **`index.ts`** - Barrel exports

Example usage:
```typescript
import { topicsAPI } from '@/lib/api';

// Get all topics
const topics = await topicsAPI.getAll();

// Create topic
const newTopic = await topicsAPI.create({ title, description });

// Update topic
await topicsAPI.update(topicId, { published: true });

// Delete topic
await topicsAPI.delete(topicId);
```

### React Query Hooks (`hooks/`)

Custom hooks for data fetching and mutations:

#### Topic Hooks (`useTopics.ts`)
- `useTopics()` - Fetch all topics
- `useTopic(topicId)` - Fetch single topic with subtopics
- `useCreateTopic()` - Create topic mutation
- `useUpdateTopic()` - Update topic mutation
- `useDeleteTopic()` - Delete topic mutation

#### Subtopic Hooks (`useSubtopics.ts`)
- `useSubtopics(topicId)` - Fetch all subtopics
- `useSubtopic(topicId, subtopicId)` - Fetch single subtopic with content
- `useCreateSubtopic()` - Create subtopic mutation
- `useUpdateSubtopic()` - Update subtopic mutation
- `useDeleteSubtopic()` - Delete subtopic mutation

#### Tutorial Hooks (`useTutorials.ts`)
- `useTutorials(topicId, subtopicId)` - Fetch all tutorials
- `useTutorial(topicId, subtopicId, tutorialId)` - Fetch single tutorial
- `useCreateTutorial()` - Create tutorial mutation
- `useUpdateTutorial()` - Update tutorial mutation
- `useDeleteTutorial()` - Delete tutorial mutation

#### Test Hooks (`useTests.ts`)
- `useTests(topicId, subtopicId)` - Fetch all tests
- `useTest(topicId, subtopicId, testId)` - Fetch single test
- `useCreateTest()` - Create test mutation
- `useUpdateTest()` - Update test mutation
- `useDeleteTest()` - Delete test mutation

### Query Key Factory Pattern

Each hook module defines query keys for proper cache management:

```typescript
export const topicKeys = {
  all: ['topics'] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  details: () => [...topicKeys.all, 'detail'] as const,
  detail: (id: string) => [...topicKeys.details(), id] as const,
};
```

### Modular Components (`app/teacher/components/`)

Reusable, typed components:

- **`TopicCard.tsx`** - Topic display card with delete action
- **`SubtopicCard.tsx`** - Subtopic display card with manage/delete
- **`CreateTopicForm.tsx`** - Form for creating topics
- **`CreateSubtopicForm.tsx`** - Form for creating subtopics
- **`CreateTutorialForm.tsx`** - Form for creating tutorials with scene support
- **`CreateTestForm.tsx`** - Form for creating tests

All components use React Query hooks and TypeScript types.

## Type Safety

### TypeScript Types (`types/teacher.ts`)

Comprehensive type definitions:

```typescript
export interface Topic {
  _id?: string;
  id: string;
  title: string;
  description: string;
  createdBy: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTopicData {
  title: string;
  description: string;
}

// Similar interfaces for Subtopic, Tutorial, Test
```

## React Query Configuration

### Provider Setup (`hooks/providers.tsx`)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Automatic Cache Invalidation

Mutations automatically invalidate related queries:

```typescript
export function useCreateSubtopic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ topicId, data }) => subtopicsAPI.create(topicId, data),
    onSuccess: (_, variables) => {
      // Invalidate both subtopic list and parent topic
      queryClient.invalidateQueries({ queryKey: subtopicKeys.list(variables.topicId) });
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(variables.topicId) });
    },
  });
}
```

## Usage Examples

### Creating a Topic
```typescript
import { useCreateTopic } from '@/hooks/useTopics';

function CreateTopicForm() {
  const createTopic = useCreateTopic();
  
  const handleSubmit = (data) => {
    createTopic.mutate(data, {
      onSuccess: (newTopic) => {
        toast.success('Topic created!');
        router.push(`/teacher/topics/${newTopic.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createTopic.isPending}>
        {createTopic.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Fetching and Displaying Data
```typescript
import { useTopics, useDeleteTopic } from '@/hooks/useTopics';

function TopicsPage() {
  const { data: topics, isLoading } = useTopics();
  const deleteTopic = useDeleteTopic();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      {topics?.map(topic => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onDelete={(id) => deleteTopic.mutate(id)}
        />
      ))}
    </div>
  );
}
```

## Benefits

1. **Type Safety** - Full TypeScript coverage prevents runtime errors
2. **Automatic Caching** - React Query caches responses, reducing API calls
3. **Optimistic Updates** - UI updates instantly, rollback on error
4. **Cache Invalidation** - Related data automatically refetches when mutations occur
5. **Loading States** - Built-in loading/error states from hooks
6. **Modular Code** - Separation of concerns (API, hooks, components)
7. **Error Handling** - Centralized error handling in API client
8. **Code Reusability** - Shared components across pages

## Future Enhancements

- [ ] Add optimistic updates for better UX
- [ ] Implement pagination for large datasets
- [ ] Add search/filter functionality
- [ ] Scene editor integration for tutorials
- [ ] Question builder for tests
- [ ] Bulk operations (publish multiple items)
- [ ] Analytics dashboard for teacher insights
