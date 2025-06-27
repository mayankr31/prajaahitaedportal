"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MemberFormDialog } from "./MemberFormDialog";

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  // const [selectedRole, setSelectedRole] = useState("");

  const tabs = [
    { id: "students", label: "Students", href: "/members/students" },
    { id: "volunteers", label: "Volunteers", href: "/members/volunteers" },
    { id: "experts", label: "Experts", href: "/members/experts" },
  ];

  const roles = ["Student", "Volunteer", "Expert"];

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission here
  //   console.log("Email:", email, "Role:", selectedRole);
  //   // Reset form and close dialog
  //   setEmail("");
  //   setSelectedRole("");
  //   setIsDialogOpen(false);
  // };

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
    alert(`${formData.role} added successfully!`);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    // setEmail("");
    // setSelectedRole("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-0">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-center space-x-8 mb-6">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative pb-1 text-sm font-bold transition-colors hover:text-gray-700 ${
                  pathname === tab.href ? "text-gray-800" : "text-gray-600"
                }`}
              >
                {tab.label}
                {pathname === tab.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-400"></div>
                )}
              </Link>
            ))}
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
          >
            <Plus size={18} />
            <span>Add Member</span>
          </button>
        </div>

        {/* Main Content */}
        <main>{children}</main>

        {/* Material-UI Dialog */}
        {/* <Dialog
          open={isDialogOpen}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              padding: 1
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#2F699A', 
            fontWeight: 600,
            fontSize: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2
          }}>
            Add Member
            <IconButton
              onClick={handleClose}
              sx={{ 
                color: '#9CA3AF',
                '&:hover': {
                  color: '#6B7280'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 500,
                    color: '#374151'
                  }}
                >
                  Email Id of Member
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Id"
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#2F699A',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2F699A',
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 500,
                    color: '#374151'
                  }}
                >
                  Role of the Member
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    displayEmpty
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2F699A',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2F699A',
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!email || !selectedRole}
                sx={{
                  backgroundColor: '#2F699A',
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#25547b',
                  },
                  '&:disabled': {
                    backgroundColor: '#D1D5DB',
                  },
                }}
              >
                Send Invite
              </Button>
            </DialogActions>
          </form>
        </Dialog> */}
        <MemberFormDialog open={isDialogOpen} onClose={handleClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}