"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaSearch, FaFilter, FaChevronRight, FaChevronDown,
  FaRoad, FaLightbulb, FaLeaf, FaWater, FaTrash, FaBuilding,
} from "react-icons/fa"
import { AdminSidebar } from "../dashboard/page"

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const ALL_PENGADUAN = [
  { _id: "1",  judul: "Jalan berlubang di depan SD Negeri 5",         kodeAduan: "ADU-7F2K1A", lokasi: "Jl. Sudirman No.12, Jakarta Pusat",      createdAt: "2026-06-07", status: "Diproses", kategori: "jalan",      prioritas: "tinggi",  pelapor: "Budi Santoso",  petugas: "Dinas PU Jakarta Pusat" },
  { _id: "2",  judul: "Lampu jalan mati sudah 2 minggu",              kodeAduan: "ADU-3B9M2C", lokasi: "Jl. Gatot Subroto, Jakarta Selatan",     createdAt: "2026-05-17", status: "Selesai",  kategori: "lampu",      prioritas: "sedang", pelapor: "Siti Rahayu",   petugas: "Dinas Penerangan DKI" },
  { _id: "3",  judul: "Sampah menumpuk di TPS liar",                  kodeAduan: "ADU-K1P8QX", lokasi: "Gang Mawar No.3, Tanah Abang",           createdAt: "2026-06-06", status: "Pending",  kategori: "sampah",     prioritas: "sedang", pelapor: "Ahmad Fauzi",   petugas: "-" },
  { _id: "4",  judul: "Drainase tersumbat menyebabkan banjir",        kodeAduan: "ADU-9K3R5E", lokasi: "Jl. MH Thamrin, Jakarta Pusat",          createdAt: "2026-05-05", status: "Selesai",  kategori: "air",        prioritas: "tinggi",  pelapor: "Maya Putri",    petugas: "Dinas SDA DKI" },
  { _id: "5",  judul: "Taman kota rusak dan tidak terawat",           kodeAduan: "ADU-2M7T6F", lokasi: "Taman Suropati, Jakarta Pusat",          createdAt: "2026-04-28", status: "Diproses", kategori: "lingkungan", prioritas: "rendah",  pelapor: "Rizal Hakim",   petugas: "Dinas Pertamanan DKI" },
  { _id: "6",  judul: "Fasilitas toilet umum rusak di stasiun",       kodeAduan: "ADU-H4R2NM", lokasi: "Stasiun Gambir, Jakarta Pusat",          createdAt: "2026-06-04", status: "Pending",  kategori: "fasilitas",  prioritas: "sedang", pelapor: "Deni Kurniawan", petugas: "-" },
  { _id: "7",  judul: "Pohon tumbang menghalangi jalan",              kodeAduan: "ADU-T9W1LK", lokasi: "Jl. Thamrin, Jakarta Pusat",             createdAt: "2026-06-05", status: "Selesai",  kategori: "lingkungan", prioritas: "tinggi",  pelapor: "Rina Lestari",   petugas: "Dinas Pertamanan DKI" },
  { _id: "8",  judul: "Penerangan taman padam total",                 kodeAduan: "ADU-M6Q3BC", lokasi: "Taman Menteng, Jakarta Pusat",           createdAt: "2026-06-03", status: "Diproses", kategori: "lampu",      prioritas: "sedang", pelapor: "Yudi Prasetyo",  petugas: "Dinas Penerangan DKI" },
]

const ICON_MAP = { jalan: FaRoad, lampu: FaLightbulb, lingkungan: FaLeaf, air: FaWater, sampah: FaTrash, fasilitas: FaBuilding }
const COLOR_MAP = { jalan: "text-amber-600 bg-amber-50", lampu: "text-blue-600 bg-blue-50", lingkungan: "text-green-600 bg-green-50", air: "text-cyan-600 bg-cyan-50", sampah: "text-purple-600 bg-purple-50", fasilitas: "text-red-600 bg-red-50" }

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

const stagger = { animate: { transition: { staggerChildren: 0.05 } } }
const fadeUp  = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

export default function AdminPengaduanPage() {
  const [search,  setSearch]  = useState("")
  const [status,  setStatus]  = useState("Semua")
  const [prioritas, setPrioritas] = useState("Semua")

  const filtered = ALL_PENGADUAN.filter((p) => {
    const matchSearch = p.judul.toLowerCase().includes(search.toLowerCase()) ||
                        p.kodeAduan.toLowerCase().includes(search.toLowerCase()) ||
                        p.pelapor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === "Semua" || p.status === status
    const matchPrioritas = prioritas === "Semua" || p.prioritas === prioritas
    return matchSearch && matchStatus && matchPrioritas
  })

  const counts = {
    Semua: ALL_PENGADUAN.length,
    Pending: ALL_PENGADUAN.filter(p => p.status === "Pending").length,
    Diproses: ALL_PENGADUAN.filter(p => p.status === "Diproses").length,
    Selesai: ALL_PENGADUAN.filter(p => p.status === "Selesai").length,
  }

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <AdminSidebar active="Kelola Pengaduan" />

      <div className="flex-1">

        {/* TOPBAR */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-900">Kelola Pengaduan</h1>
            <p className="text-xs text-slate-400">{filtered.length} pengaduan ditemukan</p>
          </div>
        </header>

        <div className="px-8 py-6 space-y-5">

          {/* FILTER TABS */}
          <div className="flex items-center gap-2">
            {["Semua", "Pending", "Diproses", "Selesai"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  status === s
                    ? "bg-black text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {s}
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${status === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {counts[s] ?? ALL_PENGADUAN.filter(p => p.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari kode, judul, atau nama pelapor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={prioritas}
                onChange={(e) => setPrioritas(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-slate-400 transition-all cursor-pointer"
              >
                <option value="Semua">Semua Prioritas</option>
                <option value="tinggi">Tinggi</option>
                <option value="sedang">Sedang</option>
                <option value="rendah">Rendah</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
            </div>
          </div>

          {/* TABLE */}
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Kode</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Pengaduan</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Kategori</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Prioritas</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Tanggal</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                        Tidak ada pengaduan yang cocok
                      </td>
                    </tr>
                  )}
                  {filtered.map((item) => {
                    const Icon = ICON_MAP[item.kategori]
                    const st   = STATUS_MAP[item.status]
                    return (
                      <tr key={item._id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">{item.kodeAduan}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800 truncate max-w-[200px]">{item.judul}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.pelapor} • {item.lokasi}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ${COLOR_MAP[item.kategori]}`}>
                            <Icon className="text-xs" />
                            <span className="capitalize">{item.kategori}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PRIORITAS_MAP[item.prioritas]}`}>
                            {item.prioritas}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.pill}`}>{item.status}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{item.createdAt}</td>
                        <td className="px-5 py-4">
                          <Link href={`/admin/pengaduan/${item._id}`}>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition">
                              Detail <FaChevronRight className="text-[10px]" />
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