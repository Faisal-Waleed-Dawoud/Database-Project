'use server'
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

export const insertStudent = async(studentId: number, gpa: number | null, level: number | null, userId: string) => {
    try {
        await pool.query(`
            INSERT INTO student VALUES(?, ?, ?, ?)
            `, [studentId, gpa, level, userId])
    } catch(error) {
        return error
    }
} 

export const updateStudent = async(userId: string, gpa: number, level: number) => {
    try {
        await pool.query(`
            UPDATE student
            SET gpa = ?,
            level = ?
            WHERE user_id = ?
            `, [gpa, level, userId])
    } catch(error) {
        return error
    }
}

export const getStudentById = async(userId: string) => {
    try {
        const user = await pool.query(`
            SELECT * FROM student WHERE user_id = ?
            `, [userId])
            return user[0][0]
    } catch(error) {
        return error
    }
} 