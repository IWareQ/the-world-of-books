'use client'

import {Container} from '@/components/container/container'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {useAuth} from '@/context/AuthContext'
import {Role} from '@/types/user'
import {useRouter} from 'next/navigation'
import {cn} from '@/lib/utils'
import {Menu, Search, User} from 'lucide-react'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import Image from 'next/image'
import {SearchDialog} from '@/components/search-dialog'
import * as React from 'react'
import {useEffect, useState} from 'react'
import api from '@/lib/api'
import {Book} from '@/types/book'
import {AuthDialog} from '@/components/auth-dialog'
import {Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTitle, DrawerTrigger} from '@/components/ui/drawer'
import {VisuallyHidden} from '@radix-ui/react-visually-hidden'

const NAVIGATION_MENU = [
    {name: 'Книги', href: '/books'},
    {name: 'Жанры', href: '/genres'}
]

type Props = {
    hasSearch?: boolean;
    className?: string;
};

export function Header({hasSearch = true, className}: Props) {
    const {session, logout} = useAuth()
    const router = useRouter()

    const [openSearchDialog, setOpenSearchDialog] = useState(false)
    const [openAuthDialog, setOpenAuthDialog] = useState(false)
    const [isRandomButtonLoading, setIsRandomButtonLoading] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.code === 'Slash' && !e.repeat) {
                e.preventDefault()
                setOpenSearchDialog((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const handleRandomBookClick = async () => {
        setIsRandomButtonLoading(true)
        api.get('/books/random').then(response => {
            const books = response.data as Book[]
            for (const book of books) {
                router.push(`/books/${book.slug}`)
            }
        }).catch(error => {
            console.error('Ошибка при загрузке случайной книги:', error)
        }).finally(() => setIsRandomButtonLoading(false))
    }
    return (
        <TooltipProvider delayDuration={0}>
            {hasSearch && <SearchDialog open={openSearchDialog} setOpen={setOpenSearchDialog}/>}
            <AuthDialog open={openAuthDialog} setOpen={setOpenAuthDialog}/>

            <header className={cn('sticky bg-zinc-100 dark:bg-black py-4 w-full', className)}>
                <Container className="flex items-center justify-between">
                    {/* Левая часть */}
                    <div className={'flex gap-10 items-center'}>
                        <Link href="/">
                            <div className="flex items-center gap-4">
                                <Image src="/logo.svg" alt="logo" width={48} height={48}/>
                                <div className={'max-sm:hidden'}>
                                    <h1 className="text-2xl uppercase font-black">Мир Книг</h1>
                                    <p className="text-sm text-zinc-400 leading-3">Читай сколько хочешь</p>
                                </div>
                            </div>
                        </Link>

                        <div className="hidden md:flex gap-10 items-center font-medium">
                            {NAVIGATION_MENU.map(nav => {
                                return <Link key={nav.name} href={nav.href}>{nav.name}</Link>
                            })}
                        </div>
                    </div>

                    {/* Правая часть */}
                    <div className="flex items-center gap-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    onClick={handleRandomBookClick}
                                    loading={isRandomButtonLoading}>
                                    <Image
                                        className={'dark:invert'}
                                        src={'/random.svg'}
                                        width={20}
                                        height={20}
                                        alt={'Случайная книга'}/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className={'bg-[#212121]'}>
                                <p className={'text-zinc-300'}>Случайная книга</p>
                            </TooltipContent>
                        </Tooltip>
                        {hasSearch && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={'outline'} onClick={() => setOpenSearchDialog(true)}>
                                        <Search size={20}/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className={'bg-[#212121]'}>
                                    <p className={'text-zinc-300'}>Поиск</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {!session && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={'outline'} onClick={() => setOpenAuthDialog(true)}>
                                        <User size={20}/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className={'bg-[#212121]'}>
                                    <p className={'text-zinc-300'}>Авторизация</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        <div className={'max-md:hidden flex gap-4'}>
                            {session && session.role === Role.ADMIN &&
                                <Button variant={'outline'}
                                        onClick={() => router.push('/admin/users')}>Админ-панель</Button>}
                            {session && <Button variant={'outline'} onClick={logout}>Выйти</Button>}
                        </div>

                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button variant={'outline'} className={'md:hidden'}>
                                    <Menu size={20}/>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <VisuallyHidden>
                                    <DrawerTitle></DrawerTitle>
                                </VisuallyHidden>
                                <DrawerFooter className={'p-4 flex flex-col gap-4'}>
                                    {NAVIGATION_MENU.map(nav => {
                                        return (
                                            <DrawerClose asChild key={nav.name}>
                                                <Link href={nav.href} className={'font-medium'}>
                                                    <Button variant={'secondary'} className={'w-full'}>
                                                        {nav.name}
                                                    </Button>
                                                </Link>
                                            </DrawerClose>
                                        )
                                    })}

                                    <DrawerClose asChild>
                                        {session && session.role === Role.ADMIN &&
                                            <Button variant={'secondary'}
                                                    onClick={() => router.push('/admin/users')}>Админ-панель</Button>}
                                    </DrawerClose>
                                    <DrawerClose asChild>
                                        {session && <Button variant={'secondary'} onClick={logout}>Выйти</Button>}
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </Container>
            </header>
        </TooltipProvider>
    )
}