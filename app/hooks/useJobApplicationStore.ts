import { create } from 'zustand';

interface JobApplicationStoreProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;

    isEditJobApplicationOpen: boolean;
    onEditJobApplicationOpen: () => void;
    onEditJobApplicationClose: () => void;

    editJobApplicationDetails: any;
    setEditJobApplicationDetails: (data: any) => void;

    newAddedJobApplication: any;
    setNewAddedJobApplication: (data: any) => void;

    editedJobApplicationData: any;
    setEditedJobApplicationData: (data: any) => void;
}

const useJobApplicationStore = create<JobApplicationStoreProps>((set) => ({
    isOpen: false,
    onOpen: ()=> set({ isOpen: true }),
    onClose: ()=> set({ isOpen: false }),

    isEditJobApplicationOpen: false,
    onEditJobApplicationOpen: ()=> set({ isEditJobApplicationOpen: true }),
    onEditJobApplicationClose: ()=> set({ isEditJobApplicationOpen: false }),

    editJobApplicationDetails: {},
    setEditJobApplicationDetails: (data) => set({ editJobApplicationDetails: data }),

    newAddedJobApplication: {},
    setNewAddedJobApplication: (data) => set({ newAddedJobApplication: data }),

    editedJobApplicationData: {},
    setEditedJobApplicationData: (data) => set({ editedJobApplicationData: data })
}))

export default useJobApplicationStore
