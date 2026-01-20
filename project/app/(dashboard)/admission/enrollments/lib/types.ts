

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
    status: Enrollments,
    student_id: number,
    syllabus: string
}