'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import UpdateUserModal from './updateUserModal'


function UpdateUser({id} : {id:string}) {

        const [open, setOpen] = useState(false)
    
        function handleOpen() {
            setOpen(!open)
        }

    return (
        <>
        <Button variant="outline" onClick={handleOpen} >Update User</Button>
        {open && <UpdateUserModal id={id} handleOpen={handleOpen}></UpdateUserModal>}
        </>
    )
}

export default UpdateUser
