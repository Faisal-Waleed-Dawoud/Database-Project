import Input from '@/components/input'
import Modal from '@/components/modal'
import Submit from '@/components/submit'
import { createUser } from '@/lib/db/actions/users'
import { CreateUserErrors } from '@/lib/types'
import { Eye, EyeOff } from 'lucide-react'
import Form from 'next/form'
import React, { useActionState, useState } from 'react'

type createUserFormState = {
    errors: CreateUserErrors,
    payload: FormData,
    state: number
}


function CreateUserModal({ handleOpen }: { handleOpen: () => void }) {

    const [visible, setVisible] = useState(false)
    const initalState: createUserFormState = {
        errors: {}
    }
    

    const [role, setRole] = useState("")

    const [state, formAction] = useActionState(createUser, initalState)

    
    return (
        <Modal title='Create User' handleOpen={handleOpen}>
            <Form action={formAction} className='flex flex-col gap-2 justify-between'>
                {state?.errors?.unknownError && <p className='text-red-500'>{state.errors.unknownError}</p>}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='role'>Role <span className='text-red-500'>*</span></label>
                    <input onChange={(e) => setRole(e.target.value)} defaultValue={state?.payload?.get("role") as string} placeholder='e.g: student or admission or partner_university_admission' className={`placeholder:text-sm placeholder:text-[#bbb] input-field ${state?.errors.role && "outline-red-500"}`} type='text' id='role' name='role'></input>
                    {state?.errors?.role && <p className='text-red-500'>{state.errors.role}</p>}
                </div>
                <div className='grid columns-2 gap-3'>
                    <div className='flex gap-2 items-center'>
                        <Input
                            title='First Name'
                            id='fName'
                            name='first-name'
                            errorName='firstName'
                            state={state}
                        />
                        <Input
                            title='Last Name'
                            id='lName'
                            name='last-name'
                            errorName='lastName'
                            state={state}
                        />
                    </div>
                    {role === "partner_university_admission" && (
                        <div className='flex gap-2 items-center'>
                            <Input
                                title='University Name'
                                id='uni-name'
                                name='uni-name'
                                errorName='universityName'
                                state={state}
                            />
                            <Input
                                title='University Location'
                                id='uni-location'
                                name='uni-location'
                                errorName='universityLocation'
                                state={state}
                            />
                        </div>
                    )}
                    {role === "student" && (
                        <div className='flex gap-2 items-center'>
                            <Input
                                title='Cumlative GPA'
                                id='gpa'
                                name='gpa'
                                errorName='gpa'
                                state={state}
                            />
                            <Input
                                title='Level'
                                id='lvl'
                                name='level'
                                errorName='level'
                                state={state}
                            />
                        </div>
                    )}
                    <Input
                        title='Email'
                        id='email'
                        name='email'
                        errorName='email'
                        state={state}
                    />
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='pass'>Password <span className='text-red-500'>*</span></label>
                        <label htmlFor='pass' className={`input-field focus-within:outline-4 flex ${state?.errors.password && "outline-red-500"}`}>
                            <input defaultValue={state?.payload?.get("password") as string} className={`w-full focus:outline-none`} type={`${visible ? "text" : "password"}`} id='pass' name='password'></input>
                            {visible ?
                                <EyeOff onClick={() => setVisible(!visible)} className='eye-icon-color'></EyeOff>
                                : <Eye onClick={() => setVisible(!visible)} className='eye-icon-color'></Eye>}
                        </label>
                        {state?.errors?.password && <p className='text-red-500'>{state.errors.password}</p>}
                    </div>
                    <Submit variant='default' text='Create User'></Submit>
                </div>
            </Form>
        </Modal>
    )
}

export default CreateUserModal
