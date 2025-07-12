// "use client";
// import React, { useState, useEffect } from "react";
// import { Plus, ChevronRight, MessageSquare } from "lucide-react";
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
// } from "@mui/material";
// import { activityAPI } from "@/lib/api";
// import ImageUpload from "@/app/components/ImageUpload"; // Assuming path
// import PdfUpload from "@/app/components/PDFUpload"; // Assuming path

// const Activities = () => {
//   const router = useRouter();
//   const params = useParams();
//   const role = params.role;

//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // State for the "Add/Edit Activity" Dialog
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

//   // State for the "Feedback" Dialog
//   const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
//   const [currentActivity, setCurrentActivity] = useState(null);
//   const [feedbackText, setFeedbackText] = useState("");
//   const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

//   // Load activities on component mount
//   useEffect(() => {
//     loadActivities();
//   }, []);

//   const loadActivities = async () => {
//     try {
//       setLoading(true);
//       const response = await activityAPI.getAll(); // Using getAll to fetch all activities
//       if (response.success) {
//         // Sort activities by date and time, newest first
//         const sortedActivities = response.data.sort((a, b) => {
//           const dateTimeA = new Date(`${a.date.split("T")[0]}T${a.time || "00:00"}`);
//           const dateTimeB = new Date(`${b.date.split("T")[0]}T${b.time || "00:00"}`);
//           return dateTimeB - dateTimeA;
//         });
//         setActivities(sortedActivities);
//       }
//     } catch (error) {
//       console.error("Error loading activities:", error);
//       setError("Failed to load activities.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDialogOpen = () => {
//     setDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setError("");
//     setSubmitting(false);
//     setFormData({
//       title: "",
//       imageUrl: "",
//       pdfUrl: "",
//       date: new Date().toISOString().split("T")[0],
//       time: "",
//       category: "",
//     });
//     setUploadedImagePath("");
//     setUploadedPdfPath("");
//     setResetImageUpload((prev) => prev + 1); // Trigger image upload reset
//     setResetPdfUpload((prev) => prev + 1);   // Trigger pdf upload reset
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle file upload callbacks
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
//     setSubmitting(true);
//     setError("");

//     try {
//       const activityData = {
//         title: formData.title.trim(),
//         imageUrl: uploadedImagePath || formData.imageUrl.trim() || "/activities/default.png",
//         pdfUrl: uploadedPdfPath || formData.pdfUrl.trim(), // PDF is optional
//         date: new Date(formData.date).toISOString(),
//         time: formData.time,
//         category: formData.category,
//       };

//       const response = await activityAPI.create(activityData);

//       if (response.success) {
//         await loadActivities(); // Refresh list
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

//   // --- Feedback Handlers ---
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
//       const response = await activityAPI.update(currentActivity.id, {
//         feedback: feedbackText,
//       });
//       if (response.success) {
//         await loadActivities(); // Refresh to show new feedback
//         handleCloseFeedbackDialog();
//       } else {
//         // Handle error in dialog
//         alert("Failed to submit feedback.");
//       }
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//     } finally {
//       setFeedbackSubmitting(false);
//     }
//   };

//   // --- Components ---
//   const ActivityCard = ({ activity }) => (
//     <div className="flex flex-col items-center flex-shrink-0">
//       <div
//         className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
//         onClick={() => router.push(`/${role}/activities/${activity.id}/prerequisites`)}
//       >
//         <img
//           src={activity.imageUrl || "/activities/default.png"}
//           alt={activity.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="p-4 text-center w-56">
//         <h3 className="font-semibold text-gray-800">{activity.title}</h3>
//         <p className="text-sm text-gray-500">
//             {new Date(activity.date).toLocaleDateString()} at {activity.time || 'N/A'}
//         </p>
//         {(role === "volunteer" || role === "expert") && (
//           <Button
//             size="small"
//             startIcon={<MessageSquare size={16} />}
//             onClick={() => handleOpenFeedbackDialog(activity)}
//             sx={{ mt: 1, textTransform: 'none' }}
//           >
//             {activity.feedback ? "Edit Feedback" : "Add Feedback"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen"><CircularProgress /></div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-0">
//           <h1 className="font-bold text-gray-800">All Activities</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//         </div>
//         {(role === "volunteer" || role === "expert" || role === "admin") && (
//           <button
//             onClick={handleDialogOpen}
//             className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//           >
//             <Plus size={18} />
//             <span>Add Activity</span>
//           </button>
//         )}
//       </div>

