"use client";
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight } from "lucide-react";
import AddOrganisationDialog from "./AddOrganisationDialog"; // Adjust path as needed
import { organisationAPI } from "@/lib/api"; // Adjust the import path as needed
import { useParams } from "next/navigation";

const Organisations = () => {
  const [organisationsData, setOrganisationsData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const role = params.role; // Get role from URL params

  // Dummy data to show when no organisations exist in backend
  const dummyData = [
    {
      id: "dummy-1",
      name: "COLOUR it",
      image: "/groups/colourit.png",
    },
    {
      id: "dummy-2",
      name: "Saukhyam",
      image: "/groups/saukhyam.png",
    },
    {
      id: "dummy-3",
      name: "S.M.I.L.E.",
      image: "/groups/SMILE.png",
    },
    {
      id: "dummy-4",
      name: "Nirampakaram",
      image: "/groups/nirampakaram.png",
    },
    {
      id: "dummy-5",
      name: "Ever-Ready-Day",
      image: "/groups/everreadyday.png",
    },
  ];

  // Fetch organisations from backend
  const fetchOrganisations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await organisationAPI.getAll();

      if (response.success) {
        const backendOrganisations = response.data || [];

        // If no organisations in backend, show dummy data
        if (backendOrganisations.length === 0) {
          setOrganisationsData(dummyData);
        } else {
          setOrganisationsData(backendOrganisations);
        }
      } else {
        console.error("Failed to fetch organisations:", response.error);
        // On error, show dummy data as fallback
        setOrganisationsData(dummyData);
        setError("Failed to load organisations. Showing sample data.");
      }
    } catch (error) {
      console.error("Error fetching organisations:", error);
      // On error, show dummy data as fallback
      setOrganisationsData(dummyData);
      setError("Failed to load organisations. Showing sample data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load organisations on component mount
  useEffect(() => {
    fetchOrganisations();
  }, []);

  const handleAddOrganisationClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleOrganisationCreated = (newOrganisation) => {
    // Add the new organisation to the list
    setOrganisationsData((prevData) => [...prevData, newOrganisation]);

    console.log("Organisation created successfully:", newOrganisation);
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading organisations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-0">
          <h1 className=" font-bold text-gray-800">Organisations</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
        {role === "admin" && (
          <button
            onClick={handleAddOrganisationClick}
            className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
          >
            <Plus size={18} />
            <span>Add Organisations</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          {error}
        </div>
      )}

      {/* Dummy Data Indicator */}
      {organisationsData.length > 0 &&
        organisationsData[0].id?.toString().startsWith("dummy-") && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            No organisations found. Showing sample data. Click "Add
            Organisations" to create your first organisation.
          </div>
        )}

      {/* Organisations Grid - 4 cards per row */}
      <div className="grid grid-cols-4 gap-6">
        {organisationsData.map((organisation) => (
          <div key={organisation.id} className="flex flex-col items-center">
            <div className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group">
              {/* organisation Image */}
              <img
                src={organisation.imageUrl || organisation.image}
                alt={organisation.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default image if image fails to load
                  e.target.src = "/default-organisation.png";
                }}
              />
            </div>
            {/* organisation Info */}
            <div className="p-6">
              <h3 className="font-semibold text-center text-gray-800  mb-2">
                {organisation.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Add Organisation Dialog */}
      <AddOrganisationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onOrganisationCreated={handleOrganisationCreated}
      />
    </div>
  );
};

export default Organisations;
