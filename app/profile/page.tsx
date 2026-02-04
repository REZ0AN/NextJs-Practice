"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import moment from "moment";

export default  function ProfilePage() {

    const [user, setUser] = React.useState({
        id:"",
        isVerified:false,
        username:"",
        email:"",
        createdAt:""

    });
    const [loading, setLoading] = React.useState(false);

    const logoutHandler =  async () => {
        try {
            await axios.get('/api/users/logout');
            // Redirect to login page after logout
            window.location.href = '/login';
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };



    const getUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users/me');
            setUser({
                ...user,
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

    useEffect(() => {
        getUserData();
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                        </div>
                        <button
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition"
                            onClick={(e) => {
                                e.preventDefault();
                                logoutHandler();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            {
                loading ? (
                    <div className="flex items-center justify-center h-[80vh]">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    </div>
                ) : (            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - User Information */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Information</h2>
                        
                        <div className="space-y-6">
                            {/* Username */}
                            <div className="border-b border-gray-200 pb-4">
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Username
                                </label>
                                <p className="text-lg text-gray-900 font-medium">{user?.username}</p>
                            </div>

                            {/* Email */}
                            <div className="border-b border-gray-200 pb-4">
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Email
                                </label>
                                <p className="text-lg text-gray-900 font-medium">{user?.email}</p>
                            </div>

                            {/* Created At */}
                            <div className="border-b border-gray-200 pb-4">
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Member Since
                                </label>
                                <p className="text-lg text-gray-900 font-medium">{user?.createdAt? moment(user?.createdAt).format("MMMM Do YYYY"): "" }</p>
                            </div>

                            {/* User ID (optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    User ID
                                </label>
                                <p className="text-lg text-gray-900 font-medium font-mono">{user?.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Change Password */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                        
                        <form className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter current password"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter new password"
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• At least 8 characters long</li>
                                    <li>• Contains uppercase and lowercase letters</li>
                                    <li>• Contains at least one number</li>
                                    <li>• Contains at least one special character</li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>)
            }
        </div>
    );
}
    