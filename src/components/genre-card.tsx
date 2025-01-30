import * as React from 'react'
import {Genre} from '@/types/book'
import Link from 'next/link'
import {getQuantityString} from '@/lib/format-text'

type Props = {
    genre: Genre
};

export function GenreCard({genre}: Props) {
    return (
        <div className="relative overflow-hidden group rounded-lg justify-center">
            <Link href={`/genres/${genre.slug}`}>
                <img
                    className="w-full h-full"
                    src={genre.imageUrl}
                    alt={genre.name}/>
                <div
                    className="w-full h-full absolute inset-0 hover:bg-black/60 duration-300 flex flex-col items-center justify-center">
                    <div className={'mt-auto mb-3 text-center'}>
                        <p className={'font-bold'}>{genre.name}</p>
                        <p className="text-sm text-zinc-200">{genre.totalBooks} {getQuantityString(genre.totalBooks, 'книга', 'книги', 'книг')}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}