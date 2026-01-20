'use client'
import { logOut } from '@/lib/db/actions/users'
import { Roles } from '@/lib/types'
import { BookCopyIcon, FolderOpen, LogOutIcon, School, Users, UsersIcon } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'



function Links({role} : {role: Roles}) {

        const urls = {
        student: [
            {name: "Enrollments", icon: <BookCopyIcon></BookCopyIcon>, url: "/student/enrollments"},
            {name: "Courses", icon: <FolderOpen></FolderOpen>, url: "/student/courses"}
        ], 
        admission: [
            {name: "Users", icon: <UsersIcon></UsersIcon>, url: "/admission/users"},
            {name: "Requests", icon: <FolderOpen></FolderOpen>, url: "/admission/requests"},
            {name: "Enrollments", icon: <School></School>, url: "/admission/enrollments"}
        ],
        partner_university_admission : [
            {name: "Courses", icon: <BookCopyIcon></BookCopyIcon>, url: "/partner_university/courses"},
            {name: "Students", icon: <Users></Users>, url: "/partner_university/students"}
        ]
    }

    const path = usePathname()

    return (
        <nav className="sm:w-[180px] w-fit bg-gray-50 flex flex-col justify-between p-2">
            <ul className="flex flex-col gap-3">
                {urls[role].map((url : {name: string, icon: ReactNode, url: string}) => {
                    const isActiveLink = path === url.url || path.includes(url.url.split("/")[2])
                    return (
                    <li key={url.name} className={`rounded-md hover:bg-blue-400 hover:text-white duration-300 ${isActiveLink ? "bg-blue-400 text-white" : ""}`}>
                        <Link href={url.url} className="flex gap-2 p-2">
                            {url.icon} <span className='hidden sm:block'>{url.name}</span>
                        </Link>
                    </li>
                )})}
            </ul>
            <div className='rounded-md hover:bg-red-400 hover:text-white duration-300 p-2'>
                <Form action={logOut}>
                    <button className='flex gap-2 w-full cursor-pointer items-center'><LogOutIcon></LogOutIcon> <span className='hidden sm:block'>Log Out</span></button>
                </Form>
            </div>
        </nav>
    )
}

export default Links
