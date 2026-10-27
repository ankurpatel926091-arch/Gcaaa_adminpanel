import axiosInstance from './axiosInstance';

export const adminApi = axiosInstance;

export const fetchElectionNominations = async (params = {}) => {
  const response = await axiosInstance.get('/election-nominations', { params });
  return response.data;
};

export const fetchNominationById = async (id) => {
  const response = await axiosInstance.get(`/election-nominations/${id}`);
  return response.data;
};

export const updateNominationStatus = async (id, payload) => {
  const response = await axiosInstance.put(`/election-nominations/${id}`, payload);
  return response.data;
};

export const deleteNomination = async (id) => {
  const response = await axiosInstance.delete(`/election-nominations/${id}`);
  return response.data;
};

export default axiosInstance;
