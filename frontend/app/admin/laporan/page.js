"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
} from "react-icons/fa"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const STATUS_CONFIG = {
  "Menunggu": { color: "bg-yellow-100 text-yellow-700", icon: <FaClock /> },
  "Diproses": { color: "bg-blue-100 text-blue-700", icon: <FaSpinner /> },
  "Selesai": { color: "bg-green-100 text-green-700", icon: <FaCheckCircle /> },
  "Ditolak": { color: "bg-red-100 text-red-700", icon: <FaTimesCircle /> },
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#06b6d4', '#8b5cf6', '#ef4444']

export default function AdminDashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  })
  const [chartData, setChartData] = useState([])
  const [categoryStats, setCategoryStats] = useState([])

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (response.ok && data.success) {
        const reportsData = data.reports || []
        setReports(reportsData)
        updateStats(reportsData)
        prepareChartData(reportsData)
        prepareCategoryStats(reportsData)
      }
    } catch (error) {
      console.error("Error:", error)
      // Data dummy untuk testing
      const dummyReports = [
        {
          id: 1,
          report_number: "ADU-001",
          title: "Jalan Berlubang",
          category: "jalan",
          status: "Menunggu",
          user: { nama: "Budi" },
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          report_number: "ADU-002", 
          title: "Lampu Jalan Mati",
          category: "lampu",
          status: "Diproses",
          user: { nama: "Ani" },
          created_at: new Date().toISOString()
        }
      ]
      setReports(dummyReports)
      updateStats(dummyReports)
      prepareChartData(dummyReports)
      prepareCategoryStats(dummyReports)
    } finally {
      setLoading(false)
    }
  }

  const updateStats = (reportsData) => {
    setStats({
      total: reportsData.length,
      menunggu: reportsData.filter(r => r.status === "Menunggu").length,
      diproses: reportsData.filter(r => r.status === "Diproses").length,
      selesai: reportsData.filter(r => r.status === "Selesai").length,
      ditolak: reportsData.filter(r => r.status === "Ditolak").length,
    })
  }

  const prepareChartData = (reportsData) => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = reportsData.filter(r => r.created_at?.split('T')[0] === dateStr).length
      last7Days.push({ date: dateStr, count })
    }
    setChartData(last7Days)
  }

  const prepareCategoryStats = (reportsData) => {
    const categories = {}
    reportsData.forEach(report => {
      const cat = report.category || "lainnya"
      categories[cat] = (categories[cat] || 0) + 1
    })
    setCategoryStats(Object.entries(categories).map(([name, value]) => ({ name, value })))
  }

  const recentReports = reports.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="animate-spin text-4xl text-black" />
      </div>
    )
  }

  // Stat Cards configuration with fixed colors
  const statCards = [
    { label: "Total Pengaduan", value: stats.total, icon: <FaClipboardList />, bgColor: "bg-slate-100", textColor: "text-slate-700", iconBg: "bg-slate-200" },
    { label: "Menunggu", value: stats.menunggu, icon: <FaClock />, bgColor: "bg-yellow-100", textColor: "text-yellow-700", iconBg: "bg-yellow-200" },
    { label: "Diproses", value: stats.diproses, icon: <FaSpinner />, bgColor: "bg-blue-100", textColor: "text-blue-700", iconBg: "bg-blue-200" },
    { label: "Selesai", value: stats.selesai, icon: <FaCheckCircle />, bgColor: "bg-green-100", textColor: "text-green-700", iconBg: "bg-green-200" },
    { label: "Ditolak", value: stats.ditolak, icon: <FaTimesCircle />, bgColor: "bg-red-100", textColor: "text-red-700", iconBg: "bg-red-200" },
  ]

    return (
    <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <motion.div variants={fadeUp} initial="initial" animate="animate">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Selamat datang di panel administrator</p>
        </motion.div>

        {/* Stats Cards - Fixed Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tren Pengaduan (7 Hari)</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#000000" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Kategori</h3>
            <div className="w-full h-[250px]">
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Belum ada data kategori
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Reports */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Pengaduan Terbaru</h3>
            <Link href="/admin/laporan" className="text-sm text-black hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentReports.length > 0 ? (
              recentReports.map((report) => {
                const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG["Menunggu"]
                return (
                  <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{report.title}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {report.user?.nama} • {report.created_at ? new Date(report.created_at).toLocaleDateString("id-ID") : "-"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.color} flex items-center gap-1`}>
                        {statusConfig.icon}
                        <span>{report.status || "Menunggu"}</span>
                      </span>
                      <Link
                        href={`/admin/detail/${report.id}`}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-black hover:text-white transition"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center text-slate-400">
                Belum ada pengaduan
              </div>
            )}
        </div>
      </motion.div>
    </div>
  )
} 