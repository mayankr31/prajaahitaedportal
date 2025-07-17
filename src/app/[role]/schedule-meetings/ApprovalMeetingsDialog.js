// src\app\[role]\schedule-meetings\ApprovalMeetingsDialog.js
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
import { meetingAPI } from '@/lib/api'; // Adjust import path to your meeting API

export default function ApprovalMeetingsDialog({ open, onClose, pendingMeetings, onApprovalStatusChange }) {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleMeetingSelect = (meeting) => {
    setSelectedMeeting(meeting);
    setRejectionMessage(''); // Clear message when selecting new meeting
    setError(null);
  };

  const handleApprove = async () => {
    if (!selectedMeeting) return;
    setLoadingAction(true);
    setError(null);
    try {
      const response = await meetingAPI.approve(selectedMeeting.id);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh meetings
        setSelectedMeeting(null); // Clear selected meeting after action
      } else {
        setError(response.error || 'Failed to approve meeting');
      }
    } catch (err) {
      console.error('Error approving meeting:', err);
      setError('Failed to approve meeting. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedMeeting) return;
    if (!rejectionMessage.trim()) {
      setError('Rejection message is required.');
      return;
    }
    setLoadingAction(true);
    setError(null);
    try {
      const response = await meetingAPI.reject(selectedMeeting.id, rejectionMessage);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh meetings
        setSelectedMeeting(null); // Clear selected meeting after action
        setRejectionMessage('');
      } else {
        setError(response.error || 'Failed to reject meeting');
      }
    } catch (err) {
      console.error('Error rejecting meeting:', err);
      setError('Failed to reject meeting. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleClose = () => {
    setSelectedMeeting(null);
    setRejectionMessage('');
    setError(null);
    setLoadingAction(false);
    onClose();
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
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
        Review Meetings for Approval
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Left Panel: List of Pending Meetings */}
          <Box sx={{ width: '30%', borderRight: '1px solid #e0e0e0', pr: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Meetings ({pendingMeetings.length})
            </Typography>
            {pendingMeetings.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pending meetings for review.
              </Typography>
            ) : (
              <List>
                {pendingMeetings.map((meeting) => (
                  <ListItem
                    key={meeting.id}
                    button
                    onClick={() => handleMeetingSelect(meeting)}
                    selected={selectedMeeting?.id === meeting.id}
                    sx={{ mb: 1, borderRadius: '8px', '&.Mui-selected': { backgroundColor: '#e0f2f7' } }}
                  >
                    <ListItemText
                      primary={meeting.title}
                      secondary={`Created by: ${meeting.createdBy?.name || 'Unknown'} (${meeting.createdBy?.role || 'N/A'})`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Right Panel: Meeting Details and Actions */}
          <Box sx={{ flexGrow: 1, pl: 3 }}>
            {selectedMeeting ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Meeting Details
                </Typography>
                <Typography variant="body1">
                  <strong>Title:</strong> {selectedMeeting.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Date:</strong> {formatDateTime(selectedMeeting.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Starts:</strong> {formatDateTime(selectedMeeting.startDateTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Ends:</strong> {formatDateTime(selectedMeeting.endDateTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Created By:</strong> {selectedMeeting.createdBy?.name || 'Unknown'} ({selectedMeeting.createdBy?.email || 'N/A'}) - {selectedMeeting.createdBy?.role || 'N/A'}
                </Typography>
                {selectedMeeting.location && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Location:</strong> {selectedMeeting.location}
                  </Typography>
                )}
                {selectedMeeting.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Description:</strong> {selectedMeeting.description}
                  </Typography>
                )}
                {selectedMeeting.participants && selectedMeeting.participants.length > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Participants:</strong> {selectedMeeting.participants.join(', ')}
                  </Typography>
                )}
                {selectedMeeting.videoCall && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Video Call:</strong> {selectedMeeting.videoCall}
                  </Typography>
                )}
                {selectedMeeting.videoCallLink && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Video Call Link:</strong> <a href={selectedMeeting.videoCallLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>{selectedMeeting.videoCallLink}</a>
                  </Typography>
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
                Select a meeting from the left to review its details and take action.
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
