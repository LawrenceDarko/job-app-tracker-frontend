'use client'

import React from 'react';
import { useFetchDashboardStats, useFetchUpcomingDeadlines, useFetchUpcomingInterviews } from '@/app/services/api';
import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from 'recharts';
import UpcomingInterview from '@/components/UpcomingInterview';
import useJobDetailsStore from '../hooks/useJobDetailsStore';
import Helpers from '../services/helpers';
import useJobApplicationStore from '../hooks/useJobApplicationStore';
import { FaRegFileAlt, FaCalendarCheck, FaHandshake, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

const Dashboard = () => {
    const { data: dashboardstats = [], isLoading, error } = useFetchDashboardStats('/jobs/stats');
    const { data: matchingJobs = [], isLoading: matchLoad, error: matchError } = useFetchDashboardStats('/jobpool/top-matching');
    const { data: interviews, isLoading: isInterviewLoading, error: interviewError} = useFetchUpcomingInterviews('/jobs/interviews/upcoming');
    const { data: deadlines, isLoading: isDeadlineLoading, error: deadlineError} = useFetchUpcomingDeadlines('/jobs/deadlines/upcoming');
    const { onJobPostingDetailsOpen, setJobPostId, onApplyJobOpen } = useJobDetailsStore();
    const { onOpen, onEditJobApplicationOpen, setEditJobApplicationDetails } = useJobApplicationStore();

    const handleApplyClick = (jobId: string) => {
        setJobPostId(jobId);
        onApplyJobOpen();
    }

    const handleTitleClick = (jobId: string) => { 
        setJobPostId(jobId);
        onJobPostingDetailsOpen();
    }

    const chartData = [
        { category: 'Applications', count: dashboardstats?.totalApplications || 0, },
        { category: 'Interviews', count: dashboardstats?.totalInterviews || 0, },
        { category: 'Offers', count: dashboardstats?.offersReceived || 0, },
        { category: 'Rejections', count: dashboardstats?.rejectedApplications || 0, },
    ];

    const cardsData = [
        {
            title: 'Total Applications',
            value: dashboardstats?.totalApplications || 0,
            icon: <FaRegFileAlt className="text-blue-600 text-5xl mb-4" />,
            color: 'from-blue-100 to-blue-50 border-blue-400',
            textColor: 'text-blue-600',
        },
        {
            title: 'Interviews Scheduled',
            value: dashboardstats?.totalInterviews || 0,
            icon: <FaCalendarCheck className="text-green-600 text-5xl mb-4" />,
            color: 'from-green-100 to-green-50 border-green-400',
            textColor: 'text-green-600',
        },
        {
            title: 'Offers Received',
            value: dashboardstats?.offersReceived || 0,
            icon: <FaHandshake className="text-yellow-600 text-5xl mb-4" />,
            color: 'from-yellow-100 to-yellow-50 border-yellow-400',
            textColor: 'text-yellow-600',
        },
        {
            title: 'Rejected Applications',
            value: dashboardstats?.rejectedApplications || 0,
            icon: <FaTimesCircle className="text-red-600 text-5xl mb-4" />,
            color: 'from-red-100 to-red-50 border-red-400',
            textColor: 'text-red-600',
        },
    ];
    
    console.log("interviews", interviews);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    return (
        <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
            {/* Top Metrics Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
                    <p className="text-5xl font-bold text-blue-600">{dashboardstats?.totalApplications}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Interviews Scheduled</h3>
                    <p className="text-5xl font-bold text-green-600">{dashboardstats?.totalInterviews}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Offers Received</h3>
                    <p className="text-5xl font-bold text-yellow-600">{dashboardstats?.offersReceived}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Rejected Applications</h3>
                    <p className="text-5xl font-bold text-red-600">{dashboardstats?.rejectedApplications}</p>
                </div>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardsData.map((card, index) => (
                    <div
                    key={index}
                    className={`relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                    >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 ${card.color} opacity-20 pointer-events-none`} ></div>

                    <div className="relative z-10 p-6 text-center">
                        {/* Icon Section */}
                        <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full shadow-inner">
                            {card.icon}
                        </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                        {card.title}
                        </h3>

                        {/* Value */}
                        <p
                        className={`text-4xl font-extrabold ${card.textColor} leading-tight`}
                        >
                        {card.value}
                        </p>
                    </div>
                    </div>
                ))}
            </div>


            {/* Application Status Overview */}
            {/* <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Application Status Overview</h2>
                <div className="w-full h-64 flex items-center justify-center">
                    <p className="text-gray-500">Pie/Bar Chart Placeholder</p>
                </div>
            </div> */}
            {/* <div className="bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Progress Analytics</h3>
                <div className="w-full h-64 flex items-center justify-center">
                    <p className="text-gray-500">Progress Chart Placeholder</p>
                </div>
            </div> */}
            {/* <div className="bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Progress Analytics</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#299D91" barSize={60} radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div> */}
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                    Advanced Analytics Overview
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {/* Area Chart for Visual Background */}
                        <Area
                            type="monotone"
                            dataKey="count"
                            fill="#E2F3F3"
                            stroke="none"
                        />

                        {/* Bar Chart for Counts */}
                        <Bar
                            dataKey="count"
                            fill="#299D91"
                            barSize={50}
                            radius={[8, 8, 0, 0]}
                        />

                        {/* Line Chart for Trends */}
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#1E90FF"
                            strokeWidth={3}
                            dot={{ r: 6, fill: '#1E90FF' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Job Search Alerts and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Job Search Alerts */}
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Job Search Alerts</h3>
                    <ul className="divide-y divide-gray-200 overflow-y-scroll max-h-40">
                        {
                            matchingJobs?.data?.map((item: any, index: number) => (
                                <li key={index} className="flex justify-between items-center py-4">
                                    <span onClick={()=>handleTitleClick(item._id)} className="text-gray-700 cursor-pointer">{item.title} - {item.location}</span>
                                    <button onClick={()=>handleApplyClick(item._id)} className="text-blue-600 hover:text-blue-700 font-medium">Apply</button>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                {/* Recent Activities */}
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Deadlines</h3>
                    <ul className="space-y-4 max-h-40 overflow-y-scroll">
                        {/* <li className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold">New Interview</span> - 12th Sep 2024, 3:00 PM (Google)
                        </li>
                        <li className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold">Follow-up Email</span> - 5th Sep 2024, 10:00 AM (Amazon)
                        </li>
                        <li className="bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold">Application Deadline</span> - 1st Sep 2024 (Facebook)
                        </li> */}
                        {
                            deadlines?.map((item: any, index: number) => (
                                <li key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <span className="font-semibold">{item.title}</span> - {Helpers.formatDateTimeFromString(item.deadline)}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>

            {/* Upcoming Deadlines and Interviews */}
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-700">Upcoming Interviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interviews?.map((item: any, index: number) => (
                        <UpcomingInterview data={item} key={index}/> 
                    ))}
                    {
                        interviews?.length === 0 && (
                            <p className="text-gray-500">No upcoming interviews</p>
                        )
                    }
                    {/* <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-lg text-gray-800">Application Deadline: Facebook</h4>
                        <p className="text-gray-600">1st Sep 2024</p>
                        <button className="mt-4 text-sm bg-blue-500 text-white px-4 py-2 rounded">Set Reminder</button>
                    </div> */}
                </div>
            </div>

            {/* Progress Analytics */}
            {/* <div className="bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Progress Analytics</h3>
                <div className="w-full h-64 flex items-center justify-center">
                    <p className="text-gray-500">Progress Chart Placeholder</p>
                </div>
            </div> */}

            {/* Quick Actions Section */}
            <div className="bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h3>
                <div className="space-x-4">
                    <button onClick={onOpen} className="bg-green-500 text-white px-6 py-2 rounded">Add New Application</button>
                    {/* <button className="bg-blue-500 text-white px-6 py-2 rounded">Schedule Interview</button> */}
                    {/* <button className="bg-yellow-500 text-white px-6 py-2 rounded">Add Task</button> */}
                    <Link href='/documents'><button className="bg-purple-500 text-white px-6 py-2 rounded">Upload Document</button></Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
