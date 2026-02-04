import { getTokenData } from '@/helpers/getTokenData';
import { connectToDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import getHashedValue from '@/helpers/getHashedData';

connectToDB();

export async function PUT(request: NextRequest) {
    try {
        const tokenData = getTokenData(request.cookies.get("token")?.value || "");
        if (!tokenData) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { password, newPassword } = await request.json();

        // Validate inputs
        if (!password || !newPassword) {
            return NextResponse.json(
                { message: "Current password and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: "New password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        const userId = tokenData.id;
        
        // Find user WITH password (remove .select("-password"))
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Current password is incorrect" },
                { status: 401 }
            );
        }

        // Hash new password
        const hashedPassword = await getHashedValue(newPassword);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            message: "Password updated successfully",
            success: true
        });

    } catch (error: any) {
        console.error("Error updating password:", error);
        return NextResponse.json(
            { message: error.message || "Failed to update password" },
            { status: 500 }
        );
    }
}