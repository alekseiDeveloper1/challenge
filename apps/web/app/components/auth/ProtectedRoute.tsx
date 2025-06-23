'use client'

import { useEffect } from 'react'
import { useAuth } from '../../providers/AuthProvider'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { refreshToken } = useAuth()

  useEffect(() => {
    // Refresh token periodically
    const interval = setInterval(() => {
      refreshToken()
    }, 50 * 60 * 1000) // 10 minutes

    return () => clearInterval(interval)
  }, [refreshToken])

  return <>{children}</>
}