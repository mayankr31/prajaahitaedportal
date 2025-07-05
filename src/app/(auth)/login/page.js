// // src\app\(auth)\login\page.js
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import GoogleSignUpButton from "./GoogleSignUpButton"; // We'll create this client component
// import Link from "next/link";
// import { signIn } from "@/auth";
// import { AuthError } from "next-auth";
// import { prisma } from "@/lib/prisma"; // Import Prisma client

// async function handleLogin(formData) {
//   "use server";

//   const email = formData.get("email");
//   const password = formData.get("password");

//   console.log("Login attempt for email:", email);

//   try {
//     // Get user to check role before signing in
//     const user = await prisma.user.findFirst({
//       where: { email },
//       select: { role: true, id: true, email: true }
//     });

//     console.log("Found user:", user);

//     if (!user) {
//       console.log("User not found in database");
//       return { error: "Invalid credentials." };
//     }

//     const role = user.role || 'student';
//     const redirectUrl = `/${role}/notifications`;
    
//     console.log("Attempting sign in with redirect to:", redirectUrl);

//     // Let NextAuth handle the redirect properly
//     await signIn("credentials", {
//       email,
//       password,
//       redirectTo: redirectUrl, // Use redirectTo to ensure NextAuth handles the redirect
//     });

//     console.log("Sign in successful");
    
//   } catch (error) {
//     console.error("Login error:", error);
    
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Invalid credentials." };
//         default:
//           return { error: "Something went wrong." };
//       }
//     }
//     throw error;
//   }
// }

// export default function LoginPage() {
//   return (
//     <div
//       className="min-h-screen flex"
//       style={{
//         background: `
//       linear-gradient(
//         to right, 
//         white 0%, 
//         white 45%, 
//         #30699B 45%, 
//         #30699B 100%
//       )
//     `,
//       }}
//     >
//       <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl w-full">
//           <div className="bg-white rounded-lg shadow-xl overflow-hidden px-20 py-10">
//             <div className="flex flex-col lg:flex-row ">
//               {/* Left side - 40% white for logo */}
//               <div className="lg:w-2/5 p-8 lg:p-12 flex items-center justify-center">
//                 <div className="mb-8">
//                   <Image
//                     src="/prajaahitalogin.png"
//                     alt="Prajaahita login"
//                     width={320}
//                     height={80}
//                     priority
//                   />
//                 </div>
//               </div>

//               {/* Right side - 60% for login form */}
//               <div className="lg:w-3/5 p-6 lg:p-8 bg-white">
//                 <form action={handleLogin} className="px-12">
//                   {/* Email Input */}
//                   <div className="relative mb-5">
//                     <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
//                       <svg
//                         className="w-3.5 h-3.5 text-gray-400"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Email Address"
//                       className="w-full pl-8 pr-3 py-1 text-sm placeholder:text-xs placeholder:font-bold bg-white border-0 border-b border-gray-400 focus:border-b-2 focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
//                       required
//                     />
//                   </div>

//                   {/* Password Input */}
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
//                       <svg
//                         className="w-3.5 h-3.5 text-gray-400"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="password"
//                       name="password"
//                       placeholder="Password"
//                       className="w-full pl-8 pr-3 py-1 placeholder:text-xs placeholder:font-bold text-sm bg-white border-0 border-b border-gray-400 focus:outline-none focus:border-b-2 focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
//                       required
//                     />
//                   </div>

//                   {/* Forgot Password Link */}
//                   <div className="text-right pt-0 ">
//                     <a
//                       href="#"
//                       className="text-[#11528F] text-[11px] font-bold hover:text-[#0d3e6c] transition-colors"
//                     >
//                       Forgot Password
//                     </a>
//                   </div>

//                   {/* Login Button */}
//                   <div className="flex justify-center pt-1 pb-3">
//                     <button
//                       type="submit"
//                       className="bg-[#11528F] text-white py-1.5 px-6 text-sm rounded-md hover:bg-[#0d3e6c] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center space-x-1.5"
//                     >
//                       <span>Login</span>
//                       <svg
//                         className="w-5 h-5"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
//                       </svg>
//                     </button>
//                   </div>

//                   {/* Sign Up Link */}
//                   <div className="text-center pt-2">
//                     <span className="text-gray-700 text-[11px] font-bold">
//                       Don't have an Account?{" "}
//                     </span>
//                     <Link
//                       href="/signup"
//                       className="text-[#11528F] text-[11px]  font-bold hover:text-[#0d3e6c] transition-colors underline"
//                     >
//                       Sign Up
//                     </Link>
//                   </div>

