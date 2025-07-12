// // //------------------------------------------------------------

// // // src/app/[role]/profile/page.jsx
// // 'use client';
// // import React, { useState, useEffect } from "react";
// // import { useRouter, useParams } from "next/navigation";
// // import {
// //   Button,
// //   TextField,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   Box,
// //   Typography,
// //   Paper,
// //   CircularProgress,
// //   Alert,
// //   Snackbar,
// //   Skeleton,
// //   Divider,
// //   OutlinedInput,
// // } from "@mui/material";
// // // import Grid from "@mui/material/Grid2"; // Updated import for Grid2
// // import {Grid} from "@mui/material";
// // import { expertAPI, organisationAPI, programmeAPI, volunteerAPI, studentAPI } from "@/lib/api";

// // const ProfilePage = () => {
// //   const router = useRouter();
// //   const params = useParams();
// //   const role = params.role; // 'student', 'volunteer', or 'expert'

// //   // Initial form data structure, dynamic role assignment
// //   const initialFormData = {
// //     email: "",
// //     role: role, // Set role based on URL param
// //     name: "",
// //     age: "",
// //     volunteerAssigned: "",
// //     expertAssigned: "",
// //     programmesEnrolled: "",
// //     organisation: "",
// //     skills: "",
// //     areaOfInterest: "",
// //     readingCapacity: "",
// //     preferredLanguages: "",
// //     fineMotorDevelopment: "",
// //     interactionCapacity: "",
// //     onlineClassExperience: "",
// //     attentionSpan: "",
// //     triggeringFactors: "",
// //     happyMoments: "",
// //     disability: "",
// //     feedback: "",
// //     contactNumber: "",
// //     educationalQualification: "",
// //     experience: "",
// //     profession: "",
// //     whatMotivatesYou: "",
// //   };

// //   const [formData, setFormData] = useState(initialFormData);
// //   const [loading, setLoading] = useState(true); // For initial data fetch
// //   const [submitting, setSubmitting] = useState(false); // For form submission
// //   const [currentUserId, setCurrentUserId] = useState(null); // Stores the ID of the user being edited

// //   // States for dropdown data
// //   const [volunteers, setVolunteers] = useState([]);
// //   const [experts, setExperts] = useState([]);
// //   const [programmes, setProgrammes] = useState([]);
// //   const [organisations, setOrganisations] = useState([]);

// //   // Snackbar for feedback
// //   const [snackbarOpen, setSnackbarOpen] = useState(false);
// //   const [snackbarMessage, setSnackbarMessage] = useState("");
// //   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

// //   // Fetch user data and dropdown options on component mount
// //   useEffect(() => {
// //     const fetchUserDataAndDropdowns = async () => {
// //       setLoading(true);
// //       try {
// //         // Fetch dropdown data first
// //         const [volunteersData, expertsData, programmesData, organisationsData] = await Promise.all([
// //           volunteerAPI.getAll(1, 100),
// //           expertAPI.getAll(1, 100),
// //           programmeAPI.getAll(),
// //           organisationAPI.getAll()
// //         ]);

// //         setVolunteers(volunteersData.data || volunteersData || []);
// //         setExperts(expertsData.data || expertsData || []);
// //         setOrganisations(organisationsData.data || organisationsData || []);

// //         const programmesWithNames = (programmesData.data || programmesData || []).map((programme, index) => {
// //           const programmeNames = [
// //             "Reading Comprehension", "Math Fundamentals", "Creative Writing",
// //             "Science Exploration", "Art Therapy", "Music Therapy",
// //             "Physical Education", "Life Skills", "Language Development", "Social Skills Training"
// //           ];
// //           return {
// //             ...programme,
// //             displayName: programmeNames[index % programmeNames.length]
// //           };
// //         });
// //         setProgrammes(programmesWithNames);

// //         // --- Fetch current user's profile data ---
// //         let userResponse;
// //         let userIdToFetch = null;

// //         switch (role) {
// //           case 'student':
// //             userResponse = await studentAPI.getAll(); // Get all students
// //             if (userResponse.success && userResponse.data.length > 0) {
// //               userIdToFetch = userResponse.data[0].id; // Use the first student's ID
// //             }
// //             break;
// //           case 'volunteer':
// //             userResponse = await volunteerAPI.getAll(); // Get all volunteers
// //             if (userResponse.success && userResponse.data.length > 0) {
// //               userIdToFetch = userResponse.data[0].id; // Use the first volunteer's ID
// //             }
// //             break;
// //           case 'expert':
// //             userResponse = await expertAPI.getAll(); // Get all experts
// //             if (userResponse.success && userResponse.data.length > 0) {
// //               userIdToFetch = userResponse.data[0].id; // Use the first expert's ID
// //             }
// //             break;
// //           default:
// //             console.warn("Invalid role for profile page:", role);
// //             setSnackbarMessage("Invalid role specified.");
// //             setSnackbarSeverity("error");
// //             setSnackbarOpen(true);
// //             setLoading(false);
// //             return;
// //         }

// //         if (userIdToFetch) {
// //           setCurrentUserId(userIdToFetch); // Set the ID for later updates
// //           let profileDataResponse;
// //           switch (role) {
// //             case 'student':
// //               profileDataResponse = await studentAPI.getById(userIdToFetch);
// //               break;
// //             case 'volunteer':
// //               profileDataResponse = await volunteerAPI.getById(userIdToFetch);
// //               break;
// //             case 'expert':
// //               profileDataResponse = await expertAPI.getById(userIdToFetch);
// //               break;
// //           }

// //           if (profileDataResponse.success && profileDataResponse.data) {
// //             const userData = profileDataResponse.data;
// //             // Populate form data, ensuring numbers are parsed correctly if needed
// //             setFormData({
// //               ...initialFormData, // Start with initial to ensure all fields are present
// //               ...userData,
// //               age: userData.age ? String(userData.age) : "", // Convert age back to string for TextField
// //               organisation: userData.organisationId || "",
// //               volunteerAssigned: userData.volunteerAssignedId || "",
// //               expertAssigned: userData.expertAssignedId || "",
// //               programmesEnrolled: userData.programmeEnrolledId || "",
// //               role: role, // Ensure role is correctly set from URL
// //             });
// //           } else {
// //             setSnackbarMessage("Failed to load profile data.");
// //             setSnackbarSeverity("error");
// //             setSnackbarOpen(true);
// //             console.error("Failed to load profile data:", profileDataResponse.error);
// //           }
// //         } else {
// //           setSnackbarMessage(`No ${role} found to load profile for.`);
// //           setSnackbarSeverity("info");
// //           setSnackbarOpen(true);
// //         }

