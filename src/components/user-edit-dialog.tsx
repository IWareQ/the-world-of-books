import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Role, User} from '@/types/user'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/components/ui/button'

export const userEditFormSchema = z.object({
    username: z.string().min(1, {
        message: 'Имя пользователя не может быть пустым'
    }).max(32, {
        message: 'Имя пользователя не может быть длиннее 32 символов'
    }),
    email: z.string().email({
        message: 'Неверный формат email'
    }),
    role: z.enum(Object.values(Role) as [string, ...string[]])
})

type Props = {
    user: User
    isOpen: boolean
    onClose: () => void
    onSave: (data: z.infer<typeof userEditFormSchema>) => void
}

export function UserEditDialog({user, isOpen, onClose, onSave}: Props) {
    const form = useForm<z.infer<typeof userEditFormSchema>>({
        resolver: zodResolver(userEditFormSchema),
        defaultValues: {
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактировать пользователя</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSave)} className={'space-y-4'}>
                        <FormField
                            control={form.control}
                            name={'username'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Имя пользователя</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'email'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'role'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Роль</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={'Выберите роль'}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(Role).map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type={'submit'}>Сохранить</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}