import Form from 'next/form'
import React from 'react'
import { courseAccept } from '../lib/actions'
import Submit from '@/components/submit'



function CourseAccept({courseId} : {courseId:string}) {


    return (
        <>
            <Form action={courseAccept.bind(null, courseId)}>
                <Submit text='Accept' variant='default'></Submit>
            </Form>
        </>
    )
}

export default CourseAccept
