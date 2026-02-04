import {NextResponse} from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({ message: "Logout successful", success: true }, { status: 200 });
        // Clear the token cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            maxAge: 0, // Expire the cookie immediately
        });
        return response;

    } catch (error) {
        console.error("Error logging out user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}