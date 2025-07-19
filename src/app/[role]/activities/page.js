// // src/app/[role]/activities/page.js
// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { Plus, ChevronRight, MessageSquare, Download } from "lucide-react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Box,
//   Typography,
//   Alert,
//   CircularProgress,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Chip,
//   Stack,
// } from "@mui/material";
// import { activityAPI } from "@/lib/api";
// import ImageUpload from "@/app/components/ImageUpload";
// import PdfUpload from "@/app/components/PDFUpload";
// import ApprovalActivitiesDialog from "./ApprovalActivitiesDialog"; // Import the new dialog

// // --- Helper function to format time ---
// const formatTime12Hour = (time24) => {
//   if (!time24) return "N/A";
//   const [hours, minutes] = time24.split(":");
//   const hoursInt = parseInt(hours, 10);
//   const period = hoursInt >= 12 ? "PM" : "AM";
//   let hour12 = hoursInt % 12;
//   if (hour12 === 0) {
//     hour12 = 12; // Handle midnight (00:xx) and noon (12:xx)
//   }
//   return `${hour12}:${minutes} ${period}`;
// };

// const Activities = () => {
//   const router = useRouter();
//   const params = useParams();
//   const role = params.role;

//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   // Approval Dialog States
//   const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
//   const [pendingActivities, setPendingActivities] = useState([]);

//   // (All other state variables remain the same)
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     imageUrl: "",
//     pdfUrl: "",
//     date: new Date().toISOString().split("T")[0],
//     time: "",
//     category: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [uploadedImagePath, setUploadedImagePath] = useState("");
//   const [uploadedPdfPath, setUploadedPdfPath] = useState("");
//   const [resetImageUpload, setResetImageUpload] = useState(0);
//   const [resetPdfUpload, setResetPdfUpload] = useState(0);
//   const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
//   const [currentActivity, setCurrentActivity] = useState(null);
//   const [feedbackText, setFeedbackText] = useState("");
//   const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

//   useEffect(() => {
//     loadActivities();
//   }, [role]); // Reload activities when role changes

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
//         setActivities(sortedActivities);

//         // Separate pending activities for admin/expert view
//         if (role === "admin" || role === "expert") {
//           setPendingActivities(sortedActivities.filter(act => act.approvalStatus === "PENDING"));
//         } else {
//           setPendingActivities([]); // Clear pending activities for other roles
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
//   const filteredActivities = useMemo(() => {
//     let currentActivities = activities;

//     // For admin/expert, they see all activities, but the 'All Activities' section only shows approved ones normally
//     // Pending ones are handled in the approval dialog.
//     if (role === "admin" || role === "expert") {
//       currentActivities = activities.filter(activity => activity.approvalStatus === "APPROVED");
//     }

//     if (selectedCategory === "All") {
//       return currentActivities;
//     }
//     return currentActivities.filter(activity => activity.category === selectedCategory);
//   }, [activities, selectedCategory, role]);


//   const handleDialogOpen = () => setDialogOpen(true);

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setError("");
//     setSubmitting(false);
//     setFormData({
//       title: "", imageUrl: "", pdfUrl: "",
//       date: new Date().toISOString().split("T")[0], time: "", category: "",
//     });
//     setUploadedImagePath("");
//     setUploadedPdfPath("");
//     setResetImageUpload((prev) => prev + 1);
//     setResetPdfUpload((prev) => prev + 1);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageUploadComplete = (path) => setUploadedImagePath(path);
//   const handleImageUploadError = (msg) => setError(msg);
//   const handlePdfUploadComplete = (path) => setUploadedPdfPath(path);
//   const handlePdfUploadError = (msg) => setError(msg);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.title.trim()) {
//       setError("Activity title is required.");
//       return;
//     }
//     if (!formData.category) {
//       setError("Activity category is required.");
//       return;
//     }
//     setSubmitting(true);
//     setError("");
//     try {
//       const activityData = {
//         title: formData.title.trim(),
//         imageUrl: uploadedImagePath || "https://techterms.com/img/lg/pdf_109.png", // Default image if none uploaded
//         pdfUrl: uploadedPdfPath || null,
//         date: new Date(formData.date).toISOString(),
//         time: formData.time,
//         category: formData.category,
//       };
//       const response = await activityAPI.create(activityData);
//       if (response.success) {
//         await loadActivities();
//         handleDialogClose();
//       } else {
//         setError(response.error || "Failed to create activity.");
//       }
//     } catch (error) {
//       console.error("Error creating activity:", error);
//       setError("An unexpected error occurred.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

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
//     // This function is passed to the ApprovalGroupsDialog
//     // and is called when an approval/rejection action is completed.
//     // It triggers a reload of groups to update the UI.
//     loadActivities();
//   };

