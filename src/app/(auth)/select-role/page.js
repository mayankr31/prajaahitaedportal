// app/auth/select-role/page.js
'use client'
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SelectRole() {
  const { data: session, update } = useSession()
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // If user already has a role, redirect them
    if (session && !session.user.needsRoleSelection) {
      router.push(`/${session.user.role}/notifications`)
    }
  }, [session, router])

  const handleRoleSelection = async () => {
    if (!selectedRole || !session?.user?.email) return

    setLoading(true)
    try {
      const response = await fetch('/api/user/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session.user.email,
          role: selectedRole 
        })
      })

      if (response.ok) {
        // Update the session
        await update()
        
        // Redirect based on role
        router.push(`/${selectedRole}/notifications`)
      } else {
        alert('Failed to update role. Please try again.')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('An error occurred. Please try again.')
    }
    setLoading(false)
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
        <p className="text-gray-600 mb-6 text-center">
          Please select your role to continue to your dashboard.
        </p>
        
        <div className="space-y-4">
          {[
            { value: 'student', label: 'Student', description: 'Access courses and assignments' },
            { value: 'volunteer', label: 'Volunteer', description: 'Manage events and schedules' },
            { value: 'admin', label: 'Admin', description: 'Full system access' }
          ].map((role) => (
            <label key={role.value} className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mr-3 mt-1"
              />
              <div>
                <div className="font-medium">{role.label}</div>
                <div className="text-sm text-gray-600">{role.description}</div>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleRoleSelection}
          disabled={!selectedRole || loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}