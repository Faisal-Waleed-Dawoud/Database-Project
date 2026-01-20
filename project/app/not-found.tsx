import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/utils";
import { RolesURLS } from "@/lib/types";

async function NotFound() {
    const user = await getCurrentUser({
        fullUser: false,
        redirectIfNotFound: false,
    });


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-6">
                    You might be trying to access a page that doesn't exist or you're not
                    authorized to view.
                </p>
                <Link
                    href={user ? RolesURLS[user.role] : "/"}
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
