import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, Clock3, Pencil, RefreshCw, ShieldCheck, Trash2, Users, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { createBatch, getAllBatches, updateBatch, deleteBatch, getBatchFilterOptions } from '../Api/batch.api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', year: '', course: '', cohort: '', isPaid: false,
  });

  // Table Data State
  const [data, setData] = useState([]);

  // ✅ Backend stats aur pagination state
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Dynamic dropdown data
  const [batchYears, setBatchYears] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    batch: 'all',
    course: 'all',
    cohort: 'all',
    isPaid: 'all',
  });

  // --- FETCH DROPDOWN OPTIONS ---
  const fetchDropdownOptions = async () => {
    try {
      const response = await getBatchFilterOptions();
      if (response.success) {
        setBatchYears(response.data.years || []);
        setCohorts(response.data.cohorts || []);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  // --- FETCH DATA WITH FILTERS + PAGINATION ---
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const params = { page: pagination.page, limit: 50 }; // ✅ 50 per page
      if (filters.search) params.search = filters.search;
      if (filters.batch !== 'all') params.batch = filters.batch;
      if (filters.course !== 'all') params.course = filters.course;
      if (filters.cohort !== 'all') params.cohort = filters.cohort;
      if (filters.isPaid !== 'all') params.isPaid = filters.isPaid;

      const response = await getAllBatches(params);
      if (response.success) {
        setData(response.data);
        // ✅ Stats backend se (current filter ke hisaab se)
        setStats(response.stats || { total: 0, paid: 0, pending: 0 });
        // ✅ Pagination meta backend se
        setPagination({
          page: response.page || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      Swal.fire('Error', 'Failed to fetch batches', 'error');
    } finally {
      setIsFetching(false);
    }
  }, [filters, pagination.page]);

  // Initial load
  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  // Debounced fetch on filter/page change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // ✅ filter change -> page 1
  };

  // --- EDIT HANDLER ---
  const handleEdit = (batch) => {
    setEditId(batch._id);
    setFormData({
      name: batch.name,
      year: batch.year,
      course: batch.course,
      cohort: batch.cohort,
      isPaid: batch.isPaid,
    });
    setIsAddBatchOpen(true);
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800018',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteBatch(id);
        // Agar current page ka last item delete hua to prev page pe jaao
        if (data.length === 1 && pagination.page > 1) {
          setPagination((p) => ({ ...p, page: p.page - 1 }));
        } else {
          await fetchData();
        }
        await fetchDropdownOptions();
        Swal.fire('Deleted!', 'Batch has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting batch:', error);
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete batch', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'radio' ? value === 'true' : value });
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await updateBatch(editId, formData);
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'Batch updated successfully.', timer: 1500, showConfirmButton: false });
      } else {
        await createBatch(formData);
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Batch created successfully.', timer: 1500, showConfirmButton: false });
      }
      await fetchData();
      await fetchDropdownOptions();
      closeModal();
    } catch (error) {
      console.error('Error saving batch:', error);
      Swal.fire('Oops...', error.response?.data?.message || 'Failed to save batch', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsAddBatchOpen(false);
    setEditId(null);
    setFormData({ name: '', year: '', course: '', cohort: '', isPaid: false });
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">

      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-xs gap-3">
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Official Master Roll</h4>
          <h1 className="text-2xl font-serif font-bold text-gray-900">All Batches of GCAAA</h1>
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search All alumni by name..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#800020] focus:ring-2 focus:ring-[#800018]/10"
            />
          </div>

          {/* All Batches dropdown -> DB year field */}
          <select name="batch" value={filters.batch} onChange={handleFilterChange} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm outline-none cursor-pointer">
            <option value="all">All Batches</option>
            {batchYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>

          {/* All Courses dropdown -> DB cohort field */}
          <select name="cohort" value={filters.cohort} onChange={handleFilterChange} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm outline-none cursor-pointer">
            <option value="all">All Courses</option>
            {cohorts.map((cohort) => <option key={cohort} value={cohort}>{cohort}</option>)}
          </select>

          <select name="isPaid" value={filters.isPaid} onChange={handleFilterChange} className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm outline-none cursor-pointer">
            <option value="all">All Status</option>
            <option value="true">Paid</option>
            <option value="false">Pending</option>
          </select>

          <button onClick={fetchData} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-[#800018]/30 hover:bg-[#800018]/5 hover:text-[#800018]">
            <RefreshCw size={17} className={isFetching ? 'animate-spin' : ''} />
          </button>

          <button onClick={() => setIsAddBatchOpen(true)} className="rounded-xl bg-[#800018] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#690014]">
            <i className="fa-solid fa-user-plus mr-2"></i> Add to Batch
          </button>
        </div>
      </header>

      {/* Stats Cards — backend se */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-start">
          <div>
            <h5 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Total in Cohort</h5>
            <h2 className="text-2xl font-serif font-bold mb-1 text-gray-900">{stats.total}</h2>
            <p className="text-xs text-gray-500">Matching current filters</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-[#800018] text-lg"><Users size={19} /></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-start">
          <div>
            <h5 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Paid / Verified</h5>
            <h2 className="text-2xl font-serif font-bold mb-1 text-emerald-700">{stats.paid}</h2>
            <p className="text-xs text-gray-500">Membership fee confirmed</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-emerald-700 text-lg"><ShieldCheck size={19} /></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-start">
          <div>
            <h5 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Pending Verification</h5>
            <h2 className="text-2xl font-serif font-bold mb-1 text-rose-600">{stats.pending}</h2>
            <p className="text-xs text-gray-500">Awaiting fee review</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-rose-600 text-lg"><Clock3 size={19} /></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex justify-between items-start">
          <div>
            <h5 className="text-xs text-gray-500 uppercase mb-2 font-semibold">Active Batch</h5>
            <h2 className="text-lg font-serif font-bold mb-1 mt-1 text-gray-900">All Batches</h2>
            <p className="text-xs text-gray-500">Showing {data.length} of {stats.total} records</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-[#800018] text-lg"><CalendarDays size={19} /></div>
        </div>
      </section>

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">

        {/* --- MODAL START --- */}
        {isAddBatchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
            <form onSubmit={handleSubmit} className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#800018]">Official Master Roll</p>
                  <h2 className="mt-1 font-serif text-xl font-bold text-gray-900">{editId ? 'Edit Batch' : 'Add Batch'}</h2>
                </div>
                <button type="button" onClick={closeModal} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"><span className="text-2xl leading-none">&times;</span></button>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium text-gray-700">
                  Alumni Name
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter full name" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal outline-none focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10" />
                </label>

                <label className="space-y-1.5 text-sm font-medium text-gray-700">
                  Graduation Year
                  <input type="text" name="year" value={formData.year} onChange={handleChange} required placeholder="e.g. 2024" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal outline-none focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10" />
                </label>

                <label className="space-y-1.5 text-sm font-medium text-gray-700">
                  Course / Program
                  <input type="text" name="course" value={formData.course} onChange={handleChange} required placeholder="e.g. Bachelor of Architecture" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal outline-none focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10" />
                </label>

                <label className="space-y-1.5 text-sm font-medium text-gray-700">
                  Cohort
                  <select name="cohort" value={formData.cohort} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#800018]">
                    <option value="" disabled>Select cohort</option>
                    {cohorts.map((cohort) => <option key={cohort} value={cohort}>{cohort}</option>)}
                  </select>
                </label>

                <div className="space-y-2 text-sm font-medium text-gray-700 sm:col-span-2">
                  <span>Payment Status</span>
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="isPaid" value="true" checked={formData.isPaid === true} onChange={handleChange} className="w-4 h-4 text-[#800018] focus:ring-[#800018]" />
                      <span className="font-normal text-gray-800">Paid / Verified</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="isPaid" value="false" checked={formData.isPaid === false} onChange={handleChange} className="w-4 h-4 text-[#800018] focus:ring-[#800018]" />
                      <span className="font-normal text-gray-800">Pending</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">Fill details to save the batch.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 rounded-xl bg-[#800018] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#690014] disabled:opacity-70">
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? 'Saving...' : (editId ? 'Update Batch' : 'Save Batch')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* --- MODAL END --- */}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead className="bg-[#800020] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">S.No <i className="fa-solid fa-sort ml-1 opacity-70"></i></th>
                <th className="px-4 py-3">Actions</th>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">Graduation Year</th>
                <th className="px-4 py-3">Course / Program</th>
                <th className="px-4 py-3">Payment Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isFetching ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#800018]" />
                    Loading data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No batches found. Try changing filters or add a new batch.
                  </td>
                </tr>
              ) : (
                data.map((atm, i) => (
                  <tr key={atm._id} className="border-b border-gray-100 hover:bg-[#800018]/[0.03] transition">
                    {/* ✅ Serial no. page ke hisaab se */}
                    <td className="px-4 py-3">{(pagination.page - 1) * 50 + i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(atm)} type="button" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(atm._id)} type="button" className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100"><Trash2 size={15} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="font-medium">{atm.name}</span></div></td>
                    <td className="px-4 py-3 text-gray-600">{atm.year}</td>
                    <td className="px-4 py-3 text-gray-600">{atm.course}</td>
                    <td className="px-4 py-3 text-gray-600"> <span className={atm.isPaid ? 'text-green-600' : 'text-red-600'}>{(atm.isPaid ? 'Paid' : 'Pending')}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination UI */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-800">{pagination.page}</span> of{' '}
            <span className="font-semibold text-gray-800">{pagination.totalPages}</span> — Total{' '}
            <span className="font-semibold text-gray-800">{stats.total}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || isFetching}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || isFetching}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;