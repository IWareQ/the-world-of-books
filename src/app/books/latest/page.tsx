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
    const [latestBooks, setLatestBooks] = useState<Book[]>()
    useEffect(() => {
        api.get('/books/latest?limit=999999999').then(response => {
            const books = response.data as Book[]
            setLatestBooks(books.sort((a, b) => {
                if (a.publicationDate > b.publicationDate) return -1
                if (a.publicationDate < b.publicationDate) return 1
                return 0
            }))
        }).catch(error => console.log(error))
    }, [])
    return (
        <>
            <Header/>

            <div className="flex-1 pb-4">
                {latestBooks && (
                    <Container className="mt-4">
                        <Breadcrumb>
                            <BreadcrumbList className={'text-xs'}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Главная страница</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Новые книги</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="mt-4">
                            <div>
                                <p className={'text-xl font-bold'}>Новые книги</p>
                                <p className={'text-zinc-400 text-sm'}>Самые новые и свежие книги на любимом сайте</p>
                            </div>
                            <div className="grid grid-cols-6 max-sm:grid-cols-2 max-xl:grid-cols-4 gap-4 mt-4">
                                {latestBooks.map(book => {
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
