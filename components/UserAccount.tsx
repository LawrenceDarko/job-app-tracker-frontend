'use client'

import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import DialogModal from './Modals/DialogModal';
import { CiLogout } from 'react-icons/ci';
import { AiOutlineSetting } from 'react-icons/ai';
import { TbLayersDifference } from 'react-icons/tb';
import Link from 'next/link';

const UserAccount = () => {
    const { data: session } = useSession();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    return (
        <div className='hidden md:block absolute right-3 top-4'>
            <div className="relative">
                <button onClick={toggleDropdown}>
                    <div>
                        <img
                            src={session?.user?.data?.image ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/uploads/userprofiles/${session?.user?.data?.image}` : '/images/avatar.png'}
                            className="w-9 h-9 rounded-full border border-[#c3c3c3] object-cover mr-2"
                            alt="User profile"
                        />
                    </div>
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
                        <div className="px-4 py-2 font-semibold text-gray-800">
                            My Account
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <button onClick={closeDropdown} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <TbLayersDifference className='mr-2' />
                            <p>
                                {session?.user?.data?.organization?.name && <p>{session?.user?.data?.organization?.name}</p>}
                                {!session?.user?.data?.organization?.name && <p>Personal Account</p>}
                            </p>
                        </button>
                        {/* <Link href='/settings' onClick={closeDropdown} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <RxAvatar className='mr-2' />
                            Profile
                        </Link> */}
                        {/* <Link href='/pricing' onClick={closeDropdown} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <CiMoneyBill className='mr-2' />
                            Billing
                        </Link> */}
                        <Link href='/settings' onClick={closeDropdown} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <AiOutlineSetting className='mr-2' />
                            Settings
                        </Link>
                        <div className="border-t border-gray-200"></div>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <DialogModal
                                label="Logout"
                                title="Are you sure?"
                                icon={CiLogout}
                                lableIconColor='text-black'
                                customTextStyles='text-black'
                                callback={() => signOut({ callbackUrl: '/auth/login' })}
                                body={`Are you sure you want to Logout?`}
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAccount;
