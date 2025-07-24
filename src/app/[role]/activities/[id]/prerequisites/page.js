// // src\app\[role]\activities\[id]\prerequisites\page.js
// "use client";
// import React, { useState, useEffect } from "react";
// import { Plus, ChevronRight } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Alert,
//   CircularProgress,
//   Tooltip,
//   IconButton,
// } from "@mui/material";
// import ImageUpload from "@/app/components/ImageUpload";
// import { prerequisiteAPI } from "@/lib/api";
// import { useSession } from "next-auth/react";
// import ApprovalPrerequisitesDialog from './ApprovalPrerequisitesDialog';
// import { Info } from "@mui/icons-material";

// const Prerequisites = () => {
//   const params = useParams();
//   const router = useRouter();
//   const role = params.role;
//   const activityId = params.id;
//   const { data: session, status } = useSession();

//   // State management
//   const [prerequisites, setPrerequisites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);
//   const [resetTrigger, setResetTrigger] = useState(null);
//   const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

//   const userRole = session?.user?.role;

//   // Fetch prerequisites on component mount and when session/activityId changes
//   useEffect(() => {
//     if (status === "loading") return;
//     fetchPrerequisites();
//   }, [activityId, status, userRole]);

//   const fetchPrerequisites = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await prerequisiteAPI.getAll(activityId);

//       if (response.success) {
//         const allPrerequisites = response.data;
//         // Filter prerequisites based on role for display
//         if (userRole === "admin" || userRole === "expert") {
//           // Admins/Experts see all
//           setPrerequisites(allPrerequisites);
//         } else if (userRole === "volunteer") {
//           // Volunteers see their own pending/rejected/approved and all approved
//           setPrerequisites(allPrerequisites.filter(p => 
//             p.approvalStatus === "APPROVED" || p.createdById === session.user.id
//           ));
//         } else if (userRole === "student") {
//           // Students only see approved
//           setPrerequisites(allPrerequisites.filter(p => p.approvalStatus === "APPROVED"));
//         } else {
//           // Default or unauthorized: see only approved
//           setPrerequisites(allPrerequisites.filter(p => p.approvalStatus === "APPROVED"));
//         }
//       } else {
//         setError(response.error || "Failed to fetch prerequisites");
//       }
//     } catch (err) {
//       console.error("Error fetching prerequisites:", err);
//       setError("Failed to load prerequisites");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddPrerequisite = () => {
//     setDialogOpen(true);
//     setUploadError(null);
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setUploadError(null);
//     setResetTrigger(Date.now());
//   };

//   const handleApprovalDialogClose = () => {
//     setApprovalDialogOpen(false);
//     fetchPrerequisites();
//   };

//   const handleOpenApprovalDialog = () => {
//     setApprovalDialogOpen(true);
//   };

//   const handleUploadComplete = async (imagePath, file) => {
//     try {
//       setUploading(true);
//       setUploadError(null);

//       const prerequisiteData = {
//         imageUrl: imagePath,
//         activityId: activityId,
//       };

//       const response = await prerequisiteAPI.create(prerequisiteData);

//       if (response.success) {
//         await fetchPrerequisites();
//         handleDialogClose();
//         console.log("Prerequisite added successfully");
//       } else {
//         setUploadError(response.error || "Failed to create prerequisite");
//       }
//     } catch (err) {
//       console.error("Error creating prerequisite:", err);
//       setUploadError("Failed to create prerequisite");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleUploadError = (error) => {
//     setUploadError(error);
//   };

//   // Get filtered prerequisites based on role
//   const getFilteredPrerequisites = () => {
//     if (userRole === "student") {
//       return prerequisites.filter((prerequisite) => prerequisite.approvalStatus === "APPROVED");
//     }
//     if (userRole === "volunteer") {
//       return prerequisites.filter(
//         (prerequisite) =>
//           prerequisite.createdById === session.user.id ||
//           prerequisite.approvalStatus === "APPROVED"
//       );
//     }
//     // Admins and Experts see all prerequisites
//     return prerequisites;
//   };

