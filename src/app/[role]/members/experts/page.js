"use client";
import React, { useState, useEffect } from "react";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { expertAPI, organisationAPI, programmeAPI, userAPI } from "@/lib/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useParams } from "next/navigation";

const ExpertCard = ({
  expert,
  onExpertClick,
  onEditClick,
  onFeedbackClick,
  onVolunteersClick,
  onDelete,
  role,
}) => {
  const expertProfile = expert.profile;

  // State to store fetched names
  const [programmeName, setProgrammeName] = useState("-");
  const [organisationName, setOrganisationName] = useState("-");
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${
          expertProfile?.name || expert.name || expert.email
        }?`
      )
    ) {
      try {
        await userAPI.delete(expert.id);
        onDelete(expert.id);
      } catch (error) {
        console.error("Error deleting expert:", error);
        alert("Failed to delete expert");
      }
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      setLoading(true);

      try {
        // Fetch programme name if programmeEnrolledId exists
        if (expertProfile?.programmeEnrolledId) {
          try {
            const programmeResponse = await programmeAPI.getById(
              expertProfile.programmeEnrolledId
            );
            if (programmeResponse.success && programmeResponse.data) {
              setProgrammeName(programmeResponse.data.name || "-");
            }
          } catch (error) {
            console.error("Error fetching programme:", error);
          }
        }

        // Fetch organisation name if organisationId exists
        if (expertProfile?.organisationId) {
          try {
            const organisationResponse = await organisationAPI.getById(
              expertProfile.organisationId
            );
            if (organisationResponse.success && organisationResponse.data) {
              setOrganisationName(organisationResponse.data.name || "-");
            }
          } catch (error) {
            console.error("Error fetching organisation:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching names:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNames();
  }, [expertProfile?.programmeEnrolledId, expertProfile?.organisationId]);

  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-7 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onExpertClick(expert)}
          >
            {expertProfile?.name || expert.name || expert.email}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">
          {expertProfile?.age || expert.age
            ? `${expertProfile?.age || expert.age} yrs`
            : "-"}
        </div>

        <div
          className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
          onClick={() => onVolunteersClick(expertProfile)}
        >
          {expertProfile?.assignedVolunteers?.length || 0}
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
            onClick={() => onFeedbackClick(expert)}
          >
            View
          </button>
        </div>

        {role === "admin" && (
          <div className="flex justify-start">
            <button
              onClick={() => onEditClick(expert)}
              className="text-[#4378a4] hover:text-[#2a5e8a] p-1 rounded hover:bg-gray-100"
              title="Edit Expert"
            >
              <EditIcon fontSize="small" />
            </button>
            <button
              onClick={handleDelete}
              className="text-[#4378a4] hover:text-[#2a5e8a] p-1 rounded hover:bg-gray-100"
              title="Delete Expert"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EditExpertDialog = ({ open, expert, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    profession: "",
    educationalQualification: "",
    feedback: "",
    programmeEnrolledId: "",
    organisationId: "",
  });

  const [loading, setLoading] = useState(false);
  const [programmes, setProgrammes] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    setLoadingData(true);
    try {
      const [programmesRes, organisationsRes] = await Promise.all([
        programmeAPI.getAll(),
        organisationAPI.getAll(),
      ]);

      if (programmesRes.success) {
        // Filter approved programs
        const approvedProgrammes = programmesRes.data.filter(
          (programme) => programme.approvalStatus === "APPROVED"
        );
        setProgrammes(approvedProgrammes || []);
      }
      if (organisationsRes.success) {
        setOrganisations(organisationsRes.data);
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
    if (expert) {
      const profile = expert.profile;
      setFormData({
        name: profile?.name || expert.name || "",
        age: profile?.age || expert.age || "",
        email: profile?.email || expert.email || "",
        profession: profile?.profession || "",
        educationalQualification: profile?.educationalQualification || "",
        feedback: profile?.feedback || "",
        programmeEnrolledId: profile?.programmeEnrolledId || "",
        organisationId: profile?.organisationId || "",
      });
    }
  }, [expert]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!expert) return;

    setLoading(true);
    try {
      let result;

      const saveData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        programmeEnrolledId: formData.programmeEnrolledId || null,
        organisationId: formData.organisationId || null,
      };

      if (expert.profile) {
        // Update existing expert profile
        result = await expertAPI.update(expert.profile.id, saveData);
      } else {
        // Create new expert profile
        result = await expertAPI.create({
          ...saveData,
          userId: expert.id,
        });
      }

      if (result.success) {
        onSave(result.data);
        onClose();
      } else {
        alert("Failed to save expert: " + result.message);
      }
    } catch (error) {
      console.error("Error saving expert:", error);
      alert("Error saving expert: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Expert Profile</DialogTitle>
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
              label="Profession"
              fullWidth
              value={formData.profession}
              onChange={(e) => handleInputChange("profession", e.target.value)}
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

const FeedbackDialog = ({ open, onClose, expert }) => {
  const expertProfile = expert?.profile;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Feedback for {expert?.name}</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {expertProfile?.feedback ? (
            <p className="text-gray-700">{expertProfile.feedback}</p>
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

const AssignedVolunteersDialog = ({ open, onClose, volunteers }) => {
  console.log("Assigned Volunteers:", volunteers);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assigned Volunteers ({volunteers?.length || 0})</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {volunteers && volunteers.length > 0 ? (
            <div className="space-y-2">
              {volunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id || index}
                  className="p-3 bg-gray-50 rounded"
                >
                  <div className="font-medium">{volunteer.name}</div>
                  <div className="text-sm text-gray-600">
                    Email: {volunteer.email}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No volunteers assigned</p>
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

const ExpertInfo = ({ expert, onClose }) => {
  if (!expert) return null;

  const profile = expert.profile;

  const handleCopy = () => {
    const expertData = JSON.stringify(expert, null, 2);
    navigator.clipboard.writeText(expertData);
    alert("Expert data copied to clipboard");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      <div className="flex justify-end items-start mb-12">
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

      <div className="flex items-center justify-center w-full">
        <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
          <img
            src={expert.image || "/api/placeholder/128/128"}
            alt={profile?.name || expert.name || expert.email}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-1 text-xs mt-6">
        <p className="font-semibold text-gray-800">
          {profile?.name || expert.name || "-"}
        </p>
        <p className="font-semibold text-gray-800">
          {profile?.email || expert.email || "-"}
        </p>
        <p className="font-semibold text-gray-800">
          {profile?.profession || "-"}
        </p>
        <p className="font-semibold text-gray-800">
          {profile?.educationalQualification || "-"}
        </p>
      </div>
    </div>
  );
};

const ExpertsPage = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [editingExpert, setEditingExpert] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    expert: null,
  });
  const [assignedVolunteersDialog, setAssignedVolunteersDialog] = useState({
    open: false,
    expert: null,
  });

  const params = useParams();
  const role = params.role;

  // Fetch experts from API
  const fetchExperts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userAPI.getByRole("expert", page, 10);

      if (response.success) {
        setExperts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
      } else {
        setError(response.message || "Failed to fetch experts");
      }
    } catch (err) {
      setError("Error fetching experts: " + err.message);
      console.error("Error fetching experts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load experts on component mount
  useEffect(() => {
    fetchExperts();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    fetchExperts(page);
  };

  const handleExpertClick = (expert) => {
    setSelectedExpert(expert);
  };

  const handleEditClick = (expert) => {
    setEditingExpert(expert);
    setEditDialogOpen(true);
  };

  const handleCloseInfo = () => {
    setSelectedExpert(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingExpert(null);
  };

  const handleSaveExpert = (updatedExpert) => {
    setExperts(
      experts.map((expert) =>
        expert.id === updatedExpert.userId
          ? { ...expert, profile: updatedExpert }
          : expert
      )
    );

    // Update selected volunteer if it's currently selected
    if (selectedExpert && selectedExpert.id === updatedExpert.userId) {
      setSelectedExpert({ ...selectedExpert, profile: updatedExpert });
    }
  };

  const handleExpertDelete = (deletedId) => {
    setExperts(experts.filter((expert) => expert.id !== deletedId));
  };

  const handleFeedbackClick = (expert) => {
    setFeedbackDialog({ open: true, expert });
  };

  const handleCloseFeedback = () => {
    setFeedbackDialog({ open: false, expert: null });
  };

  const handleAssignedVolunteersClick = (expert) => {
    setAssignedVolunteersDialog({
      open: true,
      expert,
    });
  };

  const handleCloseAssignedVolunteers = () => {
    setAssignedVolunteersDialog({ open: false, expert: null });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading experts...</div>
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
            selectedExpert ? "w-2/3" : "w-full"
          }`}
        >
          <div className="space-y-2">
            {/* Header row with column labels */}
            <div className="bg-gray-50 rounded-lg px-6">
              <div className="grid grid-cols-7 gap-4 text-xs font-bold text-gray-700 tracking-wider">
                <div>Name</div>
                <div>Age</div>
                <div>Volunteers Assigned</div>
                <div>Programmes Enrolled</div>
                <div>Organisation</div>
                <div>Feedback</div>
                {(role === "admin") && <div>Actions</div>}
              </div>
            </div>

            {/* Expert cards */}
            {experts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No experts found
              </div>
            ) : (
              experts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  onEditClick={handleEditClick}
                  onExpertClick={handleExpertClick}
                  onFeedbackClick={handleFeedbackClick}
                  onVolunteersClick={handleAssignedVolunteersClick}
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

        {/* Expert info panel */}
        {selectedExpert && (
          <div className="w-1/3 transition-all duration-300">
            <ExpertInfo expert={selectedExpert} onClose={handleCloseInfo} />
          </div>
        )}
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialog.open}
        onClose={handleCloseFeedback}
        expert={feedbackDialog.expert}
      />

      {/* Assigned Volunteers Dialog */}
      <AssignedVolunteersDialog
        open={assignedVolunteersDialog.open}
        onClose={handleCloseAssignedVolunteers}
        volunteers={assignedVolunteersDialog.expert?.assignedVolunteers || []}
      />

      <EditExpertDialog
        open={editDialogOpen}
        expert={editingExpert}
        onClose={handleCloseEditDialog}
        onSave={handleSaveExpert}
      />
    </>
  );
};

export default ExpertsPage;
