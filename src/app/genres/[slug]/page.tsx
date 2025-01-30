'use client'

import * as React from 'react'
import {use, useEffect, useState} from 'react'
import {Header} from '@/components/header'
import {Footer} from '@/components/footer'
import {Container} from '@/components/container/container'
import api from '@/lib/api'
import {Book, Genre} from '@/types/book'
import {notFound} from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {BookCard} from '@/components/book-card'
import {getQuantityString} from '@/lib/format-text'

export default function GenrePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = use(params)
    const [error, setError] = useState(false)

    const [genre, setGenre] = useState<Genre>()
    useEffect(() => {
        api.get(`/genres/${slug}`).then(response => {
            setGenre(response.data)
        }).catch(error => {
            setError(true)
            console.error('Ошибка при загрузке жанра:', error)
        })
    }, [])

    const [books, setBooks] = useState<Book[]>()
    useEffect(() => {
        api.get(`/genres/${slug}/books`).then(response => {
            setBooks(response.data)
        }).catch(error => {
            setError(true)
            console.error('Ошибка при загрузке книг жанра:', error)
        })
    }, [setGenre])

    if (error) {
        return notFound()
    }

    return (
        <>
            <Header/>

            <div className="flex-1 pb-4">
                {genre && (
                    <Container className="mt-4">
                        <Breadcrumb>
                            <BreadcrumbList className={'text-xs'}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Главная страница</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/genres">Жанры</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage><b>{genre.name}</b></BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="mt-4">
                            <div>
                                <p className={'text-xl font-bold'}>Книги жанра</p>
                                <p className={'text-zinc-400 text-sm'}>Список книг выбранного жанра</p>
                            </div>
                            <div className={'bg-footer p-4 rounded-md flex gap-4 items-center mt-4'}>
                                <img
                                    src={genre.imageUrl}
                                    alt={genre.name}
                                    className="w-[75px] h-[75px] overflow-hidden object-cover flex-shrink-0 rounded-sm"/>
                                <div>
                                    <p className={'text-xl font-medium'}>{genre.name}</p>
                                    <p className={'text-sm text-zinc-400'}>{genre.totalBooks} {getQuantityString(genre.totalBooks, 'книга', 'книги', 'книг')}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-6 max-sm:grid-cols-2 max-xl:grid-cols-4 gap-4 mt-4">
                                {books && books.map(book => {
                                    return <BookCard key={book.slug} book={book}/>
                                })}
                            </div>
                        </div>
                    </Container>
                )}
            </div>

            <Footer/>
        </>
    )
}