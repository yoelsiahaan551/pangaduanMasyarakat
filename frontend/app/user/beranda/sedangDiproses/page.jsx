"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FaArrowLeft, FaRoad, FaTree, FaClock, FaSpinner, FaFileAlt } from "react-icons/fa"

const DUMMY = [
  {
    _id: "1",
    judul: "Jalan berlubang di depan SD Negeri 5",
    kodeAduan: "ADU-7F2K1A",
    lokasi: "Jl. Sudirman No.12, Jakarta Pusat",
    createdAt: "2026-05-20T08:00:00Z",
    icon: FaRoad,
    stepAktif: 2,
    petugas: "Dinas PU Jakarta Pusat",
    estimasi: "3-5 hari kerja",
    catatan: "Tim lapangan sudah diterjunkan untuk survei lokasi.",
  },
  {
    _id: "5",
    judul: "Taman kota rusak dan tidak terawat",
    kodeAduan: "ADU-2M7T6F",
    lokasi: "Taman Suropati, Jakarta Pusat",
    createdAt: "2026-04-28T08:00:00Z",
    icon: FaTree,
    stepAktif: 1,
    petugas: "Dinas Pertamanan DKI",
    estimasi: "5-7 hari kerja",
    catatan: "Laporan diterima dan sedang dijadwalkan untuk peninjauan.",
  },
]

const STEPS = ["Diterima", "Ditinjau", "Dikerjakan", "Selesai"]

const stagger = { animate: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

export default function SedangDiprosesPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/user/beranda">
            <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <FaArrowLeft className="text-slate-600 text-sm" />
            </button>
          </Link>
          <div>
            <h1 className="font-bold text-slate-900">Sedang Diproses</h1>
            <p className="text-xs text-slate-400">{DUMMY.length} pengajuan aktif</p>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">

        {/* BANNER */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <FaSpinner className="text-yellow-500 animate-spin flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            Pengajuan Anda sedang ditangani. Notifikasi akan dikirim saat ada pembaruan.
          </p>
        </div>

        {/* EMPTY STATE */}
        {DUMMY.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FaFileAlt className="text-slate-400 text-xl" />
            </div>
            <p className="font-semibold text-slate-600 text-sm">Tidak ada pengajuan yang diproses</p>
            <p className="text-xs text-slate-400">Pengajuan aktif akan muncul di sini</p>
          </div>
        )}

        {/* LIST */}
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
          {DUMMY.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item._id} variants={fadeUp}>
                <div className="bg-white border border-slate-200 rounded-[24px] p-5">

                  {/* HEADER CARD */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-600 flex-shrink-0">
                      <Icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 leading-snug">{item.judul}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="font-mono">{item.kodeAduan}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Diproses
                    </span>
                  </div>

                  {/* STEPPER */}
                  <div className="relative mb-6 px-1">
                    {/* GARIS */}
                    <div className="absolute top-3.5 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-0.5 bg-slate-200">
                      <div
                        className="h-full bg-black rounded-full transition-all duration-700"
                        style={{ width: `${(item.stepAktif / (STEPS.length - 1)) * 100}%` }}
                      />
                    </div>

                    {/* TITIK + LABEL */}
                    <div className="relative flex justify-between">
                      {STEPS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-1/4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 transition ${
                            i < item.stepAktif
                              ? "bg-black border-black text-white"
                              : i === item.stepAktif
                              ? "bg-black border-black text-white ring-4 ring-black/10"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}>
                            {i < item.stepAktif ? "✓" : i + 1}
                          </div>
                          <span className={`text-[10px] text-center font-medium leading-tight ${
                            i <= item.stepAktif ? "text-slate-800" : "text-slate-400"
                          }`}>
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CATATAN PETUGAS */}
                  <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-yellow-700 mb-1">Catatan Petugas</p>
                    <p className="text-sm text-slate-700">{item.catatan}</p>
                  </div>

                  {/* DETAIL */}
                  <div className="bg-slate-50 rounded-2xl px-4 py-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Petugas</span>
                      <span className="font-medium text-slate-800">{item.petugas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Estimasi Selesai</span>
                      <span className="font-medium text-slate-800 flex items-center gap-1">
                        <FaClock className="text-xs text-slate-400" /> {item.estimasi}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Lokasi</span>
                      <span className="font-medium text-slate-800 text-right max-w-[55%] text-xs leading-snug">{item.lokasi}</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </div>
  )
}