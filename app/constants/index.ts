import { StylesConfig } from 'react-select';
import { RiDashboardLine } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import { IApplication } from '@/typings/types';
import { IoSettingsOutline } from 'react-icons/io5';
import { VscFileSubmodule } from 'react-icons/vsc';


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

export const sidebarLinks = [
    {
        label: 'Dashboard',
        route: '/',
        icon: RiDashboardLine // A simple dashboard icon
    },
    {
        label: 'Job Board',
        route: '/job-board',
        icon: MdWorkOutline // A work-related icon for job listings
    },
    {
        label: 'Applications',
        route: '/applications',
        icon: FaClipboardList // A clipboard icon for application tracking
    },
    {
        label: 'Saved Jobs',
        route: '/saved-jobs',
        icon: AiOutlineHeart // A heart icon to represent saved or favorited jobs
    },
    {
        label: 'Documents',
        route: '/documents',
        icon: VscFileSubmodule // A document-like icon
    },
    {
        label: 'Settings',
        route: '/settings',
        icon: IoSettingsOutline // A cogwheel icon for settings
    }
];

export const initialApplications: IApplication[] = [
    {
        id: 1,
        jobTitle: 'Frontend Developer',
        company: 'TechCorp',
        applicationDate: '2024-09-10',
        status: 'Pending',
        notes: 'Waiting for response from HR',
        interviewDate: '',
        attachedDocuments: ['resume.pdf', 'cover_letter.pdf'],
    },
    {
        id: 2,
        jobTitle: 'Backend Developer',
        company: 'InnovateX',
        applicationDate: '2024-09-12',
        status: 'Interview Scheduled',
        notes: 'Interview on September 15',
        interviewDate: '2024-09-15',
        attachedDocuments: ['resume.pdf'],
    },
];


export const jobApplicationFields = [
    "title",
    "company",
    "date",
    // "status",
    "location",
    // "jobType",
    // "workingOption",
    "maxSalary",
    "minSalary",
    "description",
    "link",
    "saved"
]