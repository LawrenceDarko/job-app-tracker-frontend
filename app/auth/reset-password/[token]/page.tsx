'use client'

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useAuthContext } from "@/app/context/AuthContext";
import CustomInput from "@/components/InputsSelects/CustomInput";
import toast from "react-hot-toast";
import axios from "axios";

const NewPassword = ({params}: {params: { token: string}}) => {
    const { control, handleSubmit, formState: { errors }, watch } = useForm<FieldValues>()
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const pawsd = watch('password')

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const pendingToast = toast.loading('Resetting Password...', { duration: 0 });
        try {
            // console.log({...data, accountType: data.accountType.value})
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/reset-password/${params.token}`, data);
            // api.post(`/auth/reset-password/${token}`, data)
            const resData = response.data
            // setTransactionData(resData)

            if(resData.success){
                toast.dismiss(pendingToast);
                toast.success('PASSWORD resetted successfully.');
                router.push(`/auth/login`)
            }
        } catch (error: any) {
            toast.dismiss(pendingToast);
            toast.error(`${error?.response?.data?.message} \nFailed to reset Password. Please try again.`);
            // console.log('ERROR SENDING PASSWORD', error)
        }
        
        // Handle form submission
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full h-full'>
            <div className='flex items-center justify-center w-full h-screen bg-gray-100'>
                <div className='flex rounded bg-white md:w-4/6 lg:w-2/4 overflow-hidden xl:w-[400px] lg:h-auto md:h-auto'>
                    <div className='w-full text-[#334155] flex flex-col items-center p-5 px-8 pt-8'>
                        <div className='flex flex-col justify-center w-full gap-2 mb-8'>
                            <p className="text-xl font-semibold">New Password</p>
                            <p className='text-sm text-gray-500'>Enter your new password.</p>
                        </div>

                        <div className="flex flex-col w-full gap-5">
                            <div className="space-y-1">
                                <label className="text-sm">New Password</label>
                                <CustomInput name='password' placeholder='***********' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='password' rules={{ required: 'Password is required' }} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm">Confirm New Password</label>
                                <CustomInput
                                    name="repeat-password"
                                    placeholder="***********"
                                    control={control}
                                    customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]"
                                    type="password"
                                    rules={{
                                        validate: (value: string) => value === pawsd || 'Passwords do not match'
                                    }}
                                />
                            </div>
                        </div>

                        {errorMsg && <p className="mt-4 text-sm italic text-red-500">{errorMsg}</p>}

                        <div className='flex justify-center w-full gap-2 my-3 mt-10'>
                            <button type="submit" className="flex items-center justify-center px-5 w-full py-3 text-sm text-white bg-[#4F9B91] rounded">
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <p>Reset Password</p>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default NewPassword
