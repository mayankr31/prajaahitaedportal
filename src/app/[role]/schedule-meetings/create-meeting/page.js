// //src\app\[role]\schedule-meetings\create-meeting\page.js
// "use client";
// import { useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { CalendarDays, MapPin, Plus, X } from "lucide-react";
// import { meetingAPI } from "@/lib/api";

// const CreateMeetingForm = ({ onSubmit }) => {
//   const router = useRouter();
//   const params = useParams();
//   const role = params.role;
//   const [participants, setParticipants] = useState([""]);
//   const [isAllDay, setIsAllDay] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");
  
//   // Get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   const [formData, setFormData] = useState({
//     title: "",
//     date: getTodayDate(),
//     startTime: "09:00",
//     endTime: "09:45",
//     repeat: "Does not repeat",
//     location: "",
//     description: "",
//     makeOpenEvent: false,
//     videoCall: "",
//     videoCallLink: "",
//   });

//   const timeOptions = Array.from({ length: 48 }, (_, i) => {
//     const hour = Math.floor(i / 2);
//     const minute = i % 2 === 0 ? "00" : "30";
//     return `${hour.toString().padStart(2, '0')}:${minute}`;
//   });

//   // Helper function to convert date and time to ISO string
//   const createISODateTime = (date, time) => {
//     if (!date || !time) return null;
//     return new Date(`${date}T${time}:00`).toISOString();
//   };

//   // Helper function to get end of day ISO string
//   const createEndOfDayISO = (date) => {
//     if (!date) return null;
//     return new Date(`${date}T23:59:59`).toISOString();
//   };

//   // Helper function to get start of day ISO string
//   const createStartOfDayISO = (date) => {
//     if (!date) return null;
//     return new Date(`${date}T00:00:00`).toISOString();
//   };

//   const addParticipant = () => {
//     setParticipants([...participants, ""]);
//   };

//   const removeParticipant = (index) => {
//     if (participants.length > 1) {
//       setParticipants(participants.filter((_, i) => i !== index));
//     }
//   };

//   const updateParticipant = (index, value) => {
//     const updatedParticipants = [...participants];
//     updatedParticipants[index] = value;
//     setParticipants(updatedParticipants);
//   };

//   const handleAllDayChange = (e) => {
//     const checked = e.target.checked;
//     setIsAllDay(checked);

//     if (checked) {
//       setFormData((prev) => ({
//         ...prev,
//         startTime: "00:00",
//         endTime: "23:59",
//       }));
//     } else {
//       // Reset to default times when unchecking all day
//       setFormData((prev) => ({
//         ...prev,
//         startTime: "09:00",
//         endTime: "09:45",
//       }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleTimeChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const newFormData = { ...prev, [name]: value };
      
//       // If start time is changed and it's after end time, adjust end time
//       if (name === "startTime" && value >= prev.endTime) {
//         const startHour = parseInt(value.split(':')[0]);
//         const startMinute = parseInt(value.split(':')[1]);
//         const endTime = new Date();
//         endTime.setHours(startHour, startMinute + 30, 0, 0);
        
//         const endHour = endTime.getHours().toString().padStart(2, '0');
//         const endMinuteStr = endTime.getMinutes().toString().padStart(2, '0');
//         newFormData.endTime = `${endHour}:${endMinuteStr}`;
//       }
      
//       return newFormData;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitMessage("");

//     try {
//       // Validate required fields
//       if (!formData.title.trim()) {
//         throw new Error("Title is required");
//       }
//       if (participants.filter(p => p.trim() !== "").length === 0) {
//         throw new Error("At least one participant is required");
//       }
//       if (!formData.date) {
//         throw new Error("Date is required");
//       }
//       if (!isAllDay && (!formData.startTime || !formData.endTime)) {
//         throw new Error("Start time and end time are required");
//       }
//       if (!isAllDay && formData.startTime >= formData.endTime) {
//         throw new Error("End time must be after start time");
//       }

