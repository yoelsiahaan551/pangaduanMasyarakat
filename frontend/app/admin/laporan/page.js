// ===============================================
// FILE: app/admin/pengaduan/page.js
// ===============================================

"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaBell, FaShieldAlt, FaSignOutAlt, FaSearch, FaFilter,
  FaChevronRight, FaRoad, FaLightbulb, FaLeaf, FaWater,
  FaTrash, FaBuilding, FaSort, FaSortUp, FaSortDown,
  FaDownload, FaTimes,
} from "react-icons/fa"

// ── Shared data maps ──────────────────────────────────────────────────────

export const CATEGORY_MAP = {
  jalan:      { label: "Jalan & Infrastruktur", icon: <FaRoad />,      color: "#f59e0b" },
  lampu:      { label: "Penerangan Jalan",       icon: <FaLightbulb />, color: "#3b82f6" },
  lingkungan: { label: "Lingkungan & Taman",     icon: <FaLeaf />,      color: "#10b981" },
  air:        { label: "Drainase & Air",          icon: <FaWater />,     color: "#06b6d4" },
  sampah:     { label: "Kebersihan & Sampah",    icon: <FaTrash />,     color: "#8b5cf6" },
  fasilitas:  { label: "Fasilitas Umum",         icon: <FaBuilding />,  color: "#ef4444" },
}

