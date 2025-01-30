import {Container} from '@/components/container/container'
import {Button} from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const NAVIGATION_PANEL = [
    {
        name: 'Навигация',
        items: [
            {label: 'Главная', href: '/'},
            {label: 'Книги', href: '/books'},
            {label: 'Жанры', href: '/genres'}
        ]
    },
    {
        name: 'Пользователь',
        items: [
            {label: 'Техническая поддержка', href: 'mailto:support@example.com'},
        ]
    }
]

const SOCIALS = [
    {icon: '/social/telegram.svg', href: ''},
    {icon: '/social/discord.svg', href: ''}
]

type Props = {};

export function Footer(props: Props) {
    return (
        <footer className="h-auto py-5 bg-footer">
            <Container className="pt-4">
                <div className={'md:flex justify-between'}>
                    <div className="md:flex items-center gap-4">
                        <Image src={'/logo.svg'} alt={'logo'} width={75} height={75}/>
                        <div>
                            <h1 className="text-2xl uppercase font-black">Мир Книг</h1>
                            <div className="text-zinc-400">
                                <p>Читай сколько хочешь</p>
                                <p>Спасибо, что выбираете нас!</p>
                            </div>
                        </div>
                    </div>

                    <div className={'md:flex gap-[10rem]'}>
                        {NAVIGATION_PANEL.map(nav => {
                            return (
                                <div key={nav.name}>
                                    <h1 className={'max-md:pt-6 dark:text-white/[0.7] uppercase font-black text-sm pb-2'}>{nav.name}</h1>
                                    {nav.items.map(item => {
                                        return (
                                            <Link href={item.href} className={'text-zinc-400 text-xs hover-underline'}
                                                  key={item.label}>
                                                <p>{item.label}</p>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <hr className="my-6"/>
                <div>
                    <div className={'md:flex justify-between items-center'}>
                        <div className={'text-zinc-600 text-xs'}>
                            <p>Весь материал на сайте представлен исключительно для домашнего ознакомительного
                                просмотра</p>
                            <p>
                                В случаях нарушения авторских прав - обращайтесь на почту:{' '}
                                <b className={'text-zinc-400 hover-underline'}>copyrights@example.com</b>
                            </p>
                            <p>
                                Для связи с нами по вопросам рекламы и сотрудничества:{' '}
                                <b className={'text-zinc-400 hover-underline'}>contact@example.com</b>
                            </p>
                        </div>

                        <div className={'flex gap-[5px]'}>
                            {SOCIALS.map(social => {
                                return (
                                    <a
                                        href={'https://www.example.com'}
                                        target={'_blank'}
                                        rel={'noopener noreferrer'}
                                        key={social.icon}>
                                        <Button variant={'secondary'}>
                                            <Image
                                                className={'dark:invert'}
                                                src={social.icon}
                                                alt={social.icon}
                                                width={20}
                                                height={20}/>
                                        </Button>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    )
}