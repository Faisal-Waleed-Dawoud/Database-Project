import Pagination from "@/components/pagination";
import { MAX_ROWS, Status } from "@/lib/types";
import React from "react";
import Search from "@/components/search";
import StatusFilter from "@/components/statusFilter";
import Link from "next/link";
import { File } from "lucide-react";
import { getEnrollments, getEnrollmentsCount } from "./lib/db";
import { Enrollments, EnrollmentsStatus } from "./lib/types";
import EnrollmentAccept from "./components/enrollmentAccept";
import EnrollmentReject from "./components/EnrollmentReject";
import { formatDate } from "@/lib/utils";
import Generatexlsx from "@/components/dashboard/generatexlsx";

async function Page({
    searchParams,
}: {
    searchParams: Promise<{ query: string; status: string; page?: number }>;
}) {
    const { query, status, page } = await searchParams;

    const pageNumber = page || 1;
    const enrollmentsCount = await getEnrollmentsCount(query, status);
    const pages = Math.ceil(enrollmentsCount / MAX_ROWS);
    const enrollments = (await getEnrollments(
        query,
        status,
        pageNumber,
    )) as Enrollments[];

    const rows = [];
    for (let i = 0; i < enrollments.length; i++) {
        const statusColor =
            enrollments[i].status === "pending"
                ? "bg-yellow-200"
                : enrollments[i].status === "approved"
                    ? "bg-green-200"
                    : enrollments[i].status === "rejected"
                        ? "bg-red-200"
                        : "bg-green-500 text-white";
        rows.push(
            <tr
                key={i}
                className="hover:bg-[#eee] duration-300 border-b-2 border-b-gray-100"
            >
                <td className="table-custom-cell">{enrollments[i].student_id}</td>
                <td className="table-custom-cell">{enrollments[i].gpa}</td>
                <td className="table-custom-cell">{enrollments[i].level}</td>
                <td className="table-custom-cell">{enrollments[i].partner_uni_name}</td>
                <td className="table-custom-cell">{enrollments[i].location}</td>
                <td className="table-custom-cell">{enrollments[i].course_name}</td>
                <td className="table-custom-cell">{enrollments[i].course_code}</td>
                <td className="table-custom-cell">
                    {enrollments[i].enrollment_date
                        ? formatDate(enrollments[i].enrollment_date?.getTime())
                        : "TBA"}
                </td>
                <td className="table-custom-cell">
                    {enrollments[i].finishing_date
                        ? formatDate(enrollments[i].finishing_date?.getTime())
                        : "TBA"}
                </td>
                <td className="table-custom-cell">
                    {enrollments[i].grade ? enrollments[i].grade : "TBA"}
                </td>
                <td className="table-custom-cell">
                    <span className={`${statusColor} px-2 py-1 rounded-lg`}>
                        {enrollments[i].status}
                    </span>
                </td>
                <td className="table-custom-cell flex justify-center">
                    <Link
                        href={enrollments[i].syllabus}
                        className="w-fit flex justify-center items-center"
                    >
                        <File className="duration-300 w-10 h-10 p-2 hover:bg-blue-400 hover:text-white rounded-lg"></File>
                    </Link>
                </td>
                <td className="table-custom-cell">
                    <div className="flex gap-2 items-center justify-center">
                        {enrollments[i].status === Status.pending && (
                            <>
                                <EnrollmentAccept
                                    studentId={+enrollments[i].student_id}
                                    courseId={enrollments[i].course_id}
                                ></EnrollmentAccept>
                                <EnrollmentReject
                                    studentId={+enrollments[i].student_id}
                                    courseId={enrollments[i].course_id}
                                ></EnrollmentReject>
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
                    <h2 className="text-3xl font-semibold">Enrollments</h2>
                    <div className="flex gap-2 items-center">
                        <Generatexlsx query={query} status={status} apiURL="/api/admission/enrollments" fileName="enrollments.xlsx"></Generatexlsx>
                        <StatusFilter
                            statuses={Object.entries(EnrollmentsStatus).map(([key, value]) => ({
                                label: key.charAt(0).toUpperCase() + key.slice(1),
                                value,
                            }))}
                        ></StatusFilter>
                        <Search
                            text="search for an enrollment"
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
                                    <td className="table-custom-cell">Student ID</td>
                                    <td className="table-custom-cell">GPA</td>
                                    <td className="table-custom-cell">Level</td>
                                    <td className="table-custom-cell">University Name</td>
                                    <td className="table-custom-cell">University Location</td>
                                    <td className="table-custom-cell">Course Name</td>
                                    <td className="table-custom-cell">Course Code</td>
                                    <td className="table-custom-cell">Enrollment Date</td>
                                    <td className="table-custom-cell">Finishing Date</td>
                                    <td className="table-custom-cell">Grade</td>
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
