'use server'
import { revalidatePath } from "next/cache"
import { CreateCourseErrors, CreateCourseFormState, partner } from "./types"
import { getCurrentUser } from "@/lib/utils"
import { authorize } from "@/lib/db/users"
import ImageKit from "imagekit";
import { getUniquePartner, insertCourse } from "./db"
import { Status } from "@/lib/types"


const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT
})

export async function createCourse(prevState: CreateCourseFormState, formData: FormData) {
    const currentUser = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(currentUser.role, "course:create")
    if (isAuthorized === undefined) {
        return
    }


    const errors: CreateCourseErrors = {}

    const courseName = formData.get("course-name") as string
    const courseCode = formData.get("course-code") as string
    const syllabus = formData.get("syllabus") as File

    // Validate Input

    if (!courseName) {
        errors.courseName = "First Name Cannot Be Empty"
    }

    if (courseName.length > 100) {
        errors.courseName = "The length of the course name should be less than 100 characters"
    }

    if (!courseCode) {
        errors.courseCode = "Last Name Cannot Be Empty"
    }

    if (courseCode.length > 100) {
        errors.courseCode = "The length of the course code should be less than 100 characters"
    }

    if (courseName.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.courseName = "First Name Cannot have special characters"
    }

    if (courseCode.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.courseCode = "Last Name Cannot have special characters"
    }

    if (syllabus.size === 0) {
        errors.syllabus = "Upload the syllabus"
    } else if (!syllabus.name.match(/.pdf/)) {
        errors.syllabus = "The uploaded file should be pdf"
    }


    if (Object.keys(errors).length >= 1) {
        return { errors, payload: formData, status: 400 }
    }

    try {
        const admission = await getUniquePartner(currentUser.userId) as partner
        const folderName = admission.partner_uni_name.replaceAll(" ", "-")
        const buffer = await syllabus.arrayBuffer()
        const file = Buffer.from(buffer)
        const result = await imageKit.upload({
            fileName: syllabus.name,
            file: file,
            folder: `/${folderName}`
        })

        if (result.url.length > 100) {
            errors.syllabus = "Shorten the file name"
        }

        if (Object.keys(errors).length >= 1) {
            return { errors, payload: formData, status: 400 }
        }
        await insertCourse(courseName, courseCode, result.url, Status.pending, admission.partner_uni_id, null)

        revalidatePath("/partner_university/courses")
    } catch (error) {
        errors.unknownError = error.message
    }
}