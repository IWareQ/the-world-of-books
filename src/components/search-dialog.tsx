'use client'

import * as React from 'react'
import {useState} from 'react'
import {Badge} from '@/components/ui/badge'
import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {useDebounce} from 'react-use'
import api from '@/lib/api'
import {Book} from '@/types/book'
import Link from 'next/link'
import {VisuallyHidden} from '@radix-ui/react-visually-hidden'

type Props = {
    open: boolean
    setOpen(open: boolean): void;
}

export function SearchDialog({open, setOpen}: Props) {
    const [searchQuery, setSearchQuery] = useState('')
    const [books, setBooks] = useState<Book[]>([])

    useDebounce(async () => {
        if (!searchQuery) {
            setBooks([])
            return
        }

        api.get(`/books?search=${searchQuery}`).then(response => {
            if (response.status === 200) {
                setBooks(response.data)
            } else {
                setBooks([])
            }
        })
    }, 300, [searchQuery])

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={'h-[70%] flex flex-col max-md:max-w-sm rounded-md'}>
                    <VisuallyHidden>
                        <DialogTitle>Для скринридеров</DialogTitle>
                    </VisuallyHidden>

                    <Input
                        placeholder={'Введите название книги...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}/>

                    {books.length === 0 && (
                        <div className={'flex-1 text-sm text-center content-center'}>
                            <p className={''}>Введите название книги</p>
                            <p>Результаты вашего поиска появятся здесь</p>
                        </div>
                    )}

                    {books.length > 0 && (
                        <div className="flex-1 w-full overflow-y-auto">
                            {books.map((book, index) => {
                                return (
                                    <Link key={book.slug} href={'/books/' + book.slug}>
                                        <div className={'flex items-center hover:bg-black/10 rounded-md'}>
                                            <div className={'h-max w-[4rem] flex-shrink-0 overflow-hidden'}>
                                                <img
                                                    src={book.imageUrl}
                                                    alt={book.title}
                                                    className={'w-full h-full object-cover rounded-md'}/>
                                            </div>
                                            <div className={'ml-4'}>
                                                <p className={'line-clamp-1'}>{book.title}</p>
                                                <p className={'text-sm text-zinc-500 line-clamp-1'}>{book.authors.join(', ')}</p>
                                                <p className={'text-sm text-zinc-500'}>{new Date(book.publicationDate).getFullYear()} • {book.ageRestriction}+</p>
                                            </div>
                                        </div>
                                        {index !== books.length - 1 && <hr className="my-4 bg-white"/>}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    <div className={'text-xs text-zinc-400 text-center'}>
                        <span>
                            Данное поисковое окно можно вызывать в любое время клавишей{' '}
                            <Badge variant={'outline'}>/</Badge>
                        </span>
                        <br/>
                        <span>
                            Чтобы закрыть поиск, вы можете нажать{' '}
                            <Badge variant={'outline'}>Esc</Badge>
                        </span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}