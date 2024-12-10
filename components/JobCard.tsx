import useJobDetailsStore from "@/app/hooks/useJobDetailsStore";
import React from "react";
import { FaBriefcase, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

interface JobCardProps {
    title: string;
    jobId: string;
    company: string;
    location: string;
    jobType: string;
    onSave: () => void;
}

// Job Card Component
const JobCard: React.FC<JobCardProps> = ({ title, company, location, jobType, jobId, onSave }) => {
    const { onJobPostingDetailsOpen, setJobPostId, onApplyJobOpen } = useJobDetailsStore();

    const handleTitleClick = () => { 
        setJobPostId(jobId);
        onJobPostingDetailsOpen();
    }

    const handleApplyClick = () => {
        setJobPostId(jobId);
        onApplyJobOpen();
    }

    return (
    <div className="bg-white shadow-md rounded-lg h-32 p-4 flex justify-between items-center">
        <div>
            <h3 onClick={handleTitleClick} className="text-xl font-semibold text-gray-800 cursor-pointer">{title}</h3>
            <div className='flex flex-col md:flex-row'>
                <p className="text-gray-600">
                    <FaBriefcase className="inline-block mr-1 text-gray-500" /> {company}
                </p>
                <p className="text-gray-600 md:ml-2">
                    <FaMapMarkerAlt className="inline-block mr-1 text-gray-500" /> {location}
                </p>
            </div>
            
            <span className="inline-block px-2 py-1 bg-[#299d9125] text-[#299d91fe] text-sm rounded-md mt-2">{jobType}</span>
        </div>
        <div className="flex flex-col h-full justify-between">
            <button
                className="bg-[#299D91] hover:bg-blue-700 text-white px-3 py-1 rounded-md transition duration-300 mb-1"
                onClick={onSave}
            >
                <FaHeart className="inline-block mr-1" /> Save
            </button>
            <button onClick={handleApplyClick} className="text-[#299d91d5] hover:text-[#299d91fe] font-medium text-sm">Apply</button>
        </div>
    </div>
    );
};

export default JobCard;