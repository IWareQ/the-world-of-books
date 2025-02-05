import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/components/ui/button'
import {Genre} from '@/types/book'
import {ChangeEvent, useRef, useState} from 'react'

export const genreEditFormSchema = z.object({
    name: z.string(),
    image: z.any()
})

type Props = {
    genre: Genre
    isOpen: boolean
    onClose: () => void
    onSave: (data: z.infer<typeof genreEditFormSchema>) => void
}

export function GenreEditDialog({genre, isOpen, onClose, onSave}: Props) {
    const [previewImage, setPreviewImage] = useState(genre.imageUrl)

    const form = useForm<z.infer<typeof genreEditFormSchema>>({
        resolver: zodResolver(genreEditFormSchema),
        defaultValues: {
            name: genre.name,
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
                            name={'name'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название жанра</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'image'}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Изображение жанра</FormLabel>
                                    <FormControl>
                                        <div className={'space-y-2'}>
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt={genre.name}
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