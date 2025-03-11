import type { Route } from 'next'

// Define all possible routes as string literals
export type StaticRoute =
  | '/'
  | '/about'
  | '/auth'
  | '/dashboard'
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
  home: '/',
  about: '/about',
  auth: '/auth',
  // User routes
  dashboard: '/dashboard',
  planner: '/planner',
  quiz: '/quiz',
  flashcards: '/flashcards',
  summarizer: '/summarizer',
  resources: '/resources',
  evalTemplateBuilder: '/eval-template-builder',
  settings: '/settings',
  profile: '/profile',
  
  // Admin routes
  admin: '/admin',
  adminUsers: '/admin/users',
  adminAnalytics: '/admin/analytics',
  adminQuizzes: '/admin/quizzes',
  adminFlashcards: '/admin/flashcards',
  adminContent: '/admin/content',
  adminSettings: '/admin/settings',
  adminQuizManagement: '/admin/quiz-management',
  adminFlashcardDecks: '/admin/flashcard-decks',
  adminRankManager: '/admin/rank-manager',
} as const;

// Type representing all route values
export type AppRoute = Route<StaticRoute>

// Helper function to ensure type safety when using routes
export function createRoute<T extends AppRoute>(route: T): T {
  return route;
}

// Type guard to check if a string is a valid route
export function isValidRoute(route: string): route is StaticRoute {
  return Object.values(routes).includes(route as StaticRoute);
}

// Helper type for Next.js Link component href prop
export type LinkHref = AppRoute | string;
