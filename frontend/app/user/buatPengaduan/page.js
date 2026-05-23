// ===============================================
// FILE: app/user/buatPengaduan/page.js
// ===============================================

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaArrowLeft, FaBell,
  FaRoad, FaLightbulb, FaLeaf, FaWater, FaTrash, FaBuilding,
} from "react-icons/fa"

const CATEGORIES = [
  { id: "jalan",      label: "Jalan & Infrastruktur",  icon: <FaRoad />,      color: "#f59e0b" },
  { id: "lampu",      label: "Penerangan Jalan",        icon: <FaLightbulb />, color: "#3b82f6" },
  { id: "lingkungan", label: "Lingkungan & Taman",      icon: <FaLeaf />,      color: "#10b981" },
  { id: "air",        label: "Drainase & Air",          icon: <FaWater />,     color: "#06b6d4" },
  { id: "sampah",     label: "Kebersihan & Sampah",     icon: <FaTrash />,     color: "#8b5cf6" },
  { id: "fasilitas",  label: "Fasilitas Umum",          icon: <FaBuilding />,  color: "#ef4444" },
]

const STEPS = [
  { id: 1, label: "Kategori" },
  { id: 2, label: "Detail" },
  { id: 3, label: "Lokasi & Foto" },
  { id: 4, label: "Konfirmasi" },
]

export default function BuatPengaduanPage() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [selected, setSelected] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"))
    const saved = JSON.parse(localStorage.getItem("pengaduan") || "{}")
    if (saved.category) setSelected(saved.category)
    setMounted(true)
  }, [])

  const handleLanjut = () => {
    const existing = JSON.parse(localStorage.getItem("pengaduan") || "{}")
    localStorage.setItem("pengaduan", JSON.stringify({ ...existing, category: selected }))
    router.push("/user/detail")
  }

  // Hindari render berbeda antara server & client
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar user={user} back="/user/beranda" title="Buat Pengajuan" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <StepBar current={1} steps={STEPS} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8 mt-6"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Pilih Kategori Pengaduan</h2>
          <p className="text-slate-400 mb-8">Pilih kategori yang paling sesuai dengan permasalahan Anda</p>

          <div className="grid grid-cols-2 gap-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`flex items-center gap-5 p-6 rounded-[28px] border-2 transition-all text-left bg-white ${
                  selected === cat.id
                    ? "border-[#111111] shadow-sm"
                    : "border-[#eef2f7] hover:border-[#d7deea]"
                }`}
              >
                <div
                  className="w-[64px] h-[64px] min-w-[64px] rounded-[22px] flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  <span className="text-white text-[28px] flex items-center justify-center">
                    {cat.icon}
                  </span>
                </div>
                <div>
                  <p className="text-[17px] font-bold text-slate-800">{cat.label}</p>
                  {selected === cat.id && (
                    <p className="text-sm text-slate-400 mt-1.5">Dipilih ✓</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <NavButtons
          onBack={() => router.push("/user/beranda")}
          onNext={handleLanjut}
          canNext={!!selected}
          isLast={false}
        />
      </div>
    </div>
  )
}

// ── Shared Components (export untuk dipakai halaman lain) ──────────────────

export function Navbar({ user, back, title }) {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-[#e9edf5] px-10 py-5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href={back}>
          <button className="w-11 h-11 rounded-2xl bg-[#f3f5f9] flex items-center justify-center text-slate-600 hover:bg-[#e9edf5] transition-all">
            <FaArrowLeft />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-400">Portal Pengaduan Masyarakat</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-11 h-11 rounded-2xl bg-[#f3f5f9] flex items-center justify-center text-slate-600">
          <FaBell />
        </button>
        <div className="flex items-center gap-3 bg-[#f3f5f9] px-4 py-2 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-semibold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user?.username || "User"}</p>
            <p className="text-xs text-slate-400">Masyarakat</p>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function StepBar({ current, steps }) {
  return (
    <div className="bg-white border border-[#e9edf5] rounded-[28px] p-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#e9edf5] mx-16 z-0" />
        <div
          className="absolute left-0 top-5 h-0.5 bg-[#111111] z-0 transition-all duration-500"
          style={{
            width: `${((current - 1) / (steps.length - 1)) * 100}%`,
            marginLeft: "4rem",
            marginRight: "4rem",
            maxWidth: "calc(100% - 8rem)",
          }}
        />
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              current > s.id
                ? "bg-[#111111] text-white"
                : current === s.id
                ? "bg-[#111111] text-white ring-4 ring-[#111111]/20"
                : "bg-white border-2 border-[#e9edf5] text-slate-400"
            }`}>
              {current > s.id ? "✓" : s.id}
            </div>
            <span className={`text-xs font-medium ${current >= s.id ? "text-slate-700" : "text-slate-400"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NavButtons({ onBack, onNext, canNext, isLast, backDisabled }) {
  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={onBack}
        disabled={backDisabled}
        className="px-7 py-4 rounded-2xl border border-[#e9edf5] bg-white text-slate-600 font-medium hover:bg-[#f3f5f9] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Kembali
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="px-8 py-4 rounded-2xl bg-[#111111] text-white font-medium hover:bg-[#222222] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isLast ? "Kirim Pengaduan ✓" : "Lanjut →"}
      </button>
    </div>
  )
}