// //       } catch (error) {
// //         console.error('Error fetching profile or dropdown data:', error);
// //         setSnackbarMessage("An error occurred while loading the profile.");
// //         setSnackbarSeverity("error");
// //         setSnackbarOpen(true);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUserDataAndDropdowns();
// //   }, [role]); // Re-fetch if role changes in URL

// //   const handleInputChange = (field, value) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: value,
// //     }));
// //   };

// //   const prepareDataForSubmission = (data) => {
// //     const baseData = {
// //       name: data.name,
// //       age: data.age ? parseInt(data.age, 10) : null, // Convert age to number or null
// //       email: data.email,
// //       organisationId: data.organisation || null,
// //     };

// //     switch (data.role) {
// //       case 'student':
// //         return {
// //           ...baseData,
// //           skills: data.skills || null,
// //           areaOfInterest: data.areaOfInterest || null,
// //           readingCapacity: data.readingCapacity || null,
// //           preferredLanguages: data.preferredLanguages || null,
// //           fineMotorDevelopment: data.fineMotorDevelopment || null,
// //           interactionCapacity: data.interactionCapacity || null,
// //           onlineClassExperience: data.onlineClassExperience || null,
// //           attentionSpan: data.attentionSpan || null,
// //           triggeringFactors: data.triggeringFactors || null,
// //           happyMoments: data.happyMoments || null,
// //           disability: data.disability || null,
// //           volunteerAssignedId: data.volunteerAssigned || null,
// //           programmeEnrolledId: data.programmesEnrolled || null,
// //         };

// //       case 'volunteer':
// //         return {
// //           ...baseData,
// //           contactNumber: data.contactNumber || null,
// //           educationalQualification: data.educationalQualification || null,
// //           preferredLanguages: data.preferredLanguages || null,
// //           experience: data.experience || null,
// //           profession: data.profession || null,
// //           whatMotivatesYou: data.whatMotivatesYou || null,
// //           feedback: data.feedback || null,
// //           programmeEnrolledId: data.programmesEnrolled || null,
// //           expertAssignedId: data.expertAssigned || null,
// //         };

// //       case 'expert':
// //         return {
// //           ...baseData,
// //           profession: data.profession || null,
// //           educationalQualification: data.educationalQualification || null,
// //           feedback: data.feedback || null,
// //           programmeEnrolledId: data.programmesEnrolled || null,
// //         };

