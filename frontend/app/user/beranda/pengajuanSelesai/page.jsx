"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaArrowLeft, FaCheckCircle, FaLightbulb, FaWater, FaStar, FaFileAlt,
} from "react-icons/fa"

const DUMMY = [
  {
    _id: "2",
    judul: "Lampu jalan mati sudah 2 minggu",
    kodeAduan: "ADU-3B9M2C",
    lokasi: "Jl. Gatot Subroto, Jakarta Selatan",
    createdAt: "2026-05-17T08:00:00Z",
    selesaiAt: "2026-05-22T08:00:00Z",
    icon: FaLightbulb,
    petugas: "Dinas Penerangan DKI",
    catatan: "Lampu jalan telah diganti dengan unit baru dan berfungsi normal kembali.",
    rating: 5,
  },
  {
    _id: "4",
    judul: "Drainase tersumbat menyebabkan banjir",
    kodeAduan: "ADU-9K3R5E",
    lokasi: "Jl. MH Thamrin, Jakarta Pusat",
    createdAt: "2026-05-05T08:00:00Z",
    selesaiAt: "2026-05-10T08:00:00Z",
    icon: FaWater,
    petugas: "Dinas Sumber Daya Air DKI",
    catatan: "Drainase telah dibersihkan dari sumbatan. Aliran air kembali normal.",
    rating: 4,
  },
]

const stagger = { animate: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

function StarRating({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <FaStar key={s} className={`text-sm ${s <= value ? "text-yellow-400" : "text-slate-200"}`} />
      ))}
    </div>
  )
}

function durasi(start, end) {
  const diff = Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
  return `${diff} hari`
}

export default function PengajuanSelesaiPage() {
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
            <h1 className="font-bold text-slate-900">Pengajuan Selesai</h1>
            <p className="text-xs text-slate-400">{DUMMY.length} pengajuan selesai</p>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">

        {/* BANNER */}
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <FaCheckCircle className="text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">
            Pengajuan berikut telah selesai ditangani. Terima kasih atas laporan Anda!
          </p>
        </div>

        {/* EMPTY STATE */}
        {DUMMY.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FaFileAlt className="text-slate-400 text-xl" />
            </div>
            <p className="font-semibold text-slate-600 text-sm">Belum ada pengajuan selesai</p>
            <p className="text-xs text-slate-400">Pengajuan yang selesai akan muncul di sini</p>
          </div>
        )}

        {/* LIST */}
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
          {DUMMY.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item._id} variants={fadeUp}>
                <div className="bg-white border border-slate-200 rounded-[24px] p-5">

                  {/* HEADER */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 flex-shrink-0">
                      <Icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 leading-snug">{item.judul}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="font-mono">{item.kodeAduan}</span>
                        <span>•</span>
                        <span>Selesai {new Date(item.selesaiAt).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Selesai
                    </span>
                  </div>

                  {/* CATATAN */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-green-700 mb-1">Catatan Penyelesaian</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.catatan}</p>
                  </div>

                  {/* DETAIL */}
                  <div className="bg-slate-50 rounded-2xl px-4 py-3 space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Petugas</span>
                      <span className="font-medium text-slate-800">{item.petugas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tanggal Masuk</span>
                      <span className="font-medium text-slate-800">
                        {new Date(item.createdAt).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tanggal Selesai</span>
                      <span className="font-medium text-slate-800">
                        {new Date(item.selesaiAt).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Durasi Penanganan</span>
                      <span className="font-medium text-slate-800">{durasi(item.createdAt, item.selesaiAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-slate-500">Rating</span>
                      <StarRating value={item.rating} />
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 truncate max-w-[80%]">{item.lokasi}</p>
                    <FaCheckCircle className="text-green-400 flex-shrink-0" />
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