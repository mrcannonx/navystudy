import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SUBSCRIPTION_STATUS } from './lib/stripe';

// Define protected routes that require subscription
const PROTECTED_ROUTES = [
  // Add your protected routes here
  '/dashboard',
  '/profile',
  '/settings',
  '/flashcards',
  '/quiz',
  '/summarizer',
  '/eval-template-builder',
  '/award-points-calculator',
  '/fms-calculator',
  '/pma-calculator',
  '/navadmin-viewer',
];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/signup',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
  '/api/stripe/webhooks',
];

// Define routes that require authentication but not subscription
const AUTH_ROUTES = [
  '/settings/subscription',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Allow API routes except those that need protection
  if (pathname.startsWith('/api') && !pathname.includes('/api/protected')) {
    return NextResponse.next();
  }
  
  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  
  // If it's not a protected or auth route, allow access
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }
  
  try {
    // Check if Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not set. Skipping auth check in middleware.');
      return NextResponse.next();
    }
    
    // Get the user token from the cookie
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );
    
    // Get the session from the request cookie
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    
    // If it's an auth route, allow access
    if (isAuthRoute) {
      return NextResponse.next();
    }
    
    // For logged-in users, allow access to all routes regardless of subscription status
    // We're removing the subscription check to enable navigation for all authenticated users
    
  } catch (error) {
    console.error('Error in middleware:', error);
    // In case of error, allow access (better user experience than blocking everything)
    return NextResponse.next();
  }
  
  // Allow access to protected route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
