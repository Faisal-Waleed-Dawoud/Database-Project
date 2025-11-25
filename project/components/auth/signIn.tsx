'use client'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import Form from 'next/form'
import Submit from '../submit'
import { useFormState } from 'react-dom'
import { signIn } from '@/lib/db/actions/users'
import { signInFormErrors } from '@/lib/types'

export type signInFormState = {
    errors: signInFormErrors,
    payload: FormData,
    status: number
}

function SignIn() {
        const initalState: signInFormState = {
            errors: {}
        }
        
        const [visible, setVisible] = useState(false)

        const [state, formAction] = useFormState(signIn, initalState)

    return (
        <Form className='flex flex-col gap-2' action={formAction}>
            {state?.errors?.unknownError && <p className='text-red-500'>{state.errors.unknownError}</p>}
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
                        :<Eye onClick={() => setVisible(!visible)} className='eye-icon-color'></Eye>}
                </label>
                {state?.errors?.password && <p className='text-red-500'>{state.errors.password}</p>}
            </div>
            <Submit></Submit>
        </Form>
    )
}

export default SignIn
