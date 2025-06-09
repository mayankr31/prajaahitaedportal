import React from "react";
import { Plus } from "lucide-react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Page(props) {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center justify-center space-x-0">
           <CalendarMonthIcon className="text-[#2F699A] mr-2" style={{ fontSize: 28 }} />
          <h1 className=" font-bold text-gray-800">Calender</h1>
        </div>
        <button className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors">
          <Plus size={18} />
          <span>Create</span>
        </button>
      </div>
    </div>
  );
}
