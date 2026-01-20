import React from 'react'
import Profile from './Profile'
import ProfileData from './ProfileData'



function DashboardHeader({ id }: { id: string }) {

    return (
        <div className='flex justify-end p-3'>
            <Profile>
                <ProfileData id={id}></ProfileData>
            </Profile>
        </div>
    )
}

export default DashboardHeader
