'use client'
import React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Activities = () => {
  const router = useRouter();
  
  const yesterdayActivities = [
    {
      id: 1,
      name: "Fingerprint Painting",
      image: "/activities/fingerprintpainting.png",
    },
    {
      id: 2,
      name: "Talking art",
      image: "/activities/talkingart.png",
    },
    {
      id: 3,
      name: "Color-ride",
      image: "/activities/color-ride.png",
    },
  ];

  const todayActivities = [
    {
      id: 4,
      name: "Color-ride",
      image: "/activities/color-ride.png",
    },
    {
      id: 5,
      name: "Fingerprint Painting",
      image: "/activities/fingerprintpainting.png",
    },
  ];

  const ActivityCard = ({ activity }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
        onClick={()=>router.push('activities/prerequisites')}
      >
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-center text-gray-800  mb-2">
          {activity.name}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-0">
          <h1 className=" font-bold text-gray-800">Activities Scheduled</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
      </div>

      {/* Yesterday Section */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-800 mb-6">Yesterday</h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {yesterdayActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      {/* Today Section */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-6">Today</h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {todayActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;