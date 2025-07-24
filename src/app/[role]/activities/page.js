// // src/app/[role]/activities/page.js
// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { Plus, ChevronRight, MessageSquare } from "lucide-react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Typography,
//   CircularProgress,
//   Chip,
//   Stack,
// } from "@mui/material";
// import { activityAPI } from "@/lib/api";
// import ApprovalActivitiesDialog from "./ApprovalActivitiesDialog";
// import AddActivityDialog from "./AddActivityDialog";
// import ActivityCard from "./ActivityCard";
// import { useSession } from "next-auth/react";

// const Activities = () => {
//   const router = useRouter();
//   const params = useParams();
//   const role = params.role;
//   const { data: session, status } = useSession();

//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // Approval Dialog States
//   const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
//   const [pendingActivities, setPendingActivities] = useState([]);

//   // Add Activity Dialog State
//   const [dialogOpen, setDialogOpen] = useState(false);

//   // Other state variables
//   const [error, setError] = useState("");
//   const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
//   const [currentActivity, setCurrentActivity] = useState(null);
//   const [feedbackText, setFeedbackText] = useState("");
//   const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

//   useEffect(() => {
//     if (status === "loading") return; // Don't fetch if session is still loading
//     loadActivities();
//   }, [role, status]); // Reload activities when role or session status changes

//   const loadActivities = async () => {
//     try {
//       setLoading(true);
//       const response = await activityAPI.getAll(); // This will now fetch based on role internally
//       if (response.success) {
//         const sortedActivities = response.data.sort((a, b) => {
//           const dateTimeA = new Date(`${a.date.split("T")[0]}T${a.time || "00:00"}`);
//           const dateTimeB = new Date(`${b.date.split("T")[0]}T${b.time || "00:00"}`);
//           return dateTimeB - dateTimeA;
//         });
        
//         // Handle activities based on role similar to groups
//         if (session?.user?.role === "admin" || session?.user?.role === "expert") {
//           setActivities(sortedActivities); // Admins/Experts see all activities
//           setPendingActivities(sortedActivities.filter(act => act.approvalStatus === "PENDING"));
//         } else if (session?.user?.role === "volunteer") {
//           // Volunteers see their created activities (any status) and approved activities
//           const filteredActivities = sortedActivities.filter(
//             (activity) =>
//               activity.createdById === session.user.id ||
//               activity.approvalStatus === "APPROVED"
//           );
//           setActivities(filteredActivities);
//           setPendingActivities(sortedActivities.filter(act => act.approvalStatus === "PENDING"));
//         } else if (session?.user?.role === "student") {
//           // Students only see approved activities
//           const approvedActivities = sortedActivities.filter(
//             (activity) => activity.approvalStatus === "APPROVED"
//           );
//           setActivities(approvedActivities);
//           setPendingActivities([]);
//         } else {
//           setActivities([]);
//           setPendingActivities([]);
//         }
//       } else {
//         setError(response.error || "Failed to load activities.");
//       }
//     } catch (error) {
//       console.error("Error loading activities:", error);
//       setError("Failed to load activities.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Filter activities based on selectedCategory and user role ---
//   const getFilteredActivities = () => {
//     if (session?.user?.role === "student") {
//       return activities.filter((activity) => activity.approvalStatus === "APPROVED");
//     }
//     // Volunteers see their own pending/rejected/approved activities and all approved activities
//     if (session?.user?.role === "volunteer") {
//       return activities.filter(
//         (activity) =>
//           activity.createdById === session.user.id ||
//           activity.approvalStatus === "APPROVED"
//       );
//     }
//     // Admins and Experts see all activities
//     return activities;
//   };

//   const filteredActivities = useMemo(() => {
//     const currentActivities = getFilteredActivities();
    
//     if (selectedCategory === "All") {
//       return currentActivities;
//     }
//     return currentActivities.filter(activity => activity.category === selectedCategory);
//   }, [activities, selectedCategory, role, session]);

