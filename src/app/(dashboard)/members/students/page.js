"use client";
import { Close, ContentCopy, Delete } from "@mui/icons-material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";


const StudentCard = ({ student, onStudentClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center">
          <div
            className="text-xs font-bold text-[#4378a4] hover:text-[#2a5e8a] cursor-pointer"
            onClick={() => onStudentClick(student)}
          >
            {student.name}
          </div>
        </div>

        <div className="text-xs font-bold text-gray-900">{student.age}</div>

        <div className="text-xs text-[#4378a4] font-bold hover:text-[#2a5e8a] cursor-pointer">
          {student.volunteerAssigned}
        </div>

        <div className="text-xs font-bold text-gray-900">
          {student.programmesEnrolled}
        </div>

        <div className="text-xs font-bold text-gray-900">
          {student.organisation}
        </div>

        <div>
          <button className="text-[#4378a4] hover:text-[#2a5e8a] text-xs font-bold hover:underline">
            {student.progress}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentInfo = ({ student, onClose }) => {
  if (!student) return null;

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

      <div className="flex items-center justify-center w-full mb-12">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex-shrink-0 mr-4">
            <img
              src="/api/placeholder/64/64"
              alt={student.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="font-semibold text-gray-800">Name:</span>
          <span className="text-gray-500">{" "}{student.name}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Age:</span>
          <span className="text-gray-500">{" "}{student.age}</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Skills:</span>
          <span className="text-gray-500">{" "}Art, drawing, craft, storytelling</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Area of Interest:</span>
          <span className="text-gray-500">{" "}Dance, art, story, rhymes</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Reading Capacity:</span>
          <span className="text-gray-500">
            {" "}Familiar with English and Hindi alphabets, can read small four -5
            letter words
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Preferred Languages:</span>
          <span className="text-gray-500">{" "}English or Hindi</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Fine Motor Development:</span>
          <span className="text-gray-500">{" "}Can hold a pencil and write fine</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Interaction Capacity:</span>
          <span className="text-gray-500">
            {" "}Shy with strangers. Will open up and interact once familiar.
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Online Class experience:</span>
          <span className="text-gray-500">
            {" "}Have previous experience attending online sessions.
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Attention Span:</span>
          <span className="text-gray-500">{" "}20 minutes</span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Triggering factors:</span>
          <span className="text-gray-500">
            {" "}No trigger factors - can get persistent with few topics
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Happy moments:</span>
          <span className="text-gray-500">
            {" "}Enjoys drawing houses, reciting rhymes, and dancing.
          </span>
        </div>

        <div>
          <span className="font-semibold text-gray-800">Disability:</span>
          <span className="text-gray-500">
            {" "}Down syndrome. It is a genetic condition that occurs when there is
            an extra copy of a specific chromosome: chromosome 21. The extra
            chromosome can affect a person's physical features, intellect, and
            overall development. It also increases the likelihood of some health
            problems.
          </span>
        </div>
      </div>
    </div>
  );
};

const StudentsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    {
      id: 1,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 2,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 3,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 4,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 5,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 6,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 7,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 8,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
    {
      id: 9,
      name: "Ishita Srivastava",
      age: "5 yrs",
      volunteerAssigned: "Komal Motwani",
      programmesEnrolled: "Colour it",
      organisation: "Open Hours",
      progress: "View",
    },
  ];

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseInfo = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="flex gap-6">
      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          selectedStudent ? "w-2/3" : "w-full"
        }`}
      >
        <div className="space-y-2">
          {/* Header row with column labels */}
          <div className="bg-gray-50 rounded-lg px-6">
            <div className="grid grid-cols-6 gap-4 text-xs font-bold text-gray-700 tracking-wider">
              <div>Name</div>
              <div>Age</div>
              <div>Volunteer Assigned</div>
              <div>Programmes Enrolled</div>
              <div>Organisation</div>
              <div>Progress</div>
            </div>
          </div>

          {/* Student cards */}
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onStudentClick={handleStudentClick}
            />
          ))}
        </div>
      </div>

      {/* Student info panel */}
      {selectedStudent && (
        <div className="w-1/3 transition-all duration-300">
          <StudentInfo student={selectedStudent} onClose={handleCloseInfo} />
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
