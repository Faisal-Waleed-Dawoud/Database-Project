"use server"

import { getCurrentUser } from "../utils"
import { authorize } from "./users"

export async function authorizeDbCall<T, Args extends any[]>(
    permission: string,
    dbCall: (...args: Args) => Promise<T>,
    ...args: Args
): Promise<T | undefined> {
    const user = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(user.role, permission)
    if (isAuthorized === undefined) {
        return
    }
    
    return await dbCall(...args)
}

export async function authorizeDbCallWithUserId<T, Args extends any[]>(
    permission: string,
    dbCall: (userId: string, ...args: Args) => Promise<T>,
    ...args: Args
): Promise<T | undefined> {
    const user = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(user.role, permission)
    if (isAuthorized === undefined) {
        return
    }
    
    return await dbCall(user.userId, ...args)
}
