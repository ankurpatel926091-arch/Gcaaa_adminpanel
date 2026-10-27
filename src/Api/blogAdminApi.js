import axiosInstance from './axiosInstance';

export const api = axiosInstance;

export const fetchAdminBlogs = async () => {
  const response = await axiosInstance.get('/blogs/admin/all');
  return response.data;
};

export const fetchBlogById = async (id) => {
  const response = await axiosInstance.get(`/blogs/${id}`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await axiosInstance.post('/blogs', blogData);
  return response.data;
};

export const updateBlog = async (id, blogData) => {
  const response = await axiosInstance.put(`/blogs/${id}`, blogData);
  return response.data;
};

export const toggleBlogStatus = async (id) => {
  const response = await axiosInstance.patch(`/blogs/${id}/status`);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await axiosInstance.delete(`/blogs/${id}`);
  return response.data;
};

export default axiosInstance;
