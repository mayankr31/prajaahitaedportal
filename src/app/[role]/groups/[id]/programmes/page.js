// "use client";

// import React, { useState, useEffect } from "react";
// import { Plus, ChevronRight } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { programmeAPI } from "@/lib/api";
// import { useSession } from "next-auth/react";
// import AddProgrammeDialog from "./AddProgrammeDialog";
// import ProgrammeCard from "./ProgrammeCard";
// import ApprovalProgrammesDialog from "./ApprovalProgrammesDialog";

// const Programmes = () => {
//   const params = useParams();
//   const router = useRouter();
//   const role = params.role;
//   const groupId = params.id;
//   const { data: session } = useSession();

//   const [programmes, setProgrammes] = useState([]);
//   const [loadingProgrammes, setLoadingProgrammes] = useState(true);
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

//   useEffect(() => {
//     loadProgrammes();
//   }, [groupId, role]);

//   const loadProgrammes = async () => {
//     try {
//       setLoadingProgrammes(true);
//       const result = await programmeAPI.getAll(groupId);
//       if (result.success) {
//         // Filter programmes based on role (similar to groups logic)
//         if (session?.user?.role === "admin" || session?.user?.role === "expert") {
//           setProgrammes(result.data); // Admins/Experts see all, including pending/rejected
//         } else if (session?.user?.role === "volunteer") {
//           // Volunteers see their created programmes (any status) and approved programmes
//           setProgrammes(
//             result.data.filter(
//               (programme) =>
//                 programme.createdById === session.user.id ||
//                 programme.approvalStatus === "APPROVED"
//             )
//           );
//         } else if (session?.user?.role === "student") {
//           // Students only see approved programmes
//           setProgrammes(
//             result.data.filter((programme) => programme.approvalStatus === "APPROVED")
//           );
//         } else {
//           setProgrammes([]);
//         }
//       } else {
//         console.error("Failed to load programmes:", result.error);
//         setProgrammes([]);
//       }
//     } catch (error) {
//       console.error("Error loading programmes:", error);
//       setProgrammes([]);
//     } finally {
//       setLoadingProgrammes(false);
//     }
//   };

//   const handleProgrammeClick = (programme) => {
//     if (programme.approvalStatus === "APPROVED") {
//       router.push(`/${role}/groups/${groupId}/programmes/${programme.id}`);
//     }
//   };

//   // Separate programmes into approved and pending/rejected
//   const approvedProgrammes = programmes.filter(
//     (programme) => programme.approvalStatus === "APPROVED"
//   );
//   const pendingRejectedProgrammes = programmes.filter(
//     (programme) =>
//       programme.approvalStatus === "PENDING" || programme.approvalStatus === "REJECTED"
//   );

//   const pendingProgrammesCount = programmes.filter(
//     (programme) => programme.approvalStatus === "PENDING"
//   ).length;

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* Header with Breadcrumb */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-2">
//           <Link
//             href={`/${role}/groups`}
//             className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
//           >
//             Groups
//           </Link>
//           <ChevronRight className="text-gray-800" size={20} />
//           <h1 className="font-bold text-gray-800">All Programmes</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           {(role === "volunteer" || role === "expert" || role === "admin") && (
//             <button
//               onClick={() => setAddDialogOpen(true)}
//               className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//             >
//               <Plus size={18} />
//               <span>Add Programmes</span>
//             </button>
//           )}

//           {(role === "admin" || role === "expert") && (
//             <button
//               onClick={() => setApprovalDialogOpen(true)}
//               className="flex items-center text-sm space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors relative"
//             >
//               <span>Approval Programmes</span>
//               {pendingProgrammesCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {pendingProgrammesCount}
//                 </span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Loading State */}
//       {loadingProgrammes ? (
//         <div className="flex justify-center items-center h-64">
//           <CircularProgress size={40} sx={{ color: "#2F699A" }} />
//         </div>
//       ) : (
//         <>
//           {/* Approved Programmes Section */}
//           {approvedProgrammes.length > 0 && (
//             <div className="mb-12">
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//                 {approvedProgrammes.map((programme) => (
//                   <ProgrammeCard
//                     key={programme.id}
//                     programme={programme}
//                     session={session}
//                     onProgrammeClick={handleProgrammeClick}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Pending/Rejected Programmes Section */}
//           {pendingRejectedProgrammes.length > 0 && (
//             <div className="mb-8">
//               <div className="flex items-center space-x-0 mb-6">
//                 <h1 className="font-bold text-gray-800">Pending / Rejected Programmes</h1>
//                 <ChevronRight className="text-gray-800" size={20} />
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//                 {pendingRejectedProgrammes.map((programme) => (
//                   <ProgrammeCard
//                     key={programme.id}
//                     programme={programme}
//                     session={session}
//                     onProgrammeClick={handleProgrammeClick}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* No Programmes Message */}
//           {approvedProgrammes.length === 0 && pendingRejectedProgrammes.length === 0 && (
//             <Typography variant="h6" color="text.secondary" className="text-center py-10">
//               No programmes found for this group.
//             </Typography>
//           )}
//         </>
//       )}

