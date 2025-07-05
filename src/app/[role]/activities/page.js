// // src/app/[role]/activities/page.js
// "use client";
// import React from "react";
// import { Plus, ChevronRight } from "lucide-react";
// import { useRouter, useParams } from "next/navigation";

// const Activities = () => {
//   const router = useRouter();
//   const params = useParams();
//   const role = params.role;

//   const yesterdayActivities = [
//     {
//       id: 1,
//       name: "Fingerprint Painting",
//       image: "/activities/fingerprintpainting.png",
//     },
//     {
//       id: 2,
//       name: "Talking art",
//       image: "/activities/talkingart.png",
//     },
//     {
//       id: 3,
//       name: "Color-ride",
//       image: "/activities/color-ride.png",
//     },
//   ];

//   const todayActivities = [
//     {
//       id: 4,
//       name: "Color-ride",
//       image: "/activities/color-ride.png",
//     },
//     {
//       id: 5,
//       name: "Fingerprint Painting",
//       image: "/activities/fingerprintpainting.png",
//     },
//   ];

//   const ActivityCard = ({ activity }) => (
//     <div className="flex flex-col items-center">
//       <div
//         className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
//         onClick={() => router.push(`/${role}/activities/prerequisites`)}
//       >
//         <img
//           src={activity.image}
//           alt={activity.name}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="p-6">
//         <h3 className="font-semibold text-center text-gray-800 mb-2">
//           {activity.name}
//         </h3>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-0">
//           <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//         </div>
//         <button
//           className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//         >
//           <Plus size={18} />
//           <span>Add Activity</span>
//         </button>
//       </div>

//       {/* Yesterday Section */}
//       <div className="mb-10">
//         <h2 className="text-sm font-semibold text-gray-800 mb-6">Yesterday</h2>
//         <div className="flex gap-8 overflow-x-auto pb-4">
//           {yesterdayActivities.map((activity) => (
//             <ActivityCard key={activity.id} activity={activity} />
//           ))}
//         </div>
//       </div>

//       {/* Today Section */}
//       <div>
//         <h2 className="text-sm font-semibold text-gray-800 mb-6">Today</h2>
//         <div className="flex gap-8 overflow-x-auto pb-4">
//           {todayActivities.map((activity) => (
//             <ActivityCard key={activity.id} activity={activity} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Activities;

"use client";
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight } from "lucide-react";
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
} from "@mui/material";
import { activityAPI } from "@/lib/api";
import ImageUpload from "@/app/components/ImageUpload";

const Activities = () => {
  const router = useRouter();
  const params = useParams();
  const role = params.role;
  
  const [activities, setActivities] = useState({
    today: [],
    yesterday: []
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState("");
  const [resetImageUpload, setResetImageUpload] = useState(0);

  // Load activities on component mount
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await activityAPI.getTodayYesterday();
      if (response.success) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const todayActivities = response.data.filter((activity) => {
          const activityDate = new Date(activity.date);
          return activityDate.toDateString() === today.toDateString();
        });
        
        const yesterdayActivities = response.data.filter((activity) => {
          const activityDate = new Date(activity.date);
          return activityDate.toDateString() === yesterday.toDateString();
        });
        
        setActivities({
          today: todayActivities,
          yesterday: yesterdayActivities
        });
      }
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setError("");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      title: "",
      imageUrl: "",
      date: new Date().toISOString().split('T')[0],
    });
    setError("");
    setUploadedImagePath("");
    setResetImageUpload(prev => prev + 1); // Trigger image upload reset
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload callbacks
  const handleImageUploadComplete = (imagePath, file) => {
    setUploadedImagePath(imagePath);
    setFormData(prev => ({
      ...prev,
      imageUrl: imagePath
    }));
    setError(""); // Clear any previous errors
  };

  const handleImageUploadError = (errorMessage) => {
    setError(errorMessage);
    setUploadedImagePath("");
    setFormData(prev => ({
      ...prev,
      imageUrl: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError("Activity title is required");
        setSubmitting(false);
        return;
      }

      // Prepare data for API
      const activityData = {
        title: formData.title.trim(),
        imageUrl: uploadedImagePath || formData.imageUrl.trim() || "/activities/default.png", // Use uploaded image or manual URL or default
        date: new Date(formData.date).toISOString(),
      };

      const response = await activityAPI.create(activityData);
      
      if (response.success) {
        // Refresh activities list
        await loadActivities();
        handleDialogClose();
        
        // Optional: Show success message
        console.log("Activity created successfully!");
      } else {
        setError(response.error || "Failed to create activity");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      setError("An error occurred while creating the activity");
    } finally {
      setSubmitting(false);
    }
  };

  const ActivityCard = ({ activity }) => (
    <div className="flex flex-col items-center">
      <div
        className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
        onClick={() => router.push(`/${role}/activities/${activity.id}/prerequisites`)}
      >
        <img
          src={activity.imageUrl || activity.image}
          alt={activity.title || activity.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-center text-gray-800 mb-2">
          {activity.title || activity.name}
        </h3>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-0">
          <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
        <button
          onClick={handleDialogOpen}
          className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
        >
          <Plus size={18} />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Yesterday Section */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-800 mb-6">Yesterday</h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {activities.yesterday.length > 0 ? (
            activities.yesterday.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No activities scheduled for yesterday
            </Typography>
          )}
        </div>
      </div>

      {/* Today Section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-6">Today</h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {activities.today.length > 0 ? (
            activities.today.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No activities scheduled for today
            </Typography>
          )}
        </div>
      </div>

      {/* Add Activity Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Activity</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <TextField
                name="title"
                label="Activity Title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
              />
              
              {/* Image Upload Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Activity Image
                </Typography>
                <ImageUpload
                  onUploadComplete={handleImageUploadComplete}
                  onError={handleImageUploadError}
                  disabled={submitting}
                  maxSize={5}
                  label="Choose Activity Image"
                  description="PNG, JPG, GIF up to 5MB"
                  resetTrigger={resetImageUpload}
                />
                {uploadedImagePath && (
                  <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                    ✓ Image uploaded successfully
                  </Typography>
                )}
              </Box>

              {/* Manual URL Input (Alternative) */}
              <TextField
                name="imageUrl"
                label="Or paste Image URL"
                value={formData.imageUrl}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="https://example.com/image.jpg"
                helperText="Optional - Use this if you want to paste an image URL instead of uploading"
                disabled={!!uploadedImagePath} // Disable if image is uploaded
              />
              
              <TextField
                name="date"
                label="Activity Date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDialogClose} 
              disabled={submitting}
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
              sx={{ 
                backgroundColor: '#2F699A',
                '&:hover': { backgroundColor: '#25547b' }
              }}
            >
              {submitting ? <CircularProgress size={20} /> : 'Add Activity'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Activities;