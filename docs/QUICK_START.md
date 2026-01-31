# Quick Start Guide - Teacher Portal Development

## Setup

### Prerequisites
- Node.js 18+
- MongoDB database
- NextAuth configured with MongoDB adapter

### Installation
```bash
npm install
```

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000/teacher` to access the teacher portal.

---

## Creating a New Feature

### 1. Add API Endpoint

Create route handler in `app/api/teacher/`:

```typescript
// app/api/teacher/your-endpoint/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import YourModel from "@/lib/models/YourModel";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const data = await YourModel.find({});
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await dbConnect();
  
  const newItem = await YourModel.create({
    ...body,
    createdBy: session.user.id,
  });
  
  return NextResponse.json(newItem, { status: 201 });
}
```

### 2. Create TypeScript Types

Add to `types/teacher.ts`:

```typescript
export interface YourType {
  _id?: string;
  id: string;
  title: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateYourTypeData {
  title: string;
}
```

### 3. Create API Service

Add to `lib/api/your-service.ts`:

```typescript
import { apiClient } from './client';
import type { YourType, CreateYourTypeData } from '@/types/teacher';

export const yourServiceAPI = {
  getAll: async (): Promise<YourType[]> => {
    return apiClient<YourType[]>('/api/teacher/your-endpoint');
  },

  create: async (data: CreateYourTypeData): Promise<YourType> => {
    return apiClient<YourType>('/api/teacher/your-endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
```

Export in `lib/api/index.ts`:
```typescript
export { yourServiceAPI } from './your-service';
```

### 4. Create React Query Hook

Add to `hooks/useYourService.ts`:

```typescript
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { yourServiceAPI } from '@/lib/api';
import type { YourType, CreateYourTypeData } from '@/types/teacher';

// Query keys
export const yourServiceKeys = {
  all: ['your-service'] as const,
  lists: () => [...yourServiceKeys.all, 'list'] as const,
};

// Get all items
export function useYourService() {
  return useQuery({
    queryKey: yourServiceKeys.lists(),
    queryFn: () => yourServiceAPI.getAll(),
  });
}

// Create item mutation
export function useCreateYourService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateYourTypeData) => yourServiceAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: yourServiceKeys.lists() });
    },
  });
}
```

### 5. Create Component

Add to `app/teacher/components/YourComponent.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateYourService } from '@/hooks/useYourService';
import { toast } from 'sonner';

export function YourComponent() {
  const create = useCreateYourService();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    create.mutate(
      { title },
      {
        onSuccess: () => {
          toast.success('Created successfully!');
          setTitle('');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? 'Creating...' : 'Create'}
      </Button>
    </form>
  );
}
```

### 6. Create Page

Add to `app/teacher/your-feature/page.tsx`:

```typescript
'use client';

import { useYourService } from '@/hooks/useYourService';
import { YourComponent } from '../components/YourComponent';

export default function YourFeaturePage() {
  const { data: items, isLoading } = useYourService();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Your Feature</h1>
      <YourComponent />
      
      <div>
        {items?.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## Testing

### Test API Endpoint
```bash
# Using curl
curl -X GET http://localhost:3000/api/teacher/topics \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Create new topic
curl -X POST http://localhost:3000/api/teacher/topics \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"title":"Test Topic","description":"Test description"}'
```

### Test Component
```typescript
// In your test file
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YourComponent from './YourComponent';

test('renders component', () => {
  const queryClient = new QueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <YourComponent />
    </QueryClientProvider>
  );
  
  expect(screen.getByText('Your Feature')).toBeInTheDocument();
});
```

---

## Common Patterns

### Loading States
```typescript
const { data, isLoading, error } = useYourService();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <YourContent data={data} />;
```

### Mutations with Optimistic Updates
```typescript
const updateItem = useUpdateYourService();

updateItem.mutate(
  { id, data },
  {
    onMutate: async (variables) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: keys.detail(variables.id) });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(keys.detail(variables.id));
      
      // Optimistically update
      queryClient.setQueryData(keys.detail(variables.id), {
        ...previous,
        ...variables.data,
      });
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(keys.detail(variables.id), context?.previous);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success('Updated successfully!');
    },
  }
);
```

### Dependent Queries
```typescript
const { data: topic } = useTopic(topicId);
const { data: subtopics } = useSubtopics(topicId, {
  enabled: !!topic, // Only fetch if topic exists
});
```

### Infinite Queries (Pagination)
```typescript
export function useInfiniteTopics() {
  return useInfiniteQuery({
    queryKey: topicKeys.lists(),
    queryFn: ({ pageParam = 0 }) => 
      topicsAPI.getAll({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length : undefined,
  });
}
```

---

## Best Practices

### 1. Always Use TypeScript Types
```typescript
// ❌ Bad
const createTopic = (data: any) => { ... }

// ✅ Good
const createTopic = (data: CreateTopicData) => { ... }
```

### 2. Handle Errors Properly
```typescript
// ❌ Bad
try {
  await fetch('/api/endpoint');
} catch (error) {
  console.log(error);
}

// ✅ Good
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new APIError(response.status, await response.json());
  }
  return response.json();
} catch (error) {
  if (error instanceof APIError) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

### 3. Use Query Keys Consistently
```typescript
// ❌ Bad
useQuery({ queryKey: ['topics'] })
useQuery({ queryKey: ['topic', topicId] })

// ✅ Good
export const topicKeys = {
  all: ['topics'] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  detail: (id: string) => [...topicKeys.all, 'detail', id] as const,
};

useQuery({ queryKey: topicKeys.lists() })
useQuery({ queryKey: topicKeys.detail(topicId) })
```

### 4. Keep Components Small and Focused
```typescript
// ❌ Bad - One huge component
function TopicsPage() {
  // 500 lines of code
}

// ✅ Good - Modular components
function TopicsPage() {
  return (
    <div>
      <TopicsHeader />
      <TopicsList />
      <CreateTopicDialog />
    </div>
  );
}
```

### 5. Use Proper Cache Invalidation
```typescript
// After creating/updating/deleting, invalidate related queries
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
  queryClient.invalidateQueries({ queryKey: topicKeys.detail(topicId) });
}
```

---

## Debugging

### Check React Query DevTools
```typescript
// Add to your layout or page
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Log API Calls
```typescript
// In lib/api/client.ts
console.log('API Request:', url, options);
const response = await fetch(url, options);
console.log('API Response:', response.status, await response.clone().json());
```

### Check MongoDB Queries
```typescript
// Enable mongoose debugging
mongoose.set('debug', true);
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [MongoDB Mongoose Documentation](https://mongoosejs.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
