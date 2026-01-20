import Submit from '@/components/submit'
import Form from 'next/form'
import React from 'react'
import { approveEnrollment } from '../lib/actions'



function EnrollmentAccept({courseId, studentId} : {courseId:string, studentId: number}) {


    return (
        <>
            <Form action={approveEnrollment.bind(null, courseId, studentId)}>
                <Submit text='Accept' variant='default'></Submit>
            </Form>
        </>
    )
}

export default EnrollmentAccept
