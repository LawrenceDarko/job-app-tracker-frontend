'use client'

import { useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from 'axios'
import { useRouter } from 'next/navigation';
// import { cookies } from 'next/headers'; 
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useAuthContext } from "@/app/context/AuthContext";
import CustomInput from "@/components/InputsSelects/CustomInput";
import Link from "next/link";
import toast from "react-hot-toast";



const ForgotPassword = () => {
    const {control, handleSubmit, formState:{errors}} = useForm<FieldValues>()
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    // const { dispatch } = useAuthContext()

    const router = useRouter()

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const pendingToast = toast.loading('Sending Email...', { duration: 0 });
        try {
            // console.log({...data, accountType: data.accountType.value})
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/request-password-reset`, data);
            const resData = response.data
            // setTransactionData(resData)

            if(resData.success){
                toast.dismiss(pendingToast);
                toast.success('EMAIL sent successfully.');
            }
        } catch (error: any) {
            toast.dismiss(pendingToast);
            toast.error(`${error?.response?.data?.message} \nFailed to send Email. Please try again.`);
            // console.log('ERROR SENDING EMAIL', error)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full h-full'>
            <div className='flex items-center justify-center w-full h-screen bg-gray-100'>
                <div className='flex rounded bg-white md:w-4/6 lg:w-2/4 overflow-hidden xl:w-[400px] lg:h-auto md:h-auto'>
                    <div className='w-full text-[#334155] flex flex-col items-center p-5 px-8 pt-8'>
                        <div className='flex flex-col justify-center w-full gap-2 mb-8'>
                            <p className="text-xl font-semibold">Forgot Password?</p>
                            <p className='text-sm text-gray-500'>Enter your email address to get the password reset link.</p>
                        </div>

                        <div className="flex flex-col w-full gap-5">
                            <div className="space-y-1">
                                <label className="text-sm">Email</label>
                                <CustomInput name='email' placeholder='joe@example.com' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='text' rules={{ required: 'Email is required' }} />
                            </div>
                        </div>

                        {errorMsg && <p className="mt-4 text-sm italic text-red-500">{errorMsg}</p>}

                        <div className='flex justify-center w-full gap-2 my-3 mt-10'>
                            <button type="submit" className="flex items-center justify-center px-5 w-full py-3 text-sm text-white bg-[#4F9B91] rounded">
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin"/> : <p>Send Email</p>}
                            </button>
                        </div>

                        <Link href='/auth/login' className="text-[#4F9B91] text-xs my-5">Sign in here</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default ForgotPassword