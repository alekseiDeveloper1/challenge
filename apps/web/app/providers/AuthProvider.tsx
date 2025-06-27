'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '../lib/auth';
interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API_URL is not defined");
    const login = async (email: string, password: string) => {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error('Login failed')
        }

        router.push('/profile')
    }

    const register = async (email: string, password: string, name: string) => {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error('Registration failed')
        }

        const userData = await response.json()
        setUser(userData)
        router.push('/auth/login')
    }

    const refreshToken = async () => {
        try {
            const response = await fetch(`${apiUrl}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Token refresh failed')
            }
        } catch (error) {
            console.error('Failed refresh', error)
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, login, register, refreshToken }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}