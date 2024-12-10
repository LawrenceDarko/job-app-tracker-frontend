'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useFetchUserDocuments } from '@/app/services/api';


interface Document {
  _id: number;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  filePath: string;
}

const DocumentsPage = () => {
  const { data: userDocuments } = useFetchUserDocuments('/documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>('Resume'); // Default to 'Resume'
  const [filterType, setFilterType] = useState<string>('All');

  const { data: session} = useSession()
  const authToken = session?.user?.token || null;

  console.log('User Doc', userDocuments);

  // Fetch documents from the backend
  // const fetchDocuments = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/documents`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${authToken}`
  //       },
  //     }); // Adjust endpoint
  //     setDocuments(response?.data);
  //   } catch (error) {
  //     console.error('Error fetching documents:', error);
  //   }
  // };

  useEffect(() => {
    if (userDocuments?.length) {
      setDocuments(userDocuments);
    }
  }, [userDocuments]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', fileType);

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/documents/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`
          },
        });

        // Add the uploaded document to the list
        setDocuments([...documents, response?.data?.document]);
        setSelectedFile(null);
        setFileType('Resume'); // Reset file type after upload
      } catch (error) {
        console.error('Error uploading document:', error);
      }
    }
  };

  // Handle file deletion
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/documents/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${authToken}`
        },
      }); // Adjust endpoint
      setDocuments(documents?.filter((doc) => doc?._id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Filter documents by type
  const filteredDocuments =
    filterType === 'All'
      ? documents
      : documents?.filter((doc) => doc?.type === filterType);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold">Documents</h1>

      {/* File Upload Section */}
      <div className="bg-white p-4 rounded-md shadow-md space-y-4">
        <h2 className="text-lg font-semibold">Upload New Document</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* File Input */}
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            aria-label="Upload a document"
          />

          {/* Document Type Selector */}
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="border rounded-md p-2"
            aria-label="Select document type"
          >
            <option value="Resume">Resume</option>
            <option value="Cover Letter">Cover Letter</option>
            <option value="References">References</option>
            <option value="Certificates">Certificates</option>
            <option value="Other">Other</option>
          </select>

          {/* Upload Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!selectedFile}
            aria-disabled={!selectedFile}
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>

        {/* Display Selected File */}
        {selectedFile && (
          <p className="text-sm text-gray-600">
            Selected File: {selectedFile?.name} ({fileType})
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Filter by Type:
          <select
            className="ml-2 border rounded p-2"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Filter documents by type"
          >
            <option value="All">All</option>
            <option value="Resume">Resume</option>
            <option value="Cover Letter">Cover Letter</option>
            <option value="References">References</option>
            <option value="Certificates">Certificates</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>

      {/* Document List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments?.map((doc) => (
          <div
            key={doc._id}
            className="bg-gray-50 p-4 rounded-md shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{doc.name}</h3>
              <p className="text-sm text-gray-600">
                {doc.type} • {doc.uploadDate} • {doc.size}
              </p>
            </div>
            <div className="space-x-2">
              <a
                target='_blank'
                href={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/${doc.filePath}`}
                className="text-blue-500 hover:text-blue-700"
                download
              >
                Download
              </a>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(doc._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;








// 'use client';

// import React, { useState } from 'react';

// // Mock data for documents
// const mockDocuments = [
//   {
//     id: 1,
//     name: 'Resume.pdf',
//     type: 'Resume',
//     uploadDate: '2024-09-02',
//     size: '200KB',
//     link: '/documents/resume.pdf',
//   },
//   {
//     id: 2,
//     name: 'CoverLetter.pdf',
//     type: 'Cover Letter',
//     uploadDate: '2024-08-29',
//     size: '150KB',
//     link: '/documents/coverletter.pdf',
//   },
//   {
//     id: 3,
//     name: 'References.docx',
//     type: 'References',
//     uploadDate: '2024-08-15',
//     size: '90KB',
//     link: '/documents/references.docx',
//   },
// ];

// const DocumentsPage = () => {
//   const [documents, setDocuments] = useState(mockDocuments);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [fileType, setFileType] = useState<string>('Resume'); // Default to 'Resume'
//   const [filterType, setFilterType] = useState<string>('All');

//   // Handle file selection
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   // Handle file upload
//   const handleUpload = () => {
//     if (selectedFile) {
//       const newDocument = {
//         id: documents.length + 1,
//         name: selectedFile.name,
//         type: fileType,
//         uploadDate: new Date().toISOString().split('T')[0],
//         size: `${(selectedFile.size / 1024).toFixed(2)}KB`,
//         link: '#',
//       };
//       setDocuments([...documents, newDocument]);
//       setSelectedFile(null);
//       setFileType('Resume'); // Reset file type after upload
//     }
//   };

//   // Handle file deletion
//   const handleDelete = (id: number) => {
//     setDocuments(documents.filter((doc) => doc.id !== id));
//   };

//   // Filter documents by type
//   const filteredDocuments =
//     filterType === 'All'
//       ? documents
//       : documents.filter((doc) => doc.type === filterType);

//   return (
//     <div className="p-6 space-y-6">
//       {/* Page Header */}
//       <h1 className="text-2xl font-bold">Documents</h1>

//       {/* File Upload Section */}
//       <div className="bg-white p-4 rounded-md shadow-md space-y-4">
//         <h2 className="text-lg font-semibold">Upload New Document</h2>
//         <div className="flex flex-col gap-4 md:flex-row md:items-center">
//           {/* File Input */}
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             aria-label="Upload a document"
//           />

//           {/* Document Type Selector */}
//           <select
//             value={fileType}
//             onChange={(e) => setFileType(e.target.value)}
//             className="border rounded-md p-2"
//             aria-label="Select document type"
//           >
//             <option value="Resume">Resume</option>
//             <option value="Cover Letter">Cover Letter</option>
//             <option value="References">References</option>
//             <option value="Certificates">Certificates</option>
//             <option value="Other">Other</option>
//           </select>

//           {/* Upload Button */}
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//             disabled={!selectedFile}
//             aria-disabled={!selectedFile}
//             onClick={handleUpload}
//           >
//             Upload
//           </button>
//         </div>

//         {/* Display Selected File */}
//         {selectedFile && (
//           <p className="text-sm text-gray-600">
//             Selected File: {selectedFile.name} ({fileType})
//           </p>
//         )}
//       </div>

//       {/* Filter Bar */}
//       <div className="flex items-center justify-between">
//         <label className="text-sm font-medium text-gray-700">
//           Filter by Type:
//           <select
//             className="ml-2 border rounded p-2"
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             aria-label="Filter documents by type"
//           >
//             <option value="All">All</option>
//             <option value="Resume">Resume</option>
//             <option value="Cover Letter">Cover Letter</option>
//             <option value="References">References</option>
//             <option value="Certificates">Certificates</option>
//             <option value="Other">Other</option>
//           </select>
//         </label>
//       </div>

//       {/* Document List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredDocuments.map((doc) => (
//           <div
//             key={doc.id}
//             className="bg-gray-50 p-4 rounded-md shadow-md flex justify-between items-center"
//           >
//             <div>
//               <h3 className="text-lg font-semibold">{doc.name}</h3>
//               <p className="text-sm text-gray-600">
//                 {doc.type} • {doc.uploadDate} • {doc.size}
//               </p>
//             </div>
//             <div className="space-x-2">
//               <a
//                 href={doc.link}
//                 className="text-blue-500 hover:text-blue-700"
//                 download
//               >
//                 Download
//               </a>
//               <button
//                 className="text-red-500 hover:text-red-700"
//                 onClick={() => handleDelete(doc.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DocumentsPage;
