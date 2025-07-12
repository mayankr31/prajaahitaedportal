'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

export default function PdfUpload({
  onFileSelect,
  onUploadComplete,
  onError,
  disabled = false,
  maxSize = 10, // MB
  label = "Select PDF",
  description = "PDF",
  showFileName = true,
  resetTrigger = null // Prop to trigger reset from parent
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      const errorMsg = 'Please select a PDF file';
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
    formData.append('file', file); // Changed from 'image' to 'file' for more generic handling

    try {
      const response = await fetch('/api/upload', { // Ensure your API route can handle this
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
    // Also reset the file input value
    const input = document.getElementById('pdf-upload-input');
    if(input) {
        input.value = '';
    }
  };

  // Reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== null) {
      resetUpload();
    }
  }, [resetTrigger]);

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
            document.getElementById('pdf-upload-input').click();
          }
        }}
      >
        <input
          id="pdf-upload-input"
          type="file"
          accept="application/pdf"
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
            <PictureAsPdf sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />

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