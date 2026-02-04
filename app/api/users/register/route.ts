import { connectToDB } from "@/configs/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import { createVerificationToken } from "@/lib/userService";
import User from "@/models/userModel";
import getHashedValue from "@/helpers/getHashedData";
import { NextRequest, NextResponse } from "next/server";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();
        
        // Input validation - Check if all fields are provided
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate username
        if (username.trim().length < 3 || username.trim().length > 20) {
            return NextResponse.json(
                { message: "Username must be between 3 and 20 characters" },
                { status: 400 }
            );
        }

        // Validate username format (alphanumeric and underscores only)
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username.trim())) {
            return NextResponse.json(
                { message: "Username can only contain letters, numbers, and underscores" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return NextResponse.json(
                { message: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }


        // Check if email already exists
        const existingUserByEmail = await User.findOne({ 
            email: email.trim().toLowerCase() 
        });
        if (existingUserByEmail) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 400 }
            );
        }

        // Check if username already exists (case-insensitive)
        const existingUserByUsername = await User.findOne({
            username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
        });
        if (existingUserByUsername) {
            return NextResponse.json(
                { message: "Username already taken" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await getHashedValue(password);

        // Create new user with trimmed and normalized data
        const newUser = new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            isVerified: false
        });
        
        const savedUser = await newUser.save();

        // Create verification token
        const {token, expiresAt} = await createVerificationToken(savedUser.email.toString());

        // Send verification email
        await sendEmail({
            email: savedUser.email,
            emailType: "VERIFY",
            token,
            expiresAt
        });

        return NextResponse.json({
            message: "Registration successful! Please check your email to verify your account.",
            success: true,
            expiresAt,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error registering user:", error);

        // Handle specific MongoDB errors
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json(
                { message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` },
                { status: 400 }
            );
        }

        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { message: messages.join(", ") },
                { status: 400 }
            );
        }

        // Handle email sending errors
        if (error.message && error.message.includes("email")) {
            return NextResponse.json(
                { message: "User registered but failed to send verification email. Please contact support." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}