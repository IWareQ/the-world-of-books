'use client'

import {usePathname, useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'

export default function NotFound() {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-8xl font-bold">404</p>
                <p className={'pt-4 text-zinc-400 font-bold'}>Страница не найдена: {pathname}</p>

                <div className={'flex gap-2 pt-4'}>
                    <Button variant={'secondary'} onClick={() => router.back()}>Назад</Button>
                    <Button variant={'secondary'} onClick={() => router.push('/')}>На главную</Button>
                </div>

                <div className={'absolute bottom-0 pb-4 text-zinc-400 text-sm text-center'}>
                    <p>Весь материал на сайте представлен исключительно для домашнего ознакомительного просмотра</p>
                    <p>
                        В случаях нарушения авторских прав - обращайтесь на почту:{' '}
                        <b className={'text-zinc-400 hover-underline'}>copyrights@test.com</b>
                    </p>
                    <p>
                        Для связи с нами по вопросам рекламы и сотрудничества:{' '}
                        <b className={'text-zinc-400 hover-underline'}>contact@test.com</b>
                    </p>
                </div>
            </div>
        </>
    )
}