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
// } from "@mui/material";
// import ImageUpload from "@/app/components/ImageUpload";
// import { prerequisiteAPI } from "@/lib/api";

// const Prerequisites = () => {
//   const params = useParams();
//   const router = useRouter();
//   const role = params.role;
//   const activityId = params.id;

//   // State management
//   const [prerequisites, setPrerequisites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);
//   const [resetTrigger, setResetTrigger] = useState(null);

//   // Fetch prerequisites on component mount
//   useEffect(() => {
//     fetchPrerequisites();
//   }, [activityId]);

//   const fetchPrerequisites = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await prerequisiteAPI.getAll(activityId);

//       if (response.success) {
//         setPrerequisites(response.data);
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
//     setResetTrigger(Date.now()); // Trigger reset of ImageUpload component
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
//         // Refresh the prerequisites list
//         await fetchPrerequisites();

//         // Close dialog
//         handleDialogClose();

//         // Optional: Show success message
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

//   if (loading) {
//     return (
//       <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-2">
//           <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//           <h1 className="font-bold text-gray-800">Pre- Requisites Available</h1>
//         </div>
//         {(role === "volunteer" || role === "expert" || role === "admin") && (
//           <button
//             onClick={handleAddPrerequisite}
//             className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//           >
//             <Plus size={18} />
//             <span>Add Prerequisite</span>
//           </button>
//         )}
//       </div>

//       {/* Error Message */}
//       {error && (
//         <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Prerequisites Grid - 3 cards per row */}
//       <div className="grid grid-cols-3 gap-8">
//         {prerequisites.map((prerequisite) => (
//           <div
//             key={prerequisite.id}
//             className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
//             // onClick={() => router.push(`/${role}/activities/prerequisites/${prerequisite.id}`)} // Uncomment if you want to navigate to individual prerequisite pages
//           >
//             <img
//               src={prerequisite.imageUrl}
//               alt={`Prerequisite ${prerequisite.id}`}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {prerequisites.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No prerequisites available</p>
//           <p className="text-gray-400 text-sm mt-2">
//             Click "Add Prerequisite" to get started
//           </p>
//         </div>
//       )}

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
//             onClick={() => {
//               // The upload happens automatically when file is selected
//               // This button is just for UX, the actual upload is handled by ImageUpload component
//             }}
//           >
//             {uploading ? "Adding..." : "Add Prerequisite"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default Prerequisites;

// src\app\[role]\activities\[id]\prerequisites\page.js
"use client";
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight, Gavel } from "lucide-react"; // Import Gavel icon
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  IconButton, // Import IconButton
} from "@mui/material";
import ImageUpload from "@/app/components/ImageUpload";
import { prerequisiteAPI } from "@/lib/api";
import { useSession } from "next-auth/react"; // Import useSession
import ApprovalPrerequisitesDialog from './ApprovalPrerequisitesDialog'; // Import the new dialog

const Prerequisites = () => {
  const params = useParams();
  const router = useRouter();
  const role = params.role; // This comes from the URL, but useSession will give the authenticated role
  const activityId = params.id;
  const { data: session, status } = useSession(); // Get session data

  // State management
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false); // New state for approval dialog
  const [pendingPrerequisites, setPendingPrerequisites] = useState([]); // New state for pending prerequisites

  const userRole = session?.user?.role; // Get the user's role from session

  // Fetch prerequisites on component mount and when session/activityId changes
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    fetchPrerequisites();
  }, [activityId, status, userRole]); // Re-fetch when userRole changes

  const fetchPrerequisites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prerequisiteAPI.getAll(activityId);

      if (response.success) {
        const allPrerequisites = response.data;
        // Filter prerequisites based on role for display
        if (userRole === "admin" || userRole === "expert") {
          // Admins/Experts see all, but we separate pending for the dialog
          setPrerequisites(allPrerequisites);
          setPendingPrerequisites(allPrerequisites.filter(p => p.approvalStatus === "PENDING"));
        } else if (userRole === "volunteer") {
          // Volunteers see their own pending/rejected/approved and all approved
          setPrerequisites(allPrerequisites.filter(p => p.approvalStatus === "APPROVED" || p.createdById === session.user.id));
          // Volunteers can also see their own pending/rejected in the main list,
          // but the approval dialog is only for admin/expert.
          // No need to set pendingPrerequisites for volunteer here as they don't approve.
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
    setResetTrigger(Date.now()); // Trigger reset of ImageUpload component
  };

  const handleApprovalDialogClose = () => {
    setApprovalDialogOpen(false);
    fetchPrerequisites(); // Refresh list after closing approval dialog
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
        // Refresh the prerequisites list
        await fetchPrerequisites();

        // Close dialog
        handleDialogClose();

        // Optional: Show success message
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

  if (status === "loading" || loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push('/login'); // Redirect to login if not authenticated
    return null;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
          <ChevronRight className="text-gray-800" size={20} />
          <h1 className="font-bold text-gray-800">Prerequisites Available</h1>
        </div>
        <div className="flex items-center gap-4">
          {(userRole === "volunteer" || userRole === "expert" || userRole === "admin") && (
            <button
              onClick={handleAddPrerequisite}
              className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
            >
              <Plus size={18} />
              <span>Add Prerequisite</span>
            </button>
          )}

          {(userRole === "admin" || userRole === "expert") && pendingPrerequisites.length > 0 && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Gavel />}
              onClick={handleOpenApprovalDialog}
            >
              Review Pending Prerequisites ({pendingPrerequisites.length})
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Prerequisites Grid - 3 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {prerequisites.map((prerequisite) => (
          <div
            key={prerequisite.id}
            className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
          >
            <img
              src={prerequisite.imageUrl}
              alt={`Prerequisite ${prerequisite.id}`}
              className="w-full h-full object-cover"
            />
            {/* Display status for volunteer/admin/expert on their own created items */}
            {((userRole === "volunteer" && prerequisite.createdById === session.user.id) || userRole === "admin" || userRole === "expert") &&
              prerequisite.approvalStatus !== "APPROVED" && (
                <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold
                  ${prerequisite.approvalStatus === "PENDING" ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {prerequisite.approvalStatus}
                </div>
              )}
            {/* Display rejection message for rejected items for the creator */}
            {userRole === "volunteer" && prerequisite.createdById === session.user.id && prerequisite.approvalStatus === "REJECTED" && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-600 bg-opacity-75 text-white text-xs p-2 truncate">
                    Rejected: {prerequisite.rejectionMessage || 'No message provided.'}
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {prerequisites.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No prerequisites available</p>
          {(userRole === "volunteer" || userRole === "expert" || userRole === "admin") && (
            <p className="text-gray-400 text-sm mt-2">
              Click "Add Prerequisite" to get started
            </p>
          )}
        </div>
      )}

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
          {/* This button doesn't trigger upload, ImageUpload handles it. */}
          {/* It's more of a confirmation/closing button after upload is done. */}
          {/* You might want to make it clearer that upload is automatic on file selection. */}
          <Button
            variant="contained"
            disabled={uploading}
            onClick={handleDialogClose} // Close dialog after successful upload
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
          pendingPrerequisites={pendingPrerequisites}
          onApprovalStatusChange={fetchPrerequisites} // Pass a callback to refresh data
        />
      )}
    </div>
  );
};

export default Prerequisites;