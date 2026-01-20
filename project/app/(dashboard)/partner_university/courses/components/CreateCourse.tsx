'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import CreateUserModal from './createUserModal'
import CreateCourseModal from './CreateCourseModal'


function CreateCourse() {

    const [open, setOpen] = useState(false)

    function handleOpen() {
        setOpen(!open)
    }

    return (
        <>
        <Button variant="default" onClick={handleOpen} className='bg-blue-500 hover:bg-blue-600 duration-300'>Create Course</Button>
        {open && <CreateCourseModal handleOpen={handleOpen}></CreateCourseModal>}
        </>
    )
}

export default CreateCourse