//       {/* All Activities Section */}
//       <div>
//         <div className="flex gap-8 overflow-x-auto pb-4">
//           {activities.length > 0 ? (
//             activities.map((activity) => (
//               <ActivityCard key={activity.id} activity={activity} />
//             ))
//           ) : (
//             <Typography variant="body2" color="textSecondary">
//               No activities have been scheduled yet.
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
              
//               <FormControl fullWidth>
//                 <InputLabel id="category-select-label">Category</InputLabel>
//                 <Select labelId="category-select-label" name="category" value={formData.category} label="Category" onChange={handleInputChange}>
//                   <MenuItem value="Sports">Sports</MenuItem>
//                   <MenuItem value="IT">IT</MenuItem>
//                 </Select>
//               </FormControl>

//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <TextField name="date" label="Activity Date" type="date" value={formData.date} onChange={handleInputChange} fullWidth required InputLabelProps={{ shrink: true }} />
//                 <TextField name="time" label="Activity Time" type="time" value={formData.time} onChange={handleInputChange} fullWidth InputLabelProps={{ shrink: true }} />
//               </Box>

//               <ImageUpload onUploadComplete={handleImageUploadComplete} onError={handleImageUploadError} disabled={submitting} resetTrigger={resetImageUpload} />
              
//               {/* Optional PDF Upload */}
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
//     </div>
//   );
// };

// export default Activities;



//----------------------------------------------------------------------


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
//   Box,
//   Typography,
//   Alert,
//   CircularProgress,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Chip, // Import Chip
//   Stack, // Import Stack for layout
// } from "@mui/material";
// import { activityAPI } from "@/lib/api";
// import ImageUpload from "@/app/components/ImageUpload";
// import PdfUpload from "@/app/components/PDFUpload";

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
//   const [selectedCategory, setSelectedCategory] = useState("All"); // State for filtering

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
//   }, []);

//   const loadActivities = async () => {
//     try {
//       setLoading(true);
//       const response = await activityAPI.getAll();
//       if (response.success) {
//         const sortedActivities = response.data.sort((a, b) => {
//           const dateTimeA = new Date(`${a.date.split("T")[0]}T${a.time || "00:00"}`);
//           const dateTimeB = new Date(`${b.date.split("T")[0]}T${b.time || "00:00"}`);
//           return dateTimeB - dateTimeA;
//         });
//         setActivities(sortedActivities);
//       }
//     } catch (error) {
//       console.error("Error loading activities:", error);
//       setError("Failed to load activities.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // --- Filter activities based on selectedCategory ---
//   const filteredActivities = useMemo(() => {
//     if (selectedCategory === "All") {
//       return activities;
//     }
//     return activities.filter(activity => activity.category === selectedCategory);
//   }, [activities, selectedCategory]);


//   // (All other handler functions like handleDialogOpen, handleSubmit, etc. remain the same)
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
//     setSubmitting(true);
//     setError("");
//     try {
//       const activityData = {
//         title: formData.title.trim(),
//         imageUrl: uploadedImagePath || formData.imageUrl.trim() || "/activities/default.png",
//         pdfUrl: uploadedPdfPath || formData.pdfUrl.trim(),
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


//   const ActivityCard = ({ activity }) => (
//     <div className="flex flex-col items-center flex-shrink-0">
//       <div
//         className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
//         onClick={() => router.push(`/${role}/activities/${activity.id}/prerequisites`)}
//       >
//         <img
//           src={activity.imageUrl || "/activities/default.png"}
//           alt={activity.title}
//           className="w-full h-full object-cover"
//         />
//          {activity.category && (
//           <Chip 
//             onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the card
//             label={activity.category}
//             size="small"
//             color="primary"
//             sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
//           />
//         )}
//       </div>
//       <div className="p-4 text-center w-56">
//         <h3 className="font-semibold text-gray-800">{activity.title}</h3>
//         <p className="text-sm text-gray-500">
//           {new Date(activity.date).toLocaleDateString()} at{" "}
//           {/* Use the new time formatting function */}
//           <strong>{formatTime12Hour(activity.time)}</strong>
//         </p>
//         {(role === "volunteer" || role === "expert") && (
//           <Button
//             size="small"
//             startIcon={<MessageSquare size={16} />}
//             onClick={() => handleOpenFeedbackDialog(activity)}
//             sx={{ mt: 1, textTransform: 'none' }}
//           >
//             {activity.feedback ? "Edit Feedback" : "Add Feedback"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );

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
//         {(role === "volunteer" || role === "expert" || role === "admin") && (
//           <button
//             onClick={handleDialogOpen}
//             className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//           >
//             <Plus size={18} />
//             <span>Add Activity</span>
//           </button>
//         )}
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
      
