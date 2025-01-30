import {User} from '@/types/user'

export type Genre = {
    id: number
    name: string
    slug: string
    totalBooks: number
    imageUrl: string
}

export type Comment = {
    id: number
    author: User
    book: Book
    text: string
    likes: number
    dislikes: number
    createdAt: string
}

export type DiscussedBook = {
    book: Book
    commentCount: number
}

export type Book = {
    id: number

    title: string
    slug: string
    description: string

    genres: Genre[]
    authors: string[]
    comments: Comment[]

    publicationDate: number
    pages: number
    ageRestriction: number
    imageUrl: string
    bookUrl: string
};