//   const filteredPrerequisites = getFilteredPrerequisites();

//   // Separate prerequisites into approved and pending/rejected
//   const approvedPrerequisites = filteredPrerequisites.filter(
//     (prerequisite) => prerequisite.approvalStatus === "APPROVED"
//   );
//   const pendingRejectedPrerequisites = filteredPrerequisites.filter(
//     (prerequisite) =>
//       prerequisite.approvalStatus === "PENDING" || prerequisite.approvalStatus === "REJECTED"
//   );

//   const pendingPrerequisitesCount = prerequisites.filter(
//     (prerequisite) => prerequisite.approvalStatus === "PENDING"
//   ).length;

//   const renderPrerequisiteCard = (prerequisite) => (
//     <div key={prerequisite.id} className="flex flex-col items-center">
//       <div className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group">
//         {/* Approval Status Overlay */}
//         {userRole !== "student" && prerequisite.approvalStatus !== "APPROVED" && (
//           <div
//             className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold
//               ${prerequisite.approvalStatus === "PENDING"
//                 ? "bg-yellow-500 text-white"
//                 : "bg-red-500 text-white"
//               }`}
//           >
//             {prerequisite.approvalStatus}
//           </div>
//         )}
        
//         {/* Rejection Message Tooltip for Volunteers */}
//         {prerequisite.approvalStatus === "REJECTED" &&
//           userRole === "volunteer" &&
//           prerequisite.createdById === session.user.id &&
//           prerequisite.rejectionMessage && (
//             <Tooltip title={`Reason: ${prerequisite.rejectionMessage}`} arrow>
//               <IconButton
//                 size="small"
//                 className="absolute top-1 left-47 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
//               >
//                 <Info size={18} className="text-red-500" />
//               </IconButton>
//             </Tooltip>
//           )}

//         <img
//           src={prerequisite.imageUrl}
//           alt={`Prerequisite ${prerequisite.id}`}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.src = "/placeholder-prerequisite.png";
//           }}
//         />
//       </div>
//     </div>
//   );

//   if (status === "loading" || loading) {
//     return (
//       <div className="p-4 bg-gray-50 min-h-screen">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-gray-600">Loading prerequisites...</div>
//         </div>
//       </div>
//     );
//   }

//   if (status === "unauthenticated") {
//     router.push('/login');
//     return null;
//   }

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-0">
//           <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//           <h1 className="font-bold text-gray-800">Prerequisites Available</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           {(userRole === "volunteer" || userRole === "expert" || userRole === "admin") && (
//             <button
//               onClick={handleAddPrerequisite}
//               className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//             >
//               <Plus size={18} />
//               <span>Add Prerequisite</span>
//             </button>
//           )}

//           {(userRole === "admin" || userRole === "expert") && (
//             <button
//               onClick={handleOpenApprovalDialog}
//               className="flex items-center text-sm space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors relative"
//             >
//               <span>Approval Prerequisites</span>
//               {pendingPrerequisitesCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {pendingPrerequisitesCount}
//                 </span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {/* Approved Prerequisites Section */}
//       {approvedPrerequisites.length > 0 && (
//         <div className="mb-12">
//           <div className="grid grid-cols-4 gap-6">
//             {approvedPrerequisites.map(renderPrerequisiteCard)}
//           </div>
//         </div>
//       )}

//       {/* Pending/Rejected Prerequisites Section */}
//       {pendingRejectedPrerequisites.length > 0 && (
//         <div className="mb-8">
//           <div className="flex items-center space-x-0 mb-6">
//             <h1 className="font-bold text-gray-800">Pending / Rejected Prerequisites</h1>
//             <ChevronRight className="text-gray-800" size={20} />
//           </div>
//           <div className="grid grid-cols-4 gap-6">
//             {pendingRejectedPrerequisites.map(renderPrerequisiteCard)}
//           </div>
//         </div>
//       )}

