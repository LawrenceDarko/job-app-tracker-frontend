'use client'

import React from 'react'
import { sidebarLinks } from '@/app/constants'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CiLogout } from "react-icons/ci";
import Image from 'next/image'
import Logout from '../Logout'
import UserCard from '../UserCard'


const Sidebar = () => {
    const pathname = usePathname()
    return (
        <div className='overflow-y-auto flex flex-col justify-between bg-[#191919] h-full p-3 lg:p-6 text-[#BABABA] max-sm:hidden lg:w-[264px] min-w-20'>
            <div className='pb-8 lg:flex justify-start items-center gap-2 hidden'>
                <Link href='/'>
                    <Image
                        src='/images/logo2.png'
                        width={170}
                        height={50}
                        alt='logo'
                        // className='max-sm:size-48'
                    />
                </Link>
                {/* <p className='font-bold text-3xl'>Logo</p> */}
            </div>
            
            <div className="flex flex-col gap-2 flex-1">
                {sidebarLinks.map(({route, label, icon: Icon}) => {

                    // if (label === 'Settings') {
                    //     return null;
                    // }
                    // const isActive = window.location.pathname === link.route
                    const isActive = pathname === route || pathname?.startsWith(`${route}/`)

                    return (
                        <Link key={route} href={route} className={cn('flex gap-2 items-center p-3 rounded justify-start', isActive && 'bg-[#299D91] text-white')}>
                            <Icon className='text-[27px] lg:text-[20px]'/>
                            <p className='text-md max-lg:hidden whitespace-nowrap'>{label}</p>
                        </Link>
                    )
                })}
            </div>

            {/* <div className='flex gap-4 items-center justify-start p-3 cursor-pointer'>
                <CiLogout />
                <p>Logout</p>
            </div> */}
            <Logout />
            <UserCard />
            
        </div>
    )
}

export default Sidebar