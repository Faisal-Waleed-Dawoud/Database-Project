import Submit from '@/components/submit'
import Form from 'next/form'
import React from 'react'
import { rejectEnrollment } from '../lib/actions'



function EnrollmentReject({courseId, studentId}: {courseId: string, studentId: number}) {
    

    return (
        <>
            <Form action={rejectEnrollment.bind(null, courseId, studentId)}>
                <Submit text='Reject' variant='destructive'></Submit>
            </Form>
        </>
    )
}

export default EnrollmentReject
