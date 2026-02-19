'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthContextType {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Safety timeout — if Firebase doesn't respond in 5s, stop hanging the UI
        const timeout = setTimeout(() => {
            setLoading(false)
        }, 5000)

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            clearTimeout(timeout)
            setUser(firebaseUser)
            setLoading(false)
        })
        return () => {
            clearTimeout(timeout)
            unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
