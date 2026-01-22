export interface User  {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    salt: string,
    role: Roles
}

export interface signUpFormErrors  {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    unknownError: string,
}

export interface signInFormErrors {
    email: string,
    password: string,
    unknownError: string,
}

export interface UserSession {
    userId: string,
    role: Roles
}

export interface Session  {
    id: string,
    userId: string,
    sessionToken: string,
    expireDate: number,
}

export interface CreateUserErrors extends signUpFormErrors {
    role: string,
    universityName?: string,
    universityLocation?:string,
    gpa?: string,
    level?: string
}

export interface UpdateUserProfileErrors extends signUpFormErrors {
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

export interface BaseFormState {
    errors?: Record<string, string>
    payload?: FormData,
    [key: string]: any
}

export interface InputProps<S extends BaseFormState = BaseFormState> {
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

export interface Student {
    gpa: number,
    level: number,
    student_id: number,
    user_id: string
}

export interface PartnerUni {
    partner_uni_id: string,
    partner_uni_name: string,
    location: string,
    user_id: string
}