import axiosInstance from './axiosInstance';

export const withdrawalApi = axiosInstance;

/**
 * Admin: Fetch all withdrawals with global search, pagination & filter
 * @param {object} params - { search, page, limit, postNominated }
 */
export const fetchAdminWithdrawals = async (params = {}) => {
  const response = await axiosInstance.get('/withdrawals', { params });
  return response.data;
};

/**
 * Admin: Fetch single withdrawal by ID
 * @param {string} id
 */
export const fetchWithdrawalById = async (id) => {
  const response = await axiosInstance.get(`/withdrawals/${id}`);
  return response.data;
};

/**
 * Admin: Delete a withdrawal by ID
 * @param {string} id
 */
export const deleteWithdrawal = async (id) => {
  const response = await axiosInstance.delete(`/withdrawals/${id}`);
  return response.data;
};
export const updateWithdrawal = async (id, data) => {
  const response = await axiosInstance.put(`/withdrawals/${id}`, data);
  return response.data;
};

export default axiosInstance;