export const STATUS_MAP = {
  pending:  { label: "Pending",  pill: "bg-slate-100 text-slate-600",   dot: "bg-slate-400" },
  diproses: { label: "Diproses", pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  selesai:  { label: "Selesai",  pill: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  ditolak:  { label: "Ditolak",  pill: "bg-red-100 text-red-600",       dot: "bg-red-400" },
}

export const PRIORITY_MAP = {
  rendah: { label: "Rendah", color: "bg-green-100 text-green-700" },
  sedang: { label: "Sedang", color: "bg-yellow-100 text-yellow-700" },
  tinggi: { label: "Tinggi", color: "bg-red-100 text-red-700" },
}

// ── Mock data (replace with API) ─────────────────────────────────────────

const ALL_REPORTS = [
  { id: "ADU-7F2K1A", title: "Jalan berlubang di depan SDN 01 Cipete",         category: "jalan",      status: "diproses", priority: "tinggi", date: "20 Mei 2026", pelapor: "Budi Santoso",  lokasi: "Jl. Cipete Raya No.12, RT 03/05" },
  { id: "ADU-3B9M2C", title: "Lampu jalan mati di Jl. Sudirman blok C",        category: "lampu",      status: "selesai",  priority: "sedang", date: "17 Mei 2026", pelapor: "Sari Dewi",     lokasi: "Jl. Sudirman Blok C" },
  { id: "ADU-1X4P8D", title: "Tumpukan sampah tidak diangkut selama 3 hari",   category: "sampah",     status: "pending",  priority: "tinggi", date: "12 Mei 2026", pelapor: "Ahmad Fauzi",   lokasi: "Gang Mawar RT 04/07" },
  { id: "ADU-9C3L5E", title: "Saluran air tersumbat menyebabkan banjir RT 04", category: "air",        status: "diproses", priority: "sedang", date: "11 Mei 2026", pelapor: "Rina Wati",     lokasi: "RT 04/03 Kelurahan Kebayoran" },
  { id: "ADU-2M7N6F", title: "Taman RW 07 tidak terawat dan penuh rumput",     category: "lingkungan", status: "pending",  priority: "rendah", date: "10 Mei 2026", pelapor: "Hendra Kurnia", lokasi: "Taman RW 07 Cipete Selatan" },
  { id: "ADU-5P1Q9G", title: "Fasilitas lapangan olahraga rusak parah",        category: "fasilitas",  status: "ditolak",  priority: "sedang", date: "8 Mei 2026",  pelapor: "Dewi Rahayu",   lokasi: "Lapangan RT 02/04" },
  { id: "ADU-8R4S3H", title: "Jalan retak sepanjang 50 meter Jl. Melati",      category: "jalan",      status: "pending",  priority: "tinggi", date: "7 Mei 2026",  pelapor: "Joko Susilo",   lokasi: "Jl. Melati Raya No. 45" },
  { id: "ADU-4T2U7I", title: "Lampu taman padam total sejak seminggu lalu",    category: "lampu",      status: "selesai",  priority: "rendah", date: "5 Mei 2026",  pelapor: "Maya Sari",     lokasi: "Taman Kota Blok B" },
  { id: "ADU-6V0W1J", title: "Drainase meluap saat hujan deras",               category: "air",        status: "diproses", priority: "tinggi", date: "4 Mei 2026",  pelapor: "Rudi Hartono",  lokasi: "Jl. Raya Antam RT 06" },
  { id: "ADU-3K8X5L", title: "Tempat sampah rusak dan tidak diganti",          category: "sampah",     status: "selesai",  priority: "rendah", date: "2 Mei 2026",  pelapor: "Lilis Suryani", lokasi: "Pasar Cipete Blok D" },
]

// ── Admin Navbar ──────────────────────────────────────────────────────────

export function AdminNavbar({ admin, onLogout, activeLink }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center">
            <FaShieldAlt className="text-white text-base" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-xs text-slate-400">PengaduanKu — Manajemen Pengaduan</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Dashboard",  href: "/admin/beranda" },
            { label: "Pengaduan",  href: "/admin/pengaduan" },
            { label: "Pengguna",   href: "/admin/pengguna" },
            { label: "Laporan",    href: "/admin/laporan" },
          ].map(link => (
            <Link key={link.href} href={link.href}>
              <span className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeLink === link.href
                  ? "bg-black text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <FaBell className="text-sm" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-semibold text-sm">
              {admin?.nama ? admin.nama.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{admin?.nama || "Admin"}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 w-8 h-8 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-slate-500 transition"
            >
              <FaSignOutAlt className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function AdminPengaduanPage() {
  const router  = useRouter()
  const [admin,         setAdmin]         = useState(null)
  const [mounted,       setMounted]       = useState(false)
  const [search,        setSearch]        = useState("")
  const [filterStatus,  setFilterStatus]  = useState("all")
  const [filterCat,     setFilterCat]     = useState("all")
  const [filterPrio,    setFilterPrio]    = useState("all")
  const [sortField,     setSortField]     = useState("date")
  const [sortDir,       setSortDir]       = useState("desc")
  const [showFilter,    setShowFilter]    = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("adminToken")
    if (!token) { router.push("/admin/login"); return }
    setAdmin(JSON.parse(localStorage.getItem("admin") || "null"))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("admin")
    router.push("/admin/login")
  }

  // Filter + Search
  const filtered = useMemo(() => {
    let result = [...ALL_REPORTS]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.pelapor.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== "all") result = result.filter(r => r.status === filterStatus)
    if (filterCat !== "all")    result = result.filter(r => r.category === filterCat)
    if (filterPrio !== "all")   result = result.filter(r => r.priority === filterPrio)

    return result
  }, [search, filterStatus, filterCat, filterPrio])

  const activeFilters = [filterStatus, filterCat, filterPrio].filter(f => f !== "all").length

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <AdminNavbar admin={admin} onLogout={handleLogout} activeLink="/admin/pengaduan" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-6">

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">Manajemen</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Semua Pengaduan
              <span className="ml-3 text-lg font-medium text-slate-400">({filtered.length})</span>
            </h2>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
            <FaDownload className="text-xs" />
            Export CSV
          </button>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="bg-white border border-slate-200 rounded-[28px] p-4 flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari pengaduan, ID, atau nama pelapor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-black transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition ${
                showFilter || activeFilters > 0
                  ? "bg-black text-white border-black"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FaFilter className="text-xs" />
              Filter
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-bold">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="bg-white border border-slate-200 rounded-[24px] p-5 mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {/* Status */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", "pending", "diproses", "selesai", "ditolak"].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          filterStatus === s
                            ? "bg-black text-white border-black"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {s === "all" ? "Semua" : STATUS_MAP[s]?.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Kategori</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", ...Object.keys(CATEGORY_MAP)].map(c => (
                      <button
                        key={c}
                        onClick={() => setFilterCat(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          filterCat === c
                            ? "bg-black text-white border-black"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {c === "all" ? "Semua" : CATEGORY_MAP[c]?.label.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prioritas */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Prioritas</p>
                  <div className="flex flex-wrap gap-2">
                    {["all", "rendah", "sedang", "tinggi"].map(p => (
                      <button
                        key={p}
                        onClick={() => setFilterPrio(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          filterPrio === p
                            ? "bg-black text-white border-black"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        {p === "all" ? "Semua" : PRIORITY_MAP[p]?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden">

            {/* Table Header */}
            <div className="px-6 py-4 border-b border-slate-100 grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <div className="col-span-5">Pengaduan</div>
              <div className="col-span-2 hidden md:block">Kategori</div>
              <div className="col-span-2 hidden lg:block">Pelapor</div>
              <div className="col-span-1 hidden lg:block">Prioritas</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-slate-400 text-sm">Tidak ada pengaduan yang cocok dengan filter</p>
                  <button
                    onClick={() => { setSearch(""); setFilterStatus("all"); setFilterCat("all"); setFilterPrio("all") }}
                    className="mt-3 text-xs text-black font-semibold underline underline-offset-2"
                  >
                    Reset filter
                  </button>
                </div>
              ) : (
                filtered.map((item, i) => {
                  const cat      = CATEGORY_MAP[item.category]
                  const status   = STATUS_MAP[item.status]
                  const priority = PRIORITY_MAP[item.priority]

                  return (
                    <Link key={i} href={`/admin/pengaduan/${item.id}`}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition cursor-pointer group"
                      >
                        {/* Title + ID */}
                        <div className="col-span-5 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-black">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                            <span className="font-mono">{item.id}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="col-span-2 hidden md:flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          >
                            {cat.icon}
                          </div>
                          <span className="text-xs text-slate-600 truncate">{cat.label.split(" ")[0]}</span>
                        </div>

                        {/* Pelapor */}
                        <div className="col-span-2 hidden lg:block">
                          <p className="text-sm text-slate-600 truncate">{item.pelapor}</p>
                        </div>

                        {/* Priority */}
                        <div className="col-span-1 hidden lg:block">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.pill}`}>
                              {status.label}
                            </span>
                          </div>
                          <FaChevronRight className="text-slate-300 text-xs group-hover:text-slate-500 transition" />
                        </div>
                      </motion.div>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Menampilkan <span className="font-semibold text-slate-600">{filtered.length}</span> dari{" "}
                <span className="font-semibold text-slate-600">{ALL_REPORTS.length}</span> pengaduan
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}