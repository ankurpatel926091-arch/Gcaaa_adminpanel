import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  FileSignature,
} from 'lucide-react';
import {
  deleteWithdrawal,
  fetchAdminWithdrawals,
  fetchWithdrawalById,
  updateWithdrawal,
} from '../Api/withdrawal.api';
import { confirmDelete, showSuccess, showError, showLoading, closeLoading } from '../utils/alerts';
// import {
//   confirmDelete,
//   showSuccess,
//   showError,
//   showLoading,
//   closeLoading,
// } from '../utils/alerts';    

const electionPosts = [
  'President ',
  'Vice President ',
  'General Secretary',
  'Joint Secretary ',
  'Treasurer ',
  'Executive Member (i) ',
  'Executive Member (ii) ',
  'Executive Member (iii) ',
];

// ---------------------- View Modal ----------------------
const WithdrawalViewModal = ({ isOpen, onClose, withdrawal }) => {
  if (!isOpen || !withdrawal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-[#700018] px-5 py-3.5 text-white">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <FileSignature size={18} />
            Withdrawal Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Candidate Name" value={withdrawal.candidateName} />
            <Field label="Post Nominated" value={withdrawal.postNominated} />
            <Field label="Proposer Name" value={withdrawal.proposerName} />
            <Field label="Seconder Name" value={withdrawal.seconderName} />
          </div>

          <Field label="Candidate Address" value={withdrawal.candidateAddress} />

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Signature
            </p>
            {withdrawal.signature ? (
              <a href={withdrawal.signature} target="_blank" rel="noreferrer">
                <img
                  src={withdrawal.signature}
                  alt="Signature"
                  className="h-28 w-auto rounded-lg border border-gray-200 bg-gray-50 p-1 object-contain transition hover:opacity-80"
                />
              </a>
            ) : (
              <p className="text-sm text-gray-500">—</p>
            )}
          </div>

          {withdrawal.createdAt && (
            <Field
              label="Submitted On"
              value={new Date(withdrawal.createdAt).toLocaleString()}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t bg-gray-50 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#700018] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#800018]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </p>
    <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm break-words text-gray-800">
      {value || '—'}
    </p>
  </div>
);

// ---------------------- Edit Modal ----------------------
const WithdrawalEditModal = ({ isOpen, onClose, withdrawal, onSaved }) => {
  const [form, setForm] = useState({
    candidateName: '',
    postNominated: '',
    proposerName: '',
    seconderName: '',
    candidateAddress: '',
  });
  const [newSignature, setNewSignature] = useState(''); // base64
  const [signaturePreview, setSignaturePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (withdrawal) {
      setForm({
        candidateName: withdrawal.candidateName || '',
        postNominated: withdrawal.postNominated || '',
        proposerName: withdrawal.proposerName || '',
        seconderName: withdrawal.seconderName || '',
        candidateAddress: withdrawal.candidateAddress || '',
      });
      setNewSignature('');
      setSignaturePreview('');
      setError('');
    }
  }, [withdrawal]);

  if (!isOpen || !withdrawal) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignatureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setNewSignature('');
      setSignaturePreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for signature.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Signature image must be smaller than 5MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignaturePreview(reader.result);
      setNewSignature(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = { ...form };
      if (newSignature) payload.signature = newSignature;

      showLoading('Updating...');
      const res = await updateWithdrawal(withdrawal.id, payload);
      closeLoading();

      if (res.success) {
        await showSuccess('Updated!', 'Withdrawal updated successfully.');
        onSaved?.('Withdrawal updated successfully.');
        onClose();
      } else {
        setError(res.message || 'Failed to update withdrawal.');
        showError('Update failed', res.message || 'Could not update withdrawal.');
      }
    } catch (err) {
      closeLoading();
      console.error('Update error:', err);
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Failed to update withdrawal.';
      setError(msg);
      showError('Update failed', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b bg-[#700018] px-5 py-3.5 text-white">
          <h3 className="flex items-center gap-2 text-base font-bold">
            <Pencil size={18} />
            Edit Withdrawal
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 transition hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Candidate Name"
              name="candidateName"
              value={form.candidateName}
              onChange={handleChange}
              required
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Post Nominated
              </label>
              <select
                name="postNominated"
                value={form.postNominated}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#700018]"
              >
                <option value="" disabled>
                  -- Select Post --
                </option>
                {electionPosts.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Proposer Name"
              name="proposerName"
              value={form.proposerName}
              onChange={handleChange}
              required
            />
            <Input
              label="Seconder Name"
              name="seconderName"
              value={form.seconderName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Candidate Address
            </label>
            <textarea
              name="candidateAddress"
              value={form.candidateAddress}
              onChange={handleChange}
              rows={2}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#700018]"
            />
          </div>

          {/* Signature replace (optional) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Signature (Optional — leave empty to keep current)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <img
                src={signaturePreview || withdrawal.signature}
                alt="Signature preview"
                className="h-16 w-auto rounded border border-gray-200 bg-gray-50 p-1 object-contain"
              />
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleSignatureChange}
                className="cursor-pointer text-sm file:mr-3 file:rounded file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-red-700"
              />
            </div>
            {newSignature && (
              <p className="mt-1.5 text-xs text-emerald-700">
                New signature will replace the existing one.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#700018] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#800018] disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#700018]"
    />
  </div>
);

// ---------------------- Main Page ----------------------
const WithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filters & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedPost, pageSize]);

  // Load data
  const loadWithdrawals = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        ...(selectedPost && { postNominated: selectedPost }),
      };
      const res = await fetchAdminWithdrawals(params);

      if (res.success) {
        setWithdrawals(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || 0);
      } else {
        setErrorMsg(res.message || 'Failed to load withdrawals.');
      }
    } catch (err) {
      console.error('Fetch withdrawals failed:', err);
      setErrorMsg(
        err?.response?.data?.message || 'Could not connect to backend.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, selectedPost]);

  useEffect(() => {
    loadWithdrawals();
  }, [loadWithdrawals]);

  // Actions
  const handleView = async (item) => {
    setViewingItem(item);
    setViewOpen(true);
    try {
      const res = await fetchWithdrawalById(item.id);
      if (res.success && res.data) setViewingItem(res.data);
    } catch (err) {
      console.warn('Could not refresh detail:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await confirmDelete(
      'Delete this withdrawal?',
      'This action cannot be undone.'
    );
    if (!result.isConfirmed) return;

    try {
      showLoading('Deleting...');
      const res = await deleteWithdrawal(id);
      closeLoading();

      if (res.success) {
        await showSuccess('Deleted!', 'Withdrawal has been deleted successfully.');
        setFeedbackMsg('Withdrawal deleted successfully.');
        loadWithdrawals();
        setTimeout(() => setFeedbackMsg(''), 3000);
      } else {
        showError(
          'Delete failed',
          res.message || 'Could not delete this withdrawal.'
        );
      }
    } catch (err) {
      closeLoading();
      showError(
        'Delete failed',
        err?.response?.data?.message || err.message || 'Something went wrong.'
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Filters + Actions Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative min-w-[220px] flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, proposer, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#700018]"
              />
            </div>

            {/* Post filter */}
            <select
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#700018]"
            >
              <option value="">All Posts</option>
              {electionPosts.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Page size */}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#700018]"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {feedbackMsg && (
              <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                {feedbackMsg}
              </span>
            )}
            {errorMsg && (
              <span className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                {errorMsg}
              </span>
            )}
            <button
              onClick={loadWithdrawals}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Proposer</th>
                <th className="px-4 py-3">Seconder</th>
                <th className="px-4 py-3">Signature</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    Loading withdrawals...
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    No withdrawals found.
                  </td>
                </tr>
              ) : (
                withdrawals.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {item.candidateName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.postNominated}</td>
                    <td className="px-4 py-3 text-gray-700">{item.proposerName}</td>
                    <td className="px-4 py-3 text-gray-700">{item.seconderName}</td>
                    <td className="px-4 py-3">
                      {item.signature ? (
                        <a href={item.signature} target="_blank" rel="noreferrer">
                          <img
                            src={item.signature}
                            alt="Signature"
                            className="h-10 w-auto rounded border border-gray-200 bg-gray-50 p-0.5 object-contain transition hover:opacity-80"
                          />
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(item)}
                          title="View"
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t bg-gray-50 px-4 py-3 sm:flex-row">
          <p className="text-xs text-gray-600">
            Showing{' '}
            <span className="font-semibold">
              {withdrawals.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {(currentPage - 1) * pageSize + withdrawals.length}
            </span>{' '}
            of <span className="font-semibold">{totalCount}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs font-semibold text-gray-700">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WithdrawalViewModal
        isOpen={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setViewingItem(null);
        }}
        withdrawal={viewingItem}
      />
      <WithdrawalEditModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingItem(null);
        }}
        withdrawal={editingItem}
        onSaved={(msg) => {
          setFeedbackMsg(msg || 'Withdrawal updated.');
          loadWithdrawals();
          setTimeout(() => setFeedbackMsg(''), 3000);
        }}
      />
    </div>
  );
};

export default WithdrawalsPage;