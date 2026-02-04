"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    
    // New State for Countdown
    const [timeLeft, setTimeLeft] = useState<number | null>(null); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/forgotpassword", { email });
            
            if (response.data.success) {
                setEmailSent(true);
                toast.success("Password reset link sent to your email!");
                
                // 1. Check if server returned an expiry timestamp
                if (response.data.expiresAt) {
                    const expiryTimestamp = Number(response.data.expiresAt);
                    const secondsLeft = Math.ceil((expiryTimestamp - Date.now()) / 1000);
                    
                    if (secondsLeft > 0) {
                        setTimeLeft(secondsLeft);
                        startCountdown(secondsLeft);
                    }
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    // 2. Helper function to start the countdown
    const startCountdown = (duration: number) => {
        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(timerId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        // Note: In a real app you might want to return this cleanup function to a useEffect
        // But since this is triggered inside a one-time event handler, 
        // the component state resets when navigating away anyway.
    };

    // 3. Helper to format time (MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                    <p className="text-gray-600">
                        {emailSent ? "Check your email" : "Enter your email to reset password"}
                    </p>
                </div>

                {!emailSent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Login
                            </Link>
                        </p>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Sent!</h2>
                        
                        <p className="text-gray-600 mb-6">
                            We&aposve sent a password reset link to <strong>{email}</strong>. 
                            <br />
                            {timeLeft !== null 
                                ? "The link will expire shortly." 
                                : "Please check your inbox."}
                        </p>

                        {/* NEW: Countdown UI */}
                        {timeLeft !== null && (
                            <div className="mb-6 flex justify-center">
                                <div className={`inline-flex items-center px-4 py-2 rounded-full border ${timeLeft === 0 ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-100'}`}>
                                    <svg className={`w-4 h-4 mr-2 ${timeLeft === 0 ? 'text-red-500' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span className={`font-mono font-bold ${timeLeft === 0 ? 'text-red-600' : 'text-indigo-700'}`}>
                                        {formatTime(timeLeft)}
                                    </span>
                                    <span className={`ml-2 text-xs font-medium uppercase ${timeLeft === 0 ? 'text-red-500' : 'text-indigo-500'}`}>
                                        {timeLeft === 0 ? 'Expired' : 'Left'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <Link 
                            href="/login"
                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}