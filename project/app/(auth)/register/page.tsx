import SingUp from '@/components/auth/singUp'
import { getCurrentUser } from '@/lib/utils'
import React from 'react'


async function Page() {

    const user = await getCurrentUser({fullUser: true, redirectIfNotFound: false})
    

    return (
        <div className='flex min-h-screen'>
            <div className='bg-blue-light flex-1/3 hidden md:block'>

            </div>
            <div className='bg-[#f9f9f9] flex-2/3 flex flex-col gap-2 justify-center items-center'>
                <h2 className='text-blue-500 text-3xl font-bold'>Sign Up</h2>
                <SingUp />
                
            </div>
        </div>
    )
}

export default Page
