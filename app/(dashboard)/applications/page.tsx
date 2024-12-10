'use client'
import ApplicationsList from '@/components/Tables/ApplicationsList';
import React, { useState } from 'react';

const ApplicationsPage = () => {


    return (
        <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Applications</h2>

        <div className='rounded'>
            <div className="w-fulll py-4 h-full">
                <ApplicationsList />
            </div>
        </div>
        </div>
    );
};

export default ApplicationsPage;
