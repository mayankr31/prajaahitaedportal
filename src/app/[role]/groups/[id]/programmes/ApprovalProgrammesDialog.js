'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close, Check, X } from '@mui/icons-material';
import { programmeAPI } from '@/lib/api'; // Adjust import path for programme API

export default function ApprovalProgrammesDialog({ open, onClose, pendingProgrammes, onApprovalStatusChange }) {
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleProgrammeSelect = (programme) => {
    setSelectedProgramme(programme);
    setRejectionMessage(''); // Clear message when selecting new programme
    setError(null);
  };

  const handleApprove = async () => {
    if (!selectedProgramme) return;
    setLoadingAction(true);
    setError(null);
    try {
      // Assuming programmeAPI has an approve method similar to groupAPI
      const response = await programmeAPI.approve(selectedProgramme.id);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh programmes
        setSelectedProgramme(null); // Clear selected programme after action
      } else {
        setError(response.error || 'Failed to approve programme');
      }
    } catch (err) {
      console.error('Error approving programme:', err);
      setError('Failed to approve programme. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProgramme) return;
    if (!rejectionMessage.trim()) {
      setError('Rejection message is required.');
      return;
    }
    setLoadingAction(true);
    setError(null);
    try {
      // Assuming programmeAPI has a reject method similar to groupAPI
      const response = await programmeAPI.reject(selectedProgramme.id, rejectionMessage);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh programmes
        setSelectedProgramme(null); // Clear selected programme after action
        setRejectionMessage('');
      } else {
        setError(response.error || 'Failed to reject programme');
      }
    } catch (err) {
      console.error('Error rejecting programme:', err);
      setError('Failed to reject programme. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleClose = () => {
    setSelectedProgramme(null);
    setRejectionMessage('');
    setError(null);
    setLoadingAction(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Review Programmes for Approval
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Left Panel: List of Pending Programmes */}
          <Box sx={{ width: '30%', borderRight: '1px solid #e0e0e0', pr: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Programmes ({pendingProgrammes.length})
            </Typography>
            {pendingProgrammes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pending programmes for review.
              </Typography>
            ) : (
              <List>
                {pendingProgrammes.map((programme) => (
                  <ListItem
                    key={programme.id}
                    button
                    onClick={() => handleProgrammeSelect(programme)}
                    selected={selectedProgramme?.id === programme.id}
                    sx={{ mb: 1, borderRadius: '8px', '&.Mui-selected': { backgroundColor: '#e0f2f7' } }}
                  >
                    <ListItemText
                      primary={programme.name}
                      secondary={`Created by: ${programme.createdBy?.name || 'Unknown'} (${programme.createdBy?.role || 'N/A'})`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Right Panel: Programme Details and Actions */}
          <Box sx={{ flexGrow: 1, pl: 3 }}>
            {selectedProgramme ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Programme Details
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedProgramme.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Created At:</strong> {new Date(selectedProgramme.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Created By:</strong> {selectedProgramme.createdBy?.name || 'Unknown'} ({selectedProgramme.createdBy?.email || 'N/A'}) - {selectedProgramme.createdBy?.role || 'N/A'}
                </Typography>
                {selectedProgramme.imageUrl && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <img
                      src={selectedProgramme.imageUrl}
                      alt={selectedProgramme.name}
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                    />
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Approval Actions
                </Typography>
                {error && (
                  <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <TextField
                  label="Rejection Message (required for rejection)"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  sx={{ mb: 2 }}
                  disabled={loadingAction}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : <Check />}
                    onClick={handleApprove}
                    disabled={loadingAction}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : <X />}
                    onClick={handleReject}
                    disabled={loadingAction}
                  >
                    Reject
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Select a programme from the left to review its details and take action.
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}