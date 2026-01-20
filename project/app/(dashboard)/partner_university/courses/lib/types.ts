import { Status } from "@/lib/types"

export type Courses = {
    course_id: string,
    course_name: string,
    course_code: string,
    syllabus: string,
    course_status: Status,
    admission_id?: string,
    partner_uni_id: string
}

export type CreateCourseErrors = {
    courseName: string,
    courseCode: string,
    syllabus: string,
    unknownError?:string
}

export type CreateCourseFormState = {
    errors: CreateCourseErrors,
    payload: FormData,
    state: number
}

export type partner = {
    partner_uni_id: string,
    partner_uni_name: string
}