import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";
import { connectToDB } from "@/configs/dbConfig";
import User from "@/models/userModel";

connectToDB();

export async function GET(request: NextRequest) {
    try {


        // Fetch user data
        const tokenData = getTokenData(request.cookies.get("token")?.value || "");
        if (!tokenData) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = tokenData.id;
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