//       // Create meeting data object with ISO date strings
//       const meetingData = {
//         title: formData.title,
//         date: formData.date,
//         startDateTime: isAllDay 
//           ? createStartOfDayISO(formData.date)
//           : createISODateTime(formData.date, formData.startTime),
//         endDateTime: isAllDay 
//           ? createEndOfDayISO(formData.date)
//           : createISODateTime(formData.date, formData.endTime),
//         isAllDay: isAllDay,
//         repeat: formData.repeat,
//         location: formData.location,
//         description: formData.description,
//         makeOpenEvent: formData.makeOpenEvent,
//         videoCall: formData.videoCall,
//         videoCallLink: formData.videoCallLink,
//         participants: participants.filter((p) => p.trim() !== ""),
//       };

//       console.log("Meeting data to be sent:", meetingData);

//       // Use the meetingAPI.create function
//       const result = await meetingAPI.create(meetingData);

//       if (result.success) {
//         // Show success alert
//         alert("Meeting created successfully!");
        
//         console.log("Meeting created:", result.data);
        
//         // Call parent callback if provided
//         if (onSubmit) {
//           onSubmit(result.data);
//         }

//         // Redirect to schedule-meetings page
//         router.push(`/${role}/schedule-meetings`);
//       } else {
//         throw new Error(result.error || "Failed to create meeting");
//       }
//     } catch (error) {
//       console.error("Error creating meeting:", error);
//       setSubmitMessage(`Error: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       date: getTodayDate(),
//       startTime: "09:00",
//       endTime: "09:45",
//       repeat: "Does not repeat",
//       location: "",
//       description: "",
//       makeOpenEvent: false,
//       videoCall: "",
//       videoCallLink: "",
//     });
//     setParticipants([""]);
//     setIsAllDay(false);
//     setSubmitMessage("");
//   };

//   return (
//     <div className="mx-auto p-6 bg-gray-50">
//       <div className="space-y-6">
//         {/* Success/Error Message */}
//         {submitMessage && (
//           <div className={`p-4 rounded-md ${
//             submitMessage.includes("Error") 
//               ? "bg-red-50 text-red-700 border border-red-200" 
//               : "bg-green-50 text-green-700 border border-green-200"
//           }`}>
//             {submitMessage}
//           </div>
//         )}

//         {/* Title Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Add title <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border text-gray-800 bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//             disabled={isSubmitting}
//           />
//         </div>

//         {/* Participants Field */}
//         <div>
//           <div className="flex justify-between items-center">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Participants <span className="text-red-500">*</span>
//             </label>
//             <button
//               type="button"
//               onClick={addParticipant}
//               disabled={isSubmitting}
//               className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md disabled:opacity-50"
//             >
//               <Plus className="h-4 w-4" />
//             </button>
//           </div>
//           <div className="space-y-2">
//             {participants.map((participant, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <input
//                   type="text"
//                   value={participant}
//                   onChange={(e) => updateParticipant(index, e.target.value)}
//                   placeholder="Enter participant email or name"
//                   className="flex-1 px-3 py-2 bg-white border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required={index === 0}
//                   disabled={isSubmitting}
//                 />
//                 {participants.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeParticipant(index)}
//                     disabled={isSubmitting}
//                     className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Date and Time Row */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Date <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 pr-10 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 disabled={isSubmitting}
//               />
//               <CalendarDays className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
//             </div>
//           </div>

//           {/* Start Time */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Start Time <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="startTime"
//               value={formData.startTime}
//               onChange={handleTimeChange}
//               disabled={isAllDay || isSubmitting}
//               className={`w-full px-3 py-2 bg-white border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                 isAllDay || isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               required={!isAllDay}
//             >
//               {timeOptions.map((time) => (
//                 <option key={time} value={time}>
//                   {time}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* End Time */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               End Time <span className="text-red-500">*</span>
//             </label>
//             <div className="flex items-center space-x-2">
//               <select
//                 name="endTime"
//                 value={formData.endTime}
//                 onChange={handleTimeChange}
//                 disabled={isAllDay || isSubmitting}
//                 className={`flex-1 px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   isAllDay || isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//                 required={!isAllDay}
//               >
//                 {timeOptions.map((time) => (
//                   <option key={time} value={time}>
//                     {time}
//                   </option>
//                 ))}
//               </select>
//               <label className="flex items-center space-x-2 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   name="allDay"
//                   checked={isAllDay}
//                   onChange={handleAllDayChange}
//                   disabled={isSubmitting}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
//                 />
//                 <span>All day</span>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Repeat */}
//         <div>
//           <select
//             name="repeat"
//             value={formData.repeat}
//             onChange={handleInputChange}
//             disabled={isSubmitting}
//             className="px-3 py-2 border bg-white text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
//           >
//             <option>Does not repeat</option>
//             <option>Daily</option>
//             <option>Weekly</option>
//             <option>Monthly</option>
//             <option>Yearly</option>
//           </select>
//         </div>