//       {/* No Prerequisites Message */}
//       {approvedPrerequisites.length === 0 &&
//         pendingRejectedPrerequisites.length === 0 &&
//         !loading && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No prerequisites available</p>
//             {(userRole === "volunteer" || userRole === "expert" || userRole === "admin") && (
//               <p className="text-gray-400 text-sm mt-2">
//                 Click "Add Prerequisite" to get started
//               </p>
//             )}
//           </div>
//         )}

//       {/* Add Prerequisite Dialog */}
//       <Dialog
//         open={dialogOpen}
//         onClose={handleDialogClose}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Add New Prerequisite</DialogTitle>
//         <DialogContent>
//           <div className="py-4">
//             <ImageUpload
//               onUploadComplete={handleUploadComplete}
//               onError={handleUploadError}
//               disabled={uploading}
//               maxSize={5}
//               label="Select Prerequisite Image"
//               description="PNG, JPG, GIF up to 5MB"
//               showFileName={true}
//               resetTrigger={resetTrigger}
//             />

//             {uploadError && (
//               <Alert severity="error" sx={{ mt: 2 }}>
//                 {uploadError}
//               </Alert>
//             )}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} disabled={uploading}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             disabled={uploading}
//             onClick={handleDialogClose}
//           >
//             Done
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Approval Prerequisites Dialog */}
//       {userRole && (userRole === "admin" || userRole === "expert") && (
//         <ApprovalPrerequisitesDialog
//           open={approvalDialogOpen}
//           onClose={handleApprovalDialogClose}
//           pendingPrerequisites={prerequisites.filter(
//             (prerequisite) => prerequisite.approvalStatus === "PENDING"
//           )}
//           onApprovalStatusChange={fetchPrerequisites}
//         />
//       )}
//     </div>
//   );
// };

// export default Prerequisites;

// src\app\[role]\activities\[id]\prerequisites\page.js
"use client";
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import ImageUpload from "@/app/components/ImageUpload";
import { prerequisiteAPI } from "@/lib/api";
import { useSession } from "next-auth/react";
import ApprovalPrerequisitesDialog from './ApprovalPrerequisitesDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Info } from "@mui/icons-material";

