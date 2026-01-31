
export enum EnrollmentsStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected",
    completed = "completed"
}


export type Enrollments = {
    course_code: string
    course_id: string,
    course_name: string,
    enrollment_date?: Date,
    finishing_date?: Date,
    gpa: number,
    grade: string,
    level: number,
    location: string,
    partner_uni_name: string,
    status: EnrollmentsStatus,
    student_id: number,
    syllabus: string
}

export type ExportedEnrollments = Omit<Enrollments, "course_id" | "syllabus">