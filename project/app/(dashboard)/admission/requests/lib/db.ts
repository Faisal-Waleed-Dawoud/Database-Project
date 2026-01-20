'use server'
import { authorize } from "@/lib/db/users"
import { MAX_ROWS, Status } from "@/lib/types"
import { getCurrentUser } from "@/lib/utils"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : undefined,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 2,
    maxIdle: 0,
    idleTimeout: 0,
    enableKeepAlive: false,
    waitForConnections: true,
    queueLimit: 0,
})


export const getUniCourses = async (query?: string, pageNumber?:number) => {
    const user = await getCurrentUser({fullUser:false, redirectIfNotFound:true})
    const isAuthorized = await authorize(user.role, "course:read")
    if (isAuthorized === undefined) {
        return
    }
    
    let offset = 0;
    if (pageNumber) {
        offset = --pageNumber * MAX_ROWS;
    }
    try {
        if (query) {
            const [courses] = await pool.query(`
                SELECT partner_uni_name, location, course_id, course_name, course_code, syllabus, course_status FROM partner_uni_admission p
                JOIN courses c
                ON p.partner_uni_id = c.partner_uni_id
                WHERE partner_uni_name LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR course_status LIKE CONCAT('%', ? , '%')
                LIMIT ? OFFSET ?`, [query, query, query, query, query, MAX_ROWS, offset])
                
                return courses
        } else {
            const [courses] = await (pool).query(`
                SELECT partner_uni_name, location, course_id, course_name, course_code, syllabus, course_status FROM partner_uni_admission p
                JOIN courses c
                ON p.partner_uni_id = c.partner_uni_id
                LIMIT ? OFFSET ?`, [MAX_ROWS, offset])
            return courses;
        }

    } catch (error) {
        return error;
    }
}

export const getUniCoursesCount = async(query?:string, ) => {
    try {
        if (query) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM partner_uni_admission p
                JOIN courses c
                ON p.partner_uni_id = c.partner_uni_id
                WHERE partner_uni_name LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR course_status LIKE CONCAT('%', ? , '%')`, [query, query, query, query, query])
            return count[0][0]["COUNT(*)"]
        }
        const count = await pool.query(`
            SELECT COUNT(*) FROM partner_uni_admission p
            JOIN courses c
            ON p.partner_uni_id = c.partner_uni_id
            `)
        return count[0][0]["COUNT(*)"]
    } catch(error) {
        return error
    }
}

export const acceptCourse = async(admissionId: string, courseId:string) => {
    try {
        await pool.query(`
            UPDATE courses
            SET course_status = ?,
            admission_id = ?
            WHERE course_id = ?
            `, [Status.approved ,admissionId, courseId])
    } catch(error) {
        return error
    }
}

export const rejectCourse = async(admissionId: string, courseId: string) => {
    try {
        await pool.query(`
            UPDATE courses
            SET course_status = ?,
            admission_id = ?
            WHERE course_id = ?
            `, [Status.rejected, admissionId, courseId])
    } catch(error) {
        return error
    }
}