//   const ActivityCard = ({ activity }) => {
//     const displayImageUrl = activity.imageUrl
//       ? activity.imageUrl
//       : activity.pdfUrl
//       ? "https://techterms.com/img/lg/pdf_109.png" // Default PDF image if no imageUrl but pdfUrl exists
//       : "/activities/default.png"; // Fallback if neither image nor PDF is available

//     const handleDownloadPdf = (e) => {
//       e.stopPropagation(); // Prevent card click
//       if (activity.pdfUrl) {
//         window.open(activity.pdfUrl, '_blank');
//       }
//     };

//     return (
//       <div className="flex flex-col items-center flex-shrink-0">
//         <div
//           className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
//           onClick={() => router.push(`/${role}/activities/${activity.id}/prerequisites`)}
//         >
//           <img
//             src={displayImageUrl}
//             alt={activity.title}
//             className="w-full h-full object-cover"
//           />
//           {activity.category && (
//             <Chip
//               onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the card
//               label={activity.category}
//               size="small"
//               color="primary"
//               sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
//             />
//           )}
//           {/* Display Approval Status Chip for pending/rejected by volunteers */}
//           {role === "volunteer" && (activity.approvalStatus === "PENDING" || activity.approvalStatus === "REJECTED") && (
//             <Chip
//               label={activity.approvalStatus}
//               size="small"
//               color={activity.approvalStatus === "PENDING" ? "warning" : "error"}
//               sx={{ position: 'absolute', bottom: 8, left: 8 }}
//             />
//           )}
//         </div>
//         <div className="p-4 text-center w-56">
//           <h3 className="font-semibold text-gray-800">{activity.title}</h3>
//           <p className="text-sm text-gray-500">
//             {new Date(activity.date).toLocaleDateString()} at{" "}
//             <strong>{formatTime12Hour(activity.time)}</strong>
//           </p>
//           {activity.pdfUrl && (
//             <Button
//               size="small"
//               startIcon={<Download size={16} />}
//               onClick={handleDownloadPdf}
//               sx={{ mt: 1, mr: 1, textTransform: 'none' }}
//             >
//               Download PDF
//             </Button>
//           )}
//           {(role === "volunteer" || role === "expert") && (
//             <Button
//               size="small"
//               startIcon={<MessageSquare size={16} />}
//               onClick={() => handleOpenFeedbackDialog(activity)}
//               sx={{ mt: 1, textTransform: 'none' }}
//             >
//               {activity.feedback ? "Edit Feedback" : "Add Feedback"}
//             </Button>
//           )}
//           {/* Display Rejection Message if exists and user is volunteer */}
//           {role === "volunteer" && activity.approvalStatus === "REJECTED" && activity.rejectionMessage && (
//             <Alert severity="error" sx={{ mt: 1, p: 1 }}>
//               Rejected: {activity.rejectionMessage}
//             </Alert>
//           )}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (<div className="flex justify-center items-center min-h-screen"><CircularProgress /></div>);
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
//           {(role === "admin" || role === "expert") && pendingActivities.length > 0 && (
//             <Button
//               onClick={handleApprovalDialogOpen}
//               variant="outlined"
//               color="primary"
//               sx={{ textTransform: 'none' }}
//             >
//               Review Activities for Approval ({pendingActivities.length})
//             </Button>
//           )}
//           {(role === "volunteer" || role === "expert" || role === "admin") && (
//             <button
//               onClick={handleDialogOpen}
//               className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//             >
//               <Plus size={18} />
//               <span>Add Activity</span>
//             </button>
//           )}
//         </div>
//       </div>

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

//       {/* All Activities Section */}
//       <div>
//         <div className="flex gap-8 overflow-x-auto pb-4">
//           {filteredActivities.length > 0 ? (
//             filteredActivities.map((activity) => (
//               <ActivityCard key={activity.id} activity={activity} />
//             ))
//           ) : (
//             <Typography variant="body2" color="textSecondary" sx={{ pl: 1 }}>
//               No activities found for the selected category.
//             </Typography>
//           )}
//         </div>
//       </div>

