'use client'
import Form from 'next/form'
import React, { useActionState } from 'react'
import { enroll } from '../lib/actions'
import Submit from '@/components/submit'
import { EnrollmentFormErrors } from '../lib/types'

type EnrollFormState = {
    errors: EnrollmentFormErrors,
    state: number,
}

function CourseEnroll({courseId} : {courseId: string}) {

    const initalState: EnrollFormState = {
        errors: {}
    }

    const enrollWithId = enroll.bind(null, courseId)

    const [state, action] = useActionState(enrollWithId, initalState)
    
    
    return (
        <Form action={action}>
            <Submit variant='default' text='Enroll'></Submit>
            {(state?.errors?.gpa) && <p className='text-red-400'>{state?.errors?.gpa}</p>}
        </Form>
    )
}

export default CourseEnroll
