import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/utils";
import Links from "@/components/dashboard/links";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "This is the description of the website",
};

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    const user = await getCurrentUser({fullUser: false, redirectIfNotFound: true})
    
    return (
        <div className="flex h-screen md:min-h-screen">
            <Suspense fallback={<Skeleton className="min-h-screen w-[350px]"></Skeleton>}>
                <Links role={user.role} />
            </Suspense>
            <Suspense fallback={<Skeleton className="w-full h-10"></Skeleton>}>
                <div className="grow p-3 overflow-hidden">
                    <DashboardHeader id={user.userId}></DashboardHeader>
                    {children}
                </div>
            </Suspense>
        </div>
    );
}