//       {/* Add Activity Dialog */}
//       <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Add New Activity</DialogTitle>
//         <form onSubmit={handleSubmit}>
//           <DialogContent>
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
//               {error && <Alert severity="error">{error}</Alert>}
//               <TextField name="title" label="Activity Title" value={formData.title} onChange={handleInputChange} fullWidth required />
//               <FormControl fullWidth required> {/* Added required to FormControl */}
//                 <InputLabel id="category-select-label">Category</InputLabel>
//                 <Select labelId="category-select-label" name="category" value={formData.category} label="Category" onChange={handleInputChange}>
//                   <MenuItem value=""><em>None</em></MenuItem> {/* Added a "None" option */}
//                   <MenuItem value="Sports">Sports</MenuItem>
//                   <MenuItem value="IT">IT</MenuItem>
//                   {/* Add more categories as needed */}
//                 </Select>
//               </FormControl>
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <TextField name="date" label="Activity Date" type="date" value={formData.date} onChange={handleInputChange} fullWidth required InputLabelProps={{ shrink: true }} />
//                 <TextField name="time" label="Activity Time" type="time" value={formData.time} onChange={handleInputChange} fullWidth InputLabelProps={{ shrink: true }} />
//               </Box>
//               <ImageUpload onUploadComplete={handleImageUploadComplete} onError={handleImageUploadError} disabled={submitting} resetTrigger={resetImageUpload} />
//               <PdfUpload onUploadComplete={handlePdfUploadComplete} onError={handlePdfUploadError} disabled={submitting} label="Upload PDF (Optional)" resetTrigger={resetPdfUpload} />
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleDialogClose} disabled={submitting}>Cancel</Button>
//             <Button type="submit" variant="contained" disabled={submitting} sx={{ backgroundColor: "#2F699A", "&:hover": { backgroundColor: "#25547b" } }}>
//               {submitting ? <CircularProgress size={24} color="inherit" /> : "Add Activity"}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Feedback Dialog */}
//       <Dialog open={feedbackDialogOpen} onClose={handleCloseFeedbackDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>Feedback for {currentActivity?.title}</DialogTitle>
//         <DialogContent>
//           <TextField autoFocus margin="dense" label="Your Feedback" type="text" fullWidth multiline rows={4} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseFeedbackDialog} disabled={feedbackSubmitting}>Cancel</Button>
//           <Button onClick={handleFeedbackSubmit} variant="contained" disabled={feedbackSubmitting}>
//             {feedbackSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit Feedback"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Approval Activities Dialog (NEW) */}
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
import { Plus, ChevronRight, MessageSquare, Download } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import { activityAPI } from "@/lib/api";
import ImageUpload from "@/app/components/ImageUpload";
import PdfUpload from "@/app/components/PDFUpload";
import ApprovalActivitiesDialog from "./ApprovalActivitiesDialog"; // Import the new dialog
import { useSession } from "next-auth/react";
import { Info } from "@mui/icons-material";

