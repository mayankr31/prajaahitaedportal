import React, { useState } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { programmeAPI } from "@/lib/api";
import ImageUpload from "@/app/components/ImageUpload";

const AddProgrammeDialog = ({ 
  open, 
  onClose, 
  groupId, 
  onProgrammeCreated 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetImageUpload, setResetImageUpload] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    students: "",
    volunteers: "",
    specialEducators: "",
    imageUrl: "",
  });

  const handleClose = () => {
    onClose();
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
        if (onProgrammeCreated) {
          await onProgrammeCreated();
        }
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

  return (
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
  );
};

export default AddProgrammeDialog;