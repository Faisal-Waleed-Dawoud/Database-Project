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

export const insertPartner = async(uniName: string, location: string, userId: string) => {
    try {
        await pool.query(`
            INSERT INTO partner_uni_admission 
            (partner_uni_name, location, user_id) 
            VALUES(?, ?, ?)`, [uniName, location, userId])
    } catch(error) {
        return error
    }
}

