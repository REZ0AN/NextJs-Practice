"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Get Token
    const [token, setToken] = useState("");
    
    // Get Expiry
    const expiresAtParam = searchParams.get("expiresAt");
    const initialTimeLeft = expiresAtParam 
        ? Math.ceil((parseInt(expiresAtParam) - Date.now()) / 1000) 
        : 0; // 0 means do not show timer

    // Form State
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    // Countdown State
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

    // --- Initialize Token and Timer ---
    useEffect(() => {
        const urlToken = searchParams.get("token");
        setToken(urlToken || "");

        // Timer Logic
        if (initialTimeLeft > 0) {
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
    }, [searchParams, initialTimeLeft]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`/api/users/resetpassword`, {
                token,
                newPassword: password,
            });

            if (response.data.success) {
                setResetSuccess(true);
                toast.success("Password reset successful!");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    // Helper to format time (MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- Render: Invalid Token State ---
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
                    <p className="text-gray-600 mb-6">This password reset link is invalid.</p>
                    <Link 
                        href="/forgotpassword"
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    // --- Render: Main Page ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">Enter your new password</p>
                </div>

                {/* NEW: Countdown Timer Display */}
                {initialTimeLeft > 0 && (
                    <div className="mb-6">
                        <div className={`flex items-center justify-center p-3 rounded-lg border ${timeLeft === 0 ? 'bg-red-50 border-red-200' : 'bg-indigo-50 border-indigo-100'}`}>
                            <svg className={`w-5 h-5 mr-2 ${timeLeft === 0 ? 'text-red-500' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className={`font-mono font-bold text-lg ${timeLeft === 0 ? 'text-red-600' : 'text-indigo-700'}`}>
                                {formatTime(timeLeft)}
                            </span>
                            <span className={`ml-2 text-sm font-medium ${timeLeft === 0 ? 'text-red-500' : 'text-indigo-500'}`}>
                                {timeLeft === 0 ? 'Link Expired' : 'remaining'}
                            </span>
                        </div>
                        {timeLeft === 0 && (
                            <p className="text-xs text-red-500 mt-2 text-center">The reset link has expired. Please request a new one.</p>
                        )}
                    </div>
                )}

                {!resetSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• At least 6 characters long</li>
                                <li>• Contains uppercase and lowercase letters</li>
                                <li>• Contains at least one number</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || timeLeft === 0} // Disable if expired
                            className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition ${loading || timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-green-600 mb-2">Success!</h2>
                        <p className="text-gray-600 mb-6">Your password has been reset successfully.</p>
                        <p className="text-sm text-gray-500">Redirecting to login...</p>
                    </div>
                )}
            </div>
        </div>
    );
}