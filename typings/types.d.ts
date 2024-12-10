export interface IUserInfo {
    exp: number; // Expiration timestamp
    userId: string; // User role
    username: string;
}

export interface IApplication {
    id: number;
    jobTitle: string;
    company: string;
    applicationDate: string;
    status: string;
    notes?: string;
    interviewDate?: string;
    attachedDocuments?: string[];
}