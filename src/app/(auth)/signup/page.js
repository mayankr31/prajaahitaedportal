// // app/signup/page.js (Server Component)
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/prisma";

// const SignUpPage = () => {
//   async function handleSubmit(formData) {
//     "use server";

//     try {
//       // Extract form data
//       const name = `${formData.get("firstName")} ${formData.get("lastName")}`;
//       const companyEmail = formData.get("companyEmail");
//       const password = formData.get("password");
//       const confirmPassword = formData.get("confirmPassword");
//       const companyName = formData.get("companyName");
//       const phoneNumber = formData.get("phoneNumber");
//       const country = formData.get("country");
//       const role = formData.get("role");
//       const age = formData.get("age");

//       if (password !== confirmPassword) {
//         throw new Error("Passwords do not match");
//       }

//       // Use a transaction to ensure both user and profile are created together
//       const result = await prisma.$transaction(async (tx) => {
//         // Create the user first
//         const user = await tx.user.create({
//           data: {
//             name,
//             email: companyEmail,
//             password, // Make sure you hash the password before storing it
//             companyName,
//             phoneNumber,
//             country,
//             role,
//             age: parseInt(age),
//           },
//         });

//         // Create the corresponding profile based on role
//         let profile;
//         switch (role) {
//           case "student":
//             profile = await tx.student.create({
//               data: {
//                 userId: user.id,
//                 name: user.name,
//                 age: user.age,
//                 email: user.email,
//                 // Optional fields can be added later through profile completion
//                 skills: null,
//                 areaOfInterest: null,
//                 readingCapacity: null,
//                 preferredLanguages: null,
//                 fineMotorDevelopment: null,
//                 interactionCapacity: null,
//                 onlineClassExperience: null,
//                 attentionSpan: null,
//                 triggeringFactors: null,
//                 happyMoments: null,
//                 disability: null,
//               },
//             });
//             break;

//           case "volunteer":
//             profile = await tx.volunteer.create({
//               data: {
//                 userId: user.id,
//                 name: user.name,
//                 age: user.age,
//                 email: user.email,
//                 contactNumber: user.phoneNumber, // Use phone number from user
//                 // Optional fields can be added later through profile completion
//                 educationalQualification: null,
//                 preferredLanguages: null,
//                 experience: null,
//                 profession: null,
//                 whatMotivatesYou: null,
//                 feedback: null,
//               },
//             });
//             break;

//           case "expert":
//             profile = await tx.expert.create({
//               data: {
//                 userId: user.id,
//                 name: user.name,
//                 age: user.age,
//                 email: user.email,
//                 // Optional fields can be added later through profile completion
//                 profession: null,
//                 educationalQualification: null,
//                 feedback: null,
//               },
//             });
//             break;

//           default:
//             throw new Error("Invalid role specified");
//         }

//         return { user, profile };
//       });

//       console.log("User and profile created:", result);

//     } catch (error) {
//       console.error("Error creating user and profile:", error);
//       // Handle error (e.g. return error message to user interface)
//       return;
//     }
    
//     // Redirect only after successful creation
//     redirect("/login");
//   }

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       {/* Login button at top right */}
//       <div className="absolute top-6 right-6">
//         <Link
//           href="/login"
//           className="text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
//         >
//           Login
//         </Link>
//       </div>

//       <div className="max-w-6xl w-full">
//         <div className="bg-white rounded-lg overflow-hidden">
//           <div className="flex flex-col lg:flex-row">
//             {/* Left Side - Logo and Trial Info */}
//             <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
//               <div className="mb-8">
//                 <Image
//                   src="/logoprajaahita.jpg"
//                   alt="Prajaahita logo"
//                   width={320}
//                   height={80}
//                   priority
//                 />
//               </div>

//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                   Start Your 20-Day Free Trial
//                 </h2>
//                 <p className="text-gray-600">
//                   Get started instantly, no credit card required!
//                 </p>
//               </div>
//             </div>

//             {/* Right Side - Sign Up Form */}
//             <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">
//                 Sign-up now
//               </h3>

