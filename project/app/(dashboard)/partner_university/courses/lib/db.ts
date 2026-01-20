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


export const getCourses = async (query?: string, pageNumber?:number) => {
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
        const uniId = await pool.query(`SELECT partner_uni_id FROM partner_uni_admission WHERE user_id = ?`, [user.userId])
        if (query) {
            const [courses] = await pool.query(`
                SELECT * FROM courses WHERE 
                course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR course_status LIKE CONCAT('%', ? , '%')
                AND partner_uni_id = ?
                LIMIT ? OFFSET ?`, [query, query, query, uniId[0][0].partner_uni_id, MAX_ROWS, offset])
                
                return courses
        } else {
            const [courses] = await (pool).query(`
                SELECT * FROM courses WHERE partner_uni_id = ? LIMIT ? OFFSET ?
                `, [uniId[0][0].partner_uni_id, MAX_ROWS, offset])
            return courses;
        }

    } catch (error) {
        return error;
    }
}

export const getCoursesCount = async(query?:string, ) => {
    const user = await getCurrentUser({fullUser:false, redirectIfNotFound:true})
    const isAuthorized = await authorize(user.role, "course:read")
    if (isAuthorized === undefined) {
        return
    }

    try {
        const uniId = await pool.query(`
            SELECT partner_uni_id FROM partner_uni_admission WHERE user_id = ?`, [user.userId])
        if (query) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM courses WHERE 
                course_name LIKE CONCAT('%', ? , '%')
                OR course_code LIKE CONCAT('%', ? , '%')
                OR course_status LIKE CONCAT('%', ? , '%')
                AND partner_uni_id = ?`, [uniId[0][0].partner_uni_id, query, query, query])
            return count[0][0]["COUNT(*)"]
        }
        const count = await pool.query("SELECT COUNT(*) FROM courses WHERE partner_uni_id = ?", [uniId[0][0].partner_uni_id])
        return count[0][0]["COUNT(*)"]
    } catch(error) {
        return error
    }
}

export const insertCourse = async(courseName: string, courseCode: string, syllabus: string, status:Status, partnerUniId: string,  admissionId?:string | null) => {
    try {
        await pool.query(`
            INSERT INTO 
            courses (course_name, course_code, syllabus, course_status, admission_id, partner_uni_id)
            VALUES(?, ?, ?, ?, ?, ?)`, 
            [courseName, courseCode, syllabus, status, admissionId, partnerUniId])
    } catch(error) {
        return error
    }
}

export const getUniquePartner = async(userId:string) => {
    try {
        const [partner] = await pool.query(`
            SELECT partner_uni_id, partner_uni_name FROM partner_uni_admission WHERE user_id = ?`, [userId])

        return partner[0]
    } catch(error) {
        return error
    }
}