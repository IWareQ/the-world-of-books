import type {Metadata} from 'next'
import {Montserrat} from 'next/font/google'
import './globals.css'
import {ReactNode} from 'react'
import {ThemeToggle} from '@/components/theme-toggle'
import {AuthProvider} from '@/context/AuthContext'
import {ThemeProvider} from 'next-themes'

const montserrat = Montserrat({
    subsets: ['latin', 'cyrillic'], // Подгружаем латинский и кириллический алфавит
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Все доступные веса
    variable: '--font-montserrat' // для использования в CSS
})

export const metadata: Metadata = {
    title: 'Мир книг | Главная',
    description: 'Читай сколько хочешь'
}

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title></title>
        </head>
        <body className={`${montserrat.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange={true}
            enableColorScheme={true}>
            <ThemeToggle/>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
