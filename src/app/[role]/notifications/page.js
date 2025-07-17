// src/app/[role]/notifications/page.js
'use client';

import { useState, useEffect } from 'react';
import { Ellipsis, X, CalendarDays, MapPin, AlignLeft, Users } from 'lucide-react';
import { meetingAPI } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation'; // Import useParams

// Helper function to format time (e.g., "9:30 AM")
const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle 0-hour (midnight) as 12 AM
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

// Helper function to format date (e.g., "May 23, 2024")
const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

// Helper function to determine the status of a meeting based on current time
const getMeetingStatus = (startDateTime, endDateTime) => {
  const now = new Date();
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (now > end) {
    return "Meeting Ended";
  } else if (now < start) {
    const diffMinutes = Math.round((start - now) / (1000 * 60));
    if (diffMinutes <= 60 && diffMinutes > 0) {
      return `Starting in ${diffMinutes}m`;
    } else if (diffMinutes <= 0) {
      return "Starting soon"; // Meeting is very close to starting
    }
    return "Upcoming"; // Meeting is upcoming but not within an hour
  } else {
    return "In Progress"; // Meeting is currently happening
  }
};

// MeetingCard component for displaying individual meeting details
const MeetingCard = ({ meeting, showUpcomingLabel = false, onClick }) => (
  <div
    className={`${meeting.status === "Meeting Ended" ? "bg-gray-200 hover:bg-gray-300" : "bg-white hover:bg-gray-100"} rounded-lg px-4 py-6 mb-3 flex justify-between items-center transition-colors cursor-pointer`}
    onClick={() => onClick(meeting)}
  >
    <div className="flex flex-col">
      {showUpcomingLabel && (
        <span className="text-[11px] text-gray-500 mb-1 font-medium">Upcoming Meeting</span>
      )}
      <h3 className="font-semibold text-gray-900 text-xl">{meeting.title}</h3>
    </div>
    <div className="text-right">
      <div className="text-xs font-semibold text-gray-600 mb-1">{meeting.time}</div>
      <div className={`text-xs font-semibold ${
        meeting.status === "Meeting Ended"
          ? "text-red-500"
          : meeting.status.startsWith("Starting in") || meeting.status === "Starting soon" || meeting.status === "In Progress"
            ? "text-green-600"
            : "text-green-500" // Default color for other statuses
      }`}>
        {meeting.status}
      </div>
    </div>
  </div>
);

