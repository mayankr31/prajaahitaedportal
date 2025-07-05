// "use client";
// import { Close, ContentCopy, Delete } from "@mui/icons-material";
// import EditIcon from "@mui/icons-material/Edit";
// import React, { useState } from "react";

// const VolunteerCard = ({ volunteer, onVolunteerClick }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
//       <div className="grid grid-cols-6 gap-4 items-center">
//         <div className="flex items-center">
//           <div
//             className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
//             onClick={() => onVolunteerClick(volunteer)}
//           >
//             {volunteer.name}
//           </div>
//         </div>

//         <div className="text-xs font-bold text-gray-900">{volunteer.age}</div>

//         <div className="text-xs font-bold text-[#4378a4]">
//           {volunteer.childrenAssigned}
//         </div>

//         <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
//           {volunteer.programmesEnrolled}
//         </div>

//         <div className="text-xs font-bold text-[#4378a4]">
//           {volunteer.organisation}
//         </div>

//         <div>
//           <button className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline">
//             {volunteer.feedback}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const VolunteerInfo = ({ volunteer, onClose }) => {
//   if (!volunteer) return null;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
//       <div className="flex justify-end items-start mb-3">
//         <div className="flex gap-2">
//           <button className="text-gray-500 hover:text-blue-600">
//             <ContentCopy fontSize="small" />
//           </button>
//           <button className="text-gray-500 hover:text-green-600">
//             <EditIcon fontSize="small" />
//           </button>
//           <button className="text-gray-500 hover:text-red-600">
//             <Delete fontSize="small" />
//           </button>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <Close fontSize="small" />
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center justify-center w-full mb-12">
//         <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
//           <img
//             src="/api/placeholder/64/64"
//             alt={volunteer.name}
//             className="w-32 h-32 rounded-full object-cover"
//           />
//         </div>
//       </div>

//       <div className="space-y-2 text-xs">
//         <div>
//           <span className="font-semibold text-gray-800">Name:</span>
//           <span className="text-gray-500"> {volunteer.name}</span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">Age:</span>
//           <span className="text-gray-500"> {volunteer.age}</span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">Email:</span>
//           <span className="text-gray-500"> komal.motwani051@nmims.edu.in</span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">Contact No:</span>
//           <span className="text-gray-500"> 8489968810</span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">
//             Educational Qualification:
//           </span>
//           <span className="text-gray-500"> BA in Political Science</span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">
//             Comfortable Language:
//           </span>
//           <span className="text-gray-500"> English</span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">Experience:</span>
//           <span className="text-gray-500">
//             {" "}
//             Worked as volunteer in prajaahita before in every-ready-day and
//             worked as volunteer in DDMA (District Disaster Management Govt of
//             Kerala) and many volunteering camps.
//           </span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">Profession:</span>
//           <span className="text-gray-500"> College Student</span>
//         </div>

//         <div>
//           <span className="font-semibold text-gray-800">
//             What motivates you to Apply:
//           </span>
//           <span className="text-gray-500">
//             {" "}
//             For my self happiness by gathering their happiness and for a new
//             experience which will add on my life and career.
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const VolunteersPage = () => {
//   const [selectedVolunteer, setSelectedVolunteer] = useState(null);

//   const volunteers = [
//     {
//       id: 1,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 2,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 3,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 4,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 5,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 6,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 7,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 8,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//     {
//       id: 9,
//       name: "Komal Motwani",
//       age: "22 yrs",
//       childrenAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//     },
//   ];

//   const handleVolunteerClick = (volunteer) => {
//     setSelectedVolunteer(volunteer);
//   };

//   const handleCloseInfo = () => {
//     setSelectedVolunteer(null);
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Main content area */}
//       <div
//         className={`transition-all duration-300 ${
//           selectedVolunteer ? "w-2/3" : "w-full"
//         }`}
//       >
//         <div className="space-y-2">
//           {/* Header row with column labels */}
//           <div className="bg-gray-50 rounded-lg px-6">
//             <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
//               <div>Name</div>
//               <div>Age</div>
//               <div>Children Assigned</div>
//               <div>Programmes Enrolled</div>
//               <div>Organisation</div>
//               <div>Feedback</div>
//             </div>
//           </div>

//           {/* Volunteer cards */}
//           {volunteers.map((volunteer) => (
//             <VolunteerCard
//               key={volunteer.id}
//               volunteer={volunteer}
//               onVolunteerClick={handleVolunteerClick}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Volunteer info panel */}
//       {selectedVolunteer && (
//         <div className="w-1/3 transition-all duration-300">
//           <VolunteerInfo
//             volunteer={selectedVolunteer}
//             onClose={handleCloseInfo}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default VolunteersPage;

"use client";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState, useEffect } from "react";
import { volunteerAPI } from "@/lib/api";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

