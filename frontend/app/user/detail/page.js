// ===============================================
// FILE: app/user/detail/page.js
// ===============================================

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
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

const PRIORITY_LEVELS = [
  { id: "rendah", label: "Rendah", desc: "Tidak mendesak, bisa ditangani dalam 30 hari", color: "text-green-600 bg-green-50 border-green-200" },
  { id: "sedang", label: "Sedang", desc: "Perlu perhatian, tangani dalam 14 hari",       color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { id: "tinggi", label: "Tinggi", desc: "Mendesak, perlu ditangani dalam 3 hari",       color: "text-red-600 bg-red-50 border-red-200" },
]

const STEPS = [
  { id: 1, label: "Kategori" },
  { id: 2, label: "Detail" },
  { id: 3, label: "Lokasi & Foto" },
  { id: 4, label: "Konfirmasi" },
]

export default function DetailPage() {
  const router = useRouter()
  const [user,     setUser]     = useState(null)
  const [saved,    setSaved]    = useState({})
  const [title,    setTitle]    = useState("")
  const [desc,     setDesc]     = useState("")
  const [priority, setPriority] = useState("sedang")
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"))
    const s = JSON.parse(localStorage.getItem("pengaduan") || "{}")
    setSaved(s)
    if (s.title)       setTitle(s.title)
    if (s.description) setDesc(s.description)
    if (s.priority)    setPriority(s.priority)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const selectedCategory = CATEGORY_MAP[saved.category] || null
  const canNext = title.length >= 5 && desc.length >= 20

  const handleLanjut = () => {
    localStorage.setItem("pengaduan", JSON.stringify({ ...saved, title, description: desc, priority }))
    router.push("/user/lokasiFoto")
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar user={user} back="/user/buatPengaduan" title="Buat Pengajuan" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <StepBar current={2} steps={STEPS} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8 mt-6"
        >
          <div className="flex items-center gap-3 mb-6">
            {selectedCategory && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: selectedCategory.color }}
              >
                {selectedCategory.icon}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Detail Pengaduan</h2>
              {selectedCategory && (
                <p className="text-slate-400 text-sm">{selectedCategory.label}</p>
              )}
            </div>
          </div>

          {/* Judul */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Judul Pengaduan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Jalan berlubang di depan SDN 01 Cipete"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{title.length}/100</p>
          </div>

          {/* Deskripsi */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi Lengkap <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Deskripsikan permasalahan secara detail: kapan terjadi, seberapa parah, dampak yang ditimbulkan..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={1000}
              className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{desc.length}/1000</p>
          </div>

          {/* Urgensi */}
          {/* PRIORITY */}
<div>

  <label className="block text-sm font-semibold text-slate-700 mb-3">

    Tingkat Urgensi
    <span className="text-red-500"> *</span>

  </label>

  <div className="grid md:grid-cols-3 gap-3">

    {PRIORITY_LEVELS.map((item) => (

      <button
        key={item.id}
        type="button"
        onClick={() => setPriority(item.id)}
        className={`p-5 rounded-2xl border-2 text-left transition-all ${
          priority === item.id
            ? "bg-black text-white border-black shadow-lg"
            : "bg-white border-[#e9edf5] hover:border-black text-slate-700"
        }`}
      >

        <div className="flex items-center justify-between mb-3">

          <p className="font-bold text-sm">
            {item.label}
          </p>

          {priority === item.id && (
            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
          )}

        </div>

        <p
          className={`text-xs leading-relaxed ${
            priority === item.id
              ? "text-white/70"
              : "text-slate-400"
          }`}
        >
          {item.desc}
        </p>

      </button>

    ))}

  </div>

</div>
        </motion.div>

        <NavButtons
          onBack={() => router.push("/user/buatPengaduan")}
          onNext={handleLanjut}
          canNext={canNext}
          isLast={false}
        />
      </div>
    </div>
  )
}