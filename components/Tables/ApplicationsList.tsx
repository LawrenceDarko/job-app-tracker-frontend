'use client'

import React, { useState } from "react";
import DBLTable from "dbl-table";
// import DBLTable from "../DBLTable";
import { IoMdCreate, IoMdRefresh } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../common/Loader";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import DialogModal from "../Modals/DialogModal";
import { IApplication } from "@/typings/types";
import useJobApplicationStore from "@/app/hooks/useJobApplicationStore";
import { useDeleteJobApplication, useFetchJobApplicationData } from "@/app/services/api";
import Helpers from "@/app/services/helpers";
import useJobDetailsStore from "@/app/hooks/useJobDetailsStore";

const ApplicationsList = () => {
    // Fetch job applications with react-query
    const { data: applications = [], isLoading, error, refetch } = useFetchJobApplicationData('/jobs');
    const { onOpen, onEditJobApplicationOpen, setEditJobApplicationDetails } = useJobApplicationStore();
    const { onOpen: openDetailModal, setJobId } = useJobDetailsStore();
    const [filter, setFilter] = useState<string>('all');

    // // Delete data with additional headers
    const deleteMutation = useDeleteJobApplication();

    // console.log('applications',applications);

    // Filter applications based on selected filter
    const filteredApplications = applications?.filter((app: any) => {
        if (filter === 'all') return true;
        return app.status.toLowerCase() === filter.toLowerCase();
    });

    const handleEdit = (data: any) => {
        // console.log(data);
        setEditJobApplicationDetails(data);
        onEditJobApplicationOpen();
    }

    const handleDelete = (data: any) => {
        deleteMutation.mutate(data._id);
    }

    const handleClick = (data: any) => {
        // console.log(data);
        setJobId(data._id);
        openDetailModal();
    }

    // Columns configuration for the table
    const columns = [
        { 
            label: 'Job Title', 
            key: 'title',
            renderCell: (value: string, rowData?: any) => (
                    <div className="flex items-center">
                        <div onClick={() => handleClick(rowData)} className="text-md rounded-md font-semibold text-gray-500 cursor-pointer">
                            {value}
                        </div>
                    </div>
                )
        },
        { label: 'Company', key: 'company' },
        { 
            label: 'Application Date',
            key: 'date',
            renderCell: (value: string) => (
                <div className="flex items-center">
                    <div className="whitespace-nowrap">
                        {Helpers.formatDateTimeFromString(value)}
                    </div>
                </div>
            )
        },
        { 
            label: 'Status', 
            key: 'status',
            renderCell: (value: string) => {
                let bgColor;
                switch (value) {
                    case 'pending':
                        bgColor = 'bg-yellow-100 text-yellow-900';
                        break;
                    case 'applied':
                        bgColor = 'bg-orange-100 text-orange-900';
                        break;
                    case 'interview':
                        bgColor = 'bg-blue-100 text-blue-900';
                        break;
                    case 'offer':
                        bgColor = 'bg-green-100 text-green-900';
                        break;
                    case 'rejected':
                        bgColor = 'bg-red-100 text-red-900';
                        break;
                    default:
                        bgColor = 'bg-gray-100 text-gray-900';
                }
                
                return (
                    <div className={`flex items-center`}>
                        <div className={`text-xs font-semibold rounded-md p-1 px-2 ${bgColor}`}><span className="capitalize">{value}</span></div>
                        {/* {value} */}
                    </div>
                );
            }
        }
    ];

    const toolbars: React.ReactNode[] = [
        <div key="toolbar" className="flex items-center justify-center gap-2">
            <IoMdRefresh onClick={() => {refetch()}} title="Refresh" size={24} className={`${isLoading ? 'animate-spin' : ''} cursor-pointer`} />
            <button onClick={onOpen} className="px-3 py-[6px] text-white bg-[#299D91] rounded whitespace-nowrap">
                Add New Application
            </button>
            <select
                className="p-2 border border-gray-200 rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="interview">Interview Scheduled</option>
                <option value="Offer">Offer Received</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
    ];

    const showActions = (rowData: any) => (
        <Popover>
            <PopoverTrigger className="flex items-center justify-center w-full">
                <div className="p-2 rounded-full hover:bg-slate-200">
                    <HiOutlineDotsHorizontal size={21} />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col w-full bg-white">
                    <div onClick={() => handleEdit(rowData)} className="flex items-center justify-start gap-2 p-2 rounded cursor-pointer hover:bg-gray-200">
                        <IoMdCreate className="text-blue-500 cursor-pointer" />
                        <p>Edit</p>
                    </div>
                    <DialogModal 
                        label="Withdraw"
                        title="Are you absolutely sure?"
                        icon={RiDeleteBinLine}
                        lableIconColor='text-red-500'
                        callback={() => handleDelete(rowData)}
                        body={`Are you sure you want to delete ${rowData.name}?`} 
                    />
                </div>
            </PopoverContent>
        </Popover>
    );

    if (isLoading) return <Loader loadText="Loading Applications..." />;
    if (error) toast.error("Failed to load applications",);

    return (
        <div className="min-w-full overflow-x-auto">
            <DBLTable
                data={filteredApplications}
                columns={columns}
                enableServerPagination={false}
                enableStripStyle={false}
                removeStraightLines={true}
                printTools
                loading={isLoading}
                toolbars={toolbars}
                showActions={showActions}
                customStyles={{
                    // component: {boxShadow: 'none'}
                }}
            />
        </div>
    );
};

export default ApplicationsList;
