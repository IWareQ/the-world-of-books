import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/components/ui/button'
import {Book, Genre} from '@/types/book'
import {ChangeEvent, useRef, useState} from 'react'
import {Textarea} from '@/components/ui/textarea'

export const bookEditFormSchema = z.object({
    title: z.string(),
    description: z.string(),
    genres: z.array(z.object({
        id: z.number(),
        name: z.string()
    })).min(1, {
        message: 'Выберите хотя бы один жанр'
    }),
    image: z.any()
})

type Props = {
    book: Book
    genres: Genre[]
    isOpen: boolean
    onClose: () => void
    onSave: (data: z.infer<typeof bookEditFormSchema>) => void
}

export function BookEditDialog({book, genres, isOpen, onClose, onSave}: Props) {
    const [previewImage, setPreviewImage] = useState(book.imageUrl)

    const form = useForm<z.infer<typeof bookEditFormSchema>>({
        resolver: zodResolver(bookEditFormSchema),
        defaultValues: {
            title: book.title,
            description: book.description,
            genres: book.genres,
            image: null
        }
    })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setPreviewImage(URL.createObjectURL(file))
            form.setValue('image', file)
        }
    }

    const genreOptions = genres.map(genre => ({
        value: genre.id,
        label: genre.name
    }))

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
                            name={'title'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название книги</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'description'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Описание книги</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={'genres'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Жанры книги</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'image'}
                            render={() => (
                                <FormItem>
                                    <FormLabel>Изображение жанра</FormLabel>
                                    <FormControl>
                                        <div className={'space-y-2'}>
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt={book.title}
                                                    className={'w-50 h-50 rounded-lg'}
                                                />
                                            )}

                                            <Input
                                                type={'file'}
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept={'image/*'}
                                                style={{display: 'none'}}
                                            />
                                            <Button
                                                type={'button'}
                                                variant={'outline'}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                Загрузить изображение
                                            </Button>
                                        </div>
                                    </FormControl>
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