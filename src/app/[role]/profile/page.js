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
import { Grid } from "@mui/material";
import { expertAPI, organisationAPI, programmeAPI, volunteerAPI, studentAPI, userAPI } from "@/lib/api";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const role = params.role; // 'student', 'volunteer', or 'expert'
  const { data: session, status } = useSession();

  // Initial form data structure, dynamic role assignment
  const initialFormData = {
    email: "",
    role: role, // Set role based on URL param
    name: "",
    age: "",
    dateOfBirth: "", // Added dateOfBirth
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
        setProgrammes(programmesData.data || programmesData || []);

        // --- Fetch current user's profile data ---
        if (session?.user?.id) { // Check if user ID exists before attempting to fetch
          let userResponse = await userAPI.getById(session.user.id);

          if (userResponse.success && userResponse.data) {
            const user = userResponse.data;
            const profileData = user.profile;
            setCurrentUserId(user.profile.id); // Set the current user ID for updates

            // Format dateOfBirth if it exists
            const formattedDateOfBirth = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "";

            switch (role) {
              case 'student':
                setFormData({
                  ...initialFormData,
                  age: user.age ? String(user.age) : "", // Age from user table
                  dateOfBirth: formattedDateOfBirth, // DateOfBirth from user table
                  name: user.name || profileData.name || "",
                  email: user.email || profileData.email || "",
                  volunteerAssigned: profileData.volunteerAssignedId || "",
                  programmesEnrolled: profileData.programmeEnrolledId || "",
                  organisation: profileData.organisationId || "",
                  skills: profileData.skills || "",
                  areaOfInterest: profileData.areaOfInterest || "",
                  readingCapacity: profileData.readingCapacity || "",
                  preferredLanguages: profileData.preferredLanguages || "",
                  fineMotorDevelopment: profileData.fineMotorDevelopment || "",
                  interactionCapacity: profileData.interactionCapacity || "",
                  onlineClassExperience: profileData.onlineClassExperience || "",
                  attentionSpan: profileData.attentionSpan || "",
                  triggeringFactors: profileData.triggeringFactors || "",
                  happyMoments: profileData.happyMoments || "",
                  disability: profileData.disability || "",
                });
                break;
              case 'volunteer':
                setFormData({
                  ...initialFormData,
                  age: user.age ? String(user.age) : "", // Age from user table
                  dateOfBirth: formattedDateOfBirth, // DateOfBirth from user table
                  name: user.name || profileData.name || "",
                  email: user.email || profileData.email || "",
                  expertAssigned: profileData.expertAssignedId || "",
                  programmesEnrolled: profileData.programmeEnrolledId || "",
                  organisation: profileData.organisationId || "",
                  contactNumber: profileData.contactNumber || "",
                  feedback: profileData.feedback || "",
                  educationalQualification: profileData.educationalQualification || "",
                  preferredLanguages: profileData.preferredLanguages || "",
                  experience: profileData.experience || "",
                  profession: profileData.profession || "",
                  whatMotivatesYou: profileData.whatMotivatesYou || "",
                });
                break;
              case 'expert':
                setFormData({
                  ...initialFormData,
                  age: user.age ? String(user.age) : "", // Age from user table
                  dateOfBirth: formattedDateOfBirth, // DateOfBirth from user table
                  name: user.name || profileData.name || "",
                  email: user.email || profileData.email || "",
                  programmesEnrolled: profileData.programmeEnrolledId || "",
                  organisation: profileData.organisationId || "",
                  feedback: profileData.feedback || "",
                  educationalQualification: profileData.educationalQualification || "",
                  profession: profileData.profession || "",
                });
                break;
              default:
                // Handle unknown roles or provide a default form state
                setFormData(initialFormData);
                console.warn(`Unhandled role: ${role}`);
                break;
            }
          } else {
            // This `else` handles cases where userResponse is not successful or data is missing
            setSnackbarMessage("Failed to load profile data.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.error("Failed to load profile data:", userResponse); // Log the full response for debugging
          }
        } else {
          // This `else` handles the case where session?.user?.id is missing
          setSnackbarMessage(`No user ID found in session to load profile for. Role: ${role}`);
          setSnackbarSeverity("info");
          setSnackbarOpen(true);
          // Consider what initial state formData should be in this case, maybe just initialFormData
          setFormData(initialFormData);
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
  }, [role, session?.user?.id]);

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
      console.log('Prepared data for submission:', preparedData);

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
                    disabled // Make age field non-editable
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    InputLabelProps={{ shrink: true }}
                    disabled // Make dateOfBirth field non-editable
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
                      'name',
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
                      'name',
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
                      'name',
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