//       {/* (Dialogs for "Add Activity" and "Feedback" remain unchanged) */}
//       <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
//         <DialogTitle>Add New Activity</DialogTitle>
//         <form onSubmit={handleSubmit}>
//           <DialogContent>
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
//               {error && <Alert severity="error">{error}</Alert>}
//               <TextField name="title" label="Activity Title" value={formData.title} onChange={handleInputChange} fullWidth required />
//               <FormControl fullWidth>
//                 <InputLabel id="category-select-label">Category</InputLabel>
//                 <Select labelId="category-select-label" name="category" value={formData.category} label="Category" onChange={handleInputChange}>
//                   <MenuItem value="Sports">Sports</MenuItem>
//                   <MenuItem value="IT">IT</MenuItem>
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
//     </div>
//   );
// };

// export default Activities;

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Plus, ChevronRight, MessageSquare, Download } from "lucide-react"; // Import Download icon
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
} from "@mui/material";
import { activityAPI } from "@/lib/api";
import ImageUpload from "@/app/components/ImageUpload";
import PdfUpload from "@/app/components/PDFUpload";

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

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All"); // State for filtering

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
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getAll();
      if (response.success) {
        const sortedActivities = response.data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date.split("T")[0]}T${a.time || "00:00"}`);
          const dateTimeB = new Date(`${b.date.split("T")[0]}T${b.time || "00:00"}`);
          return dateTimeB - dateTimeA;
        });
        setActivities(sortedActivities);
      }
    } catch (error) {
      console.error("Error loading activities:", error);
      setError("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  // --- Filter activities based on selectedCategory ---
  const filteredActivities = useMemo(() => {
    if (selectedCategory === "All") {
      return activities;
    }
    return activities.filter(activity => activity.category === selectedCategory);
  }, [activities, selectedCategory]);

  // (All other handler functions like handleDialogOpen, handleSubmit, etc. remain the same)
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
    setSubmitting(true);
    setError("");
    try {
      const activityData = {
        title: formData.title.trim(),
        imageUrl: uploadedImagePath || formData.imageUrl.trim() || "https://techterms.com/img/lg/pdf_109.png", // Changed to null to explicitly check later
        pdfUrl: uploadedPdfPath || formData.pdfUrl.trim() || "", // Changed to null
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

    return (
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
          onClick={() => router.push(`/${role}/activities/${activity.id}/prerequisites`)}
        >
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
              sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            />
          )}
        </div>
        <div className="p-4 text-center w-56">
          <h3 className="font-semibold text-gray-800">{activity.title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(activity.date).toLocaleDateString()} at{" "}
            {/* Use the new time formatting function */}
            <strong>{formatTime12Hour(activity.time)}</strong>
          </p>
          {activity.pdfUrl && ( // Conditionally render download button
            <Button
              size="small"
              startIcon={<Download size={16} />}
              onClick={handleDownloadPdf}
              sx={{ mt: 1, mr: 1, textTransform: 'none' }}
            >
              Download PDF
            </Button>
          )}
          {(role === "volunteer" || role === "expert") && (
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

  if (loading) {
    return (<div className="flex justify-center items-center min-h-screen"><CircularProgress /></div>);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-0">
          <h1 className="font-bold text-gray-800">All Activities</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
        {(role === "volunteer" || role === "expert" || role === "admin") && (
          <button
            onClick={handleDialogOpen}
            className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
          >
            <Plus size={18} />
            <span>Add Activity</span>
          </button>
        )}
      </div>

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

      {/* All Activities Section */}
      <div>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ pl: 1 }}>
              No activities found for the selected category.
            </Typography>
          )}
        </div>
      </div>

      {/* (Dialogs for "Add Activity" and "Feedback" remain unchanged) */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Activity</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField name="title" label="Activity Title" value={formData.title} onChange={handleInputChange} fullWidth required />
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select labelId="category-select-label" name="category" value={formData.category} label="Category" onChange={handleInputChange}>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
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
    </div>
  );
};

export default Activities;