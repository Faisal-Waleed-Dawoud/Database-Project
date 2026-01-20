"use server"

import { revalidatePath } from "next/cache"
import { gradeSet } from "./db"

export async function setGrade(studentId:number, courseId:string, prevState, formData:FormData) {
    const grade = formData.get("grade") as string
    try {
        await gradeSet(studentId, courseId, grade)
        revalidatePath("partner_university/students")
    } catch(error) {
        return error
    }
}