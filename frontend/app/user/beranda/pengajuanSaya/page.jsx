"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaArrowLeft, FaSearch, FaChevronRight, FaFileAlt,
  FaPlus, FaRoad, FaLightbulb, FaLeaf, FaWater, FaTree,
} from "react-icons/fa"

const DUMMY = [
  { _id:"1", judul:"Jalan berlubang di depan SD Negeri 5",    kategori:"Jalan & Infrastruktur",  lokasi:"Jl. Sudirman No.12, Jakarta Pusat",   status:"Diproses", createdAt:"2026-05-20T08:00:00Z", kodeAduan:"ADU-7F2K1A", icon:FaRoad      },
  { _id:"2", judul:"Lampu jalan mati sudah 2 minggu",         kategori:"Lampu Jalan",             lokasi:"Jl. Gatot Subroto, Jakarta Selatan",  status:"Selesai",  createdAt:"2026-05-17T08:00:00Z", kodeAduan:"ADU-3B9M2C", icon:FaLightbulb },
  { _id:"3", judul:"Sampah menumpuk di pinggir jalan",        kategori:"Kebersihan Lingkungan",   lokasi:"Kelurahan Menteng, Jakarta Pusat",    status:"Pending",  createdAt:"2026-05-12T08:00:00Z", kodeAduan:"ADU-1X4P8D", icon:FaLeaf      },
  { _id:"4", judul:"Drainase tersumbat menyebabkan banjir",   kategori:"Drainase & Banjir",       lokasi:"Jl. MH Thamrin, Jakarta Pusat",       status:"Selesai",  createdAt:"2026-05-05T08:00:00Z", kodeAduan:"ADU-9K3R5E", icon:FaWater     },
  { _id:"5", judul:"Taman kota rusak dan tidak terawat",      kategori:"Taman & RTH",             lokasi:"Taman Suropati, Jakarta Pusat",       status:"Pending",  createdAt:"2026-04-28T08:00:00Z", kodeAduan:"ADU-2M7T6F", icon:FaTree      },
]

const STATUS_MAP = {
  Selesai:  { pill:"bg-green-100 text-green-700",   dot:"bg-green-500"  },
  Diproses: { pill:"bg-yellow-100 text-yellow-700", dot:"bg-yellow-500" },
  Pending:  { pill:"bg-slate-100 text-slate-600",   dot:"bg-slate-400"  },
}

export default function PengajuanSayaPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("Semua")

  const filtered = DUMMY.filter((p) => {
    const q = search.toLowerCase()
    return (
      (p.judul.toLowerCase().includes(q) || p.kodeAduan.toLowerCase().includes(q)) &&
      (filter === "Semua" || p.status === filter)
    )
  })

  const counts = {
    Semua:    DUMMY.length,
    Pending:  DUMMY.filter(p => p.status === "Pending").length,
    Diproses: DUMMY.filter(p => p.status === "Diproses").length,
    Selesai:  DUMMY.filter(p => p.status === "Selesai").length,
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/user/beranda">
            <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <FaArrowLeft className="text-slate-600 text-sm" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-slate-900">Pengajuan Saya</h1>
            <p className="text-xs text-slate-400">{DUMMY.length} total pengaduan</p>
          </div>
          <Link href="/user/buatPengaduan">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-slate-800 transition">
              <FaPlus className="text-xs" /> Buat Baru
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">

        {/* SEARCH */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau kode pengajuan..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-black transition"
          />
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Semua","Pending","Diproses","Selesai"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                filter === f ? "bg-black text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f} <span className="ml-1 opacity-50 text-xs">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <FaFileAlt className="text-slate-400 text-xl" />
                </div>
                <p className="font-semibold text-slate-600 text-sm">Tidak ada pengajuan</p>
                <p className="text-xs text-slate-400">Coba ubah filter atau kata kunci</p>
              </motion.div>
            ) : filtered.map((item) => {
              const s = STATUS_MAP[item.status] ?? STATUS_MAP["Pending"]
              const Icon = item.icon
              return (
                <motion.div
                  key={item._id}
                  initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}
                  layout
                >
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition cursor-pointer group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 group-hover:bg-slate-200 transition">
                      <Icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-sm truncate">{item.judul}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span className="font-mono">{item.kodeAduan}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{item.lokasi}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.pill}`}>{item.status}</span>
                      </div>
                      <FaChevronRight className="text-slate-300 text-xs" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}