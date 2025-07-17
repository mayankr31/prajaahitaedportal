
// // Group API functions
// export const groupAPI = {
//   // Get all groups
//   async getAll() {
//     const response = await fetch('/api/groups')
//     return response.json()
//   },

//   // Get single group with programmes
//   async getById(id) {
//     const response = await fetch(`/api/groups/${id}`)
//     return response.json()
//   },

//   // Create new group (for "Add New Group" button)
//   async create(data) {
//     const response = await fetch('/api/groups', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Update group
//   async update(id, data) {
//     const response = await fetch(`/api/groups/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Delete group
//   async delete(id) {
//     const response = await fetch(`/api/groups/${id}`, {
//       method: 'DELETE'
//     })
//     return response.json()
//   }
// }

// Base URL for your API endpoints
const API_BASE_URL = '/api';

// Group API functions
export const groupAPI = {
  /**
   * Fetches all groups, with filtering based on user role handled by the backend.
   * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
   */
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`);
      const result = await response.json();
      if (!response.ok) {
        // If response.ok is false, it means an HTTP error (4xx, 5xx) occurred
        return { success: false, error: result.error || 'Failed to fetch groups' };
      }
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error in groupAPI.getAll:', error);
      return { success: false, error: 'Network error or failed to fetch groups' };
    }
  },

  /**
   * Fetches a single group by its ID, including its programmes.
   * @param {string} id - The ID of the group to fetch.
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`);
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || `Failed to fetch group with ID: ${id}` };
      }
      return { success: true, data: result.data };
    } catch (error) {
      console.error(`Error in groupAPI.getById for ID ${id}:`, error);
      return { success: false, error: 'Network error or failed to fetch group' };
    }
  },

  /**
   * Creates a new group. The approval status is determined by the backend based on the user's role.
   * @param {Object} data - The group data (e.g., { name: string, imageUrl: string }).
   * @returns {Promise<{success: boolean, data?: Object, message?: string, error?: string}>}
   */
  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to create group' };
      }
      return { success: true, data: result.data, message: result.message };
    } catch (error) {
      console.error('Error in groupAPI.create:', error);
      return { success: false, error: 'Network error or failed to create group' };
    }
  },

  /**
   * Updates an existing group.
   * @param {string} id - The ID of the group to update.
   * @param {Object} data - The updated group data.
   * @returns {Promise<{success: boolean, data?: Object, message?: string, error?: string}>}
   */
  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || `Failed to update group with ID: ${id}` };
      }
      return { success: true, data: result.data, message: result.message };
    } catch (error) {
      console.error(`Error in groupAPI.update for ID ${id}:`, error);
      return { success: false, error: 'Network error or failed to update group' };
    }
  },

  /**
   * Deletes a group by its ID.
   * @param {string} id - The ID of the group to delete.
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || `Failed to delete group with ID: ${id}` };
      }
      return { success: true, message: result.message };
    } catch (error) {
      console.error(`Error in groupAPI.delete for ID ${id}:`, error);
      return { success: false, error: 'Network error or failed to delete group' };
    }
  },

  /**
   * Approves a pending group. Only accessible by Admins/Experts.
   * @param {string} id - The ID of the group to approve.
   * @returns {Promise<{success: boolean, data?: Object, message?: string, error?: string}>}
   */
  async approve(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}/approve-reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || `Failed to approve group with ID: ${id}` };
      }
      return { success: true, data: result.data, message: result.message };
    } catch (error) {
      console.error(`Error in groupAPI.approve for ID ${id}:`, error);
      return { success: false, error: 'Network error or failed to approve group' };
    }
  },

  /**
   * Rejects a pending group with a rejection message. Only accessible by Admins/Experts.
   * @param {string} id - The ID of the group to reject.
   * @param {string} rejectionMessage - The reason for rejection.
   * @returns {Promise<{success: boolean, data?: Object, message?: string, error?: string}>}
   */
  async reject(id, rejectionMessage) {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${id}/approve-reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejectionMessage })
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || `Failed to reject group with ID: ${id}` };
      }
      return { success: true, data: result.data, message: result.message };
    } catch (error) {
      console.error(`Error in groupAPI.reject for ID ${id}:`, error);
      return { success: false, error: 'Network error or failed to reject group' };
    }
  }
};


