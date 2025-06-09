"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    phoneNumber: "",
    country: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name*"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name*"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    name="companyEmail"
                    placeholder="Company Email*"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
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
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password*"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
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
                      placeholder="Company Name*"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number*"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
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
