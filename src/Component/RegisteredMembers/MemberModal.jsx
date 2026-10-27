import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'

const MemberModal = ({ isOpen, onClose, onSave, editingMember }) => {
  const [formData, setFormData] = useState({
    name: '',
    membershipNo: '',
    year: '2024',
    cohort: 'all',
    course: 'Bachelor of Architecture',
    email: '',
    mobile: '',
    status: 'Verified',
  })

  useEffect(() => {
    if (editingMember) {
      const initialStatus =
        editingMember.status === 'Paid' || editingMember.status === 'Verified' || editingMember.status === 'Active'
          ? 'Paid'
          : 'Pending'

      setFormData({
        name: editingMember.name || '',
        membershipNo: editingMember.membershipNo || '',
        year: editingMember.year || '2024',
        cohort: editingMember.cohort || 'all',
        course: editingMember.course || 'Bachelor of Architecture',
        email: editingMember.email || '',
        mobile: editingMember.mobile || '',
        status: initialStatus,
      })
    } else {
      const randomSeq = Math.floor(100 + Math.random() * 900)
      setFormData({
        name: '',
        membershipNo: `GCA2026${randomSeq}`,
        year: '2026',
        cohort: 'all',
        course: 'Bachelor of Architecture',
        email: '',
        mobile: '',
        status: 'Paid',
      })
    }
  }, [editingMember, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              {editingMember ? 'Edit Registered Member' : 'Register New Member'}
            </h3>
            <p className="text-xs text-gray-500">
              Update member identification, academic record &amp; payment status
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Member Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Ar. Pradeep Sharma"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Membership No *
              </label>
              <input
                type="text"
                required
                value={formData.membershipNo}
                onChange={(e) =>
                  setFormData({ ...formData, membershipNo: e.target.value.toUpperCase() })
                }
                placeholder="e.g. U15288"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018] font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                placeholder="e.g. 1999"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Course / Program
              </label>
              <input
                type="text"
                list="course-suggestions"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                placeholder="e.g. Diploma in Arch. or B.Arch"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
              <datalist id="course-suggestions">
                <option value="Diploma in Arch." />
                <option value="Bachelor of Architecture" />
                <option value="Master of Architecture" />
                <option value="Master of Urban Planning" />
                <option value="Master in Environmental Design" />
                <option value="Master in Interior Design" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="alumni@domain.com"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Membership Status
            </label>
            <div className="flex items-center gap-6">
              {['Paid', 'Pending'].map((st) => (
                <label key={st} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={st}
                    checked={formData.status === st}
                    onChange={() => setFormData({ ...formData, status: st })}
                    className="accent-[#800018] h-4 w-4 cursor-pointer"
                  />
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      st === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                    }`}
                  >
                    {st}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] cursor-pointer"
            >
              <Check size={16} />
              {editingMember ? 'Update Record' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MemberModal