export default function Notifications() {
  const { data: session, status } = useSession();
  const params = useParams(); // Get params from the URL
  const currentUserRole = params.role; // Extract the role from params

  const [yesterdayMeetings, setYesterdayMeetings] = useState([]);
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const fetchAndFilterMeetings = async () => {
    if (status === 'loading') return;
    if (!session || !session.user || !session.user.email) {
      setLoading(false);
      setError("Unauthorized: Please log in to view your meetings.");
      return;
    }

    const currentUserEmail = session.user.email;

    try {
      setLoading(true);
      setError(null);
      const response = await meetingAPI.getAll();

      if (response.success) {
        const allMeetings = response.data;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        const filteredTodayMeetings = [];
        const filteredYesterdayMeetings = [];

        allMeetings.forEach(meeting => {
          // Check if the current user is a participant or if the role is 'admin'
          const isParticipant = meeting.participants.includes(currentUserEmail);
          const shouldDisplayMeeting = currentUserRole === "admin" || currentUserRole === "expert" || isParticipant;

          if (shouldDisplayMeeting) {
            const meetingDate = new Date(meeting.startDateTime);
            const meetingDay = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate());

            const formattedMeeting = {
              id: meeting.id,
              title: meeting.title,
              time: `${formatTime(meeting.startDateTime)} - ${formatTime(meeting.endDateTime)}`,
              status: getMeetingStatus(meeting.startDateTime, meeting.endDateTime),
              isUpcoming: false,
              originalStartDateTime: meeting.startDateTime,
              location: meeting.location,
              description: meeting.description,
              participants: meeting.participants,
              start: meeting.startDateTime,
              end: meeting.endDateTime,
              eventType: "Internal",
              repeat: meeting.repeat,
              videoCall: meeting.videoCall,
              videoCallLink: meeting.videoCallLink,
              approvalStatus: meeting.approvalStatus,
              createdBy: meeting.createdBy,
              approvedBy: meeting.approvedBy,
              rejectionMessage: meeting.rejectionMessage,
              type: "meeting",
              isAllDay: meeting.isAllDay,
            };

            if (meetingDay.getTime() === today.getTime()) {
              if (new Date(meeting.startDateTime) > now) {
                formattedMeeting.isUpcoming = true;
              }
              filteredTodayMeetings.push(formattedMeeting);
            } else if (meetingDay.getTime() === yesterday.getTime()) {
              filteredYesterdayMeetings.push(formattedMeeting);
            }
          }
        });

        filteredYesterdayMeetings.sort((a, b) => new Date(a.originalStartDateTime) - new Date(b.originalStartDateTime));
        filteredTodayMeetings.sort((a, b) => new Date(a.originalStartDateTime) - new Date(b.originalStartDateTime));

        setYesterdayMeetings(filteredYesterdayMeetings);
        setTodayMeetings(filteredTodayMeetings);
      } else {
        setError(response.error || 'Failed to fetch meetings');
      }
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError('Failed to fetch meetings due to a network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndFilterMeetings();
  }, [session, status, currentUserRole]); // Add currentUserRole to dependency array

  const handleMeetingCardClick = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const closeMeetingDetails = () => {
    setSelectedMeeting(null);
  };

  const handleJoinMeeting = () => {
    if (selectedMeeting && selectedMeeting.videoCallLink) {
      window.open(selectedMeeting.videoCallLink, '_blank');
    }
  };

  if (status === 'loading' || loading) {
    return <div className="p-6 text-center">Loading meetings...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!session || !session.user || !session.user.email) {
    return <div className="p-6 text-center text-red-500">Please log in to view your notifications.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative flex">
      <div className="w-full">
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Today's Meeting Schedule
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Ellipsis className='w-5 h-5 text-gray-500'/>
            </button>
          </div>
          <div className="space-y-3">
            {todayMeetings.length > 0 ? (
              todayMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  showUpcomingLabel={meeting.isUpcoming}
                  onClick={handleMeetingCardClick}
                />
              ))
            ) : (
              <p className="text-gray-600">No meetings today where you are a participant.</p>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Yesterday's Meeting Schedule
          </h2>
          <div className="space-y-3">
            {yesterdayMeetings.length > 0 ? (
              yesterdayMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} onClick={handleMeetingCardClick} />
              ))
            ) : (
              <p className="text-gray-600">No meetings yesterday where you were a participant.</p>
            )}
          </div>
        </section>
      </div>

      {selectedMeeting && (
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white shadow-2xl border-l border-gray-200 p-6 overflow-y-auto z-50">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Meeting Details
            </h2>
            <button
              onClick={closeMeetingDetails}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedMeeting.title}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {selectedMeeting.type === "meeting" && (
                  <>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedMeeting.eventType === "Internal"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {selectedMeeting.eventType}
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
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedMeeting.approvalStatus === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : selectedMeeting.approvalStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      Status: {selectedMeeting.approvalStatus}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
                Date & Time
              </h4>
              <p className="text-gray-600">
                {formatDate(selectedMeeting.start)}
              </p>
              {!selectedMeeting.isAllDay && (
                <p className="text-gray-600">
                  {formatTime(selectedMeeting.start)} -{" "}
                  {formatTime(selectedMeeting.end)}
                </p>
              )}
              {selectedMeeting.isAllDay && (
                <p className="text-gray-600">All Day</p>
              )}
            </div>

            {selectedMeeting.type === "meeting" && (
              <>
                {selectedMeeting.location && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      Location
                    </h4>
                    <p className="text-gray-600">{selectedMeeting.location}</p>
                  </div>
                )}

                {selectedMeeting.description && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <AlignLeft className="w-5 h-5 mr-2 text-gray-500" />
                      Description
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedMeeting.description}
                    </p>
                  </div>
                )}

                {selectedMeeting.participants && selectedMeeting.participants.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-gray-500" />
                      Participants ({selectedMeeting.participants.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedMeeting.participants.map((participant, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {participant
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-700">{participant}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedMeeting.createdBy || selectedMeeting.approvedBy || selectedMeeting.rejectionMessage) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedMeeting.createdBy && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Created By:</strong> {selectedMeeting.createdBy.name || 'Unknown'} ({selectedMeeting.createdBy.email || 'N/A'}) - {selectedMeeting.createdBy.role || 'N/A'}
                      </p>
                    )}
                    {selectedMeeting.approvedBy && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Approved By:</strong> {selectedMeeting.approvedBy.name || 'Unknown'} ({selectedMeeting.approvedBy.email || 'N/A'}) - {selectedMeeting.approvedBy.role || 'N/A'}
                      </p>
                    )}
                    {selectedMeeting.rejectionMessage && selectedMeeting.approvalStatus === "REJECTED" && (
                      <p className="text-sm text-red-600 mt-1">
                        <strong>Rejection Reason:</strong> {selectedMeeting.rejectionMessage}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

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
}