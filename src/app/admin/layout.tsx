'use client'

import React, {useEffect} from 'react'
import {useAuth} from '@/context/AuthContext'
import {notFound} from 'next/navigation'
import {Role} from '@/types/user'
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar'
import {AppSidebar} from '@/components/app-sidebar'

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {session, setSession} = useAuth()
    useEffect(() => {
        if (session && session.role !== Role.ADMIN) {
            return notFound()
        }
    }, [session, setSession])

    if (!session) {
        return null
    }

    return (
        <main className="min-h-screen">
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}
