// one decorator you make this page client-component
'use client';

import React, { useEffect } from 'react';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';


export default function RegisterPage() {
    const [user, setUser] = React.useState({
        username: '',
        email: '',
        password: ''
    });
    const router = useRouter();

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const onRegister = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/register', user);
            const data = response.data;
            if (data.success) {
                toast.success("Registration successful! Redirecting to email verification...");
                router.push(`/pending-verification?expiresAt=${data.expiresAt}`);
            } else {
                setError(data.message);
                toast.error(error);
            }
        } catch (error : any) {
            setError(`Error registering user : ${error}`);
            toast.error(error.message || error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);   
        } else {
            setButtonDisabled(true);
        }
    }, [user]);
return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4 py-12">
        <div className="w-full max-w-md">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">{loading ? "Creating account..." : "Register to get started"}</p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={(e) => setUser({...user, username: e.target.value})}
                            className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="johndoe"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                            className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="john@example.com"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={(e) => setUser({...user, password: e.target.value})}
                            className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={buttonDisabled}
                        className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Register
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    </div>
);
    }