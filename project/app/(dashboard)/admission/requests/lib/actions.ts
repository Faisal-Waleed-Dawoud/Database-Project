'use server'
import { authorize } from "@/lib/db/users"
import { getCurrentUser } from "@/lib/utils"
import { acceptCourse, rejectCourse } from "./db"
import { revalidatePath } from "next/cache"

export async function courseAccept(courseId: string) {
    const currentUser = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(currentUser.role, "course:approve")
    if (isAuthorized === undefined) {
        return
    }

    try {
        await acceptCourse(currentUser.userId, courseId)
        revalidatePath("/admission/requests")
    } catch(error) {
        return error
    }
}

export async function courseReject(courseId: string) {
    const currentUser = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(currentUser.role, "course:reject")
    if (isAuthorized === undefined) {
        return
    }

    try {
        await rejectCourse(currentUser.userId, courseId)
        revalidatePath("/admission/requests")
    } catch(error) {
        return error
    }
}