import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PublicationStats from '../Component/Publications/PublicationStats';
import PublicationFilters from '../Component/Publications/PublicationFilters';
import PublicationList from '../Component/Publications/PublicationList';
import PublicationDetailModal from '../Component/Publications/PublicationDetailModal';
import {
  fetchAdminPublications,
  deletePublication,
} from '../Api/publicationAdminApi';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const Publications = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [viewingPub, setViewingPub] = useState(null);

  const [stats, setStats] = useState({
    totalPublications: 3,
    totalDocumentedPages: 446,
    yearRange: '2013 – 2025',
    publishedCount: 3,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load publications from backend
  const loadPublications = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {};
      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const res = await fetchAdminPublications(params);
      if (res && res.success) {
        setPublications(res.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
      } else {
        throw new Error(res?.message || 'Failed to fetch publications');
      }
    } catch (err) {
      console.error('Error loading publications:', err);
      setError(err.friendlyMessage || err.message || 'Failed to load publications.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const handleOpenAdd = () => {
    navigate('/publications/add');
  };

  const handleEdit = (pub) => {
    const pubId = pub.id || pub._id;
    navigate(`/publications/edit/${pubId}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Publication?',
      text: 'Are you sure you want to permanently delete this publication edition?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800018',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
      },
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      await deletePublication(id);
      Toast.fire({
        icon: 'success',
        title: 'Publication deleted successfully.',
      });
      loadPublications();
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.friendlyMessage || err.message || 'Failed to delete publication.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Scholarly &amp; Association Press
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Publications &amp; Journals
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Catalog of official souvenirs, directories, architectural journals, and milestone editions.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* KPI Stats */}
      <PublicationStats stats={stats} />

      {/* Filters & Actions */}
      <PublicationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Publication List */}
      <PublicationList
        publications={publications}
        onView={(pub) => setViewingPub(pub)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        deletingId={deletingId}
      />

      {/* Publication Detail View Modal */}
      <PublicationDetailModal
        isOpen={Boolean(viewingPub)}
        onClose={() => setViewingPub(null)}
        publication={viewingPub}
        onEdit={(pub) => {
          setViewingPub(null);
          handleEdit(pub);
        }}
      />
    </div>
  );
};

export default Publications;
