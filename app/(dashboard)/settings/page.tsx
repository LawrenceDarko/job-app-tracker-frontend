'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { useFetchJobPreferences, useInsertOrUpdateJobPreferences } from '@/app/services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const { data: jobPreferences, isLoading, error } = useFetchJobPreferences('/preferences');
    const mutation = useInsertOrUpdateJobPreferences('/preferences');

    const [preferences, setPreferences] = useState<{
        industries: string[];
        jobType: string;
        remote: boolean;
        keywords: string[];
        locations: string[];
        notifications: {
            email: boolean;
            sms: boolean;
        };
    }>({
        industries: [],
        jobType: 'Full-Time',
        remote: false,
        keywords: [],
        locations: [],
        notifications: {
            email: false,
            sms: false,
        },
    });

    // Populate preferences when jobPreferences data is loaded
    useEffect(() => {
        if (jobPreferences) {
            setPreferences({
                industries: jobPreferences?.data?.industries || [],
                jobType: jobPreferences?.data?.jobType || 'Full-Time',
                remote: jobPreferences?.data?.remote ?? false,
                keywords: jobPreferences?.data?.keywords || [],
                locations: jobPreferences?.data?.locations || [],
                notifications: {
                    email: jobPreferences?.data?.notifications?.email ?? false,
                    sms: jobPreferences?.data?.notifications?.sms ?? false,
                },
            });
        }
    }, [jobPreferences]);

    console.log('Preferences:', jobPreferences);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setPreferences((prev) => {
            if (name in prev.notifications) {
                return {
                    ...prev,
                    notifications: {
                        ...prev.notifications,
                        [name]: type === 'checkbox' ? checked : value,
                    },
                };
            }
            return {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };
        });
    };

    const handleKeywordsChange = (index: number, value: string) => {
        setPreferences((prev) => {
            const updatedKeywords = [...prev.keywords];
            updatedKeywords[index] = value;
            return { ...prev, keywords: updatedKeywords };
        });
    };

    const addKeyword = () => {
        setPreferences((prev) => ({
            ...prev,
            keywords: [...prev.keywords, ''],
        }));
    };

    const removeKeyword = (index: number) => {
        setPreferences((prev) => ({
            ...prev,
            keywords: prev.keywords.filter((_, i) => i !== index),
        }));
    };

    const saveChanges = async () => {
        console.log('Preferences Saved:', preferences);
        try {
            await mutation.mutateAsync(preferences);
            
            toast.success('Preferences updated successfully!')
        } catch (err: any) {
            console.error('Error saving preferences:', err.response?.data?.message);
            toast.error(`Failed to update preferences: ${err?.response?.data?.message}`);
        }
    };

    if (isLoading) return <p>Loading preferences...</p>;
    // if (error) return <p>Error loading preferences: {error.message}</p>;

    return (
        <div className="min-h-screen p-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-sm text-gray-600 mt-2">
                    Personalize your job search and notification preferences to match your needs.
                </p>
            </header>

            <div className="space-y-8">
                {/* Job Preferences */}
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Job Preferences</h2>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Industries</label>
                        <input
                            type="text"
                            name="industries"
                            value={preferences.industries.join(', ')}
                            onChange={(e) =>
                                setPreferences((prev) => ({
                                    ...prev,
                                    industries: e.target.value.split(',').map((s) => s.trim()),
                                }))
                            }
                            className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="E.g., Tech, Finance"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Locations</label>
                        <input
                            type="text"
                            name="locations"
                            value={preferences.locations.join(', ')}
                            onChange={(e) =>
                                setPreferences((prev) => ({
                                    ...prev,
                                    locations: e.target.value.split(',').map((s) => s.trim()),
                                }))
                            }
                            className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="E.g., Atlanta, San Francisco"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select
                            name="jobType"
                            value={preferences.jobType}
                            onChange={handleInputChange}
                            className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            name="remote"
                            checked={preferences.remote}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">Remote Only</label>
                    </div>
                </section>

                {/* Keywords */}
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Keywords</h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Add or remove keywords to refine your job search results.
                    </p>
                    <div className="mt-4 space-y-3">
                        {preferences.keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => handleKeywordsChange(index, e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Keyword"
                                />
                                <button
                                    onClick={() => removeKeyword(index)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Remove Keyword"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addKeyword}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mt-2"
                        >
                            <FaPlus />
                            Add Keyword
                        </button>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="email"
                                checked={preferences.notifications.email}
                                onChange={handleInputChange}
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Email Notifications</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="sms"
                                checked={preferences.notifications.sms}
                                onChange={handleInputChange}
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">SMS Notifications</label>
                        </div>
                    </div>
                </section>
            </div>

            {/* Save Button */}
            <button
                onClick={saveChanges}
                className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            >
                <FaSave />
                Save Changes
            </button>
        </div>
    );
};

export default SettingsPage;

















// 'use client';

// import { useFetchJobPreferences } from '@/app/services/api';
// import { useState } from 'react';
// import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';

// const SettingsPage = () => {
//     const { data: jobPreferences = [], isLoading, error, refetch } = useFetchJobPreferences('/preferences');
//     const [preferences, setPreferences] = useState({
//         industries: ['Tech', 'Finance'],
//         jobType: 'Full-Time',
//         remote: true,
//         keywords: ['JavaScript', 'React', 'TypeScript'],
//         notifications: {
//             email: true,
//             sms: false,
//         },
//     });


//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value, type, checked } = e.target as HTMLInputElement;
//         setPreferences((prev) => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleKeywordsChange = (index: number, value: string) => {
//         const updatedKeywords = [...preferences.keywords];
//         updatedKeywords[index] = value;
//         setPreferences((prev) => ({ ...prev, keywords: updatedKeywords }));
//     };

//     const addKeyword = () => {
//         setPreferences((prev) => ({
//         ...prev,
//         keywords: [...prev.keywords, ''],
//         }));
//     };

//     const removeKeyword = (index: number) => {
//         const updatedKeywords = preferences.keywords.filter((_, i) => i !== index);
//         setPreferences((prev) => ({ ...prev, keywords: updatedKeywords }));
//     };

//     const saveChanges = () => {
//         console.log('Preferences Saved:', preferences);
//         alert('Preferences updated successfully!');
//     };

//     return (
//         <div className="min-h-screen p-8">
//         <header className="mb-10">
//             <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
//             <p className="text-sm text-gray-600 mt-2">
//                 Personalize your job search and notification preferences to match your needs.
//             </p>
//         </header>

//         <div className="space-y-8">
//             {/* Job Preferences */}
//             <section className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-lg font-semibold text-gray-800">Job Preferences</h2>
//             <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700">Industries</label>
//                 <input
//                 type="text"
//                 value={preferences.industries.join(', ')}
//                 name="industries"
//                 onChange={handleInputChange}
//                 className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                 placeholder="E.g., Tech, Finance"
//                 />
//             </div>
//             <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700">Job Type</label>
//                 <select
//                 name="jobType"
//                 value={preferences.jobType}
//                 onChange={handleInputChange}
//                 className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                 >
//                 <option value="Full-Time">Full-Time</option>
//                 <option value="Part-Time">Part-Time</option>
//                 <option value="Contract">Contract</option>
//                 </select>
//             </div>
//             <div className="mt-4 flex items-center">
//                 <input
//                 type="checkbox"
//                 name="remote"
//                 checked={preferences.remote}
//                 onChange={handleInputChange}
//                 className="h-5 w-5 text-blue-600 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">Remote Only</label>
//             </div>
//             </section>

//             {/* Keywords */}
//             <section className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-lg font-semibold text-gray-800">Keywords</h2>
//             <p className="text-sm text-gray-600 mt-2">
//                 Add or remove keywords to refine your job search results.
//             </p>
//             <div className="mt-4 space-y-3">
//                 {preferences.keywords.map((keyword, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                     <input
//                     type="text"
//                     value={keyword}
//                     onChange={(e) => handleKeywordsChange(index, e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                     placeholder="Keyword"
//                     />
//                     <button
//                     onClick={() => removeKeyword(index)}
//                     className="text-red-600 hover:text-red-800"
//                     title="Remove Keyword"
//                     >
//                     <FaTrash />
//                     </button>
//                 </div>
//                 ))}
//                 <button
//                 onClick={addKeyword}
//                 className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mt-2"
//                 >
//                 <FaPlus />
//                 Add Keyword
//                 </button>
//             </div>
//             </section>

//             {/* Notifications */}
//             <section className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
//             <div className="mt-4 space-y-4">
//                 <div className="flex items-center">
//                 <input
//                     type="checkbox"
//                     name="email"
//                     checked={preferences.notifications.email}
//                     onChange={handleInputChange}
//                     className="h-5 w-5 text-blue-600 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">Email Notifications</label>
//                 </div>
//                 <div className="flex items-center">
//                 <input
//                     type="checkbox"
//                     name="sms"
//                     checked={preferences.notifications.sms}
//                     onChange={handleInputChange}
//                     className="h-5 w-5 text-blue-600 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">SMS Notifications</label>
//                 </div>
//             </div>
//             </section>
//         </div>

//         {/* Save Button */}
//         <button
//             onClick={saveChanges}
//             className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
//         >
//             <FaSave />
//             Save Changes
//         </button>
//         </div>
//     );
// };

// export default SettingsPage;
