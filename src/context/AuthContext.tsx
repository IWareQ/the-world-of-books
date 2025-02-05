'use client'

import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {CurrentSession, getCurrentSession, setCurrentSession} from '@/lib/get-current-session'
import {useAuthDialogStore} from '@/store/AuthDialogStore'

type AuthContext = {
    session: CurrentSession | null
    setSession: (session: CurrentSession | null) => void
    logout: () => void
    requireAuth: () => void
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({children}: { children: ReactNode }) {
    const [session, setSession] = useState<CurrentSession | null>(null)
    const openDialog = useAuthDialogStore((state) => state.openDialog)

    useEffect(() => {
        setSession(getCurrentSession())
    }, [])

    const logout = () => {
        setCurrentSession(null)
        setSession(null)
        window.location.reload()
    }

    const requireAuth = () => {
        if (!session) {
            openDialog()
        }
    }

    return (
        <AuthContext.Provider value={{session, setSession, logout, requireAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}
