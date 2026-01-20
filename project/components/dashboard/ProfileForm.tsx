'use client'
import Input from '@/components/input'
import Submit from '@/components/submit'
import { updateUserProfile } from '@/lib/db/actions/users'
import { CreateUserErrors, PartnerUni, Student, User } from '@/lib/types'
import { Eye, EyeOff } from 'lucide-react'
import Form from 'next/form'
import React, { useActionState, useState } from 'react'

type createUserFormState = {
    errors: CreateUserErrors,
    payload: FormData,
    state: number
}


function ProfileForm({user, student, partnerUni}: {user:User, student?:Student, partnerUni?: PartnerUni}) {

    const [visible, setVisible] = useState(false)
    const initalState: createUserFormState = {
        errors: {}
    }


    const [state, formAction] = useActionState(updateUserProfile, initalState)


    return (
            <Form action={formAction} className='flex flex-col gap-2 justify-between'>
                {state?.errors?.unknownError && <p className='text-red-500'>{state.errors.unknownError}</p>}
                <div className='grid columns-2 gap-3'>
                    <div className='flex gap-2 items-center'>
                        <Input
                            title='First Name'
                            id='fName'
                            name='first-name'
                            errorName='firstName'
                            state={state}
                            defaultValue={user.firstName}
                        />
                        <Input
                            title='Last Name'
                            id='lName'
                            name='last-name'
                            errorName='lastName'
                            state={state}
                            defaultValue={user.lastName}
                        />
                    </div>
                    {user.role === "partner_university_admission" && (
                        <div className='flex gap-2 items-center'>
                            <Input
                                title='University Name'
                                id='uni-name'
                                name='uni-name'
                                errorName='universityName'
                                state={state}
                                defaultValue={partnerUni?.partner_uni_name}
                            />
                            <Input
                                title='University Location'
                                id='uni-location'
                                name='uni-location'
                                errorName='universityLocation'
                                state={state}
                                defaultValue={partnerUni?.location}
                            />
                        </div>
                    )}
                    {user.role === "student" && (
                        <div className='flex gap-2 items-center'>
                            <Input
                                title='Cumlative GPA'
                                id='gpa'
                                name='gpa'
                                errorName='gpa'
                                state={state}
                                defaultValue={student?.gpa}
                            />
                            <Input
                                title='Level'
                                id='lvl'
                                name='level'
                                errorName='level'
                                state={state}
                                defaultValue={student?.level}
                            />
                        </div>
                    )}
                    <Input
                        title='Email'
                        id='email'
                        name='email'
                        errorName='email'
                        state={state}
                        defaultValue={user.email}
                        readonly={true}
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
                    <Submit variant='default' text='Update Profile'></Submit>
                </div>
            </Form>
    )
}

export default ProfileForm
