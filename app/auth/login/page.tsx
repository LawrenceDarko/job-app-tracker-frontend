'use client'

import { useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from 'axios'
import { useRouter } from 'next/navigation';
// import { cookies } from 'next/headers'; 
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import CustomInput from "@/components/InputsSelects/CustomInput";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from 'next-auth/react';
// import { useAuthContext } from "@/app/context/AuthContext";



const Login = () => {
    // const { dispatch } = useAuthContext()
    const {control, handleSubmit, formState: {errors}} = useForm<FieldValues>()
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState<boolean>(false)


    const router = useRouter()

    const onSubmitData = async (data: FieldValues) => {
        try {
            setErrorMsg('');
            setLoading(true);
        
            const result: any = await signIn('credentials', {
                redirect: false,
                callbackUrl: "/",
                email: data.email,
                password: data.password,
            });

            console.log("SIGN IN RESULT:", result)
        
            if (result.error) {
                setErrorMsg(result.error);
                return;
            }
        
            if (result.ok) {
                toast.success('Login successful');
                router.push(`/`);
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    
    // const onSubmitData = async(data: FieldValues) => {
    //     try {
    //         setErrorMsg('')
    //         setLoading(true)
    //         const response = await fetch('/api/login', {
    //             method: 'POST',
    //             headers: {
    //               'Content-Type': 'application/json', // Set appropriate headers
    //             },
    //             body: JSON.stringify(data),
    //             credentials: 'include', // Include cookies in the request
    //         });

    //         const responseData = await response.json();

    //         if (!response.status) {
    //             throw new Error();
    //         }
            
    //         // console.log("LOGIN RES DATA:", responseData)

    //         if(!responseData?.data){
    //             setErrorMsg(responseData?.message)
    //             return;
    //         }
            
    //         if(responseData.success) {
    //             toast.success(responseData.message);
    //             localStorageService.setItem('token', responseData?.token)
    //             localStorageService.setItem('userdata', responseData?.data)
    //             dispatch({type: 'LOGIN', payload: responseData?.data})
    //             router.push(`/`)
    //         }

    //     } catch (error: any) {
    //         // console.log("LOGGING IN ERROR", error)
    //         setErrorMsg(error?.response?.message)
    //     } finally {
    //         setLoading(false)
    //     }
    // };

    return (
        <form onSubmit={handleSubmit(onSubmitData)} className='flex w-full h-full'>
            <div className='flex items-center justify-center w-full h-screen bg-gray-100'>
                <div className='flex rounded bg-white md:w-4/6 lg:w-2/4 overflow-hidden xl:w-[400px] lg:h-auto md:h-auto'>
                    <div className='w-full text-[#334155] flex flex-col items-center p-5 px-8 pt-8'>
                        <div className='flex flex-col justify-center w-full gap-2 mb-8'>
                            <p className="text-xl font-semibold">Login</p>
                            <p className='text-sm text-gray-500'>Welcome back, please login to your account</p>
                        </div>

                        <div className="flex flex-col w-full gap-5">
                            <div className="space-y-1">
                                <label className="text-sm">Email</label>
                                <CustomInput name='email' placeholder='joe@example.com' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='text' rules={{ required: 'Email is required' }} />
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <label className="text-sm">Password</label>
                                    <Link href='/auth/reset-password' className="text-sm text-[#4F9B91]">Forget password</Link>
                                </div>
                                <CustomInput name='password' placeholder='**********' control={control} customStyles="py-2 focus:border-[#4F9B91] focus:bg-[#f9fafc]" type='password' rules={{ required: 'Password is required' }} />
                            </div>
                        </div>

                        {errorMsg && <p className="mt-4 text-sm italic text-red-500">{errorMsg}</p>}

                        <div className="flex justify-start w-full mt-6">
                            <div className="flex gap-2 text-gray-500">
                                <input style={{accentColor: "#4F9B91"}} type="checkbox"/>
                                <p>Keep me signed in</p>
                            </div>
                        </div>

                        <div className='flex justify-center w-full gap-2 my-3'>
                            <button type="submit" className="flex items-center justify-center px-5 w-full py-3 text-sm text-white bg-[#4F9B91] rounded">
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin"/> : <p>Sign in</p>}
                            </button>
                        </div>

                        <Link href='/auth/register' className="text-[#4F9B91] text-xs my-5">Create an account</Link>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login