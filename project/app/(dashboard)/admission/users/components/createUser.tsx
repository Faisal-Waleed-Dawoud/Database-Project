'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import CreateUserModal from './createUserModal'


function CreateUser() {

    const [open, setOpen] = useState(false)

    function handleOpen() {
        setOpen(!open)
    }

    return (
        <>
        <Button variant="default" onClick={handleOpen} className='bg-blue-500 hover:bg-blue-600 duration-300'>Create User</Button>
        {open && <CreateUserModal handleOpen={handleOpen}></CreateUserModal>}
        </>
    )
}

export default CreateUser
