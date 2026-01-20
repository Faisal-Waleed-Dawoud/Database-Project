"use client"
import Submit from '@/components/submit'
import Form from 'next/form'
import React, { useActionState } from 'react'
import { setGrade } from '../lib/actions'



function Grade({studentId, courseId}: {studentId: number, courseId: string}) {

    const setGradeWithIds = setGrade.bind(null, studentId, courseId)

    const [state, action] = useActionState(setGradeWithIds, null)

    return (
        <Form action={action}>
            <select name='grade'>
                <option value={"A+"}>A+</option>
                <option value={"A"}>A</option>
                <option value={"B+"}>B+</option>
                <option value={"B"}>B</option>
                <option value={"C+"}>C+</option>
                <option value={"C"}>C</option>
                <option value={"D+"}>D+</option>
                <option value={"D"}>D</option>
                <option value={"F"}>F</option>
            </select>
            <Submit variant='default' text='Save'></Submit>
        </Form>
    )
}

export default Grade
