import axiosInstance from './axiosInstance';

export const api = axiosInstance;

/**
 * Fetch all publications for admin with optional search & pagination
 */
export const fetchAdminPublications = async (params = {}) => {
  const response = await axiosInstance.get('/publications/admin', { params });
  return response.data;
};

/**
 * Fetch single publication by ID
 */
export const fetchPublicationById = async (id) => {
  const response = await axiosInstance.get(`/publications/${id}`);
  return response.data;
};

/**
 * Upload PDF File directly to Cloudinary
 */
export const uploadPublicationPdfFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('pdf', file);
  const response = await axiosInstance.post('/publications/upload-pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

/**
 * Create a new publication
 */
export const createPublication = async (data) => {
  const response = await axiosInstance.post('/publications', data);
  return response.data;
};

/**
 * Update existing publication
 */
export const updatePublication = async (id, data) => {
  const response = await axiosInstance.put(`/publications/${id}`, data);
  return response.data;
};

/**
 * Delete a publication
 */
export const deletePublication = async (id) => {
  const response = await axiosInstance.delete(`/publications/${id}`);
  return response.data;
};

export default {
  fetchAdminPublications,
  fetchPublicationById,
  uploadPublicationPdfFile,
  createPublication,
  updatePublication,
  deletePublication,
};
