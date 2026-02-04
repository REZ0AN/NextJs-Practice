import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/configs/dbConfig";


export const createVerificationToken = async (email : string) => {
    try {

        const hashedToken = await bcrypt.hash(email + Date.now().toString(), 10);
        await connectToDB();
        const user = await User.findOneAndUpdate(
            { email },
            { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 120000 }, // 1 hour expiry
            { new: true }
        );
        return {token:hashedToken, expiresAt: user.verifyTokenExpiry.getTime()};

    } catch (error: any) {
        throw new Error(error.message);
    }

}

export const createPasswordResetToken = async (email: string) => {
    try {
        const hashedToken = await bcrypt.hash(email + Date.now().toString(), 10);
        
        const user =  await User.findOneAndUpdate(
            { email },
            { forgetPasswordToken: hashedToken, forgetPasswordTokenExpiry: Date.now() + 120000 },
            { new: true }
        );
        
        return {
            token:hashedToken,
            expiresAt: user.forgetPasswordTokenExpiry.getTime()
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const verifyEmailToken = async (token: string) => {
    try {
        await connectToDB();
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });
        if(!user) {
            throw new Error("Invalid or expired token");
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return user;

    } catch (error: any) {
        throw new Error(error.message);
    }
}


export const verifyPasswordResetToken = async (token: string) => {
    try {
        await connectToDB();
        const user = await User.findOne({
            forgetPasswordToken: token,
            forgetPasswordTokenExpiry: { $gt: Date.now() }
        });
        if(!user) {
            throw new Error("Invalid or expired token");
        }
        return user;
        
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        await connectToDB();
        const user = await verifyPasswordResetToken(token);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        user.forgetPasswordToken = undefined;
        user.forgetPasswordTokenExpiry = undefined;
        await user.save();
        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
}   