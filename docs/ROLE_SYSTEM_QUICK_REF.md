# Role Management Quick Reference

## 🎯 Files Modified/Created

### Authentication & Types
- ✅ `types/next-auth.ts` - Added UserRole type and role to Session/User
- ✅ `lib/models/User.ts` - Already had role field (student/teacher/admin)
- ✅ `app/api/auth/register/route.ts` - Now accepts and validates role during signup
- ✅ `app/api/auth/[...nextauth]/route.ts` - Includes role in JWT and session

### UI Components
- ✅ `app/auth/signup/page.tsx` - Role selection UI (Student/Teacher cards)
- ✅ `app/components/Navigation.tsx` - Role-based menu filtering
- ✅ `components/RoleGuard.tsx` - Client-side role protection components

### Server-Side Protection
- ✅ `lib/auth.ts` - Role checking helpers (requireRole, requireTeacher, requireAdmin)
- ✅ `middleware.ts` - Route protection for /teacher and /admin paths
- ✅ `app/teacher/layout.tsx` - Server-side role check for teacher portal

### Client-Side Hooks
- ✅ `hooks/useRole.ts` - React hooks for role checking

### Documentation
- ✅ `docs/ROLE_BASED_ACCESS_CONTROL.md` - Complete implementation guide

## 🚀 Quick Usage

### Sign Up with Role
1. Go to `/auth/signup`
2. Fill in name, email, password
3. **Select role: Student or Teacher**
4. Click "Create Account"

### Check User Role in Code

**Server Component:**
```tsx
import { requireTeacher } from "@/lib/auth";

export default async function Page() {
  await requireTeacher(); // Redirects if not teacher/admin
  return <div>Teacher Content</div>;
}
```

**Client Component:**
```tsx
import { useIsTeacher } from "@/hooks/useRole";

export default function Component() {
  const isTeacher = useIsTeacher();
  return isTeacher ? <TeacherUI /> : <StudentUI />;
}
```

**API Route:**
```tsx
import { requireRole } from "@/lib/auth";

export async function POST(req: Request) {
  await requireRole(["teacher", "admin"]);
  // Only teachers and admins reach here
}
```

## 📊 Role Hierarchy

```
Admin (Full Access)
  ↳ Teacher (Learning + Teaching)
    ↳ Student (Learning Only)
```

## 🔐 Protected Routes

### Automatically Protected by Middleware:
- `/teacher/*` → Teacher or Admin only
- `/admin/*` → Admin only
- `/api/teacher/*` → Teacher or Admin only
- `/api/admin/*` → Admin only

### Public Routes:
- `/learn/*` → All authenticated users
- `/api/learn/*` → All authenticated users (published content only)

## 🎨 Role Selection UI

The signup form now includes visual role cards:

```
┌─────────────┐  ┌─────────────┐
│ 📚 Student  │  │ 📖 Teacher  │
│             │  │             │
│ Learn and   │  │ Create and  │
│ practice    │  │ manage      │
│ math        │  │ content     │
└─────────────┘  └─────────────┘
```

## ✅ Testing Checklist

- [ ] Sign up as student → Should see Learn, Features, Pricing, About
- [ ] Sign up as teacher → Should see Learn, Teacher, Features, Pricing, About
- [ ] Student tries to access `/teacher` → Redirected to `/learn`
- [ ] Teacher can access `/teacher` → Success
- [ ] Teacher can create topics/subtopics/tutorials/tests
- [ ] Student can view published content in `/learn`
- [ ] OAuth users (GitHub) default to student role

## 🔄 Role Change (Manual)

To change a user's role manually in MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "teacher" } }
)
```
User must sign out and sign in again for changes to take effect.
