//src\app\components\ImageUpload.js
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

export default function ImageUpload({ 
  onFileSelect, 
  onUploadComplete, 
  onError,
  disabled = false,
  maxSize = 5, // MB
  label = "Select Image",
  description = "PNG, JPG, GIF",
  showFileName = true,
  resetTrigger = null // Add this prop to trigger reset from parent
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

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
    
    // Notify parent component about file selection
    onFileSelect?.(file);

    // Auto-upload the file
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Notify parent component about successful upload
        onUploadComplete?.(result.path, file);
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
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setError(null);
    setUploading(false);
  };

  // Reset when resetTrigger changes
  React.useEffect(() => {
    if (resetTrigger) {
      resetUpload();
    }
  }, [resetTrigger]);

  // Reset function can be called via prop if needed
  // If you need to reset from parent, pass a reset trigger via props

  return (
    <Box>
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          '&:hover': !disabled && !uploading ? {
            borderColor: '#1976d2',
            backgroundColor: '#f5f5f5'
          } : {}
        }}
        onClick={() => {
          if (!disabled && !uploading) {
            document.getElementById('image-upload-input').click();
          }
        }}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
        
        {uploading ? (
          <Box>
            <CircularProgress sx={{ mb: 1 }} />
            <Typography variant="body1" color="primary">
              Uploading...
            </Typography>
          </Box>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
            
            {selectedFile && showFileName ? (
              <Box>
                <Typography variant="body1" color="primary">
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {description} up to {maxSize}MB
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
