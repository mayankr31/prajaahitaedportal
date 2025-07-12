"use client";
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavBar />
      
      <div className="flex flex-row">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 ">
          <div className='p-6'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}