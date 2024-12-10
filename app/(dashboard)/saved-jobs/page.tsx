'use client'

import useJobDetailsStore from '@/app/hooks/useJobDetailsStore';
import { useFetchSavedJobs, useRemoveSavedJob } from '@/app/services/api';
import { useState } from 'react';
import { FaTrashAlt, FaInfoCircle } from 'react-icons/fa';

// interface SavedJob {
//   id: number;
//   title: string;
//   company: string;
//   location: string;
//   jobType: string;
//   dateSaved: string;
//   description: string;
// }


const SavedJobPage = () => {
  const { data: savedJobs, isLoading, error } = useFetchSavedJobs('/saved-jobs');
  // const [savedJobs, setSavedJobs] = useState<SavedJob[]>(initialSavedJobs);
  // const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null);
  const { onJobPostingDetailsOpen, setJobPostId, onApplyJobOpen } = useJobDetailsStore();

  const handleTitleClick = (jobId: string) => { 
      console.log('jobId', jobId);
      setJobPostId(jobId);
      onJobPostingDetailsOpen();
  }

  const handleApplyClick = (jobId: string) => {
      setJobPostId(jobId);
      onApplyJobOpen();
  }

  const deleteMutation = useRemoveSavedJob('/saved-jobs/remove');

  // console.log('savedJobs', savedJobs);

  // Handle removing a saved job
  const handleRemoveJob = (jobId: any) => {
    // setSavedJobs((prev) => prev.filter((job) => job.id !== id));

      deleteMutation.mutate(jobId);
    
  };

  // Handle viewing a job's details
  // const handleViewDetails = (job: SavedJob) => {
  //   setSelectedJob(job);
  // };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Saved Jobs</h2>

      {/* Saved Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedJobs?.data?.length === 0 ? (
          <p className="text-gray-600">You have no saved jobs.</p>
        ) : (
          savedJobs?.data?.reverse().map((job: any) => (
            <div key={job._id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 onClick={() => handleTitleClick(job?.jobPoolId)} className="text-xl cursor-pointer font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-600">{job.location}</p>
              <p className="text-gray-600">{job.jobType}</p>
              <p className="text-gray-500 text-sm">Saved on {job.dateSaved}</p>
              <div className="flex justify-between mt-4">
                <button
                  className="text-blue-500 hover:underline flex items-center"
                  onClick={() => handleApplyClick(job?.jobPoolId)}
                >
                  <FaInfoCircle className="mr-2" /> Apply
                </button>
                <button
                  className="text-red-500 hover:underline flex items-center"
                  onClick={() => {handleRemoveJob(job._id)}}
                >
                  <FaTrashAlt className="mr-2" /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Job Detail Modal */}
      {/* {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h3 className="text-2xl font-semibold mb-4">{selectedJob.title}</h3>
            <p className="text-lg font-medium">{selectedJob.company}</p>
            <p className="text-gray-600">{selectedJob.location}</p>
            <p className="text-gray-600 mb-4">{selectedJob.jobType}</p>
            <p className="mb-4">{selectedJob.description}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SavedJobPage;
