import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/configs/dbConfig";
import User from "@/models/userModel"
import { sendEmail } from "@/helpers/mailer";
import { createPasswordResetToken } from "@/lib/userService";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Create reset token
        const resetToken = await createPasswordResetToken(user.email);

        // Send email
        await sendEmail({
            email,
            emailType: "RESET",
            token: resetToken,
        });

        return NextResponse.json({
            message: "Password reset email sent",
            success: true,
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}