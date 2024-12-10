import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';


const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';

const apiConfig: AxiosRequestConfig = {
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
};

const api: AxiosInstance = axios.create(apiConfig);

let authToken: string | null = null;

// Function to set the auth token
async function setAuthToken() {
    const session = await getSession();
    authToken = session?.user?.token || null;
}

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        await setAuthToken();
        config.withCredentials = true;

        if (authToken && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        console.error("Error during API request:", error);
        return Promise.reject(error);
    }
);

// React Query Hooks

// Fetch Data Hook
export const useFetchJobApplicationData = (endpoint: string, config?: AxiosRequestConfig) =>
    useQuery({
        queryKey: ['jobs', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response?.data?.data.reverse();
        },
    });

// Fetch user documents Hook
export const useFetchUserDocuments = (endpoint: string, config?: AxiosRequestConfig) =>
    useQuery({
        queryKey: ['documents', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response?.data?.data;
        },
    });

// Get Job by ID Hook
export const useFetchJobById = (jobId: string) => {
    return useQuery({
        queryKey: ['job', jobId],
        queryFn: async () => {
            const response = await api.get(`/jobs/${jobId}`);
            return response.data;
        },
        enabled: !!jobId, // Only run the query if jobId is not undefined or null
    });
};

// Get JobPost by ID Hook
export const useFetchJobPostById = (jobPostId: string) => {
    return useQuery({
        queryKey: ['jobpool', jobPostId],
        queryFn: async () => {
            const response = await api.get(`/jobpool/${jobPostId}`);
            return response.data;
        },
        enabled: !!jobPostId, // Only run the query if jobPostId is not undefined or null
    });
};

// Open Application Hook
export const useOpenApplication = (jobPostId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any = []) => {
            const response = await api.post(`/jobpool/${jobPostId}/add-to-jobs`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};

// Register User Hook
export const useRegisterUser = (config?: AxiosRequestConfig) => {
    return useMutation({
        mutationFn: async (data: any = []) => {
            const response = await api.post('/auth/register', data, config);
            return response.data;
        },
    });
};

// Fetch Dashboard Stats Hook
export const useFetchDashboardStats = (endpoint: string, config?: AxiosRequestConfig) => {
    return useQuery({
        queryKey: ['stats', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response.data;
        },
    });
}

// Fetch Upcoming Interviews Hook
export const useFetchUpcomingInterviews = (endpoint: string, config?: AxiosRequestConfig) => {
    return useQuery({
        queryKey: ['interviews', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response.data.data;
        },
    });
}

// Fetch Upcoming deadlines Hook
export const useFetchUpcomingDeadlines = (endpoint: string, config?: AxiosRequestConfig) => {
    return useQuery({
        queryKey: ['deadlines', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response.data.data;
        },
    });
}

// Fetch Job Postings Hook
export const useFetchJobPostings = (endpoint: string, config?: AxiosRequestConfig) => {
    return useQuery({
        queryKey: ['jobsposts', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response.data.reverse();
        },
    });
}

// Create Data Hook
export const useCreateJobApplication = (endpoint: string, config?: AxiosRequestConfig) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any = []) => {
            const response = await api.post(endpoint, data, config);
            return response.data;
        },
        onSuccess: (newData) => {
            queryClient.setQueryData(['jobs', endpoint], (oldData: any = []) => {
                console.log('create oldData', oldData);
                return [newData, ...oldData]
            });
        },
        // onSuccess: (newData) => {
        //     // Invalidate the cache for a fresh refetch
        //     queryClient.invalidateQueries({ queryKey: ['jobs', endpoint] });
        // },
    });
};

// Update Data Hook
export const useUpdateJobApplication = (endpoint: string, config?: AxiosRequestConfig) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any = []) => {
            const response = await api.put(endpoint, data, config);
            return response.data.data;
        },
        onSuccess: (newData) => {
            queryClient.setQueryData(['jobs', endpoint], (oldData: any = []) => {
                console.log('oldData', oldData);
                console.log('newData', newData);
                return oldData?.map((item: any) => (item?._id === newData?._id ? newData : item));
            });
        },
    });
};

