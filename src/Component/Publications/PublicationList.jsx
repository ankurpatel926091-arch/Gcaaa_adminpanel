import React from 'react';
import {
  Download,
  Calendar,
  FileText,
  Trash2,
  Edit3,
  ExternalLink,
  Bookmark,
  Loader2,
  Eye,
} from 'lucide-react';

const PublicationList = ({ publications = [], onView, onEdit, onDelete, isLoading, deletingId }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-xs flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#800018] animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading publications archive...</p>
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-gray-500">
          No publications match the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {publications.map((pub) => {
        const pubId = pub.id || pub._id;
        const isDeleting = deletingId === pubId;

        return (
          <div
            key={pubId}
            className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#800018]/50 hover:shadow-md"
          >
            <div>
              {/* Cover Preview + Badge */}
              <div className="flex gap-4">
                {pub.coverImg ? (
                  <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-gray-200 shadow-xs flex items-center justify-center">
                    <img
                      src={pub.coverImg}
                      alt={pub.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-28 shrink-0 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                    <Bookmark size={24} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-md bg-[#800018]/10 px-2 py-0.5 text-[10px] font-bold text-[#800018]">
                      Section {pub.sectionNumber || '01'}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold truncate">
                      {pub.edition || pub.year}
                    </span>
                  </div>

                  <h3 className="mt-1 font-serif text-base font-bold text-gray-900 group-hover:text-[#800018] transition-colors line-clamp-2">
                    {pub.title}
                  </h3>

                  {pub.tagline && (
                    <p className="text-[11px] italic text-[#800018] mt-0.5 truncate">
                      "{pub.tagline}"
                    </p>
                  )}
                </div>
              </div>

              {pub.description && (
                <p className="mt-3 text-xs leading-relaxed text-gray-600 line-clamp-2">
                  {pub.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-2.5">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar size={13} className="text-[#800018]" />
                  {pub.edition || `${pub.year} Edition`}
                </span>
                {pub.pages > 0 ? (
                  <span className="flex items-center gap-1 font-medium text-gray-500">
                    <FileText size={13} className="text-[#800018]" />
                    {pub.pages} Pages
                  </span>
                ) : (
                  <span className="text-gray-400">Section {pub.sectionNumber || '01'}</span>
                )}
                {pub.fileSize && (
                  <span className="text-gray-400">{pub.fileSize}</span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => onView(pub)}
                title="View Publication Details"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#800018] hover:bg-white hover:text-[#800018] transition cursor-pointer"
              >
                <Eye size={14} className="text-[#800018]" />
                <span>View Details</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit(pub)}
                  title="Edit Publication"
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#800018] transition cursor-pointer"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(pubId)}
                  disabled={isDeleting}
                  title="Delete Publication"
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PublicationList;