//   // Separate activities into approved and pending/rejected
//   const approvedActivities = filteredActivities.filter(
//     (activity) => activity.approvalStatus === "APPROVED"
//   );
//   const pendingRejectedActivities = filteredActivities.filter(
//     (activity) =>
//       activity.approvalStatus === "PENDING" || activity.approvalStatus === "REJECTED"
//   );

//   const pendingActivitiesCount = activities.filter(
//     (activity) => activity.approvalStatus === "PENDING"
//   ).length;

//   const handleDialogOpen = () => setDialogOpen(true);
//   const handleDialogClose = () => setDialogOpen(false);

//   const handleOpenFeedbackDialog = (activity) => {
//     setCurrentActivity(activity);
//     setFeedbackText(activity.feedback || "");
//     setFeedbackDialogOpen(true);
//   };
//   const handleCloseFeedbackDialog = () => {
//     setFeedbackDialogOpen(false);
//     setCurrentActivity(null);
//     setFeedbackText("");
//     setFeedbackSubmitting(false);
//   };
//   const handleFeedbackSubmit = async () => {
//     if (!currentActivity) return;
//     setFeedbackSubmitting(true);
//     try {
//       const response = await activityAPI.update(currentActivity.id, { feedback: feedbackText });
//       if (response.success) {
//         await loadActivities();
//         handleCloseFeedbackDialog();
//       } else {
//         alert("Failed to submit feedback.");
//       }
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     } finally {
//       setFeedbackSubmitting(false);
//     }
//   };

//   // Approval Dialog Handlers
//   const handleApprovalDialogOpen = () => setApprovalDialogOpen(true);
//   const handleApprovalDialogClose = () => {
//     setApprovalDialogOpen(false);
//     loadActivities(); // Reload activities after closing approval dialog
//   };
//   const handleApprovalStatusChange = () => {
//     // This function is passed to the ApprovalActivitiesDialog
//     // and is called when an approval/rejection action is completed.
//     // It triggers a reload of activities to update the UI.
//     loadActivities();
//   };

//   if (loading || status === "loading") {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-0">
//           <h1 className="font-bold text-gray-800">All Activities</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//         </div>
//         <div className="flex items-center space-x-4"> {/* Container for buttons */}
//           {(role === "volunteer" || role === "expert" || role === "admin") && (
//             <button
//               onClick={handleDialogOpen}
//               className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//             >
//               <Plus size={18} />
//               <span>Add Activity</span>
//             </button>
//           )}
          
//           {(session?.user?.role === "admin" || session?.user?.role === "expert") && (
//             <button
//               onClick={handleApprovalDialogOpen}
//               className="flex items-center text-sm space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors relative"
//             >
//               <span>Approval Activities</span>
//               {pendingActivitiesCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {pendingActivitiesCount}
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

//       {/* --- Category Filter Chips --- */}
//       <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
//         <Chip
//           label="All"
//           onClick={() => setSelectedCategory("All")}
//           variant={selectedCategory === "All" ? "filled" : "outlined"}
//           color="primary"
//         />
//         <Chip
//           label="Sports"
//           onClick={() => setSelectedCategory("Sports")}
//           variant={selectedCategory === "Sports" ? "filled" : "outlined"}
//           color="primary"
//         />
//         <Chip
//           label="IT"
//           onClick={() => setSelectedCategory("IT")}
//           variant={selectedCategory === "IT" ? "filled" : "outlined"}
//           color="primary"
//         />
//       </Stack>

//       {/* Approved Activities Section */}
//       {approvedActivities.length > 0 && (
//         <div className="mb-12">
//           <div className="flex gap-8 overflow-x-auto pb-4">
//             {approvedActivities.map((activity) => (
//               <ActivityCard 
//                 key={activity.id} 
//                 activity={activity} 
//                 role={role}
//                 onOpenFeedbackDialog={handleOpenFeedbackDialog}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Pending/Rejected Activities Section */}
//       {pendingRejectedActivities.length > 0 && (
//         <div className="mb-8">
//           <div className="flex items-center space-x-0 mb-6">
//             <h1 className="font-bold text-gray-800">Pending / Rejected Activities</h1>
//             <ChevronRight className="text-gray-800" size={20} />
//           </div>
//           <div className="flex gap-8 overflow-x-auto pb-4">
//             {pendingRejectedActivities.map((activity) => (
//               <ActivityCard 
//                 key={activity.id} 
//                 activity={activity} 
//                 role={role}
//                 onOpenFeedbackDialog={handleOpenFeedbackDialog}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* No Activities Message */}
//       {approvedActivities.length === 0 && pendingRejectedActivities.length === 0 && !loading && (
//         <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
//           No activities found for the selected category.
//         </Typography>
//       )}

//       {/* Add Activity Dialog */}
//       <AddActivityDialog
//         open={dialogOpen}
//         onClose={handleDialogClose}
//         onActivityAdded={loadActivities}
//       />

//       {/* Feedback Dialog */}
//       <Dialog open={feedbackDialogOpen} onClose={handleCloseFeedbackDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>Feedback for {currentActivity?.title}</DialogTitle>
//         <DialogContent>
//           <TextField 
//             autoFocus 
//             margin="dense" 
//             label="Your Feedback" 
//             type="text" 
//             fullWidth 
//             multiline 
//             rows={4} 
//             value={feedbackText} 
//             onChange={(e) => setFeedbackText(e.target.value)} 
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseFeedbackDialog} disabled={feedbackSubmitting}>Cancel</Button>
//           <Button onClick={handleFeedbackSubmit} variant="contained" disabled={feedbackSubmitting}>
//             {feedbackSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Feedback"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Approval Activities Dialog */}
//       <ApprovalActivitiesDialog
//         open={approvalDialogOpen}
//         onClose={handleApprovalDialogClose}
//         pendingActivities={pendingActivities}
//         onApprovalStatusChange={handleApprovalStatusChange}
//       />
//     </div>
//   );
// };

