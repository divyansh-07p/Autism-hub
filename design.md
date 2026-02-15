# Autism Hub - Design Document

## Design Philosophy
Create an inclusive, welcoming, and intuitive platform that is accessible to users of all abilities while maintaining visual appeal and engagement.

## System Architecture

### Frontend Architecture
```
├── React (UI Layer)
├── Vite (Build & Dev Server)
├── TypeScript (Type Safety)
├── Tailwind CSS (Styling)
├── Supabase Client (Data Layer)
└── Context API (State Management)
```

### Backend Architecture
```
├── Python Server
├── REST API Endpoints
├── Supabase Integration
├── Database Layer
└── Authentication Service
```

### Database Schema Overview
- **Users Table**: User profiles and authentication
- **Profiles Table**: Extended user information and preferences
- **Games Table**: Game metadata and configurations
- **Game Progress Table**: User game scores and progress
- **Content Table**: Articles, videos, and resources
- **Mentorship Table**: Mentor-mentee relationships
- **Events Table**: Community events
- **Stories Table**: User testimonials and narratives

## Component Architecture

### Page-Level Components
- **HomePage**: Landing page with navigation to all features
- **GamesPage**: Game discovery and selection
- **SingAlongsPage**: Video content for children
- **VideosPage**: Educational and entertainment videos
- **MentorshipPage**: Mentor matching and connections
- **VolunteeringPage**: Volunteering opportunities
- **EventsPage**: Community events calendar
- **StoriesPage**: User success stories and testimonials

### Game Components
- **BubblePopGame**: Interactive bubble-popping mechanics
- **ZenSortingGame**: Relaxing sorting game experience

### Shared Components
- **Navigation**: Global navigation bar
- **Header**: Page headers and breadcrumbs
- **Button**: Reusable button component
- **Card**: Content display cards
- **Modal**: Dialog and modal windows
- **Loading**: Loading states and spinners
- **Footer**: Global footer

## UI/UX Design Specifications

### Color Palette
- **Primary**: Calming blues and purples (accessibility-friendly)
- **Secondary**: Complementary greens and warm tones
- **Neutral**: Grays for backgrounds and text
- **Status Colors**:
  - Success: Green
  - Warning: Orange
  - Error: Red
  - Info: Blue

### Typography
- **Headings**: Clear, readable sans-serif font
- **Body Text**: Legible font with proper line height
- **Font Sizes**:
  - H1: 2.5rem
  - H2: 2rem
  - H3: 1.5rem
  - Body: 1rem
  - Small: 0.875rem

### Spacing & Layout
- Grid-based layout system (12-column grid)
- Consistent padding and margins
- Whitespace for clarity and reduced cognitive load
- Responsive breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Interactive Elements
- Clear focus states for keyboard navigation
- Hover effects for clickable elements
- Visual feedback for user actions
- Smooth transitions and animations

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text
- Keyboard accessible (Tab, Enter, Space, Arrow keys)
- Screen reader support with semantic HTML
- Alternative text for all images
- Proper heading hierarchy (H1 → H2 → H3)

### Design Considerations
- Avoid relying solely on color to convey information
- Provide multiple ways to navigate content
- Ensure sufficient time for interactions (no aggressive timeouts)
- Clear, simple language
- Consistent navigation patterns
- Distinguishable focus indicators

## Game Design Specifications

### Bubble Pop Game
- **Target Audience**: Children with autism
- **Mechanics**: Click/tap bubbles to pop them
- **Feedback**: Visual and audio cues on success
- **Progression**: Increasing difficulty levels
- **Duration**: 2-5 minutes per session
- **Customization**: Sound toggle, difficulty settings

### Zen Sorting Game
- **Target Audience**: All ages seeking relaxation
- **Mechanics**: Sort items into categories
- **Atmosphere**: Calming visuals and music
- **Feedback**: Gentle, positive reinforcement
- **Progression**: Gradual skill development
- **Duration**: Self-paced gameplay

## Navigation Flow

```
Landing Page
├── Home
├── Games
│   ├── Bubble Pop
│   └── Zen Sorting
├── For Children
│   ├── Games
│   ├── Sing Alongs
│   └── Videos
├── For Adults
│   ├── Mentorship
│   ├── Volunteering
│   ├── Stories
│   └── Events
└── User Profile
    └── Settings
```

## Responsive Design Strategy

### Mobile First Approach
- Design for small screens first
- Progressive enhancement for larger screens
- Touch-friendly interactive elements (minimum 44x44px)
- Vertical stacking of components
- Simplified navigation (hamburger menu)

### Desktop Experience
- Multi-column layouts
- Expanded navigation
- Optimized spacing and typography
- Advanced features and information

## State Management

### Context Providers
- **AuthContext**: User authentication state
- **UserContext**: User profile and preferences
- **ThemeContext**: Theme and styling preferences
- **GameContext**: Game state and progress

## API Endpoints Design

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`

### Games
- GET `/api/games`
- GET `/api/games/{id}`
- POST `/api/games/{id}/progress`
- GET `/api/games/{id}/leaderboard`

### Content
- GET `/api/content` (with filters)
- GET `/api/content/{id}`
- GET `/api/videos`
- GET `/api/stories`

### Community
- GET `/api/mentors`
- POST `/api/mentorship/request`
- GET `/api/events`
- GET `/api/volunteering`

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading of components
- Image optimization
- Caching strategies

### Backend
- Database indexing
- Query optimization
- API response caching
- Rate limiting

## Deployment Architecture

### Frontend Deployment
- Vite build optimization
- Static site hosting
- CDN distribution
- Environment-based configuration

### Backend Deployment
- Python server containerization
- Environment variables for configuration
- Logging and monitoring
- Error tracking

## Testing Strategy

### Unit Tests
- Component logic testing
- Utility function testing
- API integration testing

### Integration Tests
- User flow testing
- Game mechanics testing
- Database interaction testing

### E2E Tests
- Critical user journeys
- Cross-browser testing
- Mobile responsiveness testing

## Future Enhancements
- Progressive Web App (PWA) support
- Offline game functionality
- Social features (friend connections)
- Gamification elements (badges, rewards)
- Personalized content recommendations
- AI-powered mentorship matching
- Multilingual support
