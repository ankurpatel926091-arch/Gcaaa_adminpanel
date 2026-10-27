import axiosInstance from './axiosInstance';

export const api = axiosInstance;

// Registered Members API endpoints
export const fetchRegisteredMembers = async (params = {}) => {
  const response = await axiosInstance.get('/registered-members', { params });
  return response.data;
};

export const fetchMemberStats = async (params = {}) => {
  const response = await axiosInstance.get('/registered-members/stats', { params });
  return response.data;
};

export const createRegisteredMember = async (memberData) => {
  const response = await axiosInstance.post('/registered-members', memberData);
  return response.data;
};

export const fetchMemberById = async (id) => {
  const response = await axiosInstance.get(`/registered-members/${id}`);
  return response.data;
};

export const updateMemberStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/registered-members/${id}/status`, { status });
  return response.data;
};

export const updateMember = async (id, memberData) => {
  const response = await axiosInstance.put(`/registered-members/${id}`, memberData);
  return response.data;
};

export const updateRegisteredMember = updateMember;

export const deleteMember = async (id) => {
  const response = await axiosInstance.delete(`/registered-members/${id}`);
  return response.data;
};

export const deleteRegisteredMember = deleteMember;

export default axiosInstance;
