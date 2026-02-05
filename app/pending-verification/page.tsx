"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

function VerificationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // 1. Parse Token and Expiry
    const currentToken = searchParams.get("token");
    const expiresAtParam = searchParams.get("expiresAt"); 

    // 2. Calculate initial time left
    // We handle the parsing here to avoid errors during SSR
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
        setVerified(false);
        setError(false);
        setLoading(false);
        
        const newTimeLeft = expiresAtParam 
            ? Math.ceil((parseInt(expiresAtParam) - Date.now()) / 1000) 
            : 120;
        
        setTimeLeft(Math.max(0, newTimeLeft)); 
    }, [searchParams, expiresAtParam]);

    // --- Logic: Verification Call ---
    const verifyUserEmail = async (tokenToVerify: string | null) => {
        if (!tokenToVerify) return;
        
        try {
            setLoading(true);
            setError(false);
            const response = await axios.post("/api/users/verifymail", { token: tokenToVerify });

            if (response.data.success) {
                setVerified(true);
                toast.success("Email verified successfully!");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (err: any) {
            setError(true);
            setVerified(false);
            toast.error(err.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // --- Main Orchestration Effect ---
    useEffect(() => {
        if (currentToken) {
            verifyUserEmail(currentToken);
        } else {
            if (timeLeft > 0) {
                const timerId = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerId);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                return () => clearInterval(timerId);
            }
        }
    }, [currentToken]);

    // Helper to format time (MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- RENDER UI ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden max-w-md w-full text-center border border-zinc-200 dark:border-zinc-800">
                <div className="bg-indigo-600 dark:bg-indigo-700 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">Email Verification</h1>
                    <p className="text-indigo-100 dark:text-indigo-200 text-sm mt-1">
                        {currentToken ? "Verifying..." : "Account Pending"}
                    </p>
                </div>

                <div className="p-8">
                    {loading && (
                        <div className="py-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 dark:border-indigo-500 mx-auto"></div>
                            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mt-6">Verifying your email</h2>
                        </div>
                    )}

                    {verified && (
                        <div className="py-6 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Verified!</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-8">Your email has been verified successfully.</p>
                            <Link href="/login" className="inline-block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {error && (
                        <div className="py-6">
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Link Invalid or Expired</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 mb-8">The verification link is not valid.</p>
                            <Link href="/login" className="inline-block w-full bg-zinc-800 dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-900 dark:hover:bg-zinc-200 transition">
                                Back to Login
                            </Link>
                        </div>
                    )}

                    {!loading && !verified && !error && !currentToken && (
                        <div className="space-y-6">
                            <div className="relative flex justify-center items-center py-4">
                                <div className="w-40 h-40 rounded-full border-4 border-indigo-100 dark:border-indigo-900 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <div className="text-4xl font-mono font-bold text-indigo-700 dark:text-indigo-400">
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className="text-xs text-indigo-400 dark:text-indigo-500 uppercase tracking-wider font-semibold mt-1">Remaining</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">Check your email</h2>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm px-4">
                                    We have sent a verification link to your registered email address.
                                </p>
                            </div>
                            {timeLeft === 0 && (
                                <div className="bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg text-sm">
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

// Wrapper with Suspense
export default function PendingVerificationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerificationContent />
        </Suspense>
    );
}