import axiosInstance from './axiosInstance';

export const fetchAdminContactPageContent = async () => {
  const response = await axiosInstance.get('/contact-page/admin');
  return response.data;
};

export const updateContactPageContent = async (content) => {
  const response = await axiosInstance.put('/contact-page/admin', { content });
  return response.data;
};

export const fetchContactMessages = async () => {
  const response = await axiosInstance.get('/contact-page/messages/admin');
  return response.data;
};
