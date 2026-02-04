import { connectToDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
connectToDB();

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        
        // Find user by username
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }
        
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
        }

        // create token data
        const tokenData  = { id: existingUser._id, username: existingUser.username };
        // create JWT token
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1h" });

        // Set token in HttpOnly cookie
        const response = NextResponse.json({ message: "Login successful", success: true }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 3600, // 1 hour in seconds
        });
        
        return response ;
    } catch (error) {
        console.error("Error logging in user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}    