'use client'

import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useAuthContext } from "@/app/context/AuthContext";
import CustomInput from "@/components/InputsSelects/CustomInput";
import Link from "next/link";
// import ApiService from "@/app/services/api";
import toast from "react-hot-toast";
import Select from 'react-select';
import { customStyles } from "@/app/constants";
import axios from "axios";


const Register = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FieldValues>();
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    // const { dispatch } = useAuthContext();
    const [accountType, setAccountType] = useState<string | null>(null);

    const accountTypeOptions = [
        { value: 'personal', label: 'Personal Use' },
        { value: 'organization', label: 'Organizational Use' }
    ];

    const router = useRouter();

    const onSubmitData = async (data: FieldValues) => {
        const pendingToast = toast.loading('Registering user...', { duration: 0 });
        // console.log("DATA", data);
        try {
            setErrorMsg('');
            setLoading(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/register`, data);
            const resData = response.data;

            if (resData.success) {
                toast.dismiss(pendingToast);
                toast.success('User added successfully.');
                router.push('/auth/login');
            }

        } catch (error: any) {
            toast.dismiss(pendingToast);
            toast.error(`${error?.response?.data?.message} \nFailed to register user. Please try again.`);
            // console.log("LOGGING IN ERROR", error);
            setErrorMsg(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitData)} className='flex w-full h-full'>
            <div className='flex items-center justify-center w-full h-screen bg-gray-100'>
                <div className='flex rounded bg-white md:w-4/6 lg:w-2/4 overflow-hidden xl:w-[400px] lg:h-auto md:h-auto'>
                    <div className='w-full text-[#334155] flex flex-col items-center p-5 px-8 pt-8'>
                        <div className='flex flex-col justify-center w-full gap-2 mb-8'>
                            <p className="text-xl font-semibold">Create an account</p>
                        </div>

                        <div className="flex flex-col w-full gap-5">
                            {/* <div className="space-y-1">
                                <label className='text-sm'>Account Type</label>
                                <Controller name="accountType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select 
                                            {...field} 
                                            styles={customStyles} 
                                            options={accountTypeOptions} 
                                            required 
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setAccountType(option?.value || null);
                                            }} 
                                        />
                                    )}
                                />
                            </div> */}

                            {/* {accountType === 'organization' && (
                                <div className="space-y-1">
                                    <label className="text-sm">Organization Name</label>
                                    <CustomInput name='organizationName' placeholder='Organization Name' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='text' rules={{ required: 'Organization Name is required' }} />
                                </div>
                            )} */}

                            
                            <div className="space-y-1">
                                <label className="text-sm">Username</label>
                                <CustomInput name='username' placeholder='john Doe' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='text' rules={{ required: 'Username is required' }} />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm">Email</label>
                                <CustomInput name='email' placeholder='joe@example.com' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='text' rules={{ required: 'Email is required' }} />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <label className="text-sm">Password</label>
                                    <p className="text-sm text-[#4F9B91]">Forget password</p>
                                </div>
                                <CustomInput name='password' placeholder='**********' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='password' rules={{ required: 'Password is required' }} />
                            </div>

                            

                            
                        </div>

                        {errorMsg && <p className="mt-4 text-sm italic text-red-500">{errorMsg}</p>}

                        <div className="flex justify-start w-full mt-6">
                            <div className="flex gap-2 text-gray-500 w-full">
                                <p className="text-xs font-light">By continuing, you agree to our <span className="text-[#4F9B91]">terms of service</span></p>
                            </div>
                        </div>

                        <div className='flex justify-center w-full gap-2 my-4'>
                            <button type="submit" className="flex items-center justify-center px-5 w-full py-3 text-sm text-white bg-[#4F9B91] rounded">
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <p>Sign up</p>}
                            </button>
                        </div>

                        <Link href='/auth/login' className="text-gray-500 text-xs my-5">Already have an account? <span className="text-[#4F9B91]">Sign in here</span></Link>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Register;
