import { create } from 'zustand';

interface JobDetailsStoreProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;

    isEditJobDetailsOpen: boolean;
    onEditJobDetailsOpen: () => void;
    onEditJobDetailsClose: () => void;

    isJobPostingDetailsOpen: boolean;
    onJobPostingDetailsOpen: () => void;
    onJobPostingDetailsClose: () => void;
    jobPostId: string;
    setJobPostId: (data: string) => void;

    isApplyJobOpen: boolean;
    onApplyJobOpen: () => void;
    onApplyJobClose: () => void;

    editJobDetailsDetails: any;
    setEditJobDetailsDetails: (data: any) => void;

    newAddedJobDetails: any;
    setNewAddedJobDetails: (data: any) => void;

    editedJobDetailsData: any;
    setEditedJobDetailsData: (data: any) => void;

    jobId: string;
    setJobId: (data: string) => void;
}

const useJobDetailsStore = create<JobDetailsStoreProps>((set) => ({
    isOpen: false,
    onOpen: ()=> set({ isOpen: true }),
    onClose: ()=> set({ isOpen: false }),

    isEditJobDetailsOpen: false,
    onEditJobDetailsOpen: ()=> set({ isEditJobDetailsOpen: true }),
    onEditJobDetailsClose: ()=> set({ isEditJobDetailsOpen: false }),

    isJobPostingDetailsOpen: false,
    onJobPostingDetailsOpen: ()=> set({ isJobPostingDetailsOpen: true }),
    onJobPostingDetailsClose: ()=> set({ isJobPostingDetailsOpen: false }),
    jobPostId: '',
    setJobPostId: (data) => set({ jobPostId: data }),

    isApplyJobOpen: false,
    onApplyJobOpen: ()=> set({ isApplyJobOpen: true }),
    onApplyJobClose: ()=> set({ isApplyJobOpen: false }),

    editJobDetailsDetails: {},
    setEditJobDetailsDetails: (data) => set({ editJobDetailsDetails: data }),

    newAddedJobDetails: {},
    setNewAddedJobDetails: (data) => set({ newAddedJobDetails: data }),

    editedJobDetailsData: {},
    setEditedJobDetailsData: (data) => set({ editedJobDetailsData: data }),

    jobId: '',
    setJobId: (data) => set({ jobId: data })
}))

export default useJobDetailsStore
