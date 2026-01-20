import Input from '@/components/input'
import Modal from '@/components/modal'
import Submit from '@/components/submit'
import Form from 'next/form'
import { CreateCourseErrors } from '../lib/types'
import { createCourse } from '../lib/actions'
import { useActionState, useRef, useState } from 'react'
import { File, UploadIcon, X } from 'lucide-react'



function CreateCourseModal({ handleOpen }: { handleOpen: () => void }) {

    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFile(e.target.files[0]);
    }

    function handleClearFile() {
        setFile(null);
        fileRef.current.value = null;
    }

    const initalState: CreateCourseErrors = {
        errors: {}
    }

    const [state, formAction] = useActionState(createCourse, initalState)

    


    return (
        <Modal title='Create Course' handleOpen={handleOpen}>
            <Form action={formAction} onSubmit={() => setFile(null)} className='flex flex-col gap-2 justify-between'>
                {state?.errors?.unknownError && <p className='text-red-500'>{state.errors.unknownError}</p>}
                <div className='grid columns-2 gap-3'>
                    <div className='flex gap-2 items-center'>
                        <Input
                            title='Course Name'
                            id='CName'
                            name='course-name'
                            errorName='courseName'
                            state={state}
                        />
                        <Input
                            title='Course Code'
                            id='CCode'
                            name='course-code'
                            errorName='courseCode'
                            state={state}
                        />
                    </div>
                    <div>
                        <span>Syllabus <span className='text-red-500'>*</span></span>
                        <div className={`${file ? "hidden" : "block"} mt-1`}>
                            <label htmlFor='syllabus' className={`min-h-24 p-3 flex gap-2 items-center justify-center flex-col outline-dashed outline-4 cursor-pointer rounded-md duration-300 ${state?.errors.syllabus ? "outline-red-400" : ""}`}>
                                <UploadIcon></UploadIcon>
                                <p className='text-sm text-[#888]'>syllabus format should be pdf only</p>
                            </label>
                            <input accept='.pdf' onChange={handleFileChange} type="file" name="syllabus" className='hidden' id="syllabus" />
                            {state?.errors.syllabus && <p className='text-red-400'>{state.errors.syllabus}</p>}
                        </div>
                            {file && <div className='bg-gray-100 flex justify-between items-center p-2 rounded-lg shadow-custom'>
                                <div className='flex items-center gap-2'>
                                    <File className='text-2xl'></File>
                                    <div>
                                        <h3>{file.name}</h3>
                                        <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button className='hover:text-white hover:bg-red-400 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer duration-300' onClick={handleClearFile}><X></X></button>
                            </div>}
                    </div>
                    <Submit variant='default' text='Create Course'></Submit>
                </div>
            </Form>
        </Modal>
    )
}

export default CreateCourseModal
