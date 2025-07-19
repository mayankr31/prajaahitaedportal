// "use client";

// import React, { useState, useEffect } from "react";
// import { Plus, ChevronRight } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Chip // Import Chip for status display
// } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import CloseIcon from "@mui/icons-material/Close";
// import { programmeAPI } from "@/lib/api"; // Ensure programmeAPI is configured
// import ImageUpload from "@/app/components/ImageUpload";
// import ApprovalProgrammesDialog from "./ApprovalProgrammesDialog"; // New: Import the approval dialog

// const Programmes = () => {
//   const params = useParams();
//   const router = useRouter();
//   const role = params.role; // Get role from URL params
//   const groupId = params.id; // Get group ID from URL params

//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [programmes, setProgrammes] = useState([]);
//   const [loadingProgrammes, setLoadingProgrammes] = useState(true);
//   const [resetImageUpload, setResetImageUpload] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     students: "",
//     volunteers: "",
//     specialEducators: "",
//     imageUrl: "",
//   });

//   // New state for approval dialog
//   const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
//   const [pendingProgrammes, setPendingProgrammes] = useState([]);

//   // Load programmes on component mount and when group ID changes
//   useEffect(() => {
//     loadProgrammes();
//   }, [groupId, role]); // Depend on role to refetch if role changes (though typically page reloads)

//   const loadProgrammes = async () => {
//     try {
//       setLoadingProgrammes(true);
//       const result = await programmeAPI.getAll(groupId); // API will now handle role-based filtering
//       if (result.success) {
//         // Separate pending programmes for admin/expert view
//         if (role === "admin" || role === "expert") {
//           setProgrammes(result.data); // Admins/Experts see all, filter pending for dialog
//           setPendingProgrammes(result.data.filter(p => p.approvalStatus === "PENDING"));
//         } else {
//           // Other roles (student, volunteer) see what the API returns based on their permissions
//           setProgrammes(result.data);
//           setPendingProgrammes([]); // No pending for other roles to review
//         }
//       } else {
//         console.error("Failed to load programmes:", result.error);
//         setProgrammes([]); // No static fallback, rely on actual data
//         setPendingProgrammes([]);
//       }
//     } catch (error) {
//       console.error("Error loading programmes:", error);
//       setProgrammes([]); // No static fallback, rely on actual data
//       setPendingProgrammes([]);
//     } finally {
//       setLoadingProgrammes(false);
//     }
//   };

