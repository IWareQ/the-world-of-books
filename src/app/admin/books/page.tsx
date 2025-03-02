'use client'

import * as React from 'react'
import {useEffect, useState} from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {Separator} from '@/components/ui/separator'
import {SidebarTrigger} from '@/components/ui/sidebar'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Book} from '@/types/book'
import api from '@/lib/api'
import {z} from 'zod'
import {BookEditDialog, bookEditFormSchema} from '@/components/book-edit-dialog'

export default function Home() {
    const [books, setBooks] = useState<Book[]>([])
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)

    useEffect(() => {
        api.get(`/books`).then(response => {
            setBooks(response.data)
        }).catch(error => {
            console.error('Ошибка при загрузке книг:', error)
        })
    }, [])

    function handleDeleteBook(book: Book) {
        api.delete(`/books/${book.id}`).then(() => {
            setBooks(books.filter(b => b.id !== book.id))
        }).catch(error => console.log(error))
    }

    function handleEditBook(data: z.infer<typeof bookEditFormSchema>) {
        if (selectedBook) {
            // const formData = new FormData()
            // formData.append('file', data.image)
            // api.post('/files/upload', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // }).then(response => {
            //     const imageUrl = response.data.url
            //     api.put(`/genres/${selectedGenre.id}`, {
            //         name: data.name,
            //         imageUrl: imageUrl
            //     }).then(response => {
            //         setGenres(genres.map(genre => (genre.id === selectedGenre.id ? response.data : genre)))
            //         setSelectedGenre(null)
            //     }).catch(error => console.log(error))
            // })
        }
    }

    return (
        <>
            {selectedBook && (
                <BookEditDialog
                    book={selectedBook}
                    isOpen={Boolean(selectedBook)}
                    onClose={() => setSelectedBook(null)}
                    onSave={handleEditBook}
                />
            )}
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
                            <BreadcrumbPage>Книги</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className={'flex flex-1 flex-col gap-4 p-4'}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead className={'w-20'}>Название</TableHead>
                            <TableHead>Описание</TableHead>
                            <TableHead>Жанры</TableHead>
                            <TableHead>Авторы</TableHead>
                            <TableHead>Действие</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.map(book => (
                            <TableRow key={book.id}>
                                <TableCell>{book.id}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell className={'line-clamp-1'}>{book.description}</TableCell>
                                <TableCell>
                                    {book.genres.map(genre => {
                                        return <Badge key={genre.id} variant={'outline'}>{genre.name}</Badge>
                                    })}
                                </TableCell>
                                <TableCell className={'w-40'}>{book.authors.slice(0, 3).join(', ')}</TableCell>
                                <TableCell className={'flex gap-4'}>
                                    <Button variant={'outline'}
                                            onClick={() => handleDeleteBook(book)}>Удалить</Button>
                                    <Button variant={'outline'}
                                            onClick={() => setSelectedBook(book)}>Редактировать</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
