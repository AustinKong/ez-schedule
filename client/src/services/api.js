
// src/services/api.js
const API_URL = 'http://localhost:5000/api';

// Group Endpoints
export const fetchGroups = async () => {
    const response = await fetch(`${API_URL}/groups`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json();
};

export const fetchGroup = async (id) => {
    const response = await fetch(`${API_URL}/groups/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch group');
    return response.json();
};

export const createGroup = async (groupData) => {
    const response = await fetch(`${API_URL}/groups/createGroup`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error('Failed to create group');
    return response.json();
};

export const updateGroup = async (id, groupData) => {
    const response = await fetch(`${API_URL}/groups/${id}/editGroup`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error('Failed to update group');
    return response.json();
};

// Timeslot Endpoints (Josiah can add more endpoints here if needed)
export const fetchTimeslotsByGroup = async (groupId) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/timeslots`);
    if (!response.ok) throw new Error('Failed to fetch timeslots');
    return response.json();
};

export const fetchTimeslot = async (timeslotId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}`);
    if (!response.ok) throw new Error('Failed to fetch timeslot');
    return response.json();
};

export const createTimeslot = async (groupId, timeslotData) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/timeslots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timeslotData)
    });
    if (!response.ok) throw new Error('Failed to create timeslot');
    return response.json();
};

export const updateTimeslot = async (timeslotId, timeslotData) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timeslotData)
    });
    if (!response.ok) throw new Error('Failed to update timeslot');
    return response.json();
};

export const deleteTimeslot = async (timeslotId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete timeslot');
    return response.json();
};

export const getGroupByTimeslot = async (timeslotId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/group`);
    if (!response.ok) throw new Error('Failed to get group for timeslot');
    return response.json();
};

// Queue management endpoints
export const fetchQueueByTimeslot = async (timeslotId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue`);
    if (!response.ok) throw new Error('Failed to fetch queue');
    return response.json();
};

export const startQueue = async (timeslotId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/start`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to start queue');
    return response.json();
};

export const pauseQueue = async (timeslotId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/pause`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to pause queue');
    return response.json();
};

export const callNextUser = async (timeslotId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/next`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to call next user');
    return response.json();
};

