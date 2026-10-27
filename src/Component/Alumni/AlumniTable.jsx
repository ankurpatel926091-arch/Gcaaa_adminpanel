import React from 'react'
import {
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Building,
  MoreVertical,
} from 'lucide-react'

const AlumniTable = ({ alumniList, onEdit, onDelete, onToggleStatus }) => {
  if (alumniList.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-gray-500">
          No alumni records match your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#faf9f6] text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="py-3.5 px-4">Alumni Profile</th>
              <th className="py-3.5 px-4">Batch & Degree</th>
              <th className="py-3.5 px-4">Organization & Role</th>
              <th className="py-3.5 px-4">Contact Details</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alumniList.map((alumnus) => (
              <tr
                key={alumnus.id}
                className="transition-colors hover:bg-red-50/20"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#800018]/10 text-xs font-bold text-[#800018] ring-1 ring-[#800018]/20">
                      {alumnus.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{alumnus.name}</p>
                      <p className="text-xs text-gray-400">Reg: {alumnus.regId}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className="inline-block rounded-md bg-[#800018]/15 px-2 py-0.5 text-xs font-medium text-[#700018]">
                    {alumnus.batch}
                  </span>
                  <p className="mt-0.5 text-xs text-gray-500">{alumnus.degree}</p>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-800">
                    <Building size={14} className="text-gray-400" />
                    {alumnus.designation}
                  </div>
                  <p className="text-xs text-gray-500">{alumnus.company}</p>
                </td>

                <td className="py-4 px-4 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} className="text-gray-400" />
                    <span>{alumnus.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-gray-400" />
                    <span>{alumnus.phone}</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(alumnus.id)}
                    title="Click to toggle status"
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                      alumnus.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:bg-red-100'
                    }`}
                  >
                    {alumnus.status === 'Verified' ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <Clock size={13} />
                    )}
                    {alumnus.status}
                  </button>
                </td>

                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(alumnus)}
                      title="Edit Alumni"
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#800018]"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(alumnus.id)}
                      title="Delete Alumni"
                      className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AlumniTable