//                   {/* Divider */}
//                   <div className="relative pt-3">
//                     <div className="relative flex justify-center text-[11px] font-bold ">
//                       <span className="px-2 bg-white text-gray-500">OR</span>
//                     </div>
//                   </div>
//                 </form>

//                 {/* Google Sign Up Button - Client Component */}
//                 <div className="px-12">
//                   <div className="flex justify-center pt-3">
//                     <GoogleSignUpButton />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/app/(auth)/login/page.js
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import GoogleSignUpButton from "./GoogleSignUpButton";
// import Link from "next/link";
// import { signIn } from "@/auth";
// import { AuthError } from "next-auth";
// import { prisma } from "@/lib/prisma";

// async function handleLogin(formData) {
//   "use server";

//   const email = formData.get("email");
//   const password = formData.get("password");

//   console.log("Login attempt for email:", email);

//   try {
//     // Get user to check role and validate credentials before signing in
//     const user = await prisma.user.findFirst({
//       where: { 
//         email,
//         password // Note: In production, you should hash passwords
//       },
//       select: { role: true, id: true, email: true, name: true }
//     });

//     console.log("Found user:", user);

//     if (!user) {
//       console.log("User not found or invalid credentials");
//       throw new Error("Invalid credentials");
//     }

//     const role = user.role || 'student';
//     console.log("User role:", role);

//     // Use signIn with credentials - it won't return a result but will throw on error
//     await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     console.log("Sign in successful, redirecting to:", `/${role}/notifications`);
    
    
//     // Manual redirect after successful authentication
//     redirect(`/${role}/notifications`);
    
//   } catch (error) {
//     console.error("Login error:", error);
    
//     // Handle redirect errors (these are expected after successful login)
//     if (error?.message?.includes('NEXT_REDIRECT')) {
//       throw error; // Re-throw redirect errors to let Next.js handle them
//     }
    
//     // Handle auth errors
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Invalid credentials." };
//         default:
//           return { error: "Something went wrong." };
//       }
//     }
    
//     // Handle custom errors from authorize function
//     if (error?.message?.includes('Invalid')) {
//       return { error: "Invalid credentials." };
//     }
    
//     return { error: "Something went wrong." };
//   }
// }

// export default function LoginPage() {
//   return (
//     <div
//       className="min-h-screen flex"
//       style={{
//         background: `
//       linear-gradient(
//         to right, 
//         white 0%, 
//         white 45%, 
//         #30699B 45%, 
//         #30699B 100%
//       )
//     `,
//       }}
//     >
//       <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl w-full">
//           <div className="bg-white rounded-lg shadow-xl overflow-hidden px-20 py-10">
//             <div className="flex flex-col lg:flex-row ">
//               {/* Left side - 40% white for logo */}
//               <div className="lg:w-2/5 p-8 lg:p-12 flex items-center justify-center">
//                 <div className="mb-8">
//                   <Image
//                     src="/prajaahitalogin.png"
//                     alt="Prajaahita login"
//                     width={320}
//                     height={80}
//                     priority
//                   />
//                 </div>
//               </div>

//               {/* Right side - 60% for login form */}
//               <div className="lg:w-3/5 p-6 lg:p-8 bg-white">
//                 <form action={handleLogin} className="px-12">
//                   {/* Email Input */}
//                   <div className="relative mb-5">
//                     <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
//                       <svg
//                         className="w-3.5 h-3.5 text-gray-400"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Email Address"
//                       className="w-full pl-8 pr-3 py-1 text-sm placeholder:text-xs placeholder:font-bold bg-white border-0 border-b border-gray-400 focus:border-b-2 focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
//                       required
//                     />
//                   </div>

//                   {/* Password Input */}
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
//                       <svg
//                         className="w-3.5 h-3.5 text-gray-400"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="password"
//                       name="password"
//                       placeholder="Password"
//                       className="w-full pl-8 pr-3 py-1 placeholder:text-xs placeholder:font-bold text-sm bg-white border-0 border-b border-gray-400 focus:outline-none focus:border-b-2 focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
//                       required
//                     />
//                   </div>

//                   {/* Forgot Password Link */}
//                   <div className="text-right pt-0 ">
//                     <a
//                       href="#"
//                       className="text-[#11528F] text-[11px] font-bold hover:text-[#0d3e6c] transition-colors"
//                     >
//                       Forgot Password
//                     </a>
//                   </div>

