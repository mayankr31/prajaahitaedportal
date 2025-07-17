"use client";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  userAPI,
  studentAPI,
  programmeAPI,
  organisationAPI,
  volunteerAPI,
} from "@/lib/api";
import { useParams } from "next/navigation";

const StudentCard = ({
  student,
  onStudentClick,
  onEditClick,
  onDelete,
  role,
}) => {
  const studentProfile = student.profile;

  // State to store fetched names
  const [volunteerName, setVolunteerName] = useState("-");
  const [programmeName, setProgrammeName] = useState("-");
  const [organisationName, setOrganisationName] = useState("-");
  const [loading, setLoading] = useState(true);

  console.log("StudentCard - student:", student);

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${
          studentProfile?.name || student.name || student.email
        }?`
      )
    ) {
      try {
        await userAPI.delete(student.id);
        onDelete(student.id);
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
      }
    }
  };

  useEffect(() => {
    const fetchNames = async () => {
      setLoading(true);

      try {
        // Fetch volunteer name if volunteerAssignedId exists
        if (studentProfile?.volunteerAssignedId) {
          try {
            const volunteerResponse = await volunteerAPI.getById(
              studentProfile.volunteerAssignedId
            );
            if (volunteerResponse.success && volunteerResponse.data) {
              setVolunteerName(
                volunteerResponse.data.name ||
                  volunteerResponse.data.profile?.name ||
                  "-"
              );
            }
          } catch (error) {
            console.error("Error fetching volunteer:", error);
          }
        }

        // Fetch programme name if programmeEnrolledId exists
        if (studentProfile?.programmeEnrolledId) {
          try {
            const programmeResponse = await programmeAPI.getById(
              studentProfile.programmeEnrolledId
            );
            if (programmeResponse.success && programmeResponse.data) {
              setProgrammeName(programmeResponse.data.name || "-");
            }
          } catch (error) {
            console.error("Error fetching programme:", error);
          }
        }

        // Fetch organisation name if organisationId exists
        if (studentProfile?.organisationId) {
          try {
            const organisationResponse = await organisationAPI.getById(
              studentProfile.organisationId
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
  }, [
    studentProfile?.volunteerAssignedId,
    studentProfile?.programmeEnrolledId,
    studentProfile?.organisationId,
  ]);

  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onStudentClick(student)}
          >
            {studentProfile?.name || student.name || student.email}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">
          {studentProfile?.age || student.age
            ? `${studentProfile?.age || student.age} yrs`
            : "-"}
        </div>

        <div className="text-xs text-gray-500 font-bold">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            volunteerName
          )}
        </div>

        <div className="text-xs font-bold text-gray-900">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            programmeName
          )}
        </div>

        <div className="text-xs font-bold text-gray-900">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            organisationName
          )}
        </div>

        {(role === "admin" || role === "expert") && (
          <div className="flex justify-start">
            <button
              onClick={() => onEditClick(student)}
              className="text-[#4378a4] hover:text-[#2a5e8a] p-1 rounded hover:bg-gray-100"
              title="Edit Student"
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

const EditStudentDialog = ({ open, student, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    skills: "",
    areaOfInterest: "",
    readingCapacity: "",
    preferredLanguages: "",
    fineMotorDevelopment: "",
    interactionCapacity: "",
    onlineClassExperience: "",
    attentionSpan: "",
    triggeringFactors: "",
    happyMoments: "",
    disability: "",
    volunteerAssignedId: "",
    programmeEnrolledId: "",
    organisationId: "",
  });

  const [loading, setLoading] = useState(false);
  const [programmes, setProgrammes] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(false);

  // console.log("EditStudentDialog - student:", student);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      setDropdownsLoading(true);
      try {
        const [programmesRes, organisationsRes, volunteersRes] =
          await Promise.all([
            programmeAPI.getAll(),
            organisationAPI.getAll(),
            volunteerAPI.getAll(),
          ]);

        // if (programmesRes.success) {
        //   setProgrammes(programmesRes.data || []);
        // }
        if (programmesRes.success) {
          // Filter approved programs
          const approvedProgrammes = programmesRes.data.filter(
            (programme) => programme.approvalStatus === "APPROVED"
          );
          setProgrammes(approvedProgrammes || []);
        }
        if (organisationsRes.success) {
          setOrganisations(organisationsRes.data || []);
        }
        if (volunteersRes.success) {
          setVolunteers(volunteersRes.data || []);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setDropdownsLoading(false);
      }
    };

    if (open) {
      fetchDropdownData();
    }
  }, [open]);

  useEffect(() => {
    if (student) {
      const profile = student.profile;
      setFormData({
        name: profile?.name || student.name || "",
        age: profile?.age || student.age || "",
        email: profile?.email || student.email || "",
        skills: profile?.skills || "",
        areaOfInterest: profile?.areaOfInterest || "",
        readingCapacity: profile?.readingCapacity || "",
        preferredLanguages: profile?.preferredLanguages || "",
        fineMotorDevelopment: profile?.fineMotorDevelopment || "",
        interactionCapacity: profile?.interactionCapacity || "",
        onlineClassExperience: profile?.onlineClassExperience || "",
        attentionSpan: profile?.attentionSpan || "",
        triggeringFactors: profile?.triggeringFactors || "",
        happyMoments: profile?.happyMoments || "",
        disability: profile?.disability || "",
        volunteerAssignedId: profile?.volunteerAssignedId || "",
        programmeEnrolledId: profile?.programmeEnrolledId || "",
        organisationId: profile?.organisationId || "",
      });
    }
  }, [student]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!student) return;

    setLoading(true);
    try {
      let result;

      if (student.profile) {
        // Update existing student profile
        result = await studentAPI.update(student.profile.id, {
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
        });
      } else {
        // Create new student profile
        result = await studentAPI.create({
          ...formData,
          userId: student.id,
          age: formData.age ? parseInt(formData.age) : null,
        });
      }

      if (result.success) {
        onSave(result.data);
        onClose();
      } else {
        alert("Failed to save student: " + result.message);
      }
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Error saving student: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Student Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Basic Information */}
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
              label="Skills"
              fullWidth
              value={formData.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
            />
          </Grid>

          {/* Assignment Dropdowns */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth disabled={dropdownsLoading}>
              <InputLabel>Organisation</InputLabel>
              <Select
                value={formData.organisationId}
                onChange={(e) =>
                  handleInputChange("organisationId", e.target.value)
                }
                label="Organisation"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {organisations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth disabled={dropdownsLoading}>
              <InputLabel>Programme</InputLabel>
              <Select
                value={formData.programmeEnrolledId}
                onChange={(e) =>
                  handleInputChange("programmeEnrolledId", e.target.value)
                }
                label="Programme"
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
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth disabled={dropdownsLoading}>
              <InputLabel>Volunteer Assigned</InputLabel>
              <Select
                value={formData.volunteerAssignedId}
                onChange={(e) =>
                  handleInputChange("volunteerAssignedId", e.target.value)
                }
                label="Volunteer Assigned"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {volunteers.map((volunteer) => (
                  <MenuItem key={volunteer.id} value={volunteer.id}>
                    {volunteer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Other Information */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Area of Interest"
              fullWidth
              value={formData.areaOfInterest}
              onChange={(e) =>
                handleInputChange("areaOfInterest", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Reading Capacity"
              fullWidth
              value={formData.readingCapacity}
              onChange={(e) =>
                handleInputChange("readingCapacity", e.target.value)
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
              label="Fine Motor Development"
              fullWidth
              value={formData.fineMotorDevelopment}
              onChange={(e) =>
                handleInputChange("fineMotorDevelopment", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Interaction Capacity"
              fullWidth
              value={formData.interactionCapacity}
              onChange={(e) =>
                handleInputChange("interactionCapacity", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Online Class Experience"
              fullWidth
              value={formData.onlineClassExperience}
              onChange={(e) =>
                handleInputChange("onlineClassExperience", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Attention Span"
              fullWidth
              value={formData.attentionSpan}
              onChange={(e) =>
                handleInputChange("attentionSpan", e.target.value)
              }
              helperText="e.g., 30 minutes"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Disability"
              fullWidth
              value={formData.disability}
              onChange={(e) => handleInputChange("disability", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Triggering Factors"
              fullWidth
              multiline
              rows={3}
              value={formData.triggeringFactors}
              onChange={(e) =>
                handleInputChange("triggeringFactors", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Happy Moments"
              fullWidth
              multiline
              rows={3}
              value={formData.happyMoments}
              onChange={(e) =>
                handleInputChange("happyMoments", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || dropdownsLoading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StudentInfo = ({ student, onClose, onDelete }) => {
  if (!student) return null;

  const profile = student.profile;

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${
          profile?.name || student.name || student.email
        }?`
      )
    ) {
      try {
        await userAPI.delete(student.id);
        onDelete(student.id);
        onClose();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student");
      }
    }
  };

  const handleCopy = () => {
    const studentData = JSON.stringify(student, null, 2);
    navigator.clipboard.writeText(studentData);
    alert("Student data copied to clipboard");
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
          {/* <button 
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-600"
          >
            <Delete fontSize="small" />
          </button> */}
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
            src={student.image || "/api/placeholder/64/64"}
            alt={profile?.name || student.name || student.email}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="font-semibold text-gray-800">Name:</span>
          <span className="text-gray-500">
            {" "}
            {profile?.name || student.name || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Age:</span>
          <span className="text-gray-500">
            {" "}
            {profile?.age || student.age || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Email:</span>
          <span className="text-gray-500">
            {" "}
            {profile?.email || student.email || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Skills:</span>
          <span className="text-gray-500"> {profile?.skills || "-"}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Area of Interest:</span>
          <span className="text-gray-500">
            {" "}
            {profile?.areaOfInterest || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Reading Capacity:</span>
          <span className="text-gray-500">
            {" "}
            {profile?.readingCapacity || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Preferred Languages:
          </span>
          <span className="text-gray-500">
            {" "}
            {profile?.preferredLanguages || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Fine Motor Development:
          </span>
          <span className="text-gray-500">
            {" "}
            {profile?.fineMotorDevelopment || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Interaction Capacity:
          </span>
          <span className="text-gray-500">
            {" "}
            {profile?.interactionCapacity || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Online Class Experience:
          </span>
          <span className="text-gray-500">
            {" "}
            {profile?.onlineClassExperience || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Attention Span:</span>
          <span className="text-gray-500">
            {" "}
            {profile?.attentionSpan || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Triggering Factors:
          </span>
          <span className="text-gray-500">
            {" "}
            {profile?.triggeringFactors || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Happy Moments:</span>
          <span className="text-gray-500"> {profile?.happyMoments || "-"}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Disability:</span>
          <span className="text-gray-500"> {profile?.disability || "-"}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Volunteer Assigned:
          </span>
          <span className="text-gray-500">
            {" "}
            {profile?.volunteerAssigned?.name || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Programme Enrolled:
          </span>
          <span className="text-gray-500">
            {" "}
            {profile?.programmeEnrolled?.name || "-"}
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Organisation:</span>
          <span className="text-gray-500">
            {" "}
            {profile?.organisation?.name || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const params = useParams();
  const role = params.role;

  // Fetch users with student role from API
  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userAPI.getByRole("student", page, 10);

      if (response.success) {
        setStudents(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
      } else {
        setError(response.message || "Failed to fetch students");
      }
    } catch (err) {
      setError("Error fetching students: " + err.message);
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    fetchStudents(page);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditDialogOpen(true);
  };

  const handleCloseInfo = () => {
    setSelectedStudent(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingStudent(null);
  };

  const handleSaveStudent = (updatedStudent) => {
    // Update the student in the list
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.userId
          ? { ...student, profile: updatedStudent }
          : student
      )
    );

    // Update selected student if it's currently selected
    if (selectedStudent && selectedStudent.id === updatedStudent.userId) {
      setSelectedStudent({ ...selectedStudent, profile: updatedStudent });
    }
  };

  const handleStudentDelete = (deletedId) => {
    setStudents(students.filter((student) => student.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading students...</div>
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
    <div className="flex gap-6">
      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          selectedStudent ? "w-2/3" : "w-full"
        }`}
      >
        <div className="space-y-2">
          {/* Header row with column labels */}
          <div className="bg-gray-50 rounded-lg px-6">
            <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
              <div>Name</div>
              <div>Age</div>
              <div>Volunteer Assigned</div>
              <div>Programmes Enrolled</div>
              <div>Organisation</div>
              {(role === "admin" || role === "expert") && <div>Actions</div>}
            </div>
          </div>

          {/* Student cards */}
          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No students found
            </div>
          ) : (
            students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onStudentClick={handleStudentClick}
                onEditClick={handleEditClick}
                onDelete={handleStudentDelete}
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

      {/* Student info panel */}
      {selectedStudent && (
        <div className="w-1/3 transition-all duration-300">
          <StudentInfo
            student={selectedStudent}
            onClose={handleCloseInfo}
            onDelete={handleStudentDelete}
          />
        </div>
      )}

      {/* Edit Student Dialog */}
      <EditStudentDialog
        open={editDialogOpen}
        student={editingStudent}
        onClose={handleCloseEditDialog}
        onSave={handleSaveStudent}
      />
    </div>
  );
};

export default StudentsPage;
