'use client'

import React, {use, useEffect, useState} from 'react'
import api from '@/lib/api'
import {ReactReader} from 'react-reader'

export default function Home({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = use(params)

    const [epubUrl, setEpubUrl] = useState('')
    useEffect(() => {
        api.get(`/books/${slug}`).then(response => {
            if (response.status === 200) {
                setEpubUrl(response.data.bookUrl)
            }
        })
    }, [])

    const [location, setLocation] = useState<string | number>(0)
    return (
        <div>
            <div className={'h-screen'}>
                <ReactReader
                    url={epubUrl}
                    location={location}
                    locationChanged={(epubcfi: string) => setLocation(epubcfi)}
                />
            </div>
        </div>
    )
}
