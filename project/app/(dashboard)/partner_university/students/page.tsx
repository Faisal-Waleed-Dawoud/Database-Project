import Pagination from '@/components/pagination'
import { MAX_ROWS, Status } from '@/lib/types'
import React from 'react'
import { Courses, enrolledStudents } from './lib/types'
import Search from '@/components/search'
import Link from 'next/link'
import { File } from 'lucide-react'
import { getEnrolledStudents, getEnrollmentsCount } from './lib/db'
import Grade from './components/grade'




async function Page({searchParams} : {searchParams: Promise<{query: string, page?: number}>}) {
const {query, page} = await searchParams

    
    const pageNumber = page || 1
    const enrolledStudentsCount = await getEnrollmentsCount(query)
    const pages = Math.ceil(enrolledStudentsCount / MAX_ROWS)
    const enrolledStudents = await getEnrolledStudents(query, pageNumber) as enrolledStudents[]

    const rows = []
    for (let i = 0; i < enrolledStudents.length; i++) {
        rows.push(<tr key={i} className='hover:bg-[#eee] duration-300 border-b-2 border-b-gray-100'>
            <td className='table-custom-cell'>{enrolledStudents[i].student_id}</td>
            <td className='table-custom-cell'>{enrolledStudents[i].course_name}</td>
            <td className='table-custom-cell'>{enrolledStudents[i].course_code}</td>
            <td className='table-custom-cell'>{enrolledStudents[i].enrollment_date.toISOString().slice(0, 10)}</td>
            <td className='table-custom-cell'>{enrolledStudents[i].finishing_date ? enrolledStudents[i].finishing_date.toISOString().slice(0, 10) : "TBA"}</td>
            <td className='table-custom-cell'>{enrolledStudents[i].grade ? enrolledStudents[i].grade : <Grade studentId={+enrolledStudents[i].student_id} courseId={enrolledStudents[i].course_id}></Grade>}</td>
        </tr>)
    }

    return (
        <>
            <div className='rounded-md shadow-custom p-3 overflow-x-auto'>
                <div className='mb-3 flex justify-between'>
                    <h2 className='text-3xl font-semibold'>Students Enrollments</h2>
                    <div className='flex gap-2 items-center'>
                        <Search url='/partner_university/students' text='search for a student'></Search>
                    </div>
                </div>
                {+pageNumber < 1 || +pageNumber > pages ? <p>Data not found</p> :
                <>
                <table className='w-full mb-3'>
                    <thead>
                        <tr className='border-b-2 border-b-gray-100'>
                            <td className='table-custom-cell'>
                                Student ID
                            </td>
                            <td className='table-custom-cell'>
                                Course Name
                            </td>
                            <td className='table-custom-cell'>
                                Course Code
                            </td>
                            <td className='table-custom-cell'>
                                Enrollment Date
                            </td>
                            <td className='table-custom-cell'>
                                Finishing Date
                            </td>
                            <td className='table-custom-cell'>
                                Grade
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <Pagination pageNumber={pageNumber} pageLimit={pages}></Pagination>
                </>}
            </div>
        </>
    )
}

export default Page
