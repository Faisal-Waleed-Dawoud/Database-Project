import CreateUser from '@/app/(dashboard)/admission/users/components/createUser';
import DeleteUser from '@/app/(dashboard)/admission/users/components/deleteUser';
import UpdateUser from '@/app/(dashboard)/admission/users/components/updateUser';
import Pagination from '@/components/pagination';
import Search from '@/components/search';
import { getUsers, getUsersCount } from '@/lib/db/users'
import { MAX_ROWS, User } from '@/lib/types';
import { getCurrentUser } from '@/lib/utils';
import React from 'react'



async function Page({searchParams} : {searchParams: Promise<{query: string, page?: number}>}) {

    const {query, page} = await searchParams

    const currentUser = await getCurrentUser({fullUser: false, redirectIfNotFound: false})
    const pageNumber = page || 1
    const usersCount = await getUsersCount(query)
    const pages = Math.ceil(usersCount / MAX_ROWS)
    const users = await getUsers(query, pageNumber) as User[]

    const rows = []
    for (let i = 0; i < users.length; i++) {
        rows.push(<tr key={i} className='hover:bg-[#eee] duration-300 border-b-2 border-b-gray-100'>
            <td className='table-custom-cell'>{users[i].firstName}</td>
            <td className='table-custom-cell'>{users[i].lastName}</td>
            <td className='table-custom-cell'>{users[i].email}</td>
            <td className='table-custom-cell'>{users[i].role}</td>
            <td className='table-custom-cell'>
                <div className='flex gap-2 items-center justify-center'>
                    {currentUser?.userId != users[i].id && <>
                        <DeleteUser id={users[i].id}></DeleteUser>
                        <UpdateUser id={users[i].id}></UpdateUser>
                    </>
                    }
                </div>
            </td>
        </tr>)
    }

    return (
        <>
            <div className='rounded-md shadow-custom p-3 overflow-x-auto'>
                <div className='mb-3 flex justify-between'>
                    <h2 className='text-3xl font-semibold'>Users</h2>
                    <div className='flex gap-2 items-center'>
                        <CreateUser></CreateUser>
                        <Search url='/admission/users' text='search for a user'></Search>
                    </div>
                </div>
                {+pageNumber < 1 || +pageNumber > pages ? <p>Data not found</p> :
                <>
                <table className='w-full mb-3'>
                    <thead>
                        <tr className='border-b-2 border-b-gray-100'>
                            <td className='table-custom-cell'>
                                First Name
                            </td>
                            <td className='table-custom-cell'>
                                Last Name
                            </td>
                            <td className='table-custom-cell'>
                                Email
                            </td>
                            <td className='table-custom-cell'>
                                Role
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