// export default Activities;

// src/app/[role]/activities/page.js
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Plus, ChevronRight, MessageSquare, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { activityAPI } from "@/lib/api";
import ApprovalActivitiesDialog from "./ApprovalActivitiesDialog";
import AddActivityDialog from "./AddActivityDialog";
import ActivityCard from "./ActivityCard";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useSession } from "next-auth/react";

const Activities = () => {
  const router = useRouter();
  const params = useParams();
  const role = params.role;
  const { data: session, status } = useSession();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Approval Dialog States
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [pendingActivities, setPendingActivities] = useState([]);

  // Add Activity Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);

  // Delete Dialog States
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    activityId: null,
    activityTitle: "",
  });
  const [deletingActivityId, setDeletingActivityId] = useState(null);

  // Other state variables
  const [error, setError] = useState("");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Don't fetch if session is still loading
    loadActivities();
  }, [role, status]); // Reload activities when role or session status changes

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getAll(); // This will now fetch based on role internally
      if (response.success) {
        const sortedActivities = response.data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date.split("T")[0]}T${a.time || "00:00"}`);
          const dateTimeB = new Date(`${b.date.split("T")[0]}T${b.time || "00:00"}`);
          return dateTimeB - dateTimeA;
        });
        
        // Handle activities based on role similar to groups
        if (session?.user?.role === "admin" || session?.user?.role === "expert") {
          setActivities(sortedActivities); // Admins/Experts see all activities
          setPendingActivities(sortedActivities.filter(act => act.approvalStatus === "PENDING"));
        } else if (session?.user?.role === "volunteer") {
          // Volunteers see their created activities (any status) and approved activities
          const filteredActivities = sortedActivities.filter(
            (activity) =>
              activity.createdById === session.user.id ||
              activity.approvalStatus === "APPROVED"
          );
          setActivities(filteredActivities);
          setPendingActivities(sortedActivities.filter(act => act.approvalStatus === "PENDING"));
        } else if (session?.user?.role === "student") {
          // Students only see approved activities
          const approvedActivities = sortedActivities.filter(
            (activity) => activity.approvalStatus === "APPROVED"
          );
          setActivities(approvedActivities);
          setPendingActivities([]);
        } else {
          setActivities([]);
          setPendingActivities([]);
        }
      } else {
        setError(response.error || "Failed to load activities.");
      }
    } catch (error) {
      console.error("Error loading activities:", error);
      setError("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  // --- Filter activities based on selectedCategory and user role ---
  const getFilteredActivities = () => {
    if (session?.user?.role === "student") {
      return activities.filter((activity) => activity.approvalStatus === "APPROVED");
    }
    // Volunteers see their own pending/rejected/approved activities and all approved activities
    if (session?.user?.role === "volunteer") {
      return activities.filter(
        (activity) =>
          activity.createdById === session.user.id ||
          activity.approvalStatus === "APPROVED"
      );
    }
    // Admins and Experts see all activities
    return activities;
  };

  const filteredActivities = useMemo(() => {
    const currentActivities = getFilteredActivities();
    
    if (selectedCategory === "All") {
      return currentActivities;
    }
    return currentActivities.filter(activity => activity.category === selectedCategory);
  }, [activities, selectedCategory, role, session]);

  // Check if user can delete a specific activity
  const canDeleteActivity = (activity) => {
    // Admins and experts can delete any activity
    if (session?.user?.role === "admin" || session?.user?.role === "expert") {
      return true;
    }

    // Volunteers can only delete their own pending or rejected activities
    if (session?.user?.role === "volunteer") {
      return (
        activity.createdById === session.user.id &&
        (activity.approvalStatus === "PENDING" ||
          activity.approvalStatus === "REJECTED")
      );
    }

    return false;
  };

  const handleDeleteClick = (e, activity) => {
    e.stopPropagation(); // Prevent activity card click
    setDeleteConfirmDialog({
      open: true,
      activityId: activity.id,
      activityTitle: activity.title,
    });
  };

  const handleDeleteConfirm = async () => {
    const { activityId } = deleteConfirmDialog;
    setDeletingActivityId(activityId);

    try {
      const response = await activityAPI.delete(activityId);
      if (response.success) {
        // Remove the activity from the local state
        setActivities((prev) => prev.filter((activity) => activity.id !== activityId));

        // Show success message (optional)
        console.log("Activity deleted successfully:", response.message);
      } else {
        console.error("Failed to delete activity:", response.error);
        setError(response.error || "Failed to delete activity.");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      setError("Error deleting activity.");
    } finally {
      setDeletingActivityId(null);
      setDeleteConfirmDialog({ open: false, activityId: null, activityTitle: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmDialog({ open: false, activityId: null, activityTitle: "" });
  };

  // Separate activities into approved and pending/rejected
  const approvedActivities = filteredActivities.filter(
    (activity) => activity.approvalStatus === "APPROVED"
  );
  const pendingRejectedActivities = filteredActivities.filter(
    (activity) =>
      activity.approvalStatus === "PENDING" || activity.approvalStatus === "REJECTED"
  );

  const pendingActivitiesCount = activities.filter(
    (activity) => activity.approvalStatus === "PENDING"
  ).length;

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleOpenFeedbackDialog = (activity) => {
    setCurrentActivity(activity);
    setFeedbackText(activity.feedback || "");
    setFeedbackDialogOpen(true);
  };
  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
    setCurrentActivity(null);
    setFeedbackText("");
    setFeedbackSubmitting(false);
  };
  const handleFeedbackSubmit = async () => {
    if (!currentActivity) return;
    setFeedbackSubmitting(true);
    try {
      const response = await activityAPI.update(currentActivity.id, { feedback: feedbackText });
      if (response.success) {
        await loadActivities();
        handleCloseFeedbackDialog();
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Approval Dialog Handlers
  const handleApprovalDialogOpen = () => setApprovalDialogOpen(true);
  const handleApprovalDialogClose = () => {
    setApprovalDialogOpen(false);
    loadActivities(); // Reload activities after closing approval dialog
  };
  const handleApprovalStatusChange = () => {
    // This function is passed to the ApprovalActivitiesDialog
    // and is called when an approval/rejection action is completed.
    // It triggers a reload of activities to update the UI.
    loadActivities();
  };

  // Modified ActivityCard wrapper to include delete button
  const renderActivityCard = (activity) => (
    <div key={activity.id} className="relative group">
      {/* Delete Button - Only visible on hover */}
      {canDeleteActivity(activity) && (
        <button
          onClick={(e) => handleDeleteClick(e, activity)}
          disabled={deletingActivityId === activity.id}
          className="absolute top-1 right-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Activity"
        >
          {deletingActivityId === activity.id ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      )}
      
      <ActivityCard 
        activity={activity} 
        role={role}
        onOpenFeedbackDialog={handleOpenFeedbackDialog}
      />
    </div>
  );

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-0">
          <h1 className="font-bold text-gray-800">All Activities</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
        <div className="flex items-center space-x-4"> {/* Container for buttons */}
          {(role === "volunteer" || role === "expert" || role === "admin") && (
            <button
              onClick={handleDialogOpen}
              className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
            >
              <Plus size={18} />
              <span>Add Activity</span>
            </button>
          )}
          
          {(session?.user?.role === "admin" || session?.user?.role === "expert") && (
            <button
              onClick={handleApprovalDialogOpen}
              className="flex items-center text-sm space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors relative"
            >
              <span>Approval Activities</span>
              {pendingActivitiesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingActivitiesCount}
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

      {/* --- Category Filter Chips --- */}
      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        <Chip
          label="All"
          onClick={() => setSelectedCategory("All")}
          variant={selectedCategory === "All" ? "filled" : "outlined"}
          color="primary"
        />
        <Chip
          label="Sports"
          onClick={() => setSelectedCategory("Sports")}
          variant={selectedCategory === "Sports" ? "filled" : "outlined"}
          color="primary"
        />
        <Chip
          label="IT"
          onClick={() => setSelectedCategory("IT")}
          variant={selectedCategory === "IT" ? "filled" : "outlined"}
          color="primary"
        />
      </Stack>

      {/* Approved Activities Section */}
      {approvedActivities.length > 0 && (
        <div className="mb-12">
          <div className="flex gap-8 overflow-x-auto pb-4">
            {approvedActivities.map(renderActivityCard)}
          </div>
        </div>
      )}

      {/* Pending/Rejected Activities Section */}
      {pendingRejectedActivities.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-0 mb-6">
            <h1 className="font-bold text-gray-800">Pending / Rejected Activities</h1>
            <ChevronRight className="text-gray-800" size={20} />
          </div>
          <div className="flex gap-8 overflow-x-auto pb-4">
            {pendingRejectedActivities.map(renderActivityCard)}
          </div>
        </div>
      )}

      {/* No Activities Message */}
      {approvedActivities.length === 0 && pendingRejectedActivities.length === 0 && !loading && (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          No activities found for the selected category.
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        activityTitle={deleteConfirmDialog.activityTitle}
        isDeleting={deletingActivityId !== null}
      />

      {/* Add Activity Dialog */}
      <AddActivityDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onActivityAdded={loadActivities}
      />

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onClose={handleCloseFeedbackDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Feedback for {currentActivity?.title}</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus 
            margin="dense" 
            label="Your Feedback" 
            type="text" 
            fullWidth 
            multiline 
            rows={4} 
            value={feedbackText} 
            onChange={(e) => setFeedbackText(e.target.value)} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog} disabled={feedbackSubmitting}>Cancel</Button>
          <Button onClick={handleFeedbackSubmit} variant="contained" disabled={feedbackSubmitting}>
            {feedbackSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Feedback"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval Activities Dialog */}
      <ApprovalActivitiesDialog
        open={approvalDialogOpen}
        onClose={handleApprovalDialogClose}
        pendingActivities={pendingActivities}
        onApprovalStatusChange={handleApprovalStatusChange}
      />
    </div>
  );
};

export default Activities;