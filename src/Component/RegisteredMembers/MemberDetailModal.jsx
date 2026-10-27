import React, { useState } from 'react'
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Award,
  Briefcase,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Edit3,
  Camera,
  Eye,
} from 'lucide-react'

const MemberDetailModal = ({ isOpen, onClose, member, onEdit, onApprove }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null)

  if (!isOpen || !member) return null

  const payment = member.paymentDetails || {}
  const office = member.officeAddress || {}
  const residence = member.residenceAddress || {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3.5">
            <div
              onClick={() => member.photo && setFullscreenImage({ url: member.photo, title: `${member.name} - Profile Photo` })}
              className={`group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#800018]/10 text-[#800018] font-bold overflow-hidden shadow-xs border border-gray-100 ${
                member.photo ? 'cursor-pointer hover:ring-2 hover:ring-[#800018]/40 transition' : ''
              }`}
              title={member.photo ? 'Click to view full photo' : ''}
            >
              {member.photo ? (
                <>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Eye size={16} />
                  </div>
                </>
              ) : (
                <User size={22} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {member.name}
                </h3>
                {member.photo && (
                  <button
                    type="button"
                    onClick={() => setFullscreenImage({ url: member.photo, title: `${member.name} - Profile Photo` })}
                    className="text-[11px] font-semibold text-[#800018] hover:underline flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-0.5 rounded-md"
                  >
                    <Eye size={11} />
                    <span>View Photo</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Membership No:{' '}
                <strong className="text-[#800018] font-bold">
                  {member.membershipNo}
                </strong>{' '}
                • S.No: #{member.sno || member.displaySno || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                member.status === 'Paid' || member.status === 'Verified' || member.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                  : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
              }`}
            >
              {member.status === 'Paid' || member.status === 'Verified' || member.status === 'Active' ? (
                <>
                  <ShieldCheck size={12} />
                  <span>Paid</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} />
                  <span>Pending</span>
                </>
              )}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-gray-50/80 p-3.5 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Graduation Year</span>
              <strong className="text-sm font-extrabold text-gray-900">
                {member.year ? `Batch of ${member.year}` : 'N/A'}
              </strong>
            </div>

            <div className="rounded-2xl bg-gray-50/80 p-3.5 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Cohort</span>
              <strong className="text-sm font-extrabold text-[#800018]">
                {member.cohort || 'all'}
              </strong>
            </div>

            <div className="rounded-2xl bg-gray-50/80 p-3.5 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Occupation</span>
              <strong className="text-sm font-extrabold text-gray-900 truncate block">
                {member.occupation || 'Selfemployed'}
              </strong>
            </div>

            <div className="rounded-2xl bg-gray-50/80 p-3.5 border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Membership Fee</span>
              <strong className="text-sm font-extrabold text-emerald-700">
                {payment.amount ? `₹ ${payment.amount}/-` : '₹ 1,000/- + GST'}
              </strong>
            </div>
          </div>

          {/* 1. Academic & Professional Info */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Award size={15} className="text-[#800018]" />
              <span>Academic &amp; Professional Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Qualification(s):</span>
                <strong className="text-gray-800">
                  {Array.isArray(member.qualifications) && member.qualifications.length > 0
                    ? member.qualifications.join(', ')
                    : member.course || 'Bachelor of Architecture'}
                </strong>
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Specialisation:</span>
                <span className="text-gray-800 font-semibold">
                  {member.specialisation || 'General Architecture'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Organization / Firm:</span>
                <span className="text-gray-800 font-semibold">
                  {member.organization || 'Independent Practice'}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Designation:</span>
                <span className="text-gray-800 font-semibold">
                  {member.designation || 'Architect'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Mail size={15} className="text-[#800018]" />
              <span>Contact Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Email Address:</span>
                <a
                  href={`mailto:${member.email}`}
                  className="text-[#800018] font-bold hover:underline"
                >
                  {member.email || 'No email provided'}
                </a>
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Primary Mobile / Phone:</span>
                <a
                  href={`tel:${member.mobile}`}
                  className="text-gray-800 font-bold hover:underline"
                >
                  {member.mobile || 'No mobile provided'}
                </a>
              </div>
            </div>
          </div>

          {/* 3. Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Office Address */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-1.5">
                <Building2 size={14} className="text-[#800018]" />
                <span>Office Address</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {office.street ? `${office.street}, ` : ''}
                {office.city ? `${office.city}, ` : ''}
                {office.country || 'India'}
                {office.phone ? ` • Ph: ${office.phone}` : ''}
              </p>
              {!office.street && !office.city && (
                <p className="text-xs text-gray-400 italic">No office address recorded</p>
              )}
            </div>

            {/* Residence Address */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-1.5">
                <MapPin size={14} className="text-[#800018]" />
                <span>Residence Address</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {residence.street ? `${residence.street}, ` : ''}
                {residence.city ? `${residence.city}, ` : ''}
                {residence.country || 'India'}
                {residence.phone ? ` • Ph: ${residence.phone}` : ''}
              </p>
              {!residence.street && !residence.city && (
                <p className="text-xs text-gray-400 italic">No residence address recorded</p>
              )}
            </div>
          </div>

          {/* 4. Registration Documents & Proofs (Profile Photo & Payment Screenshot) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Camera size={15} className="text-[#800018]" />
              <span>Registration Documents &amp; Verification Proofs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Profile Photo Card */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 flex items-center gap-3.5">
                <div
                  onClick={() =>
                    member.photo &&
                    setFullscreenImage({
                      url: member.photo,
                      title: `${member.name} - Official Profile Photo`,
                    })
                  }
                  className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white flex items-center justify-center ${
                    member.photo ? 'cursor-pointer hover:opacity-90 shadow-2xs' : ''
                  }`}
                >
                  {member.photo ? (
                    <>
                      <img
                        src={member.photo}
                        alt="Applicant Profile Photo"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                        View Full
                      </div>
                    </>
                  ) : (
                    <User size={30} className="text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Profile Photo
                  </span>
                  <p className="text-xs font-bold text-gray-900 truncate mt-0.5">
                    {member.photo ? 'Official Photo Attached' : 'No photo uploaded'}
                  </p>
                  {member.photo ? (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFullscreenImage({
                            url: member.photo,
                            title: `${member.name} - Official Profile Photo`,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#800018] hover:underline cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Preview Full</span>
                      </button>
                      {member.photo.startsWith('http') && (
                        <a
                          href={member.photo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
                        >
                          <ExternalLink size={11} />
                          <span>URL</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic mt-1 block">
                      Not attached during signup
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Proof Card */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 flex items-center gap-3.5">
                <div
                  onClick={() =>
                    payment.paymentProof &&
                    setFullscreenImage({
                      url: payment.paymentProof,
                      title: `${member.name} - Payment Screenshot / Receipt`,
                    })
                  }
                  className={`group relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white flex items-center justify-center ${
                    payment.paymentProof ? 'cursor-pointer hover:opacity-90 shadow-2xs' : ''
                  }`}
                >
                  {payment.paymentProof ? (
                    <>
                      <img
                        src={payment.paymentProof}
                        alt="Payment Proof"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                        View Full
                      </div>
                    </>
                  ) : (
                    <CreditCard size={30} className="text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Payment Screenshot / Receipt
                  </span>
                  <p className="text-xs font-bold text-gray-900 truncate mt-0.5">
                    {payment.paymentProofName || (payment.paymentProof ? 'Receipt Attached' : 'No receipt attached')}
                  </p>
                  {payment.paymentProof ? (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFullscreenImage({
                            url: payment.paymentProof,
                            title: `${member.name} - Payment Screenshot / Receipt`,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#800018] hover:underline cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Preview Full</span>
                      </button>
                      {payment.paymentProof.startsWith('http') && (
                        <a
                          href={payment.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
                        >
                          <ExternalLink size={11} />
                          <span>URL</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-red-600 font-medium mt-1 block">
                      Awaiting payment proof
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Payment Details & Record */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <CreditCard size={15} className="text-[#800018]" />
                <span>Payment &amp; Contribution Record</span>
              </div>
              <span className="text-xs font-extrabold text-[#800018] bg-red-50 px-2.5 py-0.5 rounded-full">
                Mode: {payment.mode || 'Online'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">
                  {payment.mode === 'Cheque' ? 'Cheque No:' : 'UTR / Transaction Ref:'}
                </span>
                <strong className="text-gray-900 font-mono">
                  {payment.chequeNo || payment.transactionRef || 'N/A'}
                </strong>
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Bank / Branch:</span>
                <strong className="text-gray-800">
                  {payment.drawnOnBank || 'Central Bank of India / Online UPI'}
                </strong>
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Payment Date:</span>
                <strong className="text-gray-800">
                  {payment.chequeDate || new Date(member.createdAt || Date.now()).toLocaleDateString('en-IN')}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-[#faf9f6] px-6 py-4">
          <div className="text-[11px] text-gray-400">
            Registered on: {new Date(member.createdAt || Date.now()).toLocaleString('en-IN')}
          </div>

          <div className="flex items-center gap-2">
            {member.status !== 'Paid' && member.status !== 'Verified' && member.status !== 'Active' && onApprove && (
              <button
                type="button"
                onClick={() => onApprove(member)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>Verify &amp; Mark as Paid</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose()
                if (onEdit) onEdit(member)
              }}
              className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit Record</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] max-w-3xl overflow-hidden rounded-2xl bg-white p-3 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2 px-1">
              <span className="text-xs font-bold text-gray-800 truncate">
                {fullscreenImage.title}
              </span>
              <div className="flex items-center gap-2">
                {fullscreenImage.url.startsWith('http') && (
                  <a
                    href={fullscreenImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                    title="Open original in new tab"
                  >
                    <ExternalLink size={13} />
                    <span>Open Original</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setFullscreenImage(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-gray-950/5 rounded-xl overflow-hidden max-h-[80vh]">
              <img
                src={fullscreenImage.url}
                alt={fullscreenImage.title}
                className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberDetailModal
