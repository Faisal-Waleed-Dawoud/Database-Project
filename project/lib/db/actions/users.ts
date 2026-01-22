'use server'
import { signUpFormState } from "@/components/auth/singUp"
import { CreateUserErrors, Roles, RolesURLS, signInFormErrors, signUpFormErrors, UpdateUserProfileErrors, User } from "@/lib/types"
import { authorize, deleteUser, insertUser, updateUser, userExists } from "../users"
import { compareHashes, generateSalt, getCurrentUser, hash } from "@/lib/utils"
import { redirect } from "next/navigation"
import { createUserSession, deleteSession } from "@/lib/cookies"
import { signInFormState } from "@/components/auth/signIn"
import { revalidatePath } from "next/cache"
import { insertStudent, updateStudent } from "../student"
import { insertPartner, updatePartner } from "../partner"

export async function signUp(prevState: signUpFormState, formData: FormData) {
    const errors: signUpFormErrors = {}

    const fName = formData.get("first-name") as string
    const lName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate Input

    if (!fName) {
        errors.firstName = "First Name Cannot Be Empty"
    }

    if (!lName) {
        errors.lastName = "Last Name Cannot Be Empty"
    }

    if (fName.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.firstName = "First Name Cannot have special characters"
    }

    if (lName.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.lastName = "Last Name Cannot have special characters"
    }

    if (fName.match(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/ug)) {
        errors.firstName = "First Name Cannot have emojies or number"
    }

    if (lName.match(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/ug)) {
        errors.lastName = "Last Name Cannot have emojies or numbers"
    }

    if (!email) {
        errors.email = "Email Cannot Be Empty"
    }

    if (!password) {
        errors.password = "Password Cannot be Empty"
    }

    if (email.match(/\s+/)) {
        errors.email = "Invalid email"
    }

    if (!email.match(/^\d{7}@upm\.edu\.sa/)) {
        errors.email = "Email Should Start with 7 digits and end with @upm.edu.sa"
    }

    if (password.length < 6) {
        errors.password = "Password Length Should be more than 6 characters"
    }

    const user = await userExists(email) as User

    if (user[0] != null) {
        errors.unknownError = "Cannot sign up, user exists"
    }

    if (Object.keys(errors).length >= 1) {
        return { errors, payload: formData, status: 400 }
    }


    try {
        const studId = email.slice(0, 7)
        const salt = generateSalt()
        const hashedPassword = await hash(password, salt)
        const userId = await insertUser(fName, lName, email, hashedPassword, salt, Roles.Student)
        await insertStudent(+studId, null, null, userId)
        await createUserSession(userId, Roles.Student)
    } catch (error) {
        errors.unknownError = error
    }
    redirect(`/${Roles.Student}`)
}

export async function signIn(prevState: signInFormState, formData: FormData) {
    const errors: signInFormErrors = {}

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate Input


    if (!email) {
        errors.email = "Email Cannot Be Empty"
    }

    if (!password) {
        errors.password = "Password Cannot be Empty"
    }

    if (email.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|#|%|\$|~|\|)|\s/gm)) {
        errors.email = "Invalid email"
    }

    const user = await userExists(email) as User

    if (user[0] == null) {
        errors.unknownError = "Incorrect email or password"
        return { errors, payload: formData, status: 400 }
    }

    const isCorrectUser = await compareHashes(password, user[0].password, user[0].salt)

    if (!isCorrectUser) {
        errors.unknownError = "Incorrect email or password"
    }

    if (Object.keys(errors).length >= 1) {
        return { errors, payload: formData, status: 400 }
    }


    try {

        if (email.match(/^\d{7}@upm.edu.sa/)) {
            await createUserSession(user[0].id, Roles.Student)
        } else if (email.match(/@upm.edu.sa/)) {
            await createUserSession(user[0].id, Roles.Admission)
        } else {
            await createUserSession(user[0].id, Roles.Partner_University_Admissions)
        }


    } catch (error) {
        errors.unknownError = error instanceof Error ? error.message : String(error)
    }
    redirect(`/${RolesURLS[user[0].role]}`)

}

export async function logOut() {
    try {
        await deleteSession()
    } catch (error) {
        return error
    }
    redirect("/login")
}

export async function deleteUserAction(id: string) {
    const user = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(user.role, "user:delete")
    if (isAuthorized === undefined) {
        return
    }

    await deleteUser(id)
    revalidatePath("/admission/users")
}

