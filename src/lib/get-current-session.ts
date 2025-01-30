import {jwtDecode, JwtPayload} from 'jwt-decode'

interface AuthPayload extends JwtPayload {
    userId?: number
    role?: string
}

export interface CurrentSession {
    id: number
    email: string
    role: string
}

export function getCurrentSession(): CurrentSession | null {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
        const decoded: AuthPayload = jwtDecode(token)
        return {
            id: decoded.userId as number,
            email: decoded.sub as string,
            role: decoded.role as string
        }
    } catch (error) {
        console.error('Ошибка при декодировании токена: ', error)
        return null
    }
}

export function setCurrentSession(token: string | null) {
    if (token) {
        localStorage.setItem('token', token)
    } else {
        localStorage.removeItem('token')
    }
}

