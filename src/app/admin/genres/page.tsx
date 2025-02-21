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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Genre} from '@/types/book'
import api from '@/lib/api'
import {getQuantityString} from '@/lib/format-text'
import {z} from 'zod'
import {GenreEditDialog, genreEditFormSchema} from '@/components/genre-edit-dialog'

export default function Home() {
    const [genres, setGenres] = useState<Genre[]>([])
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)

    useEffect(() => {
        api.get(`/genres`).then(response => {
            setGenres(response.data)
        }).catch(error => {
            console.error('Ошибка при загрузке жанров:', error)
        })
    }, [])

    function handleDeleteGenre(genre: Genre) {
        api.delete(`/genres/${genre.id}`).then(() => {
            setGenres(genres.filter(g => g.id !== genre.id))
        }).catch(error => console.log(error))
    }

    function handleEditGenre(data: z.infer<typeof genreEditFormSchema>) {
        if (selectedGenre) {
            const formData = new FormData()
            formData.append('file', data.image)
            api.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                const imageUrl = response.data.url
                api.put(`/genres/${selectedGenre.id}`, {
                    name: data.name,
                    imageUrl: imageUrl
                }).then(response => {
                    setGenres(genres.map(genre => (genre.id === selectedGenre.id ? response.data : genre)))
                    setSelectedGenre(null)
                }).catch(error => console.log(error))
            })
        }
    }

    return (
        <SidebarProvider>
            {selectedGenre && (
                <GenreEditDialog
                    genre={selectedGenre}
                    isOpen={Boolean(selectedGenre)}
                    onClose={() => setSelectedGenre(null)}
                    onSave={handleEditGenre}
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
                                <BreadcrumbPage>Жанры</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className={'flex flex-1 flex-col gap-4 p-4'}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Картинка</TableHead>
                                <TableHead>Название</TableHead>
                                <TableHead>Кол-во книг</TableHead>
                                <TableHead>Действие</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {genres.map(genre => (
                                <TableRow key={genre.id}>
                                    <TableCell>{genre.id}</TableCell>
                                    <TableCell>
                                        <img
                                            className={'rounded-lg'}
                                            src={genre.imageUrl}
                                            alt={genre.name}
                                            height={78}
                                            width={78}/>
                                    </TableCell>
                                    <TableCell>{genre.name}</TableCell>
                                    <TableCell>{genre.totalBooks} {getQuantityString(genre.totalBooks, 'книга', 'книги', 'книг')}</TableCell>
                                    <TableCell className={'flex gap-4'}>
                                        <Button variant={'outline'}
                                                onClick={() => handleDeleteGenre(genre)}>Удалить</Button>
                                        <Button variant={'outline'}
                                                onClick={() => setSelectedGenre(genre)}>Редактировать</Button>
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
