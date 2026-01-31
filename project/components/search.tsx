"use client"
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'



function Search({text} : {text:string}) {

    const route = useRouter()

    function onSearchChange(e: React.KeyboardEvent<HTMLInputElement>) {
        
        if (e.code === "Enter") {
            const searchParam = new URLSearchParams(window.location.search)
            searchParam.set("query", (e.target as HTMLInputElement).value)
            searchParam.set("page", "1")
            route.push(`${window.location.pathname}?${searchParam}`)
        }
    }

    return (
        <>
        <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="query-input" className='bg-white px-3 py-1 flex items-center outline-2 focus-within:outline-4 duration-300 outline-blue-lighter justify-between rounded-md'>
                <input type="text" onKeyDown={(e) => onSearchChange(e)} className='outline-none focus:outline-none' id="query-input" placeholder={text} />
                <button type="submit" className='cursor-pointer hover:text-blue duration-300'><SearchIcon /></button>
            </label>
        </form>
        </>
    )
}

export default Search
