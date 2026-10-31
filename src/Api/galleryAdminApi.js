import axiosInstance from './axiosInstance';

export const api = axiosInstance;

/**
 * Fetch all gallery photos for admin with optional filters & pagination
 */
export const fetchAdminGalleryPhotos = async (params = {}) => {
  const response = await axiosInstance.get('/gallery/admin', { params });
  return response.data;
};

/**
 * Create a new gallery photo (supports Base64 or URL)
 */
export const createGalleryPhoto = async (photoData) => {
  const response = await axiosInstance.post('/gallery', photoData);
  return response.data;
};

/**
 * Update existing gallery photo
 */
export const updateGalleryPhoto = async (id, photoData) => {
  const response = await axiosInstance.put(`/gallery/${id}`, photoData);
  return response.data;
};

/**
 * Delete a gallery photo
 */
export const deleteGalleryPhoto = async (id) => {
  const response = await axiosInstance.delete(`/gallery/${id}`);
  return response.data;
};

export default {
  fetchAdminGalleryPhotos,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
};
