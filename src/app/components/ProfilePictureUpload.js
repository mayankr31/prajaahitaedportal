// src/app/components/ProfilePictureUpload.js
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material'; // Keeping for potential future visual cues, though not directly used for the button icon

export default function ProfilePictureUpload({
  onUploadComplete,
  onError,
  disabled = false,
  maxSize = 5, // MB
  buttonText = "Upload Profile Picture", // Default text
  resetTrigger = null // Add this prop to trigger reset from parent
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref for the hidden file input

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      const errorMsg = `File size must be less than ${maxSize}MB`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Auto-upload the file
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Assuming '/api/upload' is the endpoint for image uploads
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onUploadComplete?.(result.path, file); // Notify parent about successful upload
      } else {
        const errorMsg = result.error || 'Upload failed';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = 'Upload failed. Please try again.';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setUploading(false);
      // Clear the file input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setError(null);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== null) { // Check for non-null to allow 0 to trigger
      resetUpload();
    }
  }, [resetTrigger]);

  const handleButtonClick = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input
    }
  };

  return (
    <Box>
      {/* Hidden file input */}
      <input
        id="profile-picture-upload-input" // Unique ID for this input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
        ref={fileInputRef}
      />

      {/* The visible button */}
      <Button
        variant="outlined"
        onClick={handleButtonClick}
        disabled={disabled || uploading}
        sx={{
          mt: 2,
          borderRadius: 2,
          textTransform: 'none',
          padding: '8px 16px',
          fontSize: '0.9rem',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          }
        }}
      >
        {uploading ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Uploading...
          </Box>
        ) : (
          buttonText
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
