import axiosInstance from './axiosInstance';

export const api = axiosInstance;

// Batch Alumni (All Batches of GCAAA) API endpoints
export const fetchBatchAlumni = async (params = {}) => {
  const response = await axiosInstance.get('/batch-alumni', { params });
  return response.data;
};

export const fetchBatchAlumniStats = async () => {
  const response = await axiosInstance.get('/batch-alumni/stats');
  return response.data;
};

export const fetchBatchAlumnusById = async (id) => {
  const response = await axiosInstance.get(`/batch-alumni/${id}`);
  return response.data;
};

export const createBatchAlumnus = async (data) => {
  const response = await axiosInstance.post('/batch-alumni', data);
  return response.data;
};

export const updateBatchAlumnus = async (id, data) => {
  const response = await axiosInstance.put(`/batch-alumni/${id}`, data);
  return response.data;
};

export const deleteBatchAlumnus = async (id) => {
  const response = await axiosInstance.delete(`/batch-alumni/${id}`);
  return response.data;
};

export default axiosInstance;
