'use client'
import React from 'react'
import Modal from '../modal'


function ProfileModal({handleOpen, children}: {handleOpen: () => void, children:React.ReactNode}) {


    return (
        <>
            <Modal title='Profile' handleOpen={handleOpen}>
                {children}
            </Modal>
        </>
    )
}

export default ProfileModal
