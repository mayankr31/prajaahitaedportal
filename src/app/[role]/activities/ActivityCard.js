// src/app/components/ActivityCard.js
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Download, MessageSquare } from "lucide-react";
import { Button, Chip, Tooltip, IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";

// --- Helper function to format time ---
const formatTime12Hour = (time24) => {
  if (!time24) return "N/A";
  const [hours, minutes] = time24.split(":");
  const hoursInt = parseInt(hours, 10);
  const period = hoursInt >= 12 ? "PM" : "AM";
  let hour12 = hoursInt % 12;
  if (hour12 === 0) {
    hour12 = 12; // Handle midnight (00:xx) and noon (12:xx)
  }
  return `${hour12}:${minutes} ${period}`;
};

const ActivityCard = ({ activity, role, onOpenFeedbackDialog }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const displayImageUrl = activity.imageUrl
    ? activity.imageUrl
    : activity.pdfUrl
    ? "https://techterms.com/img/lg/pdf_109.png" // Default PDF image if no imageUrl but pdfUrl exists
    : "/activities/default.png"; // Fallback if neither image nor PDF is available

  const handleDownloadPdf = (e) => {
    e.stopPropagation(); // Prevent card click
    if (activity.pdfUrl) {
      window.open(activity.pdfUrl, '_blank');
    }
  };

  const handleCardClick = () => {
    if (activity.approvalStatus === "APPROVED") {
      router.push(`/${role}/activities/${activity.id}/prerequisites`);
    }
  };

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div
        className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
        onClick={handleCardClick}
      >
        {/* Approval Status Overlay */}
        {session?.user?.role !== "student" && activity.approvalStatus !== "APPROVED" && (
          <div
            className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold z-10
              ${activity.approvalStatus === "PENDING"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
              }`}
          >
            {activity.approvalStatus}
          </div>
        )}

        {/* Rejection Message Tooltip for Volunteers */}
        {activity.approvalStatus === "REJECTED" &&
          session?.user?.role === "volunteer" &&
          activity.createdById === session.user.id &&
          activity.rejectionMessage && (
            <Tooltip title={`Reason: ${activity.rejectionMessage}`} arrow>
              <IconButton
                size="small"
                className="absolute top-0 left-47 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <Info size={18} className="text-red-500" />
              </IconButton>
            </Tooltip>
          )}

        <img
          src={displayImageUrl}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        {activity.category && (
          <Chip
            onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the card
            label={activity.category}
            size="small"
            color="primary"
            sx={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}
          />
        )}
      </div>
      <div className="p-4 text-center w-56">
        <h3 className="font-semibold text-gray-800">{activity.title}</h3>
        <p className="text-sm text-gray-500">
          {new Date(activity.date).toLocaleDateString()} at{" "}
          <strong>{formatTime12Hour(activity.time)}</strong>
        </p>
        {/* Display created by info for volunteers (their own pending/rejected) */}
        {session?.user?.role === "volunteer" &&
          activity.createdById === session.user.id &&
          activity.approvalStatus !== "APPROVED" && (
            <p className="text-xs text-gray-500 mt-1">
              Created by: {activity.createdBy?.name || "You"}
            </p>
          )}
        {activity.pdfUrl && (
          <Button
            size="small"
            startIcon={<Download size={16} />}
            onClick={handleDownloadPdf}
            sx={{ mt: 1, mr: 1, textTransform: 'none' }}
          >
            Download PDF
          </Button>
        )}
        {(role === "volunteer" || role === "expert") && activity.approvalStatus === "APPROVED" && (
          <Button
            size="small"
            startIcon={<MessageSquare size={16} />}
            onClick={() => onOpenFeedbackDialog(activity)}
            sx={{ mt: 1, textTransform: 'none' }}
          >
            {activity.feedback ? "Edit Feedback" : "Add Feedback"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;