export async function createUser(prevState: signUpFormState, formData: FormData) {

    const currentUser = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })
    const isAuthorized = await authorize(currentUser.role, "user:create")
    if (isAuthorized === undefined) {
        return
    }

    const errors: CreateUserErrors = {}

    const fName = formData.get("first-name") as string
    const lName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string
    const uniName = formData.get("uni-name") as string
    const uniLocation = formData.get("uni-location") as string
    const gpa = formData.get("gpa") as string
    const level = formData.get("level") as string


    // Validate Input

    if (!fName) {
        errors.firstName = "First Name Cannot Be Empty"
    }

    if (!lName) {
        errors.lastName = "Last Name Cannot Be Empty"
    }

    if (fName.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.firstName = "First Name Cannot have special characters"
    }

    if (lName.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.lastName = "Last Name Cannot have special characters"
    }

    if (fName.match(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/ug)) {
        errors.firstName = "First Name Cannot have emojies or number"
    }

    if (lName.match(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/ug)) {
        errors.lastName = "Last Name Cannot have emojies or numbers"
    }

    if (role === Roles.Partner_University_Admissions) {
        if (!uniName) {
            errors.universityName = "University Name cannot be empty"
        }
        if (!uniLocation) {
            errors.universityLocation = "University Location cannot be empty"
        }
    }

    if (!email) {
        errors.email = "Email Cannot Be Empty"
    }

    if (role === Roles.Student) {
        if (!gpa) {
            errors.gpa = "GPA cannot be left"
        }
        if (!level) {
            errors.level = "Level cannot be empty"
        }

        if (+gpa < 0 || +gpa > 4) {
            errors.gpa = "Invalid GPA"
        }

        if (+level < 1 || +level > 8) {
            errors.level = "Invalid Level"
        }

        if (!(email.match(/^\d{7}@upm.edu.sa/))) {
            errors.email = "Incorrect UPM student email"
        }
    }



    if (!password) {
        errors.password = "Password Cannot be Empty"
    }

    if (password.length < 6) {
        errors.password = "Password Length Should be more than 6 characters"
    }

    if (role !== Roles.Admission && role !== Roles.Student && role !== Roles.Partner_University_Admissions) {
        errors.role = "Invalid Role"
    }

    const user = await userExists(email) as User

    if (user[0] != null) {
        errors.unknownError = "Cannot create user, user exists"
    }

    if (Object.keys(errors).length >= 1) {
        return { errors, payload: formData, status: 400 }
    }


    try {
        const salt = generateSalt()
        const hashedPassword = await hash(password, salt)
        const userId = await insertUser(fName, lName, email, hashedPassword, salt, role)

        if (role === Roles.Student) {
            const studid = email.slice(0, 7)
            await insertStudent(+studid, +gpa, +level, userId)
        } else if (role === Roles.Partner_University_Admissions) {
            await insertPartner(uniName, uniLocation, userId)
        }

        // Insert into partner_university if the role is that

        revalidatePath("/admission/users")
    } catch (error) {
        errors.unknownError = error instanceof Error ? error.message : String(error)
    }
}

// export async function getUserByIdAction(id: string) {
//     return await getUserById(id)
// }

export async function updateUserProfile(prevState: signUpFormState, formData: FormData) {

    const currentUser = await getCurrentUser({ fullUser: false, redirectIfNotFound: true })

    const errors: UpdateUserProfileErrors = {}

    const fName = formData.get("first-name") as string
    const lName = formData.get("last-name") as string
    const password = formData.get("password") as string
    const uniName = formData.get("uni-name") as string
    const uniLocation = formData.get("uni-location") as string
    const gpa = formData.get("gpa") as string
    const level = formData.get("level") as string


    // Validate Input

    if (!fName) {
        errors.firstName = "First Name Cannot Be Empty"
    }

    if (!lName) {
        errors.lastName = "Last Name Cannot Be Empty"
    }

    if (fName.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.firstName = "First Name Cannot have special characters"
    }

    if (lName.match(/(<|>|"|!|&|\*|\(|\)|=|\+|\^|'|"|`|\@|#|%|\$|~|\|)/gm)) {
        errors.lastName = "Last Name Cannot have special characters"
    }

    if (fName.match(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/ug)) {
        errors.firstName = "First Name Cannot have emojies or number"
    }

    if (lName.match(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/ug)) {
        errors.lastName = "Last Name Cannot have emojies or numbers"
    }

    if (currentUser.role === Roles.Partner_University_Admissions) {
        if (!uniName) {
            errors.universityName = "University Name cannot be empty"
        }
        if (!uniLocation) {
            errors.universityLocation = "University Location cannot be empty"
        }
    }

    if (currentUser.role === Roles.Student) {
        if (!gpa) {
            errors.gpa = "GPA cannot be left"
        }
        if (!level) {
            errors.level = "Level cannot be empty"
        }

        if (+gpa < 0 || +gpa > 4) {
            errors.gpa = "Invalid GPA"
        }

        if (+level < 1 || +level > 8) {
            errors.level = "Invalid Level"
        }
    }



    if (!password) {
        errors.password = "Password Cannot be Empty"
    }

    if (password.length < 6) {
        errors.password = "Password Length Should be more than 6 characters"
    }

    if (Object.keys(errors).length >= 1) {
        return { errors, payload: formData, status: 400 }
    }

    try {
        const salt = generateSalt()
        const hashedPassword = await hash(password, salt)
        await updateUser(currentUser.userId, fName, lName, hashedPassword, salt)

        if (currentUser.role === Roles.Student) {
            await updateStudent(currentUser.userId, +gpa, +level)
        } else if (currentUser.role === Roles.Partner_University_Admissions) {
            await updatePartner(currentUser.userId, uniName, uniLocation)
        }


        revalidatePath("/admission/users")
    } catch (error) {
        errors.unknownError = error instanceof Error ? error.message : String(error)
    }
}