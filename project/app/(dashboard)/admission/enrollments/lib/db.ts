"use server"

import { authorizeDbCall } from "@/lib/db/calls"
import { MAX_ROWS, Status } from "@/lib/types"
import { formatDate } from "@/lib/utils"
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

const getEnrollmentsCache = async (query?: string, status?: string, pageNumber?: number) => {
    "use cache"

    let offset = 0;
    if (pageNumber) {
        offset = --pageNumber * MAX_ROWS;
    }
    try {
        if (query && status) {
            const [courses] = await pool.query(`
                SELECT * FROM enrollments
                WHERE (student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%'))
                AND status = ?
                LIMIT ? OFFSET ?`, [query, query, query, query, query, status, MAX_ROWS, offset])

            return courses
        } else if (query) {
            const [courses] = await pool.query(`
                SELECT * FROM enrollments
                WHERE student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%')
                LIMIT ? OFFSET ?`, [query, query, query, query, query, MAX_ROWS, offset])

            return courses
        } else if (status) {
            const [courses] = await pool.query(`
                SELECT * FROM enrollments
                WHERE status = ?
                LIMIT ? OFFSET ?`, [status, MAX_ROWS, offset])

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

export const getEnrollments = async (query?: string, status?: string, pageNumber?: number) => {
    return await authorizeDbCall("course:read", getEnrollmentsCache, query, status, pageNumber)
}

export const getEnrollmentsCountCache = async (query?: string, status?: string) => {
    "use cache"
    try {
        if (query && status) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM enrollments
                WHERE (student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%'))
                AND status = ?`, [query, query, query, query, query, status])
            return count[0][0]["COUNT(*)"]
        } else if (query) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM enrollments
                WHERE student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%')`, [query, query, query, query, query])
            return count[0][0]["COUNT(*)"]
        } else if (status) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM enrollments
                WHERE status = ?`, [status])
            return count[0][0]["COUNT(*)"]
        }
        const count = await pool.query(`
            SELECT COUNT(*) FROM enrollments
            `)
        return count[0][0]["COUNT(*)"]
    } catch (error) {
        return error
    }
}

export const getEnrollmentsCount = async (query?: string, status?: string) => {
    return await authorizeDbCall("course:read", getEnrollmentsCountCache, query, status)
}

const getAllEnrollmentsCache = async (query?: string, status?: string) => {
    "use cache"
    const selectedColumns = "student_id, grade, enrollment_date, finishing_date, status, course_name, course_code, location"
    
    try {
        if (query && status) {
            const [enrollments] = await pool.query(`
                SELECT ${selectedColumns} FROM enrollments
                WHERE (student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%'))
                AND status = ?`, [query, query, query, query, query, status])
            return enrollments
        } else if (query) {
            const [enrollments] = await pool.query(`
                SELECT ${selectedColumns} FROM enrollments
                WHERE student_id LIKE CONCAT('%', ? , '%')
                OR location LIKE CONCAT('%', ? , '%')
                OR course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR partner_uni_name LIKE CONCAT('%', ? , '%')`, [query, query, query, query, query])

            return enrollments
        } else if (status) {
            const [enrollments] = await pool.query(`
                SELECT ${selectedColumns} FROM enrollments
                WHERE status = ?`, [status])

            return enrollments;
        } else {
            const [enrollments] = await pool.query(`SELECT ${selectedColumns} FROM enrollments`)

            return enrollments;
        }

    } catch (error) {
        return error;
    }
}

export const getAllEnrollments = async (query?: string, status?: string) => {
    return await authorizeDbCall("course:read", getAllEnrollmentsCache, query, status)
}

export const enrollmentApprove = async (courseId: string, studentId: number, admissionId: string) => {
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
    } catch (error) {
        return error
    }
}

export const enrollmentReject = async (courseId: string, studentId: number, admissionId: string) => {
    try {
        await pool.query(`
            UPDATE enrolled_courses
            SET status = ?,
            admission_id = ?
            WHERE course_id = ? 
            AND student_id = ?
            `, [Status.rejected, admissionId, courseId, studentId])
    } catch (error) {
        return error
    }
}