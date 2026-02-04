import { connectToDB } from "@/configs/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


connectToDB();

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        
        // salt and 
        const salt = await bcrypt.genSalt(12);
        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        return NextResponse.json({ message: "User registered successfully", success: true }, { status: 201 });
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}   