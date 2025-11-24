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

export async function getUserFromSession() {
    const userSession = (await cookies()).get(COOKIES_SESSION_KEY)?.value
    

    if (userSession == null) {
        return null
    }

    return getUserSessionById(userSession)
}

async function getUserSessionById(sessionId: string) {

    const hashedSession = createHash("sha256").update(sessionId).digest("hex")


    return await getUserFromSessionToken(hashedSession) as UserSession
}

export async function deleteSession() {
    const sessionId = (await cookies()).get(COOKIES_SESSION_KEY)?.value

    if (!sessionId) return

    const hashedSession = createHash("sha256").update(sessionId).digest("hex")

    await deleteSessionToken(hashedSession);

    (await cookies()).delete(COOKIES_SESSION_KEY)

}