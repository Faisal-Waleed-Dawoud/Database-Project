"use server"
import { authorize } from "@/lib/db/users"
import { MAX_ROWS } from "@/lib/types"
import { formatDate, getCurrentUser } from "@/lib/utils"
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

export const getEnrolledStudents = async (query?: string, pageNumber?: number) => {

    const user = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(user.role, "enrollment:read")
    if (isAuthorized === undefined) {
        return
    }

    let offset = 0;
    if (pageNumber) {
        offset = --pageNumber * MAX_ROWS;
    }
    try {
        const uniId = await pool.query(`SELECT partner_uni_id FROM partner_uni_admission WHERE user_id = ?`, [user.userId])
        if (query) {
            const [enrollments] = await pool.query(`
                    SELECT student_id, e.course_id, enrollment_date, finishing_date, grade, course_name, course_code FROM enrolled_courses e 
                    JOIN courses c 
                    ON e.course_id = c.course_id AND partner_uni_id = ? AND status = "approved"
                    WHERE student_id LIKE CONCAT('%', ? , '%')
                    OR grade LIKE CONCAT('%', ? , '%')
                    OR course_name LIKE CONCAT('%', ? , '%')
                    OR course_code LIKE CONCAT('%', ?, '%')
                    LIMIT ? OFFSET ?`, [uniId[0][0].partner_uni_id, query, query, query, query, MAX_ROWS, offset])

            return enrollments
        } else {
            const [enrollments] = await (pool).query(`
                    SELECT student_id, e.course_id, grade, enrollment_date, finishing_date, course_name, course_code FROM enrolled_courses e 
                    JOIN courses c 
                    ON e.course_id = c.course_id AND partner_uni_id = ? AND status = "approved"
                    LIMIT ? OFFSET ?
                    `, [uniId[0][0].partner_uni_id, MAX_ROWS, offset])
            return enrollments;
        }

    } catch (error) {
        return error;
    }
}

export const getEnrollmentsCount = async (query?: string) => {
    const user = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(user.role, "enrollment:read")
    if (isAuthorized === undefined) {
        return
    }

    try {
        const uniId = await pool.query(`
            SELECT partner_uni_id FROM partner_uni_admission WHERE user_id = ?`, [user.userId])
        if (query) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM enrolled_courses e 
                JOIN courses c 
                ON e.course_id = c.course_id AND partner_uni_id = ? AND status = "approved"
                WHERE student_id LIKE CONCAT('%', ? , '%')
                OR grade LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ?, '%')
                LIMIT ? OFFSET ?`, [uniId[0][0].partner_uni_id, query, query, query])
            return count[0][0]["COUNT(*)"]
        }
        const count = await pool.query(`
            SELECT COUNT(*) FROM enrolled_courses e 
            JOIN courses c 
            ON e.course_id = c.course_id AND partner_uni_id = ? AND status = "approved"
            `, [uniId[0][0].partner_uni_id])
        return count[0][0]["COUNT(*)"]
    } catch(error) {
        return error
    }
}

export const gradeSet = async(studentId: number, courseId: string, grade: string) => {
    const user = await getCurrentUser({fullUser: false, redirectIfNotFound:true})
    const isAuthorized = await authorize(user.role, "enrollment:completed")
    if (!isAuthorized) {
        return
    }
    const date = Date.now();
    const finishing_date = formatDate(date)
    try {
        await pool.query(`
            UPDATE enrolled_courses
            SET status = "completed",
            grade = ?,
            finishing_date = ?
            WHERE student_id = ?
            AND course_id = ?
            `,
            [grade, finishing_date, studentId, courseId]
        )
    } catch(error) {
        return error
    }
}