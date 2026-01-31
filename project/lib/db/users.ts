'use server'

import mysql from "mysql2/promise"
import { MAX_ROWS, SafeUser } from "../types";
import { authorizeDbCall } from "./calls";



// These details (host, user, etc...) should be stored in .env file and never 
// exposed in the client side
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


const getUsersCache = async (query?: string, pageNumber?:number) => {
    "use cache"
    
    let offset = 0;
    if (pageNumber) {
        offset = --pageNumber * MAX_ROWS;
    }
    try {
        if (query) {
            const [users] = await pool.query(`
                SELECT * FROM user WHERE 
                firstName LIKE CONCAT('%', ? , '%')
                OR lastName LIKE CONCAT('%', ? , '%')
                OR email LIKE CONCAT('%', ? , '%')
                OR role LIKE CONCAT('%', ? , '%')
                LIMIT ? OFFSET ?`, [query, query, query, query, MAX_ROWS, offset])
                
                return users
        } else {
            const [users] = await (pool).query("SELECT * FROM user LIMIT ? OFFSET ?", [MAX_ROWS, offset])
            
            return users;
        }

    } catch (error) {
        return error;
    }
}

const getAllUsersCache = async(query?:string) => {
    "use cache"

    try {
        if (query) {
            const [users] = await pool.query(`
                SELECT firstName, lastName, email, role FROM user WHERE 
                firstName LIKE CONCAT('%', ? , '%')
                OR lastName LIKE CONCAT('%', ? , '%')
                OR email LIKE CONCAT('%', ? , '%')
                OR role LIKE CONCAT('%', ? , '%')
                `, [query, query, query, query])
                
                return users
        } else {
            const [users] = await (pool).query("SELECT firstName, lastName, email, role FROM user")
            
            return users;
        }

    } catch (error) {
        return error;
    }
}

export const getAllUsers = async(query?:string) => {
    return await authorizeDbCall("user:read", getAllUsersCache, query)
}

export const getUsers = async(query?:string, pageNumber?: number) => {
    return await authorizeDbCall("user:read", getUsersCache, query, pageNumber)
}

export const insertUser = async (firstName: string, lastName: string, email: string, password: string, salt: string, role: string) => {

    try {
        await pool.query(`
            INSERT INTO user 
            (firstName, lastName, email, password, salt, role) 
            VALUES( ? , ?, ? , ?, ?, ?)
            `, [firstName, lastName, email, password, salt, role])

        const [user] = await pool.query(`SELECT id FROM user WHERE email = ?`, [email])

        return user[0].id
    } catch (error) {
        return error
    }
}

export const updateUser = async(userId: string, firstName: string, lastName: string, password: string, salt: string) => {
    try {
        await pool.query(`
            UPDATE user
            SET firstName = ?, 
            lastName = ?,
            password = ?,
            salt = ?
            WHERE id = ?
            `, [firstName, lastName, password, salt, userId])
    } catch(error) {
        return error
    }
}

// This function gets the user by email to check if it already exists before signning up
export const userExists = async (email: string) => {

    try {
        const [user] = await (pool).query(`SELECT * FROM user WHERE email = ?`, [email]);

        return user
    } catch (error) {
        return error;
    }
}

// This function should return the user details 
export const getUserFromSessionToken = async (sessionToken: string) => {
    "use cache"
    try {
        const [userId] = await (pool).query("SELECT userId, role FROM session WHERE token = ?", [sessionToken])

        return userId[0]
    } catch (error) {
        return error
    }
}

export const getUserById = async (id: string) => {
    "use cache"
    try {
        const [user] = await (pool).query("SELECT * FROM user WHERE id = ?", [id])
        return user[0]
    } catch (error) {
        return error
    }
}

export const deleteUser = async(id: string) => {
    try {
        await pool.query("DELETE FROM user WHERE id = ?", [id])
    } catch(error) {
        return error
    }
}

const getUsersCountCache = async(query?:string, ) => {
    "use cache"
    try {
        if (query) {
            const count = await pool.query(`
                SELECT COUNT(*) FROM user WHERE 
                firstName LIKE CONCAT('%', ? , '%')
                OR lastName LIKE CONCAT('%', ? , '%')
                OR email LIKE CONCAT('%', ? , '%')
                OR role LIKE CONCAT('%', ? , '%')`, [query, query, query, query])
            return count[0][0]["COUNT(*)"]
        }
        const count = await pool.query("SELECT COUNT(*) FROM user")
        return count[0][0]["COUNT(*)"]
    } catch(error) {
        return error
    }
}

export const getUsersCount = async(query?:string) => {
    return await authorizeDbCall("user:read", getUsersCountCache, query)
}

export const authorize = async(roleName: string, permission: string) => {
    "use cache"
    try {
        const result = await pool.query(`
            SELECT name , role_name from permission p 
            JOIN roles_permission rp
            ON p.id = rp.permission_id where rp.role_name = ? AND p.name = ?`, [roleName, permission])
        return result[0][0]
    } catch(error) {
        return error
    }
}