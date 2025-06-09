'use client'
import React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Groups = () => {
  const router = useRouter();
  const groupsData = [
    {
      id: 1,
      name: "COLOUR it",
      image: "/groups/colourit.png", // Replace with your image path
    },
    {
      id: 2,
      name: "Saukhyam",
      image: "/groups/saukhyam.png", // Replace with your image path
    },
    {
      id: 3,
      name: "S.M.I.L.E.",
      image: "/groups/SMILE.png", // Replace with your image path
    },
    {
      id: 4,
      name: "Nirampakaram",
      image: "/groups/nirampakaram.png", // Replace with your image path
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-0">
          <h1 className=" font-bold text-gray-800">Groups</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
        <button className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors">
          <Plus size={18} />
          <span>Add Groups</span>
        </button>
      </div>

      {/* Groups Grid - 4 cards per row */}
      <div className="grid grid-cols-4 gap-6">
        {groupsData.map((group) => (
          <div key={group.id} className="flex flex-col items-center">
            <div
              className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
              onClick={() => router.push("/groups/programmes")}
            >
              {/* Group Image */}
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Group Info */}
            <div className="p-6">
              <h3 className="font-semibold text-center text-gray-800  mb-2">
                {group.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
