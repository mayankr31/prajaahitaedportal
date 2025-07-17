// //Calendar Page (src\app\[role]\schedule-meetings\CalendarPage.js)
// "use client";
// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import rrulePlugin from "@fullcalendar/rrule";
// import { meetingAPI, activityAPI } from "@/lib/api"; // Import activityAPI
// import './calendar.css'; // Assuming this is for FullCalendar styling

// const CalendarPage = () => {
//   const [selectedEvent, setSelectedEvent] = useState(null); // Renamed from selectedMeeting
//   const [meetings, setMeetings] = useState([]);
//   const [activities, setActivities] = useState([]); // New state for activities
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch meetings and activities from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch Meetings
//         const meetingsResponse = await meetingAPI.getAll();
//         if (meetingsResponse.success) {
//           const transformedMeetings = transformMeetingsToEvents(meetingsResponse.data);
//           setMeetings(transformedMeetings);
//         } else {
//           setError('Failed to fetch meetings');
//           setLoading(false); // Stop loading if meetings fail
//           return; // Exit if meetings fetch fails
//         }

//         // Fetch Activities
//         const activitiesResponse = await activityAPI.getAll(true); // Include prerequisites
//         if (activitiesResponse.success) {
//           const transformedActivities = transformActivitiesToEvents(activitiesResponse.data);
//           setActivities(transformedActivities);
//         } else {
//           setError('Failed to fetch activities');
//           setLoading(false); // Stop loading if activities fail
//           return; // Exit if activities fetch fails
//         }

//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Error loading calendar data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Transform backend meeting data to FullCalendar events
//   const transformMeetingsToEvents = (meetingsData) => {
//     return meetingsData.map(meeting => {
//       const baseEvent = {
//         id: `meeting-${meeting.id}`, // Prefix ID to differentiate
//         title: meeting.title,
//         start: meeting.startDateTime,
//         end: meeting.endDateTime,
//         allDay: meeting.isAllDay,
//         extendedProps: {
//           type: "meeting", // Explicitly mark as meeting
//           description: meeting.description,
//           attendees: meeting.participants,
//           location: meeting.location,
//           eventType: meeting.makeOpenEvent ? "External" : "Internal", // Renamed 'type' to 'eventType' to avoid conflict
//           videoCall: meeting.videoCall,
//           videoCallLink: meeting.videoCallLink,
//           repeat: meeting.repeat,
//           originalMeeting: meeting
//         },
//         color: '#2F699A', // Meeting color
//       };

//       // Handle recurring events
//       if (meeting.repeat && meeting.repeat !== "Does not repeat") {
//         const rruleConfig = generateRRule(meeting.repeat, meeting.startDateTime);
//         if (rruleConfig) {
//           baseEvent.rrule = rruleConfig;
//         }
//       }

//       return baseEvent;
//     });
//   };

//   // Transform backend activity data to FullCalendar events
//   const transformActivitiesToEvents = (activitiesData) => {
//     return activitiesData.map(activity => {
//       // Combine date and time into a single ISO string for FullCalendar
//       const activityDate = new Date(activity.date);
//       let startDateTime = activityDate.toISOString().split('T')[0]; // YYYY-MM-DD
//       let endDateTime = activityDate.toISOString().split('T')[0]; // Default end date to same day

//       if (activity.time) {
//         // Parse time string (e.g., "10:00 AM") and combine with date
//         // A simple way to parse common time formats. For robust parsing, consider a library like date-fns
//         const [timePart, meridiem] = activity.time.split(' ');
//         let [hours, minutes] = timePart.split(':').map(Number);

//         if (meridiem && meridiem.toLowerCase() === 'pm' && hours < 12) {
//           hours += 12;
//         }
//         if (meridiem && meridiem.toLowerCase() === 'am' && hours === 12) { // Midnight case (12 AM)
//           hours = 0;
//         }

//         activityDate.setHours(hours, minutes, 0, 0);
//         startDateTime = activityDate.toISOString();
        
