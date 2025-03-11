import type { Route } from 'next'

// Define all possible routes as string literals
export type StaticRoute =
  | '/'
  | '/about'
  | '/auth'
  | '/dashboard'
  | '/dashboard-landing'
  | '/planner'
  | '/quiz'
  | '/flashcards'
  | '/summarizer'
  | '/resources'
  | '/settings'
  | '/profile'
  | '/eval-template-builder'
  | '/admin'
  | '/admin/users'
  | '/admin/analytics'
  | '/admin/quizzes'
  | '/admin/flashcards'
  | '/admin/content'
  | '/admin/settings'
  | '/admin/quiz-management'
  | '/admin/flashcard-decks'
  | '/admin/rank-manager'

// Routes object with all valid routes
export const routes = {
  // Main routes
  home: '/' satisfies StaticRoute,
  about: '/about' satisfies StaticRoute,
  auth: '/auth' satisfies StaticRoute,
  
  // User routes
  dashboard: '/dashboard' satisfies StaticRoute,
  dashboardLanding: '/dashboard-landing' satisfies StaticRoute,
  planner: '/planner' satisfies StaticRoute,
  quiz: '/quiz' satisfies StaticRoute,
  flashcards: '/flashcards' satisfies StaticRoute,
  summarizer: '/summarizer' satisfies StaticRoute,
  resources: '/resources' satisfies StaticRoute,
  settings: '/settings' satisfies StaticRoute,
  profile: '/profile' satisfies StaticRoute,
  evalTemplateBuilder: '/eval-template-builder' satisfies StaticRoute,
  
  // Admin routes
  admin: '/admin' satisfies StaticRoute,
  adminUsers: '/admin/users' satisfies StaticRoute,
  adminAnalytics: '/admin/analytics' satisfies StaticRoute,
  adminQuizzes: '/admin/quizzes' satisfies StaticRoute,
  adminFlashcards: '/admin/flashcards' satisfies StaticRoute,
  adminContent: '/admin/content' satisfies StaticRoute,
  adminSettings: '/admin/settings' satisfies StaticRoute,
  adminQuizManagement: '/admin/quiz-management' satisfies StaticRoute,
  adminFlashcardDecks: '/admin/flashcard-decks' satisfies StaticRoute,
  adminRankManager: '/admin/rank-manager' satisfies StaticRoute,
} as const;

// Type representing all route values
export type AppRoute = Route<StaticRoute>

// Helper function to create a type-safe route
export function createTypedRoute<T extends StaticRoute>(route: T): Route<T> {
  return route as Route<T>;
}

// Type guard to check if a string is a valid route
export function isValidRoute(route: string): route is StaticRoute {
  return Object.values(routes).includes(route as StaticRoute);
} 