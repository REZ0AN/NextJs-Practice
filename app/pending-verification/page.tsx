"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PendingVerificationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // 1. Parse Token and Expiry Timestamp from URL
    const currentToken = searchParams.get("token");
    const expiresAtParam = searchParams.get("expiresAt"); 

    // 2. Calculate initial time left
    // Default to 120 seconds if no expiresAt is provided (fallback)
    const initialTimeLeft = expiresAtParam 
        ? Math.ceil((parseInt(expiresAtParam) - Date.now()) / 1000) 
        : 120;

    // --- State ---
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    // --- Logic: Determine Initial State based on Token ---
    useEffect(() => {
        // Reset states when search params change (e.g. user clicks link while waiting)
        setVerified(false);
        setError(false);
        setLoading(false);
        
        // Recalculate timeLeft whenever the URL search params change
        const newTimeLeft = expiresAtParam 
            ? Math.ceil((parseInt(expiresAtParam) - Date.now()) / 1000) 
            : 120;
        
        setTimeLeft(Math.max(0, newTimeLeft)); // Ensure we don't show negative time
    }, [searchParams, expiresAtParam]);

    // --- Logic: Verification Call ---
    const verifyUserEmail = async (tokenToVerify: string | null) => {
        if (!tokenToVerify) return;
        
        try {
            setLoading(true);
            setError(false);
            
            // API Call
            const response = await axios.post("/api/users/verifymail", { token: tokenToVerify });

            if (response.data.success) {
                setVerified(true);
                toast.success("Email verified successfully!");
                
                // Auto redirect to login after 2 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (error: any) {
            setError(true);
            setVerified(false);
            toast.error(error.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // --- Main Orchestration Effect ---
    useEffect(() => {
        // SCENARIO A: User clicked the link (Token is present)
        if (currentToken) {
            // Immediately verify without waiting
            verifyUserEmail(currentToken);
        } 
        // SCENARIO B: User is waiting for email (No token)
        else {
            // Start countdown timer logic only if we have time remaining
            const timerId = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerId);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Cleanup interval on unmount or dependency change
            return () => clearInterval(timerId);
        }
    }, [currentToken]); // Re-run if token appears in URL

    // Helper to format time (MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full text-center border border-slate-100">
                
                {/* Header */}
                <div className="bg-indigo-600 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">Email Verification</h1>
                    <p className="text-indigo-100 text-sm mt-1">
                        {currentToken ? "Verifying..." : "Account Pending"}
                    </p>
                </div>

                <div className="p-8">
                    
                    {/* 1. LOADING STATE (Token found, verifying...) */}
                    {loading && (
                        <div className="py-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                            <h2 className="text-lg font-semibold text-slate-800 mt-6">Verifying your email</h2>
                            <p className="text-slate-500 text-sm mt-2">Please wait while we confirm your request.</p>
                        </div>
                    )}

                    {/* 2. SUCCESS STATE */}
                    {verified && (
                        <div className="py-6 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Verified!</h2>
                            <p className="text-slate-600 mb-8">Your email has been verified successfully. Redirecting to login...</p>
                            
                            <Link 
                                href="/login"
                                className="inline-block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {/* 3. ERROR STATE (Token invalid/expired) */}
                    {error && (
                        <div className="py-6">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Link Invalid or Expired</h2>
                            <p className="text-slate-500 mb-8">
                                The verification link you used is not valid or has expired.
                            </p>
                            <Link 
                                href="/login"
                                className="inline-block w-full bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-900 transition"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}

                    {/* 4. WAITING STATE (No Token -> Countdown) */}
                    {!loading && !verified && !error && !searchParams.get("token") && (
                        <div className="space-y-6">
                            
                            {/* Large Countdown Timer */}
                            <div className="relative flex justify-center items-center py-4">
                                <div className="w-40 h-40 rounded-full border-4 border-indigo-100 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <div className="text-4xl font-mono font-bold text-indigo-700">
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mt-1">Remaining</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-slate-800">Check your email</h2>
                                <p className="text-slate-500 text-sm px-4">
                                    We have sent a verification link to your registered email address. 
                                    <br/><br/>
                                    The link is valid for <strong>2 minutes</strong>. Please click it to activate your account.
                                </p>
                            </div>

                            {timeLeft === 0 && (
                                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
                                    Time expired. The token is no longer valid.
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}