//         {/* Location */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Add location
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleInputChange}
//               disabled={isSubmitting}
//               className="w-full px-3 py-2 pr-10 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
//             />
//             <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//         </div>

//         {/* Description Text Area */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description
//           </label>
//           <div className="border border-gray-300 rounded-md">
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Type details for this new meeting..."
//               disabled={isSubmitting}
//               className="w-full bg-white text-gray-800 p-3 min-h-32 border-0 focus:outline-none resize-none rounded-md disabled:opacity-50"
//             />
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="text-gray-500 text-sm">or</div>

//         {/* Open Event Checkbox */}
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             id="openEvent"
//             name="makeOpenEvent"
//             checked={formData.makeOpenEvent}
//             onChange={handleInputChange}
//             disabled={isSubmitting}
//             className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
//           />
//           <label htmlFor="openEvent" className="text-sm text-gray-700">
//             Make an Open Event
//           </label>
//           <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
//             ?
//           </div>
//         </div>

//         {/* Video Call */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Add Video Call
//           </label>
//           <select
//             name="videoCall"
//             value={formData.videoCall}
//             onChange={handleInputChange}
//             disabled={isSubmitting}
//             className="px-3 py-2 border bg-white text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
//           >
//             <option value="">Select video call option</option>
//             <option value="zoom">Zoom</option>
//             <option value="google-meet">Google Meet</option>
//             <option value="microsoft-teams">Microsoft Teams</option>
//           </select>
//         </div>

//         {/* Video Call Link */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Video Call Link
//           </label>
//           <input
//             type="url"
//             name="videoCallLink"
//             value={formData.videoCallLink}
//             onChange={handleInputChange}
//             placeholder="Enter the scheduled meeting link (e.g., https://zoom.us/j/123456789)"
//             disabled={isSubmitting}
//             className="w-full px-3 bg-white text-gray-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             Please provide the meeting link from your video conferencing
//             platform
//           </p>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={resetForm}
//             disabled={isSubmitting}
//             className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? "Creating..." : "Create"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateMeetingForm;

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CalendarDays, MapPin, Plus, X, Search, User, UserCheck } from "lucide-react";
import { meetingAPI, studentAPI, volunteerAPI, expertAPI } from "@/lib/api";

