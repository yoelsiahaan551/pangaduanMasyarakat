"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaBell, FaClipboardList, FaClock, FaCheckCircle, FaUsers,
  FaRoad, FaLightbulb, FaLeaf, FaWater, FaTrash, FaBuilding,
  FaChevronRight, FaChartBar, FaExclamationTriangle,
} from "react-icons/fa"

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const STATS = [
  { label: "Total Pengaduan",    value: "1.247", delta: "+12% bulan ini",   icon: <FaClipboardList />, color: "bg-blue-50 text-blue-600",   border: "border-blue-100" },
  { label: "Sedang Diproses",    value: "87",    delta: "23 mendesak",      icon: <FaClock />,         color: "bg-yellow-50 text-yellow-600", border: "border-yellow-100" },
  { label: "Selesai Bulan Ini",  value: "340",   delta: "+8% vs bulan lalu",icon: <FaCheckCircle />,   color: "bg-green-50 text-green-600",  border: "border-green-100" },
  { label: "Total Pengguna",     value: "2.841", delta: "+34 pengguna baru",icon: <FaUsers />,         color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
]

const RECENT = [
  { _id: "1", judul: "Jalan berlubang di depan SD Negeri 5", kodeAduan: "ADU-7F2K1A", lokasi: "Jl. Sudirman No.12, Jakarta Pusat", createdAt: "2026-06-07T08:00:00Z", status: "Diproses", kategori: "jalan",   prioritas: "tinggi",  pelapor: "Budi Santoso" },
  { _id: "2", judul: "Lampu jalan mati sudah 2 minggu",      kodeAduan: "ADU-3B9M2C", lokasi: "Jl. Gatot Subroto, Jakarta Selatan", createdAt: "2026-06-06T08:00:00Z", status: "Selesai",  kategori: "lampu",   prioritas: "sedang", pelapor: "Siti Rahayu" },
  { _id: "3", judul: "Sampah menumpuk di TPS liar",          kodeAduan: "ADU-K1P8QX", lokasi: "Gang Mawar No.3, Tanah Abang",      createdAt: "2026-06-06T10:00:00Z", status: "Pending",  kategori: "sampah",  prioritas: "sedang", pelapor: "Ahmad Fauzi" },
  { _id: "4", judul: "Drainase tersumbat menyebabkan banjir",kodeAduan: "ADU-9K3R5E", lokasi: "Jl. MH Thamrin, Jakarta Pusat",     createdAt: "2026-06-05T08:00:00Z", status: "Selesai",  kategori: "air",     prioritas: "tinggi",  pelapor: "Maya Putri" },
  { _id: "5", judul: "Taman kota rusak dan tidak terawat",   kodeAduan: "ADU-2M7T6F", lokasi: "Taman Suropati, Jakarta Pusat",     createdAt: "2026-06-05T12:00:00Z", status: "Diproses", kategori: "lingkungan", prioritas: "rendah", pelapor: "Rizal Hakim" },
]

const KATEGORI_STATS = [
  { id: "jalan",      label: "Jalan",       icon: <FaRoad />,      count: 312, color: "text-amber-600 bg-amber-50" },
  { id: "lampu",      label: "Lampu",       icon: <FaLightbulb />, count: 187, color: "text-blue-600 bg-blue-50" },
  { id: "lingkungan", label: "Lingkungan",  icon: <FaLeaf />,      count: 224, color: "text-green-600 bg-green-50" },
  { id: "air",        label: "Drainase",    icon: <FaWater />,     count: 198, color: "text-cyan-600 bg-cyan-50" },
  { id: "sampah",     label: "Sampah",      icon: <FaTrash />,     count: 163, color: "text-purple-600 bg-purple-50" },
  { id: "fasilitas",  label: "Fasilitas",   icon: <FaBuilding />,  count: 163, color: "text-red-600 bg-red-50" },
]

const STATUS_MAP = {
  Selesai:  { pill: "bg-green-100 text-green-700",  dot: "bg-green-500" },
  Diproses: { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  Pending:  { pill: "bg-slate-100 text-slate-600",   dot: "bg-slate-400" },
}

const PRIORITAS_MAP = {
  tinggi: "bg-red-100 text-red-700",
  sedang: "bg-yellow-100 text-yellow-700",
  rendah: "bg-green-100 text-green-700",
}

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

// ─── Shared Sidebar ───────────────────────────────────────────────────────────

export function AdminSidebar({ active }) {
  const nav = [
    { href: "/admin/dashboard",  icon: <FaChartBar />,      label: "Dashboard" },
    { href: "/admin/pengaduan",  icon: <FaClipboardList />, label: "Kelola Pengaduan" },
    { href: "/admin/pengguna",   icon: <FaUsers />,         label: "Manajemen User" },
  ]

  return (
    <aside className="w-64 min-h-screen bg-[#111111] flex flex-col sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">PengaduanKu</h1>
            <p className="text-xs text-white/40">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === item.label
                ? "bg-white text-black"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center font-semibold text-sm">A</div>
          <div>
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-white/40">admin@pengaduanku.id</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const total = KATEGORI_STATS.reduce((s, k) => s + k.count, 0)

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <AdminSidebar active="Dashboard" />

      <div className="flex-1">

        {/* TOPBAR */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-400">Senin, 8 Juni 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">

            {/* STAT CARDS */}
            <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className={`bg-white border ${s.border} rounded-[20px] p-5`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.delta}</p>
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-3 gap-4">

              {/* PENGADUAN PER KATEGORI */}
              <motion.div variants={fadeUp} className="col-span-1 bg-white border border-slate-200 rounded-[20px] p-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Kategori</p>
                <h2 className="font-bold text-slate-800 mb-4">Sebaran Laporan</h2>
                <div className="space-y-3">
                  {KATEGORI_STATS.map((k) => (
                    <div key={k.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${k.color}`}>
                        {k.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700">{k.label}</span>
                          <span className="text-slate-400">{k.count}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-800 rounded-full"
                            style={{ width: `${(k.count / total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* PENGADUAN MENDESAK */}
              <motion.div variants={fadeUp} className="col-span-2 bg-white border border-slate-200 rounded-[20px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Perhatian</p>
                    <h2 className="font-bold text-slate-800">Pengaduan Mendesak</h2>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full font-semibold">
                    <FaExclamationTriangle className="text-xs" /> 3 perlu tindakan
                  </span>
                </div>
                <div className="space-y-3">
                  {RECENT.filter(r => r.prioritas === "tinggi").map((item) => {
                    const st = STATUS_MAP[item.status]
                    return (
                      <div key={item._id} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.judul}</p>
                          <p className="text-xs text-slate-400">{item.kodeAduan} • {item.pelapor}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.pill}`}>{item.status}</span>
                        <Link href={`/admin/pengaduan/${item._id}`}>
                          <button className="w-8 h-8 rounded-xl bg-white border border-red-100 flex items-center justify-center text-slate-500 hover:bg-red-100 transition">
                            <FaChevronRight className="text-xs" />
                          </button>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* TABEL PENGADUAN TERBARU */}
            <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Terbaru</p>
                  <h2 className="font-bold text-slate-800">Pengaduan Masuk</h2>
                </div>
                <Link href="/admin/pengaduan">
                  <button className="text-sm font-medium text-slate-500 hover:text-black flex items-center gap-1.5 transition">
                    Lihat Semua <FaChevronRight className="text-xs" />
                  </button>
                </Link>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Kode</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Judul</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Pelapor</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Prioritas</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {RECENT.map((item) => {
                    const st = STATUS_MAP[item.status]
                    return (
                      <tr key={item._id} className="hover:bg-slate-50 transition">
                        <td className="py-3 pr-4 font-mono text-xs text-slate-400">{item.kodeAduan}</td>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-slate-800 truncate max-w-[220px]">{item.judul}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[220px]">{item.lokasi}</p>
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{item.pelapor}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PRIORITAS_MAP[item.prioritas]}`}>
                            {item.prioritas}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.pill}`}>{item.status}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Link href={`/admin/pengaduan/${item._id}`}>
                            <button className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition">
                              Detail
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}