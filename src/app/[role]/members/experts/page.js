// "use client";
// import React, { useState } from "react";
// import { Close, ContentCopy, Delete } from "@mui/icons-material";
// import EditIcon from "@mui/icons-material/Edit";

// const ExpertCard = ({ expert, onExpertClick }) => {
//   return (
//     <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
//       <div className="grid grid-cols-6 gap-4 items-center">
//         <div className="flex items-center">
//           <div
//             className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
//             onClick={() => onExpertClick(expert)}
//           >
//             {expert.name}
//           </div>
//         </div>

//         <div className="text-xs font-bold text-gray-900">{expert.age}</div>

//         <div className="text-xs font-bold text-[#4378a4]">
//           {expert.volunteersAssigned}
//         </div>

//         <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
//           {expert.programmesEnrolled}
//         </div>

//         <div className="text-xs font-bold text-[#4378a4]">
//           {expert.organisation}
//         </div>

//         <div>
//           <button className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline">
//             {expert.feedback}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ExpertInfo = ({ expert, onClose }) => {
//   if (!expert) return null;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
//       <div className="flex justify-end items-start mb-12">
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

//       <div className="flex items-center justify-center w-full">
//           <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
//             <img
//               src="/api/placeholder/128/128"
//               alt={expert.name}
//               className="w-32 h-32 rounded-full object-cover"
//             />
//           </div>
//         </div>

//       <div className="space-y-1 text-xs">
//         <p className="font-semibold text-gray-800">Dr. Bindiya Shajith</p>
//         <p className="font-semibold text-gray-800">Psychologist, Special Educator</p>
//         <p className="font-semibold text-gray-800">Qualification PhD in Psychology; Masters in Special Education</p>
//       </div>
//     </div>
//   );
// };

// const ExpertsPage = () => {
//   const [selectedExpert, setSelectedExpert] = useState(null);

//   const experts = [
//     {
//       id: 1,
//       name: "Komal Motwani",
//       age: "34 yrs",
//       volunteersAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//       email: "komal.expert@example.com",
//       contact: "9876543210",
//       education: "MD in Pediatrics",
//       specialization: "Child Psychology",
//       experience:
//         "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
//       profession: "Medical Doctor",
//       areasOfExpertise:
//         "Child Psychology, Developmental Disorders, Family Counseling",
//     },
//     {
//       id: 2,
//       name: "Komal Motwani",
//       age: "34 yrs",
//       volunteersAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//       email: "komal.expert@example.com",
//       contact: "9876543210",
//       education: "MD in Pediatrics",
//       specialization: "Child Psychology",
//       experience:
//         "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
//       profession: "Medical Doctor",
//       areasOfExpertise:
//         "Child Psychology, Developmental Disorders, Family Counseling",
//     },
//     {
//       id: 3,
//       name: "Komal Motwani",
//       age: "34 yrs",
//       volunteersAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//       email: "komal.expert@example.com",
//       contact: "9876543210",
//       education: "MD in Pediatrics",
//       specialization: "Child Psychology",
//       experience:
//         "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
//       profession: "Medical Doctor",
//       areasOfExpertise:
//         "Child Psychology, Developmental Disorders, Family Counseling",
//     },
//     {
//       id: 4,
//       name: "Komal Motwani",
//       age: "34 yrs",
//       volunteersAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//       email: "komal.expert@example.com",
//       contact: "9876543210",
//       education: "MD in Pediatrics",
//       specialization: "Child Psychology",
//       experience:
//         "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
//       profession: "Medical Doctor",
//       areasOfExpertise:
//         "Child Psychology, Developmental Disorders, Family Counseling",
//     },
//     {
//       id: 5,
//       name: "Komal Motwani",
//       age: "34 yrs",
//       volunteersAssigned: "3",
//       programmesEnrolled: "CMC Vellore",
//       organisation: "Girl Help",
//       feedback: "View",
//       email: "komal.expert@example.com",
//       contact: "9876543210",
//       education: "MD in Pediatrics",
//       specialization: "Child Psychology",
//       experience:
//         "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
//       profession: "Medical Doctor",
//       areasOfExpertise:
//         "Child Psychology, Developmental Disorders, Family Counseling",
//     },
//   ];

//   const handleExpertClick = (expert) => {
//     setSelectedExpert(expert);
//   };

//   const handleCloseInfo = () => {
//     setSelectedExpert(null);
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Main content area */}
//       <div
//         className={`transition-all duration-300 ${
//           selectedExpert ? "w-2/3" : "w-full"
//         }`}
//       >
//         <div className="space-y-2">
//           {/* Header row with column labels */}
//           <div className="bg-gray-50 rounded-lg px-6">
//             <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
//               <div>Name</div>
//               <div>Age</div>
//               <div>Volunteers Assigned</div>
//               <div>Programmes Enrolled</div>
//               <div>Organisation</div>
//               <div>Feedback</div>
//             </div>
//           </div>

//           {/* Expert cards */}
//           {experts.map((expert) => (
//             <ExpertCard
//               key={expert.id}
//               expert={expert}
//               onExpertClick={handleExpertClick}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Expert info panel */}
//       {selectedExpert && (
//         <div className="w-1/3 transition-all duration-300">
//           <ExpertInfo expert={selectedExpert} onClose={handleCloseInfo} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExpertsPage;

