// import React from "react";
// import { Plus, ChevronRight } from "lucide-react";

// const Programmes = () => {
//   const programmesData = [
//     {
//       id: 1,
//       name: "Creative Arts Program",
//       totalMembers: 220,
//       students: 150,
//       volunteers: 50,
//       specialEducators: 20,
//       image: "/api/placeholder/300/200", // Replace with your image path
//       color: "bg-blue-100"
//     },
//     {
//       id: 2,
//       name: "Arts & Crafts Workshop",
//       totalMembers: 220,
//       students: 150,
//       volunteers: 50,
//       specialEducators: 20,
//       image: "/api/placeholder/300/200", // Replace with your image path
//       color: "bg-green-100"
//     },
//     {
//       id: 3,
//       name: "Digital Learning Hub",
//       totalMembers: 220,
//       students: 150,
//       volunteers: 50,
//       specialEducators: 20,
//       image: "/api/placeholder/300/200", // Replace with your image path
//       color: "bg-purple-100"
//     },
//     {
//       id: 4,
//       name: "Reading & Literature",
//       totalMembers: 220,
//       students: 150,
//       volunteers: 50,
//       specialEducators: 20,
//       image: "/api/placeholder/300/200", // Replace with your image path
//       color: "bg-orange-100"
//     },
//     {
//       id: 5,
//       name: "Science & Discovery",
//       totalMembers: 220,
//       students: 150,
//       volunteers: 50,
//       specialEducators: 20,
//       image: "/api/placeholder/300/200", // Replace with your image path
//       color: "bg-teal-100"
//     },
//     {
//       id: 6,
//       name: "Music & Performance",
//       totalMembers: 220,
//       students: 150,
//       volunteers: 50,
//       specialEducators: 20,
//       image: "/api/placeholder/300/200", // Replace with your image path
//       color: "bg-pink-100"
//     }
//   ];

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-2">
//           <h1 className="font-bold text-gray-800">Groups</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//           <h1 className="font-bold text-gray-800">All Programmes</h1>
//         </div>
//         <button className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors">
//           <Plus size={18} />
//           <span>Add Programmes</span>
//         </button>
//       </div>

//       {/* Programmes Grid - 3 cards per row */}
//       <div className="grid grid-cols-3 gap-8">
//         {programmesData.map((programme) => (
//           <div key={programme.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
//             {/* Programme Content */}
//             <div className="px-6 py-10">
//               {/* Image and Info Side by Side */}
//               <div className="flex items-center justify-center space-x-4 mb-6">
//                 {/* Programme Image in Circle */}
//                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <img
//                     src={programme.image}
//                     alt={programme.name}
//                     className="w-12 h-12 object-cover rounded-full"
//                   />
//                 </div>
                
//                 {/* Programme Info */}
//                 <div className="flex-1">
//                   <div className="mb-3">
//                     <h3 className="font-semibold text-gray-800 text-sm mb-1">
//                       Total Members : {programme.totalMembers}
//                     </h3>
//                   </div>
                  
//                   <div className="space-y-1 text-xs text-gray-600">
//                     <div>Students : {programme.students}</div>
//                     <div>Volunteers : {programme.volunteers}</div>
//                     <div>Special Educators : {programme.specialEducators}</div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* See Details Button */}
//               <button className="w-full bg-[#2F699A] text-sm text-white py-3 rounded-lg hover:bg-[#25547b] transition-colors font-medium">
//                 See Details
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Programmes;

"use client";

import React, { useState, useEffect } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
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
  IconButton
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from '@mui/icons-material/Close';
import { programmeAPI } from "@/lib/api";
import ImageUpload from "@/app/components/ImageUpload"; // Adjust path as needed

