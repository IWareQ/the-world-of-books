import {Comment} from '@/types/book'

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export type User = {
    id: number,
    username: string,
    email: string,
    role: Role
    comments: Comment[]
    createdAt: string
    updatedAt: string
}