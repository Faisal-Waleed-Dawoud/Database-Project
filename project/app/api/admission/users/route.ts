import { getAllUsers } from "@/lib/db/users";
import { SafeUser} from "@/lib/types";
import { NextRequest, NextResponse} from "next/server";
import {utils, write} from "xlsx"
export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")
    const users = await getAllUsers(query) as SafeUser[]

    const workSheet = utils.json_to_sheet(users);
    const workBook = utils.book_new()

    utils.book_append_sheet(workBook, workSheet, "user")

    const buffer = write(workBook, {type: "buffer", bookType: "xlsx"})

    return new NextResponse(buffer, {
        headers: {
            'Content-Disposition': 'attachment; filename="users.xlsx"',
            "Content-Type" : "application/vnd.ms-excel"
        },
    })
}