// Programme API functions
// export const programmeAPI = {
//   // Get programmes (optionally filter by groupId)
//   async getAll(groupId = null) {
//     const url = groupId ? `/api/programmes?groupId=${groupId}` : '/api/programmes'
//     const response = await fetch(url)
//     return response.json()
//   },

//   // Get single programme
//   async getById(id) {
//     const response = await fetch(`/api/programmes/${id}`)
//     return response.json()
//   },

//   // Create new programme (for "Add New Programme" button)
//   async create(data) {
//     const response = await fetch('/api/programmes', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Update programme
//   async update(id, data) {
//     const response = await fetch(`/api/programmes/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Delete programme
//   async delete(id) {
//     const response = await fetch(`/api/programmes/${id}`, {
//       method: 'DELETE'
//     })
//     return response.json()
//   }
// }

// Programme API functions
export const programmeAPI = {
  // Get programmes (optionally filter by groupId)
  async getAll(groupId = null) {
    try {
      const url = groupId ? `/api/programmes?groupId=${groupId}` : '/api/programmes';
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      console.error("API Error fetching programmes:", error);
      return { success: false, error: "Network error fetching programmes" };
    }
  },

  // Get single programme
  async getById(id) {
    try {
      const response = await fetch(`/api/programmes/${id}`);
      return response.json();
    } catch (error) {
      console.error("API Error fetching single programme:", error);
      return { success: false, error: "Network error fetching programme details" };
    }
  },

  // Create new programme (for "Add New Programme" button)
  async create(data) {
    try {
      const response = await fetch('/api/programmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error("API Error creating programme:", error);
      return { success: false, error: "Network error creating programme" };
    }
  },

  // Update programme
  async update(id, data) {
    try {
      const response = await fetch(`/api/programmes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error("API Error updating programme:", error);
      return { success: false, error: "Network error updating programme" };
    }
  },

  // Delete programme
  async delete(id) {
    try {
      const response = await fetch(`/api/programmes/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    } catch (error) {
      console.error("API Error deleting programme:", error);
      return { success: false, error: "Network error deleting programme" };
    }
  },

  // New: Approve Programme
  async approve(programmeId) {
    try {
      const response = await fetch(`/api/programmes/${programmeId}/approve-reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      return response.json();
    } catch (error) {
      console.error("API Error approving programme:", error);
      return { success: false, error: "Network error approving programme" };
    }
  },

  // New: Reject Programme
  async reject(programmeId, rejectionMessage) {
    try {
      const response = await fetch(`/api/programmes/${programmeId}/approve-reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejectionMessage }),
      });
      return response.json();
    } catch (error) {
      console.error("API Error rejecting programme:", error);
      return { success: false, error: "Network error rejecting programme" };
    }
  }
}