// Save Job Hook
export const useSaveJob = (endpoint: string, config?: AxiosRequestConfig) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post(endpoint, data, config);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};

// Delete Data Hook
export const useDeleteJobApplication = (config?: AxiosRequestConfig) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (jobId: string) => {
            const response = await api.delete(`/jobs/${jobId}`, config);
            return response.data;
        },
        onSuccess: (_, jobId) => {
            // Remove deleted job from cache
            queryClient.setQueryData(['jobs', `/jobs/${jobId}`], (oldData: any = []) => {
                return oldData.filter((d: any) => d.id !== jobId)
            });
        },
    });
};

// Fetch Saved Jobs Hook
export const useFetchSavedJobs = (endpoint: string, config?: AxiosRequestConfig) => {
    // const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['jobs', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response.data;
        },
    });
};

// Remove Saved Job Hook
export const useRemoveSavedJob = (endpoint: string, config?: AxiosRequestConfig) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (jobId: string) => {
            const response = await api.delete(`${endpoint}/${jobId}`, config);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};

// Fetch Job Preferences Hook
export const useFetchJobPreferences = (endpoint: string, config?: AxiosRequestConfig) => {
    return useQuery({
        queryKey: ['preferences', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response.data;
        },
    });
};

// Fetch Job Preferences Match Hook
export const useFetchJobPreferencesMatch = (endpoint: string, config?: AxiosRequestConfig) => {
    return useQuery({
        queryKey: ['preferences', endpoint],
        queryFn: async () => {
            const response = await api.get(endpoint, config);
            return response.data;
        },
    });
};

// Inser or Update Job Preferences Hook
export const useInsertOrUpdateJobPreferences = (endpoint: string, config?: AxiosRequestConfig) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any = []) => {
            const response = await api.post(endpoint, data, config);
            return response.data;
        },
        onSuccess: (newData) => {
            queryClient.setQueryData(['preferences', endpoint], newData);
        },
    });
};










// ExampleComponent.tsx
// import React, { useState } from 'react';
// import {
//   useFetchData,
//   useCreateData,
//   useUpdateData,
//   useDeleteData,
// } from '../services/api';

// const ExampleComponent: React.FC = () => {
//   const endpoint = '/items'; // Replace with your actual API endpoint
//   const [newData, setNewData] = useState({ name: '' });

//   // Fetch data
//   const { data, isLoading, error } = useFetchData(endpoint);

//   // Create data
//   const createMutation = useCreateData(endpoint);

//   // Update data
//   const updateMutation = useUpdateData(`${endpoint}/1`); // Example ID: replace with actual ID

//   // Delete data
//   const deleteMutation = useDeleteData(`${endpoint}/1`); // Example ID: replace with actual ID

//   const handleCreate = () => {
//     createMutation.mutate(newData);
//   };

//   const handleUpdate = () => {
//     updateMutation.mutate({ name: 'Updated Name' });
//   };

//   const handleDelete = () => {
//     deleteMutation.mutate();
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading data</p>;

//   return (
//     <div>
//       <h1>Data List</h1>
//       <ul>
//         {data.map((item: any) => (
//           <li key={item.id}>{item.name}</li>
//         ))}
//       </ul>

//       {/* Create new data */}
//       <button onClick={handleCreate}>Create Item</button>

//       {/* Update data */}
//       <button onClick={handleUpdate}>Update Item</button>

//       {/* Delete data */}
//       <button onClick={handleDelete}>Delete Item</button>
//     </div>
//   );
// };

// export default ExampleComponent;


// Usage 2
// Fetch data with custom headers
// const { data, isLoading, error } = useFetchJobApplicationData(endpoint, {
//     headers: {
//         'Custom-Header': 'value',
//     },
// });

// // Create data with multipart/form-data
// const createMutation = useCreateJobApplication(endpoint, {
//     headers: {
//         'Content-Type': 'multipart/form-data',
//     },
// });

// // Update data with application/json
// const updateMutation = useUpdateJobApplication(`${endpoint}/1`, {
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Delete data with additional headers
// const deleteMutation = useDeleteJobApplication(`${endpoint}/1`, {
//     headers: {
//         'Authorization': 'Bearer some-token',
//     },
// });
