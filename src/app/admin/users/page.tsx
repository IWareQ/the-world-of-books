'use client'

import * as React from 'react'
import {useEffect, useState} from 'react'
import {AppSidebar} from '@/components/app-sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {Separator} from '@/components/ui/separator'
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import api from '@/lib/api'
import {Role, User} from '@/types/user'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {useAuth} from '@/context/AuthContext'
import {z} from 'zod'
import {UserEditDialog, userEditFormSchema} from '@/components/user-edit-dialog'

export default function Home() {
    const {session} = useAuth()

    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    useEffect(() => {
        api.get('/users').then(response => {
            setUsers(response.data)
        }).catch(error => console.log(error))
    }, [])

    function formatDate(date: string) {
        const formatter = new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        return formatter.format(new Date(date))

    }

    function handleDeleteUser(user: User) {
        api.delete(`/users/${user.id}`).then(() => {
            setUsers(users.filter(u => u.id !== user.id))
        }).catch(error => console.log(error))

    }

    function handleEditUser(data: z.infer<typeof userEditFormSchema>) {
        if (selectedUser) {
            api.put(`/users/${selectedUser.id}`, data).then(response => {
                setUsers(users.map(user => (user.id === selectedUser.id ? response.data : user)))
                setSelectedUser(null)
            }).catch(error => console.log(error))
        }
    }

    return (
        <SidebarProvider>
            {selectedUser && (
                <UserEditDialog
                    user={selectedUser}
                    isOpen={Boolean(selectedUser)}
                    onClose={() => setSelectedUser(null)}
                    onSave={handleEditUser}
                />
            )}

            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={''}>Админ-панель</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Пользователи</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className={'flex flex-1 flex-col gap-4 p-4'}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Имя пользователя</TableHead>
                                <TableHead>Почта</TableHead>
                                <TableHead>Роль</TableHead>
                                <TableHead>Дата создания</TableHead>
                                <TableHead>Дата обновления</TableHead>
                                <TableHead>Действие</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === Role.ADMIN ? 'destructive' : 'outline'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell>{formatDate(user.updatedAt)}</TableCell>
                                    <TableCell className={'flex gap-4'}>
                                        <Button variant={'outline'} disabled={session?.id === user.id}
                                                onClick={() => handleDeleteUser(user)}>Удалить</Button>
                                        <Button variant={'outline'}
                                                onClick={() => setSelectedUser(user)}>Редактировать</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
