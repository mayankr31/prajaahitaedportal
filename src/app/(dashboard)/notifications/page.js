// app/notifications/page.js
import { auth } from '@/auth';
import { Ellipsis } from 'lucide-react';
export default async function  Notifications()  {
  const yesterdayMeetings = [
    {
      id: 1,
      title: "CMC Vellore",
      time: "9:30 - 12:00",
      status: "Meeting Ended"
    },
    {
      id: 2,
      title: "Colour it",
      time: "9:30 - 12:00",
      status: "Meeting Ended"
    },
    {
      id: 3,
      title: "CMC Vellore",
      time: "9:30 - 12:00",
      status: "Meeting Ended"
    },
    {
      id: 4,
      title: "S.M.I.L.E",
      time: "9:30 - 12:00",
      status: "Meeting Ended"
    }
  ];

  const todayMeetings = [
    {
      id: 1,
      title: "Colour it",
      time: "9:30 - 12:00",
      status: "Starting in 30m",
      isUpcoming: true
    },
    {
      id: 2,
      title: "CMC Vellore",
      time: "9:30 - 12:00",
      status: "Starting in 30m",
      isUpcoming: true
    }
  ];

  const MeetingCard = ({ meeting, showUpcomingLabel = false }) => (
    <div className={`${meeting.status === "Meeting Ended" ? "bg-gray-200 hover:bg-gray-300" : "bg-white hover:bg-gray-100"} rounded-lg px-4 py-6 mb-3 flex justify-between items-center  transition-colors`}>
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
            : "text-green-600"
        }`}>
          {meeting.status}
        </div>
      </div>
    </div>
  );

  const session = await auth();
  console.log("Session:", session);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto">
        {/* Yesterday's Meeting Schedule */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Yesterday's Meeting Schedule
          </h2>
          <div className="space-y-3">
            {yesterdayMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </section>

        {/* Today's Meeting Schedule */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Today's Meeting Schedule
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              {/* <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg> */}
              <Ellipsis className='w-5 h-5 text-gray-500'/>
            </button>
          </div>
          <div className="space-y-3">
            {todayMeetings.map((meeting) => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                showUpcomingLabel={meeting.isUpcoming}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}