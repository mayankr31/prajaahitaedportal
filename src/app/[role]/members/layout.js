"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { MemberFormDialog } from "./MemberFormDialog";

export default function Layout({ children }) {
  const pathname = usePathname();
  const params = useParams();
  const role = params.role;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  // const [selectedRole, setSelectedRole] = useState("");

  const tabs = [
    { id: "students", label: "Students", href: `/${role}/members/students` },
    { id: "volunteers", label: "Volunteers", href: `/${role}/members/volunteers` },
    { id: "experts", label: "Experts", href: `/${role}/members/experts` },
  ];

  const roles = ["Student", "Volunteer", "Expert"];

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your API
    alert(`Data added successfully!`);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    // setEmail("");
    // setSelectedRole("");
  };

   // Check if current user has permission to add members
  const canAddMembers = () => {
    // You can customize this logic based on your requirements
    // For example, only volunteers and experts can add members
    return role === 'admin';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-0">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-center space-x-8 mb-6">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative pb-1 text-sm font-bold transition-colors hover:text-gray-700 ${
                  pathname === tab.href ? "text-gray-800" : "text-gray-600"
                }`}
              >
                {tab.label}
                {pathname === tab.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-400"></div>
                )}
              </Link>
            ))}
          </div>
          {/* {canAddMembers() && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
            >
              <Plus size={18} />
              <span>Add Member</span>
            </button>
          )} */}
        </div>

        {/* Main Content */}
        <main>{children}</main>
        {/* <MemberFormDialog
          open={isDialogOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
        /> */}
        {/* Only show dialog if user has permission */}
        {canAddMembers() && (
          <MemberFormDialog 
            open={isDialogOpen} 
            onClose={handleClose} 
            onSubmit={handleSubmit} 
          />
        )}
      </div>
    </div>
  );
}
