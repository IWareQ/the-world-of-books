'use client'

import {Footer} from '@/components/footer'
import {Container} from '@/components/container/container'
import {Header} from '@/components/header'
import {ChevronRight} from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import {useEffect, useState} from 'react'
import api from '@/lib/api'
import {Book, DiscussedBook, Genre} from '@/types/book'
import {GenreCard} from '@/components/genre-card'
import {BookCard} from '@/components/book-card'
import {getQuantityString} from '@/lib/format-text'
import {shuffle} from '@/lib/utils'

export default function Home() {
    const [latestBooks, setLatestBooks] = useState<Book[]>()
    const [discussedBooks, setDiscussedBooks] = useState<DiscussedBook[]>()

    useEffect(() => {
        api.get('/books/latest?limit=6').then(response => {
            const books = response.data as Book[]
            setLatestBooks(books.sort((a, b) => b.publicationDate - a.publicationDate))
        }).catch(error => console.log(error))

        api.get('/books/discussed').then(response => {
            setDiscussedBooks(response.data)
        }).catch(error => console.log(error))
    }, [])

    const [genres, setGenres] = useState<Genre[]>()

    useEffect(() => {
        api.get('/genres').then(response => {
            setGenres(shuffle(response.data))
        }).catch(error => console.log(error))
    }, [])
    return (
        <>
            <Header/>

            <div className="flex-1 pb-4 mt-4">
                <Container>
                    <div>
                        <Link href="/books/latest" className={'flex text-xl font-bold items-center max-w-max'}>
                            <p>Новые книги</p>
                            <ChevronRight size={18}/>
                        </Link>
                        <p className={'text-zinc-400 text-sm'}>Самые новые и свежие книги на любимом сайте</p>
                    </div>
                    <div className="grid grid-cols-6 max-sm:grid-cols-2 max-xl:grid-cols-4 gap-4 mt-4">
                        {latestBooks && latestBooks.map(book => {
                            return <BookCard key={book.slug} book={book}/>
                        })}
                    </div>
                </Container>

                {discussedBooks && discussedBooks.length === 3 && (
                    <Container className="mt-6">
                        <div>
                            <p className={'text-xl font-bold'}>Обсуждаемое сегодня</p>
                            <p className={'text-zinc-400 text-sm'}>Обсуждаемые книги дня</p>
                        </div>
                        <div className="flex max-md:flex-col gap-4 mt-4">
                            {discussedBooks.map(({book, commentCount}) => {
                                return (
                                    <Link
                                        key={book.slug}
                                        href={`/books/${book.slug}`}
                                        className={'bg-footer flex overflow-hidden justify-center rounded-lg h-[200px] w-full'}>
                                        <img
                                            className="h-full object-cover flex-shrink-0"
                                            src={book.imageUrl}
                                            alt={book.title}/>
                                        <div className={'flex-1 flex flex-col p-4 justify-between'}>
                                            <div className={'flex-1'}>
                                                <p className={'text-sm'}>{book.title}</p>
                                                <p className={'line-clamp-1 text-xs text-zinc-500'}>{book.authors.join(', ')}</p>
                                            </div>
                                            <div className={'text-xs text-zinc-400 flex flex-col gap-1'}>
                                                <p>
                                                    <b>{book.pages}</b>{' '}{getQuantityString(book.pages, 'страниц', 'страницы', 'страниц')}
                                                </p>
                                                <div
                                                    className={'bg-black/20 text-zinc-500 p-1 rounded-lg max-w-max px-2'}>
                                                    <b>{commentCount} {getQuantityString(commentCount, 'комментарий', 'комментария', 'комментариев')}</b>{' '}за
                                                    сутки
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </Container>
                )}

                <Container className="mt-6">
                    <div className={'bg-footer h-[180px] rounded-md text-center content-center'}>
                        <p className={'text-zinc-400 text-sm'}>Здесь может быть Ваш рекламный блок</p>
                        <p className={'text-zinc-400 text-sm'}>
                            По всем вопросам:{' '}
                            <b className={'text-zinc-400 hover-underline'}>contact@example.com</b>
                        </p>
                    </div>
                </Container>

                <Container className="mt-6">
                    <div>
                        <Link href="/genres" className={'flex text-xl font-bold items-center max-w-max'}>
                            <p>Жанры</p>
                            <ChevronRight size={18}/>
                        </Link>
                        <p className={'text-zinc-400 text-sm'}>Список жанров на любой вкус и цвет</p>
                    </div>
                    <div className="grid grid-cols-6 max-sm:grid-cols-2 max-xl:grid-cols-4 gap-4 mt-4">
                        {genres && genres.slice(0, 6).map(genre => {
                            return <GenreCard key={genre.slug} genre={genre}/>
                        })}
                    </div>
                </Container>
            </div>

            <Footer/>
        </>
    )
}