// --- Helper function to format time ---
const formatTime12Hour = (time24) => {
  if (!time24) return "N/A";
  const [hours, minutes] = time24.split(":");
  const hoursInt = parseInt(hours, 10);
  const period = hoursInt >= 12 ? "PM" : "AM";
  let hour12 = hoursInt % 12;
  if (hour12 === 0) {
    hour12 = 12; // Handle midnight (00:xx) and noon (12:xx)
  }
  return `${hour12}:${minutes} ${period}`;
};

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

  // (All other state variables remain the same)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    pdfUrl: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    category: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState("");
  const [uploadedPdfPath, setUploadedPdfPath] = useState("");
  const [resetImageUpload, setResetImageUpload] = useState(0);
  const [resetPdfUpload, setResetPdfUpload] = useState(0);
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

  const handleDialogClose = () => {
    setDialogOpen(false);
    setError("");
    setSubmitting(false);
    setFormData({
      title: "", imageUrl: "", pdfUrl: "",
      date: new Date().toISOString().split("T")[0], time: "", category: "",
    });
    setUploadedImagePath("");
    setUploadedPdfPath("");
    setResetImageUpload((prev) => prev + 1);
    setResetPdfUpload((prev) => prev + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploadComplete = (path) => setUploadedImagePath(path);
  const handleImageUploadError = (msg) => setError(msg);
  const handlePdfUploadComplete = (path) => setUploadedPdfPath(path);
  const handlePdfUploadError = (msg) => setError(msg);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Activity title is required.");
      return;
    }
    if (!formData.category) {
      setError("Activity category is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const activityData = {
        title: formData.title.trim(),
        imageUrl: uploadedImagePath || "https://techterms.com/img/lg/pdf_109.png", // Default image if none uploaded
        pdfUrl: uploadedPdfPath || null,
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        category: formData.category,
      };
      const response = await activityAPI.create(activityData);
      if (response.success) {
        await loadActivities();
        handleDialogClose();
      } else {
        setError(response.error || "Failed to create activity.");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const ActivityCard = ({ activity }) => {
    const displayImageUrl = activity.imageUrl
      ? activity.imageUrl
      : activity.pdfUrl
      ? "https://techterms.com/img/lg/pdf_109.png" // Default PDF image if no imageUrl but pdfUrl exists
      : "/activities/default.png"; // Fallback if neither image nor PDF is available

    const handleDownloadPdf = (e) => {
      e.stopPropagation(); // Prevent card click
      if (activity.pdfUrl) {
        window.open(activity.pdfUrl, '_blank');
      }
    };

    const handleCardClick = () => {
      if (activity.approvalStatus === "APPROVED") {
        router.push(`/${role}/activities/${activity.id}/prerequisites`);
      }
    };

    return (
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
          onClick={handleCardClick}
        >
          {/* Approval Status Overlay */}
          {session?.user?.role !== "student" && activity.approvalStatus !== "APPROVED" && (
            <div
              className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold z-10
                ${activity.approvalStatus === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
                }`}
            >
              {activity.approvalStatus}
            </div>
          )}

          {/* Rejection Message Tooltip for Volunteers */}
          {activity.approvalStatus === "REJECTED" &&
            session?.user?.role === "volunteer" &&
            activity.createdById === session.user.id &&
            activity.rejectionMessage && (
              <Tooltip title={`Reason: ${activity.rejectionMessage}`} arrow>
                <IconButton
                  size="small"
                  className="absolute top-0 left-47 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info size={18} className="text-red-500" />
                </IconButton>
              </Tooltip>
            )}

          <img
            src={displayImageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          {activity.category && (
            <Chip
              onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the card
              label={activity.category}
              size="small"
              color="primary"
              sx={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}
            />
          )}
        </div>
        <div className="p-4 text-center w-56">
          <h3 className="font-semibold text-gray-800">{activity.title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(activity.date).toLocaleDateString()} at{" "}
            <strong>{formatTime12Hour(activity.time)}</strong>
          </p>
          {/* Display created by info for volunteers (their own pending/rejected) */}
          {session?.user?.role === "volunteer" &&
            activity.createdById === session.user.id &&
            activity.approvalStatus !== "APPROVED" && (
              <p className="text-xs text-gray-500 mt-1">
                Created by: {activity.createdBy?.name || "You"}
              </p>
            )}
          {activity.pdfUrl && (
            <Button
              size="small"
              startIcon={<Download size={16} />}
              onClick={handleDownloadPdf}
              sx={{ mt: 1, mr: 1, textTransform: 'none' }}
            >
              Download PDF
            </Button>
          )}
          {(role === "volunteer" || role === "expert") && activity.approvalStatus === "APPROVED" && (
            <Button
              size="small"
              startIcon={<MessageSquare size={16} />}
              onClick={() => handleOpenFeedbackDialog(activity)}
              sx={{ mt: 1, textTransform: 'none' }}
            >
              {activity.feedback ? "Edit Feedback" : "Add Feedback"}
            </Button>
          )}
        </div>
      </div>
    );
  };

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
            {approvedActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
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
            {pendingRejectedActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {/* No Activities Message */}
      {approvedActivities.length === 0 && pendingRejectedActivities.length === 0 && !loading && (
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
          No activities found for the selected category.
        </Typography>
      )}

      {/* Add Activity Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Activity</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="title" label="Activity Title" value={formData.title} onChange={handleInputChange} fullWidth required />
              <FormControl fullWidth required> {/* Added required to FormControl */}
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select labelId="category-select-label" name="category" value={formData.category} label="Category" onChange={handleInputChange}>
                  <MenuItem value=""><em>None</em></MenuItem> {/* Added a "None" option */}
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  {/* Add more categories as needed */}
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField name="date" label="Activity Date" type="date" value={formData.date} onChange={handleInputChange} fullWidth required InputLabelProps={{ shrink: true }} />
                <TextField name="time" label="Activity Time" type="time" value={formData.time} onChange={handleInputChange} fullWidth InputLabelProps={{ shrink: true }} />
              </Box>
              <ImageUpload onUploadComplete={handleImageUploadComplete} onError={handleImageUploadError} disabled={submitting} resetTrigger={resetImageUpload} />
              <PdfUpload onUploadComplete={handlePdfUploadComplete} onError={handlePdfUploadError} disabled={submitting} label="Upload PDF (Optional)" resetTrigger={resetPdfUpload} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ backgroundColor: "#2F699A", "&:hover": { backgroundColor: "#25547b" } }}>
              {submitting ? <CircularProgress size={24} color="inherit" /> : "Add Activity"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onClose={handleCloseFeedbackDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Feedback for {currentActivity?.title}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Your Feedback" type="text" fullWidth multiline rows={4} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
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