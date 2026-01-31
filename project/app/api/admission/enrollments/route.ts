import { getAllEnrollments } from "@/app/(dashboard)/admission/enrollments/lib/db";
import { ExportedEnrollments } from "@/app/(dashboard)/admission/enrollments/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { utils, write } from "xlsx"

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")
    const status = searchParams.get("status")
    const enrollments = await getAllEnrollments(query, status) as ExportedEnrollments[]
    console.log(enrollments)
    const workSheet = utils.json_to_sheet(enrollments);
    const workBook = utils.book_new()

    utils.book_append_sheet(workBook, workSheet, "enrollment")

    const buffer = write(workBook, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buffer, {
        headers: {
            'Content-Disposition': 'attachment; filename="enrollments.xlsx"',
            "Content-Type": "application/vnd.ms-excel"
        },
    })
}