import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
            try {
                // const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, {
                //     email: credentials?.email,
                //     password: credentials?.password,
                // });
                const { email, password } = credentials as any;
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                // const user = response.data;
                const user = await res.json();

                // console.log("USER:", user);

                if (user.success && res.ok) {
                    return user;
                }

                if (!user?.data) throw new Error(user?.message || "An error occurred");

                return null;

            } catch (error: any) {
                // console.error("Hello", error);
                throw new Error(error.message);
            }
        } ,
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
        if (user) {
            token.accessToken = user.token;
            // token.userId = user.data?._id;
        }
        return {...token, ...user};
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user = token as any;
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        // signOut: '/auth/login',
        // error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
};