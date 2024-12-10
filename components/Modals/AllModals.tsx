import React from 'react';
import AddJobApplicationModal from './AddJobApplicationModal';
import ViewJobDetails from './ViewJobDetailsModal';
import EditJobApplicationModal from './EditJobApplicationModal';
import JobPostingDetails from './JobPostingDetails';
import OpenApplicationModal from './OpenApplicationModal';




const AllModals = () => {
    return (
        <>
            <AddJobApplicationModal />
            <EditJobApplicationModal />
            <ViewJobDetails />
            <JobPostingDetails />
            <OpenApplicationModal />
        </>
    )
}

export default AllModals