import Navbar from '@/components/Navigation/Navbar'
import Sidebar from '@/components/Navigation/Sidebar'
import React, { ReactNode } from 'react'



const HomeLayout = ({children}: {children: ReactNode}) => {
    return (
        <div>
            <div className="h-full bg-[#F8FAFC]">
                <div className="h-[65px] md:pl-20 lg:pl-[264px] fixed inset-y-0 w-full z-20">
                    <Navbar />
                </div>
                <div className="fixed inset-y-0 z-20 bg-gray-200 flex-col hidden xl:w-[264px] h-full md:flex">
                    <Sidebar />
                </div>
                <div className="min-h-[100dvh] relative pb-6 pt-[80px] md:pl-24 lg:pl-[264px] bg-[#F4F5F7] ">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default HomeLayout