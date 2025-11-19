'use server'
import mysql from "mysql2/promise"
import { cacheLife } from "next/cache"

// These details (host, user, etc...) should be stored in .env file and never 
// exposed in the client side
export const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE 
})

export const getUsers = async() => {
    'use cache'
    cacheLife("hours")
    
    try {
        const [users] = await db.query("SELECT * FROM user")
        return users;
    } catch (error) {
        return error;
    }
}