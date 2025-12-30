# Landing Page Structure

This directory contains all the modular components and pages for the Animat Web landing page and authentication flow.

## Directory Structure

```
app/
├── components/
│   └── landing/
│       ├── Navigation.tsx      # Top navigation bar with auth links
│       ├── Hero.tsx            # Hero section with main CTA
│       ├── Features.tsx        # Features showcase
│       ├── HowItWorks.tsx      # Step-by-step guide
│       ├── Roadmap.tsx         # Product roadmap
│       └── Footer.tsx          # Footer with links
├── auth/
│   ├── signin/
│   │   └── page.tsx            # Sign in page
│   └── signup/
│       └── page.tsx            # Sign up page
├── about/
│   └── page.tsx                # About page
├── pricing/
│   └── page.tsx                # Pricing page
└── page.tsx                    # Main landing page
```

## Components

### Navigation.tsx
- Fixed header with logo and navigation
- Responsive mobile menu using Sheet component
- Links to pricing, about pages
- Auth buttons (Sign In/Sign Up)

### Hero.tsx
- Hero section with main value proposition
- CTA buttons for "Start Creating" and "Learn More"
- Placeholder for demo animation

### Features.tsx
- 6 feature cards with icons
- Highlights key capabilities of Animat
- Responsive grid layout

### HowItWorks.tsx
- 4-step guide for using Animat
- Benefits list with checkmarks
- Clear progression from creation to animation

### Roadmap.tsx
- 3 phases: Current, Soon, Future
- Status badges for different phases
- Feature lists with checkmarks

### Footer.tsx
- Comprehensive footer with navigation
- Links to product, resources, and CTA
- Copyright information

## Pages

### Landing Page (/)
- Combines all components into a cohesive landing experience
- Full-page scroll with multiple sections
- Responsive design

### Sign In (/auth/signin)
- Email and password input
- "Forgot password?" link
- Link to sign up
- Demo mode option

### Sign Up (/auth/signup)
- Full name, email, password fields
- Password confirmation
- Terms & conditions checkbox
- Form validation
- Link to sign in

### About (/about)
- Project overview
- Core philosophy
- Technology stack
- Team section placeholder

### Pricing (/pricing)
- 3 pricing tiers (Free, Creator, Team)
- Feature comparison
- CTA buttons
- FAQ section

## Features

✅ **Modular Components** - Each section is a reusable component
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Authentication Flow** - Sign in/up pages with validation
✅ **Navigation** - Mobile-friendly navigation with dropdown menu
✅ **Professional UI** - Modern design with Tailwind CSS
✅ **Accessibility** - Radix UI components for a11y
✅ **Type-Safe** - Full TypeScript support

## Customization

### Colors
Update Tailwind color classes throughout components. Main colors used:
- Primary: `blue-600`, `blue-700`
- Secondary: `purple-600`
- Neutral: `gray-*`

### Links
Replace placeholder links (`#`) with actual URLs:
- Documentation
- Examples
- FAQ
- Terms & Conditions
- Privacy Policy
- Team page

### Copy
All text can be customized in each component. Main sections:
- Hero heading and subheading
- Feature descriptions
- Step descriptions
- Pricing tiers and features

## Authentication

Currently, the auth pages have placeholder implementations. To connect real authentication:

1. Replace `handleSignIn()` and `handleSignUp()` with actual API calls
2. Add error handling and loading states
3. Redirect to dashboard/editor after successful auth
4. Implement password reset flow
5. Add OAuth providers (GitHub, Google, etc.)

## Future Enhancements

- [ ] Implement backend authentication
- [ ] Add OAuth providers
- [ ] Create user dashboard
- [ ] Add user profiles and galleries
- [ ] Implement project sharing
- [ ] Add analytics
