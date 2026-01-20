'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import DeleteUserModal from './deleteUserModal'


function DeleteUser({ id }: { id: string }) {

    const [open, setOpen] = useState(false)

    function handleOpen() {
        setOpen(!open)
    }

    return (
        <>
            <Button variant="destructive" onClick={handleOpen} className='hover:bg-red-700 duration-300 cursor-pointer'>Delete User</Button>
            {open && <DeleteUserModal id={id} handleOpen={handleOpen}></DeleteUserModal>}
        </>
    )
}

export default DeleteUser
