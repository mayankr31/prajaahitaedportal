import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  programmeName,
  isDeleting = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={!isDeleting ? onClose : undefined}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle 
        id="delete-dialog-title"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'error.main'
        }}
      >
        <Warning />
        Delete Programme
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete the programme{' '}
          <Typography component="span" fontWeight="bold">
            "{programmeName}"
          </Typography>
          ?
        </DialogContentText>
        <DialogContentText sx={{ mt: 1, color: 'error.main' }}>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          disabled={isDeleting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          variant="contained"
          color="error"
          startIcon={
            isDeleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;