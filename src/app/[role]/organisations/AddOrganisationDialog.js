'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ImageUpload from '../../components/ImageUpload';
import { organisationAPI } from '@/lib/api'; // Adjust the import path as needed

export default function AddOrganisationDialog({ open, onClose, onOrganisationCreated }) {
  const [name, setName] = useState('');
  const [imagePath, setImagePath] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleImageUploadStart = () => {
    setIsUploading(true);
    setError(null);
  };

  const handleImageUploadComplete = (path, file) => {
    setImagePath(path);
    setIsUploading(false);
    setError(null);
  };

  const handleImageUploadError = (errorMessage) => {
    setError(errorMessage);
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError('Please enter an organisation name');
      return;
    }

    if (!imagePath) {
      setError('Please upload an image');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await organisationAPI.create({
        name: name.trim(),
        imageUrl: imagePath
      });

      if (response.success) {
        // Notify parent component that an organisation was created
        if (onOrganisationCreated) {
          onOrganisationCreated(response.data);
        }
        
        // Reset form and close dialog
        handleClose();
      } else {
        setError(response.error || 'Failed to create organisation');
      }
    } catch (error) {
      console.error('Error creating organisation:', error);
      setError('Failed to create organisation. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setName('');
    setImagePath(null);
    setError(null);
    setIsUploading(false);
    setIsCreating(false);
    onClose();
  };

  const canSubmit = name.trim() && imagePath && !isUploading && !isCreating;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Add Organisation
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Name Input */}
          <TextField
            label="Organisation Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isUploading || isCreating}
            placeholder="Enter organisation name"
          />

          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Organisation Image
            </Typography>
            
            <ImageUpload
              onFileSelect={handleImageUploadStart}
              onUploadComplete={handleImageUploadComplete}
              onError={handleImageUploadError}
              disabled={isUploading || isCreating}
              label="Click to select organisation image"
              description="PNG, JPG, GIF"
              maxSize={5}
            />
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={isUploading || isCreating}
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit}
        >
          {isCreating ? 'Creating...' : isUploading ? 'Uploading...' : 'Create Organisation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}