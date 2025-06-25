# API Service Layer

## Overview
The API service layer provides a comprehensive interface between the frontend and backend, with the following features:

### Architecture
- **Base API Client** (`api.client.ts`) - Handles HTTP requests, auth tokens, error handling
- **Service Modules** - Organized by feature domain (auth, creator, content, etc.)
- **Type Safety** - Full TypeScript support with interfaces and types
- **Mock Support** - Development mocks for testing without backend

### Services Created

1. **Auth Service** (`auth.service.ts`)
   - Login/logout, signup, password reset
   - Token management
   - Mock implementation for development

2. **Creator Service** (`creator.service.ts`)
   - Creator profiles and listings
   - Dashboard and analytics
   - Earnings and payouts
   - Subscriber management

3. **Content Service** (`content.service.ts`)
   - Post CRUD operations
   - Categories and tags
   - Comments and interactions
   - Bookmarks and likes

4. **Subscription Service** (`subscription.service.ts`)
   - Subscription management
   - Tier selection
   - Invoice history
   - Access control

5. **Payment Service** (`payment.service.ts`)
   - Payment methods
   - Payment intents (Stripe)
   - Transaction history
   - Creator payouts

6. **User Service** (`user.service.ts`)
   - Profile management
   - Preferences
   - Notifications
   - Following/followers

7. **Search Service** (`search.service.ts`)
   - Global search
   - Filtered searches
   - Search suggestions
   - Saved searches

8. **Upload Service** (`upload.service.ts`)
   - File uploads (images, videos, documents)
   - Image optimization
   - Progress tracking
   - Direct upload URLs

### Key Features

- **Automatic Token Management**: Auth tokens are automatically included in requests
- **Error Handling**: Consistent error handling with ApiError class
- **Request Configuration**: Timeout, retry, and header customization
- **File Uploads**: Dedicated upload methods with validation
- **Type Safety**: Full TypeScript interfaces for all API responses

### Usage Example

```typescript
import { creatorService, contentService } from '@/services';

// Get creator dashboard
const dashboard = await creatorService.getCreatorDashboard();

// Create a new post
const newPost = await contentService.createPost({
  title: 'My First Post',
  content: 'Content here...',
  tags: ['tutorial', 'beginner'],
  isPremium: false
});

// Upload an image
const image = await uploadService.uploadImage(file, {
  folder: 'posts',
  transformOptions: {
    width: 1200,
    quality: 0.8
  }
});
```

### Environment Configuration

Set the API URL in your `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

Without this, the app will use mock services in development mode.

### Next Steps

The API service layer is ready for backend integration. When implementing the backend:

1. Follow the endpoint structure in `api.config.ts`
2. Return responses matching the TypeScript interfaces
3. Implement proper authentication with JWT tokens
4. Add CORS support for local development
5. Consider implementing rate limiting and caching