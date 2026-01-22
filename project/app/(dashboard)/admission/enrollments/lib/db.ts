"use server"

import { authorizeDbCall } from "@/lib/db/calls"
import { authorize } from "@/lib/db/users"
import { MAX_ROWS, Status } from "@/lib/types"
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

const getEnrollmentsCache = async (query?: string, pageNumber?:number) => {
    "use cache"
    
    let offset = 0;
    if (pageNumber) {
        offset = --pageNumber * MAX_ROWS;
    }
    try {
        if (query) {
            const [courses] = await pool.query(`
                SELECT * FROM enrollments
                WHERE student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%')
                LIMIT ? OFFSET ?`, [query, query, query, query, query, MAX_ROWS, offset])
                
                return courses
        } else {
            const [courses] = await (pool).query(`
                SELECT * FROM enrollments
                LIMIT ? OFFSET ?`, [MAX_ROWS, offset])
            return courses;
        }

    } catch (error) {
        return error;
    }
}

export const getEnrollments = async(query?:string, pageNumber?:number) => {
    return await authorizeDbCall("course:read", getEnrollmentsCache, query, pageNumber)
}

export const getEnrollmentsCountCache = async(query?:string) => {
    "use cache"
    try {
        if (query) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM enrollments
                WHERE student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%')
                LIMIT ? OFFSET ?`, [query, query, query, query, query])
            return count[0][0]["COUNT(*)"]
        }
        const count = await pool.query(`
            SELECT COUNT(*) FROM enrollments
            `)
        return count[0][0]["COUNT(*)"]
    } catch(error) {
        return error
    }
}

export const getEnrollmentsCount = async(query?:string) => {
    return await authorizeDbCall("course:read", getEnrollmentsCountCache, query)
}

export const enrollmentApprove = async(courseId: string, studentId: number, admissionId: string) => {
    const date = Date.now()
    const enrollmentDate = formatDate(date)
    try {
        await pool.query(`
            UPDATE enrolled_courses
            SET status = ?,
            admission_id = ?,
            enrollment_date = ?
            WHERE course_id = ?
            AND student_id = ?
            `, [Status.approved, admissionId, enrollmentDate, courseId, studentId])
    } catch(error) {
        return error
    }
}

export const enrollmentReject = async(courseId: string, studentId: number, admissionId: string) => {
    try {
        await pool.query(`
            UPDATE enrolled_courses
            SET status = ?,
            admission_id = ?
            WHERE course_id = ? 
            AND student_id = ?
            `, [Status.rejected, admissionId, courseId, studentId])
    } catch(error) {
        return error
    }
}