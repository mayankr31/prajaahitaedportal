// "use client";
// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect } from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/NavBar";

// const VALID_ROLES = ["student", "volunteer", "expert"];

// // Footer Component
// const Footer = () => {
//   return (
//     <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
//           <span className="text-gray-600 font-medium">Powered by</span>

//           <div className="flex items-center space-x-6">
//             {/* Company 1 Logo */}
//             <div className="flex items-center">
//               <img
//                 src="/logoprajaahita.jpg" // Replace with your actual logo path
//                 alt="Prajaahita Logo"
//                 className="h-8 w-auto object-contain"
//               />
//             </div>

//             {/* Separator */}
//             <div className="h-8 w-px bg-gray-300"></div>

//             {/* Company 2 Logo */}
//             <div className="flex items-center">
//               <img
//                 src="/tinkerqubitsLogo.png" // Replace with your actual logo path
//                 alt="TinkerQubits Logo"
//                 className="h-8 w-auto object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default function Layout({ children }) {
//   const { data: session, status } = useSession();
//   const params = useParams();
//   const router = useRouter();
//   const role = params.role;

//   useEffect(() => {
//     // Check if URL contains redirected=true
//     const urlParams = new URLSearchParams(window.location.search);
//     const redirected = urlParams.get("redirected");

//     if (redirected === "true") {
//       // Remove the parameter from URL
//       urlParams.delete("redirected");
//       const newUrl =
//         window.location.pathname +
//         (urlParams.toString() ? "?" + urlParams.toString() : "");
//       window.history.replaceState({}, "", newUrl);

//       // Reload the page
//       window.location.reload();
//     }
//   }, []);

//   // Show loading while checking authentication
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Navbar */}
//       <Navbar />

//       <div className="flex flex-row flex-1">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content */}
//         <main className="flex-1 flex flex-col">
//           <div className="p-6 flex-1">{children}</div>
//         </main>
//       </div>
//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";

const VALID_ROLES = ["student", "volunteer", "expert"];

// Footer Component
const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          <span className="text-gray-600 font-medium">Powered by</span>

          <div className="flex items-center space-x-6">
            {/* Company 1 Logo */}
            <div className="flex items-center">
              <img
                src="/logoprajaahita.jpg" // Replace with your actual logo path
                alt="Prajaahita Logo"
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* Separator */}
            <div className="h-8 w-px bg-gray-300"></div>

            {/* Company 2 Logo */}
            <div className="flex items-center">
              <img
                src="/tinkerqubitsLogo.png" // Replace with your actual logo path
                alt="TinkerQubits Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const role = params.role;

  useEffect(() => {
    // Check if URL contains redirected=true
    const urlParams = new URLSearchParams(window.location.search);
    const redirected = urlParams.get("redirected");

    if (redirected === "true") {
      // Remove the parameter from URL
      urlParams.delete("redirected");
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? "?" + urlParams.toString() : "");
      window.history.replaceState({}, "", newUrl);

      // Reload the page
      window.location.reload();
    }
  }, []);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-row h-[calc(100vh-theme(spacing.16))]">
        {/* Assuming navbar height is roughly 4rem (16 in spacing scale) */}
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto pb-24">
          {/* pb-24 adds padding bottom to prevent content from being hidden behind fixed footer */}
          <div className="p-6">{children}</div>
        </main>
      </div>
      
      {/* Fixed Footer */}
      <Footer />
    </div>
  );
}