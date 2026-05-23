// ===============================================
// FILE: app/user/konfirmasi/page.js
// ===============================================

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaFileAlt, FaCheckCircle, FaExclamationTriangle,
  FaRoad, FaLightbulb, FaLeaf, FaWater, FaTrash, FaBuilding,
} from "react-icons/fa"
import { Navbar, StepBar, NavButtons } from "../buatPengaduan/page"

const CATEGORY_MAP = {
  jalan:      { label: "Jalan & Infrastruktur",  icon: <FaRoad />,      color: "#f59e0b" },
  lampu:      { label: "Penerangan Jalan",        icon: <FaLightbulb />, color: "#3b82f6" },
  lingkungan: { label: "Lingkungan & Taman",      icon: <FaLeaf />,      color: "#10b981" },
  air:        { label: "Drainase & Air",          icon: <FaWater />,     color: "#06b6d4" },
  sampah:     { label: "Kebersihan & Sampah",     icon: <FaTrash />,     color: "#8b5cf6" },
  fasilitas:  { label: "Fasilitas Umum",          icon: <FaBuilding />,  color: "#ef4444" },
}

const PRIORITY_LABEL = { rendah: "Rendah", sedang: "Sedang", tinggi: "Tinggi" }
const PRIORITY_STYLE = {
  rendah: "bg-green-100 text-green-700",
  sedang: "bg-yellow-100 text-yellow-700",
  tinggi: "bg-red-100 text-red-700",
}

const STEPS = [
  { id: 1, label: "Kategori",      href: "/user/buatPengaduan" },
  { id: 2, label: "Detail",        href: "/user/detail" },
  { id: 3, label: "Lokasi & Foto", href: "/user/lokasiFoto" },
  { id: 4, label: "Konfirmasi",    href: "/user/konfirmasi" },
]

export default function KonfirmasiPage() {
  const router    = useRouter()
  const user      = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null
  const form      = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pengaduan") || "{}") : {}

  const [agreement,  setAgreement]  = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  const selectedCategory = CATEGORY_MAP[form.category]

  const handleKirim = () => {
    localStorage.removeItem("pengaduan")
    setSubmitted(true)
  }

  if (submitted) return <SuccessPage user={user} form={form} selectedCategory={selectedCategory} />

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar user={user} back="/user/lokasiFoto" title="Buat Pengajuan" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <StepBar current={4} steps={STEPS} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8 mt-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center text-slate-700">
              <FaFileAlt />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Konfirmasi Pengaduan</h2>
              <p className="text-slate-400 text-sm">Periksa kembali sebelum mengirim</p>
            </div>
          </div>

          {/* Review rows */}
          <div className="space-y-3 mb-8">
            <ReviewRow label="Kategori">
              {selectedCategory && (
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: selectedCategory.color }}>
                    {selectedCategory.icon}
                  </span>
                  <span>{selectedCategory.label}</span>
                </div>
              )}
            </ReviewRow>

            <ReviewRow label="Judul">{form.title}</ReviewRow>

            <ReviewRow label="Urgensi">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_STYLE[form.priority]}`}>
                {PRIORITY_LABEL[form.priority]}
              </span>
            </ReviewRow>

            <ReviewRow label="Deskripsi">
              <p className="text-slate-600 text-sm leading-relaxed">{form.description}</p>
            </ReviewRow>

            <ReviewRow label="Alamat">
              <p className="text-slate-600 text-sm">
                {form.location}
                {form.rt        && `, RT ${form.rt}`}
                {form.rw        && `/RW ${form.rw}`}
                {form.kelurahan && `, ${form.kelurahan}`}
                {form.kecamatan && `, ${form.kecamatan}`}
              </p>
            </ReviewRow>

            <ReviewRow label="Foto Bukti">
              {!form.photos?.length ? (
                <span className="text-slate-400 text-sm italic">Tidak ada foto</span>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {form.photos.map((p, i) => (
                    <img key={i} src={p.dataUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </ReviewRow>
          </div>

          {/* Warning */}
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
            <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 leading-relaxed">
              Pastikan informasi yang Anda berikan adalah benar dan akurat. Pengaduan palsu dapat dikenakan sanksi sesuai peraturan yang berlaku.
            </p>
          </div>

          {/* Agreement */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${
                agreement ? "bg-[#111111] border-[#111111]" : "border-[#d1d9e8]"
              }`}
              onClick={() => setAgreement((v) => !v)}
            >
              {agreement && <FaCheckCircle className="text-white text-xs" />}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Saya menyatakan bahwa informasi yang saya berikan dalam pengaduan ini adalah benar dan dapat dipertanggungjawabkan sesuai ketentuan yang berlaku.
            </p>
          </label>
        </motion.div>

        <NavButtons onBack={() => router.push("/user/lokasiFoto")} onNext={handleKirim} canNext={agreement} isLast={true} />
      </div>
    </div>
  )
}

function ReviewRow({ label, children }) {
  return (
    <div className="flex gap-4 p-4 bg-[#f8f9fb] rounded-2xl">
      <span className="text-sm font-semibold text-slate-500 w-28 flex-shrink-0">{label}</span>
      <div className="text-sm font-medium text-slate-800 flex-1">{children}</div>
    </div>
  )
}

function SuccessPage({ user, form, selectedCategory }) {
  const ticketNumber = "ADU-" + Math.random().toString(36).toUpperCase().slice(2, 8)
  return (
    <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-[#e9edf5] rounded-[40px] p-12 max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 rounded-full bg-[#f3f5f9] flex items-center justify-center mx-auto mb-6"
        >
          <FaCheckCircle className="text-[#111111] text-4xl" />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-800 mb-3">Pengaduan Terkirim!</h1>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Pengaduan Anda telah kami terima dan sedang dalam proses verifikasi.
          Kami akan segera menindaklanjuti laporan Anda.
        </p>

        <div className="bg-[#f8f9fb] rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-widest">Nomor Tiket</p>
          <p className="text-2xl font-bold text-slate-800 font-mono">{ticketNumber}</p>
          <p className="text-xs text-slate-400 mt-2">Simpan nomor ini untuk memantau status pengaduan Anda</p>
        </div>

        {selectedCategory && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#f8f9fb] mb-8 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0" style={{ backgroundColor: selectedCategory.color }}>
              {selectedCategory.icon}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{form.title}</p>
              <p className="text-xs text-slate-400">{selectedCategory.label}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/user/beranda" className="flex-1">
            <button className="w-full px-6 py-4 rounded-2xl border border-[#e9edf5] text-slate-700 font-medium hover:bg-[#f3f5f9] transition-all">
              Ke Beranda
            </button>
          </Link>
          <Link href="/user/beranda" className="flex-1">
            <button className="w-full px-6 py-4 rounded-2xl bg-[#111111] text-white font-medium hover:bg-[#222222] transition-all">
              Pantau Status
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}