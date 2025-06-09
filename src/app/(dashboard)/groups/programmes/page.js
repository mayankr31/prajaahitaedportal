import React from "react";
import { Plus, ChevronRight } from "lucide-react";

const Programmes = () => {
  const programmesData = [
    {
      id: 1,
      name: "Creative Arts Program",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200", // Replace with your image path
      color: "bg-blue-100"
    },
    {
      id: 2,
      name: "Arts & Crafts Workshop",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200", // Replace with your image path
      color: "bg-green-100"
    },
    {
      id: 3,
      name: "Digital Learning Hub",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200", // Replace with your image path
      color: "bg-purple-100"
    },
    {
      id: 4,
      name: "Reading & Literature",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200", // Replace with your image path
      color: "bg-orange-100"
    },
    {
      id: 5,
      name: "Science & Discovery",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200", // Replace with your image path
      color: "bg-teal-100"
    },
    {
      id: 6,
      name: "Music & Performance",
      totalMembers: 220,
      students: 150,
      volunteers: 50,
      specialEducators: 20,
      image: "/api/placeholder/300/200", // Replace with your image path
      color: "bg-pink-100"
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-gray-800">Groups</h1>
          <ChevronRight className="text-gray-800" size={20} />
          <h1 className="font-bold text-gray-800">All Programmes</h1>
        </div>
        <button className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors">
          <Plus size={18} />
          <span>Add Programmes</span>
        </button>
      </div>

      {/* Programmes Grid - 3 cards per row */}
      <div className="grid grid-cols-3 gap-8">
        {programmesData.map((programme) => (
          <div key={programme.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Programme Content */}
            <div className="px-6 py-10">
              {/* Image and Info Side by Side */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                {/* Programme Image in Circle */}
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src={programme.image}
                    alt={programme.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </div>
                
                {/* Programme Info */}
                <div className="flex-1">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Total Members : {programme.totalMembers}
                    </h3>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Students : {programme.students}</div>
                    <div>Volunteers : {programme.volunteers}</div>
                    <div>Special Educators : {programme.specialEducators}</div>
                  </div>
                </div>
              </div>
              
              {/* See Details Button */}
              <button className="w-full bg-[#2F699A] text-sm text-white py-3 rounded-lg hover:bg-[#25547b] transition-colors font-medium">
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programmes;