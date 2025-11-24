'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'
import Spinner from './spinner'



function Submit() {

    const {pending} = useFormStatus()

    return (
        <button disabled={pending} className='mt-2 bg-blue-500 duration-300 hover:bg-blue-600 cursor-pointer text-white rounded-sm px-2 py-1'>
            {pending && <Spinner></Spinner>}
            Submit
        </button>
    )
}

export default Submit
