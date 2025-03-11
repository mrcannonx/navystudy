import { useAuth } from '@/contexts/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  loading?: React.ReactNode
}

export function AuthGuard({ children, loading }: AuthGuardProps) {
  const { user, loading: authLoading } = useAuth()

  // During any loading state, render nothing to prevent flash
  if (authLoading) {
    return null;
  }

  // Only show access denied when we're sure there's no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-500">Please sign in to take quizzes</p>
          <Link href="/auth" className="inline-block">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return children
}