//   const handleOpen = () => {
//     setOpen(true);
//     setError("");
//     setSuccess("");
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setFormData({
//       name: "",
//       students: "",
//       volunteers: "",
//       specialEducators: "",
//       imageUrl: "",
//     });
//     setError("");
//     setSuccess("");
//     setResetImageUpload(Date.now());
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageSelect = (file) => {
//     console.log("Image selected:", file.name);
//   };

//   const handleImageUploadComplete = (imagePath, file) => {
//     console.log("Image uploaded successfully:", imagePath);
//     setFormData((prev) => ({
//       ...prev,
//       imageUrl: imagePath,
//     }));
//   };

//   const handleImageUploadError = (errorMessage) => {
//     console.error("Image upload error:", errorMessage);
//     setError(`Image upload failed: ${errorMessage}`);
//   };

//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       setError("Programme name is required");
//       return false;
//     }
//     if (formData.name.trim().length < 3) {
//       setError("Programme name must be at least 3 characters long");
//       return false;
//     }

//     const students = parseInt(formData.students) || 0;
//     const volunteers = parseInt(formData.volunteers) || 0;
//     const specialEducators = parseInt(formData.specialEducators) || 0;

//     if (students < 0 || volunteers < 0 || specialEducators < 0) {
//       setError("Numbers cannot be negative");
//       return false;
//     }
//     if (students === 0 && volunteers === 0 && specialEducators === 0) {
//       setError("At least one field must be greater than 0");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const submitData = {
//         name: formData.name.trim(),
//         groupId,
//         students: parseInt(formData.students) || 0,
//         volunteers: parseInt(formData.volunteers) || 0,
//         specialEducators: parseInt(formData.specialEducators) || 0,
//         imageUrl: formData.imageUrl.trim() || null,
//       };

//       const result = await programmeAPI.create(submitData);

//       if (result.success) {
//         setSuccess("Programme created successfully!");
//         await loadProgrammes(); // Reload programmes to show the new one with its status
//         setTimeout(() => {
//           handleClose();
//         }, 1500);
//       } else {
//         setError(result.error || "Failed to create programme");
//       }
//     } catch (err) {
//       console.error("Error creating programme:", err);
//       setError("An error occurred while creating the programme");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProgrammeClick = (programmeId) => {
//     router.push(`/${role}/groups/${groupId}/programmes/${programmeId}`);
//   };

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
//         <div className="flex space-x-4"> {/* Added a div for buttons */}
//           {(role === "admin" || role === "expert") && pendingProgrammes.length > 0 && (
//             <button
//               onClick={() => setApprovalDialogOpen(true)}
//               className="flex items-center text-sm space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
//             >
//               <span>Review Programmes ({pendingProgrammes.length})</span>
//             </button>
//           )}
//           {(role === "volunteer" || role === "expert" || role === "admin") && (
//             <button
//               onClick={handleOpen}
//               className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//             >
//               <Plus size={18} />
//               <span>Add Programmes</span>
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
//         /* Programmes Grid - 3 cards per row */
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {programmes.length === 0 ? (
//             <Typography variant="h6" color="text.secondary" className="col-span-full text-center py-10">
//               No programmes found for this group.
//             </Typography>
//           ) : (
//             programmes.map((programme) => {
//               const totalMembers =
//                 programme.students +
//                 programme.volunteers +
//                 programme.specialEducators;

//               // Determine chip color based on approval status
//               let chipColor = "default";
//               let chipLabel = programme.approvalStatus;
//               if (programme.approvalStatus === "PENDING") {
//                 chipColor = "warning";
//               } else if (programme.approvalStatus === "APPROVED") {
//                 chipColor = "success";
//               } else if (programme.approvalStatus === "REJECTED") {
//                 chipColor = "error";
//               }

//               // Decide whether to show the card based on the role and approval status
//               const shouldShowCard =
//                 role === "admin" ||
//                 role === "expert" ||
//                 (role === "volunteer" && (programme.createdById === params.user?.id || programme.approvalStatus === "APPROVED")) || // Check createdById for volunteer's own items
//                 (role === "student" && programme.approvalStatus === "APPROVED");

//               if (!shouldShowCard) return null; // Don't render if not allowed

//               return (
//                 <div
//                   key={programme.id}
//                   className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative" // Added relative for positioning chip
//                 >
//                   {/* Approval Status Chip for Admins, Experts, and Volunteers (for their own) */}
//                   {(role === "admin" || role === "expert" || (role === "volunteer" && programme.createdById === params.user?.id)) && (
//                     <Chip
//                       label={chipLabel}
//                       color={chipColor}
//                       size="small"
//                       sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
//                     />
//                   )}

//                   {/* Programme Content */}
//                   <div className="px-6 py-10">
//                     {/* Programme Name */}
//                     <div className="text-center mb-6">
//                       <h2 className="font-bold text-lg text-gray-800 mb-2">
//                         {programme.name}
//                       </h2>
//                     </div>

//                     {/* Image and Info Side by Side */}
//                     <div className="flex items-center justify-center space-x-4 mb-6">
//                       {/* Programme Image in Circle */}
//                       <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <img
//                           src={
//                             programme.imageUrl ||
//                             "/api/placeholder/300/200"
//                           }
//                           alt={programme.name || "Programme"}
//                           className="w-12 h-12 object-cover rounded-full"
//                         />
//                       </div>

//                       {/* Programme Info */}
//                       <div className="flex-1">
//                         <div className="mb-3">
//                           <h3 className="font-semibold text-gray-800 text-sm mb-1">
//                             Total Members : {totalMembers}
//                           </h3>
//                         </div>

//                         <div className="space-y-1 text-xs text-gray-600">
//                           <div>Students : {programme.students}</div>
//                           <div>Volunteers : {programme.volunteers}</div>
//                           <div>
//                             Special Educators : {programme.specialEducators}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* See Details Button */}
//                     <button
//                       onClick={() => handleProgrammeClick(programme.id)}
//                       className="w-full bg-[#2F699A] text-sm text-white py-3 rounded-lg hover:bg-[#25547b] transition-colors font-medium"
//                     >
//                       See Details
//                     </button>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}

//       {/* Add Programme Dialog */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             minHeight: "500px",
//           },
//         }}
//       >
//         <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Box>
//               <Typography
//                 variant="h6"
//                 component="div"
//                 sx={{ fontWeight: 600, color: "#2F699A" }}
//               >
//                 Add New Programme
//               </Typography>
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{ mt: 0.5 }}
//               >
//                 Fill in the details to create a new programme for this group
//               </Typography>
//             </Box>
//             <IconButton
//               aria-label="close"
//               onClick={handleClose}
//               sx={{
//                 color: (theme) => theme.palette.grey[500],
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>

//         <form onSubmit={handleSubmit}>
//           <DialogContent sx={{ py: 2, px: 3 }}>
//             {error && (
//               <Alert severity="error" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//             )}

//             {success && (
//               <Alert severity="success" sx={{ mb: 3 }}>
//                 {success}
//               </Alert>
//             )}

//             <Grid container spacing={3}>
//               <Grid item size={{xs:12}}> {/* Use item for Grid */}
//                 <TextField
//                   name="name"
//                   label="Programme Name"
//                   fullWidth
//                   required
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   variant="outlined"
//                   size="medium"
//                   helperText="Enter the programme name (e.g., Creative Arts Program)"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&.Mui-focused fieldset": {
//                         borderColor: "#2F699A",
//                       },
//                     },
//                     "& .MuiInputLabel-root.Mui-focused": {
//                       color: "#2F699A",
//                     },
//                   }}
//                 />
//               </Grid>

//               <Grid item size={{xs:12, sm:6}}> {/* Use item for Grid */}
//                 <TextField
//                   name="students"
//                   label="Number of Students"
//                   type="number"
//                   fullWidth
//                   value={formData.students}
//                   onChange={handleInputChange}
//                   inputProps={{ min: 0 }}
//                   variant="outlined"
//                   size="medium"
//                   helperText="Enter the number of students"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&.Mui-focused fieldset": {
//                         borderColor: "#2F699A",
//                       },
//                     },
//                     "& .MuiInputLabel-root.Mui-focused": {
//                       color: "#2F699A",
//                     },
//                   }}
//                 />
//               </Grid>

//               <Grid item size={{xs:12, sm:6}}> {/* Use item for Grid */}
//                 <TextField
//                   name="volunteers"
//                   label="Number of Volunteers"
//                   type="number"
//                   fullWidth
//                   value={formData.volunteers}
//                   onChange={handleInputChange}
//                   inputProps={{ min: 0 }}
//                   variant="outlined"
//                   size="medium"
//                   helperText="Enter the number of volunteers"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&.Mui-focused fieldset": {
//                         borderColor: "#2F699A",
//                       },
//                     },
//                     "& .MuiInputLabel-root.Mui-focused": {
//                       color: "#2F699A",
//                     },
//                   }}
//                 />
//               </Grid>

//               <Grid item size={{xs:12}}> {/* Use item for Grid */}
//                 <TextField
//                   name="specialEducators"
//                   label="Special Educators"
//                   type="number"
//                   fullWidth
//                   value={formData.specialEducators}
//                   onChange={handleInputChange}
//                   inputProps={{ min: 0 }}
//                   variant="outlined"
//                   size="medium"
//                   helperText="Enter the number of special educators"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       "&.Mui-focused fieldset": {
//                         borderColor: "#2F699A",
//                       },
//                     },
//                     "& .MuiInputLabel-root.Mui-focused": {
//                       color: "#2F699A",
//                     },
//                   }}
//                 />
//               </Grid>

//               <Grid item size={{xs:12}}> {/* Use item for Grid */}
//                 <Box>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mb: 1, fontWeight: 500 }}
//                   >
//                     Programme Image (Optional)
//                   </Typography>
//                   <ImageUpload
//                     onFileSelect={handleImageSelect}
//                     onUploadComplete={handleImageUploadComplete}
//                     onError={handleImageUploadError}
//                     disabled={loading}
//                     maxSize={5}
//                     label="Select Programme Image"
//                     description="PNG, JPG, GIF up to 5MB"
//                     showFileName={true}
//                     resetTrigger={resetImageUpload}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </DialogContent>

//           <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
//             <Button
//               onClick={handleClose}
//               disabled={loading}
//               sx={{
//                 color: "text.secondary",
//                 textTransform: "none",
//                 fontWeight: 500,
//                 "&:hover": {
//                   backgroundColor: "rgba(0, 0, 0, 0.04)",
//                 },
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               disabled={loading}
//               sx={{
//                 backgroundColor: "#2F699A",
//                 textTransform: "none",
//                 fontWeight: 600,
//                 px: 3,
//                 "&:hover": {
//                   backgroundColor: "#25547b",
//                 },
//                 "&:disabled": {
//                   backgroundColor: "rgba(47, 105, 154, 0.6)",
//                 },
//                 minWidth: "120px",
//               }}
//             >
//               {loading ? (
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <CircularProgress size={16} color="inherit" />
//                   Creating...
//                 </Box>
//               ) : (
//                 "Create Programme"
//               )}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Approval Programmes Dialog */}
//       {(role === "admin" || role === "expert") && (
//         <ApprovalProgrammesDialog
//           open={approvalDialogOpen}
//           onClose={() => setApprovalDialogOpen(false)}
//           pendingProgrammes={pendingProgrammes}
//           onApprovalStatusChange={loadProgrammes} // Reload programmes after approval/rejection
//         />
//       )}
//     </div>
//   );
// };

// export default Programmes;

"use client";

import React, { useState, useEffect } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip, // Added for rejection message tooltip
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { Info } from "@mui/icons-material"; // Added for rejection message icon
import { programmeAPI } from "@/lib/api";
import { useSession } from "next-auth/react"; // Added for session access
import ImageUpload from "@/app/components/ImageUpload";
import ApprovalProgrammesDialog from "./ApprovalProgrammesDialog";

const Programmes = () => {
  const params = useParams();
  const router = useRouter();
  const role = params.role;
  const groupId = params.id;
  const { data: session } = useSession(); // Added session hook

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [programmes, setProgrammes] = useState([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(true);
  const [resetImageUpload, setResetImageUpload] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    students: "",
    volunteers: "",
    specialEducators: "",
    imageUrl: "",
  });

  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

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

  const handleOpen = () => {
    setOpen(true);
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      students: "",
      volunteers: "",
      specialEducators: "",
      imageUrl: "",
    });
    setError("");
    setSuccess("");
    setResetImageUpload(Date.now());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (file) => {
    console.log("Image selected:", file.name);
  };

  const handleImageUploadComplete = (imagePath, file) => {
    console.log("Image uploaded successfully:", imagePath);
    setFormData((prev) => ({
      ...prev,
      imageUrl: imagePath,
    }));
  };

  const handleImageUploadError = (errorMessage) => {
    console.error("Image upload error:", errorMessage);
    setError(`Image upload failed: ${errorMessage}`);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Programme name is required");
      return false;
    }
    if (formData.name.trim().length < 3) {
      setError("Programme name must be at least 3 characters long");
      return false;
    }

    const students = parseInt(formData.students) || 0;
    const volunteers = parseInt(formData.volunteers) || 0;
    const specialEducators = parseInt(formData.specialEducators) || 0;

    if (students < 0 || volunteers < 0 || specialEducators < 0) {
      setError("Numbers cannot be negative");
      return false;
    }
    if (students === 0 && volunteers === 0 && specialEducators === 0) {
      setError("At least one field must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submitData = {
        name: formData.name.trim(),
        groupId,
        students: parseInt(formData.students) || 0,
        volunteers: parseInt(formData.volunteers) || 0,
        specialEducators: parseInt(formData.specialEducators) || 0,
        imageUrl: formData.imageUrl.trim() || null,
      };

      const result = await programmeAPI.create(submitData);

      if (result.success) {
        setSuccess("Programme created successfully!");
        await loadProgrammes();
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(result.error || "Failed to create programme");
      }
    } catch (err) {
      console.error("Error creating programme:", err);
      setError("An error occurred while creating the programme");
    } finally {
      setLoading(false);
    }
  };

  const handleProgrammeClick = (programme) => {
    if (programme.approvalStatus === "APPROVED") {
      router.push(`/${role}/groups/${groupId}/programmes/${programme.id}`);
    }
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

  const renderProgrammeCard = (programme) => {
    const totalMembers =
      programme.students + programme.volunteers + programme.specialEducators;

    return (
      <div
        key={programme.id}
        className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative ${
          programme.approvalStatus === "APPROVED" ? "cursor-pointer" : ""
        }`}
        // onClick={() => handleProgrammeClick(programme)}
      >
        {/* Approval Status Overlay */}
        {session?.user?.role !== "student" && programme.approvalStatus !== "APPROVED" && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold
              ${
                programme.approvalStatus === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
              }`}
          >
            {programme.approvalStatus}
          </div>
        )}

        {/* Rejection Message Tooltip for Volunteers */}
        {programme.approvalStatus === "REJECTED" &&
          session?.user?.role === "volunteer" &&
          programme.createdById === session.user.id &&
          programme.rejectionMessage && (
            <Tooltip title={`Reason: ${programme.rejectionMessage}`} arrow>
              <IconButton
                size="small"
                className="absolute top-1 left-80 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
              >
                <Info size={18} className="text-red-500" />
              </IconButton>
            </Tooltip>
          )}

        {/* Programme Content */}
        <div className="px-6 py-8">
          {/* Programme Name */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-lg text-gray-800 mb-2">
              {programme.name}
            </h2>
            {/* Display created by info for volunteers (their own pending/rejected) */}
            {session?.user?.role === "volunteer" &&
              programme.createdById === session.user.id &&
              programme.approvalStatus !== "APPROVED" && (
                <p className="text-xs text-gray-500">
                  Created by: {programme.createdBy?.name || "You"}
                </p>
              )}
          </div>

          {/* Image and Info Side by Side */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Programme Image in Circle */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <img
                src={programme.imageUrl || "/api/placeholder/300/200"}
                alt={programme.name || "Programme"}
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>

            {/* Programme Info */}
            <div className="flex-1">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  Total Members : {totalMembers}
                </h3>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div>Students : {programme.students}</div>
                <div>Volunteers : {programme.volunteers}</div>
                <div>Special Educators : {programme.specialEducators}</div>
              </div>
            </div>
          </div>

          {/* See Details Button */}
          <button
            // onClick={(e) => {
            //   e.stopPropagation();
            //   handleProgrammeClick(programme);
            // }}
            className={`w-full text-sm py-3 rounded-lg font-medium transition-colors ${
              programme.approvalStatus === "APPROVED"
                ? "bg-[#2F699A] text-white hover:bg-[#25547b]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={programme.approvalStatus !== "APPROVED"}
          >
            See Details
          </button>
        </div>
      </div>
    );
  };

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
              onClick={handleOpen}
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

      {/* Add Programme Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: "500px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 600, color: "#2F699A" }}
              >
                Add New Programme
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Fill in the details to create a new programme for this group
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ py: 2, px: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item size={{ xs: 12 }}>
                <TextField
                  name="name"
                  label="Programme Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="medium"
                  helperText="Enter the programme name (e.g., Creative Arts Program)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#2F699A",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2F699A",
                    },
                  }}
                />
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="students"
                  label="Number of Students"
                  type="number"
                  fullWidth
                  value={formData.students}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  size="medium"
                  helperText="Enter the number of students"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#2F699A",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2F699A",
                    },
                  }}
                />
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="volunteers"
                  label="Number of Volunteers"
                  type="number"
                  fullWidth
                  value={formData.volunteers}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  size="medium"
                  helperText="Enter the number of volunteers"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#2F699A",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2F699A",
                    },
                  }}
                />
              </Grid>

              <Grid item size={{ xs: 12 }}>
                <TextField
                  name="specialEducators"
                  label="Special Educators"
                  type="number"
                  fullWidth
                  value={formData.specialEducators}
                  onChange={handleInputChange}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  size="medium"
                  helperText="Enter the number of special educators"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#2F699A",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2F699A",
                    },
                  }}
                />
              </Grid>

              <Grid item size={{ xs: 12 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    Programme Image (Optional)
                  </Typography>
                  <ImageUpload
                    onFileSelect={handleImageSelect}
                    onUploadComplete={handleImageUploadComplete}
                    onError={handleImageUploadError}
                    disabled={loading}
                    maxSize={5}
                    label="Select Programme Image"
                    description="PNG, JPG, GIF up to 5MB"
                    showFileName={true}
                    resetTrigger={resetImageUpload}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#2F699A",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  backgroundColor: "#25547b",
                },
                "&:disabled": {
                  backgroundColor: "rgba(47, 105, 154, 0.6)",
                },
                minWidth: "120px",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Creating...
                </Box>
              ) : (
                "Create Programme"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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