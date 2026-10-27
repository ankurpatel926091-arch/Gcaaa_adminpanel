import React, { useState, useEffect } from 'react'
import { X, UserPlus, Check } from 'lucide-react'

const AlumniModal = ({ isOpen, onClose, onSave, editingAlumni }) => {
  const [formData, setFormData] = useState({
    name: '',
    batch: 'Batch of 2024',
    degree: 'B.Arch',
    regId: '',
    email: '',
    phone: '',
    designation: '',
    company: '',
    status: 'Verified',
  })

  useEffect(() => {
    if (editingAlumni) {
      setFormData(editingAlumni)
    } else {
      setFormData({
        name: '',
        batch: 'Batch of 2024',
        degree: 'B.Arch',
        regId: `GCA-${Math.floor(1000 + Math.random() * 9000)}`,
        email: '',
        phone: '',
        designation: '',
        company: '',
        status: 'Verified',
      })
    }
  }, [editingAlumni, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              {editingAlumni ? 'Edit Alumni Record' : 'Register New Alumni'}
            </h3>
            <p className="text-xs text-gray-500">
              Fill in student batch and professional details
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name *
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
                Registration / Roll No
              </label>
              <input
                type="text"
                value={formData.regId}
                onChange={(e) =>
                  setFormData({ ...formData, regId: e.target.value })
                }
                placeholder="GCA-2018-042"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Graduation Batch *
              </label>
              <select
                value={formData.batch}
                onChange={(e) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              >
                <option value="Batch of 2024">Batch of 2024</option>
                <option value="Batch of 2023">Batch of 2023</option>
                <option value="Batch of 2022">Batch of 2022</option>
                <option value="Batch of 2021">Batch of 2021</option>
                <option value="Batch of 2020">Batch of 2020</option>
                <option value="Batch of 2018">Batch of 2018</option>
                <option value="Batch of 2015">Batch of 2015</option>
                <option value="Batch of 2012">Batch of 2012</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Degree / Program
              </label>
              <select
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              >
                <option value="B.Arch">B.Arch</option>
                <option value="M.Arch (Urban Design)">M.Arch (Urban Design)</option>
                <option value="M.Arch (Landscape)">M.Arch (Landscape)</option>
                <option value="Ph.D Architecture">Ph.D Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
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
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                placeholder="Senior Architect"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Organization / Studio
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Studio Architecture, Delhi"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Membership Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Verified"
                  checked={formData.status === 'Verified'}
                  onChange={() => setFormData({ ...formData, status: 'Verified' })}
                  className="accent-[#800018]"
                />
                Verified
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Pending"
                  checked={formData.status === 'Pending'}
                  onChange={() => setFormData({ ...formData, status: 'Pending' })}
                  className="accent-[#800018]"
                />
                Pending Verification
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#a00020]"
            >
              <Check size={16} />
              {editingAlumni ? 'Update Record' : 'Save Alumni'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AlumniModal
