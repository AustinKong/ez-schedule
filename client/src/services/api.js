// src/services/api.js
const API_URL = "http://localhost:5000/api";

// Group Endpoints
export const fetchGroups = async () => {
  const response = await fetch(`${API_URL}/groups`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch groups");
  return response.json();
};

export const fetchGroup = async (id) => {
  const response = await fetch(`${API_URL}/groups/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch group");
  return response.json();
};

export const createGroup = async (groupData) => {
  const response = await fetch(`${API_URL}/groups/createGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(groupData),
  });
  if (!response.ok) throw new Error("Failed to create group");
  return response.json();
};

export const updateGroup = async (id, groupData) => {
  const response = await fetch(`${API_URL}/groups/${id}/editGroup`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(groupData),
  });
  if (!response.ok) throw new Error("Failed to update group");
  return response.json();
};

export const deleteGroup = async (id) => {
  const response = await fetch(`${API_URL}/groups/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete group");
  return response.json();
};

export const fetchGroupById = async (id) => {
  const response = await fetch(`${API_URL}/groups/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch group by ID");
  return response.json();
};

export const joinGroup = async (groupId, password) => {
  const response = await fetch(`${API_URL}/groups/${groupId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) throw new Error("Failed to join group");
  return response.json();
};

export const leaveGroup = async (groupId) => {
  const response = await fetch(`${API_URL}/groups/${groupId}/leave`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to leave group");
  return response.json();
};

// Timeslot Endpoints
export const fetchTimeslotsByGroup = async (groupId) => {
  const response = await fetch(`${API_URL}/groups/${groupId}/timeslots`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  console.log(response);
  if (!response.ok) throw new Error("Failed to fetch timeslots");
  return response.json();
};

export const fetchTimeslot = async (timeslotId) => {
  const response = await fetch(`${API_URL}/slots/${timeslotId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch timeslot");
  return response.json();
};

export const createTimeslot = async (timeslotData) => {
  const response = await fetch(`${API_URL}/slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(timeslotData),
  });
  if (!response.ok) throw new Error("Failed to create timeslot");
  return response.json();
};

export const fetchHostTimeslots = async () => {
  const response = await fetch(`${API_URL}/slots/host`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch host timeslots");
  return response.json();
};

export const getSlotDetails = async (slotId) => {
  const response = await fetch(`${API_URL}/slots/${slotId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch slot details");
  return response.json();
};

export const advanceQueue = async (slotId) => {
  const response = await fetch(`${API_URL}/slots/${slotId}/advance`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // return handleResponse(response);
};

export const closeSlot = async (slotId) => {
  const response = await fetch(`${API_URL}/slots/${slotId}/close`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // return handleResponse(response);
};

export const updateTimeslot = async (timeslotId, timeslotData) => {
  const response = await fetch(`${API_URL}/slots/${timeslotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(timeslotData),
  });
  if (!response.ok) throw new Error("Failed to update timeslot");
  return response.json();
};

export const deleteTimeslot = async (timeslotId) => {
  const response = await fetch(`${API_URL}/slots/${timeslotId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete timeslot");
  return response.json();
};

export const getGroupByTimeslot = async (timeslotId) => {
  const response = await fetch(`${API_URL}/slots/${timeslotId}/group`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to get group for timeslot");
  return response.json();
};

// Queue management endpoints
export const fetchQueueByTimeslot = async (timeslotId) => {
  const response = await fetch(`${API_URL}/slots/${timeslotId}/queue`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch queue");
  return response.json();
};

export const startQueue = async (timeslotId) => {
  const response = await fetch(
    `${API_URL}/timeslots/${timeslotId}/queue/start`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to start queue");
  return response.json();
};

export const pauseQueue = async (timeslotId) => {
  const response = await fetch(
    `${API_URL}/timeslots/${timeslotId}/queue/pause`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to pause queue");
  return response.json();
};

export const callNextUser = async (timeslotId) => {
  const response = await fetch(
    `${API_URL}/timeslots/${timeslotId}/queue/next`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to call next user");
  return response.json();
};

export const markUserAsServed = async (timeslotId, userId) => {
  const response = await fetch(
    `${API_URL}/timeslots/${timeslotId}/queue/${userId}/served`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to mark user as served");
  return response.json();
};

export const joinQueue = async (timeslotId) => {
  const response = await fetch(`${API_URL}/slots/${timeslotId}/join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to join queue");
  return response.json();
};

//added in
export const submitPreConsultation = async (slotId, formData) => {
  const formPayload = new FormData();

  formPayload.append("concerns", formData.concerns);
  formPayload.append("objectives", formData.objectives);

  // Append each file individually
  if (formData.documents && formData.documents.length > 0) {
    for (const file of formData.documents) {
      formPayload.append("documents", file);
    }
  }

  await fetch(`/api/slots/${slotId}/preconsultation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      // ❌ DO NOT set Content-Type manually for FormData – let the browser handle it
    },
    body: formPayload,
  });
};

export const fetchSubmissions = async (slotId) => {};

export const fetchSubmissionDetails = async (slotId) => {
  const res = await fetch(`/api/preconsultation/slot/${slotId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch submission details");
  }

  const data = await res.json();
  return data;
};

//added in
export const checkExistingSubmission = async (slotId) => {
  const response = await fetch(`/api/preconsultations/slot/${slotId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return handleResponse(response);
};
