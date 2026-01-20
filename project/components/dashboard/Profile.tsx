"use client";
import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
import { User } from "lucide-react";

function Profile({ children }: { children:React.ReactNode }) {
    const [open, setOpen] = useState(false);

    function handleOpen() {
        setOpen(!open);
    }

    return (
        <>
            <button
                className="rounded-full hover:bg-blue-400 hover:text-white duration-300 cursor-pointer w-10 h-10 flex justify-center items-center"
                onClick={handleOpen}
            >
                <User></User>
            </button>
            {open && (
                <ProfileModal handleOpen={handleOpen}>
                    {children}
                </ProfileModal>
            )}
        </>
    );
}

export default Profile;
