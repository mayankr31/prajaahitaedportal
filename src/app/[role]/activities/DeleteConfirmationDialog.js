// DeleteConfirmationDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  activityTitle, 
  isDeleting 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        color: '#dc2626'
      }}>
        <AlertTriangle size={24} />
        Delete Activity
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete the activity{' '}
          <strong>"{activityTitle}"</strong>?
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          This action cannot be undone. The activity will be permanently removed 
          from the system.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ padding: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={isDeleting}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        
        <Button 
          onClick={onConfirm} 
          disabled={isDeleting}
          variant="contained"
          color="error"
          sx={{ minWidth: 100 }}
          startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;