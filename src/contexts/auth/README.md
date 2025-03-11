# Auth Context Refactoring

This directory contains the authentication context for the application, which has been refactored for improved maintainability, readability, and testability.

## Structure

The authentication system is now organized into the following files:

- **auth-provider.tsx**: The main provider component that sets up the authentication context
- **auth-hooks.ts**: Custom React hooks for specific authentication functionality
- **auth-utils.ts**: Utility functions for common operations
- **auth-service.ts**: Service functions for authentication operations
- **profile-service.ts**: Service functions for profile management
- **profile-transformers.ts**: Functions for transforming profile data
- **types.ts**: TypeScript type definitions

## Key Improvements

### 1. Separation of Concerns

- **Auth Provider**: Focused on setting up the context and providing values
- **Custom Hooks**: Handle specific functionality like tab visibility, loading states, etc.
- **Utility Functions**: Handle common operations like creating minimal profiles

### 2. Code Duplication Reduction

- Extracted repeated code patterns into reusable functions
- Centralized profile creation logic
- Standardized logging through a dedicated logger

### 3. Improved Error Handling

- Consistent error handling patterns
- Better error recovery mechanisms
- Improved error logging for debugging

### 4. Enhanced Maintainability

- Smaller, focused components and functions
- Clearer separation of concerns
- Easier to understand and modify individual pieces

## Usage

The API of the AuthContext remains unchanged, so existing components using the context will continue to work without modification:

```tsx
import { useContext } from 'react'
import { AuthContext } from '@/contexts/auth/auth-provider'

function MyComponent() {
  const { user, profile, signIn, signOut } = useContext(AuthContext)
  
  // Use auth context values and functions
}
```

## Custom Hooks

The refactoring introduces several custom hooks that can be used independently if needed:

- **useTabVisibility**: Manages tab visibility state
- **useLoadingWithTimeout**: Manages loading states with safety timeouts
- **useInitialSession**: Handles initial session loading
- **useAuthStateChange**: Manages authentication state changes
- **useProfileOperations**: Provides profile management functions
- **useAuthOperations**: Provides authentication functions

## Utility Functions

Common operations are now available as utility functions:

- **createMinimalProfile**: Creates a minimal profile object
- **authLogger**: Provides consistent logging
- **isTabFocusEvent**: Detects tab focus events
- **updateAuthTimestamp**: Updates the authentication timestamp
- **storeProfileUpdateTimestamp**: Stores profile update timestamp
- **wasProfileRecentlyUpdated**: Checks if profile was recently updated