"use client";
import React, { useState, useEffect } from "react";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { expertAPI } from "@/lib/api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

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

const ExpertCard = ({ expert, onExpertClick, onFeedbackClick, onVolunteersClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onExpertClick(expert)}
          >
            {expert.name}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">{expert.age} yrs</div>

        <div className="text-xs font-bold text-[#4378a4]">
          <span 
            className="hover:text-[#2a5e8a] cursor-pointer hover:underline"
            onClick={() => onVolunteersClick(expert)}
          >
            {expert.assignedVolunteers?.length || 0}
          </span>
        </div>

        <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
          {expert.programmeEnrolled ? getProgrammeName(expert.programmeEnrolledId) : 'Not Enrolled'}
        </div>

        <div className="text-xs font-bold text-[#4378a4]">
          {expert.organisation?.name || 'No Organisation'}
        </div>

        <div>
          <button 
            className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline"
            onClick={() => onFeedbackClick(expert)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackDialog = ({ open, onClose, expert }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Feedback for {expert?.name}</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {expert?.feedback ? (
            <p className="text-gray-700">{expert.feedback}</p>
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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assigned Volunteers ({volunteers?.length || 0})</DialogTitle>
      <DialogContent>
        <div className="py-4">
          {volunteers && volunteers.length > 0 ? (
            <div className="space-y-2">
              {volunteers.map((volunteer, index) => (
                <div key={volunteer.id || index} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{volunteer.name}</div>
                  <div className="text-sm text-gray-600">Email: {volunteer.email}</div>
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

const ExpertInfo = ({ expert, onClose, onDelete }) => {
  const [showAssignedVolunteers, setShowAssignedVolunteers] = useState(false);

  if (!expert) return null;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${expert.name}?`)) {
      try {
        await expertAPI.delete(expert.id);
        onDelete(expert.id);
        onClose();
      } catch (error) {
        console.error('Error deleting expert:', error);
        alert('Failed to delete expert');
      }
    }
  };

  const handleCopy = () => {
    const expertData = JSON.stringify(expert, null, 2);
    navigator.clipboard.writeText(expertData);
    alert('Expert data copied to clipboard');
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      <div className="flex justify-end items-start mb-12">
         <div className="flex gap-2">
           <button onClick={handleCopy} className="text-gray-500 hover:text-blue-600">
             <ContentCopy fontSize="small" />
           </button>
           <button className="text-gray-500 hover:text-green-600">
             <EditIcon fontSize="small" />
           </button>
           <button onClick={handleDelete} className="text-gray-500 hover:text-red-600">
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

      <div className="flex items-center justify-center w-full">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
            <img
              src="/api/placeholder/128/128"
              alt={expert.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        </div>

      <div className="space-y-1 text-xs mt-6">
        <p className="font-semibold text-gray-800">{expert.name}</p>
        <p className="font-semibold text-gray-800">{expert.profession}</p>
        <p className="font-semibold text-gray-800">{expert.educationalQualification}</p>
      </div>
    </div>
    </>
  );
};

const ExpertsPage = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, expert: null });
  const [volunteersDialog, setVolunteersDialog] = useState({ open: false, volunteers: [] });

  // Fetch experts from API
  const fetchExperts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await expertAPI.getAll(page, 10);
      
      if (response.success) {
        setExperts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(response.pagination?.currentPage || 1);
      } else {
        setError(response.message || 'Failed to fetch experts');
      }
    } catch (err) {
      setError('Error fetching experts: ' + err.message);
      console.error('Error fetching experts:', err);
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

  const handleCloseInfo = () => {
    setSelectedExpert(null);
  };

  const handleExpertDelete = (deletedId) => {
    setExperts(experts.filter(expert => expert.id !== deletedId));
  };

  const handleFeedbackClick = (expert) => {
    setFeedbackDialog({ open: true, expert });
  };

  const handleCloseFeedback = () => {
    setFeedbackDialog({ open: false, expert: null });
  };

  const handleVolunteersClick = (expert) => {
    setVolunteersDialog({ 
      open: true, 
      volunteers: expert.assignedVolunteers || [] 
    });
  };

  const handleCloseVolunteers = () => {
    setVolunteersDialog({ open: false, volunteers: [] });
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
              <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
                <div>Name</div>
                <div>Age</div>
                <div>Volunteers Assigned</div>
                <div>Programmes Enrolled</div>
                <div>Organisation</div>
                <div>Feedback</div>
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
                  onExpertClick={handleExpertClick}
                  onFeedbackClick={handleFeedbackClick}
                  onVolunteersClick={handleVolunteersClick}
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

        {/* Expert info panel */}
        {selectedExpert && (
          <div className="w-1/3 transition-all duration-300">
            <ExpertInfo
              expert={selectedExpert}
              onClose={handleCloseInfo}
              onDelete={handleExpertDelete}
            />
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
        open={volunteersDialog.open}
        onClose={handleCloseVolunteers}
        volunteers={volunteersDialog.volunteers}
      />
    </>
  );
};

export default ExpertsPage;