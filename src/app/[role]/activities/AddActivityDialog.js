// src/app/components/AddActivityDialog.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { activityAPI } from "@/lib/api";
import ImageUpload from "@/app/components/ImageUpload";
import PdfUpload from "@/app/components/PDFUpload";

const AddActivityDialog = ({ open, onClose, onActivityAdded }) => {
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

  const handleDialogClose = () => {
    onClose();
    setError("");
    setSubmitting(false);
    setFormData({
      title: "", 
      imageUrl: "", 
      pdfUrl: "",
      date: new Date().toISOString().split("T")[0], 
      time: "", 
      category: "",
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
        onActivityAdded(); // Callback to reload activities
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

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Activity</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField 
              name="title" 
              label="Activity Title" 
              value={formData.title} 
              onChange={handleInputChange} 
              fullWidth 
              required 
            />
            <FormControl fullWidth required>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select 
                labelId="category-select-label" 
                name="category" 
                value={formData.category} 
                label="Category" 
                onChange={handleInputChange}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                {/* Add more categories as needed */}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField 
                name="date" 
                label="Activity Date" 
                type="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                fullWidth 
                required 
                InputLabelProps={{ shrink: true }} 
              />
              <TextField 
                name="time" 
                label="Activity Time" 
                type="time" 
                value={formData.time} 
                onChange={handleInputChange} 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
              />
            </Box>
            <ImageUpload 
              onUploadComplete={handleImageUploadComplete} 
              onError={handleImageUploadError} 
              disabled={submitting} 
              resetTrigger={resetImageUpload} 
            />
            <PdfUpload 
              onUploadComplete={handlePdfUploadComplete} 
              onError={handlePdfUploadError} 
              disabled={submitting} 
              label="Upload PDF (Optional)" 
              resetTrigger={resetPdfUpload} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={submitting}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={submitting} 
            sx={{ backgroundColor: "#2F699A", "&:hover": { backgroundColor: "#25547b" } }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Add Activity"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddActivityDialog;