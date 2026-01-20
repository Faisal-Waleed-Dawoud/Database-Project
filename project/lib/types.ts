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

export type CreateUserErrors = signUpFormErrors & {
    role: string,
    universityName?: string,
    universityLocation?:string,
    gpa?: string,
    level?: string
}

export type UpdateUserProfileErrors = signUpFormErrors & {
    universityName?: string,
    universityLocation?:string,
    gpa?: string,
    level?: string
}

export enum Roles {
    Student = "student",
    Admission = "admission",
    Partner_University_Admissions = "partner_university_admission"
}

export const MAX_ROWS = 5;

export enum RolesURLS {
    student = "student",
    admission = "admission",
    partner_university_admission = "partner_university"
}

export type BaseFormState = {
    errors?: Record<string, string>
    payload?: FormData,
    [key: string]: any
}

export type InputProps<S extends BaseFormState = BaseFormState> = {
    title: string,
    id:string,
    name: string,
    state?: S,
    errorName?: string,
    type?: string,
    defaultValue?: string | number
    readonly?: boolean
}

export enum Status {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}

export type Student = {
    gpa: number,
    level: number,
    student_id: number,
    user_id: string
}

export type PartnerUni = {
    partner_uni_id: string,
    partner_uni_name: string,
    location: string,
    user_id: string
}