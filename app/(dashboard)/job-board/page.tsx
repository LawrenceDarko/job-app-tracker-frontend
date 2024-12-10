'use client';

import { useFetchJobPostings, useSaveJob } from '@/app/services/api';
import JobCard from '@/components/JobCard';
import { useSession } from 'next-auth/react';
// pages/job-search.tsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaBriefcase, FaMapMarkerAlt, FaHeart, FaSearch, FaFilter } from 'react-icons/fa';



const JobSearchPage = () => {
    const { data: session} = useSession()
    const { data: jobListings = [], isLoading, error } = useFetchJobPostings('/jobpool');
    
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilter] = useState<string>('all');

    const createMutation = useSaveJob('/saved-jobs/save');


    const handleSaveJob = async (jobId: string) => {
        try {
            await createMutation.mutateAsync({jobId}, 
                {
                onSuccess: () => toast.success('Job post saved successfully!'),
                onError: (error: any) => toast.error(`Error saving job post: ${error.response.data.message}`),
        });
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };


    // Filter and search logic
    const filteredJobs = jobListings.filter((job: any) => {
        const matchesSearchTerm =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'all' || job.jobType.toLowerCase() === filter;

        return matchesSearchTerm && matchesFilter;
    });

    return (
        <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Job Search</h2>

        {/* Search Bar */}
        <div className="flex items-center bg-white p-4 rounded-lg shadow-md mb-8">
            <input
                type="text"
                className="w-full px-4 py-2 rounded-md text-gray-700 focus:outline-none"
                placeholder="Search jobs by title, company, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-[#299D91] hover:bg-blue-700 text-white px-4 py-2 ml-2 rounded-md">
                <FaSearch />
            </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
            <button
                className={`px-4 py-2 rounded-md ${
                filter === 'all' ? 'bg-[#299D91] text-white' : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setFilter('all')}
            >
                All
            </button>
            <button
                className={`px-4 py-2 rounded-md ${
                filter === 'full-time' ? 'bg-[#299D91] text-white' : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setFilter('full-time')}
            >
                Full-Time
            </button>
            <button
                className={`px-4 py-2 rounded-md ${
                filter === 'part-time' ? 'bg-[#299D91] text-white' : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setFilter('part-time')}
            >
                Part-Time
            </button>
            </div>

            <button className="bg-gray-100 md:block hidden hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
                <FaFilter className="inline mr-2" /> Advanced Filters
            </button>
        </div>

        {/* Job Listings as a List */}
        <div className="flex flex-col space-y-4">
            {filteredJobs.map((job: any, index: number) => (
            <JobCard
                key={index}
                title={job.title}
                company={job.company}
                location={job.location}
                jobType={job.jobType}
                jobId={job._id}
                onSave={() => handleSaveJob(job._id)}
            />
            ))}
        </div>
        </div>
    );
};



export default JobSearchPage;




















// 'use client';

// // pages/job-search.tsx
// import React, { useState } from 'react';
// import { FaBriefcase, FaMapMarkerAlt, FaHeart, FaSearch, FaFilter } from 'react-icons/fa';

// interface JobCardProps {
//     title: string;
//     company: string;
//     location: string;
//     jobType: string;
//     onSave: () => void;
// }

// const JobSearchPage = () => {
//     const [savedJobs, setSavedJobs] = useState<string[]>([]);
//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [filter, setFilter] = useState<string>('all');

//     const handleSaveJob = (title: string) => {
//         setSavedJobs((prevSavedJobs) => [...prevSavedJobs, title]);
//     };

//     // Sample job listings
//     const jobListings = [
//         {
//             title: 'Frontend Developer',
//             company: 'TechCorp',
//             location: 'San Francisco, CA',
//             jobType: 'Full-Time',
//         },
//         {
//             title: 'Backend Developer',
//             company: 'InnovateX',
//             location: 'Remote',
//             jobType: 'Remote',
//         },
//         {
//             title: 'Data Analyst',
//             company: 'DataWorks',
//             location: 'New York, NY',
//             jobType: 'Full-Time',
//         },
//     ];

//     // Filter and search logic
//     const filteredJobs = jobListings.filter((job) => {
//         const matchesSearchTerm =
//         job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         job.location.toLowerCase().includes(searchTerm.toLowerCase());
        
//         const matchesFilter = filter === 'all' || job.jobType.toLowerCase() === filter;

//         return matchesSearchTerm && matchesFilter;
//     });

//     return (
//         <div className="p-8">
//         <h2 className="text-3xl font-bold text-gray-800 mb-6">Job Search</h2>

//         {/* Search Bar */}
//         <div className="flex items-center bg-white p-4 rounded-lg shadow-md mb-8">
//             <input
//             type="text"
//             className="w-full px-4 py-2 rounded-md text-gray-700 focus:outline-none"
//             placeholder="Search jobs by title, company, location..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="bg-[#299D91] hover:bg-blue-700 text-white px-4 py-2 ml-2 rounded-md">
//             <FaSearch />
//             </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-8">
//             <div className="flex items-center space-x-4">
//             <button
//                 className={`px-4 py-2 rounded-md ${
//                 filter === 'all' ? 'bg-[#299D91] text-white' : 'bg-gray-100 text-gray-600'
//                 }`}
//                 onClick={() => setFilter('all')}
//             >
//                 All
//             </button>
//             <button
//                 className={`px-4 py-2 rounded-md ${
//                 filter === 'full-time' ? 'bg-[#299D91] text-white' : 'bg-gray-100 text-gray-600'
//                 }`}
//                 onClick={() => setFilter('full-time')}
//             >
//                 Full-Time
//             </button>
//             <button
//                 className={`px-4 py-2 rounded-md ${
//                 filter === 'remote' ? 'bg-[#299D91] text-white' : 'bg-gray-100 text-gray-600'
//                 }`}
//                 onClick={() => setFilter('remote')}
//             >
//                 Remote
//             </button>
//             </div>

//             <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
//             <FaFilter className="inline mr-2" /> Advanced Filters
//             </button>
//         </div>

//         {/* Job Listings */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredJobs.map((job, index) => (
//             <JobCard
//                 key={index}
//                 title={job.title}
//                 company={job.company}
//                 location={job.location}
//                 jobType={job.jobType}
//                 onSave={() => handleSaveJob(job.title)}
//             />
//             ))}
//         </div>
//         </div>
//     );
// };

// // Job Card Component
// const JobCard: React.FC<JobCardProps> = ({ title, company, location, jobType, onSave }) => (
//     <div className="bg-white shadow-lg rounded-lg p-6">
//         <h3 className="text-2xl font-semibold text-gray-800 mb-2 hover:underline cursor-pointer">{title}</h3>
//         <p className="text-gray-600 mb-2">
//         <FaBriefcase className="inline-block mr-2 text-gray-500" /> {company}
//         </p>
//         <p className="text-gray-600 mb-4">
//         <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" /> {location}
//         </p>
//         <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md mb-4">{jobType}</span>
//         <div className="flex justify-between items-center">
//         <button
//             className="bg-[#299D91] hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
//             onClick={onSave}
//         >
//             <FaHeart className="inline-block mr-2" /> Save Job
//         </button>
//         <button className="text-blue-600 hover:text-blue-700 font-medium">Apply</button>
//         </div>
//     </div>
// );

// export default JobSearchPage;
