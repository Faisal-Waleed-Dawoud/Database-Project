import React from 'react'


function Modal({title, handleOpen, children} : {title:string, handleOpen:() => void, children: React.ReactNode}) {

    return (
        <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full min-h-screen bg-modal-background overflow-hidden">
            <div className="absolute top-1/2 left-1/2 rounded-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-[#f9f9f9] shadow-custom p-5 w-full md:w-[700px]">
                <div>
                    <div className="flex mb-4">
                        <h1 className='text-center grow text-blue-500 font-semibold text-3xl'>{title}</h1>
                        <button type='button' className='closing-btn' onClick={handleOpen}>X</button>
                    </div>
                </div>
                {children}
            </div>
        </div>
)}

export default Modal
