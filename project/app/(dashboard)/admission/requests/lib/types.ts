import { Status } from "@/lib/types"

export type UniversitiesCourses = {
    partner_uni_name : string,
    location: string, 
    course_id: string,
    course_name: string,
    course_code: string,
    syllabus: string,
    course_status: Status
}