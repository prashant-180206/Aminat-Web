# Role-Based Access Control (RBAC)

This application implements a comprehensive role-based access control system with three user roles: **Student**, **Teacher**, and **Admin**.

## User Roles

### Student (Default)
- **Access**: Learning portal (`/learn`)
- **Permissions**: 
  - View published topics, subtopics, tutorials, and tests
  - Take tests and track progress
  - Access project creation and editing
- **API Access**: `/api/learn/*`

### Teacher
- **Access**: All student features + Teacher portal (`/teacher`)
- **Permissions**:
  - Create, edit, delete topics, subtopics, tutorials, and tests
  - Publish/unpublish content
  - Manage learning materials
- **API Access**: `/api/learn/*`, `/api/teacher/*`

### Admin
- **Access**: All features (Student + Teacher + Admin)
- **Permissions**:
  - All teacher permissions
  - User management (future)
  - System configuration (future)
- **API Access**: All API routes

## Implementation Details

### 1. Database Schema
User model includes a `role` field:
```typescript
role: {
  type: String,
  enum: ["student", "teacher", "admin"],
  default: "student"
}
```

### 2. Authentication Flow

#### Sign Up
- Users select their role (Student or Teacher) during registration
- Role is stored in the database
- Default role is "student" if not specified

#### Sign In
- Role is fetched from database
- Included in JWT token and session

### 3. Type Definitions

Located in `/types/next-auth.ts`:
```typescript
export type UserRole = "student" | "teacher" | "admin";
```

Session and User interfaces extended to include role.

### 4. Server-Side Protection

#### API Routes
Protected by NextAuth middleware in `middleware.ts`:
- `/api/teacher/*` - Requires teacher or admin role
- `/api/admin/*` - Requires admin role

#### Server Components/Actions
Use helper functions from `/lib/auth.ts`:
```typescript
// Require any authenticated user
await requireAuth();

// Require specific role(s)
await requireRole(["teacher", "admin"]);

// Require teacher role
await requireTeacher();

// Require admin role
await requireAdmin();
```

### 5. Client-Side Protection

#### React Hooks
Located in `/hooks/useRole.ts`:
```typescript
useRole() // Get current user's role
useHasRole(["teacher", "admin"]) // Check if user has allowed role
useIsTeacher() // Check if user is teacher or admin
useIsAdmin() // Check if user is admin
useIsStudent() // Check if user is student
```

#### Role Guard Components
Located in `/components/RoleGuard.tsx`:
```tsx
// Protect component with custom roles
<RoleGuard allowedRoles={["teacher", "admin"]}>
  <TeacherContent />
</RoleGuard>

// Shorthand for teacher content
<TeacherGuard>
  <TeacherContent />
</TeacherGuard>

// Shorthand for admin content
<AdminGuard>
  <AdminContent />
</AdminGuard>
```

### 6. Navigation
The navigation component (`/app/components/Navigation.tsx`) automatically shows/hides menu items based on user role:
- Students see: Learn, Features, Pricing, About
- Teachers see: Learn, Teacher, Features, Pricing, About
- Admins see: All items

## Usage Examples

### Protecting a Page (Server Component)
```tsx
// app/teacher/page.tsx
import { requireTeacher } from "@/lib/auth";

export default async function TeacherPage() {
  await requireTeacher(); // Redirects if not teacher/admin
  
  return <div>Teacher Dashboard</div>;
}
```

### Protecting a Page (Client Component)
```tsx
// app/teacher/dashboard/page.tsx
"use client";
import { TeacherGuard } from "@/components/RoleGuard";

export default function TeacherDashboard() {
  return (
    <TeacherGuard>
      <div>Teacher Dashboard</div>
    </TeacherGuard>
  );
}
```

### Protecting an API Route
```tsx
// app/api/teacher/topics/route.ts
import { requireTeacher } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await requireTeacher();
  // Session is guaranteed to have teacher or admin role
  
  // ... your API logic
}
```

### Conditional UI Rendering
```tsx
"use client";
import { useIsTeacher } from "@/hooks/useRole";

export default function MyComponent() {
  const isTeacher = useIsTeacher();
  
  return (
    <div>
      <h1>Content for everyone</h1>
      {isTeacher && <button>Create Topic</button>}
    </div>
  );
}
```

## Security Notes

1. **Server-side validation is mandatory** - Never rely solely on client-side role checks for security
2. **Middleware protection** - All protected routes are defined in `middleware.ts` config
3. **API route authorization** - Each API route checks session and role
4. **JWT token** - Role is included in JWT and verified on each request
5. **Database as source of truth** - Role changes in database are reflected on next sign-in

## Role Assignment

### During Registration
Users select their role when signing up via the signup form at `/auth/signup`.

### OAuth (GitHub)
Users signing in with GitHub are assigned the default "student" role. To change role:
1. Manual database update (temporary)
2. User profile settings (future feature)
3. Admin panel (future feature)

## Future Enhancements

- [ ] Role change request system
- [ ] Admin panel for user management
- [ ] Permission-based system (more granular than roles)
- [ ] Role hierarchy and inheritance
- [ ] Audit logging for role changes
- [ ] Multi-tenancy support
