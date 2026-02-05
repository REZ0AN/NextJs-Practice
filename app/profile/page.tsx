"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import moment from "moment";

export default function ProfilePage() {

    const [user, setUser] = React.useState({
        id: "",
        isVerified: false,
        username: "",
        email: "",
        createdAt: ""
    });

    const [passwordData, setPasswordData] = React.useState({
        password: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = React.useState(false);
    const [passwordLoading, setPasswordLoading] = React.useState(false);

    const logoutHandler = async () => {
        try {
            await axios.get('/api/users/logout');
            // Redirect to login page after logout
            window.location.href = '/';
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const getUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users/me');
            setUser({
                id: response.data.user._id,
                isVerified: response.data.user.isVerified,
                username: response.data.user.username,
                email: response.data.user.email,
                createdAt: response.data.user.createdAt,
            });
        } catch (error: any) {
            console.error("Error fetching user data:", error);
            toast.error(error.response?.data?.error || "Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!passwordData.password || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        if (passwordData.password === passwordData.newPassword) {
            toast.error("New password must be different from current password");
            return;
        }

        try {
            setPasswordLoading(true);
            const response = await axios.put('/api/users/updatepassword', {
                password: passwordData.password,
                newPassword: passwordData.newPassword
            });

            if (response.data.success) {
                toast.success("Password updated successfully!");
                // Clear the form
                setPasswordData({
                    password: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setPasswordLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                {user?.username}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 justify-center">
                            <button
                                className="bg-indigo-900 dark:bg-indigo-800 text-white dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href='/';
                                }}
                            >
                                Home
                            </button>
                            <button
                                className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    logoutHandler();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            {
                loading ? (
                    <div className="flex items-center justify-center h-[80vh]">
                        <div className="animate-spin rounded-full border-8 border-t-8 border-indigo-600 h-16 w-16"></div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side - User Information */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">User Information</h2>

                                <div className="space-y-6">
                                    {/* Username */}
                                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                            Username
                                        </label>
                                        <p className="text-lg text-zinc-900 dark:text-white font-medium">{user?.username}</p>
                                    </div>

                                    {/* Email */}
                                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                            Email
                                        </label>
                                        <p className="text-lg text-zinc-900 dark:text-white font-medium">{user?.email}</p>
                                    </div>

                                    {/* Created At */}
                                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                            Member Since
                                        </label>
                                        <p className="text-lg text-zinc-900 dark:text-white font-medium">
                                            {user?.createdAt ? moment(user?.createdAt).format("MMMM Do YYYY") : ""}
                                        </p>
                                    </div>

                                    {/* User ID (optional) */}
                                    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                            User ID
                                        </label>
                                        <p className="text-lg text-zinc-900 dark:text-white font-medium font-mono break-all">{user?.id}</p>
                                    </div>

                                    {/* Verification Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                                            Verification Status
                                        </label>
                                        <div className="flex items-center">
                                            {user?.isVerified ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-400">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-400">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Not Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Change Password */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Change Password</h2>

                                <form className="space-y-6" onSubmit={handlePasswordChange}>
                                    {/* Current Password */}
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordData.password}
                                            onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                            className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    {/* Confirm New Password */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Password Requirements:</p>
                                        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                                            <li className={passwordData.newPassword.length >= 6 ? "text-green-600 dark:text-green-400" : ""}>
                                                • At least 6 characters long
                                            </li>
                                            <li className={passwordData.newPassword !== passwordData.password && passwordData.newPassword.length > 0 ? "text-green-600 dark:text-green-400" : ""}>
                                                • Different from current password
                                            </li>
                                            <li className={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword.length > 0 ? "text-green-600 dark:text-green-400" : ""}>
                                                • Passwords match
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition ${passwordLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {passwordLoading ? "Updating..." : "Update Password"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}