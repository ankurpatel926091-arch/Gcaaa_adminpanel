import React from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Calendar,
  Layers,
  Bookmark,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

const PublicationDetailModal = ({ isOpen, onClose, publication, onEdit }) => {
  if (!isOpen || !publication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl transition-all animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#800018] px-3 py-0.5 text-xs font-bold text-white">
              Section {publication.sectionNumber || '01'}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {publication.edition || 'Official Archive'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(publication);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <Edit3 size={14} />
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Cover Preview */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[280px] rounded-2xl overflow-hidden bg-neutral-900 border-2 border-gray-200 p-3 shadow-lg flex items-center justify-center aspect-[3/4]">
                {publication.coverImg ? (
                  <img
                    src={publication.coverImg}
                    alt={publication.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <Bookmark size={36} />
                    <span className="text-xs">No Cover Image</span>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="w-full max-w-[280px] mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Edition</p>
                  <p className="text-xs font-extrabold text-gray-900 truncate">{publication.edition || 'Official'}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Release Year</p>
                  <p className="text-xs font-extrabold text-gray-900">{publication.year}</p>
                </div>
              </div>
            </div>

            {/* Right Details */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="inline-block rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold mb-2">
                  {publication.badge || `${publication.year} Edition`}
                </span>
                <h2 className="font-serif text-2xl font-bold text-gray-900">
                  {publication.title}
                </h2>
                {publication.tagline && (
                  <p className="text-xs sm:text-sm font-semibold italic text-[#800018] mt-1">
                    "{publication.tagline}"
                  </p>
                )}
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  <strong className="text-gray-700">Publisher:</strong>{' '}
                  {publication.publisher || 'Alumni Association, Government College of Architecture Lucknow'}
                </p>
                {publication.fileSize && (
                  <p>
                    <strong className="text-gray-700">File Size:</strong> {publication.fileSize}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1.5">
                  Synopsis / Overview:
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {publication.description || 'No description provided.'}
                </p>
              </div>

              {/* Highlights */}
              {Array.isArray(publication.highlights) && publication.highlights.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                    Included in this Edition:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {publication.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <CheckCircle2 size={14} className="text-[#800018] mt-0.5 shrink-0" />
                        <span className="text-gray-700 text-[11px] leading-tight">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections / Chapters Covered */}
              {Array.isArray(publication.sectionsCovered) && publication.sectionsCovered.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
                    Structure &amp; Chapters:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {publication.sectionsCovered.map((s, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="font-bold text-gray-800 text-xs">• {s.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {publication.pdfUrl && (
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                  <a
                    href={publication.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] cursor-pointer"
                  >
                    <ExternalLink size={15} />
                    Open PDF in New Tab
                  </a>
                  <a
                    href={publication.pdfUrl}
                    download={publication.downloadFilename || `${publication.title}.pdf`}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <Download size={15} />
                    Download PDF File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetailModal;
