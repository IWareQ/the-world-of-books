import React from 'react'
import styles from './container.module.css'
import {cn} from '@/lib/utils'

type Props = {
    className?: string
};

export const Container: React.FC<React.PropsWithChildren<Props>> = ({className, children}) => {
    return (
        <div className={cn(styles.container, className)}>
            {children}
        </div>
    )
}