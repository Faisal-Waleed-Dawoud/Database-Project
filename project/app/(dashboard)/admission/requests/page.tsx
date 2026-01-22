import Pagination from "@/components/pagination";
import { MAX_ROWS, Status } from "@/lib/types";
import React from "react";
import { UniversitiesCourses } from "./lib/types";
import {
    getUniCourses,
    getUniCoursesCount,
} from "./lib/db";
import Search from "@/components/search";
import Link from "next/link";
import { File } from "lucide-react";
import CourseAccept from "./components/CourseAccept";
import CourseReject from "./components/CourseReject";

async function Page({
    searchParams,
}: {
    searchParams: Promise<{ query: string; page?: number }>;
}) {
    const { query, page } = await searchParams;

    const pageNumber = page || 1;
    const uniCoursesCount = await getUniCoursesCount(query);
    const pages = Math.ceil(uniCoursesCount / MAX_ROWS);
    const uniCourses = (await getUniCourses(
        query,
        pageNumber,
    )) as UniversitiesCourses[];

    const rows = [];
    for (let i = 0; i < uniCourses.length; i++) {
        const statusColor =
            uniCourses[i].course_status === Status.pending
                ? "bg-yellow-200"
                : uniCourses[i].course_status === Status.approved
                    ? "bg-green-200"
                    : "bg-red-200";
        rows.push(
            <tr
                key={i}
                className="hover:bg-[#eee] duration-300 border-b-2 border-b-gray-100"
            >
                <td className="table-custom-cell">{uniCourses[i].partner_uni_name}</td>
                <td className="table-custom-cell">{uniCourses[i].location}</td>
                <td className="table-custom-cell">{uniCourses[i].course_name}</td>
                <td className="table-custom-cell">{uniCourses[i].course_code}</td>
                <td className="table-custom-cell">
                    <span className={`${statusColor} px-2 py-1 rounded-lg`}>
                        {uniCourses[i].course_status}
                    </span>
                </td>
                <td className="table-custom-cell flex justify-center">
                    <Link
                        href={uniCourses[i].syllabus}
                        className="w-fit flex justify-center items-center"
                    >
                        <File className="duration-300 w-10 h-10 p-2 hover:bg-blue-400 hover:text-white rounded-lg"></File>
                    </Link>
                </td>
                <td className="table-custom-cell">
                    <div className="flex gap-2 items-center justify-center">
                        {uniCourses[i].course_status === Status.pending && (
                            <>
                                <CourseAccept courseId={uniCourses[i].course_id}></CourseAccept>
                                <CourseReject courseId={uniCourses[i].course_id}></CourseReject>
                            </>
                        )}
                    </div>
                </td>
            </tr>,
        );
    }

    return (
        <>
            <div className="rounded-md shadow-custom p-3 overflow-x-auto">
                <div className="mb-3 flex justify-between">
                    <h2 className="text-3xl font-semibold">Requests</h2>
                    <div className="flex gap-2 items-center">
                        <Search
                            url="/admission/requests"
                            text="search for a request"
                        ></Search>
                    </div>
                </div>
                {+pageNumber < 1 || +pageNumber > pages ? (
                    <p>Data not found</p>
                ) : (
                    <>
                        <table className="w-full mb-3">
                            <thead>
                                <tr className="border-b-2 border-b-gray-100">
                                    <td className="table-custom-cell">University Name</td>
                                    <td className="table-custom-cell">University Location</td>
                                    <td className="table-custom-cell">Course Name</td>
                                    <td className="table-custom-cell">Course Code</td>
                                    <td className="table-custom-cell">Status</td>
                                    <td className="table-custom-cell">Syllabus</td>
                                    <td className="table-custom-cell">Actions</td>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                        <Pagination pageNumber={pageNumber} pageLimit={pages}></Pagination>
                    </>
                )}
            </div>
        </>
    );
}

export default Page;
