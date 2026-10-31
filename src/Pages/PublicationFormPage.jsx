import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink,
  Bookmark,
  Eye,
} from 'lucide-react';
import {
  createPublication,
  updatePublication,
  fetchPublicationById,
  uploadPublicationPdfFile,
} from '../Api/publicationAdminApi';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const PublicationFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    edition: '2026 Edition',
    sectionNumber: '04',
    year: '2026',
    publisher: 'Alumni Association, Government College of Architecture Lucknow (GCAAA)',
    description: '',
    highlightsText: '',
    coverImg: '',
    pdfUrl: '',
    downloadFilename: '',
    pages: 0,
    fileSize: '',
    isPublished: true,
  });

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // PDF Upload states
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const pdfInputRef = useRef(null);

  // Cover Image states
  const [coverPreview, setCoverPreview] = useState('');
  const coverInputRef = useRef(null);

  // Load existing publication if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;
    const fetchExisting = async () => {
      try {
        setInitialLoading(true);
        const res = await fetchPublicationById(id);
        if (res && res.success && res.data && isMounted) {
          const pub = res.data;
          setFormData({
            title: pub.title || '',
            tagline: pub.tagline || '',
            edition: pub.edition || '',
            sectionNumber: pub.sectionNumber || '01',
            year: pub.year || '2026',
            publisher: pub.publisher || 'Alumni Association, Government College of Architecture Lucknow (GCAAA)',
            description: pub.description || '',
            highlightsText: Array.isArray(pub.highlights) ? pub.highlights.join('\n') : '',
            coverImg: pub.coverImg || '',
            pdfUrl: pub.pdfUrl || '',
            downloadFilename: pub.downloadFilename || '',
            pages: pub.pages || 0,
            fileSize: pub.fileSize || '',
            isPublished: pub.isPublished !== false,
          });
          setCoverPreview(pub.coverImg || '');
        }
      } catch (err) {
        console.error('Failed to load publication:', err);
        setErrorMessage(err.message || 'Failed to load existing publication.');
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    fetchExisting();
    return () => {
      isMounted = false;
    };
  }, [id, isEditMode]);

  // Handle Cover Image selection
  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image',
        text: 'Please select a valid image file (JPG, PNG, WEBP).',
        confirmButtonColor: '#800018',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Cover image must be under 10MB.',
        confirmButtonColor: '#800018',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, coverImg: reader.result }));
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF file selection & direct upload
  const handlePdfSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Document',
        text: 'Please select a valid PDF file (*.pdf).',
        confirmButtonColor: '#800018',
      });
      return;
    }

    setPdfFile(file);
    setIsUploadingPdf(true);
    setPdfUploadProgress(10);

    try {
      const uploadRes = await uploadPublicationPdfFile(file, (percent) => {
        setPdfUploadProgress(percent);
      });

      if (uploadRes && uploadRes.success && uploadRes.pdfUrl) {
        setFormData((prev) => ({
          ...prev,
          pdfUrl: uploadRes.pdfUrl,
          downloadFilename: file.name,
          pages: uploadRes.pages || prev.pages || 0,
          fileSize: uploadRes.fileSize || prev.fileSize || '',
        }));
        setPdfUploadProgress(100);
        Toast.fire({
          icon: 'success',
          title: 'PDF document uploaded successfully!',
        });
      } else {
        throw new Error(uploadRes?.message || 'Failed to upload PDF.');
      }
    } catch (err) {
      console.error('PDF upload error:', err);
      // Fallback: Read as Base64 Data URL so it saves on form submission
      try {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({
            ...prev,
            pdfUrl: reader.result,
            downloadFilename: file.name,
          }));
          setPdfUploadProgress(100);
          Toast.fire({
            icon: 'info',
            title: 'PDF ready for upload on submission.',
          });
        };
        reader.readAsDataURL(file);
      } catch (fallbackErr) {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: err.message || 'Could not upload PDF.',
          confirmButtonColor: '#800018',
        });
      }
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setErrorMessage('Publication Title is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const highlights = formData.highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      edition: formData.edition.trim(),
      sectionNumber: formData.sectionNumber.trim(),
      year: formData.year.trim(),
      publisher: formData.publisher.trim(),
      description: formData.description.trim(),
      coverImg: formData.coverImg,
      pdfUrl: formData.pdfUrl,
      downloadFilename: formData.downloadFilename || `${formData.title.replace(/\s+/g, '_')}.pdf`,
      pages: Number(formData.pages) || 0,
      fileSize: formData.fileSize || '',
      highlights,
      isPublished: formData.isPublished,
    };

    try {
      if (isEditMode) {
        await updatePublication(id, payload);
        Toast.fire({
          icon: 'success',
          title: 'Publication updated successfully!',
        });
      } else {
        await createPublication(payload);
        Toast.fire({
          icon: 'success',
          title: 'Publication created and published successfully!',
        });
      }
      navigate('/publications');
    } catch (err) {
      console.error('Save publication failed:', err);
      setErrorMessage(err.friendlyMessage || err.message || 'Failed to save publication.');
      Swal.fire({
        icon: 'error',
        title: 'Error Saving Publication',
        text: err.friendlyMessage || err.message || 'Failed to save publication.',
        confirmButtonColor: '#800018',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <Loader2 className="w-10 h-10 text-[#800018] animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading publication details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/publications')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#800018] transition mb-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Publications Catalog
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Edit Publication Edition' : 'Add New Publication'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage commemorative souvenirs, journals, directories, and architectural publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/publications')}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isUploadingPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#a00020] transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditMode ? 'Update Publication' : 'Publish Publication'}</span>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Basic Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2.5">
                Publication Details
              </h3>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Publication Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dharohar '26 Souvenir & Directory"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Tying knots between the past and the future"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden"
                />
              </div>

              {/* Grid: Edition, Section No, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Edition Label</label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    placeholder="2026 Edition"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section No.</label>
                  <input
                    type="text"
                    value={formData.sectionNumber}
                    onChange={(e) => setFormData({ ...formData, sectionNumber: e.target.value })}
                    placeholder="04"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden"
                  />
                </div>
              </div>

              {/* Publisher */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Publisher</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  placeholder="Alumni Association, Government College of Architecture Lucknow (GCAAA)"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden"
                />
              </div>
            </div>

            {/* Card 2: PDF Document Upload */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    PDF Document Upload
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload official PDF edition directly to Cloudinary archive.
                  </p>
                </div>
                {formData.pdfUrl && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={13} /> PDF Attached
                  </span>
                )}
              </div>

              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfSelect}
                className="hidden"
              />

              {/* Upload Dropzone */}
              <div
                onClick={() => pdfInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                  formData.pdfUrl
                    ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                    : 'border-gray-300 hover:border-[#800018] hover:bg-[#800018]/5'
                }`}
              >
                {isUploadingPdf ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-[#800018] animate-spin" />
                    <p className="text-xs font-bold text-gray-800">Uploading PDF to Cloudinary...</p>
                    {pdfUploadProgress !== null && (
                      <div className="w-48 bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                        <div
                          className="bg-[#800018] h-2 transition-all duration-300"
                          style={{ width: `${pdfUploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : formData.pdfUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
                      <FileText size={28} />
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {formData.downloadFilename || pdfFile?.name || 'Publication Document (.pdf)'}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      Click to choose a different PDF file to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-gray-100 p-3 text-gray-500">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Click or drag &amp; drop to upload PDF File
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Supports high-resolution PDF documents up to 100MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Current PDF URL / View link if available */}
              {formData.pdfUrl && (
                <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText size={16} className="text-[#800018] shrink-0" />
                    <a
                      href={formData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#800018] hover:underline truncate"
                    >
                      {formData.downloadFilename || 'View Uploaded PDF'}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={formData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                      title="Open PDF"
                    >
                      <ExternalLink size={15} />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, pdfUrl: '', downloadFilename: '' }));
                        setPdfFile(null);
                      }}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      title="Remove PDF"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Card 3: Description & Highlights */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2.5">
                Overview &amp; Highlights
              </h3>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description / Executive Summary
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="The official commemorative souvenir of GCAAA documenting alumni cohorts, visionary presidential messages..."
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden leading-relaxed"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Included in this Edition (Highlights)
                </label>
                <p className="text-[11px] text-gray-500 mb-1.5">
                  Enter one highlight per line. These appear as checkmark bullet points on the website.
                </p>
                <textarea
                  rows={4}
                  value={formData.highlightsText}
                  onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                  placeholder={`Presidential & Patron addresses from eminent architectural leaders\nComprehensive alumni directory roll and batchwise rosters\nPhoto gallery archives from campus life\nExecutive committee reports and strategic roadmaps`}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 font-mono focus:border-[#800018] focus:ring-1 focus:ring-[#800018] outline-hidden leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Book Cover Image & Publishing Status (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Book Cover Picker */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  3D Book Cover
                </h3>
                {coverPreview && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Image Selected
                  </span>
                )}
              </div>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />

              {/* Cover Preview Box */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="relative w-full max-w-[220px] aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border-2 border-dashed border-gray-300 hover:border-[#800018] shadow-md flex items-center justify-center p-2 cursor-pointer transition group"
                >
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Cover Preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                        <Upload size={16} />
                        Change Cover
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 p-4 text-center">
                      <Bookmark size={32} />
                      <p className="text-xs font-bold text-gray-300">Click to Select Book Cover</p>
                      <p className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  <Upload size={14} />
                  {coverPreview ? 'Change Book Cover' : 'Upload Cover Image'}
                </button>
              </div>
            </div>

            {/* Publishing Settings */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2.5">
                Publish Status
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Live on Website</p>
                  <p className="text-[11px] text-gray-500">Make this edition publicly accessible</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#800018]" />
                </label>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isUploadingPdf}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#800018] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#a00020] transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving Publication...</span>
                  </>
                ) : (
                  <span>{isEditMode ? 'Update Publication' : 'Publish Publication'}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/publications')}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel &amp; Return
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PublicationFormPage;