//       {/* Add Programme Dialog */}
//       <AddProgrammeDialog
//         open={addDialogOpen}
//         onClose={() => setAddDialogOpen(false)}
//         groupId={groupId}
//         onProgrammeCreated={loadProgrammes}
//       />

//       {/* Approval Programmes Dialog */}
//       {(role === "admin" || role === "expert") && (
//         <ApprovalProgrammesDialog
//           open={approvalDialogOpen}
//           onClose={() => setApprovalDialogOpen(false)}
//           pendingProgrammes={programmes.filter(
//             (programme) => programme.approvalStatus === "PENDING"
//           )}
//           onApprovalStatusChange={loadProgrammes}
//         />
//       )}
//     </div>
//   );
// };

// export default Programmes;

"use client";

import React, { useState, useEffect } from "react";
import { Plus, ChevronRight, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Typography,
  CircularProgress,
} from "@mui/material";
import { programmeAPI } from "@/lib/api";
import { useSession } from "next-auth/react";
import AddProgrammeDialog from "./AddProgrammeDialog";
import ProgrammeCard from "./ProgrammeCard";
import ApprovalProgrammesDialog from "./ApprovalProgrammesDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const Programmes = () => {
  const params = useParams();
  const router = useRouter();
  const role = params.role;
  const groupId = params.id;
  const { data: session } = useSession();

  const [programmes, setProgrammes] = useState([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    programmeId: null,
    programmeName: "",
  });
  const [deletingProgrammeId, setDeletingProgrammeId] = useState(null);

  useEffect(() => {
    loadProgrammes();
  }, [groupId, role]);

  const loadProgrammes = async () => {
    try {
      setLoadingProgrammes(true);
      const result = await programmeAPI.getAll(groupId);
      if (result.success) {
        // Filter programmes based on role (similar to groups logic)
        if (session?.user?.role === "admin" || session?.user?.role === "expert") {
          setProgrammes(result.data); // Admins/Experts see all, including pending/rejected
        } else if (session?.user?.role === "volunteer") {
          // Volunteers see their created programmes (any status) and approved programmes
          setProgrammes(
            result.data.filter(
              (programme) =>
                programme.createdById === session.user.id ||
                programme.approvalStatus === "APPROVED"
            )
          );
        } else if (session?.user?.role === "student") {
          // Students only see approved programmes
          setProgrammes(
            result.data.filter((programme) => programme.approvalStatus === "APPROVED")
          );
        } else {
          setProgrammes([]);
        }
      } else {
        console.error("Failed to load programmes:", result.error);
        setProgrammes([]);
      }
    } catch (error) {
      console.error("Error loading programmes:", error);
      setProgrammes([]);
    } finally {
      setLoadingProgrammes(false);
    }
  };

  const handleProgrammeClick = (programme) => {
    if (programme.approvalStatus === "APPROVED") {
      router.push(`/${role}/groups/${groupId}/programmes/${programme.id}`);
    }
  };

  // Check if user can delete a specific programme
  const canDeleteProgramme = (programme) => {
    // Admins and experts can delete any programme
    if (session?.user?.role === "admin" || session?.user?.role === "expert") {
      return true;
    }

    // Volunteers can only delete their own pending or rejected programmes
    if (session?.user?.role === "volunteer") {
      return (
        programme.createdById === session.user.id &&
        (programme.approvalStatus === "PENDING" ||
          programme.approvalStatus === "REJECTED")
      );
    }

    return false;
  };

  const handleDeleteClick = (e, programme) => {
    e.stopPropagation(); // Prevent programme card click
    setDeleteConfirmDialog({
      open: true,
      programmeId: programme.id,
      programmeName: programme.name,
    });
  };

  const handleDeleteConfirm = async () => {
    const { programmeId } = deleteConfirmDialog;
    setDeletingProgrammeId(programmeId);

    try {
      const response = await programmeAPI.delete(programmeId);
      if (response.success) {
        // Remove the programme from the local state
        setProgrammes((prev) => prev.filter((programme) => programme.id !== programmeId));

        // Show success message (optional)
        console.log("Programme deleted successfully:", response.message);
      } else {
        console.error("Failed to delete programme:", response.error);
      }
    } catch (error) {
      console.error("Error deleting programme:", error);
    } finally {
      setDeletingProgrammeId(null);
      setDeleteConfirmDialog({ open: false, programmeId: null, programmeName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmDialog({ open: false, programmeId: null, programmeName: "" });
  };

  // Separate programmes into approved and pending/rejected
  const approvedProgrammes = programmes.filter(
    (programme) => programme.approvalStatus === "APPROVED"
  );
  const pendingRejectedProgrammes = programmes.filter(
    (programme) =>
      programme.approvalStatus === "PENDING" || programme.approvalStatus === "REJECTED"
  );

  const pendingProgrammesCount = programmes.filter(
    (programme) => programme.approvalStatus === "PENDING"
  ).length;

  // Modified ProgrammeCard wrapper to include delete button
  const renderProgrammeCard = (programme) => (
    <div key={programme.id} className="relative group">
      {/* Delete Button - Only visible on hover */}
      {canDeleteProgramme(programme) && (
        <button
          onClick={(e) => handleDeleteClick(e, programme)}
          disabled={deletingProgrammeId === programme.id}
          className="absolute top-2 right-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Programme"
        >
          {deletingProgrammeId === programme.id ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      )}
      
      <ProgrammeCard
        programme={programme}
        session={session}
        onProgrammeClick={handleProgrammeClick}
      />
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header with Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Link
            href={`/${role}/groups`}
            className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            Groups
          </Link>
          <ChevronRight className="text-gray-800" size={20} />
          <h1 className="font-bold text-gray-800">All Programmes</h1>
        </div>
        <div className="flex items-center space-x-4">
          {(role === "volunteer" || role === "expert" || role === "admin") && (
            <button
              onClick={() => setAddDialogOpen(true)}
              className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
            >
              <Plus size={18} />
              <span>Add Programmes</span>
            </button>
          )}

          {(role === "admin" || role === "expert") && (
            <button
              onClick={() => setApprovalDialogOpen(true)}
              className="flex items-center text-sm space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors relative"
            >
              <span>Approval Programmes</span>
              {pendingProgrammesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingProgrammesCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loadingProgrammes ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress size={40} sx={{ color: "#2F699A" }} />
        </div>
      ) : (
        <>
          {/* Approved Programmes Section */}
          {approvedProgrammes.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {approvedProgrammes.map(renderProgrammeCard)}
              </div>
            </div>
          )}

          {/* Pending/Rejected Programmes Section */}
          {pendingRejectedProgrammes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center space-x-0 mb-6">
                <h1 className="font-bold text-gray-800">Pending / Rejected Programmes</h1>
                <ChevronRight className="text-gray-800" size={20} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {pendingRejectedProgrammes.map(renderProgrammeCard)}
              </div>
            </div>
          )}

          {/* No Programmes Message */}
          {approvedProgrammes.length === 0 && pendingRejectedProgrammes.length === 0 && (
            <Typography variant="h6" color="text.secondary" className="text-center py-10">
              No programmes found for this group.
            </Typography>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        programmeName={deleteConfirmDialog.programmeName}
        isDeleting={deletingProgrammeId !== null}
      />

      {/* Add Programme Dialog */}
      <AddProgrammeDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        groupId={groupId}
        onProgrammeCreated={loadProgrammes}
      />

      {/* Approval Programmes Dialog */}
      {(role === "admin" || role === "expert") && (
        <ApprovalProgrammesDialog
          open={approvalDialogOpen}
          onClose={() => setApprovalDialogOpen(false)}
          pendingProgrammes={programmes.filter(
            (programme) => programme.approvalStatus === "PENDING"
          )}
          onApprovalStatusChange={loadProgrammes}
        />
      )}
    </div>
  );
};

export default Programmes;