// //       default:
// //         return baseData;
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (!currentUserId) {
// //       setSnackbarMessage("Cannot update: User ID not found.");
// //       setSnackbarSeverity("error");
// //       setSnackbarOpen(true);
// //       return;
// //     }

// //     setSubmitting(true);
// //     try {
// //       const preparedData = prepareDataForSubmission(formData);

// //       let response;
// //       switch (role) { // Use 'role' from URL params for update API call
// //         case 'student':
// //           response = await studentAPI.update(currentUserId, preparedData);
// //           break;
// //         case 'volunteer':
// //           response = await volunteerAPI.update(currentUserId, preparedData);
// //           break;
// //         case 'expert':
// //           response = await expertAPI.update(currentUserId, preparedData);
// //           break;
// //         default:
// //           throw new Error('Invalid role for update');
// //       }

// //       if (response.success) {
// //         console.log('Profile updated successfully:', response.data);
// //         setSnackbarMessage("Profile updated successfully!");
// //         setSnackbarSeverity("success");
// //         setSnackbarOpen(true);
// //         // Optionally, re-fetch data to ensure UI is up-to-date
// //         // fetchUserDataAndDropdowns(); // This would re-trigger the useEffect
// //       } else {
// //         console.error('Failed to update profile:', response.error);
// //         setSnackbarMessage(`Failed to update profile: ${response.error || 'Unknown error'}`);
// //         setSnackbarSeverity("error");
// //         setSnackbarOpen(true);
// //       }
// //     } catch (error) {
// //       console.error('Error updating profile:', error);
// //       setSnackbarMessage("An unexpected error occurred during update.");
// //       setSnackbarSeverity("error");
// //       setSnackbarOpen(true);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const renderDropdownField = (label, value, onChange, options, idKey = 'id', nameKey = 'name') => {
// //     // Check if options are an array before mapping
// //     const validOptions = Array.isArray(options) ? options : [];

// //     return (
// //       <FormControl fullWidth>
// //         <InputLabel>{label}</InputLabel>
// //         <Select
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           label={label}
// //           input={<OutlinedInput label={label} />} // Use OutlinedInput for better label positioning
// //         >
// //           {validOptions.length === 0 && !loading ? (
// //             <MenuItem disabled>No options available</MenuItem>
// //           ) : (
// //             validOptions.map((option) => (
// //               <MenuItem key={option[idKey]} value={option[idKey]}>
// //                 {option[nameKey]}
// //               </MenuItem>
// //             ))
// //           )}
// //         </Select>
// //       </FormControl>
// //     );
// //   };

// //   const getRoleColor = () => {
// //     switch (role) {
// //       case "student":
// //         return "#2196F3"; // Blue
// //       case "volunteer":
// //         return "#4CAF50"; // Green
// //       case "expert":
// //         return "#FF9800"; // Orange
// //       default:
// //         return "#607D8B"; // Grey for unknown role
// //     }
// //   };

// //   const handleSnackbarClose = (event, reason) => {
// //     if (reason === 'clickaway') {
// //       return;
// //     }
// //     setSnackbarOpen(false);
// //   };

// //   if (loading) {
// //     return (
// //       <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
// //         <Skeleton variant="rectangular" height={60} width="100%" />
// //         <Skeleton variant="rectangular" height={300} width="100%" />
// //         <Skeleton variant="rectangular" height={100} width="100%" />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box sx={{ p: 3, backgroundColor: "grey.50", minHeight: "100vh" }}>
// //       <Paper
// //         elevation={3}
// //         sx={{
// //           p: 4,
// //           borderRadius: 2,
// //           borderLeft: `8px solid ${getRoleColor()}`,
// //           maxWidth: '1200px',
// //           mx: 'auto',
// //           mb: 4
// //         }}
// //       >
// //         <Typography
// //           variant="h4"
// //           component="h1"
// //           gutterBottom
// //           sx={{ fontWeight: 700, color: getRoleColor(), mb: 3 }}
// //         >
// //           {role.charAt(0).toUpperCase() + role.slice(1)} Profile
// //         </Typography>
// //         <Divider sx={{ mb: 4 }} />

// //         <Grid container spacing={4}>
// //           {/* Basic Information Section */}
// //           <Grid size={12}>
// //             <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
// //               <Typography
// //                 variant="h6"
// //                 sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
// //               >
// //                 Basic Information
// //               </Typography>
// //               <Grid container spacing={3}>
// //                 <Grid size={{ xs: 12, sm: 6 }}>
// //                   <TextField
// //                     fullWidth
// //                     label="Full Name"
// //                     value={formData.name}
// //                     onChange={(e) => handleInputChange("name", e.target.value)}
// //                     required
// //                   />
// //                 </Grid>
// //                 <Grid size={{ xs: 12, sm: 6 }}>
// //                   <TextField
// //                     fullWidth
// //                     label="Email Address"
// //                     type="email"
// //                     value={formData.email}
// //                     onChange={(e) => handleInputChange("email", e.target.value)}
// //                     required
// //                   />
// //                 </Grid>
// //                 <Grid size={{ xs: 12, sm: 6 }}>
// //                   <TextField
// //                     fullWidth
// //                     label="Age"
// //                     type="number"
// //                     value={formData.age}
// //                     onChange={(e) => handleInputChange("age", e.target.value)}
// //                     required
// //                   />
// //                 </Grid>
// //                 <Grid size={{ xs: 12, sm: 6 }}>
// //                   {renderDropdownField(
// //                     "Organisation",
// //                     formData.organisation,
// //                     (value) => handleInputChange("organisation", value),
// //                     organisations
// //                   )}
// //                 </Grid>

// //                 {/* Assignment Fields (only if relevant) */}
// //                 {role === "student" && (
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     {renderDropdownField(
// //                       "Assigned Volunteer",
// //                       formData.volunteerAssigned,
// //                       (value) => handleInputChange("volunteerAssigned", value),
// //                       volunteers
// //                     )}
// //                   </Grid>
// //                 )}

// //                 {role === "volunteer" && (
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     {renderDropdownField(
// //                       "Assigned Expert",
// //                       formData.expertAssigned,
// //                       (value) => handleInputChange("expertAssigned", value),
// //                       experts
// //                     )}
// //                   </Grid>
// //                 )}

// //                 {role === "volunteer" && (
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Contact Number"
// //                       value={formData.contactNumber}
// //                       onChange={(e) =>
// //                         handleInputChange("contactNumber", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                 )}

// //                 <Grid size={{ xs: 12, sm: 6 }}>
// //                   {renderDropdownField(
// //                     "Enrolled Programmes",
// //                     formData.programmesEnrolled,
// //                     (value) => handleInputChange("programmesEnrolled", value),
// //                     programmes,
// //                     'id',
// //                     'displayName'
// //                   )}
// //                 </Grid>
// //               </Grid>
// //             </Paper>
// //           </Grid>

// //           {/* Role-specific sections */}
// //           {role === "student" && (
// //             <Grid size={12}>
// //               <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
// //                 <Typography
// //                   variant="h6"
// //                   sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
// //                 >
// //                   Additional Information
// //                 </Typography>
// //                 <Grid container spacing={3}>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Skills"
// //                       value={formData.skills}
// //                       onChange={(e) =>
// //                         handleInputChange("skills", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Area of Interest"
// //                       value={formData.areaOfInterest}
// //                       onChange={(e) =>
// //                         handleInputChange("areaOfInterest", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Reading Capacity"
// //                       value={formData.readingCapacity}
// //                       onChange={(e) =>
// //                         handleInputChange("readingCapacity", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Preferred Languages"
// //                       value={formData.preferredLanguages}
// //                       onChange={(e) =>
// //                         handleInputChange("preferredLanguages", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Fine Motor Development"
// //                       value={formData.fineMotorDevelopment}
// //                       onChange={(e) =>
// //                         handleInputChange(
// //                           "fineMotorDevelopment",
// //                           e.target.value
// //                         )
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Interaction Capacity"
// //                       value={formData.interactionCapacity}
// //                       onChange={(e) =>
// //                         handleInputChange("interactionCapacity", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Online Class Experience"
// //                       value={formData.onlineClassExperience}
// //                       onChange={(e) =>
// //                         handleInputChange(
// //                           "onlineClassExperience",
// //                           e.target.value
// //                         )
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Attention Span (In Minutes)"
// //                       value={formData.attentionSpan}
// //                       onChange={(e) =>
// //                         handleInputChange("attentionSpan", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Triggering Factors"
// //                       multiline
// //                       rows={2}
// //                       value={formData.triggeringFactors}
// //                       onChange={(e) =>
// //                         handleInputChange("triggeringFactors", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Happy Moments"
// //                       multiline
// //                       rows={2}
// //                       value={formData.happyMoments}
// //                       onChange={(e) =>
// //                         handleInputChange("happyMoments", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={12}>
// //                     <TextField
// //                       fullWidth
// //                       label="Disability (if any)"
// //                       value={formData.disability}
// //                       onChange={(e) =>
// //                         handleInputChange("disability", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                 </Grid>
// //               </Paper>
// //             </Grid>
// //           )}

// //           {role === "volunteer" && (
// //             <Grid size={12}>
// //               <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
// //                 <Typography
// //                   variant="h6"
// //                   sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
// //                 >
// //                   Additional Information
// //                 </Typography>
// //                 <Grid container spacing={3}>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Educational Qualification"
// //                       value={formData.educationalQualification}
// //                       onChange={(e) =>
// //                         handleInputChange(
// //                           "educationalQualification",
// //                           e.target.value
// //                         )
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Preferred Languages"
// //                       value={formData.preferredLanguages}
// //                       onChange={(e) =>
// //                         handleInputChange(
// //                           "preferredLanguages",
// //                           e.target.value
// //                         )
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Profession"
// //                       value={formData.profession}
// //                       onChange={(e) =>
// //                         handleInputChange("profession", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={12}>
// //                     <TextField
// //                       fullWidth
// //                       label="Relevant Experience"
// //                       multiline
// //                       rows={3}
// //                       value={formData.experience}
// //                       onChange={(e) =>
// //                         handleInputChange("experience", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={12}>
// //                     <TextField
// //                       fullWidth
// //                       label="What motivates you to apply?"
// //                       multiline
// //                       rows={3}
// //                       value={formData.whatMotivatesYou}
// //                       onChange={(e) =>
// //                         handleInputChange("whatMotivatesYou", e.target.value)
// //                       }
// //                       placeholder="Tell us about your motivation to volunteer..."
// //                     />
// //                   </Grid>
// //                   <Grid size={12}>
// //                     <TextField
// //                       fullWidth
// //                       label="Additional Feedback"
// //                       multiline
// //                       rows={3}
// //                       value={formData.feedback}
// //                       onChange={(e) =>
// //                         handleInputChange("feedback", e.target.value)
// //                       }
// //                       placeholder="Any additional information you'd like to share..."
// //                     />
// //                   </Grid>
// //                 </Grid>
// //               </Paper>
// //             </Grid>
// //           )}

// //           {role === "expert" && (
// //             <Grid size={12}>
// //               <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
// //                 <Typography
// //                   variant="h6"
// //                   sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
// //                 >
// //                   Professional Information
// //                 </Typography>
// //                 <Grid container spacing={3}>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Profession"
// //                       value={formData.profession}
// //                       onChange={(e) =>
// //                         handleInputChange("profession", e.target.value)
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={{ xs: 12, sm: 6 }}>
// //                     <TextField
// //                       fullWidth
// //                       label="Educational Qualification"
// //                       value={formData.educationalQualification}
// //                       onChange={(e) =>
// //                         handleInputChange(
// //                           "educationalQualification",
// //                           e.target.value
// //                         )
// //                       }
// //                     />
// //                   </Grid>
// //                   <Grid size={12}>
// //                     <TextField
// //                       fullWidth
// //                       label="Expert Feedback & Insights"
// //                       multiline
// //                       rows={4}
// //                       value={formData.feedback}
// //                       onChange={(e) =>
// //                         handleInputChange("feedback", e.target.value)
// //                       }
// //                       placeholder="Share your expertise and insights..."
// //                     />
// //                   </Grid>
// //                 </Grid>
// //               </Paper>
// //             </Grid>
// //           )}

// //           <Grid size={12}>
// //             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
// //               <Button
// //                 onClick={handleSubmit}
// //                 variant="contained"
// //                 disabled={submitting || loading}
// //                 sx={{
// //                   minWidth: 150,
// //                   backgroundColor: getRoleColor(),
// //                   "&:hover": {
// //                     backgroundColor: getRoleColor(),
// //                     filter: "brightness(0.9)",
// //                   },
// //                 }}
// //               >
// //                 {submitting ? (
// //                   <CircularProgress size={24} color="inherit" />
// //                 ) : (
// //                   `Save ${role.charAt(0).toUpperCase() + role.slice(1)} Profile`
// //                 )}
// //               </Button>
// //             </Box>
// //           </Grid>
// //         </Grid>
// //       </Paper>

// //       <Snackbar
// //         open={snackbarOpen}
// //         autoHideDuration={6000}
// //         onClose={handleSnackbarClose}
// //         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //       >
// //         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
// //           {snackbarMessage}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default ProfilePage;

// // src/app/[role]/profile/page.jsx
// 'use client';
// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Box,
//   Typography,
//   Paper,
//   CircularProgress,
//   Alert,
//   Snackbar,
//   Skeleton,
//   Divider,
//   OutlinedInput,
// } from "@mui/material";
// // import Grid from "@mui/material/Grid2"; // Updated import for Grid2
// import {Grid} from "@mui/material";
// import { expertAPI, organisationAPI, programmeAPI, volunteerAPI, studentAPI } from "@/lib/api";

// const ProfilePage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const role = params.role; // 'student', 'volunteer', or 'expert'

//   // Initial form data structure, dynamic role assignment
//   const initialFormData = {
//     email: "",
//     role: role, // Set role based on URL param
//     name: "",
//     age: "",
//     volunteerAssigned: "",
//     expertAssigned: "",
//     programmesEnrolled: "",
//     organisation: "",
//     skills: "",
//     areaOfInterest: "",
//     readingCapacity: "",
//     preferredLanguages: "",
//     fineMotorDevelopment: "",
//     interactionCapacity: "",
//     onlineClassExperience: "",
//     attentionSpan: "",
//     triggeringFactors: "",
//     happyMoments: "",
//     disability: "",
//     feedback: "",
//     contactNumber: "",
//     educationalQualification: "",
//     experience: "",
//     profession: "",
//     whatMotivatesYou: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [loading, setLoading] = useState(true); // For initial data fetch
//   const [submitting, setSubmitting] = useState(false); // For form submission
//   const [currentUserId, setCurrentUserId] = useState(null); // Stores the ID of the user being edited

//   // States for dropdown data
//   const [volunteers, setVolunteers] = useState([]);
//   const [experts, setExperts] = useState([]);
//   const [programmes, setProgrammes] = useState([]);
//   const [organisations, setOrganisations] = useState([]);

//   // Snackbar for feedback
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   // Fetch user data and dropdown options on component mount
//   useEffect(() => {
//     const fetchUserDataAndDropdowns = async () => {
//       setLoading(true);
//       try {
//         // Fetch dropdown data first
//         const [volunteersData, expertsData, programmesData, organisationsData] = await Promise.all([
//           volunteerAPI.getAll(1, 100),
//           expertAPI.getAll(1, 100),
//           programmeAPI.getAll(),
//           organisationAPI.getAll()
//         ]);

//         setVolunteers(volunteersData.data || volunteersData || []);
//         setExperts(expertsData.data || expertsData || []);
//         setOrganisations(organisationsData.data || organisationsData || []);

//         const programmesWithNames = (programmesData.data || programmesData || []).map((programme, index) => {
//           const programmeNames = [
//             "Reading Comprehension", "Math Fundamentals", "Creative Writing",
//             "Science Exploration", "Art Therapy", "Music Therapy",
//             "Physical Education", "Life Skills", "Language Development", "Social Skills Training"
//           ];
//           return {
//             ...programme,
//             displayName: programmeNames[index % programmeNames.length]
//           };
//         });
//         setProgrammes(programmesWithNames);

//         // --- Fetch current user's profile data ---
//         let userResponse;
//         let userIdToFetch = null;

//         switch (role) {
//           case 'student':
//             userResponse = await studentAPI.getAll(); // Get all students
//             if (userResponse.success && userResponse.data.length > 0) {
//               userIdToFetch = userResponse.data[0].id; // Use the first student's ID
//             }
//             break;
//           case 'volunteer':
//             userResponse = await volunteerAPI.getAll(); // Get all volunteers
//             if (userResponse.success && userResponse.data.length > 0) {
//               userIdToFetch = userResponse.data[0].id; // Use the first volunteer's ID
//             }
//             break;
//           case 'expert':
//             userResponse = await expertAPI.getAll(); // Get all experts
//             if (userResponse.success && userResponse.data.length > 0) {
//               userIdToFetch = userResponse.data[0].id; // Use the first expert's ID
//             }
//             break;
//           default:
//             console.warn("Invalid role for profile page:", role);
//             setSnackbarMessage("Invalid role specified.");
//             setSnackbarSeverity("error");
//             setSnackbarOpen(true);
//             setLoading(false);
//             return;
//         }

//         if (userIdToFetch) {
//           setCurrentUserId(userIdToFetch); // Set the ID for later updates
//           let profileDataResponse;
//           switch (role) {
//             case 'student':
//               profileDataResponse = await studentAPI.getById(userIdToFetch);
//               break;
//             case 'volunteer':
//               profileDataResponse = await volunteerAPI.getById(userIdToFetch);
//               break;
//             case 'expert':
//               profileDataResponse = await expertAPI.getById(userIdToFetch);
//               break;
//           }

//           if (profileDataResponse.success && profileDataResponse.data) {
//             const userData = profileDataResponse.data;
//             // Populate form data, ensuring numbers are parsed correctly if needed
//             setFormData({
//               ...initialFormData, // Start with initial to ensure all fields are present
//               ...userData,
//               age: userData.age ? String(userData.age) : "", // Convert age back to string for TextField
//               organisation: userData.organisationId || "",
//               volunteerAssigned: userData.volunteerAssignedId || "",
//               expertAssigned: userData.expertAssignedId || "",
//               programmesEnrolled: userData.programmeEnrolledId || "",
//               role: role, // Ensure role is correctly set from URL
//             });
//           } else {
//             setSnackbarMessage("Failed to load profile data.");
//             setSnackbarSeverity("error");
//             setSnackbarOpen(true);
//             console.error("Failed to load profile data:", profileDataResponse.error);
//           }
//         } else {
//           setSnackbarMessage(`No ${role} found to load profile for.`);
//           setSnackbarSeverity("info");
//           setSnackbarOpen(true);
//         }

//       } catch (error) {
//         console.error('Error fetching profile or dropdown data:', error);
//         setSnackbarMessage("An error occurred while loading the profile.");
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDataAndDropdowns();
//   }, [role]); // Re-fetch if role changes in URL

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const prepareDataForSubmission = (data) => {
//     const baseData = {
//       name: data.name,
//       age: data.age ? parseInt(data.age, 10) : null, // Convert age to number or null
//       email: data.email,
//       organisationId: data.organisation || null,
//     };

//     switch (data.role) {
//       case 'student':
//         return {
//           ...baseData,
//           skills: data.skills || null,
//           areaOfInterest: data.areaOfInterest || null,
//           readingCapacity: data.readingCapacity || null,
//           preferredLanguages: data.preferredLanguages || null,
//           fineMotorDevelopment: data.fineMotorDevelopment || null,
//           interactionCapacity: data.interactionCapacity || null,
//           onlineClassExperience: data.onlineClassExperience || null,
//           attentionSpan: data.attentionSpan || null,
//           triggeringFactors: data.triggeringFactors || null,
//           happyMoments: data.happyMoments || null,
//           disability: data.disability || null,
//           volunteerAssignedId: data.volunteerAssigned || null,
//           programmeEnrolledId: data.programmesEnrolled || null,
//         };

//       case 'volunteer':
//         return {
//           ...baseData,
//           contactNumber: data.contactNumber || null,
//           educationalQualification: data.educationalQualification || null,
//           preferredLanguages: data.preferredLanguages || null,
//           experience: data.experience || null,
//           profession: data.profession || null,
//           whatMotivatesYou: data.whatMotivatesYou || null,
//           feedback: data.feedback || null,
//           programmeEnrolledId: data.programmesEnrolled || null,
//           expertAssignedId: data.expertAssigned || null,
//         };

//       case 'expert':
//         return {
//           ...baseData,
//           profession: data.profession || null,
//           educationalQualification: data.educationalQualification || null,
//           feedback: data.feedback || null,
//           programmeEnrolledId: data.programmesEnrolled || null,
//         };

//       default:
//         return baseData;
//     }
//   };

//   const handleSubmit = async () => {
//     if (!currentUserId) {
//       setSnackbarMessage("Cannot update: User ID not found.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const preparedData = prepareDataForSubmission(formData);

//       let response;
//       switch (role) { // Use 'role' from URL params for update API call
//         case 'student':
//           response = await studentAPI.update(currentUserId, preparedData);
//           break;
//         case 'volunteer':
//           response = await volunteerAPI.update(currentUserId, preparedData);
//           break;
//         case 'expert':
//           response = await expertAPI.update(currentUserId, preparedData);
//           break;
//         default:
//           throw new Error('Invalid role for update');
//       }

//       if (response.success) {
//         console.log('Profile updated successfully:', response.data);
//         setSnackbarMessage("Profile updated successfully!");
//         setSnackbarSeverity("success");
//         setSnackbarOpen(true);
//         // Optionally, re-fetch data to ensure UI is up-to-date
//         // fetchUserDataAndDropdowns(); // This would re-trigger the useEffect
//       } else {
//         console.error('Failed to update profile:', response.error);
//         setSnackbarMessage(`Failed to update profile: ${response.error || 'Unknown error'}`);
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setSnackbarMessage("An unexpected error occurred during update.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderDropdownField = (label, value, onChange, options, idKey = 'id', nameKey = 'name', disabled = false) => {
//     // Check if options are an array before mapping
//     const validOptions = Array.isArray(options) ? options : [];

//     return (
//       <FormControl fullWidth disabled={disabled}>
//         <InputLabel>{label}</InputLabel>
//         <Select
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           label={label}
//           input={<OutlinedInput label={label} />} // Use OutlinedInput for better label positioning
//           disabled={disabled}
//         >
//           {validOptions.length === 0 && !loading ? (
//             <MenuItem disabled>No options available</MenuItem>
//           ) : (
//             validOptions.map((option) => (
//               <MenuItem key={option[idKey]} value={option[idKey]}>
//                 {option[nameKey]}
//               </MenuItem>
//             ))
//           )}
//         </Select>
//       </FormControl>
//     );
//   };

//   const getRoleColor = () => {
//     switch (role) {
//       case "student":
//         return "#2196F3"; // Blue
//       case "volunteer":
//         return "#4CAF50"; // Green
//       case "expert":
//         return "#FF9800"; // Orange
//       default:
//         return "#607D8B"; // Grey for unknown role
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
//         <Skeleton variant="rectangular" height={60} width="100%" />
//         <Skeleton variant="rectangular" height={300} width="100%" />
//         <Skeleton variant="rectangular" height={100} width="100%" />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, backgroundColor: "grey.50", minHeight: "100vh" }}>
//       <Paper
//         elevation={3}
//         sx={{
//           p: 4,
//           borderRadius: 2,
//           borderLeft: `8px solid ${getRoleColor()}`,
//           maxWidth: '1200px',
//           mx: 'auto',
//           mb: 4
//         }}
//       >
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           sx={{ fontWeight: 700, color: getRoleColor(), mb: 3 }}
//         >
//           {role.charAt(0).toUpperCase() + role.slice(1)} Profile
//         </Typography>
//         <Divider sx={{ mb: 4 }} />

//         <Grid container spacing={4}>
//           {/* Basic Information Section */}
//           <Grid size={12}>
//             <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//               <Typography
//                 variant="h6"
//                 sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
//               >
//                 Basic Information
//               </Typography>
//               <Grid container spacing={3}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     label="Email Address"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <TextField
//                     fullWidth
//                     label="Age"
//                     type="number"
//                     value={formData.age}
//                     onChange={(e) => handleInputChange("age", e.target.value)}
//                     required
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   {renderDropdownField(
//                     "Organisation",
//                     formData.organisation,
//                     (value) => handleInputChange("organisation", value),
//                     organisations,
//                     'id',
//                     'name',
//                     role === 'volunteer' || role === 'expert' // Disable for volunteer and expert
//                   )}
//                 </Grid>

//                 {/* Assignment Fields (only if relevant) */}
//                 {role === "student" && (
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     {renderDropdownField(
//                       "Assigned Volunteer",
//                       formData.volunteerAssigned,
//                       (value) => handleInputChange("volunteerAssigned", value),
//                       volunteers
//                     )}
//                   </Grid>
//                 )}

//                 {role === "volunteer" && (
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     {renderDropdownField(
//                       "Assigned Expert",
//                       formData.expertAssigned,
//                       (value) => handleInputChange("expertAssigned", value),
//                       experts,
//                       'id',
//                       'name',
//                       true // Disable for volunteer
//                     )}
//                   </Grid>
//                 )}

//                 {role === "volunteer" && (
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <TextField
//                       fullWidth
//                       label="Contact Number"
//                       value={formData.contactNumber}
//                       onChange={(e) =>
//                         handleInputChange("contactNumber", e.target.value)
//                       }
//                     />
//                   </Grid>
//                 )}

//                 {role === "student" && (
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     {renderDropdownField(
//                       "Enrolled Programmes",
//                       formData.programmesEnrolled,
//                       (value) => handleInputChange("programmesEnrolled", value),
//                       programmes,
//                       'id',
//                       'displayName'
//                     )}
//                   </Grid>
//                 )}

//                 {role === "volunteer" && (
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     {renderDropdownField(
//                       "Enrolled Programmes",
//                       formData.programmesEnrolled,
//                       (value) => handleInputChange("programmesEnrolled", value),
//                       programmes,
//                       'id',
//                       'displayName',
//                       true // Disable for volunteer
//                     )}
//                   </Grid>
//                 )}

//                 {role === "expert" && (
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     {renderDropdownField(
//                       "Enrolled Programmes",
//                       formData.programmesEnrolled,
//                       (value) => handleInputChange("programmesEnrolled", value),
//                       programmes,
//                       'id',
//                       'displayName',
//                       true // Disable for expert
//                     )}
//                   </Grid>
//                 )}
//               </Grid>
//             </Paper>
//           </Grid>

//           {/* Role-specific sections - Hidden for students */}
//           {role === "volunteer" && (
//             <Grid size={12}>
//               <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//                 <Typography
//                   variant="h6"
//                   sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
//                 >
//                   Additional Information
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <TextField
//                       fullWidth
//                       label="Educational Qualification"
//                       value={formData.educationalQualification}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "educationalQualification",
//                           e.target.value
//                         )
//                       }
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <TextField
//                       fullWidth
//                       label="Preferred Languages"
//                       value={formData.preferredLanguages}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "preferredLanguages",
//                           e.target.value
//                         )
//                       }
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <TextField
//                       fullWidth
//                       label="Profession"
//                       value={formData.profession}
//                       onChange={(e) =>
//                         handleInputChange("profession", e.target.value)
//                       }
//                     />
//                   </Grid>
//                   <Grid size={12}>
//                     <TextField
//                       fullWidth
//                       label="Relevant Experience"
//                       multiline
//                       rows={3}
//                       value={formData.experience}
//                       onChange={(e) =>
//                         handleInputChange("experience", e.target.value)
//                       }
//                     />
//                   </Grid>
//                   <Grid size={12}>
//                     <TextField
//                       fullWidth
//                       label="What motivates you to apply?"
//                       multiline
//                       rows={3}
//                       value={formData.whatMotivatesYou}
//                       onChange={(e) =>
//                         handleInputChange("whatMotivatesYou", e.target.value)
//                       }
//                       placeholder="Tell us about your motivation to volunteer..."
//                     />
//                   </Grid>
//                   <Grid size={12}>
//                     <TextField
//                       fullWidth
//                       label="Additional Feedback"
//                       multiline
//                       rows={3}
//                       value={formData.feedback}
//                       onChange={(e) =>
//                         handleInputChange("feedback", e.target.value)
//                       }
//                       placeholder="Any additional information you'd like to share..."
//                     />
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>
//           )}

//           {role === "expert" && (
//             <Grid size={12}>
//               <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//                 <Typography
//                   variant="h6"
//                   sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
//                 >
//                   Professional Information
//                 </Typography>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <TextField
//                       fullWidth
//                       label="Profession"
//                       value={formData.profession}
//                       onChange={(e) =>
//                         handleInputChange("profession", e.target.value)
//                       }
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 12, sm: 6 }}>
//                     <TextField
//                       fullWidth
//                       label="Educational Qualification"
//                       value={formData.educationalQualification}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "educationalQualification",
//                           e.target.value
//                         )
//                       }
//                     />
//                   </Grid>
//                   <Grid size={12}>
//                     <TextField
//                       fullWidth
//                       label="Expert Feedback & Insights"
//                       multiline
//                       rows={4}
//                       value={formData.feedback}
//                       onChange={(e) =>
//                         handleInputChange("feedback", e.target.value)
//                       }
//                       placeholder="Share your expertise and insights..."
//                     />
//                   </Grid>
//                 </Grid>
//               </Paper>
//             </Grid>
//           )}

//           <Grid size={12}>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//               <Button
//                 onClick={handleSubmit}
//                 variant="contained"
//                 disabled={submitting || loading}
//                 sx={{
//                   minWidth: 150,
//                   backgroundColor: getRoleColor(),
//                   "&:hover": {
//                     backgroundColor: getRoleColor(),
//                     filter: "brightness(0.9)",
//                   },
//                 }}
//               >
//                 {submitting ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   `Save ${role.charAt(0).toUpperCase() + role.slice(1)} Profile`
//                 )}
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ProfilePage;

// src/app/[role]/profile/page.jsx
'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Skeleton,
  Divider,
  OutlinedInput,
} from "@mui/material";
// import Grid from "@mui/material/Grid2"; // Updated import for Grid2
import {Grid} from "@mui/material";
import { expertAPI, organisationAPI, programmeAPI, volunteerAPI, studentAPI } from "@/lib/api";

const ProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const role = params.role; // 'student', 'volunteer', or 'expert'

  // Initial form data structure, dynamic role assignment
  const initialFormData = {
    email: "",
    role: role, // Set role based on URL param
    name: "",
    age: "",
    volunteerAssigned: "",
    expertAssigned: "",
    programmesEnrolled: "",
    organisation: "",
    skills: "",
    areaOfInterest: "",
    readingCapacity: "",
    preferredLanguages: "",
    fineMotorDevelopment: "",
    interactionCapacity: "",
    onlineClassExperience: "",
    attentionSpan: "",
    triggeringFactors: "",
    happyMoments: "",
    disability: "",
    feedback: "",
    contactNumber: "",
    educationalQualification: "",
    experience: "",
    profession: "",
    whatMotivatesYou: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true); // For initial data fetch
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [currentUserId, setCurrentUserId] = useState(null); // Stores the ID of the user being edited

  // States for dropdown data
  const [volunteers, setVolunteers] = useState([]);
  const [experts, setExperts] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [organisations, setOrganisations] = useState([]);

  // Snackbar for feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch user data and dropdown options on component mount
  useEffect(() => {
    const fetchUserDataAndDropdowns = async () => {
      setLoading(true);
      try {
        // Fetch dropdown data first
        const [volunteersData, expertsData, programmesData, organisationsData] = await Promise.all([
          volunteerAPI.getAll(1, 100),
          expertAPI.getAll(1, 100),
          programmeAPI.getAll(),
          organisationAPI.getAll()
        ]);

        setVolunteers(volunteersData.data || volunteersData || []);
        setExperts(expertsData.data || expertsData || []);
        setOrganisations(organisationsData.data || organisationsData || []);

        const programmesWithNames = (programmesData.data || programmesData || []).map((programme, index) => {
          const programmeNames = [
            "Reading Comprehension", "Math Fundamentals", "Creative Writing",
            "Science Exploration", "Art Therapy", "Music Therapy",
            "Physical Education", "Life Skills", "Language Development", "Social Skills Training"
          ];
          return {
            ...programme,
            displayName: programmeNames[index % programmeNames.length]
          };
        });
        setProgrammes(programmesWithNames);

        // --- Fetch current user's profile data ---
        let userResponse;
        let userIdToFetch = null;

        switch (role) {
          case 'student':
            userResponse = await studentAPI.getAll(); // Get all students
            if (userResponse.success && userResponse.data.length > 0) {
              userIdToFetch = userResponse.data[0].id; // Use the first student's ID
            }
            break;
          case 'volunteer':
            userResponse = await volunteerAPI.getAll(); // Get all volunteers
            if (userResponse.success && userResponse.data.length > 0) {
              userIdToFetch = userResponse.data[0].id; // Use the first volunteer's ID
            }
            break;
          case 'expert':
            userResponse = await expertAPI.getAll(); // Get all experts
            if (userResponse.success && userResponse.data.length > 0) {
              userIdToFetch = userResponse.data[0].id; // Use the first expert's ID
            }
            break;
          default:
            console.warn("Invalid role for profile page:", role);
            setSnackbarMessage("Invalid role specified.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setLoading(false);
            return;
        }

        if (userIdToFetch) {
          setCurrentUserId(userIdToFetch); // Set the ID for later updates
          let profileDataResponse;
          switch (role) {
            case 'student':
              profileDataResponse = await studentAPI.getById(userIdToFetch);
              break;
            case 'volunteer':
              profileDataResponse = await volunteerAPI.getById(userIdToFetch);
              break;
            case 'expert':
              profileDataResponse = await expertAPI.getById(userIdToFetch);
              break;
          }

          if (profileDataResponse.success && profileDataResponse.data) {
            const userData = profileDataResponse.data;
            // Populate form data, ensuring numbers are parsed correctly if needed
            setFormData({
              ...initialFormData, // Start with initial to ensure all fields are present
              ...userData,
              age: userData.age ? String(userData.age) : "", // Convert age back to string for TextField
              organisation: userData.organisationId || "",
              volunteerAssigned: userData.volunteerAssignedId || "",
              expertAssigned: userData.expertAssignedId || "",
              programmesEnrolled: userData.programmeEnrolledId || "",
              role: role, // Ensure role is correctly set from URL
            });
          } else {
            setSnackbarMessage("Failed to load profile data.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Failed to load profile data:", profileDataResponse.error);
          }
        } else {
          setSnackbarMessage(`No ${role} found to load profile for.`);
          setSnackbarSeverity("info");
          setSnackbarOpen(true);
        }

      } catch (error) {
        console.error('Error fetching profile or dropdown data:', error);
        setSnackbarMessage("An error occurred while loading the profile.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndDropdowns();
  }, [role]); // Re-fetch if role changes in URL

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const prepareDataForSubmission = (data) => {
    const baseData = {
      name: data.name,
      age: data.age ? parseInt(data.age, 10) : null, // Convert age to number or null
      email: data.email,
      organisationId: data.organisation || null,
    };

    switch (data.role) {
      case 'student':
        return {
          ...baseData,
          skills: data.skills || null,
          areaOfInterest: data.areaOfInterest || null,
          readingCapacity: data.readingCapacity || null,
          preferredLanguages: data.preferredLanguages || null,
          fineMotorDevelopment: data.fineMotorDevelopment || null,
          interactionCapacity: data.interactionCapacity || null,
          onlineClassExperience: data.onlineClassExperience || null,
          attentionSpan: data.attentionSpan || null,
          triggeringFactors: data.triggeringFactors || null,
          happyMoments: data.happyMoments || null,
          disability: data.disability || null,
          volunteerAssignedId: data.volunteerAssigned || null,
          programmeEnrolledId: data.programmesEnrolled || null,
        };

      case 'volunteer':
        return {
          ...baseData,
          contactNumber: data.contactNumber || null,
          educationalQualification: data.educationalQualification || null,
          preferredLanguages: data.preferredLanguages || null,
          experience: data.experience || null,
          profession: data.profession || null,
          whatMotivatesYou: data.whatMotivatesYou || null,
          feedback: data.feedback || null,
          programmeEnrolledId: data.programmesEnrolled || null,
          expertAssignedId: data.expertAssigned || null,
        };

      case 'expert':
        return {
          ...baseData,
          profession: data.profession || null,
          educationalQualification: data.educationalQualification || null,
          feedback: data.feedback || null,
          programmeEnrolledId: data.programmesEnrolled || null,
        };

      default:
        return baseData;
    }
  };

  const handleSubmit = async () => {
    if (!currentUserId) {
      setSnackbarMessage("Cannot update: User ID not found.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const preparedData = prepareDataForSubmission(formData);

      let response;
      switch (role) { // Use 'role' from URL params for update API call
        case 'student':
          response = await studentAPI.update(currentUserId, preparedData);
          break;
        case 'volunteer':
          response = await volunteerAPI.update(currentUserId, preparedData);
          break;
        case 'expert':
          response = await expertAPI.update(currentUserId, preparedData);
          break;
        default:
          throw new Error('Invalid role for update');
      }

      if (response.success) {
        console.log('Profile updated successfully:', response.data);
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // Optionally, re-fetch data to ensure UI is up-to-date
        // fetchUserDataAndDropdowns(); // This would re-trigger the useEffect
      } else {
        console.error('Failed to update profile:', response.error);
        setSnackbarMessage(`Failed to update profile: ${response.error || 'Unknown error'}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage("An unexpected error occurred during update.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const renderDropdownField = (label, value, onChange, options, idKey = 'id', nameKey = 'name', disabled = false) => {
    // Check if options are an array before mapping
    const validOptions = Array.isArray(options) ? options : [];

    return (
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label={label}
          input={<OutlinedInput label={label} />} // Use OutlinedInput for better label positioning
          disabled={disabled}
        >
          {validOptions.length === 0 && !loading ? (
            <MenuItem disabled>No options available</MenuItem>
          ) : (
            validOptions.map((option) => (
              <MenuItem key={option[idKey]} value={option[idKey]}>
                {option[nameKey]}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    );
  };

  const getRoleColor = () => {
    switch (role) {
      case "student":
        return "#2196F3"; // Blue
      case "volunteer":
        return "#4CAF50"; // Green
      case "expert":
        return "#FF9800"; // Orange
      default:
        return "#607D8B"; // Grey for unknown role
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Skeleton variant="rectangular" height={60} width="100%" />
        <Skeleton variant="rectangular" height={300} width="100%" />
        <Skeleton variant="rectangular" height={100} width="100%" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "grey.50", minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          borderLeft: `8px solid ${getRoleColor()}`,
          maxWidth: '1200px',
          mx: 'auto',
          mb: 4
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: getRoleColor(), mb: 3 }}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)} Profile
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {/* Basic Information Section */}
          <Grid size={12}>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
              >
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    disabled={role === 'student'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={role === 'student'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    required
                    disabled={role === 'student'}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderDropdownField(
                    "Organisation",
                    formData.organisation,
                    (value) => handleInputChange("organisation", value),
                    organisations,
                    'id',
                    'name',
                    role === 'volunteer' || role === 'expert' || role === 'student' // Disable for volunteer, expert, and student
                  )}
                </Grid>

                {/* Assignment Fields (only if relevant) */}
                {role === "student" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderDropdownField(
                      "Assigned Volunteer",
                      formData.volunteerAssigned,
                      (value) => handleInputChange("volunteerAssigned", value),
                      volunteers,
                      'id',
                      'name',
                      true // Disable for student
                    )}
                  </Grid>
                )}

                {role === "volunteer" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderDropdownField(
                      "Assigned Expert",
                      formData.expertAssigned,
                      (value) => handleInputChange("expertAssigned", value),
                      experts,
                      'id',
                      'name',
                      true // Disable for volunteer
                    )}
                  </Grid>
                )}

                {role === "volunteer" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                    />
                  </Grid>
                )}

                {role === "student" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderDropdownField(
                      "Enrolled Programmes",
                      formData.programmesEnrolled,
                      (value) => handleInputChange("programmesEnrolled", value),
                      programmes,
                      'id',
                      'displayName',
                      true // Disable for student
                    )}
                  </Grid>
                )}

                {role === "volunteer" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderDropdownField(
                      "Enrolled Programmes",
                      formData.programmesEnrolled,
                      (value) => handleInputChange("programmesEnrolled", value),
                      programmes,
                      'id',
                      'displayName',
                      true // Disable for volunteer
                    )}
                  </Grid>
                )}

                {role === "expert" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {renderDropdownField(
                      "Enrolled Programmes",
                      formData.programmesEnrolled,
                      (value) => handleInputChange("programmesEnrolled", value),
                      programmes,
                      'id',
                      'displayName',
                      true // Disable for expert
                    )}
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Role-specific sections - Hidden for students */}
          {role === "volunteer" && (
            <Grid size={12}>
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
                >
                  Additional Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Educational Qualification"
                      value={formData.educationalQualification}
                      onChange={(e) =>
                        handleInputChange(
                          "educationalQualification",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Preferred Languages"
                      value={formData.preferredLanguages}
                      onChange={(e) =>
                        handleInputChange(
                          "preferredLanguages",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Profession"
                      value={formData.profession}
                      onChange={(e) =>
                        handleInputChange("profession", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Relevant Experience"
                      multiline
                      rows={3}
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="What motivates you to apply?"
                      multiline
                      rows={3}
                      value={formData.whatMotivatesYou}
                      onChange={(e) =>
                        handleInputChange("whatMotivatesYou", e.target.value)
                      }
                      placeholder="Tell us about your motivation to volunteer..."
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Additional Feedback"
                      multiline
                      rows={3}
                      value={formData.feedback}
                      onChange={(e) =>
                        handleInputChange("feedback", e.target.value)
                      }
                      placeholder="Any additional information you'd like to share..."
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {role === "expert" && (
            <Grid size={12}>
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
                >
                  Professional Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Profession"
                      value={formData.profession}
                      onChange={(e) =>
                        handleInputChange("profession", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Educational Qualification"
                      value={formData.educationalQualification}
                      onChange={(e) =>
                        handleInputChange(
                          "educationalQualification",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Expert Feedback & Insights"
                      multiline
                      rows={4}
                      value={formData.feedback}
                      onChange={(e) =>
                        handleInputChange("feedback", e.target.value)
                      }
                      placeholder="Share your expertise and insights..."
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}

          {role !== 'student' && (
            <Grid size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={submitting || loading}
                  sx={{
                    minWidth: 150,
                    backgroundColor: getRoleColor(),
                    "&:hover": {
                      backgroundColor: getRoleColor(),
                      filter: "brightness(0.9)",
                    },
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Save ${role.charAt(0).toUpperCase() + role.slice(1)} Profile`
                  )}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;