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
        const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fafafa;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <!-- Main Card -->
                        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                            
                            <!-- Header with gradient -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 32px; text-align: center;">
                                    <div style="width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.2;">Verify Your Email</h1>
                                    <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Complete your registration</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 32px;">
                                    <p style="margin: 0 0 24px 0; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                                        Welcome! We're excited to have you on board. To complete your registration and access your account, please verify your email address by clicking the button below.
                                    </p>
                                    
                                    <!-- Button -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pending-verification?token=${token}&expiresAt=${expiresAt}" 
                                                style="display: inline-block; background-color: #6366f1; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
                                                    Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Divider -->
                                    <div style="border-top: 1px solid #e4e4e7; margin: 32px 0;"></div>
                                    
                                    <!-- Alternative Link Section -->
                                    <p style="margin: 0 0 12px 0; color: #71717a; font-size: 14px; line-height: 1.5;">
                                        If the button doesn't work, copy and paste this link into your browser:
                                    </p>
                                    <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; word-break: break-all;">
                                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pending-verification?token=${token}&expiresAt=${expiresAt}" 
                                        style="color: #6366f1; font-size: 13px; text-decoration: none;">
                                            ${process.env.NEXT_PUBLIC_BASE_URL}/pending-verification?token=${token}&expiresAt=${expiresAt}
                                        </a>
                                    </div>
                                    
                                    <!-- Warning Box -->
                                    <div style="margin-top: 32px; background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px;">
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                            <strong>⏰ Time Sensitive:</strong> This verification link will expire in <strong>2 minutes</strong> for security reasons.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 32px; border-top: 1px solid #e4e4e7;">
                                    <p style="margin: 0 0 8px 0; color: #71717a; font-size: 13px; line-height: 1.6; text-align: center;">
                                        If you didn't create an account, you can safely ignore this email.
                                    </p>
                                    <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center;">
                                        © ${new Date().getFullYear()} MyApp. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;
       const resetPassworHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fafafa;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <!-- Main Card -->
                        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                            
                            <!-- Header with gradient -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 32px; text-align: center;">
                                    <div style="width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 15V17M6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V13C20 12.4696 19.7893 11.9609 19.4142 11.5858C19.0391 11.2107 18.5304 11 18 11H6C5.46957 11 4.96086 11.2107 4.58579 11.5858C4.21071 11.9609 4 12.4696 4 13V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21ZM16 11V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V11H16Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.2;">Reset Your Password</h1>
                                    <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Secure your account</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 32px;">
                                    <p style="margin: 0 0 24px 0; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                                        We received a request to reset your password. Click the button below to create a new password for your account.
                                    </p>
                                    
                                    <!-- Button -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}&expiresAt=${expiresAt}" 
                                                style="display: inline-block; background-color: #6366f1; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Divider -->
                                    <div style="border-top: 1px solid #e4e4e7; margin: 32px 0;"></div>
                                    
                                    <!-- Alternative Link Section -->
                                    <p style="margin: 0 0 12px 0; color: #71717a; font-size: 14px; line-height: 1.5;">
                                        If the button doesn't work, copy and paste this link into your browser:
                                    </p>
                                    <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; word-break: break-all;">
                                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}&expiresAt=${expiresAt}" 
                                        style="color: #6366f1; font-size: 13px; text-decoration: none;">
                                            ${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}&expiresAt=${expiresAt}
                                        </a>
                                    </div>
                                    
                                    <!-- Warning Box -->
                                    <div style="margin-top: 32px; background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px;">
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                            <strong>⏰ Time Sensitive:</strong> This password reset link will expire in <strong>2 minutes</strong> for security reasons.
                                        </p>
                                    </div>
                                    
                                    <!-- Security Notice -->
                                    <div style="margin-top: 24px; background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px;">
                                        <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.5;">
                                            <strong>🔒 Security Tip:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 32px; border-top: 1px solid #e4e4e7;">
                                    <p style="margin: 0 0 8px 0; color: #71717a; font-size: 13px; line-height: 1.6; text-align: center;">
                                        This is an automated message. Please do not reply to this email.
                                    </p>
                                    <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center;">
                                        © ${new Date().getFullYear()} MyApp. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;
        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: emailType === "VERIFY" 
                ? `
                    ${emailHTML}
                `
                : `
                    ${resetPassworHTML}
                `,
        };

        // Send email
        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
};