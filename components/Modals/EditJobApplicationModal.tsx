'use client'

import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { useForm, FieldValues, Controller } from 'react-hook-form';
import ModalTemplate from './ModalTemplate';
import CustomInput from '../InputsSelects/CustomInput';
import DatePickerComp from '../InputsSelects/DatePickerComp';
import toast from 'react-hot-toast';
import useJobApplicationStore from '@/app/hooks/useJobApplicationStore';
import { useUpdateJobApplication } from '@/app/services/api';
import { jobApplicationFields } from '@/app/constants';


const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' }
]

const workingOptions = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-Site' },
    { value: 'hybrid', label: 'Hybrid' }
]

const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' }
]

export const customStyles: StylesConfig = {
    control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#00B8D9' : '#E2E8F0',
    '&:hover': {
        borderColor: state.isFocused ? '#00B8D9' : '#E2E8F0',
    }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#64748B',
    }),
};

const AddJobApplicationModal: React.FC = () => {
    const { isEditJobApplicationOpen, onEditJobApplicationClose, editJobApplicationDetails } = useJobApplicationStore();

    const { control, handleSubmit, setValue} = useForm<FieldValues>({defaultValues: {
        title: '',
        company: '',
        status: '',
        location: ''
    }});
    const [applicationDate, setApplicationDate] = useState<Date | any>(null);
    const [interviewDate, setInterviewDate] = useState<Date | any>(null);
    const [deadlineDate, setDeadlineDate] = useState<Date | any>(null);

    // const createMutation = useCreateJobApplication('/jobs');

    // // Update data
    const updateMutation = useUpdateJobApplication(`jobs/${editJobApplicationDetails._id}`);

    const onSubmit = async (data: any) => {
        // updateMutation.mutate(data);
        // console.log(data);
        await updateMutation.mutateAsync({...data, jobType: data.jobType.value, status: data.status.value, workingOption: data.workingOption.value, date: applicationDate, 
            interviewDate: interviewDate, deadline: deadlineDate
        }, {
            onSuccess: () => toast.success('Job application updated successfully!'),
            onError: (error) => toast.error(`Error updating job application: ${error.message}`),
        });
    };

    useEffect(() => {
        if (editJobApplicationDetails) {
            console.log(editJobApplicationDetails);
    
            setValue('status', { value: editJobApplicationDetails?.status || '', label: editJobApplicationDetails?.status || '' });

            setValue('jobType', { value: editJobApplicationDetails?.jobType || '', label: editJobApplicationDetails?.jobType || '' });

            setValue('workingOption', { value: editJobApplicationDetails?.workingOption || '', label: editJobApplicationDetails?.workingOption || '' });

            setApplicationDate(editJobApplicationDetails.date || '');
            setInterviewDate(editJobApplicationDetails.interviewDate || '');
            setDeadlineDate(editJobApplicationDetails.deadline || '');
    
            jobApplicationFields.forEach((item) => {
                const fieldValue = editJobApplicationDetails.hasOwnProperty(item) 
                    ? editJobApplicationDetails[item] 
                    : '';
                setValue(item, fieldValue);
            });
        }
    }, [editJobApplicationDetails]);
    

    

    const bodyContent = (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="w-full h-full">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'><span className='text-red-500'>*</span>Title</label>
                        <CustomInput name='title' placeholder='Position Name' control={control} type='text' rules={{ required: 'Application Name is required' }}/>
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'><span className='text-red-500'>*</span>Company</label>
                        <CustomInput name='company' placeholder='Company hiring' control={control} type='text' rules={{ required: 'Company name is required' }} />
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Application Date</label>
                        <DatePickerComp date={applicationDate} setDate={setApplicationDate} placeholder="Application Date" />
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'><span className='text-red-500'>*</span>Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => <Select {...field} styles={customStyles} options={statuses} required/>}
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Location</label>
                        <CustomInput name='location' placeholder='Job Location' control={control} type='text'/>
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Job Type (Full-time or Part-time)</label>
                        <Controller
                            name="jobType"
                            control={control}
                            render={({ field }) => <Select {...field} styles={customStyles} options={jobTypes} required/>}
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'><span className='text-red-500'>*</span>Working Option</label>
                        <Controller
                            name="workingOption"
                            control={control}
                            render={({ field }) => <Select {...field} styles={customStyles} options={workingOptions} required/>}
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Description</label>
                        <CustomInput name='description' placeholder='Job Description...' control={control} type='textarea'/>
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Max Salary</label>
                        <CustomInput name='maxSalary' placeholder='Max Salary' control={control} type='number'/>
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Min Salary</label>
                        <CustomInput name='minSalary' placeholder='Min Salary' control={control} type='number'/>
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        {/* <label className='text-sm text-gray-500'>Save Application</label> */}
                        <CustomInput name='saved' placeholder='Save Application' control={control} type='checkbox'/>
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Interview Date</label>
                        <DatePickerComp date={interviewDate} setDate={setInterviewDate} placeholder="Interview Date" />
                    </div>
                    <div className="flex flex-col w-full gap-2 mb-4">
                        <label className='text-sm text-gray-500'>Application Deadline</label>
                        <DatePickerComp date={deadlineDate} setDate={setDeadlineDate} placeholder="Deadline" />
                    </div>
                </div>
            </div>
        </form>
    );

    return (
        <ModalTemplate
            title="Edit Application"
            body={bodyContent}
            secondaryActionLabel="Cancel"
            secondaryAction={onEditJobApplicationClose}
            onSubmit={handleSubmit(onSubmit)}
            actionlabel="Save Update"
            isOpen={isEditJobApplicationOpen}
            onClose={onEditJobApplicationClose}
            longModal
        />
    );
};

export default AddJobApplicationModal;