const CreateMeetingForm = ({ onSubmit }) => {
  const router = useRouter();
  const params = useParams();
  const role = params.role;
  
  // State for all users and participant selection
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [participantSearchTerm, setParticipantSearchTerm] = useState("");
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  
  const [isAllDay, setIsAllDay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: "",
    date: getTodayDate(),
    startTime: "09:00",
    endTime: "09:45",
    repeat: "Does not repeat",
    location: "",
    description: "",
    makeOpenEvent: false,
    videoCall: "",
    videoCallLink: "",
  });

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // Fetch all users on component mount
  useEffect(() => {
    fetchAllUsers();
    // Get current user email from localStorage or session
    // You might need to adjust this based on your auth system
    const userEmail = localStorage.getItem('userEmail') || 'creator@example.com';
    setCurrentUserEmail(userEmail);
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (participantSearchTerm) {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(participantSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(participantSearchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(participantSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(allUsers);
    }
  }, [participantSearchTerm, allUsers]);

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch all user types
      const [studentsResponse, volunteersResponse, expertsResponse] = await Promise.all([
        studentAPI.getAll(1, 1000), // Get all students
        volunteerAPI.getAll(1, 1000), // Get all volunteers
        expertAPI.getAll(1, 1000) // Get all experts
      ]);

      const users = [];

      // Process students
      if (studentsResponse.success && studentsResponse.data) {
        const students = Array.isArray(studentsResponse.data) ? studentsResponse.data : studentsResponse.data.students || [];
        students.forEach(student => {
          users.push({
            id: student.id,
            name: student.name,
            email: student.email,
            role: 'Student',
            type: 'student'
          });
        });
      }

      // Process volunteers
      if (volunteersResponse.success && volunteersResponse.data) {
        const volunteers = Array.isArray(volunteersResponse.data) ? volunteersResponse.data : volunteersResponse.data.volunteers || [];
        volunteers.forEach(volunteer => {
          users.push({
            id: volunteer.id,
            name: volunteer.name,
            email: volunteer.email,
            role: 'Volunteer',
            type: 'volunteer'
          });
        });
      }

      // Process experts
      if (expertsResponse.success && expertsResponse.data) {
        const experts = Array.isArray(expertsResponse.data) ? expertsResponse.data : expertsResponse.data.experts || [];
        experts.forEach(expert => {
          users.push({
            id: expert.id,
            name: expert.name,
            email: expert.email,
            role: 'Expert',
            type: 'expert'
          });
        });
      }

      setAllUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSubmitMessage('Error loading users. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleParticipantSelect = (user) => {
    if (!selectedParticipants.find(p => p.id === user.id)) {
      setSelectedParticipants([...selectedParticipants, user]);
    }
    setParticipantSearchTerm("");
    setShowParticipantDropdown(false);
  };

  const removeParticipant = (userId) => {
    setSelectedParticipants(selectedParticipants.filter(p => p.id !== userId));
  };

  const addCurrentUserAsParticipant = () => {
    const currentUser = {
      id: 'current-user',
      name: 'Me (Meeting Creator)',
      email: currentUserEmail,
      role: role.charAt(0).toUpperCase() + role.slice(1),
      type: 'creator'
    };
    
    if (!selectedParticipants.find(p => p.id === 'current-user')) {
      setSelectedParticipants([currentUser, ...selectedParticipants]);
    }
  };

  // Helper function to convert date and time to ISO string
  const createISODateTime = (date, time) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}:00`).toISOString();
  };

  // Helper function to get end of day ISO string
  const createEndOfDayISO = (date) => {
    if (!date) return null;
    return new Date(`${date}T23:59:59`).toISOString();
  };

  // Helper function to get start of day ISO string
  const createStartOfDayISO = (date) => {
    if (!date) return null;
    return new Date(`${date}T00:00:00`).toISOString();
  };

  const handleAllDayChange = (e) => {
    const checked = e.target.checked;
    setIsAllDay(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        startTime: "00:00",
        endTime: "23:59",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        startTime: "09:00",
        endTime: "09:45",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      
      if (name === "startTime" && value >= prev.endTime) {
        const startHour = parseInt(value.split(':')[0]);
        const startMinute = parseInt(value.split(':')[1]);
        const endTime = new Date();
        endTime.setHours(startHour, startMinute + 30, 0, 0);
        
        const endHour = endTime.getHours().toString().padStart(2, '0');
        const endMinuteStr = endTime.getMinutes().toString().padStart(2, '0');
        newFormData.endTime = `${endHour}:${endMinuteStr}`;
      }
      
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (selectedParticipants.length === 0) {
        throw new Error("At least one participant is required");
      }
      if (!formData.date) {
        throw new Error("Date is required");
      }
      if (!isAllDay && (!formData.startTime || !formData.endTime)) {
        throw new Error("Start time and end time are required");
      }
      if (!isAllDay && formData.startTime >= formData.endTime) {
        throw new Error("End time must be after start time");
      }

      // Create meeting data object with participant emails
      const meetingData = {
        title: formData.title,
        date: formData.date,
        startDateTime: isAllDay 
          ? createStartOfDayISO(formData.date)
          : createISODateTime(formData.date, formData.startTime),
        endDateTime: isAllDay 
          ? createEndOfDayISO(formData.date)
          : createISODateTime(formData.date, formData.endTime),
        isAllDay: isAllDay,
        repeat: formData.repeat,
        location: formData.location,
        description: formData.description,
        makeOpenEvent: formData.makeOpenEvent,
        videoCall: formData.videoCall,
        videoCallLink: formData.videoCallLink,
        participants: selectedParticipants.map(p => p.email), // Save emails instead of names
      };

      console.log("Meeting data to be sent:", meetingData);

      const result = await meetingAPI.create(meetingData);

      if (result.success) {
        alert("Meeting created successfully!");
        console.log("Meeting created:", result.data);
        
        if (onSubmit) {
          onSubmit(result.data);
        }

        router.push(`/${role}/schedule-meetings`);
      } else {
        throw new Error(result.error || "Failed to create meeting");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: getTodayDate(),
      startTime: "09:00",
      endTime: "09:45",
      repeat: "Does not repeat",
      location: "",
      description: "",
      makeOpenEvent: false,
      videoCall: "",
      videoCallLink: "",
    });
    setSelectedParticipants([]);
    setIsAllDay(false);
    setSubmitMessage("");
    setParticipantSearchTerm("");
    setShowParticipantDropdown(false);
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'volunteer':
        return 'bg-green-100 text-green-800';
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-50">
      <div className="space-y-6">
        {/* Success/Error Message */}
        {submitMessage && (
          <div className={`p-4 rounded-md ${
            submitMessage.includes("Error") 
              ? "bg-red-50 text-red-700 border border-red-200" 
              : "bg-green-50 text-green-700 border border-green-200"
          }`}>
            {submitMessage}
          </div>
        )}

        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border text-gray-800 bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Participants Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Participants <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addCurrentUserAsParticipant}
              disabled={isSubmitting}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md disabled:opacity-50"
            >
              <UserCheck className="h-4 w-4" />
              <span>Add Me</span>
            </button>
          </div>
          
          {/* Selected Participants */}
          {selectedParticipants.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md px-3 py-1"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{participant.name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(participant.role)}`}>
                    {participant.role}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Participant Search */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={participantSearchTerm}
                onChange={(e) => {
                  setParticipantSearchTerm(e.target.value);
                  setShowParticipantDropdown(true);
                }}
                onFocus={() => setShowParticipantDropdown(true)}
                placeholder="Search participants by name, email, or role..."
                className="w-full px-3 py-2 pr-10 bg-white border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting || loadingUsers}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Participant Dropdown */}
            {showParticipantDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {loadingUsers ? (
                  <div className="p-3 text-center text-gray-500">Loading participants...</div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleParticipantSelect(user)}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No participants found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
              <CalendarDays className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <select
              name="startTime"
              value={formData.startTime}
              onChange={handleTimeChange}
              disabled={isAllDay || isSubmitting}
              className={`w-full px-3 py-2 bg-white border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isAllDay || isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              required={!isAllDay}
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleTimeChange}
                disabled={isAllDay || isSubmitting}
                className={`flex-1 px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  isAllDay || isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required={!isAllDay}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="allDay"
                  checked={isAllDay}
                  onChange={handleAllDayChange}
                  disabled={isSubmitting}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span>All day</span>
              </label>
            </div>
          </div>
        </div>

        {/* Repeat */}
        <div>
          <select
            name="repeat"
            value={formData.repeat}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="px-3 py-2 border bg-white text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option>Does not repeat</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add location
          </label>
          <div className="relative">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 pr-10 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Description Text Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <div className="border border-gray-300 rounded-md">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Type details for this new meeting..."
              disabled={isSubmitting}
              className="w-full bg-white text-gray-800 p-3 min-h-32 border-0 focus:outline-none resize-none rounded-md disabled:opacity-50"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="text-gray-500 text-sm">or</div>

        {/* Open Event Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="openEvent"
            name="makeOpenEvent"
            checked={formData.makeOpenEvent}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
          />
          <label htmlFor="openEvent" className="text-sm text-gray-700">
            Make an Open Event
          </label>
          <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
            ?
          </div>
        </div>

        {/* Video Call */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Video Call
          </label>
          <select
            name="videoCall"
            value={formData.videoCall}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="px-3 py-2 border bg-white text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">Select video call option</option>
            <option value="zoom">Zoom</option>
            <option value="google-meet">Google Meet</option>
            <option value="microsoft-teams">Microsoft Teams</option>
          </select>
        </div>

        {/* Video Call Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Call Link
          </label>
          <input
            type="url"
            name="videoCallLink"
            value={formData.videoCallLink}
            onChange={handleInputChange}
            placeholder="Enter the scheduled meeting link (e.g., https://zoom.us/j/123456789)"
            disabled={isSubmitting}
            className="w-full px-3 bg-white text-gray-800 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Please provide the meeting link from your video conferencing platform
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showParticipantDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowParticipantDropdown(false)}
        />
      )}
    </div>
  );
};

export default CreateMeetingForm;