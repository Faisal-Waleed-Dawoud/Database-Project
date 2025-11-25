import SingUp from '@/components/auth/singUp'
import Link from 'next/link'
import React from 'react'


function Page() {

    return (
        <div className='flex min-h-screen'>
            <div className='bg-blue-light flex-1/3 hidden md:block'>

            </div>
            <div className='bg-[#f9f9f9] flex-2/3 flex flex-col gap-2 justify-center items-center'>
                <h2 className='text-blue-500 text-3xl font-bold'>Sign Up</h2>
                <SingUp />
                <div>
                    <Link className='text-sm text-blue-400 hover:text-blue-500 duration-300' href={"/login"}>Already have an account? Log in here</Link>
                </div>
            </div>
        </div>
    )
}

export default Page
