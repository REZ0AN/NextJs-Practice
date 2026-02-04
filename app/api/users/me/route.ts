import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/dbConfig";
import User from "@/models/userModel";

connectToDB();

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
            console.log("[ERROR] Invalid token:", error);    
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const userId = (decodedToken as any).id;

        // Fetch user data
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}   