//         // For activities, let's assume they have a default duration, e.g., 1 hour if time is provided
//         const endDate = new Date(activityDate);
//         endDate.setHours(hours + 1, minutes, 0, 0); // Add 1 hour
//         endDateTime = endDate.toISOString();

//       } else {
//         // If no time is provided, treat as all-day event
//         startDateTime = activityDate.toISOString().split('T')[0];
//         endDateTime = activityDate.toISOString().split('T')[0]; // FullCalendar treats end of all-day as exclusive
//       }

//       return {
//         id: `activity-${activity.id}`, // Prefix ID to differentiate
//         title: activity.title,
//         start: startDateTime,
//         end: endDateTime,
//         allDay: !activity.time, // If no time, it's an all-day event
//         extendedProps: {
//           type: "activity", // Explicitly mark as activity
//           imageUrl: activity.imageUrl,
//           pdfUrl: activity.pdfUrl,
//           category: activity.category,
//           feedback: activity.feedback,
//           prerequisites: activity.prerequisites,
//           originalActivity: activity
//         },
//         color: '#8B5CF6', // Activity color (e.g., purple)
//       };
//     });
//   };


//   // Generate RRule configuration for recurring events
//   const generateRRule = (repeat, startDateTime) => {
//     const startDate = new Date(startDateTime);

//     const baseRule = {
//       dtstart: startDate,
//       until: new Date(startDate.getFullYear() + 2, startDate.getMonth(), startDate.getDate()) // 2 years from start
//     };

//     switch (repeat.toLowerCase()) {
//       case 'daily':
//         return {
//           ...baseRule,
//           freq: 'daily'
//         };

//       case 'weekly':
//         return {
//           ...baseRule,
//           freq: 'weekly',
//           byweekday: [startDate.getDay()] // Same day of week (0 for Sunday, 6 for Saturday)
//         };

//       case 'monthly':
//         return {
//           ...baseRule,
//           freq: 'monthly',
//           bymonthday: [startDate.getDate()] // Same day of month
//         };

//       case 'yearly':
//         return {
//           ...baseRule,
//           freq: 'yearly',
//           bymonth: [startDate.getMonth() + 1], // Same month (FullCalendar months are 1-indexed for rrule)
//           bymonthday: [startDate.getDate()] // Same day
//         };

//       default:
//         return null;
//     }
//   };

//   const handleEventClick = (clickInfo) => {
//     const eventProps = clickInfo.event.extendedProps;
//     let eventData = {};

//     if (eventProps.type === "meeting") {
//       eventData = {
//         id: clickInfo.event.id,
//         title: clickInfo.event.title,
//         start: clickInfo.event.start,
//         end: clickInfo.event.end,
//         allDay: clickInfo.event.allDay,
//         description: eventProps.description,
//         attendees: eventProps.attendees,
//         location: eventProps.location,
//         type: eventProps.type, // Keep original type
//         eventType: eventProps.eventType, // Specific for meeting
//         videoCall: eventProps.videoCall,
//         videoCallLink: eventProps.videoCallLink,
//         repeat: eventProps.repeat,
//         color: clickInfo.event.backgroundColor,
//       };
//     } else if (eventProps.type === "activity") {
//       eventData = {
//         id: clickInfo.event.id,
//         title: clickInfo.event.title,
//         start: clickInfo.event.start,
//         end: clickInfo.event.end,
//         allDay: clickInfo.event.allDay,
//         type: eventProps.type, // Keep original type
//         imageUrl: eventProps.imageUrl,
//         pdfUrl: eventProps.pdfUrl,
//         category: eventProps.category,
//         feedback: eventProps.feedback,
//         prerequisites: eventProps.prerequisites,
//         color: clickInfo.event.backgroundColor,
//       };
//     }
//     setSelectedEvent(eventData);
//   };

