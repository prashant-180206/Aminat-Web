# Scene Management Components

This directory contains all components for the Scene/Projects management page at `/scene`.

## Components

### SceneHeader
- **File**: `SceneHeader.tsx`
- **Purpose**: Main navigation header with user profile management
- **Features**:
  - Brand logo with gradient colors
  - User profile dropdown with name and email
  - Account settings link
  - Logout functionality
  - Sticky positioning for always-visible navigation
- **Props**: None (uses NextAuth hooks internally)
- **Dependencies**: NextAuth, Shadcn UI (DropdownMenu, Button), Lucide React

### ProjectCard
- **File**: `ProjectCard.tsx`
- **Purpose**: Display individual project with management options
- **Features**:
  - Project name and description
  - Scene count and creation date
  - Edit and Delete actions via dropdown menu
  - Delete confirmation dialog
  - Open project button
  - Hover effects for better UX
- **Props**:
  - `project`: Project object with _id, name, description, scenes, createdAt
  - `onProjectDeleted`: Callback function when project is deleted
- **Dependencies**: Shadcn UI, Lucide React, date-fns, Sonner (toast)

### CreateProjectDialog
- **File**: `CreateProjectDialog.tsx`
- **Purpose**: Modal dialog for creating new projects
- **Features**:
  - Dialog trigger button with Plus icon
  - Form with name and description inputs
  - Form validation (name is required)
  - Success/error toast notifications
  - Loading state on submit
  - Automatic form reset on success
- **Props**:
  - `onProjectCreated`: Callback function when project is created
- **Dependencies**: Shadcn UI (Dialog, Input, Textarea, Button), Lucide React, Sonner (toast)

### ProjectsGrid
- **File**: `ProjectsGrid.tsx`
- **Purpose**: Grid container for displaying all user projects
- **Features**:
  - Fetches projects from `/api/projects` endpoint
  - Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
  - Loading skeleton states
  - Empty state UI when no projects exist
  - Automatic project list refresh on create/delete
- **Props**: None (manages its own state)
- **Dependencies**: Shadcn UI (Skeleton), Sonner (toast), React hooks

### SceneFooter
- **File**: `SceneFooter.tsx`
- **Purpose**: Footer component with links and branding
- **Features**:
  - Brand information
  - Product links (Editor, Pricing, About)
  - Support links (Documentation, FAQ, Contact)
  - Privacy and terms links
  - Responsive grid layout
- **Props**: None
- **Dependencies**: Shadcn UI (Separator)

## Page Structure

The main page (`page.tsx`) integrates all components:

```
┌─────────────────────────────────────┐
│       SceneHeader                   │  User profile, logout
├─────────────────────────────────────┤
│                                     │
│  ProjectsGrid                       │  Projects list with:
│  ├─ Create Project Dialog           │  - ProjectCard components
│  ├─ Projects Grid                   │  - Loading states
│  └─ Empty State                     │  - Empty state
│                                     │
├─────────────────────────────────────┤
│       SceneFooter                   │  Links and branding
└─────────────────────────────────────┘
```

## API Integration

All components interact with the following API endpoints:

- **GET `/api/projects`**: Fetch all user projects
- **POST `/api/projects`**: Create new project
- **PUT `/api/projects/[projectId]`**: Update project
- **DELETE `/api/projects/[projectId]`**: Delete project

## Styling

All components use:
- **Framework**: Tailwind CSS
- **UI Library**: Shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Dates**: date-fns for formatting

## Authentication

All components require authentication via NextAuth.js. The page uses `useRequireAuth()` hook to:
- Check if user is authenticated
- Redirect to login if not authenticated
- Provide session data to child components

## Responsive Design

- **Mobile**: 1 column grid
- **Tablet**: 2 column grid  (md breakpoint)
- **Desktop**: 3 column grid (lg breakpoint)
- Header and footer are fully responsive

## Future Enhancements

- [ ] Search functionality to filter projects
- [ ] Sort projects by name, date, or scene count
- [ ] Pagination or infinite scroll for large project lists
- [ ] Bulk operations (delete multiple projects)
- [ ] Project tagging/categorization
- [ ] Project sharing/collaboration features
- [ ] Export projects as animations