const Prerequisites = () => {
  const params = useParams();
  const router = useRouter();
  const role = params.role;
  const activityId = params.id;
  const { data: session, status } = useSession();

  // State management
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

  // Delete Dialog States
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    prerequisiteId: null,
    prerequisiteTitle: "",
  });
  const [deletingPrerequisiteId, setDeletingPrerequisiteId] = useState(null);

  const userRole = session?.user?.role;

  // Fetch prerequisites on component mount and when session/activityId changes
  useEffect(() => {
    if (status === "loading") return;
    fetchPrerequisites();
  }, [activityId, status, userRole]);

  const fetchPrerequisites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prerequisiteAPI.getAll(activityId);

      if (response.success) {
        const allPrerequisites = response.data;
        // Filter prerequisites based on role for display
        if (userRole === "admin" || userRole === "expert") {
          // Admins/Experts see all
          setPrerequisites(allPrerequisites);
        } else if (userRole === "volunteer") {
          // Volunteers see their own pending/rejected/approved and all approved
          setPrerequisites(allPrerequisites.filter(p => 
            p.approvalStatus === "APPROVED" || p.createdById === session.user.id
          ));
        } else if (userRole === "student") {
          // Students only see approved
          setPrerequisites(allPrerequisites.filter(p => p.approvalStatus === "APPROVED"));
        } else {
          // Default or unauthorized: see only approved
          setPrerequisites(allPrerequisites.filter(p => p.approvalStatus === "APPROVED"));
        }
      } else {
        setError(response.error || "Failed to fetch prerequisites");
      }
    } catch (err) {
      console.error("Error fetching prerequisites:", err);
      setError("Failed to load prerequisites");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrerequisite = () => {
    setDialogOpen(true);
    setUploadError(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUploadError(null);
    setResetTrigger(Date.now());
  };

  const handleApprovalDialogClose = () => {
    setApprovalDialogOpen(false);
    fetchPrerequisites();
  };

  const handleOpenApprovalDialog = () => {
    setApprovalDialogOpen(true);
  };

  const handleUploadComplete = async (imagePath, file) => {
    try {
      setUploading(true);
      setUploadError(null);

      const prerequisiteData = {
        imageUrl: imagePath,
        activityId: activityId,
      };

      const response = await prerequisiteAPI.create(prerequisiteData);

      if (response.success) {
        await fetchPrerequisites();
        handleDialogClose();
        console.log("Prerequisite added successfully");
      } else {
        setUploadError(response.error || "Failed to create prerequisite");
      }
    } catch (err) {
      console.error("Error creating prerequisite:", err);
      setUploadError("Failed to create prerequisite");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadError = (error) => {
    setUploadError(error);
  };

  // Check if user can delete a specific prerequisite
  const canDeletePrerequisite = (prerequisite) => {
    // Admins and experts can delete any prerequisite
    if (userRole === "admin" || userRole === "expert") {
      return true;
    }

    // Volunteers can only delete their own pending or rejected prerequisites
    if (userRole === "volunteer") {
      return (
        prerequisite.createdById === session.user.id &&
        (prerequisite.approvalStatus === "PENDING" ||
          prerequisite.approvalStatus === "REJECTED")
      );
    }

    return false;
  };

  const handleDeleteClick = (e, prerequisite) => {
    e.stopPropagation(); // Prevent any parent click events
    setDeleteConfirmDialog({
      open: true,
      prerequisiteId: prerequisite.id,
      prerequisiteTitle: `Prerequisite`,
    });
  };

  const handleDeleteConfirm = async () => {
    const { prerequisiteId } = deleteConfirmDialog;
    setDeletingPrerequisiteId(prerequisiteId);

    try {
      const response = await prerequisiteAPI.delete(prerequisiteId);
      if (response.success) {
        // Remove the prerequisite from the local state
        setPrerequisites((prev) => prev.filter((prerequisite) => prerequisite.id !== prerequisiteId));

        // Show success message (optional)
        console.log("Prerequisite deleted successfully:", response.message);
      } else {
        console.error("Failed to delete prerequisite:", response.error);
        setError(response.error || "Failed to delete prerequisite.");
      }
    } catch (error) {
      console.error("Error deleting prerequisite:", error);
      setError("Error deleting prerequisite.");
    } finally {
      setDeletingPrerequisiteId(null);
      setDeleteConfirmDialog({ open: false, prerequisiteId: null, prerequisiteTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmDialog({ open: false, prerequisiteId: null, prerequisiteTitle: "" });
  };

  // Get filtered prerequisites based on role
  const getFilteredPrerequisites = () => {
    if (userRole === "student") {
      return prerequisites.filter((prerequisite) => prerequisite.approvalStatus === "APPROVED");
    }
    if (userRole === "volunteer") {
      return prerequisites.filter(
        (prerequisite) =>
          prerequisite.createdById === session.user.id ||
          prerequisite.approvalStatus === "APPROVED"
      );
    }
    // Admins and Experts see all prerequisites
    return prerequisites;
  };

  const filteredPrerequisites = getFilteredPrerequisites();

  // Separate prerequisites into approved and pending/rejected
  const approvedPrerequisites = filteredPrerequisites.filter(
    (prerequisite) => prerequisite.approvalStatus === "APPROVED"
  );
  const pendingRejectedPrerequisites = filteredPrerequisites.filter(
    (prerequisite) =>
      prerequisite.approvalStatus === "PENDING" || prerequisite.approvalStatus === "REJECTED"
  );

  const pendingPrerequisitesCount = prerequisites.filter(
    (prerequisite) => prerequisite.approvalStatus === "PENDING"
  ).length;

  const renderPrerequisiteCard = (prerequisite) => (
    <div key={prerequisite.id} className="flex flex-col items-center relative group">
      <div className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Delete Button - Only visible on hover */}
        {canDeletePrerequisite(prerequisite) && (
          <button
            onClick={(e) => handleDeleteClick(e, prerequisite)}
            disabled={deletingPrerequisiteId === prerequisite.id}
            className="absolute top-2 right-8 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Prerequisite"
          >
            {deletingPrerequisiteId === prerequisite.id ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        )}

        {/* Approval Status Overlay */}
        {userRole !== "student" && prerequisite.approvalStatus !== "APPROVED" && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold
              ${prerequisite.approvalStatus === "PENDING"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
              }`}
          >
            {prerequisite.approvalStatus}
          </div>
        )}
        
        {/* Rejection Message Tooltip for Volunteers */}
        {prerequisite.approvalStatus === "REJECTED" &&
          userRole === "volunteer" &&
          prerequisite.createdById === session.user.id &&
          prerequisite.rejectionMessage && (
            <Tooltip title={`Reason: ${prerequisite.rejectionMessage}`} arrow>
              <IconButton
                size="small"
                className="absolute top-1 left-47 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
              >
                <Info size={18} className="text-red-500" />
              </IconButton>
            </Tooltip>
          )}

        <img
          src={prerequisite.imageUrl}
          alt={`Prerequisite ${prerequisite.id}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-prerequisite.png";
          }}
        />
      </div>
    </div>
  );

  if (status === "loading" || loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading prerequisites...</div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-0">
          <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
          <ChevronRight className="text-gray-800" size={20} />
          <h1 className="font-bold text-gray-800">Prerequisites Available</h1>
        </div>
        <div className="flex items-center space-x-4">
          {(userRole === "volunteer" || userRole === "expert" || userRole === "admin") && (
            <button
              onClick={handleAddPrerequisite}
              className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
            >
              <Plus size={18} />
              <span>Add Prerequisite</span>
            </button>
          )}

          {(userRole === "admin" || userRole === "expert") && (
            <button
              onClick={handleOpenApprovalDialog}
              className="flex items-center text-sm space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors relative"
            >
              <span>Approval Prerequisites</span>
              {pendingPrerequisitesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingPrerequisitesCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Approved Prerequisites Section */}
      {approvedPrerequisites.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-4 gap-6">
            {approvedPrerequisites.map(renderPrerequisiteCard)}
          </div>
        </div>
      )}

      {/* Pending/Rejected Prerequisites Section */}
      {pendingRejectedPrerequisites.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-0 mb-6">
            <h1 className="font-bold text-gray-800">Pending / Rejected Prerequisites</h1>
            <ChevronRight className="text-gray-800" size={20} />
          </div>
          <div className="grid grid-cols-4 gap-6">
            {pendingRejectedPrerequisites.map(renderPrerequisiteCard)}
          </div>
        </div>
      )}

      {/* No Prerequisites Message */}
      {approvedPrerequisites.length === 0 &&
        pendingRejectedPrerequisites.length === 0 &&
        !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No prerequisites available</p>
            {(userRole === "volunteer" || userRole === "expert" || userRole === "admin") && (
              <p className="text-gray-400 text-sm mt-2">
                Click "Add Prerequisite" to get started
              </p>
            )}
          </div>
        )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        prerequisiteTitle={deleteConfirmDialog.prerequisiteTitle}
        isDeleting={deletingPrerequisiteId !== null}
      />

      {/* Add Prerequisite Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Prerequisite</DialogTitle>
        <DialogContent>
          <div className="py-4">
            <ImageUpload
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
              disabled={uploading}
              maxSize={5}
              label="Select Prerequisite Image"
              description="PNG, JPG, GIF up to 5MB"
              showFileName={true}
              resetTrigger={resetTrigger}
            />

            {uploadError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {uploadError}
              </Alert>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={uploading}
            onClick={handleDialogClose}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval Prerequisites Dialog */}
      {userRole && (userRole === "admin" || userRole === "expert") && (
        <ApprovalPrerequisitesDialog
          open={approvalDialogOpen}
          onClose={handleApprovalDialogClose}
          pendingPrerequisites={prerequisites.filter(
            (prerequisite) => prerequisite.approvalStatus === "PENDING"
          )}
          onApprovalStatusChange={fetchPrerequisites}
        />
      )}
    </div>
  );
};

export default Prerequisites;