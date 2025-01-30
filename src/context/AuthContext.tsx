'use client'

import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {CurrentSession, getCurrentSession, setCurrentSession} from '@/lib/get-current-session'

interface AuthContextProps {
    session: CurrentSession | null;
    setSession: (session: CurrentSession | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({children}: { children: ReactNode }) {
    const [session, setSession] = useState<CurrentSession | null>(null)

    useEffect(() => {
        setSession(getCurrentSession())
    }, [])

    const logout = () => {
        setCurrentSession(null)
        setSession(null)
        window.location.reload()
    }

    return (
        <AuthContext.Provider value={{session, setSession, logout}}>
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