// Mock programme names for display
const mockProgrammeNames = {
  'prog1': 'Colour it',
  'prog2': 'Creative Writing',
  'prog3': 'Digital Art',
  'prog4': 'Music Therapy',
  'prog5': 'Reading Club',
  'prog6': 'Math Fun',
  'prog7': 'Science Explorer',
  'prog8': 'Dance Workshop'
};

const getProgrammeName = (programmeId) => {
  return mockProgrammeNames[programmeId] || 'General Program';
};

const VolunteerCard = ({ volunteer, onVolunteerClick, onFeedbackClick, onAssignedStudentsClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onVolunteerClick(volunteer)}
          >
            {volunteer.name}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">{volunteer.age} yrs</div>

        <div 
          className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
          onClick={() => onAssignedStudentsClick(volunteer)}
        >
          {volunteer.assignedStudents?.length || 0}
        </div>

        <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
          {volunteer.programmeEnrolled ? getProgrammeName(volunteer.programmeEnrolledId) : 'Not Enrolled'}
        </div>

        <div className="text-xs font-bold text-[#4378a4]">
          {volunteer.organisation?.name || 'No Organisation'}
        </div>

        <div>
          <button 
            className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline"
            onClick={() => onFeedbackClick(volunteer)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackDialog = ({ open, onClose, volunteer }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Feedback for {volunteer?.name}</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {volunteer?.feedback ? (
            <p className="text-gray-700">{volunteer.feedback}</p>
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
  console.log('Assigned Students:', students);
  return (
    
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assigned Students ({students?.length || 0})</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {students && students.length > 0 ? (
            <div className="space-y-2">
              {students.map((student, index) => (
                <div key={student.id || index} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">Email: {student.email}</div>
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

const VolunteerInfo = ({ volunteer, onClose, onDelete }) => {
  const [showAssignedStudents, setShowAssignedStudents] = useState(false);

  if (!volunteer) return null;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${volunteer.name}?`)) {
      try {
        await volunteerAPI.delete(volunteer.id);
        onDelete(volunteer.id);
        onClose();
      } catch (error) {
        console.error('Error deleting volunteer:', error);
        alert('Failed to delete volunteer');
      }
    }
  };

  const handleCopy = () => {
    const volunteerData = JSON.stringify(volunteer, null, 2);
    navigator.clipboard.writeText(volunteerData);
    alert('Volunteer data copied to clipboard');
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
            <button className="text-gray-500 hover:text-green-600">
              <EditIcon fontSize="small" />
            </button>
            <button 
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600"
            >
              <Delete fontSize="small" />
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
              src="/api/placeholder/64/64"
              alt={volunteer.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="font-semibold text-gray-800">Name:</span>
            <span className="text-gray-500"> {volunteer.name}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Age:</span>
            <span className="text-gray-500"> {volunteer.age} years</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Email:</span>
            <span className="text-gray-500"> {volunteer.email}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Contact No:</span>
            <span className="text-gray-500"> {volunteer.contactNumber || 'Not provided'}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Educational Qualification:</span>
            <span className="text-gray-500"> {volunteer.educationalQualification || 'Not provided'}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Comfortable Language:</span>
            <span className="text-gray-500"> {volunteer.preferredLanguages || 'Not specified'}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Experience:</span>
            <span className="text-gray-500"> {volunteer.experience || 'Not provided'}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">Profession:</span>
            <span className="text-gray-500"> {volunteer.profession || 'Not provided'}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-800">What motivates you to Apply:</span>
            <span className="text-gray-500"> {volunteer.whatMotivatesYou || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <AssignedStudentsDialog
        open={showAssignedStudents}
        onClose={() => setShowAssignedStudents(false)}
        students={volunteer.assignedStudents}
      />
    </>
  );
};

const VolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, volunteer: null });
  const [assignedStudentsDialog, setAssignedStudentsDialog] = useState({ open: false, volunteer: null });

  // Fetch volunteers from API
  const fetchVolunteers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await volunteerAPI.getAll(page, 10);
      
      if (response.success) {
        setVolunteers(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
      } else {
        setError(response.message || 'Failed to fetch volunteers');
      }
    } catch (err) {
      setError('Error fetching volunteers: ' + err.message);
      console.error('Error fetching volunteers:', err);
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

  const handleCloseInfo = () => {
    setSelectedVolunteer(null);
  };

  const handleVolunteerDelete = (deletedId) => {
    setVolunteers(volunteers.filter(volunteer => volunteer.id !== deletedId));
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
              <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
                <div>Name</div>
                <div>Age</div>
                <div>Children Assigned</div>
                <div>Programmes Enrolled</div>
                <div>Organisation</div>
                <div>Feedback</div>
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
                  onVolunteerClick={handleVolunteerClick}
                  onFeedbackClick={handleFeedbackClick}
                  onAssignedStudentsClick={handleAssignedStudentsClick}
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
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
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
              onDelete={handleVolunteerDelete}
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
        students={assignedStudentsDialog.volunteer?.assignedStudents}
      />
    </>
  );
};

export default VolunteersPage;