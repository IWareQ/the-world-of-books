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
import {Genre} from '@/types/book'
import api from '@/lib/api'
import {GenreCard} from '@/components/genre-card'

export default function Home() {
    const [genres, setGenres] = useState<Genre[]>()
    useEffect(() => {
        api.get(`/genres`).then(response => {
            setGenres(response.data)
        }).catch(error => {
            console.error('Ошибка при загрузке жанров:', error)
        })
    }, [])

    return (
        <>
            <Header/>

            <div className="flex-1 pb-4">
                {genres && (
                    <Container className="mt-4">
                        <Breadcrumb>
                            <BreadcrumbList className={'text-xs'}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">Главная страница</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Жанры</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="mt-4">
                            <div>
                                <p className={'text-xl font-bold'}>Жанры</p>
                                <p className={'text-zinc-400 text-sm'}>Список жанров на любой вкус и цвет</p>
                            </div>
                            <div className="grid grid-cols-6 max-sm:grid-cols-2 max-xl:grid-cols-4 gap-4 mt-4">
                                {genres && genres.map(genre => {
                                    return <GenreCard key={genre.slug} genre={genre}/>
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
