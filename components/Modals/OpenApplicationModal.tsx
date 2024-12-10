'use client'

import React from 'react';
import ModalTemplate from './ModalTemplate';
import { useFetchJobPostById, useOpenApplication } from '@/app/services/api';
import useJobDetailsStore from '@/app/hooks/useJobDetailsStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';



const OpenApplicationModal: React.FC = () => {
    
    const { isApplyJobOpen, onApplyJobClose, jobPostId } = useJobDetailsStore();
    const { data: jobDetails } = useFetchJobPostById(jobPostId);
    const router = useRouter();

    const createJobMutation = useOpenApplication(jobPostId);

    const handleOpenApplication = async () => { 
        createJobMutation.mutate({}, {
            onSuccess: () => {
                toast.success('Job application created successfully!'),
                router.push(`${jobDetails?.link}`)
            },
            onError: (error: any) => {
                console.log("error", error);
                toast.error(`Error creating job application: ${error?.response?.data?.message}`)
            }
        });
    }


    const bodyContent = jobDetails && (
        <div className="flex flex-col justify-center items-center">
            <p className="text-gray-800 text-center">Do you want to open application for <span className='font-semibold'>{jobDetails?.title}</span> at <span className='font-semibold'>{jobDetails?.company}</span>?</p>
            <div className='flex gap-3'>
                <button onClick={handleOpenApplication} className="bg-[#299D91] text-white px-4 py-2 rounded mt-4">Open Application</button>
                <button onClick={onApplyJobClose} className="border text-gray-500 px-4 py-2 rounded mt-4">Cancel</button>
            </div>
            
        </div>
    );


    return (
        <ModalTemplate
            title="Open Application"
            body={bodyContent}
            // secondaryActionLabel="Cancel"
            secondaryAction={onApplyJobClose}
            // actionlabel="Save Application"
            isOpen={isApplyJobOpen}
            onClose={onApplyJobClose}
            longModal
        />
    );
};

export default OpenApplicationModal;
