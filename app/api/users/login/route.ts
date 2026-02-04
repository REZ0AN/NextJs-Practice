import { connectToDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createVerificationToken } from "@/lib/userService";
import { sendEmail } from "@/helpers/mailer";
connectToDB();

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        
        // Input validation
        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required" },
                { status: 400 }
            );
        }

        // Validate username format (alphanumeric, 3-20 characters)
        if (username.trim().length < 3 || username.trim().length > 20) {
            return NextResponse.json(
                { message: "Username must be between 3 and 20 characters" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Find user by username (case-insensitive)
        const existingUser = await User.findOne({ 
            username: { $regex: new RegExp(`^${username}$`, 'i') } 
        });

        if (!existingUser) {
            return NextResponse.json(
                { message: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Check if user is verified (optional - uncomment if you want email verification)
        if (!existingUser.isVerified) {
            // Create verification token
            const {token, expiresAt} = await createVerificationToken(existingUser.email.toString());
    
            // Send verification email
            await sendEmail({
                email: existingUser.email,
                emailType: "VERIFY",
                token,
                expiresAt
            });
            
            return NextResponse.json(
                { message: "Please verify your email before logging in", expiresAt },
                { status: 403 }
            );
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid username or password" },
                { status: 401 }
            );
        }

        // Create token data
        const tokenData = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email
        };

        // Create JWT token
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
            expiresIn: "1d" // Changed to 1 day for better UX
        });

        // Create response
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            }
        }, { status: 200 });

        // Set token in HttpOnly cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 3600, // 1 day in seconds
        });

        return response;

    } catch (error: any) {
        console.error("Error logging in user:", error);
        
        // Handle specific errors
        if (error.name === "JsonWebTokenError") {
            return NextResponse.json(
                { message: "Invalid token configuration" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}