export const markUserAsServed = async (timeslotId, userId) => {
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/${userId}/served`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to mark user as served');
    return response.json();
};

//------------------------MOCK DATA FOR TESTING----------------------------------
/*
// src/services/mockApi.js
// Mock data
const mockGroups = [
    { 
      id: 1, 
      name: "Consultation Group A", 
      description: "Weekly consultation for IS3106 module", 
      startTime: "2025-04-09T14:00", 
      endTime: "2025-04-09T16:00", 
      location: "COM1-B1-12", 
      maxStudents: 20 
    },
    { 
      id: 2, 
      name: "Tutorial Session B", 
      description: "One-on-one help for final projects", 
      startTime: "2025-04-10T10:00", 
      endTime: "2025-04-10T12:00", 
      location: "Online (Zoom)", 
      maxStudents: 15 
    },
  ];
  
  const mockTimeslots = {
    1: [
      { id: 11, groupId: 1, startTime: "2025-04-09T14:00", endTime: "2025-04-09T14:30" },
      { id: 12, groupId: 1, startTime: "2025-04-09T14:30", endTime: "2025-04-09T15:00" }
    ],
    2: [
      { id: 21, groupId: 2, startTime: "2025-04-10T10:00", endTime: "2025-04-10T10:30" },
      { id: 22, groupId: 2, startTime: "2025-04-10T10:30", endTime: "2025-04-10T11:00" }
    ]
  };
  
  const mockQueuesByTimeslot = {
    11: [
      { id: 101, name: "Alice Tan", status: "waiting" },
      { id: 102, name: "Bob Chen", status: "notified" },
      { id: 103, name: "Charlie Wong", status: "waiting" },
    ],
    21: [
      { id: 201, name: "David Lim", status: "waiting" },
      { id: 202, name: "Emily Ng", status: "waiting" },
    ]
  };
  
  const queueStatusByTimeslot = {
    11: "active",
    21: "inactive"
  };
  
  // Flag to use mock data
  const USE_MOCK_DATA = true;
  const API_URL = 'http://localhost:5000/api';
  
  // Group Endpoints
  export const fetchGroups = async () => {
    if (USE_MOCK_DATA) {
      return Promise.resolve([...mockGroups]);
    }
    
    const response = await fetch(`${API_URL}/groups`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json();
  };
  
  export const fetchGroup = async (id) => {
    if (USE_MOCK_DATA) {
      const group = mockGroups.find(g => g.id === parseInt(id));
      return Promise.resolve(group ? {...group} : null);
    }
    
    const response = await fetch(`${API_URL}/groups/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch group');
    return response.json();
  };
  
  export const createGroup = async (groupData) => {
    if (USE_MOCK_DATA) {
      const newGroup = { 
        id: mockGroups.length > 0 ? Math.max(...mockGroups.map(g => g.id)) + 1 : 1, 
        ...groupData 
      };
      mockGroups.push(newGroup);
      return Promise.resolve({...newGroup});
    }
    
    const response = await fetch(`${API_URL}/groups/createGroup`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error('Failed to create group');
    return response.json();
  };
  
  export const updateGroup = async (id, groupData) => {
    if (USE_MOCK_DATA) {
      const index = mockGroups.findIndex(g => g.id === parseInt(id));
      if (index !== -1) {
        mockGroups[index] = { ...mockGroups[index], ...groupData };
        return Promise.resolve({...mockGroups[index]});
      }
      throw new Error('Group not found');
    }
    
    const response = await fetch(`${API_URL}/groups/${id}/editGroup`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(groupData)
    });
    if (!response.ok) throw new Error('Failed to update group');
    return response.json();
  };
  
  // Timeslot Endpoints
  export const fetchTimeslotsByGroup = async (groupId) => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockTimeslots[parseInt(groupId)] || []);
    }
    
    const response = await fetch(`${API_URL}/groups/${groupId}/timeslots`);
    if (!response.ok) throw new Error('Failed to fetch timeslots');
    return response.json();
  };
  
  export const fetchTimeslot = async (timeslotId) => {
    if (USE_MOCK_DATA) {
      for (const groupId in mockTimeslots) {
        const timeslot = mockTimeslots[groupId].find(t => t.id === parseInt(timeslotId));
        if (timeslot) return Promise.resolve({...timeslot});
      }
      return Promise.resolve(null);
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}`);
    if (!response.ok) throw new Error('Failed to fetch timeslot');
    return response.json();
  };
  
  export const createTimeslot = async (groupId, timeslotData) => {
    if (USE_MOCK_DATA) {
      const gid = parseInt(groupId);
      const newTimeslot = {
        id: Date.now(),
        groupId: gid,
        ...timeslotData
      };
      
      if (!mockTimeslots[gid]) {
        mockTimeslots[gid] = [];
      }
      
      mockTimeslots[gid].push(newTimeslot);
      return Promise.resolve({...newTimeslot});
    }
    
    const response = await fetch(`${API_URL}/groups/${groupId}/timeslots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeslotData)
    });
    if (!response.ok) throw new Error('Failed to create timeslot');
    return response.json();
  };
  
  export const updateTimeslot = async (timeslotId, timeslotData) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      for (const groupId in mockTimeslots) {
        const index = mockTimeslots[groupId].findIndex(t => t.id === tid);
        if (index !== -1) {
          mockTimeslots[groupId][index] = { ...mockTimeslots[groupId][index], ...timeslotData };
          return Promise.resolve({...mockTimeslots[groupId][index]});
        }
      }
      throw new Error('Timeslot not found');
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeslotData)
    });
    if (!response.ok) throw new Error('Failed to update timeslot');
    return response.json();
  };
  
  export const deleteTimeslot = async (timeslotId) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      for (const groupId in mockTimeslots) {
        const index = mockTimeslots[groupId].findIndex(t => t.id === tid);
        if (index !== -1) {
          const deleted = mockTimeslots[groupId].splice(index, 1)[0];
          return Promise.resolve({success: true, deleted});
        }
      }
      throw new Error('Timeslot not found');
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete timeslot');
    return response.json();
  };
  
  export const getGroupByTimeslot = async (timeslotId) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      for (const groupId in mockTimeslots) {
        const timeslot = mockTimeslots[groupId].find(t => t.id === tid);
        if (timeslot) {
          const group = mockGroups.find(g => g.id === parseInt(groupId));
          return Promise.resolve({...group});
        }
      }
      throw new Error('Group not found for timeslot');
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/group`);
    if (!response.ok) throw new Error('Failed to get group for timeslot');
    return response.json();
  };
  
  // Queue management endpoints
  export const fetchQueueByTimeslot = async (timeslotId) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      return Promise.resolve({
        students: mockQueuesByTimeslot[tid] || [],
        status: queueStatusByTimeslot[tid] || 'inactive'
      });
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue`);
    if (!response.ok) throw new Error('Failed to fetch queue');
    return response.json();
  };
  
  export const startQueue = async (timeslotId) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      queueStatusByTimeslot[tid] = 'active';
      return Promise.resolve({ success: true, status: 'active' });
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/start`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to start queue');
    return response.json();
  };
  
  export const pauseQueue = async (timeslotId) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      queueStatusByTimeslot[tid] = 'paused';
      return Promise.resolve({ success: true, status: 'paused' });
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/pause`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to pause queue');
    return response.json();
  };
  
  export const callNextUser = async (timeslotId) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      const queue = mockQueuesByTimeslot[tid] || [];
      const nextUser = queue.find(u => u.status === 'waiting');
      if (nextUser) {
        nextUser.status = 'notified';
        return Promise.resolve({...nextUser});
      }
      return Promise.resolve(null);
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/next`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to call next user');
    return response.json();
  };
  
  export const markUserAsServed = async (timeslotId, userId) => {
    if (USE_MOCK_DATA) {
      const tid = parseInt(timeslotId);
      const uid = parseInt(userId);
      const queue = mockQueuesByTimeslot[tid] || [];
      const user = queue.find(u => u.id === uid);
      if (user) {
        user.status = 'served';
        return Promise.resolve({...user});
      }
      throw new Error('User not found');
    }
    
    const response = await fetch(`${API_URL}/timeslots/${timeslotId}/queue/${userId}/served`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to mark user as served');
    return response.json();
  };
*/