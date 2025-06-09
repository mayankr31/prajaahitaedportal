"use client";
import React, { useState } from "react";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

const ExpertCard = ({ expert, onExpertClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onExpertClick(expert)}
          >
            {expert.name}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">{expert.age}</div>

        <div className="text-xs font-bold text-[#4378a4]">
          {expert.volunteersAssigned}
        </div>

        <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
          {expert.programmesEnrolled}
        </div>

        <div className="text-xs font-bold text-[#4378a4]">
          {expert.organisation}
        </div>

        <div>
          <button className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline">
            {expert.feedback}
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpertInfo = ({ expert, onClose }) => {
  if (!expert) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      <div className="flex justify-end items-start mb-12">
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

      <div className="flex items-center justify-center w-full">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
            <img
              src="/api/placeholder/128/128"
              alt={expert.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        </div>

      <div className="space-y-1 text-xs">
        <p className="font-semibold text-gray-800">Dr. Bindiya Shajith</p>
        <p className="font-semibold text-gray-800">Psychologist, Special Educator</p>
        <p className="font-semibold text-gray-800">Qualification PhD in Psychology; Masters in Special Education</p>

        {/* <div>
          <span className="font-semibold text-gray-800">Name:</span>
          <span className="text-gray-500"> {expert.name}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Age:</span>
          <span className="text-gray-500"> {expert.age}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Email:</span>
          <span className="text-gray-500"> {expert.email}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Contact No:</span>
          <span className="text-gray-500"> {expert.contact}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Educational Qualification:
          </span>
          <span className="text-gray-500"> {expert.education}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Specialization:
          </span>
          <span className="text-gray-500"> {expert.specialization}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Experience:</span>
          <span className="text-gray-500"> {expert.experience}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Profession:</span>
          <span className="text-gray-500"> {expert.profession}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Areas of Expertise:
          </span>
          <span className="text-gray-500"> {expert.areasOfExpertise}</span>
        </div> */}
      </div>
    </div>
  );
};

const ExpertsPage = () => {
  const [selectedExpert, setSelectedExpert] = useState(null);

  const experts = [
    {
      id: 1,
      name: "Komal Motwani",
      age: "34 yrs",
      volunteersAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
      email: "komal.expert@example.com",
      contact: "9876543210",
      education: "MD in Pediatrics",
      specialization: "Child Psychology",
      experience:
        "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
      profession: "Medical Doctor",
      areasOfExpertise:
        "Child Psychology, Developmental Disorders, Family Counseling",
    },
    {
      id: 2,
      name: "Komal Motwani",
      age: "34 yrs",
      volunteersAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
      email: "komal.expert@example.com",
      contact: "9876543210",
      education: "MD in Pediatrics",
      specialization: "Child Psychology",
      experience:
        "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
      profession: "Medical Doctor",
      areasOfExpertise:
        "Child Psychology, Developmental Disorders, Family Counseling",
    },
    {
      id: 3,
      name: "Komal Motwani",
      age: "34 yrs",
      volunteersAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
      email: "komal.expert@example.com",
      contact: "9876543210",
      education: "MD in Pediatrics",
      specialization: "Child Psychology",
      experience:
        "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
      profession: "Medical Doctor",
      areasOfExpertise:
        "Child Psychology, Developmental Disorders, Family Counseling",
    },
    {
      id: 4,
      name: "Komal Motwani",
      age: "34 yrs",
      volunteersAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
      email: "komal.expert@example.com",
      contact: "9876543210",
      education: "MD in Pediatrics",
      specialization: "Child Psychology",
      experience:
        "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
      profession: "Medical Doctor",
      areasOfExpertise:
        "Child Psychology, Developmental Disorders, Family Counseling",
    },
    {
      id: 5,
      name: "Komal Motwani",
      age: "34 yrs",
      volunteersAssigned: "3",
      programmesEnrolled: "CMC Vellore",
      organisation: "Girl Help",
      feedback: "View",
      email: "komal.expert@example.com",
      contact: "9876543210",
      education: "MD in Pediatrics",
      specialization: "Child Psychology",
      experience:
        "8 years of experience in child development and psychology. Previously worked with multiple NGOs focusing on child welfare and mental health support.",
      profession: "Medical Doctor",
      areasOfExpertise:
        "Child Psychology, Developmental Disorders, Family Counseling",
    },
  ];

  const handleExpertClick = (expert) => {
    setSelectedExpert(expert);
  };

  const handleCloseInfo = () => {
    setSelectedExpert(null);
  };

  return (
    <div className="flex gap-6">
      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          selectedExpert ? "w-2/3" : "w-full"
        }`}
      >
        <div className="space-y-2">
          {/* Header row with column labels */}
          <div className="bg-gray-50 rounded-lg px-6">
            <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
              <div>Name</div>
              <div>Age</div>
              <div>Volunteers Assigned</div>
              <div>Programmes Enrolled</div>
              <div>Organisation</div>
              <div>Feedback</div>
            </div>
          </div>

          {/* Expert cards */}
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onExpertClick={handleExpertClick}
            />
          ))}
        </div>
      </div>

      {/* Expert info panel */}
      {selectedExpert && (
        <div className="w-1/3 transition-all duration-300">
          <ExpertInfo expert={selectedExpert} onClose={handleCloseInfo} />
        </div>
      )}
    </div>
  );
};

export default ExpertsPage;
