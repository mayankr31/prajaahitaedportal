"use client";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';

import React, { useState, useEffect } from "react";
import {
  userAPI,
  volunteerAPI,
  programmeAPI,
  organisationAPI,
  expertAPI,
} from "@/lib/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useParams } from "next/navigation";

const VolunteerCard = ({
  volunteer,
  onVolunteerClick,
  onEditClick,
  onFeedbackClick,
  onAssignedStudentsClick,
  onDelete,
  role,
}) => {
  const volunteerProfile = volunteer.profile;

  console.log("volunteer role:", role);

  // State to store fetched names
  const [expertName, setExpertName] = useState("-");
  const [programmeName, setProgrammeName] = useState("-");
  const [organisationName, setOrganisationName] = useState("-");
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${
          volunteerProfile?.name || volunteer.name || volunteer.email
        }?`
      )
    ) {
      try {
        await userAPI.delete(volunteer.id);
        onDelete(volunteer.id);
      } catch (error) {
        console.error("Error deleting volunteer:", error);
        alert("Failed to delete volunteer");
      }
    }
  };

  useEffect(() => {
      const fetchNames = async () => {
        setLoading(true);
        
        try {
          // Fetch volunteer name if volunteerAssignedId exists
          if (volunteerProfile?.expertAssignedId) {
            try {
              const expertResponse = await expertAPI.getById(volunteerProfile.expertAssignedId);
              if (expertResponse.success && expertResponse.data) {
                setExpertName(expertResponse.data.name || expertResponse.data.profile?.name || '-');
              }
            } catch (error) {
              console.error('Error fetching expert:', error);
            }
          }
  
          // Fetch programme name if programmeEnrolledId exists
          if (volunteerProfile?.programmeEnrolledId) {
            try {
              const programmeResponse = await programmeAPI.getById(volunteerProfile.programmeEnrolledId);
              if (programmeResponse.success && programmeResponse.data) {
                setProgrammeName(programmeResponse.data.name || '-');
              }
            } catch (error) {
              console.error('Error fetching programme:', error);
            }
          }
  
          // Fetch organisation name if organisationId exists
          if (volunteerProfile?.organisationId) {
            try {
              const organisationResponse = await organisationAPI.getById(volunteerProfile.organisationId);
              if (organisationResponse.success && organisationResponse.data) {
                setOrganisationName(organisationResponse.data.name || '-');
              }
            } catch (error) {
              console.error('Error fetching organisation:', error);
            }
          }
        } catch (error) {
          console.error('Error fetching names:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNames();
    }, [volunteerProfile?.expertAssignedId, volunteerProfile?.programmeEnrolledId, volunteerProfile?.organisationId]);

  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-7 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onVolunteerClick(volunteer)}
          >
            {volunteerProfile?.name || volunteer.name || volunteer.email}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">
          {volunteerProfile?.age || volunteer.age
            ? `${volunteerProfile?.age || volunteer.age} yrs`
            : "-"}
        </div>

        <div
          className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
          onClick={() => onAssignedStudentsClick(volunteerProfile)}
        >
          {volunteerProfile?.assignedStudents?.length || 0}
        </div>

        <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            programmeName
          )}
        </div>

        <div className="text-xs font-bold text-[#4378a4]">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            organisationName
          )}
        </div>

        <div>
          <button
            className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline"
            onClick={() => onFeedbackClick(volunteer)}
          >
            View
          </button>
        </div>

        {(role === "expert" || role === "admin")&&(
          <div className="flex justify-start">
          <button
            onClick={() => onEditClick(volunteer)}
            className="text-[#4378a4] hover:text-[#2a5e8a] p-1 rounded hover:bg-gray-100"
            title="Edit Volunteer"
          >
            <EditIcon fontSize="small" />
          </button>
          <button 
            onClick={handleDelete}
            className="text-[#4378a4] hover:text-[#2a5e8a] p-1 rounded hover:bg-gray-100"
            title="Edit Student"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
        )}
        
      </div>
    </div>
  );
};

const EditVolunteerDialog = ({ open, volunteer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    contactNumber: "",
    educationalQualification: "",
    preferredLanguages: "",
    experience: "",
    profession: "",
    whatMotivatesYou: "",
    feedback: "",
    programmeEnrolledId: "",
    organisationId: "",
    expertAssignedId: "",
  });  

  const [loading, setLoading] = useState(false);
  const [programmes, setProgrammes] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    setLoadingData(true);
    try {
      const [programmesRes, organisationsRes, expertsRes] = await Promise.all([
        programmeAPI.getAll(),
        organisationAPI.getAll(),
        expertAPI.getAll(1, 100), // Get more experts for dropdown
      ]);

      if (programmesRes.success) {
        setProgrammes(programmesRes.data);
      }
      if (organisationsRes.success) {
        setOrganisations(organisationsRes.data);
      }
      if (expertsRes.success) {
        setExperts(expertsRes.data);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDropdownData();
    }
  }, [open]);

  useEffect(() => {
    if (volunteer) {
      const profile = volunteer.profile;
      setFormData({
        name: profile?.name || volunteer.name || "",
        age: profile?.age || volunteer.age || "",
        email: profile?.email || volunteer.email || "",
        contactNumber: profile?.contactNumber || "",
        educationalQualification: profile?.educationalQualification || "",
        preferredLanguages: profile?.preferredLanguages || "",
        experience: profile?.experience || "",
        profession: profile?.profession || "",
        whatMotivatesYou: profile?.whatMotivatesYou || "",
        feedback: profile?.feedback || "",
        programmeEnrolledId: profile?.programmeEnrolledId || "",
        organisationId: profile?.organisationId || "",
        expertAssignedId: profile?.expertAssignedId || "",
      });
    }
  }, [volunteer]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!volunteer) return;

    setLoading(true);
    try {
      let result;

      const saveData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        programmeEnrolledId: formData.programmeEnrolledId || null,
        organisationId: formData.organisationId || null,
        expertAssignedId: formData.expertAssignedId || null,
      };

      if (volunteer.profile) {
        // Update existing volunteer profile
        result = await volunteerAPI.update(volunteer.profile.id, saveData);
      } else {
        // Create new volunteer profile
        result = await volunteerAPI.create({
          ...saveData,
          userId: volunteer.id,
        });
      }

      if (result.success) {
        onSave(result.data);
        onClose();
      } else {
        alert("Failed to save volunteer: " + result.message);
      }
    } catch (error) {
      console.error("Error saving volunteer:", error);
      alert("Error saving volunteer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Volunteer Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Age"
              type="number"
              fullWidth
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Contact Number"
              fullWidth
              value={formData.contactNumber}
              onChange={(e) =>
                handleInputChange("contactNumber", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Educational Qualification"
              fullWidth
              value={formData.educationalQualification}
              onChange={(e) =>
                handleInputChange("educationalQualification", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Preferred Languages"
              fullWidth
              value={formData.preferredLanguages}
              onChange={(e) =>
                handleInputChange("preferredLanguages", e.target.value)
              }
              helperText="Comma-separated list"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Experience"
              fullWidth
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Profession"
              fullWidth
              value={formData.profession}
              onChange={(e) => handleInputChange("profession", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="What Motivates You to Apply"
              fullWidth
              value={formData.whatMotivatesYou}
              onChange={(e) =>
                handleInputChange("whatMotivatesYou", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Feedback"
              fullWidth
              value={formData.feedback}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
            />
          </Grid>

          {/* Programme Dropdown */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Programme Enrolled</InputLabel>
              <Select
                value={formData.programmeEnrolledId}
                label="Programme Enrolled"
                onChange={(e) =>
                  handleInputChange("programmeEnrolledId", e.target.value)
                }
                disabled={loadingData}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {programmes.map((programme) => (
                  <MenuItem key={programme.id} value={programme.id}>
                    {programme.name}
                  </MenuItem>
                ))}
              </Select>
              {loadingData && (
                <FormHelperText>Loading programmes...</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Organisation Dropdown */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Organisation</InputLabel>
              <Select
                value={formData.organisationId}
                label="Organisation"
                onChange={(e) =>
                  handleInputChange("organisationId", e.target.value)
                }
                disabled={loadingData}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {organisations.map((organisation) => (
                  <MenuItem key={organisation.id} value={organisation.id}>
                    {organisation.name}
                  </MenuItem>
                ))}
              </Select>
              {loadingData && (
                <FormHelperText>Loading organisations...</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Expert Dropdown */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Expert Assigned</InputLabel>
              <Select
                value={formData.expertAssignedId}
                label="Expert Assigned"
                onChange={(e) =>
                  handleInputChange("expertAssignedId", e.target.value)
                }
                disabled={loadingData}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {experts.map((expert) => (
                  <MenuItem key={expert.id} value={expert.id}>
                    {expert.name}
                  </MenuItem>
                ))}
              </Select>
              {loadingData && (
                <FormHelperText>Loading experts...</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || loadingData}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FeedbackDialog = ({ open, onClose, volunteer }) => {
  const volunteerProfile = volunteer?.profile;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Feedback for {volunteer?.name}</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {volunteerProfile?.feedback ? (
            <p className="text-gray-700">{volunteerProfile.feedback}</p>
          ) : (
            <p className="text-gray-500 italic">No feedback available</p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AssignedStudentsDialog = ({ open, onClose, students }) => {
  console.log("Assigned Students:", students);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assigned Students ({students?.length || 0})</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {students && students.length > 0 ? (
            <div className="space-y-2">
              {students.map((student, index) => (
                <div
                  key={student.id || index}
                  className="p-3 bg-gray-50 rounded"
                >
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">
                    Email: {student.email}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No students assigned</p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const VolunteerInfo = ({ volunteer, onClose }) => {

  if (!volunteer) return null;

  const profile = volunteer.profile;

  const handleCopy = () => {
    const volunteerData = JSON.stringify(volunteer, null, 2);
    navigator.clipboard.writeText(volunteerData);
    alert("Volunteer data copied to clipboard");
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
        <div className="flex justify-end items-start mb-3">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-blue-600"
            >
              <ContentCopy fontSize="small" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Close fontSize="small" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center w-full mb-12">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
            <img
              src={volunteer.image || "/api/placeholder/64/64"}
              alt={profile?.name || volunteer.name || volunteer.email}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="font-semibold text-gray-800">Name:</span>
            <span className="text-gray-500">
              {" "}
              {profile?.name || volunteer.name || "-"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Age:</span>
            <span className="text-gray-500">
              {" "}
              {profile?.age || volunteer.age || "-"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Email:</span>
            <span className="text-gray-500">
              {" "}
              {profile?.email || volunteer.email || "-"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Contact No:</span>
            <span className="text-gray-500">
              {" "}
              {profile?.contactNumber || "-"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">
              Educational Qualification:
            </span>
            <span className="text-gray-500">
              {" "}
              {profile?.educationalQualification || "-"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">
              Comfortable Language:
            </span>
            <span className="text-gray-500">
              {" "}
              {profile?.preferredLanguages || "-"}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Experience:</span>
            <span className="text-gray-500"> {profile?.experience || "-"}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Profession:</span>
            <span className="text-gray-500"> {profile?.profession || "-"}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">
              What motivates you to Apply:
            </span>
            <span className="text-gray-500">
              {" "}
              {profile?.whatMotivatesYou || "-"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    volunteer: null,
  });
  const [assignedStudentsDialog, setAssignedStudentsDialog] = useState({
    open: false,
    volunteer: null,
  });

  const params = useParams();
  const role = params.role;

  // Fetch volunteers from API
  const fetchVolunteers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userAPI.getByRole("volunteer", page, 10);

      if (response.success) {
        setVolunteers(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
      } else {
        setError(response.message || "Failed to fetch volunteers");
      }
    } catch (err) {
      setError("Error fetching volunteers: " + err.message);
      console.error("Error fetching volunteers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load volunteers on component mount
  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    fetchVolunteers(page);
  };

  const handleVolunteerClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  const handleEditClick = (volunteer) => {
    setEditingVolunteer(volunteer);
    setEditDialogOpen(true);
  };

  const handleCloseInfo = () => {
    setSelectedVolunteer(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingVolunteer(null);
  };

  const handleSaveVolunteer = (updatedVolunteer) => {
    setVolunteers(
      volunteers.map((volunteer) =>
        volunteer.id === updatedVolunteer.userId
          ? { ...volunteer, profile: updatedVolunteer }
          : volunteer
      )
    );

    // Update selected volunteer if it's currently selected
    if (selectedVolunteer && selectedVolunteer.id === updatedVolunteer.userId) {
      setSelectedVolunteer({ ...selectedVolunteer, profile: updatedVolunteer });
    }
  };

  const handleVolunteerDelete = (deletedId) => {
    setVolunteers(volunteers.filter((volunteer) => volunteer.id !== deletedId));
  };

  const handleFeedbackClick = (volunteer) => {
    setFeedbackDialog({ open: true, volunteer });
  };

  const handleCloseFeedback = () => {
    setFeedbackDialog({ open: false, volunteer: null });
  };

  const handleAssignedStudentsClick = (volunteer) => {
    setAssignedStudentsDialog({ open: true, volunteer });
  };

  const handleCloseAssignedStudents = () => {
    setAssignedStudentsDialog({ open: false, volunteer: null });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading volunteers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-6">
        {/* Main content area */}
        <div
          className={`transition-all duration-300 ${
            selectedVolunteer ? "w-2/3" : "w-full"
          }`}
        >
          <div className="space-y-2">
            {/* Header row with column labels */}
            <div className="bg-gray-50 rounded-lg px-6">
              <div className="grid grid-cols-7 gap-4 text-xs font-bold text-gray-700 tracking-wider">
                <div>Name</div>
                <div>Age</div>
                <div>Children Assigned</div>
                <div>Programmes Enrolled</div>
                <div>Organisation</div>
                <div>Feedback</div>
                { (role === "expert" || role ==="admin") &&  <div>Actions</div> }
              </div>
            </div>

            {/* Volunteer cards */}
            {volunteers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No volunteers found
              </div>
            ) : (
              volunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  onEditClick={handleEditClick}
                  onVolunteerClick={handleVolunteerClick}
                  onFeedbackClick={handleFeedbackClick}
                  onAssignedStudentsClick={handleAssignedStudentsClick}
                  role={role}
                />
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Volunteer info panel */}
        {selectedVolunteer && (
          <div className="w-1/3 transition-all duration-300">
            <VolunteerInfo
              volunteer={selectedVolunteer}
              onClose={handleCloseInfo}
            />
          </div>
        )}
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialog.open}
        onClose={handleCloseFeedback}
        volunteer={feedbackDialog.volunteer}
      />

      {/* Assigned Students Dialog */}
      <AssignedStudentsDialog
        open={assignedStudentsDialog.open}
        onClose={handleCloseAssignedStudents}
        students={assignedStudentsDialog.volunteer?.assignedStudents || []}
      />

      <EditVolunteerDialog
        open={editDialogOpen}
        volunteer={editingVolunteer}
        onClose={handleCloseEditDialog}
        onSave={handleSaveVolunteer}
      />
    </>
  );
};

export default VolunteersPage;