//                   {/* Login Button */}
//                   <div className="flex justify-center pt-1 pb-3">
//                     <button
//                       type="submit"
//                       className="bg-[#11528F] text-white py-1.5 px-6 text-sm rounded-md hover:bg-[#0d3e6c] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center space-x-1.5"
//                     >
//                       <span>Login</span>
//                       <svg
//                         className="w-5 h-5"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
//                       </svg>
//                     </button>
//                   </div>

//                   {/* Sign Up Link */}
//                   <div className="text-center pt-2">
//                     <span className="text-gray-700 text-[11px] font-bold">
//                       Don't have an Account?{" "}
//                     </span>
//                     <Link
//                       href="/signup"
//                       className="text-[#11528F] text-[11px]  font-bold hover:text-[#0d3e6c] transition-colors underline"
//                     >
//                       Sign Up
//                     </Link>
//                   </div>

//                   {/* Divider */}
//                   <div className="relative pt-3">
//                     <div className="relative flex justify-center text-[11px] font-bold ">
//                       <span className="px-2 bg-white text-gray-500">OR</span>
//                     </div>
//                   </div>
//                 </form>

//                 {/* Google Sign Up Button - Client Component */}
//                 <div className="px-12">
//                   <div className="flex justify-center pt-3">
//                     <GoogleSignUpButton />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import Image from "next/image";
import { redirect } from "next/navigation";
import GoogleSignUpButton from "./GoogleSignUpButton";
import Link from "next/link";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

async function handleLogin(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login attempt for email:", email);

  try {
    // Use signIn with credentials - the authorize callback will handle validation
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("Sign in successful");

    // Since we can't easily get the user's role from the result in server action,
    // we'll redirect to a common page that can determine the role and redirect appropriately
    // Alternatively, you can create a separate API to get user role after successful login
    
    // Option 1: Redirect to a common dashboard that handles role-based routing
    redirect("/dashboard");
    
    // Option 2: If you want to keep the role-based redirect, you'll need to query the user again
    // But this would bring back the duplicate query issue you wanted to avoid
    
  } catch (error) {
    console.error("Login error:", error);
    
    // Handle redirect errors (these are expected after successful login)
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors to let Next.js handle them
    }
    
    // Handle auth errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    
    // Handle custom errors
    return { error: "Invalid credentials." };
  }
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: `
      linear-gradient(
        to right, 
        white 0%, 
        white 45%, 
        #30699B 45%, 
        #30699B 100%
      )
    `,
      }}
    >
      <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden px-20 py-10">
            <div className="flex flex-col lg:flex-row ">
              {/* Left side - 40% white for logo */}
              <div className="lg:w-2/5 p-8 lg:p-12 flex items-center justify-center">
                <div className="mb-8">
                  <Image
                    src="/prajaahitalogin.png"
                    alt="Prajaahita login"
                    width={320}
                    height={80}
                    priority
                  />
                </div>
              </div>

              {/* Right side - 60% for login form */}
              <div className="lg:w-3/5 p-6 lg:p-8 bg-white">
                <form action={handleLogin} className="px-12">
                  {/* Email Input */}
                  <div className="relative mb-5">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg
                        className="w-3.5 h-3.5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full pl-8 pr-3 py-1 text-sm placeholder:text-xs placeholder:font-bold bg-white border-0 border-b border-gray-400 focus:border-b-2 focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg
                        className="w-3.5 h-3.5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full pl-8 pr-3 py-1 placeholder:text-xs placeholder:font-bold text-sm bg-white border-0 border-b border-gray-400 focus:outline-none focus:border-b-2 focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
                      required
                    />
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right pt-0 ">
                    <a
                      href="#"
                      className="text-[#11528F] text-[11px] font-bold hover:text-[#0d3e6c] transition-colors"
                    >
                      Forgot Password
                    </a>
                  </div>

                  {/* Login Button */}
                  <div className="flex justify-center pt-1 pb-3">
                    <button
                      type="submit"
                      className="bg-[#11528F] text-white py-1.5 px-6 text-sm rounded-md hover:bg-[#0d3e6c] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center space-x-1.5"
                    >
                      <span>Login</span>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                      </svg>
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center pt-2">
                    <span className="text-gray-700 text-[11px] font-bold">
                      Don't have an Account?{" "}
                    </span>
                    <Link
                      href="/signup"
                      className="text-[#11528F] text-[11px]  font-bold hover:text-[#0d3e6c] transition-colors underline"
                    >
                      Sign Up
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="relative pt-3">
                    <div className="relative flex justify-center text-[11px] font-bold ">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>
                </form>

                {/* Google Sign Up Button - Client Component */}
                <div className="px-12">
                  <div className="flex justify-center pt-3">
                    <GoogleSignUpButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}