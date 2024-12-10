'use client'

import React, { useState, useEffect } from 'react';
import ModalTemplate from './ModalTemplate';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaClipboardCheck, FaStickyNote, FaDollarSign, FaSuitcase } from 'react-icons/fa';
import { useCreateJobApplication, useFetchJobById, useFetchJobPostById } from '@/app/services/api';
import useJobDetailsStore from '@/app/hooks/useJobDetailsStore';
import Helpers from '@/app/services/helpers';


const JobPostingDetails: React.FC = () => {
    
    const { isJobPostingDetailsOpen, onJobPostingDetailsClose, jobPostId } = useJobDetailsStore();
    // const [jobDetails, setJobDetails] = useState<JobDetails | any>(null);
    const { data: jobDetails, isLoading, error, refetch } = useFetchJobPostById(jobPostId);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600';
            case 'applied':
                return 'text-orange-600';
            case 'interview':
                return 'text-blue-600';
            case 'offer':
                return 'text-green-600';
            case 'rejected':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const bodyContent = jobDetails && (
        <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800">{jobDetails?.title}</h2>
            <div className='flex justify-between w-full'>
                <div className='flex flex-col gap-5'>
                    <div className="flex items-center gap-2">
                        <FaBriefcase className="text-gray-500" />
                        <span className="font-bold text-gray-700">{jobDetails?.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        <span className="text-gray-600">{jobDetails?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClipboardCheck className="text-gray-500" />
                        <span className={`font-semibold ${getStatusColor(jobDetails?.status)}`}>{jobDetails?.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-500" />
                        <span className="text-gray-600">{Helpers.formatDateTimeFromString(jobDetails?.date)}</span>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className="flex items-center gap-2">
                        <FaDollarSign className="text-gray-500" />
                        <span className="text-gray-700">
                            ${jobDetails?.minSalary?.toLocaleString()} - ${jobDetails?.maxSalary?.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaSuitcase className="text-gray-500" />
                        <span className="text-gray-700">{jobDetails?.jobType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClipboardCheck className="text-gray-500" />
                        <span className="text-gray-700">{jobDetails?.workingOption}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaStickyNote className="text-gray-500" /> Notes:
                </label>
                <p className="text-gray-600 border rounded p-2">{jobDetails?.notes}</p>
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaStickyNote className="text-gray-500" /> Job Description:
                </label>
                <p className="text-gray-600 border rounded p-2">{jobDetails?.description}</p>
            </div>
            <div className="flex items-center gap-2">
                <a href={jobDetails?.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View Job Listing
                </a>
            </div>
        </div>
    );


    return (
        <ModalTemplate
            title="Job Details"
            body={bodyContent}
            // secondaryActionLabel="Cancel"
            secondaryAction={onJobPostingDetailsClose}
            // actionlabel="Save Application"
            isOpen={isJobPostingDetailsOpen}
            onClose={onJobPostingDetailsClose}
            longModal
        />
    );
};

export default JobPostingDetails;
