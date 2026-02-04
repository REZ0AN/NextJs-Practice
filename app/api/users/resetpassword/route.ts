import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/userService";

export async function POST(request: NextRequest) {
    try {
        // extract token from query params
        const {token, newPassword} = await request.json();

        const user = await resetPassword(token, newPassword);

        return NextResponse.json({
            message: "Pasword Reset successfully",
            success: true,
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}