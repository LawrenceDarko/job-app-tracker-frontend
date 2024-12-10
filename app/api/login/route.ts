import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const registrationData = await req.json();
        // console.log("Login Data", registrationData)

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });

        const contentType = res.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            const textData = await res.text();
            throw new Error(`Unexpected response format: ${textData}`);
        }

        // Set cookie
        const cookieStore = cookies();
        cookieStore.set('token', data?.token, { httpOnly: false, maxAge: 24 * 60 * 60 * 1000, secure: false });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error in login API:", error);
        return NextResponse.json({ status: false, msg: error.message || 'An error occurred' }, { status: 500 });
    }
}
