// app/unauthorized/page.js
'use client'
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Unauthorized() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        {session?.user?.role && (
          <Link 
            href={`/${session.user.role}/notifications`}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Your Dashboard
          </Link>
        )}
      </div>
    </div>
  )
}