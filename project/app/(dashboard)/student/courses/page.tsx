import Pagination from '@/components/pagination'
import { MAX_ROWS } from '@/lib/types'
import React from 'react'
import { ApprovedCourses} from './lib/types'
import { getApprovedCourses, getApprovedCoursesCount } from './lib/db'
import Search from '@/components/search'
import Link from 'next/link'
import { File } from 'lucide-react'
import CourseEnroll from './components/CourseEnroll'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/utils'



async function Page({searchParams} : {searchParams: Promise<{query: string, page?: number}>}) {
const {query, page} = await searchParams

    const currentUser = await getCurrentUser({fullUser: false})
    const pageNumber = page || 1
    const approvedCoursesCount = await getApprovedCoursesCount(query)
    const pages = Math.ceil(approvedCoursesCount / MAX_ROWS)
    const approvedCourses = await getApprovedCourses(query, pageNumber) as ApprovedCourses[]

    const rows = []
    for (let i = 0; i < approvedCourses.length; i++) {
        rows.push(<tr key={i} className='hover:bg-[#eee] duration-300 border-b-2 border-b-gray-100'>
            <td className='table-custom-cell'>{approvedCourses[i].partner_uni_name}</td>
            <td className='table-custom-cell'>{approvedCourses[i].location}</td>
            <td className='table-custom-cell'>{approvedCourses[i].course_name}</td>
            <td className='table-custom-cell'>{approvedCourses[i].course_code}</td>
            <td className='table-custom-cell'>
                <div className='flex gap-2 items-center justify-center'>
                    {(approvedCourses[i].status === null || (approvedCourses[i].user_id === currentUser?.userId && approvedCourses[i].status !== null)) ? 
                    <CourseEnroll courseId={approvedCourses[i].course_id}></CourseEnroll>
                    : <Button className='opacity-50 cursor-not-allowed' variant={"default"}>Applied</Button>}
                </div>
            </td>
        </tr>)
    }

    return (
        <>
            <div className='rounded-md shadow-custom p-3 overflow-x-auto'>
                <div className='mb-3 flex justify-between'>
                    <h2 className='text-3xl font-semibold'>Courses</h2>
                    <div className='flex gap-2 items-center'>
                        <Search url='/student/courses' text='search for a course'></Search>
                    </div>
                </div>
                {+pageNumber < 1 || +pageNumber > pages ? <p>Data not found</p> :
                <>
                <table className='w-full mb-3'>
                    <thead>
                        <tr className='border-b-2 border-b-gray-100'>
                            <td className='table-custom-cell'>
                                University Name
                            </td>
                            <td className='table-custom-cell'>
                                University Location
                            </td>
                            <td className='table-custom-cell'>
                                Course Name
                            </td>
                            <td className='table-custom-cell'>
                                Course Code
                            </td>
                            <td className='table-custom-cell'>
                                Actions
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
