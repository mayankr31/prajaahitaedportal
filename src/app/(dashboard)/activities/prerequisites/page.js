import React from "react";
import { Plus, ChevronRight } from "lucide-react";

const Prerequisites = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-gray-800">Activities Scheduled</h1>
          <ChevronRight className="text-gray-800" size={20} />
          <h1 className="font-bold text-gray-800">Pre- Requisites Available</h1>
        </div>
      </div>

      {/* Prerequisites Grid - 3 cards per row */}
      <div className="grid grid-cols-3 gap-8">
        <div
          className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
        //   onClick={() => router.push("/groups/programmes")}
        >
          <img
            src='/activities/sumurays.png'
            alt='Sum-u-rays'
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Prerequisites;
