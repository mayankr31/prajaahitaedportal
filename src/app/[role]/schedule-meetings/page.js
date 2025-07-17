// //src\app\[role]\schedule-meetings\page.js
// "use client";
// import React from "react";
// import { Plus } from "lucide-react";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import CalendarPage from "./CalendarPage";
// import Link from "next/link";
// import { useParams } from "next/navigation";

// export default function Page(props) {
//   const params = useParams();
//   const role = params.role;

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center justify-center space-x-0">
//           <CalendarMonthIcon
//             className="text-[#2F699A] mr-2"
//             style={{ fontSize: 28 }}
//           />
//           <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
//         </div>

//         {role === "admin" && (
//           <Link
//             href={`/${role}/schedule-meetings/create-meeting`}
//             className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//           >
//             <Plus size={18} />
//             <span>Create</span>
//           </Link>
//         )}
//       </div>
//       <CalendarPage />
//     </div>
//   );
// }


// src\app\[role]\schedule-meetings\page.js
"use client";
import React, { useState, useEffect } from "react";
import { Plus, CheckCircle } from "lucide-react"; // Import CheckCircle icon
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarPage from "./CalendarPage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession for client-side session access
import ApprovalMeetingsDialog from "./ApprovalMeetingsDialog"; // Import the new dialog component
import { meetingAPI } from "@/lib/api"; // Import meetingAPI to fetch pending meetings

export default function Page(props) {
  const params = useParams();
  const role = params.role;
  const { data: session, status } = useSession(); // Get session on client side

  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [pendingMeetings, setPendingMeetings] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [errorPending, setErrorPending] = useState(null);

  // Function to fetch pending meetings
  const fetchPendingMeetings = async () => {
    if (status === "loading") return; // Don't fetch if session is still loading
    if (!session || (session.user.role !== "admin" && session.user.role !== "expert")) {
      setLoadingPending(false);
      return; // Only admins/experts need to fetch pending meetings
    }

    setLoadingPending(true);
    setErrorPending(null);
    try {
      // Fetch all meetings and filter pending ones on the client
      // The API route for GET /api/meetings already returns all meetings for admin/expert
      const response = await meetingAPI.getAll();
      if (response.success) {
        const pending = response.data.filter(
          (meeting) => meeting.approvalStatus === "PENDING"
        );
        setPendingMeetings(pending);
      } else {
        setErrorPending(response.error || "Failed to fetch pending meetings");
      }
    } catch (err) {
      console.error("Error fetching pending meetings:", err);
      setErrorPending("Error loading pending meetings data.");
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchPendingMeetings();
  }, [session, status]); // Re-fetch when session changes or status is ready

  const handleOpenApprovalDialog = () => {
    setApprovalDialogOpen(true);
  };

  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false);
    fetchPendingMeetings(); // Refresh pending meetings after dialog closes (approval/rejection)
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center justify-center space-x-0">
          <CalendarMonthIcon
            className="text-[#2F699A] mr-2"
            style={{ fontSize: 28 }}
          />
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Approval Button for Admins/Experts */}
          {(role === "admin" || role === "expert") && (
            <button
              onClick={handleOpenApprovalDialog}
              className="flex items-center text-sm space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              disabled={loadingPending}
            >
              {loadingPending ? (
                <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span>
              ) : (
                <CheckCircle size={18} />
              )}
              <span>Review Meetings ({pendingMeetings.length})</span>
            </button>
          )}

          {/* Create Button for Admins */}
          {(role === "admin" || role === "volunteer" || role==="expert") && (
            <Link
              href={`/${role}/schedule-meetings/create-meeting`}
              className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
            >
              <Plus size={18} />
              <span>Create</span>
            </Link>
          )}
        </div>
      </div>
      {/* Pass the user role to CalendarPage */}
      <CalendarPage userRole={role} />

      {/* Approval Meetings Dialog */}
      <ApprovalMeetingsDialog
        open={approvalDialogOpen}
        onClose={handleCloseApprovalDialog}
        pendingMeetings={pendingMeetings}
        onApprovalStatusChange={handleCloseApprovalDialog} // Re-fetch on status change
      />
    </div>
  );
}
