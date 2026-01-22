'use server'
import crypto, { createHash } from "crypto"
import { cookies } from "next/headers"
import { Roles, UserSession } from "./types"
import { deleteSessionToken, insertSession } from "./db/session"
import { getUserFromSessionToken } from "./db/users"



const SESSION_EXP_SECONDS = 60 * 60 * 24 * 7
const COOKIES_SESSION_KEY = 'session-id'


export async function createUserSession(userId: string, role: Roles) {
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()

    const hashedSession = createHash("sha256").update(sessionId).digest("hex")
    
    await insertSession(
        userId,
        hashedSession,
        new Date(Date.now() + SESSION_EXP_SECONDS * 1000),
        role)

    await setCookie(sessionId)
}

export async function setCookie(sessionId: string) {
    (await cookies()).set(COOKIES_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXP_SECONDS * 1000
    })
}


async function getUserSessionById(sessionId: string | null) {
    "use cache"
    if (sessionId === null) {
        return null
    }
    const hashedSession = createHash("sha256").update(sessionId).digest("hex")

    return await getUserFromSessionToken(hashedSession) as UserSession
}

async function getUserSessionId() {
    const userSession = (await cookies()).get(COOKIES_SESSION_KEY)?.value
    return userSession ? userSession : null
}

export async function getUserFromSessionId() {
    const userSession = await getUserSessionId()
    
    return await getUserSessionById(userSession)
}

export async function deleteSession(sessionId: string | null) {

    if (!sessionId) return

    const hashedSession = createHash("sha256").update(sessionId).digest("hex")

    await deleteSessionToken(hashedSession);

    (await cookies()).delete(COOKIES_SESSION_KEY)

}

export async function deleteSessionId() {
    const sessionId = await getUserSessionId()

    await deleteSession(sessionId)
}