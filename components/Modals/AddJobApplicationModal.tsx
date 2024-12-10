'use client'

import React, { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { useForm, FieldValues, SubmitHandler, Controller } from 'react-hook-form';
import ModalTemplate from './ModalTemplate';
// import useAddTransactionStore from '@/app/hooks/useAddTransactionStore';
import CustomInput from '../InputsSelects/CustomInput';
import DatePickerComp from '../InputsSelects/DatePickerComp';
import { setDate } from 'date-fns';
// import ApiService from '@/app/services/api';
import { PiBankLight } from 'react-icons/pi';
// import useListData from '@/app/hooks/useListData';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import useJobApplicationStore from '@/app/hooks/useJobApplicationStore';
import { useCreateJobApplication } from '@/app/services/api';


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
    const endpoint = '/jobs';
    const { isOpen, onClose } = useJobApplicationStore();

    const { control, handleSubmit, formState: { errors }, reset} = useForm<FieldValues>({defaultValues: {
        title: '',
        company: '',
        status: '',
        location: ''
    }});
    const [applicationDate, setApplicationDate] = useState<Date | any>(null);
    const [interviewDate, setInterviewDate] = useState<Date | any>(null);
    const [deadlineDate, setDeadlineDate] = useState<Date | any>(null);

    const createMutation = useCreateJobApplication(endpoint);

    const onSubmit = async (data: any) => {
        // createMutation.mutate(data);
        console.log(data);
        await createMutation.mutateAsync({...data, jobType: data?.jobType?.value, status: data?.status?.value, workingOption: data?.workingOption?.value, date: applicationDate,
            interviewDate: interviewDate, deadline: deadlineDate
        }, {
            onSuccess: () => toast.success('Job application created successfully!'),
            onError: (error) => toast.error(`Error creating job application: ${error.message}`),
        });
    };

    

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
                        <label className='text-sm text-gray-500'>Post Link</label>
                        <CustomInput name='link' placeholder='Link' control={control} type='text'/>
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
            title="New Application"
            body={bodyContent}
            secondaryActionLabel="Cancel"
            secondaryAction={onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionlabel="Save Application"
            isOpen={isOpen}
            onClose={onClose}
            longModal
        />
    );
};

export default AddJobApplicationModal;
