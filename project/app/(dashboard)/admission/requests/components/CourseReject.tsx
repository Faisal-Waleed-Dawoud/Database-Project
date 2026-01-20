import Form from 'next/form'
import React from 'react'
import { courseReject } from '../lib/actions'
import Submit from '@/components/submit'



function CourseReject({courseId} : {courseId:string}) {


    return (
        <>
            <Form action={courseReject.bind(null, courseId)}>
                <Submit text='Reject' variant='destructive'></Submit>
            </Form>
        </>
    )
}

export default CourseReject
