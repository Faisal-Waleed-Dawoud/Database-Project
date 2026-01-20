'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'
import Spinner from './spinner'
import { Button } from './ui/button'



type variants = "default" | "destructive" | "secondary" | "outline" | "ghost" | "link"

function Submit({text, variant}: {text: string, variant: variants}) {

    const {pending} = useFormStatus()

    return (
        <Button disabled={pending} variant={variant}>
            {pending && <Spinner></Spinner>}
            {text}
        </Button>
    )
}

export default Submit
