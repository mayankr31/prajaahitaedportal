// src/app/[role]/activities/ApprovalActivitiesDialog.js
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
import { Close, Check, X, Download } from '@mui/icons-material';
import { activityAPI } from '@/lib/api'; // Adjust import path

export default function ApprovalActivitiesDialog({ open, onClose, pendingActivities, onApprovalStatusChange }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setRejectionMessage(''); // Clear message when selecting new activity
    setError(null);
  };

  const handleApprove = async () => {
    if (!selectedActivity) return;
    setLoadingAction(true);
    setError(null);
    try {
      const response = await activityAPI.approve(selectedActivity.id);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh activities
        setSelectedActivity(null); // Clear selected activity after action
      } else {
        setError(response.error || 'Failed to approve activity');
      }
    } catch (err) {
      console.error('Error approving activity:', err);
      setError('Failed to approve activity. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedActivity) return;
    if (!rejectionMessage.trim()) {
      setError('Rejection message is required.');
      return;
    }
    setLoadingAction(true);
    setError(null);
    try {
      const response = await activityAPI.reject(selectedActivity.id, rejectionMessage);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh activities
        setSelectedActivity(null); // Clear selected activity after action
        setRejectionMessage('');
      } else {
        setError(response.error || 'Failed to reject activity');
      }
    } catch (err) {
      console.error('Error rejecting activity:', err);
      setError('Failed to reject activity. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleClose = () => {
    setSelectedActivity(null);
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
        Review Activities for Approval
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Left Panel: List of Pending Activities */}
          <Box sx={{ width: '30%', borderRight: '1px solid #e0e0e0', pr: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Activities ({pendingActivities.length})
            </Typography>
            {pendingActivities.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pending activities for review.
              </Typography>
            ) : (
              <List>
                {pendingActivities.map((activity) => (
                  <ListItem
                    key={activity.id}
                    button="true"
                    onClick={() => handleActivitySelect(activity)}
                    selected={selectedActivity?.id === activity.id}
                    sx={{ mb: 1, borderRadius: '8px', '&.Mui-selected': { backgroundColor: '#e0f2f7' } }}
                  >
                    <ListItemText
                      primary={activity.title}
                      secondary={`Created by: ${activity.createdBy?.name || 'Unknown'} (${activity.createdBy?.role || 'N/A'})`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Right Panel: Activity Details and Actions */}
          <Box sx={{ flexGrow: 1, pl: 3 }}>
            {selectedActivity ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Activity Details
                </Typography>
                <Typography variant="body1">
                  <strong>Title:</strong> {selectedActivity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Date:</strong> {new Date(selectedActivity.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Time:</strong> {selectedActivity.time ? selectedActivity.time : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Category:</strong> {selectedActivity.category || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Created At:</strong> {new Date(selectedActivity.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Created By:</strong> {selectedActivity.createdBy?.name || 'Unknown'} ({selectedActivity.createdBy?.email || 'N/A'}) - {selectedActivity.createdBy?.role || 'N/A'}
                </Typography>
                {selectedActivity.imageUrl && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <img
                      src={selectedActivity.imageUrl}
                      alt={selectedActivity.title}
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                    />
                  </Box>
                )}
                {selectedActivity.pdfUrl && (
                  <Button
                    size="small"
                    startIcon={<Download size={16} />}
                    onClick={() => window.open(selectedActivity.pdfUrl, '_blank')}
                    sx={{ mt: 1, textTransform: 'none' }}
                  >
                    Download PDF
                  </Button>
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
                Select an activity from the left to review its details and take action.
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