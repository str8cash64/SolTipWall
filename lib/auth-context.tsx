'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  twitterHandle: string
  avatar?: string
  hasCompletedOnboarding?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => void
  isLoading: boolean
  completeOnboarding: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('tipwall_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async () => {
    setIsLoading(true)
    
    // Simulate Twitter OAuth flow with a delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock user data - in real app this would come from Twitter API
    const mockUser: User = {
      id: 'user-1',
      twitterHandle: '@IvySolana',
      avatar: undefined,
      hasCompletedOnboarding: false // New users haven't completed onboarding
    }
    
    setUser(mockUser)
    localStorage.setItem('tipwall_user', JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tipwall_user')
  }

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasCompletedOnboarding: true }
      setUser(updatedUser)
      localStorage.setItem('tipwall_user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    completeOnboarding
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
