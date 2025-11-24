'use server'

import { Roles } from "../types"
// import { createConnection} from "./users"
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

export const insertSession = async(userId: string, sessionToken: string, expDate: Date, role: Roles) => {
    
    try {
        await (pool).query("INSERT INTO session (userId, token, expDate, role) VALUES ( ? , ? , ? , ?)", [userId, sessionToken, expDate, role])

    } catch (error) {
        return error
    }

}


export const deleteSessionToken = async(sessionToken: string) => {
    try {
        await pool.query("DELETE FROM session WHERE token = ? ", [sessionToken])

    } catch (error) {
        return error
    }
}