//               <form action={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <input
//                       type="text"
//                       name="firstName"
//                       placeholder="First Name*"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       name="lastName"
//                       placeholder="Last Name*"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <input
//                     type="email"
//                     name="companyEmail"
//                     placeholder="Company Email*"
//                     className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <input
//                       type="password"
//                       name="password"
//                       placeholder="Password*"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       placeholder="Confirm Password*"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <input
//                       type="text"
//                       name="companyName"
//                       placeholder="Company Name*"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       placeholder="Phone Number*"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <select
//                       name="country"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     >
//                       <option value="">Country*</option>
//                       <option value="US">United States</option>
//                       <option value="IN">India</option>
//                       <option value="UK">United Kingdom</option>
//                       <option value="CA">Canada</option>
//                       <option value="AU">Australia</option>
//                       {/* Add more countries as needed */}
//                     </select>
//                   </div>
//                   <div>
//                     <select
//                       name="role"
//                       className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                       required
//                     >
//                       <option value="">Role*</option>
//                       <option value="student">Student</option>
//                       <option value="volunteer">Volunteer</option>
//                       <option value="expert">Expert</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <input
//                     type="number"
//                     name="age"
//                     placeholder="Age*"
//                     min="1"
//                     max="120"
//                     className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
//                     required
//                   />
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     className="w-[150px] bg-[#30699B] text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
//                   >
//                     Start Trial
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;

// app/signup/page.js (Server Component)
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SignUpPage = () => {
  async function handleSubmit(formData) {
    "use server";

    try {
      // Extract form data
      const name = `${formData.get("firstName")} ${formData.get("lastName")}`;
      const companyEmail = formData.get("companyEmail");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");
      const companyName = formData.get("companyName");
      const phoneNumber = formData.get("phoneNumber");
      const country = formData.get("country");
      const role = formData.get("role");
      const dateOfBirth = formData.get("dateOfBirth"); // New: Get dateOfBirth from form

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Calculate age from dateOfBirth
      let age = null;
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        age = calculatedAge;
      }

      // Use a transaction to ensure both user and profile are created together
      const result = await prisma.$transaction(async (tx) => {
        // Create the user first
        const user = await tx.user.create({
          data: {
            name,
            email: companyEmail,
            password, // Make sure you hash the password before storing it
            companyName,
            phoneNumber,
            country,
            role,
            age: age, // Send calculated age
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, // Send dateOfBirth
          },
        });

        // Create the corresponding profile based on role
        let profile;
        switch (role) {
          case "student":
            profile = await tx.student.create({
              data: {
                userId: user.id,
                name: user.name,
                age: user.age,
                email: user.email,
                // Optional fields can be added later through profile completion
                skills: null,
                areaOfInterest: null,
                readingCapacity: null,
                preferredLanguages: null,
                fineMotorDevelopment: null,
                interactionCapacity: null,
                onlineClassExperience: null,
                attentionSpan: null,
                triggeringFactors: null,
                happyMoments: null,
                disability: null,
              },
            });
            break;

          case "volunteer":
            profile = await tx.volunteer.create({
              data: {
                userId: user.id,
                name: user.name,
                age: user.age,
                email: user.email,
                contactNumber: user.phoneNumber, // Use phone number from user
                // Optional fields can be added later through profile completion
                educationalQualification: null,
                preferredLanguages: null,
                experience: null,
                profession: null,
                whatMotivatesYou: null,
                feedback: null,
              },
            });
            break;

          case "expert":
            profile = await tx.expert.create({
              data: {
                userId: user.id,
                name: user.name,
                age: user.age,
                email: user.email,
                // Optional fields can be added later through profile completion
                profession: null,
                educationalQualification: null,
                feedback: null,
              },
            });
            break;

          default:
            throw new Error("Invalid role specified");
        }

        return { user, profile };
      });

      console.log("User and profile created:", result);

    } catch (error) {
      console.error("Error creating user and profile:", error);
      // Handle error (e.g. return error message to user interface)
      return;
    }
    
    // Redirect only after successful creation
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Login button at top right */}
      <div className="absolute top-6 right-6">
        <Link
          href="/login"
          className="text-sm text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
        >
          Login
        </Link>
      </div>

      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Logo and Trial Info */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <Image
                  src="/logoprajaahita.jpg"
                  alt="Prajaahita logo"
                  width={320}
                  height={80}
                  priority
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Start Your 20-Day Free Trial
                </h2>
                <p className="text-gray-600">
                  Get started instantly, no credit card required!
                </p>
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Sign-up now
              </h3>

              <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name*"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name*"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    name="companyEmail"
                    placeholder="Email ID*"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password*"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password*"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Institute*"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number*"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="country"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    >
                      <option value="">Country*</option>
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                  <div>
                    <select
                      name="role"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    >
                      <option value="">Role*</option>
                      <option value="student">Student</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                {/* New: Date of Birth Input */}
                <div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth*"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-[150px] bg-[#30699B] text-white py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Start Trial
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
