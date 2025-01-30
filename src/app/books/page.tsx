'use client'

import {Footer} from '@/components/footer'
import {Container} from '@/components/container/container'
import {Header} from '@/components/header'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {Book} from '@/types/book'
import api from '@/lib/api'
import {BookCard} from '@/components/book-card'

export default function Home() {
    const [books, setBooks] = useState<Book[]>()
    useEffect(() => {
        api.get(`/books?limit=9999999999`).then(response => {
            setBooks(response.data)
        }).catch(error => {
            console.error('Ошибка при загрузке жанров:', error)
        })
    }, [])

    return (
        <>
            <Header/>

            <div className="flex-1 pb-4">
                {books && (
                    <Container className="mt-4">
                        <Breadcrumb>
                            <BreadcrumbList className={'text-xs'}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Главная страница</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Книги</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="mt-4">
                            <div>
                                <p className={'text-xl font-bold'}>Книги</p>
                                <p className={'text-zinc-400 text-sm'}>Список всех книг</p>
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
