import { addAdmission } from '@/lib/db/actions/users'
import { insertUser } from '@/lib/db/users'
import { Roles } from '@/lib/types'
import { generateSalt, hash } from '@/lib/utils'
import Form from 'next/form'
import React from 'react'



function Page() {

    return (
        <>
            <h2>Student</h2>
        </>
    )
}

export default Page
