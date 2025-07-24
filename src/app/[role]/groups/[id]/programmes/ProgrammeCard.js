import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";

const ProgrammeCard = ({ 
  programme, 
  session, 
  onProgrammeClick 
}) => {
  const totalMembers =
    programme.students + programme.volunteers + programme.specialEducators;

  const handleClick = () => {
    if (onProgrammeClick) {
      onProgrammeClick(programme);
    }
  };

  const handleSeeDetailsClick = (e) => {
    e.stopPropagation();
    handleClick();
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative ${
        programme.approvalStatus === "APPROVED" ? "cursor-pointer" : ""
      }`}
      // onClick={handleClick}
    >
      {/* Approval Status Overlay */}
      {session?.user?.role !== "student" && programme.approvalStatus !== "APPROVED" && (
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold
            ${
              programme.approvalStatus === "PENDING"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }`}
        >
          {programme.approvalStatus}
        </div>
      )}

      {/* Rejection Message Tooltip for Volunteers */}
      {programme.approvalStatus === "REJECTED" &&
        session?.user?.role === "volunteer" &&
        programme.createdById === session.user.id &&
        programme.rejectionMessage && (
          <Tooltip title={`Reason: ${programme.rejectionMessage}`} arrow>
            <IconButton
              size="small"
              className="absolute top-1 left-80 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
            >
              <Info size={18} className="text-red-500" />
            </IconButton>
          </Tooltip>
        )}

      {/* Programme Content */}
      <div className="px-6 py-8">
        {/* Programme Name */}
        <div className="text-center mb-6">
          <h2 className="font-bold text-lg text-gray-800 mb-2">
            {programme.name}
          </h2>
          {/* Display created by info for volunteers (their own pending/rejected) */}
          {session?.user?.role === "volunteer" &&
            programme.createdById === session.user.id &&
            programme.approvalStatus !== "APPROVED" && (
              <p className="text-xs text-gray-500">
                Created by: {programme.createdBy?.name || "You"}
              </p>
            )}
        </div>

        {/* Image and Info Side by Side */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {/* Programme Image in Circle */}
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src={programme.imageUrl || "/api/placeholder/300/200"}
              alt={programme.name || "Programme"}
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>

          {/* Programme Info */}
          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                Total Members : {totalMembers}
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
        <button
        //   onClick={handleSeeDetailsClick}
          className={`w-full text-sm py-3 rounded-lg font-medium transition-colors ${
            programme.approvalStatus === "APPROVED"
              ? "bg-[#2F699A] text-white hover:bg-[#25547b]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={programme.approvalStatus !== "APPROVED"}
        >
          See Details
        </button>
      </div>
    </div>
  );
};

export default ProgrammeCard;