'use client'

import {Book} from '@/types/book'
import * as React from 'react'
import Link from 'next/link'

export type Props = {
    book: Book
};

export function BookCard({book}: Props) {
    return (
        <div className="relative overflow-hidden group justify-center rounded-lg">
            <Link href={`/books/${book.slug}`}>
                <img className="w-full h-full object-cover flex-shrink-0 rounded-sm"
                     src={book.imageUrl}
                     alt={book.title}/>
                <div
                    className="rounded-sm absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <p className="text-white text-[clamp(1px, 2px, 20px)] text-center mt-auto">{book.title}</p>
                    <p className="text-zinc-400 mt-auto mb-3">{new Date(book.publicationDate).getFullYear()} • {book.ageRestriction}+</p>
                </div>
            </Link>
        </div>
    )
}
