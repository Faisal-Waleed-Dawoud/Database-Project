import Modal from '@/components/modal'
import Submit from '@/components/submit'
import { deleteUserAction } from '@/lib/db/actions/users'
import Form from 'next/form'
import React from 'react'


function DeleteUserModal({ handleOpen, id }: { handleOpen: () => void, id:string }) {

    return (
        <>
            <Modal title='Delete User' handleOpen={handleOpen}>
                <Form action={deleteUserAction.bind(null, id)} className='grid gap-2'>
                    <p className='text-gray-500 text-sm'>Are you sure you want to delete the user?</p>
                    <Submit variant='destructive' text='Delete User'></Submit>
                </Form>
            </Modal>
        </>
    )
}

export default DeleteUserModal
