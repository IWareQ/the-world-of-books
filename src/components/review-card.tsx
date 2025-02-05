import * as React from 'react'
import Image from 'next/image'
import {getQuantityString} from '@/lib/format-text'
import {Comment} from '@/types/book'
import {Button} from '@/components/ui/button'
import {getCurrentSession} from '@/lib/get-current-session'
import {Edit, Trash} from 'lucide-react'

type Props = {
    comment: Comment
    onClickEditMessageButton: () => void
    onClickDeleteMessageButton: () => void
};

export function ReviewCard({comment, onClickEditMessageButton, onClickDeleteMessageButton}: Props) {
    const timeAgo = getTimeAgo(new Date(comment.createdAt))
    return (
        <>
            <div className={'bg-footer rounded-md p-4'}>
                <div className={'flex items-center justify-between'}>
                    {/*User info*/}
                    <div className={'flex gap-4'}>
                        <img
                            loading="lazy"
                            src={'https://placehold.co/10000x10000'}
                            alt={comment.author.username}
                            className="object-cover w-11 rounded-full"/>
                        <div>
                            <p>{comment.author.username}</p>
                            <p className="text-sm text-zinc-400">{timeAgo}</p>
                        </div>
                    </div>

                    {comment.author.id === getCurrentSession()?.id && (
                        <>
                            <div className={'flex gap-4'}>
                                <Button onClick={onClickEditMessageButton} variant={'outline'}><Edit/></Button>
                                <Button onClick={onClickDeleteMessageButton} variant={'outline'}><Trash/></Button>
                            </div>
                        </>
                    )}
                </div>

                <div className={'mt-4'}>
                    <p>{comment.text}</p>
                </div>

                <div className={'flex items-center justify-between pt-4'}>
                    <div className={'flex items-center gap-4'}>
                        <div className={'flex items-center gap-2'}>
                            <Image className={'dark:invert'} src={'/like.svg'} alt={'like'} height={16} width={16}/>
                            <p>{comment.likes}</p>
                        </div>
                        <div className={'flex gap-2'}>
                            <Image className={'dark:invert'} src={'/dislike.svg'} alt={'dislike'} height={16}
                                   width={16}/>
                            <p>{comment.dislikes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

interface TimeUnit {
    milliseconds: number
    one: string
    few: string
    many: string
}

function getTimeAgo(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const TIME_UNITS: TimeUnit[] = [
        {
            milliseconds: 1000, // 1 секунда
            one: 'секунду', few: 'секунды', many: 'секунд'
        },
        {
            milliseconds: 60 * 1000, // 1 минута
            one: 'минуту', few: 'минуты', many: 'минут'
        },
        {
            milliseconds: 60 * 60 * 1000, // 1 час
            one: 'час', few: 'часа', many: 'часов'
        },
        {
            milliseconds: 24 * 60 * 60 * 1000, // 1 день
            one: 'день', few: 'дня', many: 'дней'
        },
        {
            milliseconds: 7 * 24 * 60 * 60 * 1000, // 1 неделя
            one: 'неделю', few: 'недели', many: 'недель'
        },
        {
            milliseconds: 30 * 24 * 60 * 60 * 1000, // ~1 месяц
            one: 'месяц', few: 'месяца', many: 'месяцев'
        },
        {
            milliseconds: 365 * 24 * 60 * 60 * 1000, // ~1 год
            one: 'год', few: 'года', many: 'лет'
        }
    ]

    if (diff < 0) return 'В будущем'

    for (let i = TIME_UNITS.length - 1; i >= 0; i--) {
        const unit = TIME_UNITS[i]
        const value = Math.floor(diff / unit.milliseconds)

        if (value >= 1) {
            return `${value} ${getQuantityString(value, unit.one, unit.few, unit.many)} назад`
        }
    }

    return 'Только что'
}