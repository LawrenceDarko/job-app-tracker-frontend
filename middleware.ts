import { NextRequest, NextResponse } from "next/server";
import { IUserInfo } from "./typings/types";
import { getToken } from "next-auth/jwt";


export function decodedToken(token: string): IUserInfo | null {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded as IUserInfo;
    } catch (error) {
        // console.error('Token decoding error:', error);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const url = request.nextUrl.clone();

    const authToken = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET as string 
    });
    // console.log("Auth token:", authToken);

    // const token = request.cookies.get('token' as string)?.value;
    const token = authToken?.accessToken;

    if(!token && pathname !== '/auth/login'){
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/auth/login`)
    }

    if (token) {
        const user = decodedToken(token as string) as any;

        // if token is expired then redirect to login page
        if (user.exp < Date.now()/1000 && pathname !== '/auth/login') {
            url.pathname = "/auth/login";
            return NextResponse.redirect(new URL(url, request.url));
        }

        // if user is logged in and still wan to access login page redirect back
        if (user.exp > Date.now()/1000 && pathname === '/auth/login') {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        

    }

    // return NextResponse.next();
}

export const config = {
    matcher: [
        '/auth/login',
        // '/auth/register',
        "/",
    ],
}

