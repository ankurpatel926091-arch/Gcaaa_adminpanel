import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import DashboardStats from '../Component/Dashboard/DashboardStats'
import QuickActionsBar from '../Component/Dashboard/QuickActionsBar'
import RecentAlumniTable from '../Component/Dashboard/RecentAlumniTable'
import RecentNominationsCard from '../Component/Dashboard/RecentNominationsCard'
import RecentBlogsCard from '../Component/Dashboard/RecentBlogsCard'
import BatchDistributionChart from '../Component/Dashboard/BatchDistributionChart'

import { fetchMemberStats, fetchRegisteredMembers } from '../Api/registeredMemberApi'
import { fetchBatchAlumniStats } from '../Api/batchAlumniApi'
import { fetchElectionNominations } from '../Api/electionNominationAdminApi'
import { fetchAdminBlogs } from '../Api/blogAdminApi'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  // Real data state
  const [stats, setStats] = useState({
    membersTotal: 0,
    membersVerified: 0,
    batchTotal: 0,
    batchCount: 0,
    totalBatches: 0,
    nominationsTotal: 0,
    nominationsPending: 0,
    blogsTotal: 0,
    blogsPublished: 0,
    blogsReads: 0,
  })

  const [recentMembers, setRecentMembers] = useState([])
  const [recentNominations, setRecentNominations] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const [cohorts, setCohorts] = useState([])

  // Load all dashboard data in parallel
  const loadDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const [membersStatsRes, membersListRes, batchStatsRes, nominationsRes, blogsRes] =
        await Promise.allSettled([
          fetchMemberStats(),
          fetchRegisteredMembers({ limit: 6, page: 1, sortBy: 'createdAt', order: 'desc' }),
          fetchBatchAlumniStats(),
          fetchElectionNominations({}),
          fetchAdminBlogs(),
        ])

      // 1. Registered Members Stats & List
      let mTotal = 0
      let mVerified = 0
      let memberCohorts = []
      if (membersStatsRes.status === 'fulfilled' && membersStatsRes.value?.success) {
        const ms = membersStatsRes.value.stats || {}
        mTotal = ms.total || 0
        mVerified = ms.verified || 0
        memberCohorts = ms.cohorts || []
      }

      if (membersListRes.status === 'fulfilled' && membersListRes.value?.success) {
        setRecentMembers(membersListRes.value.data || [])
      }

      // 2. Batch Alumni Directory Stats
      let bTotal = 0
      let bBatches = 0
      let batchCohorts = []
      if (batchStatsRes.status === 'fulfilled' && batchStatsRes.value?.success) {
        const bs = batchStatsRes.value.stats || {}
        bTotal = bs.total || 0
        bBatches = bs.totalBatches || (bs.distinctYears ? bs.distinctYears.length : 0)
        batchCohorts = bs.cohorts || []
      }

      // 3. Election Nominations
      let nTotal = 0
      let nPending = 0
      if (nominationsRes.status === 'fulfilled' && nominationsRes.value?.success) {
        const nomList = nominationsRes.value.data || []
        nTotal = nomList.length
        nPending = nomList.filter((n) => n.status === 'Submitted' || n.status === 'Under Review').length
        setRecentNominations(nomList)
      }

      // 4. Blogs & Articles
      let blTotal = 0
      let blPublished = 0
      let blReads = 0
      if (blogsRes.status === 'fulfilled' && blogsRes.value?.success) {
        const blList = blogsRes.value.data || []
        blTotal = blList.length
        blPublished = blList.filter((b) => b.status === 'published' || b.isPublished !== false).length
        blReads = blList.reduce((acc, b) => acc + (b.views || b.readsCount || 0), 0)
        setRecentBlogs(blList)
      }

      // Set combined stats
      setStats({
        membersTotal: mTotal,
        membersVerified: mVerified,
        batchTotal: bTotal,
        batchCount: bBatches,
        totalBatches: bBatches,
        nominationsTotal: nTotal,
        nominationsPending: nPending,
        blogsTotal: blTotal,
        blogsPublished: blPublished,
        blogsReads: blReads,
      })

      // Combine cohorts: prefer batchCohorts if available, else memberCohorts
      setCohorts(batchCohorts.length > 0 ? batchCohorts : memberCohorts)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Unable to load some dashboard metrics from the database.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  return (
    <div className="space-y-6 pb-6">
      {/* Page Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
            Overview &amp; Real-time Analytics
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Association Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Government College of Architecture Alumni Association management center.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-[#800018]' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            Session Active
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => loadDashboardData(true)}
            className="font-bold underline ml-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Stats (Real Data) */}
      <DashboardStats stats={stats} loading={loading} />

      {/* Quick Action Operations */}
      <QuickActionsBar />

      {/* Main Grid: Fully balanced left and right columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentAlumniTable members={recentMembers} loading={loading} />
          <BatchDistributionChart
            cohorts={cohorts}
            totalRecords={stats.batchTotal || stats.membersTotal}
            loading={loading}
          />
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          <RecentNominationsCard nominations={recentNominations} loading={loading} />
          <RecentBlogsCard blogs={recentBlogs} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
