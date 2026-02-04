import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/userService";


export async function POST(request: NextRequest) {
    try {
        // extract token from body
        const {token} = await request.json();
        const user = await verifyEmailToken(token);

        return NextResponse.json({
            message: "Email verified successfully",
            success: true,
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}