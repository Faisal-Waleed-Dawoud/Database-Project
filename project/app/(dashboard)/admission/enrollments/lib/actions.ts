'use server'

import { authorize } from "@/lib/db/users"
import { getCurrentUser } from "@/lib/utils"
import { enrollmentApprove, enrollmentReject } from "./db"
import { revalidatePath } from "next/cache"

export const approveEnrollment = async (courseId: string, studentId: number) => {
    const currentUser = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(currentUser.role, "enrollment:approve")
    if (isAuthorized === undefined) {
        return
    }

    try {
        await enrollmentApprove(courseId, +studentId, currentUser.userId)
        revalidatePath("/admission/enrollments")
    } catch(error) {
        return error
    }
}

export const rejectEnrollment = async(courseId: string, studentId: number) => {
    const currentUser = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(currentUser.role, "enrollment:reject")
    if (isAuthorized === undefined) {
        return
    }
    
    try {
        await enrollmentReject(courseId, +studentId, currentUser.userId)
        revalidatePath("/admission/enrollments")
    } catch(error) {
        return error
    }
}