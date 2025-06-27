// "use client";
// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react"

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const router = useRouter();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     // Handle login logic here
//     console.log("Login attempt:", { email, password });
//     router.push('/notifications');
//   };

//   const handleGoogleSignUp = async () => {
//     // Handle Google sign up logic here
//     await signIn("google", {
//       callbackUrl: "/notifications",
//       redirect: true,
//     });
//     console.log("Google sign up clicked");
//   };

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
//                 <form onSubmit={handleLogin} className="px-12">
//                   {/* Email Input */}
//                   <div className="relative mb-5">
//                     <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
//                       <svg
//                         className="w-3.5 h-3.5 text-gray-400"
//                         fill="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
//                       </svg>
//                     </div>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
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
//                         <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
//                       </svg>
//                     </div>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
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
//                         <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
//                       </svg>
//                     </button>
//                   </div>

//                   {/* Sign Up Link */}
//                   <div className="text-center pt-2">
//                     <span className="text-gray-700 text-[11px] font-bold">
//                       Don't have an Account?{" "}
//                     </span>
//                     <a
//                       href="#"
//                       className="text-[#11528F] text-[11px]  font-bold hover:text-[#0d3e6c] transition-colors underline"
//                     >
//                       Sign Up
//                     </a>
//                   </div>

//                   {/* Divider */}
//                   <div className="relative pt-3">
//                     <div className="relative flex justify-center text-[11px] font-bold ">
//                       <span className="px-2 bg-white text-gray-500">OR</span>
//                     </div>
//                   </div>

//                   {/* Google Sign Up Button */}
//                   <div className="flex justify-center pt-3">
//                     <button
//                       type="button"
//                       onClick={handleGoogleSignUp}
//                       className="bg-[#11528F] text-white py-1.5 px-5 text-sm rounded-md font-medium hover:bg-[#0d3e6c] transition-colors flex items-center justify-center space-x-1.5"
//                     >
//                       <span>Sign up with Google</span>
//                       <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                       </svg>
//                     </button>
//                   </div>
//                 </form>
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
import GoogleSignUpButton from "./GoogleSignUpButton"; // We'll create this client component
import Link from "next/link";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// Server action for handling login
async function handleLogin(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/notifications", // Where to redirect on success
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Re-throw if it's not an AuthError
  }

  console.log("Login attempt:", { email, password });
  redirect("/notifications");
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
