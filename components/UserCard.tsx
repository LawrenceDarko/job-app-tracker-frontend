import { useAuthContext } from '@/app/context/AuthContext'
import { useSession } from 'next-auth/react'
import React from 'react'

const UserCard = ({ isMobile}:{ isMobile?: boolean}) => {
    // const { user } = useAuthContext()
    const { data: session } = useSession()
    return (
        <div className="flex md:hidden items-center p-2 rounded shadow-md cursor-pointer">
            <img
                // src='https://picsum.photos/200/300'
                src={session?.user?.data?.image ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/uploads/userprofiles/${session?.user?.data?.image}` : '/images/avatar.png'}
                // alt={`${name}'s profile`}
                className="w-9 h-9 rounded-full border border-[#c3c3c3] object-cover mr-2"
            />
            <div className={`${!isMobile ? 'max-lg:hidden' : ''}`}>
                {session?.user?.data?.username && <h2 className={`capitalize text-gray-400`}>{session?.user?.data?.username}</h2>}
                {session?.user?.data?.organization?.name && <p className="text-xs text-gray-200">{session?.user?.data?.organization?.name}</p>}
                {!session?.user?.data?.organization?.name && <p className="text-xs text-gray-200">Personal Account</p>}
            </div>
        </div>
    )
}

export default UserCard