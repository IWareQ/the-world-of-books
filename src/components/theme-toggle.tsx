'use client'

import * as React from 'react'
import {Moon, Sun} from 'lucide-react'
import {useTheme} from 'next-themes'
import {Button} from '@/components/ui/button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu'

const THEMES = [
    {
        label: 'Светлая',
        value: 'light'
    },
    {
        label: 'Тёмная',
        value: 'dark'
    },
    {
        label: 'Системная',
        value: 'system'
    }
]

export function ThemeToggle() {
    const {setTheme} = useTheme()

    return (
        <div className={'fixed bottom-0 right-0 p-5'}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'outline'} size={'icon'}>
                        <Sun className={'h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'}/>
                        <Moon
                            className={'absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'}/>
                        <span className={'sr-only'}>Сменить тему</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={'end'}>
                    {THEMES.map(({label, value}) => (
                        <DropdownMenuItem key={label} onClick={() => setTheme(value)}>
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
