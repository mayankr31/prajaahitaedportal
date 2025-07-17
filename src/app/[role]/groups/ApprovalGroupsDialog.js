// src/app/[role]/groups/ApprovalGroupsDialog.js
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
import { groupAPI } from '@/lib/api'; // Adjust import path

export default function ApprovalGroupsDialog({ open, onClose, pendingGroups, onApprovalStatusChange }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setRejectionMessage(''); // Clear message when selecting new group
    setError(null);
  };

  const handleApprove = async () => {
    if (!selectedGroup) return;
    setLoadingAction(true);
    setError(null);
    try {
      const response = await groupAPI.approve(selectedGroup.id);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh groups
        setSelectedGroup(null); // Clear selected group after action
      } else {
        setError(response.error || 'Failed to approve group');
      }
    } catch (err) {
      console.error('Error approving group:', err);
      setError('Failed to approve group. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedGroup) return;
    if (!rejectionMessage.trim()) {
      setError('Rejection message is required.');
      return;
    }
    setLoadingAction(true);
    setError(null);
    try {
      const response = await groupAPI.reject(selectedGroup.id, rejectionMessage);
      if (response.success) {
        onApprovalStatusChange(); // Notify parent to refresh groups
        setSelectedGroup(null); // Clear selected group after action
        setRejectionMessage('');
      } else {
        setError(response.error || 'Failed to reject group');
      }
    } catch (err) {
      console.error('Error rejecting group:', err);
      setError('Failed to reject group. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleClose = () => {
    setSelectedGroup(null);
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
        Review Groups for Approval
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Left Panel: List of Pending Groups */}
          <Box sx={{ width: '30%', borderRight: '1px solid #e0e0e0', pr: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Groups ({pendingGroups.length})
            </Typography>
            {pendingGroups.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pending groups for review.
              </Typography>
            ) : (
              <List>
                {pendingGroups.map((group) => (
                  <ListItem
                    key={group.id}
                    button
                    onClick={() => handleGroupSelect(group)}
                    selected={selectedGroup?.id === group.id}
                    sx={{ mb: 1, borderRadius: '8px', '&.Mui-selected': { backgroundColor: '#e0f2f7' } }}
                  >
                    <ListItemText
                      primary={group.name}
                      secondary={`Created by: ${group.createdBy?.name || 'Unknown'} (${group.createdBy?.role || 'N/A'})`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Right Panel: Group Details and Actions */}
          <Box sx={{ flexGrow: 1, pl: 3 }}>
            {selectedGroup ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Group Details
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedGroup.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Created At:</strong> {new Date(selectedGroup.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Created By:</strong> {selectedGroup.createdBy?.name || 'Unknown'} ({selectedGroup.createdBy?.email || 'N/A'}) - {selectedGroup.createdBy?.role || 'N/A'}
                </Typography>
                {selectedGroup.imageUrl && (
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <img
                      src={selectedGroup.imageUrl}
                      alt={selectedGroup.name}
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
                Select a group from the left to review its details and take action.
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