import * as React from 'react'
import {ComponentProps} from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from '@/components/ui/sidebar'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import Image from 'next/image'
import {Button} from '@/components/ui/button'

const data = [
    {
        title: 'Пользователи',
        href: '/users'
    },
    {
        title: 'Книги',
        href: '/books'
    },
    {
        title: 'Жанры',
        href: '/genres'
    }
]

export function AppSidebar({...props}: ComponentProps<typeof Sidebar>) {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <Sidebar {...props}>
            <SidebarHeader className={'flex flex-row items-center justify-center mt-2'}>
                <p className={'font-bold'}>Админ-панель</p>
                <Button variant={'outline'} onClick={() => router.replace('/')}>
                    <Image
                        className={'dark:invert'}
                        src="/exit.svg"
                        width={24}
                        height={24}
                        alt={'exit'}/>
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === `/admin${item.href}`}>
                                        <Link href={`/admin/${item.href}`}>{item.title}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
