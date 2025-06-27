// Group API functions
export const groupAPI = {
  // Get all groups
  async getAll() {
    const response = await fetch('/api/groups')
    return response.json()
  },

  // Get single group with programmes
  async getById(id) {
    const response = await fetch(`/api/groups/${id}`)
    return response.json()
  },

  // Create new group (for "Add New Group" button)
  async create(data) {
    const response = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update group
  async update(id, data) {
    const response = await fetch(`/api/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete group
  async delete(id) {
    const response = await fetch(`/api/groups/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

// Programme API functions
export const programmeAPI = {
  // Get programmes (optionally filter by groupId)
  async getAll(groupId = null) {
    const url = groupId ? `/api/programmes?groupId=${groupId}` : '/api/programmes'
    const response = await fetch(url)
    return response.json()
  },

  // Get single programme
  async getById(id) {
    const response = await fetch(`/api/programmes/${id}`)
    return response.json()
  },

  // Create new programme (for "Add New Programme" button)
  async create(data) {
    const response = await fetch('/api/programmes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update programme
  async update(id, data) {
    const response = await fetch(`/api/programmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete programme
  async delete(id) {
    const response = await fetch(`/api/programmes/${id}`, {
      method: 'DELETE'
    })
    return response.json()
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

// Meeting API functions
export const meetingAPI = {
  // Get all meetings
  async getAll() {
    const response = await fetch('/api/meetings')
    return response.json()
  },

  // Get single meeting
  async getById(id) {
    const response = await fetch(`/api/meetings/${id}`)
    return response.json()
  },

  // Create new meeting
  async create(data) {
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update meeting (full update)
  async update(id, data) {
    const response = await fetch(`/api/meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Partially update meeting
  async patch(id, data) {
    const response = await fetch(`/api/meetings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete meeting
  async delete(id) {
    const response = await fetch(`/api/meetings/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },
}

// Activity API functions
export const activityAPI = {
  // Get all activities
  async getAll(includePrerequisites = true) {
    const url = includePrerequisites ? '/api/activities?include=prerequisites' : '/api/activities'
    const response = await fetch(url)
    return response.json()
  },

  // Get single activity with prerequisites
  async getById(id) {
    const response = await fetch(`/api/activities/${id}`)
    return response.json()
  },

  // Create new activity (with prerequisites)
  async create(data) {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update activity
  async update(id, data) {
    const response = await fetch(`/api/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete activity
  async delete(id) {
    const response = await fetch(`/api/activities/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  },

  // Get today and yesterday activities
  async getTodayYesterday() {
    const response = await fetch('/api/activities?include=prerequisites')
    const data = await response.json()
    
    if (data.success) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const filteredActivities = data.data.filter((activity) => {
        const activityDate = new Date(activity.date)
        const activityDay = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate())
        
        return activityDay.getTime() === today.getTime() || activityDay.getTime() === yesterday.getTime()
      })
      
      return { success: true, data: filteredActivities }
    }
    
    return data
  }
}

// Prerequisite API functions
export const prerequisiteAPI = {
  // Get all prerequisites (optionally filter by activityId)
  async getAll(activityId = null) {
    const url = activityId ? `/api/prerequisites?activityId=${activityId}` : '/api/prerequisites'
    const response = await fetch(url)
    return response.json()
  },

  // Get single prerequisite
  async getById(id) {
    const response = await fetch(`/api/prerequisites/${id}`)
    return response.json()
  },

  // Create new prerequisite
  async create(data) {
    const response = await fetch('/api/prerequisites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Update prerequisite
  async update(id, data) {
    const response = await fetch(`/api/prerequisites/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Delete prerequisite
  async delete(id) {
    const response = await fetch(`/api/prerequisites/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }
}

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