//   const handleDateClick = (arg) => {
//     // Optional: Handle date clicks to create new meetings or activities
//     console.log("Date clicked:", arg.dateStr);
//   };

//   const closeEventDetails = () => { // Renamed from closeMeetingDetails
//     setSelectedEvent(null);
//   };

//   const formatTime = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     // Check if the date is valid and not an all-day event (where time part might be 00:00:00 UTC)
//     if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0 && !selectedEvent?.allDay) {
//         // This might be an all-day event incorrectly passed, or just midnight
//         return ''; // Or handle specifically
//     }
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };
  

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const handleJoinMeeting = () => {
//     if (selectedEvent?.videoCallLink) {
//       window.open(selectedEvent.videoCallLink, '_blank');
//     }
//   };

//   // Combine meetings and activities for FullCalendar
//   const allEvents = [...meetings, ...activities];

//   if (loading) {
//     return (
//       <div className="h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading calendar data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-red-500 text-xl mb-4">⚠️</div>
//           <p className="text-red-600">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-50 relative flex flex-col">
//       {/* Calendar Section - Full Width with proper height */}
//       <div className="flex-1 p-0 overflow-hidden">
//         <div className="bg-white text-gray-600 rounded-lg shadow-lg p-4 h-full overflow-hidden">
//           <FullCalendar
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
//             initialView="timeGridWeek"
//             headerToolbar={{
//               left: "prev,next today",
//               center: "title",
//               right: "dayGridMonth,timeGridWeek,timeGridDay",
//             }}
//             events={allEvents} // Pass combined events
//             eventClick={handleEventClick}
//             dateClick={handleDateClick}
//             height="100%"
//             contentHeight="auto"
//             slotMinTime="00:00:00"
//             slotMaxTime="24:00:00"
//             slotDuration="00:30:00"
//             slotLabelInterval="01:00:00"
//             scrollTime="08:00:00"
//             scrollTimeReset={false}
//             allDaySlot={true}
//             eventDisplay="block"
//             eventTextColor="white"
//             eventBorderColor="transparent"
//             selectable={true}
//             selectMirror={true}
//             dayMaxEvents={true}
//             weekends={true}
//             nowIndicator={true}
//             eventTimeFormat={{
//               hour: "numeric",
//               minute: "2-digit",
//               meridiem: "short",
//             }}
//             businessHours={{
//               daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
//               startTime: '09:00',
//               endTime: '18:00',
//             }}
//             slotLabelFormat={{
//               hour: 'numeric',
//               minute: '2-digit',
//               meridiem: 'short'
//             }}
//           />
//         </div>
//       </div>

//       {/* Event Details Sidebar - Overlaid on Right */}
//       {selectedEvent && (
//         <div className="absolute top-0 right-0 w-1/3 h-full bg-white shadow-2xl border-l border-gray-200 p-6 overflow-y-auto z-50">
//           <div className="flex justify-between items-start mb-6">
//             <h2 className="text-xl font-bold text-gray-800">
//               {selectedEvent.type === "meeting" ? "Meeting Details" : "Activity Details"}
//             </h2>
//             <button
//               onClick={closeEventDetails}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>

//           <div className="space-y-6">
//             {/* Event Title */}
//             <div>
//               <h3 className="text-2xl font-semibold text-gray-900 mb-2">
//                 {selectedEvent.title}
//               </h3>
//               <div className="flex gap-2 flex-wrap">
//                 {selectedEvent.type === "meeting" && (
//                   <>
//                     <span
//                       className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                         selectedEvent.eventType === "Internal"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-orange-100 text-orange-800"
//                       }`}
//                     >
//                       {selectedEvent.eventType}
//                     </span>
//                     {selectedEvent.repeat && selectedEvent.repeat !== "Does not repeat" && (
//                       <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                         {selectedEvent.repeat}
//                       </span>
//                     )}
//                     {selectedEvent.videoCall && selectedEvent.videoCall !== "none" && (
//                       <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//                         {selectedEvent.videoCall}
//                       </span>
//                     )}
//                   </>
//                 )}
//                 {selectedEvent.type === "activity" && selectedEvent.category && (
//                     <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
//                         Category: {selectedEvent.category}
//                     </span>
//                 )}
//               </div>
//             </div>

//             {/* Date and Time */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                 <svg
//                   className="w-5 h-5 mr-2 text-gray-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//                 Date & Time
//               </h4>
//               <p className="text-gray-600">
//                 {formatDate(selectedEvent.start)}
//               </p>
//               {!selectedEvent.allDay && (
//                 <p className="text-gray-600">
//                   {formatTime(selectedEvent.start)} -{" "}
//                   {formatTime(selectedEvent.end)}
//                 </p>
//               )}
//               {selectedEvent.allDay && (
//                 <p className="text-gray-600">All Day</p>
//               )}
//             </div>

//             {/* MEETING SPECIFIC DETAILS */}
//             {selectedEvent.type === "meeting" && (
//               <>
//                 {selectedEvent.location && (
//                   <div>
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                       <svg
//                         className="w-5 h-5 mr-2 text-gray-500"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                       Location
//                     </h4>
//                     <p className="text-gray-600">{selectedEvent.location}</p>
//                   </div>
//                 )}

//                 {selectedEvent.description && (
//                   <div>
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                       <svg
//                         className="w-5 h-5 mr-2 text-gray-500"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                       Description
//                     </h4>
//                     <p className="text-gray-600 leading-relaxed">
//                       {selectedEvent.description}
//                     </p>
//                   </div>
//                 )}

//                 {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
//                       <svg
//                         className="w-5 h-5 mr-2 text-gray-500"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                         />
//                       </svg>
//                       Attendees ({selectedEvent.attendees.length})
//                     </h4>
//                     <div className="space-y-2">
//                       {selectedEvent.attendees.map((attendee, index) => (
//                         <div key={index} className="flex items-center space-x-3">
//                           <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                             <span className="text-white text-sm font-medium">
//                               {attendee
//                                 .split(" ")
//                                 .map((n) => n[0])
//                                 .join("")
//                                 .toUpperCase()}
//                             </span>
//                           </div>
//                           <span className="text-gray-700">{attendee}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* ACTIVITY SPECIFIC DETAILS */}
//             {selectedEvent.type === "activity" && (
//               <>
//                 {selectedEvent.imageUrl && (
//                     <div>
//                         <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                             <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L20 20m-6-6l-2 2m2-2l-2-2m7-2h-2m-2 0H5V5h14v14z" />
//                             </svg>
//                             Image
//                         </h4>
//                         <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-auto rounded-lg object-cover mb-2" />
//                         <a href={selectedEvent.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Image</a>
//                     </div>
//                 )}
//                 {selectedEvent.pdfUrl && (
//                     <div>
//                         <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                             <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                             </svg>
//                             Document
//                         </h4>
//                         <a href={selectedEvent.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
//                     </div>
//                 )}
//                 {selectedEvent.feedback && (
//                     <div>
//                         <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                             <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8h-4a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
//                             </svg>
//                             Feedback
//                         </h4>
//                         <p className="text-gray-600 leading-relaxed">{selectedEvent.feedback}</p>
//                     </div>
//                 )}
//                 {selectedEvent.prerequisites && selectedEvent.prerequisites.length > 0 && (
//                     <div>
//                         <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                             <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                             </svg>
//                             Prerequisites
//                         </h4>
//                         <ul className="list-disc list-inside text-gray-600">
//                             {selectedEvent.prerequisites.map((req, index) => (
//                                 <li key={index}>{req.name}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//               </>
//             )}

//             {/* Action Buttons */}
//             <div className="pt-4 border-t border-gray-200 space-y-3">
//               {selectedEvent.type === "meeting" && selectedEvent.videoCallLink && (
//                 <button
//                   onClick={handleJoinMeeting}
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Join Meeting
//                 </button>
//               )}
//               <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
//                 {selectedEvent.type === "meeting" ? "Edit Meeting" : "Edit Activity"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CalendarPage;

// src\app\[role]\schedule-meetings\CalendarPage.js
"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { meetingAPI, activityAPI } from "@/lib/api";
import { useSession } from "next-auth/react"; // Import useSession
import './calendar.css';
import { Typography } from "@mui/material";

// Receive userRole as a prop
const CalendarPage = ({ userRole }) => {
  const { data: session, status } = useSession(); // Get session details
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meetings and activities from backend
  const fetchData = async () => {
    if (status === "loading") return; // Wait for session to load

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Fetch Meetings
      const meetingsResponse = await meetingAPI.getAll();
      if (meetingsResponse.success) {
        // Filter meetings based on approval status for calendar display
        // Only APPROVED meetings should be displayed on the calendar for all roles
        const approvedMeetings = meetingsResponse.data.filter(
          (meeting) => meeting.approvalStatus === "APPROVED"
        );
        const transformedMeetings = transformMeetingsToEvents(approvedMeetings);
        setMeetings(transformedMeetings);
      } else {
        setError('Failed to fetch meetings');
        setLoading(false);
        return;
      }

      // Fetch Activities (assuming activities also have an approval status and should be filtered)
      // NOTE: Your activity schema doesn't have approval fields.
      // If activities also need approval, you'll need to update the Activity model in Prisma
      // and its API routes similarly to how we did for Groups and Meetings.
      // For now, I'm assuming activities are always "approved" or don't have an approval flow,
      // so we fetch all of them. If you add approval to activities, you'll need to filter them here too.
      const activitiesResponse = await activityAPI.getAll(true);
      if (activitiesResponse.success) {
        const transformedActivities = transformActivitiesToEvents(activitiesResponse.data);
        setActivities(transformedActivities);
      } else {
        setError('Failed to fetch activities');
        setLoading(false);
        return;
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error loading calendar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session, userRole, status]); // Re-fetch when session or userRole changes, or auth status is ready

  // Transform backend meeting data to FullCalendar events
  const transformMeetingsToEvents = (meetingsData) => {
    return meetingsData.map(meeting => {
      const baseEvent = {
        id: `meeting-${meeting.id}`,
        title: meeting.title,
        start: meeting.startDateTime,
        end: meeting.endDateTime,
        allDay: meeting.isAllDay,
        extendedProps: {
          type: "meeting",
          description: meeting.description,
          attendees: meeting.participants,
          location: meeting.location,
          eventType: meeting.makeOpenEvent ? "External" : "Internal",
          videoCall: meeting.videoCall,
          videoCallLink: meeting.videoCallLink,
          repeat: meeting.repeat,
          originalMeeting: meeting,
          // Add approval status to extendedProps for potential future use in details sidebar
          approvalStatus: meeting.approvalStatus,
          createdBy: meeting.createdBy,
          approvedBy: meeting.approvedBy,
          rejectionMessage: meeting.rejectionMessage,
        },
        color: '#2F699A', // Meeting color
      };

      if (meeting.repeat && meeting.repeat !== "Does not repeat") {
        const rruleConfig = generateRRule(meeting.repeat, meeting.startDateTime);
        if (rruleConfig) {
          baseEvent.rrule = rruleConfig;
        }
      }
      return baseEvent;
    });
  };

  // Transform backend activity data to FullCalendar events (no changes here as approval is not in schema)
  const transformActivitiesToEvents = (activitiesData) => {
    return activitiesData.map(activity => {
      const activityDate = new Date(activity.date);
      let startDateTime = activityDate.toISOString().split('T')[0];
      let endDateTime = activityDate.toISOString().split('T')[0];

      if (activity.time) {
        const [timePart, meridiem] = activity.time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (meridiem && meridiem.toLowerCase() === 'pm' && hours < 12) {
          hours += 12;
        }
        if (meridiem && meridiem.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }

        activityDate.setHours(hours, minutes, 0, 0);
        startDateTime = activityDate.toISOString();

        const endDate = new Date(activityDate);
        endDate.setHours(hours + 1, minutes, 0, 0);
        endDateTime = endDate.toISOString();

      } else {
        startDateTime = activityDate.toISOString().split('T')[0];
        endDateTime = activityDate.toISOString().split('T')[0];
      }

      return {
        id: `activity-${activity.id}`,
        title: activity.title,
        start: startDateTime,
        end: endDateTime,
        allDay: !activity.time,
        extendedProps: {
          type: "activity",
          imageUrl: activity.imageUrl,
          pdfUrl: activity.pdfUrl,
          category: activity.category,
          feedback: activity.feedback,
          prerequisites: activity.prerequisites,
          originalActivity: activity
        },
        color: '#8B5CF6',
      };
    });
  };

  // Generate RRule configuration for recurring events (no changes)
  const generateRRule = (repeat, startDateTime) => {
    const startDate = new Date(startDateTime);

    const baseRule = {
      dtstart: startDate,
      until: new Date(startDate.getFullYear() + 2, startDate.getMonth(), startDate.getDate())
    };

    switch (repeat.toLowerCase()) {
      case 'daily':
        return { ...baseRule, freq: 'daily' };
      case 'weekly':
        return { ...baseRule, freq: 'weekly', byweekday: [startDate.getDay()] };
      case 'monthly':
        return { ...baseRule, freq: 'monthly', bymonthday: [startDate.getDate()] };
      case 'yearly':
        return { ...baseRule, freq: 'yearly', bymonth: [startDate.getMonth() + 1], bymonthday: [startDate.getDate()] };
      default:
        return null;
    }
  };

  const handleEventClick = (clickInfo) => {
    const eventProps = clickInfo.event.extendedProps;
    let eventData = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
      type: eventProps.type,
      color: clickInfo.event.backgroundColor,
    };

    if (eventProps.type === "meeting") {
      eventData = {
        ...eventData,
        description: eventProps.description,
        attendees: eventProps.attendees,
        location: eventProps.location,
        eventType: eventProps.eventType,
        videoCall: eventProps.videoCall,
        videoCallLink: eventProps.videoCallLink,
        repeat: eventProps.repeat,
        // Include approval status and related info in selectedEvent
        approvalStatus: eventProps.approvalStatus,
        createdBy: eventProps.createdBy,
        approvedBy: eventProps.approvedBy,
        rejectionMessage: eventProps.rejectionMessage,
      };
    } else if (eventProps.type === "activity") {
      eventData = {
        ...eventData,
        imageUrl: eventProps.imageUrl,
        pdfUrl: eventProps.pdfUrl,
        category: eventProps.category,
        feedback: eventProps.feedback,
        prerequisites: eventProps.prerequisites,
      };
    }
    setSelectedEvent(eventData);
  };

  const handleDateClick = (arg) => {
    console.log("Date clicked:", arg.dateStr);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0 && !selectedEvent?.allDay) {
      return '';
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleJoinMeeting = () => {
    if (selectedEvent?.videoCallLink) {
      window.open(selectedEvent.videoCallLink, '_blank');
    }
  };

  const allEvents = [...meetings, ...activities];

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 relative flex flex-col">
      {/* Calendar Section - Full Width with proper height */}
      <div className="flex-1 p-0 overflow-hidden">
        <div className="bg-white text-gray-600 rounded-lg shadow-lg p-4 h-full overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={allEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="100%"
            contentHeight="auto"
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            scrollTime="08:00:00"
            scrollTimeReset={false}
            allDaySlot={true}
            eventDisplay="block"
            eventTextColor="white"
            eventBorderColor="transparent"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: '09:00',
              endTime: '18:00',
            }}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </div>
      </div>

      {/* Event Details Sidebar - Overlaid on Right */}
      {selectedEvent && (
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white shadow-2xl border-l border-gray-200 p-6 overflow-y-auto z-50">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedEvent.type === "meeting" ? "Meeting Details" : "Activity Details"}
            </h2>
            <button
              onClick={closeEventDetails}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Event Title */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedEvent.title}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {selectedEvent.type === "meeting" && (
                  <>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEvent.eventType === "Internal"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedEvent.eventType}
                    </span>
                    {selectedEvent.repeat && selectedEvent.repeat !== "Does not repeat" && (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {selectedEvent.repeat}
                      </span>
                    )}
                    {selectedEvent.videoCall && selectedEvent.videoCall !== "none" && (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {selectedEvent.videoCall}
                      </span>
                    )}
                    {/* Display approval status for meetings in the details sidebar */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEvent.approvalStatus === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : selectedEvent.approvalStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      Status: {selectedEvent.approvalStatus}
                    </span>
                  </>
                )}
                {selectedEvent.type === "activity" && selectedEvent.category && (
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    Category: {selectedEvent.category}
                  </span>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Date & Time
              </h4>
              <p className="text-gray-600">
                {formatDate(selectedEvent.start)}
              </p>
              {!selectedEvent.allDay && (
                <p className="text-gray-600">
                  {formatTime(selectedEvent.start)} -{" "}
                  {formatTime(selectedEvent.end)}
                </p>
              )}
              {selectedEvent.allDay && (
                <p className="text-gray-600">All Day</p>
              )}
            </div>

            {/* MEETING SPECIFIC DETAILS */}
            {selectedEvent.type === "meeting" && (
              <>
                {selectedEvent.location && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Location
                    </h4>
                    <p className="text-gray-600">{selectedEvent.location}</p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Description
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      Attendees ({selectedEvent.attendees.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {attendee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-700">{attendee}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created By / Approved By / Rejection Message */}
                {(selectedEvent.createdBy || selectedEvent.approvedBy || selectedEvent.rejectionMessage) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedEvent.createdBy && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Created By:</strong> {selectedEvent.createdBy?.name || 'Unknown'} ({selectedEvent.createdBy?.email || 'N/A'}) - {selectedEvent.createdBy?.role || 'N/A'}
                      </Typography>
                    )}
                    {selectedEvent.approvedBy && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Approved By:</strong> {selectedEvent.approvedBy?.name || 'Unknown'} ({selectedEvent.approvedBy?.email || 'N/A'}) - {selectedEvent.approvedBy?.role || 'N/A'}
                      </Typography>
                    )}
                    {selectedEvent.rejectionMessage && selectedEvent.approvalStatus === "REJECTED" && (
                      <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                        <strong>Rejection Reason:</strong> {selectedEvent.rejectionMessage}
                      </Typography>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ACTIVITY SPECIFIC DETAILS */}
            {selectedEvent.type === "activity" && (
              <>
                {selectedEvent.imageUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L20 20m-6-6l-2 2m2-2l-2-2m7-2h-2m-2 0H5V5h14v14z" />
                      </svg>
                      Image
                    </h4>
                    <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-auto rounded-lg object-cover mb-2" />
                    <a href={selectedEvent.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Image</a>
                  </div>
                )}
                {selectedEvent.pdfUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Document
                    </h4>
                    <a href={selectedEvent.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                  </div>
                )}
                {selectedEvent.feedback && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8h-4a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
                      </svg>
                      Feedback
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{selectedEvent.feedback}</p>
                  </div>
                )}
                {selectedEvent.prerequisites && selectedEvent.prerequisites.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Prerequisites
                    </h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {selectedEvent.prerequisites.map((req, index) => (
                        <li key={index}>{req.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {selectedEvent.type === "meeting" && selectedEvent.videoCallLink && (
                <button
                  onClick={handleJoinMeeting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Join Meeting
                </button>
              )}
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                {selectedEvent.type === "meeting" ? "Edit Meeting" : "Edit Activity"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
