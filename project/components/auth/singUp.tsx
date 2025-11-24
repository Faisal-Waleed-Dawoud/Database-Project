'use client'
import { signUp } from '@/lib/db/actions/users'
import { signUpFormErrors } from '@/lib/types'
import React, { useActionState, useState } from 'react'
import Form from 'next/form'
import { Eye, EyeOff } from 'lucide-react'
import Submit from '../submit'

export type signUpFormState = {
    errors: signUpFormErrors,
    payload: FormData,
    status: number
}

function SingUp() {

    const [visible, setVisible] = useState(false)

    const initialState: signUpFormState = {
        errors: {}
    }


    const [state, singUpAction] = useActionState(signUp, initialState)

    return (
        <>
            
            <Form className='flex flex-col gap-2' action={singUpAction}>
                {state?.errors?.unknownError && <p className='text-red-500'>{state.errors.unknownError}</p>}
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='fName'>First Name <span className='text-red-500'>*</span></label>
                        <input defaultValue={state?.payload?.get("first-name") as string} className={`input-field ${state?.errors.firstName && "outline-red-500"}`} type='text' id='fName' name='first-name'></input>
                        {state?.errors?.firstName && <p className='text-red-500'>{state.errors.firstName}</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='lName'>Last Name <span className='text-red-500'>*</span></label>
                        <input defaultValue={state?.payload?.get("last-name") as string} className={`input-field ${state?.errors.lastName && "outline-red-500"}`} type='text' id='lName' name='last-name'></input>
                        {state?.errors?.lastName && <p className='text-red-500'>{state.errors.lastName}</p>}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email'>Email <span className='text-red-500'>*</span></label>
                    <input defaultValue={state?.payload?.get("email") as string} className={`input-field ${state?.errors.email && "outline-red-500"}`} type='email' id='email' name='email'></input>
                    {state?.errors?.email && <p className='text-red-500'>{state.errors.email}</p>}
                </div>
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
                <Submit></Submit>
            </Form>
        </>
    )
}

export default SingUp
