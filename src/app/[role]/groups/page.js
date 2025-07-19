// src/app/[role]/groups/page.js
"use client";
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import AddGroupDialog from "./AddGroupDialog";
import ApprovalGroupsDialog from "./ApprovalGroupsDialog"; // New component
import { groupAPI } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Tooltip, IconButton } from "@mui/material"; // For better UI hints
import { Info } from "@mui/icons-material";

const Groups = () => {
  const router = useRouter();
  const params = useParams();
  const role = params.role;
  const { data: session, status } = useSession();

  const [groups, setGroups] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false); // New state for approval dialog
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return; // Don't fetch if session is still loading
    fetchGroups();
  }, [status, role]); // Refetch when session status or role changes

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getAll();
      if (response.success) {
        // The API now filters based on role.
        // For admin/expert, they receive all groups. We can further filter for display.
        if (
          session?.user?.role === "admin" ||
          session?.user?.role === "expert"
        ) {
          setGroups(response.data); // Admins/Experts see all, including pending/rejected
        } else if (session?.user?.role === "volunteer") {
          // Volunteers see their created groups (any status) and approved groups
          setGroups(
            response.data.filter(
              (group) =>
                group.createdById === session.user.id ||
                group.approvalStatus === "APPROVED"
            )
          );
        } else if (session?.user?.role === "student") {
          // Students only see approved groups (API already filters this, but good to double check)
          setGroups(
            response.data.filter((group) => group.approvalStatus === "APPROVED")
          );
        } else {
          setGroups([]); // Default for unauthenticated or unknown roles
        }
      } else {
        setError(response.error || "Failed to load groups");
        setGroups([]); // Clear groups on error
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Failed to load groups");
      setGroups([]); // Clear groups on error
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = (newGroup) => {
    // Re-fetch all groups to ensure the list is up-to-date with approval statuses
    fetchGroups();
    console.log("New group created:", newGroup);
  };

  const handleGroupApprovalStatusChange = () => {
    // When a group is approved/rejected, refresh the list
    fetchGroups();
  };

  const handleGroupClick = (groupId) => {
    router.push(`/${role}/groups/${groupId}/programmes`);
  };

  const pendingGroupsCount = groups.filter(
    (group) => group.approvalStatus === "PENDING"
  ).length;

  if (loading || status === "loading") {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading groups...</div>
        </div>
      </div>
    );
  }

  // Filter groups for display based on role and status
  const getFilteredGroups = () => {
    if (session?.user?.role === "student") {
      return groups.filter((group) => group.approvalStatus === "APPROVED");
    }
    // Volunteers see their own pending/rejected/approved groups and all approved groups
    if (session?.user?.role === "volunteer") {
      return groups.filter(
        (group) =>
          group.createdById === session.user.id ||
          group.approvalStatus === "APPROVED"
      );
    }
    // Admins and Experts see all groups
    return groups;
  };

  const filteredGroups = getFilteredGroups();

  // Separate groups into approved and pending/rejected
  const approvedGroups = filteredGroups.filter(
    (group) => group.approvalStatus === "APPROVED"
  );
  const pendingRejectedGroups = filteredGroups.filter(
    (group) =>
      group.approvalStatus === "PENDING" || group.approvalStatus === "REJECTED"
  );

  const renderGroupCard = (group) => (
    <div key={group.id} className="flex flex-col items-center">
      <div
        className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
        onClick={() => {
          if(group.approvalStatus === "APPROVED")
          handleGroupClick(group.id);
          else return;
        }}
      >
        {/* Approval Status Overlay */}
        {session?.user?.role !== "student" &&
          group.approvalStatus !== "APPROVED" && (
            <div
              className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold
            ${
              group.approvalStatus === "PENDING"
                ? "bg-yellow-500 text-white"
                : "bg-red-500 text-white"
            }`}
            >
              {group.approvalStatus}
            </div>
          )}
        {group.approvalStatus === "REJECTED" &&
          session?.user?.role === "volunteer" &&
          group.createdById === session.user.id &&
          group.rejectionMessage && (
            <Tooltip title={`Reason: ${group.rejectionMessage}`} arrow>
              <IconButton
                size="small"
                className="absolute top-1 left-45 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70"
              >
                <Info size={18} className="text-red-500 bg-opacity-50" />
              </IconButton>
            </Tooltip>
          )}

        {/* Group Image */}
        <img
          src={group.imageUrl || group.image}
          alt={group.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-group.png";
          }}
        />
      </div>
      {/* Group Info */}
      <div className="p-6">
        <h3 className="font-semibold text-center text-gray-800 mb-2">
          {group.name}
        </h3>
        {/* Display created by info for volunteers (their own pending/rejected) */}
        {session?.user?.role === "volunteer" &&
          group.createdById === session.user.id &&
          group.approvalStatus !== "APPROVED" && (
            <p className="text-xs text-gray-500 text-center">
              Created by: {group.createdBy?.name || "You"}
            </p>
          )}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-0">
          <h1 className="font-bold text-gray-800">Groups</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
        <div className="flex items-center space-x-4">
          {(session?.user?.role === "volunteer" ||
            session?.user?.role === "expert" ||
            session?.user?.role === "admin") && (
            <button
              onClick={() => setDialogOpen(true)}
              className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
            >
              <Plus size={18} />
              <span>Add Groups</span>
            </button>
          )}

          {(session?.user?.role === "admin" ||
            session?.user?.role === "expert") && (
            <button
              onClick={() => setApprovalDialogOpen(true)}
              className="flex items-center text-sm space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors relative"
            >
              <span>Approval Groups</span>
              {pendingGroupsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingGroupsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Approved Groups Section */}
      {approvedGroups.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-4 gap-6">
            {approvedGroups.map(renderGroupCard)}
          </div>
        </div>
      )}

      {/* Pending/Rejected Groups Section */}
      {pendingRejectedGroups.length > 0 && (
        <div className="mb-8">
          {/* <h2 className="text-xl font-semibold text-gray-800 mb-6">Pending/Rejected Groups</h2> */}
          <div className="flex items-center space-x-0 mb-6">
            <h1 className="font-bold text-gray-800">Pending / Rejected Groups</h1>
            <ChevronRight className="text-gray-800" size={20} />
          </div>
          <div className="grid grid-cols-4 gap-6">
            {pendingRejectedGroups.map(renderGroupCard)}
          </div>
        </div>
      )}

      {/* No Groups Message */}
      {approvedGroups.length === 0 &&
        pendingRejectedGroups.length === 0 &&
        !loading && (
          <p className="text-center text-gray-600">No groups to display.</p>
        )}

      {/* Add Group Dialog */}
      <AddGroupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      {/* Approval Groups Dialog */}
      {(session?.user?.role === "admin" ||
        session?.user?.role === "expert") && (
        <ApprovalGroupsDialog
          open={approvalDialogOpen}
          onClose={() => setApprovalDialogOpen(false)}
          pendingGroups={groups.filter(
            (group) => group.approvalStatus === "PENDING"
          )}
          onApprovalStatusChange={handleGroupApprovalStatusChange}
        />
      )}
    </div>
  );
};

export default Groups;
