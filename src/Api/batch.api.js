import axiosInstance from './axiosInstance';

export const api = axiosInstance;

// Batch API endpoints

// ✅ Create a new Batch
export const createBatch = async (batchData) => {
  const response = await axiosInstance.post('/batches', batchData);
  return response.data;
};

// ✅ Get All Batches
export const getAllBatches = async (params = {}) => {
  const response = await axiosInstance.get('/batches', { params });
  return response.data;
};

// ✅ Get Single Batch by ID
export const getBatchById = async (id) => {
  const response = await axiosInstance.get(`/batches/${id}`);
  return response.data;
};

// ✅ Update (Edit) Batch by ID
export const updateBatch = async (id, batchData) => {
  const response = await axiosInstance.put(`/batches/${id}`, batchData);
  return response.data;
};
// ✅ Get Filter Options (Unique Years & Cohorts)
export const getBatchFilterOptions = async () => {
  const response = await axiosInstance.get('/batches/filter-options');
  return response.data;
};

// ✅ Delete Batch by ID
export const deleteBatch = async (id) => {
  const response = await axiosInstance.delete(`/batches/${id}`);
  return response.data;
};

export default axiosInstance;