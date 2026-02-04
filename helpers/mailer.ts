import nodemailer from "nodemailer";

interface EmailParams {
    email: string;
    emailType: "VERIFY" | "RESET";
    token: string;
    expiresAt : number;
}

export const sendEmail = async ({ email, emailType, token, expiresAt }: EmailParams) => {
    try {
        const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "2525"),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: emailType === "VERIFY" 
                ? `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Email Verification</h2>
                        <p>Click the link below to verify your email:</p>
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pending-verification?token=${token}&expiresAt=${expiresAt}" 
                           style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verify Email
                        </a>
                        <p>Or copy and paste this link in your browser:</p>
                        <a href=${process.env.NEXT_PUBLIC_BASE_URL}/pending-verification?token=${token}&expiresAt=${expiresAt} target="_blank">${process.env.NEXT_PUBLIC_BASE_URL}/pending-verification?token=${token}&expiresAt=${expiresAt}</a>
                        <p>This link will expire in 2 minutes.</p>
                    </div>
                `
                : `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Reset Your Password</h2>
                        <p>Click the link below to reset your password:</p>
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}&expiresAt=${expiresAt}" 
                           style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                        <p>Or copy and paste this link in your browser:</p>
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}&expiresAt=${expiresAt}" target="_blank">${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}&expiresAt=${expiresAt}</p>
                        <p>This link will expire in 2 minutes.</p>
                    </div>
                `,
        };

        // Send email
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
};