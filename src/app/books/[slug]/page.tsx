'use client'

import * as React from 'react'
import {use, useEffect, useState} from 'react'
import {Header} from '@/components/header'
import {Footer} from '@/components/footer'
import Link from 'next/link'
import {Container} from '@/components/container/container'
import api from '@/lib/api'
import {Book, Comment} from '@/types/book'
import {BookCard} from '@/components/book-card'
import {Button} from '@/components/ui/button'
import {ReviewCard} from '@/components/review-card'
import {Badge} from '@/components/ui/badge'
import {notFound} from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import Image from 'next/image'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from '@/components/ui/form'
import {Textarea} from '@/components/ui/textarea'
import {getCurrentSession} from '@/lib/get-current-session'
import {useAuth} from '@/context/AuthContext'
import Cookies from 'js-cookie'

const commentFormSchema = z.object({
    text: z.string().min(10, {
        message: 'Комментарий должен быть не короче 10 символов.'
    }).max(1000, {
        message: 'Комментарий должен быть не длиннее 1000 символов.'
    })
})

export default function Page({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = use(params)
    const [error, setError] = useState(false)

    const [adultConfirmed, setAdultConfirmed] = useState(false)

    const {session, requireAuth} = useAuth()

    const [book, setBook] = useState<Book>()
    useEffect(() => {
        api.get(`/books/${slug}`).then(response => {
            setBook(response.data)

            setAdultConfirmed(!Cookies.get('adultConfirmed') && response.data.ageRestriction >= 18)
        }).catch(error => {
            setError(true)
            console.error('Ошибка при загрузке случайной книги:', error)
        })
    }, [])

    if (error) {
        return notFound()
    }

    const [randomBooks, setRandomBooks] = useState<Book[]>()
    useEffect(() => {
        api.get(`/books/random?limit=6`).then(response => {
            if (response.status === 200) {
                setRandomBooks(response.data)
            }
        })
    }, [])

    const [canComment, setCanComment] = useState(false)
    const [alreadyCommented, setAlreadyCommented] = useState(false)

    useEffect(() => {
        const session = getCurrentSession()
        if (!session) {
            setCanComment(false)
            return
        } else {
            setCanComment(true)
        }


        if (book) {
            setAlreadyCommented(book.comments.some(comment => comment.author.id === session.id))
        }
    }, [book])

    const [status, setStatus] = useState('Не читаю')

    const [isExpanded, setIsExpanded] = useState(false)

    const maxLength = 600
    // Обрезаем текст, если он длиннее maxLength и не развернут
    const displayText = isExpanded ? book?.description : book?.description.slice(0, maxLength)

    const commentForm = useForm<z.infer<typeof commentFormSchema>>({
        resolver: zodResolver(commentFormSchema)
    })

    function onSubmit(data: z.infer<typeof commentFormSchema>) {
        api.post(`/books/${slug}/comments`, {
            'userId': getCurrentSession()?.id,
            'text': data.text
        }).then(response => {
            if (response.status === 200) {
                setBook(response.data)
            }
        })
    }

    function handleEditCommentButton(comment: Comment) {
        setAlreadyCommented(false)
        setCanComment(true)
        commentForm.setValue('text', comment.text)
    }

    function handleDeleteCommentButton(comment: Comment) {
        api.delete(`/books/${slug}/comments/${comment.id}`).then(() => {
            setBook(prev => {
                if (prev) {
                    prev.comments = prev.comments.filter(comment => comment.id !== comment.id)
                }
                return prev
            })
            setAlreadyCommented(false)
            setCanComment(true)
            commentForm.setValue('text', '')
        })
    }

    return (
        <>
            <Header/>

            <AlertDialog open={adultConfirmed}>
                <AlertDialogContent className={'flex flex-col items-center max-md:max-w-sm'}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className={'flex justify-center'}>
                            <Image src={'/cake.svg'} alt={'cake'} width={128} height={128} className={'dark:invert'}/>
                        </AlertDialogTitle>
                        <AlertDialogDescription className={'font-bold text-xl text-center'}>
                            Подтвердите ваш возраст
                        </AlertDialogDescription>
                        <AlertDialogDescription className={'text-center'}>
                            Для обеспечения безопасного просмотра и соблюдения законодательства, мы требуем
                            подтверждения вашего возраста
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={''}>
                        <AlertDialogCancel onClick={() => {
                            Cookies.set('adultConfirmed', 'true', {expires: 7}) // 7 дней
                            setAdultConfirmed(false)
                        }} asChild>
                            <Button variant={'destructive'}>Мне есть 18</Button>
                        </AlertDialogCancel>
                        <Link href={'/'}>
                            <AlertDialogAction asChild>
                                <Button variant={'outline'}>Выйти</Button>
                            </AlertDialogAction>
                        </Link>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {book && (
                <>
                    <Container className={'md:flex mt-4 justify-between'}>
                        <div className="md:w-[70%]">
                            <Breadcrumb>
                                <BreadcrumbList className={'text-xs'}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">Главная страница</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator/>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/books">Книги</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator/>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage><b>{book.title}</b></BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>

                            <div className={'mt-4 md:flex gap-[15px]'}>
                                <div className={'max-md:flex max-md:justify-center'}>
                                    <img
                                        src={book.imageUrl}
                                        alt={book.title}
                                        className={'aspect-[7/10] rounded-xl h-[420px] max-md:h-full'}
                                    />
                                </div>

                                <div className={'self-end max-md:mt-4'}>
                                    <p className={'text-4xl font-bold'}>{book.title}</p>
                                    <p className={'text-xs text-zinc-500 mt-1'}>{book.authors.join(', ')}</p>

                                    <Badge variant={'outline'} className={'py-[0.3rem] rounded-sm mt-3'}>
                                        {book.ageRestriction}+
                                    </Badge>

                                    <div className={'text-zinc-500 mt-3'}>
                                        <p className={'text-[14px]'}>
                                            Жанры:{' '}
                                            <b>{book.genres.map(genre => genre.name).join(' • ')}</b>
                                        </p>
                                        <p className={'text-[14px]'}>Год
                                            выхода: <b>{new Date(book.publicationDate).getFullYear()}</b></p>
                                        <p className={'text-[14px]'}>Количество страниц: <b>{book.pages}</b></p>
                                    </div>

                                    <div className={'mt-3 flex gap-2'}>
                                        {session ? (
                                            <Link href={`/read/${book.slug}`}>
                                                <Button variant="secondary">
                                                    <ReadSvg/>Читать
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button variant="secondary" onClick={() => requireAuth()}>
                                                <ReadSvg/>Читать
                                            </Button>
                                        )}

                                        {/*<Button variant="outline">
                                            <Star size={43}/>
                                        </Button>*/}

                                        {/*<DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant={status === 'Не читаю' ? 'outline' : 'secondary'}>{status}</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuGroup>
                                                    {['Не читаю', 'Читаю', 'Запланировано', 'Прочитано', 'Отложено', 'Брошено'].map(status => {
                                                        return (
                                                            <DropdownMenuItem key={status}
                                                                              onClick={() => setStatus(status)}>
                                                                {status}
                                                            </DropdownMenuItem>
                                                        )
                                                    })}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>*/}
                                    </div>
                                </div>
                            </div>

                            <div className={'mt-4'}>
                                <p>
                                    {displayText}
                                    {book.description.length > maxLength && !isExpanded && '...'}
                                </p>
                                {book.description.length > maxLength && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-zinc-400 hover-underline"
                                    >
                                        {isExpanded ? 'Свернуть' : 'Развернуть'}
                                    </button>
                                )}
                            </div>

                            <div>
                                <div className={'flex items-center gap-2 pt-5'}>
                                    <h1 className="text-[22px] font-extrabold">Впечатления</h1>
                                    <h1 className="text-[22px] font-extrabold text-[#747272]">{book.comments.length}</h1>
                                </div>

                                <div className={'flex flex-col gap-4 mt-4 mb-4'}>
                                    {!alreadyCommented && (
                                        <div className={'bg-footer p-4 rounded-lg'}>
                                            <Form {...commentForm}>
                                                <form onSubmit={commentForm.handleSubmit(onSubmit)}
                                                      className="space-y-4">
                                                    <FormField
                                                        control={commentForm.control}
                                                        name={'text'}
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder={canComment ? 'Напишите пару слов' : 'Только авторизованные пользователи могут оставлять комментарии'}
                                                                        className={'resize-none w-full h-[150px]'}
                                                                        disabled={!canComment}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Вы можете рассказать о своем впечатлении о книге
                                                                </FormDescription>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type={'submit'} disabled={!canComment}>Опубликовать</Button>
                                                </form>
                                            </Form>
                                        </div>
                                    )}
                                    {book.comments.map(comment => {
                                        return <ReviewCard
                                            key={comment.id}
                                            comment={comment}
                                            onClickEditMessageButton={() => handleEditCommentButton(comment)}
                                            onClickDeleteMessageButton={() => handleDeleteCommentButton(comment)}
                                        />
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="md:w-[25%] max-md:pb-4">
                            <p className={'dark:text-white/[0.7] font-bold'}>Рекомендуем</p>
                            <p className={'text-zinc-400 text-xs'}>Релизы, которые вам могут понравиться</p>

                            <div className={'grid grid-cols-2 gap-3 mt-4'}>
                                {randomBooks?.map(book => {
                                    return <BookCard key={book.id} book={book}/>
                                })}
                            </div>
                        </div>
                    </Container>

                    <Footer/>
                </>
            )}
        </>
    )
}

function ReadSvg() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
            <path fill="currentColor"
                  d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32M324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3l6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39m563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5l48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5m223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5M396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5m416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5"></path>
        </svg>
    )
}