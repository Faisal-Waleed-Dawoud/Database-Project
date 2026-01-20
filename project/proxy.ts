import { Roles, RolesURLS } from "@/lib/types";
import { getCurrentUser } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const admission = '/admission'
const student = '/student'
const partner = '/partner_university'
const authRoutes = ['/login', '/register']

export default async function proxy(req: NextRequest) {

    const path = req.nextUrl.pathname
    const isStudent = path.startsWith(student)
    const isAdmission = path.startsWith(admission)
    const isPartner = path.startsWith(partner)
    const isAuthRoute = authRoutes.includes(path)

    const user = await getCurrentUser({fullUser: false, redirectIfNotFound: false})
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL(`/${RolesURLS[user.role]}`, req.url))
    }

    if (!user && (isAdmission || isStudent || isPartner)) {
        return NextResponse.redirect(new URL(`/login`, req.url))
    }
    
    if (isAdmission && user?.role != Roles.Admission) {
        return NextResponse.redirect(new URL("/not-found", req.url))
    } else if (isStudent && user?.role != Roles.Student) {
        return NextResponse.redirect(new URL("/not-found", req.url))
    } else if (isPartner && user?.role != Roles.Partner_University_Admissions) {
        return NextResponse.redirect(new URL("/not-found", req.url))
    }


}

export const config = {
    matcher: ['/:path*'],
}