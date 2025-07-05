// // src\app\[role]\activities\[id]\prerequisites\page.js
// "use client";
// import React from "react";
// import { Plus, ChevronRight } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";

// const Prerequisites = () => {
//   const params = useParams();
//   const router = useRouter();
//   const role = params.role;

//   // You can customize prerequisites based on role if needed
//   const getPrerequisites = () => {
//     const basePrerequisites = [
//       {
//         id: 1,
//         name: "Sum-u-rays",
//         image: "/activities/sumurays.png",
//       },
//       // Add more prerequisites as needed
//     ];

//     switch (role) {
//       case "student":
//         return basePrerequisites;
//       case "volunteer":
//         return basePrerequisites;
//       case "expert":
//         return basePrerequisites;
//       default:
//         return basePrerequisites;
//     }
//   };

//   const prerequisites = getPrerequisites();

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-2">
//           <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//           <h1 className="font-bold text-gray-800">Pre- Requisites Available</h1>
//         </div>
//         <button
//           className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//         >
//           <Plus size={18} />
//           <span>Add Prerequisite</span>
//         </button>
//       </div>

//       {/* Prerequisites Grid - 3 cards per row */}
//       <div className="grid grid-cols-3 gap-8">
//         {prerequisites.map((prerequisite) => (
//           <div
//             key={prerequisite.id}
//             className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
//             // onClick={() => router.push(`/${role}/activities/prerequisites/${prerequisite.id}`)} // Uncomment if you want to navigate to individual prerequisite pages
//           >
//             <img
//               src={prerequisite.image}
//               alt={prerequisite.name}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Prerequisites;


// src\app\[role]\activities\[id]\prerequisites\page.js
"use client";
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress
} from "@mui/material";
import ImageUpload from "@/app/components/ImageUpload";
import { prerequisiteAPI } from "@/lib/api";

const Prerequisites = () => {
  const params = useParams();
  const router = useRouter();
  const role = params.role;
  const activityId = params.id;

  // State management
  const [prerequisites, setPrerequisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(null);

  // Fetch prerequisites on component mount
  useEffect(() => {
    fetchPrerequisites();
  }, [activityId]);

  const fetchPrerequisites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prerequisiteAPI.getAll(activityId);
      
      if (response.success) {
        setPrerequisites(response.data);
      } else {
        setError(response.error || 'Failed to fetch prerequisites');
      }
    } catch (err) {
      console.error('Error fetching prerequisites:', err);
      setError('Failed to load prerequisites');
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

  const handleUploadComplete = async (imagePath, file) => {
    try {
      setUploading(true);
      setUploadError(null);

      const prerequisiteData = {
        imageUrl: imagePath,
        activityId: activityId
      };

      const response = await prerequisiteAPI.create(prerequisiteData);

      if (response.success) {
        // Refresh the prerequisites list
        await fetchPrerequisites();
        
        // Close dialog
        handleDialogClose();
        
        // Optional: Show success message
        console.log('Prerequisite added successfully');
      } else {
        setUploadError(response.error || 'Failed to create prerequisite');
      }
    } catch (err) {
      console.error('Error creating prerequisite:', err);
      setUploadError('Failed to create prerequisite');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadError = (error) => {
    setUploadError(error);
  };

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
          <ChevronRight className="text-gray-800" size={20} />
          <h1 className="font-bold text-gray-800">Pre- Requisites Available</h1>
        </div>
        <button
          onClick={handleAddPrerequisite}
          className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
        >
          <Plus size={18} />
          <span>Add Prerequisite</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Prerequisites Grid - 3 cards per row */}
      <div className="grid grid-cols-3 gap-8">
        {prerequisites.map((prerequisite) => (
          <div
            key={prerequisite.id}
            className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
            // onClick={() => router.push(`/${role}/activities/prerequisites/${prerequisite.id}`)} // Uncomment if you want to navigate to individual prerequisite pages
          >
            <img
              src={prerequisite.imageUrl}
              alt={`Prerequisite ${prerequisite.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {prerequisites.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No prerequisites available</p>
          <p className="text-gray-400 text-sm mt-2">Click "Add Prerequisite" to get started</p>
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
          <Button 
            onClick={handleDialogClose} 
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            disabled={uploading}
            onClick={() => {
              // The upload happens automatically when file is selected
              // This button is just for UX, the actual upload is handled by ImageUpload component
            }}
          >
            {uploading ? 'Adding...' : 'Add Prerequisite'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Prerequisites;