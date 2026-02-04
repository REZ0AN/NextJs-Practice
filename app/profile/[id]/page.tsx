"use client"

export default function ProfilePage({params}: any) {

    const userId = (async ()=> {
        const {id} = await params;
        return id;
    })()
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center">
            <h1 className="text-center text-2xl font-bold text-teal-800">Profile Page of {userId}</h1>
        </div>
    )
}   