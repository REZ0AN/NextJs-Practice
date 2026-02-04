
export default function ProfilePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
                        <p className="text-gray-600">Manage your profile information</p>
                    </div>

                    {/* Profile Content */}
                    <div className="space-y-6">
                        <p className="text-gray-700">This is where your profile details will be displayed.</p>
                        {/* Additional profile management features can be added here */}
                    </div>
                </div>
            </div>
        </div>
    );
}   