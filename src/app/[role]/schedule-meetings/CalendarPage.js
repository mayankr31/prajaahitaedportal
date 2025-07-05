//Calendar Page
"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import { meetingAPI } from "@/lib/api";
import './calendar.css';

const CalendarPage = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meetings from backend
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const response = await meetingAPI.getAll();
        
        if (response.success) {
          const transformedEvents = transformMeetingsToEvents(response.data);
          setMeetings(transformedEvents);
        } else {
          setError('Failed to fetch meetings');
        }
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setError('Error loading meetings');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // Transform backend meeting data to FullCalendar events
  const transformMeetingsToEvents = (meetingsData) => {
    return meetingsData.map(meeting => {
      const baseEvent = {
        id: meeting.id,
        title: meeting.title,
        start: meeting.startDateTime,
        end: meeting.endDateTime,
        allDay: meeting.isAllDay,
        extendedProps: {
          description: meeting.description,
          attendees: meeting.participants,
          location: meeting.location,
          type: meeting.makeOpenEvent ? "External" : "Internal",
          videoCall: meeting.videoCall,
          videoCallLink: meeting.videoCallLink,
          repeat: meeting.repeat,
          originalMeeting: meeting
        },
        color: '#2F699A',
      };

      // Handle recurring events
      if (meeting.repeat && meeting.repeat !== "Does not repeat") {
        const rruleConfig = generateRRule(meeting.repeat, meeting.startDateTime);
        if (rruleConfig) {
          baseEvent.rrule = rruleConfig;
        }
      }

      return baseEvent;
    });
  };

  // Generate RRule configuration for recurring events
  const generateRRule = (repeat, startDateTime) => {
    const startDate = new Date(startDateTime);
    
    const baseRule = {
      dtstart: startDate,
      until: new Date(startDate.getFullYear() + 2, startDate.getMonth(), startDate.getDate()) // 2 years from start
    };

    switch (repeat.toLowerCase()) {
      case 'daily':
        return {
          ...baseRule,
          freq: 'daily'
        };
      
      case 'weekly':
        return {
          ...baseRule,
          freq: 'weekly',
          byweekday: [startDate.getDay()] // Same day of week
        };
      
      case 'monthly':
        return {
          ...baseRule,
          freq: 'monthly',
          bymonthday: [startDate.getDate()] // Same day of month
        };
      
      case 'yearly':
        return {
          ...baseRule,
          freq: 'yearly',
          bymonth: [startDate.getMonth() + 1], // Same month
          bymonthday: [startDate.getDate()] // Same day
        };
      
      default:
        return null;
    }
  };

  // Get event color based on meeting type and video call
  // const getEventColor = (isExternal, videoCall) => {
  //   if (isExternal) return "#f39c12"; // Orange for external
  //   if (videoCall && videoCall !== "none") return "#9b59b6"; // Purple for video calls
  //   return "#3788d8"; // Blue for internal
  // };

  const handleEventClick = (clickInfo) => {
    // For recurring events, we need to reconstruct the meeting data
    const eventProps = clickInfo.event.extendedProps;
    const eventData = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
      description: eventProps.description,
      attendees: eventProps.attendees,
      location: eventProps.location,
      type: eventProps.type,
      videoCall: eventProps.videoCall,
      videoCallLink: eventProps.videoCallLink,
      repeat: eventProps.repeat,
      color: clickInfo.event.backgroundColor
    };
    
    setSelectedMeeting(eventData);
  };

  const handleDateClick = (arg) => {
    // Optional: Handle date clicks to create new meetings
    console.log("Date clicked:", arg.dateStr);
  };

  const closeMeetingDetails = () => {
    setSelectedMeeting(null);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleJoinMeeting = () => {
    if (selectedMeeting?.videoCallLink) {
      window.open(selectedMeeting.videoCallLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meetings...</p>
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
            events={meetings}
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
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
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

      {/* Meeting Details Sidebar - Overlaid on Right */}
      {selectedMeeting && (
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white shadow-2xl border-l border-gray-200 p-6 overflow-y-auto z-50">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-800">Meeting Details</h2>
            <button
              onClick={closeMeetingDetails}
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
            {/* Meeting Title */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedMeeting.title}
              </h3>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedMeeting.type === "Internal"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {selectedMeeting.type}
                </span>
                {selectedMeeting.repeat && selectedMeeting.repeat !== "Does not repeat" && (
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {selectedMeeting.repeat}
                  </span>
                )}
                {selectedMeeting.videoCall && selectedMeeting.videoCall !== "none" && (
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {selectedMeeting.videoCall}
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
                {formatDate(selectedMeeting.start)}
              </p>
              {!selectedMeeting.allDay && (
                <p className="text-gray-600">
                  {formatTime(selectedMeeting.start)} -{" "}
                  {formatTime(selectedMeeting.end)}
                </p>
              )}
              {selectedMeeting.allDay && (
                <p className="text-gray-600">All Day</p>
              )}
            </div>

            {/* Location */}
            {selectedMeeting.location && (
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
                <p className="text-gray-600">{selectedMeeting.location}</p>
              </div>
            )}

            {/* Description */}
            {selectedMeeting.description && (
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
                  {selectedMeeting.description}
                </p>
              </div>
            )}

            {/* Attendees */}
            {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
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
                  Attendees ({selectedMeeting.attendees.length})
                </h4>
                <div className="space-y-2">
                  {selectedMeeting.attendees.map((attendee, index) => (
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

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {selectedMeeting.videoCallLink && (
                <button 
                  onClick={handleJoinMeeting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Join Meeting
                </button>
              )}
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Edit Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;