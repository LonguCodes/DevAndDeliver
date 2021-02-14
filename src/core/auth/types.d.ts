export interface TokenPayload {
    userId: string,
    sessionId: string
}

export interface User {
    _id: string;
    login: string,
    password: string,
    heroId: number
}

interface Session {
    _id: string
    expiresAt: string
    userId: string
}