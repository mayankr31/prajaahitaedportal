import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Typography,
  Chip,
  OutlinedInput,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export const MemberFormDialog = ({ open, onClose, onSubmit }) => {
  const initialFormData = {
    email: "",
    role: "student",
    name: "",
    age: "",
    volunteerAssigned: "",
    childrenAssigned: "",
    volunteersAssigned: "",
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

  // Mock data for dropdowns - replace with actual API data later
  const mockVolunteers = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
  ];

  const mockProgrammes = [
    "Reading Comprehension",
    "Math Fundamentals",
    "Creative Writing",
    "Science Exploration",
    "Art Therapy",
    "Music Therapy",
    "Physical Education",
    "Life Skills",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getDialogTitle = () => {
    switch (formData.role) {
      case "student":
        return "Add New Student";
      case "volunteer":
        return "Add New Volunteer";
      case "expert":
        return "Add New Expert";
      default:
        return "Add New Member";
    }
  };

  const getRoleColor = () => {
    switch (formData.role) {
      case "student":
        return "#2196F3";
      case "volunteer":
        return "#4CAF50";
      case "expert":
        return "#FF9800";
      default:
        return "#2196F3";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          background: `linear-gradient(135deg, ${getRoleColor()}15, ${getRoleColor()}05)`,
          borderBottom: `3px solid ${getRoleColor()}`,
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 600, color: getRoleColor() }}
        >
          {getDialogTitle()}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Basic Information Section */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
            >
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Member Type *</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    label="Member Type *"
                    required
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="volunteer">Volunteer</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
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
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Organisation"
                  value={formData.organisation}
                  onChange={(e) =>
                    handleInputChange("organisation", e.target.value)
                  }
                />
              </Grid>

              {/* Assignment Fields */}
              {formData.role === "student" && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Assigned Volunteer</InputLabel>
                    <Select
                      value={formData.volunteerAssigned}
                      onChange={(e) =>
                        handleInputChange("volunteerAssigned", e.target.value)
                      }
                      label="Assigned Volunteer"
                    >
                      {mockVolunteers.map((volunteer) => (
                        <MenuItem key={volunteer} value={volunteer}>
                          {volunteer}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {formData.role === "volunteer" && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Number of Children Assigned"
                    type="number"
                    value={formData.childrenAssigned}
                    onChange={(e) =>
                      handleInputChange("childrenAssigned", e.target.value)
                    }
                  />
                </Grid>
              )}

              {formData.role === "expert" && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Number of Volunteers Assigned"
                    type="number"
                    value={formData.volunteersAssigned}
                    onChange={(e) =>
                      handleInputChange("volunteersAssigned", e.target.value)
                    }
                  />
                </Grid>
              )}
            
            {formData.role === "volunteer" && (
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

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Select Programmes</InputLabel>
                  <Select
                    value={formData.programmesEnrolled}
                    onChange={(e) =>
                      handleInputChange("programmesEnrolled", e.target.value)
                    }
                    label="Select Programmes"
                  >
                    {mockProgrammes.map((programme) => (
                      <MenuItem key={programme} value={programme}>
                        {programme}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Role-specific sections */}
          {formData.role === "student" && (
            <>
              {/* Academic Information */}
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
                      label="Skills"
                      value={formData.skills}
                      onChange={(e) =>
                        handleInputChange("skills", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Area of Interest"
                      value={formData.areaOfInterest}
                      onChange={(e) =>
                        handleInputChange("areaOfInterest", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Reading Capacity"
                      value={formData.readingCapacity}
                      onChange={(e) =>
                        handleInputChange("readingCapacity", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Preferred Languages"
                      value={formData.preferredLanguages}
                      onChange={(e) =>
                        handleInputChange("preferredLanguages", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Fine Motor Development"
                      value={formData.fineMotorDevelopment}
                      onChange={(e) =>
                        handleInputChange(
                          "fineMotorDevelopment",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Interaction Capacity"
                      value={formData.interactionCapacity}
                      onChange={(e) =>
                        handleInputChange("interactionCapacity", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Online Class Experience"
                      value={formData.onlineClassExperience}
                      onChange={(e) =>
                        handleInputChange(
                          "onlineClassExperience",
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Attention Span (In Minutes)"
                      value={formData.attentionSpan}
                      onChange={(e) =>
                        handleInputChange("attentionSpan", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Triggering Factors"
                      multiline
                      rows={2}
                      value={formData.triggeringFactors}
                      onChange={(e) =>
                        handleInputChange("triggeringFactors", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Happy Moments"
                      multiline
                      rows={2}
                      value={formData.happyMoments}
                      onChange={(e) =>
                        handleInputChange("happyMoments", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Disability (if any)"
                      value={formData.disability}
                      onChange={(e) =>
                        handleInputChange("disability", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}

          {formData.role === "volunteer" && (
            <>
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
            </>
          )}

          {formData.role === "expert" && (
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
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          backgroundColor: "grey.50",
          borderTop: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ mr: 2, minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            minWidth: 150,
            backgroundColor: getRoleColor(),
            "&:hover": {
              backgroundColor: getRoleColor(),
              filter: "brightness(0.9)",
            },
          }}
        >
          Add {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
