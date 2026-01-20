import { SearchIcon } from 'lucide-react'
import Form from 'next/form'
import React from 'react'



function Search({url, text} : {url:string, text:string}) {


    return (
        <>
            <Form action={url}>
                <label htmlFor="query-input" className='bg-white px-3 py-1 flex items-center outline-2 focus-within:outline-4 duration-300 outline-blue-lighter justify-between rounded-md'>
                    <input type="text" className='outline-none focus:outline-none' name="query" id="query-input" placeholder={text} />
                    <button type="submit" className='cursor-pointer hover:text-blue duration-300'><SearchIcon /></button>
                </label>
            </Form>
        </>
    )
}

export default Search
