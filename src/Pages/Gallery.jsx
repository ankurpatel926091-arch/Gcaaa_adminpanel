import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import GalleryStats from '../Component/Gallery/GalleryStats';
import GalleryFilters from '../Component/Gallery/GalleryFilters';
import GalleryGrid from '../Component/Gallery/GalleryGrid';
import GalleryUploadModal from '../Component/Gallery/GalleryUploadModal';
import {
  fetchAdminGalleryPhotos,
  createGalleryPhoto,
  deleteGalleryPhoto,
} from '../Api/galleryAdminApi';

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

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('All Photos');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPhotos, setTotalPhotos] = useState(0);

  // KPI Stats
  const [stats, setStats] = useState({
    totalPhotos: 99,
    albumCount: 2,
    gbmCount: 72,
    dharoharCount: 27,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load photos from backend
  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: 12,
      };

      if (selectedAlbum && selectedAlbum !== 'All Albums' && selectedAlbum !== 'All Photos') {
        params.album = selectedAlbum;
      }

      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const res = await fetchAdminGalleryPhotos(params);
      if (res && res.success) {
        setPhotos(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalPhotos(res.pagination.total || 0);
        }
        if (res.stats) {
          setStats({
            totalPhotos: res.stats.totalPhotos ?? 99,
            albumCount: res.stats.albumCount ?? 2,
            gbmCount: res.stats.gbmCount ?? 72,
            dharoharCount: res.stats.dharoharCount ?? 27,
          });
        }
      } else {
        throw new Error(res?.message || 'Failed to fetch gallery photos');
      }
    } catch (err) {
      console.error('Error loading gallery photos:', err);
      setError(err.friendlyMessage || err.message || 'Failed to load gallery photos.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedAlbum, debouncedSearch]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Photograph?',
      text: 'Are you sure you want to permanently remove this photo from the gallery?',
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

    if (!result.isConfirmed) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteGalleryPhoto(id);
      Toast.fire({
        icon: 'success',
        title: 'Photograph deleted successfully.',
      });
      loadPhotos();
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.friendlyMessage || err.message || 'Failed to delete photo.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handlePreview = (item) => {
    const url = item.imageUrl || item.url || item.src;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleUpload = async (newPhotoData) => {
    try {
      await createGalleryPhoto(newPhotoData);
      Toast.fire({
        icon: 'success',
        title: 'Photograph published successfully to gallery!',
      });
      setCurrentPage(1);
      loadPhotos();
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.friendlyMessage || err.message || 'Failed to publish photo.',
      });
      throw err;
    }
  };

  const handleAlbumChange = (album) => {
    setSelectedAlbum(album);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Media &amp; Memories
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Photo Gallery Archive
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Historical records, reunion snapshots, campus heritage, and architectural showcases.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* KPI Stats */}
      <GalleryStats
        stats={stats}
        isLoading={isLoading}
      />

      {/* Filters */}
      <GalleryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedAlbum={selectedAlbum}
        setSelectedAlbum={handleAlbumChange}
        onOpenUpload={() => setUploadOpen(true)}
      />

      {/* Grid */}
      <GalleryGrid
        photos={photos}
        isLoading={isLoading}
        deletingId={deletingId}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-500">
            Showing Page <span className="font-bold text-gray-900">{currentPage}</span> of{' '}
            <span className="font-bold text-gray-900">{totalPages}</span> ({totalPhotos} total photos)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        pageNum === currentPage
                          ? 'bg-[#800018] text-white'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return (
                    <span key={pageNum} className="text-gray-400 text-xs px-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <GalleryUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Gallery;