const Programmes = () => {
  const params = useParams();
  const groupId = params.id; // Get group ID from URL params
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [programmes, setProgrammes] = useState([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(true);
  const [resetImageUpload, setResetImageUpload] = useState(null);
  const [formData, setFormData] = useState({
    students: "",
    volunteers: "",
    specialEducators: "",
    imageUrl: ""
  });

  // Static data as fallback (you can remove this once API is working)
  const staticProgrammesData = [
    {
      id: 1,
      name: "Creative Arts Program",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200",
      color: "bg-blue-100"
    },
    {
      id: 2,
      name: "Arts & Crafts Workshop",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200",
      color: "bg-green-100"
    },
    {
      id: 3,
      name: "Digital Learning Hub",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200",
      color: "bg-purple-100"
    },
    {
      id: 4,
      name: "Reading & Literature",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200",
      color: "bg-orange-100"
    },
    {
      id: 5,
      name: "Science & Discovery",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200",
      color: "bg-teal-100"
    },
    {
      id: 6,
      name: "Music & Performance",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200",
      color: "bg-pink-100"
    }
  ];

  // Load programmes on component mount
  useEffect(() => {
    loadProgrammes();
  }, [groupId]);

  const loadProgrammes = async () => {
    try {
      setLoadingProgrammes(true);
      const result = await programmeAPI.getAll(groupId);
      if (result.success) {
        setProgrammes(result.data);
      } else {
        console.error("Failed to load programmes:", result.error);
        // Use static data as fallback
        setProgrammes(staticProgrammesData);
      }
    } catch (error) {
      console.error("Error loading programmes:", error);
      // Use static data as fallback
      setProgrammes(staticProgrammesData);
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
      students: "",
      volunteers: "",
      specialEducators: "",
      imageUrl: ""
    });
    setError("");
    setSuccess("");
    // Trigger image upload reset
    setResetImageUpload(Date.now());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload callbacks
  const handleImageSelect = (file) => {
    console.log("Image selected:", file.name);
  };

  const handleImageUploadComplete = (imagePath, file) => {
    console.log("Image uploaded successfully:", imagePath);
    setFormData(prev => ({
      ...prev,
      imageUrl: imagePath
    }));
  };

  const handleImageUploadError = (errorMessage) => {
    console.error("Image upload error:", errorMessage);
    setError(`Image upload failed: ${errorMessage}`);
  };

  const validateForm = () => {
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
        groupId,
        students: parseInt(formData.students) || 0,
        volunteers: parseInt(formData.volunteers) || 0,
        specialEducators: parseInt(formData.specialEducators) || 0,
        imageUrl: formData.imageUrl.trim() || null
      };

      const result = await programmeAPI.create(submitData);

      if (result.success) {
        setSuccess("Programme created successfully!");
        // Reload programmes to show the new one
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

  const displayProgrammes = programmes.length > 0 ? programmes : staticProgrammesData;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-gray-800">Groups</h1>
          <ChevronRight className="text-gray-800" size={20} />
          <h1 className="font-bold text-gray-800">All Programmes</h1>
        </div>
        <button 
          onClick={handleOpen}
          className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
        >
          <Plus size={18} />
          <span>Add Programmes</span>
        </button>
      </div>

      {/* Loading State */}
      {loadingProgrammes ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress size={40} sx={{ color: '#2F699A' }} />
        </div>
      ) : (
        /* Programmes Grid - 3 cards per row */
        <div className="grid grid-cols-3 gap-8">
          {displayProgrammes.map((programme) => {
            const totalMembers = programme.totalMembers || 
              (programme.students + programme.volunteers + programme.specialEducators);
            
            return (
              <div key={programme.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Programme Content */}
                <div className="px-6 py-10">
                  {/* Image and Info Side by Side */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    {/* Programme Image in Circle */}
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <img
                        src={programme.image || programme.imageUrl || "/api/placeholder/300/200"}
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
                  <button className="w-full bg-[#2F699A] text-sm text-white py-3 rounded-lg hover:bg-[#25547b] transition-colors font-medium">
                    See Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
            minHeight: '500px'
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#2F699A' }}>
                Add New Programme
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
              <Grid size={{ xs: 12, sm: 6 }}>
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
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2F699A',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2F699A',
                    },
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
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
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2F699A',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2F699A',
                    },
                  }}
                />
              </Grid>
              
              <Grid size={12}>
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
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2F699A',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2F699A',
                    },
                  }}
                />
              </Grid>
              
              {/* Replace Image URL field with ImageUpload component */}
              <Grid size={12}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
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
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                backgroundColor: '#2F699A',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: '#25547b'
                },
                '&:disabled': {
                  backgroundColor: 'rgba(47, 105, 154, 0.6)'
                },
                minWidth: '120px'
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Creating...
                </Box>
              ) : (
                'Create Programme'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Programmes;