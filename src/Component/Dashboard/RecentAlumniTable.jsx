import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Clock, UserCheck, Phone, Mail } from 'lucide-react'

const getInitials = (name = '') => {
  if (!name) return 'AM'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const RecentAlumniTable = ({ members = [], loading = false }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 border-b border-gray-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Recent Registered Members
            </h3>
            <span className="rounded-full bg-red-50 text-[#800018] text-[10px] font-bold px-2 py-0.5 border border-red-200">
              Live Records
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Latest alumni registered in the official GCAAA database
          </p>
        </div>

        <Link
          to="/registered-members"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800018] hover:text-[#bd0929] transition self-start sm:self-auto"
        >
          View All Members <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Membership No.</th>
              <th className="py-3 px-4">Batch / Course</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-200" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 rounded bg-gray-200" />
                        <div className="h-2 w-16 rounded bg-gray-100" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><div className="h-3 w-16 rounded bg-gray-200" /></td>
                  <td className="py-3.5 px-4"><div className="h-3 w-20 rounded bg-gray-200" /></td>
                  <td className="py-3.5 px-4"><div className="h-3 w-24 rounded bg-gray-200" /></td>
                  <td className="py-3.5 px-4 text-center"><div className="h-5 w-16 mx-auto rounded-full bg-gray-200" /></td>
                </tr>
              ))
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  <UserCheck className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="font-medium text-xs">No registered members found in database.</p>
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const isVerified = ['Verified', 'Paid', 'Active'].includes(member.status)
                const isPending = member.status === 'Pending' || !member.status
                return (
                  <tr
                    key={member._id || member.id || member.membershipNo}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#800018] to-[#45000f] text-white font-bold text-xs shadow-xs">
                          {getInitials(member.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {member.course || 'Bachelor of Architecture'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-bold text-[#800018] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {member.membershipNo || 'N/A'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
                        {member.year ? `Batch ${member.year}` : member.cohort || 'GCA'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {member.mobile && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-600">
                            <Phone size={11} className="text-gray-400 shrink-0" />
                            <span>{member.mobile}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 truncate max-w-[150px]">
                            <Mail size={11} className="shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isPending
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {isVerified ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {member.status || 'Registered'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentAlumniTable
