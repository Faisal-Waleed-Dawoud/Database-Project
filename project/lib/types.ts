export type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    salt: string,
    role: Roles
}

export type signUpFormErrors = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    unknownError: string,
}

export type signInFormErrors = {
    email: string,
    password: string,
    unknownError: string,
}

export type UserSession = {
    userId: string,
    role: Roles
}

export type Session = {
    id: string,
    userId: string,
    sessionToken: string,
    expireDate: number,
}

export enum Roles {
    Student = "Student",
    Admission = "Admission",
    Partner_University_Admissions = "Partner_University_Admissions"
}