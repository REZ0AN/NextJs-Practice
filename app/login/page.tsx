// one decorator you make this page client-component
'use client';

import React, { useEffect } from 'react';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast/headless';
import Link from "next/link";

export default function LoginPage() {
    const [user, setUser] = React.useState({
        username: '',
        password: ''
    });
    const router = useRouter();
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/login', user);
            const data = response.data;
            
            if (data.success) {
                toast.success("Login successful! Redirecting...");
                router.push('/profile');
            } else {
                setError(data.message);
                toast.error(data.message);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred during login.";
            
            // Check if error is due to unverified email
            if (error.response?.status === 403 || errorMessage.includes("verify your email")) {
                toast.error("Please verify your email first");
                router.push('/pending-verification');
            } else {
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.username.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);   
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">{loading ? "Logging in..." : error}</p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={(e) => setUser({...user, username: e.target.value})}
                            className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="johndoe"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={(e) => setUser({...user, password: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg text-black border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>
                    {/* Add this after the password field in your login form */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link 
                                href="/forgotpassword" 
                                className="text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={buttonDisabled}
                    >
                        Login
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don&apost have an account?{' '}
                    <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Register
                    </a>
                </p>
            </div>
        </div>
    </div>
);
}