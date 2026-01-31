"use client"
import Submit from '@/components/submit'
import React from 'react'



function Generatexlsx({apiURL, query, status, fileName} : {apiURL: string, query?:string, status?: string, fileName: string}) {

    
    let seachParams = ""
    if (query && status) {
        seachParams = `?query=${query}&status=${status}`
    } else if (query) {
        seachParams = `?query=${query}`
    } else if (status) {
        seachParams = `?status=${status}`
    }

    const handleSubmit = async() => {

        const res = await fetch(`${apiURL}${seachParams}`, {
            method: "POST",
        })

        if (res.ok) {
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        }
        
    }

    return (
        <form action={handleSubmit}>
            <Submit variant='default' text="Generate xlsx File"></Submit>
        </form>
    )
}

export default Generatexlsx
