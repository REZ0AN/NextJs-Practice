import jwt from "jsonwebtoken";

interface TokenData {
    id: string;
    iat: number;
    exp: number;
}

export function getTokenData(token: string): TokenData | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenData;
        return decoded;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}