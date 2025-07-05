// //src/app/[role]/groups/page.js
// 'use client'
// import React, { useState, useEffect } from "react";
// import { Plus, ChevronRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import AddGroupDialog from "./AddGroupDialog";
// import { groupAPI } from "@/lib/api"; // Adjust the import path as needed

// const Groups = () => {
//   const router = useRouter();
//   const [groups, setGroups] = useState([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch groups on component mount
//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     try {
//       setLoading(true);
//       const response = await groupAPI.getAll();
//       if (response.success) {
//         setGroups(response.data);
//       } else {
//         // If API returns empty or no groups, use fallback data
//         setGroups([
//           {
//             id: 1,
//             name: "COLOUR it",
//             imageUrl: "/groups/colourit.png",
//           },
//           {
//             id: 2,
//             name: "Saukhyam",
//             imageUrl: "/groups/saukhyam.png",
//           },
//           {
//             id: 3,
//             name: "S.M.I.L.E.",
//             imageUrl: "/groups/SMILE.png",
//           },
//           {
//             id: 4,
//             name: "Nirampakaram",
//             imageUrl: "/groups/nirampakaram.png",
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//       setError('Failed to load groups');
//       // Use fallback data on error
//       setGroups([
//         {
//           id: 1,
//           name: "COLOUR it",
//           imageUrl: "/groups/colourit.png",
//         },
//         {
//           id: 2,
//           name: "Saukhyam",
//           imageUrl: "/groups/saukhyam.png",
//         },
//         {
//           id: 3,
//           name: "S.M.I.L.E.",
//           imageUrl: "/groups/SMILE.png",
//         },
//         {
//           id: 4,
//           name: "Nirampakaram",
//           imageUrl: "/groups/nirampakaram.png",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGroupCreated = (newGroup) => {
//     // Add the new group to the existing groups list
//     setGroups(prevGroups => [...prevGroups, newGroup]);
    
//     // Optional: Show success message
//     console.log('New group created:', newGroup);
    
//     // You could also show a toast notification here
//     // toast.success('Group created successfully!');
//   };

//   const handleGroupClick = (groupId) => {
//     router.push(`/groups/${groupId}/programmes`);
//   };

//   if (loading) {
//     return (
//       <div className="p-4 bg-gray-50 min-h-screen">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-gray-600">Loading groups...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center space-x-0">
//           <h1 className="font-bold text-gray-800">Groups</h1>
//           <ChevronRight className="text-gray-800" size={20} />
//         </div>
//         <button 
//           onClick={() => setDialogOpen(true)} 
//           className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
//         >
//           <Plus size={18} />
//           <span>Add Groups</span>
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {/* Groups Grid - 4 cards per row */}
//       <div className="grid grid-cols-4 gap-6">
//         {groups.map((group) => (
//           <div key={group.id} className="flex flex-col items-center">
//             <div
//               className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
//               onClick={() => handleGroupClick(group.id)}
//             >
//               {/* Group Image */}
//               <img
//                 src={group.imageUrl || group.image}
//                 alt={group.name}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   // Fallback image if the image fails to load
//                   e.target.src = '/placeholder-group.png';
//                 }}
//               />
//             </div>
//             {/* Group Info */}
//             <div className="p-6">
//               <h3 className="font-semibold text-center text-gray-800 mb-2">
//                 {group.name}
//               </h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Group Dialog */}
//       <AddGroupDialog 
//         open={dialogOpen} 
//         onClose={() => setDialogOpen(false)}
//         onGroupCreated={handleGroupCreated}
//       />
//     </div>
//   );
// };

// export default Groups;

//src/app/[role]/groups/page.js
'use client'
import React, { useState, useEffect } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import AddGroupDialog from "./AddGroupDialog";
import { groupAPI } from "@/lib/api"; // Adjust the import path as needed
import { useSession } from "next-auth/react";

const Groups = () => {
  const router = useRouter();
  const params = useParams();
  const role = params.role; // Get role from URL params
  const {data: session, status} = useSession(); // Assuming you have a session management in place
  console.log("Session data:", session, status);
  
  const [groups, setGroups] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getAll();
      if (response.success) {
        setGroups(response.data);
      } else {
        // If API returns empty or no groups, use fallback data
        setGroups([
          {
            id: 1,
            name: "COLOUR it",
            imageUrl: "/groups/colourit.png",
          },
          {
            id: 2,
            name: "Saukhyam",
            imageUrl: "/groups/saukhyam.png",
          },
          {
            id: 3,
            name: "S.M.I.L.E.",
            imageUrl: "/groups/SMILE.png",
          },
          {
            id: 4,
            name: "Nirampakaram",
            imageUrl: "/groups/nirampakaram.png",
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Failed to load groups');
      // Use fallback data on error
      setGroups([
        {
          id: 1,
          name: "COLOUR it",
          imageUrl: "/groups/colourit.png",
        },
        {
          id: 2,
          name: "Saukhyam",
          imageUrl: "/groups/saukhyam.png",
        },
        {
          id: 3,
          name: "S.M.I.L.E.",
          imageUrl: "/groups/SMILE.png",
        },
        {
          id: 4,
          name: "Nirampakaram",
          imageUrl: "/groups/nirampakaram.png",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = (newGroup) => {
    // Add the new group to the existing groups list
    setGroups(prevGroups => [...prevGroups, newGroup]);
    
    // Optional: Show success message
    console.log('New group created:', newGroup);
    
    // You could also show a toast notification here
    // toast.success('Group created successfully!');
  };

  const handleGroupClick = (groupId) => {
    // Fixed: Include role in the route
    router.push(`/${role}/groups/${groupId}/programmes`);
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading groups...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-0">
          <h1 className="font-bold text-gray-800">Groups</h1>
          <ChevronRight className="text-gray-800" size={20} />
        </div>
        <button 
          onClick={() => setDialogOpen(true)} 
          className="flex items-center text-sm space-x-2 bg-[#2F699A] text-white px-4 py-2 rounded-lg hover:bg-[#25547b] transition-colors"
        >
          <Plus size={18} />
          <span>Add Groups</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Groups Grid - 4 cards per row */}
      <div className="grid grid-cols-4 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col items-center">
            <div
              className="bg-white rounded-xl h-56 w-56 relative shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
              onClick={() => handleGroupClick(group.id)}
            >
              {/* Group Image */}
              <img
                src={group.imageUrl || group.image}
                alt={group.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback image if the image fails to load
                  e.target.src = '/placeholder-group.png';
                }}
              />
            </div>
            {/* Group Info */}
            <div className="p-6">
              <h3 className="font-semibold text-center text-gray-800 mb-2">
                {group.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Add Group Dialog */}
      <AddGroupDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
};

export default Groups;