"use client"
import { useRouter } from "next/navigation";
import React from "react";

function StatusFilter({
    statuses,
}: {
    statuses: { label: string; value: string }[];
}) {

    const route = useRouter()
    
    function onPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const currentStatusParam = new URLSearchParams(window.location.search)
        currentStatusParam.set("status", e.target.value)
        currentStatusParam.set("page", "1")
        route.push(`${window.location.pathname}?${currentStatusParam}`)
    }

    return (
        <>
            <form>
                <select
                    name="status"
                    className="bg-white px-3 py-1 outline-2 focus:outline-4 duration-300 outline-blue-lighter rounded-md"
                    onChange={(e) => onPageChange(e)}
                >
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                        <option key={status.value}  value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </form>
        </>
    );
}

export default StatusFilter;
