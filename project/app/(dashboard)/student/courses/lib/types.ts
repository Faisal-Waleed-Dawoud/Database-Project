import { Status } from "@/lib/types"

export type ApprovedCourses = {
    course_id: string
    course_name: string,
    course_code: string,
    partner_uni_name: string,
    location: string,
    status: EnrollmentsStatus,
    grade: string,
    student_id: string, 
    user_id: string
}

export enum Enrollments {
    Completed = "completed"
}

export type EnrollmentsStatus = Status | Enrollments;

export type EnrollmentFormErrors = {
    gpa: string,
    level: string
}