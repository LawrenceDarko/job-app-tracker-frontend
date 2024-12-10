import Helpers from '@/app/services/helpers';
import React from 'react'

interface UpcomingInterviewProps {
    data: any;
}

const UpcomingInterview: React.FC<UpcomingInterviewProps> = ({data}) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-lg text-gray-800">Interview: {data?.company}</h4>
            <p className="text-gray-600">{Helpers.formatDateTimeFromString(data?.interviewDate, false, 'words')}</p>
            <button className="mt-4 text-sm bg-blue-500 text-white px-4 py-2 rounded">Reschedule</button>
        </div>
    )
}

export default UpcomingInterview