// Organisation API functions
export const organisationAPI = {
  // Get all organisations
  async getAll() {
    const response = await fetch('/api/organisations')
    return response.json()
  },

  // Get single organisation
  async getById(id) {
    const response = await fetch(`/api/organisations/${id}`)
    return response.json()
  },

  // Create new organisation (for "Add New Organisation" button)
  async create(data) {
    const response = await fetch('/api/organisations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update organisation
  async update(id, data) {
    const response = await fetch(`/api/organisations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete organisation
  async delete(id) {
    const response = await fetch(`/api/organisations/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

// // Meeting API functions
// export const meetingAPI = {
//   // Get all meetings
//   async getAll() {
//     const response = await fetch('/api/meetings')
//     return response.json()
//   },

//   // Get single meeting
//   async getById(id) {
//     const response = await fetch(`/api/meetings/${id}`)
//     return response.json()
//   },

//   // Create new meeting
//   async create(data) {
//     const response = await fetch('/api/meetings', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Update meeting (full update)
//   async update(id, data) {
//     const response = await fetch(`/api/meetings/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Partially update meeting
//   async patch(id, data) {
//     const response = await fetch(`/api/meetings/${id}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Delete meeting
//   async delete(id) {
//     const response = await fetch(`/api/meetings/${id}`, {
//       method: 'DELETE'
//     })
//     return response.json()
//   },
// }

// Meeting API functions
export const meetingAPI = {
  // Get all meetings
  async getAll() {
    const response = await fetch('/api/meetings');
    return response.json();
  },

  // Get single meeting
  async getById(id) {
    const response = await fetch(`/api/meetings/${id}`);
    return response.json();
  },

  // Create new meeting
  async create(data) {
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update meeting (full update)
  async update(id, data) {
    const response = await fetch(`/api/meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Partially update meeting
  async patch(id, data) {
    const response = await fetch(`/api/meetings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete meeting
  async delete(id) {
    const response = await fetch(`/api/meetings/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Approve a meeting (NEW)
  async approve(id) {
    const response = await fetch(`/api/meetings/${id}/approve-reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' })
    });
    return response.json();
  },

  // Reject a meeting (NEW)
  async reject(id, rejectionMessage) {
    const response = await fetch(`/api/meetings/${id}/approve-reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectionMessage })
    });
    return response.json();
  },
};

// // Activity API functions
// export const activityAPI = {
//   // Get all activities
//   async getAll(includePrerequisites = true) {
//     const url = includePrerequisites ? '/api/activities?include=prerequisites' : '/api/activities'
//     const response = await fetch(url)
//     return response.json()
//   },

//   // Get single activity with prerequisites
//   async getById(id) {
//     const response = await fetch(`/api/activities/${id}`)
//     return response.json()
//   },

//   // Create new activity (with prerequisites)
//   async create(data) {
//     const response = await fetch('/api/activities', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Update activity
//   async update(id, data) {
//     const response = await fetch(`/api/activities/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Delete activity
//   async delete(id) {
//     const response = await fetch(`/api/activities/${id}`, {
//       method: 'DELETE'
//     })
//     return response.json()
//   },

//   // Get today and yesterday activities
//   async getTodayYesterday() {
//     const response = await fetch('/api/activities?include=prerequisites')
//     const data = await response.json()
    
//     if (data.success) {
//       const now = new Date()
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
//       const yesterday = new Date(today)
//       yesterday.setDate(yesterday.getDate() - 1)
      
//       const filteredActivities = data.data.filter((activity) => {
//         const activityDate = new Date(activity.date)
//         const activityDay = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate())
        
//         return activityDay.getTime() === today.getTime() || activityDay.getTime() === yesterday.getTime()
//       })
      
//       return { success: true, data: filteredActivities }
//     }
    
//     return data
//   }
// }

// Activity API functions
export const activityAPI = {
  // Get all activities
  async getAll(includePrerequisites = true) {
    try {
      const url = includePrerequisites ? `${API_BASE_URL}/activities?include=prerequisites` : `${API_BASE_URL}/activities`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in activityAPI.getAll:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  },

  // Get single activity with prerequisites
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in activityAPI.getById:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  },

  // Create new activity (with prerequisites)
  async create(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error in activityAPI.create:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  },

  // Update activity
  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (error) {
      console.error('Error in activityAPI.update:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  },

  // Delete activity
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    } catch (error) {
      console.error('Error in activityAPI.delete:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  },

  // Approve an activity (NEW)
  async approve(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${id}/approve-reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      return response.json();
    } catch (error) {
      console.error('Error in activityAPI.approve:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  },

  // Reject an activity (NEW)
  async reject(id, rejectionMessage) {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${id}/approve-reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejectionMessage }),
      });
      return response.json();
    } catch (error) {
      console.error('Error in activityAPI.reject:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  },

  // Get today and yesterday activities
  async getTodayYesterday() {
    try {
      const response = await fetch(`${API_BASE_URL}/activities?include=prerequisites`);
      const data = await response.json();

      if (data.success) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const filteredActivities = data.data.filter((activity) => {
          const activityDate = new Date(activity.date);
          const activityDay = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());

          return activityDay.getTime() === today.getTime() || activityDay.getTime() === yesterday.getTime();
        });

        return { success: true, data: filteredActivities };
      }

      return data;
    } catch (error) {
      console.error('Error in activityAPI.getTodayYesterday:', error);
      return { success: false, error: 'Network error or server unavailable.' };
    }
  }
};

// // Prerequisite API functions
// export const prerequisiteAPI = {
//   // Get all prerequisites (optionally filter by activityId)
//   async getAll(activityId = null) {
//     const url = activityId ? `/api/prerequisites?activityId=${activityId}` : '/api/prerequisites'
//     const response = await fetch(url)
//     return response.json()
//   },

//   // Get single prerequisite
//   async getById(id) {
//     const response = await fetch(`/api/prerequisites/${id}`)
//     return response.json()
//   },

//   // Create new prerequisite
//   async create(data) {
//     const response = await fetch('/api/prerequisites', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Update prerequisite
//   async update(id, data) {
//     const response = await fetch(`/api/prerequisites/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     })
//     return response.json()
//   },

//   // Delete prerequisite
//   async delete(id) {
//     const response = await fetch(`/api/prerequisites/${id}`, {
//       method: 'DELETE'
//     })
//     return response.json()
//   }
// }

export const prerequisiteAPI = {
  // Get all prerequisites (optionally filter by activityId)
  async getAll(activityId = null) {
    const url = activityId ? `/api/prerequisites?activityId=${activityId}` : '/api/prerequisites';
    const response = await fetch(url);
    return response.json();
  },

  // Get single prerequisite
  async getById(id) {
    const response = await fetch(`/api/prerequisites/${id}`);
    return response.json();
  },

  // Create new prerequisite
  async create(data) {
    const response = await fetch('/api/prerequisites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update prerequisite
  async update(id, data) {
    const response = await fetch(`/api/prerequisites/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete prerequisite
  async delete(id) {
    const response = await fetch(`/api/prerequisites/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Approve prerequisite (New)
  async approve(id) {
    const response = await fetch(`/api/prerequisites/${id}/approve-reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' })
    });
    return response.json();
  },

  // Reject prerequisite (New)
  async reject(id, rejectionMessage) {
    const response = await fetch(`/api/prerequisites/${id}/approve-reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', rejectionMessage })
    });
    return response.json();
  }
};

// Student API functions
export const studentAPI = {
  // Get all students with pagination and filters
  async getAll(page = 1, limit = 10, search = '', programmeId = null, organisationId = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(programmeId && { programmeId }),
      ...(organisationId && { organisationId })
    })
    const response = await fetch(`/api/students?${params}`)
    return response.json()
  },

  // Get single student
  async getById(id) {
    const response = await fetch(`/api/students/${id}`)
    return response.json()
  },

  // Create new student
  async create(data) {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update student
  async update(id, data) {
    const response = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete student
  async delete(id) {
    const response = await fetch(`/api/students/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

// Volunteer API functions
export const volunteerAPI = {
  // Get all volunteers with pagination and filters
  async getAll(page = 1, limit = 10, search = '', programmeId = null, organisationId = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(programmeId && { programmeId }),
      ...(organisationId && { organisationId })
    })
    const response = await fetch(`/api/volunteers?${params}`)
    return response.json()
  },

  // Get single volunteer
  async getById(id) {
    const response = await fetch(`/api/volunteers/${id}`)
    return response.json()
  },

  // Create new volunteer
  async create(data) {
    const response = await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update volunteer
  async update(id, data) {
    const response = await fetch(`/api/volunteers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete volunteer
  async delete(id) {
    const response = await fetch(`/api/volunteers/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

// Expert API functions
export const expertAPI = {
  // Get all experts with pagination and filters
  async getAll(page = 1, limit = 10, search = '', programmeId = null, organisationId = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(programmeId && { programmeId }),
      ...(organisationId && { organisationId })
    })
    const response = await fetch(`/api/experts?${params}`)
    return response.json()
  },

  // Get single expert
  async getById(id) {
    const response = await fetch(`/api/experts/${id}`)
    return response.json()
  },

  // Create new expert
  async create(data) {
    const response = await fetch('/api/experts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update expert
  async update(id, data) {
    const response = await fetch(`/api/experts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete expert
  async delete(id) {
    const response = await fetch(`/api/experts/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

export const userAPI = {
  // Get all users with pagination and filters
  async getAll(page = 1, limit = 10, search = '', role = null, status = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(role && { role }),
      ...(status && { status })
    })
    const response = await fetch(`/api/users?${params}`)
    return response.json()
  },

  async getById(id) {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  },

  // Create a new user (for signup)
  async create(data) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update a user by ID (including their associated role profile)
  async update(id, data) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete a user by ID (including their associated role profile)
  async delete(id) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
  
  // Get users by role
  async getByRole(role, page = 1, limit = 10) {
    const params = new URLSearchParams({
      role,
      page: page.toString(),
      limit: limit.toString()
    })
    const response = await fetch(`/api/users?${params}`)
    return response.json()
  }
}