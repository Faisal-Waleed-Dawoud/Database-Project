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

export const insertEnrollment = async(studentId: number, courseId: string) => {
    try {
        await pool.query(`
            INSERT INTO enrolled_courses
            (student_id, course_id, status)
            VALUES (?, ?, ?)
            `, [studentId, courseId, Status.pending])
    } catch(error) {
        return error
    }
}


export const getApprovedCourses = async(query?: string, pageNumber?:number) => {
    const user = await getCurrentUser({fullUser:false, redirectIfNotFound:true})
    const isAuthorized = await authorize(user.role, "course:enroll")
    if (isAuthorized === undefined) {
        return
    }
    
    let offset = 0;
    if (pageNumber) {
        offset = --pageNumber * MAX_ROWS;
    }
    const studentId = await getStudentId(user.userId)
    try {
        if (query) {
            const [courses] = await pool.query(`
                SELECT c.course_id, course_name, course_code, partner_uni_name, location, status, grade, student_id, user_id FROM courses c
                JOIN partner_uni_admission p
                ON c.partner_uni_id = p.partner_uni_id AND course_status = "approved"
                LEFT JOIN enrolled_courses e
                ON c.course_id = e.course_id
                AND student_id = ?
                WHERE partner_uni_name LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR status LIKE CONCAT('%', ? , '%')
                LIMIT ? OFFSET ?`, [studentId, query, query, query, query, query, MAX_ROWS, offset])
                return courses
        } else {
            const [courses] = await (pool).query(`
                SELECT c.course_id, course_name, course_code, partner_uni_name, location, status, grade, student_id, user_id FROM courses c
                JOIN partner_uni_admission p
                ON c.partner_uni_id = p.partner_uni_id AND course_status = "approved"
                LEFT JOIN enrolled_courses e
                ON c.course_id = e.course_id
                AND e.student_id = ?
                LIMIT ? OFFSET ?
                `, [studentId, MAX_ROWS, offset])
            return courses;
        }

    } catch (error) {
        return error;
    }
}

export const getApprovedCoursesCount = async(query?:string, ) => {
    const user = await getCurrentUser({fullUser:false, redirectIfNotFound:true})
    const studentId = await getStudentId(user.userId)
    try {
        if (query) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM courses c
                JOIN partner_uni_admission p
                ON c.partner_uni_id = p.partner_uni_id AND course_status = "approved"
                LEFT JOIN enrolled_courses e
                ON c.course_id = e.course_id
                AND student_id = ?
                WHERE partner_uni_name LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR status LIKE CONCAT('%', ? , '%')`, [studentId, query, query, query, query, query])
            return count[0][0]["COUNT(*)"]
        }
        const count = await pool.query(`
            SELECT COUNT(*) FROM courses c
            JOIN partner_uni_admission p
            ON c.partner_uni_id = p.partner_uni_id AND course_status = "approved"
            LEFT JOIN enrolled_courses e
            ON c.course_id = e.course_id
            AND student_id = ?`, [studentId])
        return count[0][0]["COUNT(*)"]
    } catch(error) {
        return error
    }
}

export const getStudentId = async(userId:string) => {

    try {
        const studentId = await pool.query(
            `SELECT student_id FROM 
            student WHERE user_id = ?`
        , [userId])
        return studentId[0][0].student_id
    } catch(error) {
        return error
    }
}
