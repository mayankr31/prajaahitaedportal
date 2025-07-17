"use client";
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/NavBar';

const VALID_ROLES = ['student', 'volunteer', 'expert'];

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const role = params.role;

  
  useEffect(() => {
    // Check if URL contains redirected=true
    const urlParams = new URLSearchParams(window.location.search);
    const redirected = urlParams.get('redirected');
    
    if (redirected === 'true') {
      // Remove the parameter from URL
      urlParams.delete('redirected');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, '', newUrl);
      
      // Reload the page
      window.location.reload();
    }
  }, []);

  // useEffect(() => {
  //   console.log('Session status:', status);
  //   console.log('Session data:', session);
  //   console.log('Timestamp:', new Date().toISOString());
  //   console.log('Role from URL:', role);
  //   console.log('---');
  // }, [session, status, role]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // // Don't render anything if redirecting
  // if (status === 'unauthenticated' || 
  //     (status === 'authenticated' && session.user.role !== role)) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex flex-row">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className='p-6'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}