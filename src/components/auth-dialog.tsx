'use client'

import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog'
import {VisuallyHidden} from '@radix-ui/react-visually-hidden'
import * as React from 'react'
import {useState} from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Input} from '@/components/ui/input'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Button} from '@/components/ui/button'
import {useAuth} from '@/context/AuthContext'
import {getCurrentSession, setCurrentSession} from '@/lib/get-current-session'
import api from '@/lib/api'

type Props = {
    open: boolean
    setOpen(open: boolean): void;
};

const loginFormSchema = z.object({
    username: z.string().min(1, {
        message: 'Имя пользователя не может быть пустым'
    }).max(32, {
        message: 'Имя пользователя не может быть длиннее 32 символов'
    }),
    password: z.string().min(8, {
        message: 'Пароль не может быть короче 8 символов'
    })
})

const registerFormSchema = z.object({
    username: z.string().min(1, {
        message: 'Имя пользователя не может быть пустым'
    }).max(32, {
        message: 'Имя пользователя не может быть длиннее 32 символов'
    }),
    email: z.string().email({
        message: 'Неверный формат email'
    }),
    password: z.string().min(8, {
        message: 'Пароль не может быть короче 8 символов'
    }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
})

export function AuthDialog({open, setOpen}: Props) {
    const [buttonLoading, setButtonLoading] = useState(false)
    const {setSession} = useAuth()

    const handleLogin = (token: string) => {
        setCurrentSession(token)
        const session = getCurrentSession()
        setSession(session)
        setOpen(false)
        setButtonLoading(false)
        window.location.reload()
    }


    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
        setButtonLoading(true)
        api.post('/auth/sign-in', {
            username: values.username,
            password: values.password
        }).then(response => {
            handleLogin(response.data.token)
        }).finally(() => setButtonLoading(false))
    }


    const registerForm = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    function onRegisterSubmit(values: z.infer<typeof registerFormSchema>) {
        setButtonLoading(true)
        api.post('/auth/sign-up', {
            username: values.username,
            email: values.email,
            password: values.password
        }).then(response => {
            handleLogin(response.data.token)
        }).finally(() => setButtonLoading(false))
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={'h-max flex flex-col rounded-md w-[400px]'}>
                    <VisuallyHidden>
                        <DialogTitle>Для скринридеров</DialogTitle>
                    </VisuallyHidden>

                    <Tabs>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Авторизация</TabsTrigger>
                            <TabsTrigger value="register">Регистрация</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <p className={'text-sm text-center pt-4'}>
                                Введите имя пользователя и пароль, чтобы войти в свою учетную запись.
                                <br/>
                                Также, можно авторизоваться через социальные сети
                            </p>

                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4">
                                    <FormField
                                        control={loginForm.control}
                                        name="username"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Логин</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Логин" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={'Пароль'} type={'password'} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className={'w-full'}
                                        loading={buttonLoading}>
                                        Авторизоваться
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="register">
                            <p className={'text-sm text-center pt-4'}>
                                Введите Ваши данные, чтобы создать свою учетную запись.
                                <br/>
                                Также, можно зарегистрироваться через социальные сети
                            </p>

                            <Form {...registerForm}>
                                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 pt-4">
                                    <FormField
                                        control={registerForm.control}
                                        name="username"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Логин</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Логин" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Почта</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Почта" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={'Пароль'} type={'password'} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={registerForm.control}
                                        name={'confirmPassword'}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Подтверждение пароля</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={'Подтверждение пароля'}
                                                           type={'password'} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type={'submit'}
                                        className={'w-full'}
                                        loading={buttonLoading}>
                                        Зарегистрироваться
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    )
}