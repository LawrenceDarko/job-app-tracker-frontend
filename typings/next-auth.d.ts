import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            data: {
                _id: string;
                username: string;
                email: string;
                image?: string;
                organization?: {
                    _id: string;
                    name: string;
                    owner: string;
                    createdAt: string;
                    updatedAt: string;
                };
                role: {
                    _id: string;
                    name: string;
                    description: string;
                    createdAt: string;
                    updatedAt: string;
                };
                subscription: any;
            };
            token: string;
            message: string;
        };
    }
}