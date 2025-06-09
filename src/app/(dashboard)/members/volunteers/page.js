"use client";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";

const VolunteerCard = ({ volunteer, onVolunteerClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onVolunteerClick(volunteer)}
          >
            {volunteer.name}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">{volunteer.age}</div>

        <div className="text-xs font-bold text-[#4378a4]">
          {volunteer.childrenAssigned}
        </div>

        <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
          {volunteer.programmesEnrolled}
        </div>

        <div className="text-xs font-bold text-[#4378a4]">
          {volunteer.organisation}
        </div>

        <div>
          <button className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline">
            {volunteer.feedback}
          </button>
        </div>
      </div>
    </div>
  );
};

const VolunteerInfo = ({ volunteer, onClose }) => {
  if (!volunteer) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      <div className="flex justify-end items-start mb-3">
        <div className="flex gap-2">
          <button className="text-gray-500 hover:text-blue-600">
            <ContentCopy fontSize="small" />
          </button>
          <button className="text-gray-500 hover:text-green-600">
            <EditIcon fontSize="small" />
          </button>
          <button className="text-gray-500 hover:text-red-600">
            <Delete fontSize="small" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Close fontSize="small" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center w-full mb-12">
        <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
          <img
            src="/api/placeholder/64/64"
            alt={volunteer.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="font-semibold text-gray-800">Name:</span>
          <span className="text-gray-500"> {volunteer.name}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Age:</span>
          <span className="text-gray-500"> {volunteer.age}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Email:</span>
          <span className="text-gray-500"> komal.motwani051@nmims.edu.in</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Contact No:</span>
          <span className="text-gray-500"> 8489968810</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Educational Qualification:
          </span>
          <span className="text-gray-500"> BA in Political Science</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Comfortable Language:
          </span>
          <span className="text-gray-500"> English</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Experience:</span>
          <span className="text-gray-500">
            {" "}
            Worked as volunteer in prajaahita before in every-ready-day and
            worked as volunteer in DDMA (District Disaster Management Govt of
            Kerala) and many volunteering camps.
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Profession:</span>
          <span className="text-gray-500"> College Student</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            What motivates you to Apply:
          </span>
          <span className="text-gray-500">
            {" "}
            For my self happiness by gathering their happiness and for a new
            experience which will add on my life and career.
          </span>
        </div>
      </div>
    </div>
  );
};

const VolunteersPage = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const volunteers = [
    {
      id: 1,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 2,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 3,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 4,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 5,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 6,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 7,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 8,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
    {
      id: 9,
      name: "Komal Motwani",
      age: "22 yrs",
      childrenAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
    },
  ];

  const handleVolunteerClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  const handleCloseInfo = () => {
    setSelectedVolunteer(null);
  };

  return (
    <div className="flex gap-6">
      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          selectedVolunteer ? "w-2/3" : "w-full"
        }`}
      >
        <div className="space-y-2">
          {/* Header row with column labels */}
          <div className="bg-gray-50 rounded-lg px-6">
            <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
              <div>Name</div>
              <div>Age</div>
              <div>Children Assigned</div>
              <div>Programmes Enrolled</div>
              <div>Organisation</div>
              <div>Feedback</div>
            </div>
          </div>

          {/* Volunteer cards */}
          {volunteers.map((volunteer) => (
            <VolunteerCard
              key={volunteer.id}
              volunteer={volunteer}
              onVolunteerClick={handleVolunteerClick}
            />
          ))}
        </div>
      </div>

      {/* Volunteer info panel */}
      {selectedVolunteer && (
        <div className="w-1/3 transition-all duration-300">
          <VolunteerInfo
            volunteer={selectedVolunteer}
            onClose={handleCloseInfo}
          />
        </div>
      )}
    </div>
  );
};

export default VolunteersPage;
