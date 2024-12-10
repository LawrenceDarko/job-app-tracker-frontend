'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { CiLogout } from 'react-icons/ci';
import DialogModal from './Modals/DialogModal';
import { signOut } from 'next-auth/react';

const Logout = () => {
    // const router = useRouter();

    // const handleLogout = async() => {
    //     try {
    //         const response = await fetch('/api/logout', {
    //             method: 'POST',
    //             headers: {
    //               'Content-Type': 'application/json', // Set appropriate headers
    //             },
    //             body: JSON.stringify(''),
    //             credentials: 'include', // Include cookies in the request
    //         });
    //         // signOut({ callbackUrl: '/' });
    //         if(response.ok) {
    //             localStorage.removeItem('token');
    //             localStorage.removeItem('userdata');
    //             router.push('/auth/login')
    //         }
    //     } catch (error) {
    //         console.log('ERROR IN LOGGING OUT')
    //     } 

        
    // }

    return (
        <div className='md:absolutee md:hidden mb-3 flex bg-[#272727] hover:bg-[#464646] rounded gap-4 justify-centerr items-center cursor-pointer p-3 left-7 bottom-7'>
            {/* <CiLogout className=''/> */}
            {/* <p className='max-lg:hidden'>Logout</p> */}
            <DialogModal label="Logout" title="Are you sure?" icon={CiLogout} lableIconColor='text-white' customTextStyles='text-white' callback={() => signOut({ callbackUrl: '/auth/login' })} body={`Are you sure you want to Logout?`} />
        </div>
    )
}

export default Logout