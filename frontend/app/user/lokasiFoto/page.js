// ===============================================
// FILE: app/user/lokasiFoto/page.js
// ===============================================

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FaMapMarkerAlt, FaCamera, FaUpload, FaTimes } from "react-icons/fa"
import { Navbar, StepBar, NavButtons } from "../buatPengaduan/page"
import { supabase } from "@/lib/supabase"

const STEPS = [
  { id: 1, label: "Kategori" },
  { id: 2, label: "Detail" },
  { id: 3, label: "Lokasi & Foto" },
  { id: 4, label: "Konfirmasi" },
]

export default function LokasiFotoPage() {
  const router = useRouter()
  const [user,      setUser]      = useState(null)
  const [saved,     setSaved]     = useState({})
  const [location,  setLocation]  = useState("")
  const [rt,        setRt]        = useState("")
  const [rw,        setRw]        = useState("")
  const [kelurahan, setKelurahan] = useState("")
  const [kecamatan, setKecamatan] = useState("")
  const [photos,    setPhotos]    = useState([])
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"))
    const s = JSON.parse(localStorage.getItem("pengaduan") || "{}")
    setSaved(s)
    if (s.location)  setLocation(s.location)
    if (s.rt)        setRt(s.rt)
    if (s.rw)        setRw(s.rw)
    if (s.kelurahan) setKelurahan(s.kelurahan)
    if (s.kecamatan) setKecamatan(s.kecamatan)
    if (s.photos)    setPhotos(s.photos)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handlePhotoUpload = async (e) => {
  const files = Array.from(e.target.files)

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`

    console.log("Upload dimulai:", fileName)

    const { error } = await supabase.storage
      .from("pengaduan")
      .upload(fileName, file)

    console.log("Hasil upload:", error)

    if (error) {
      console.error("Upload gagal:", error)
      continue
    }

    const { data } = supabase.storage
      .from("pengaduan")
      .getPublicUrl(fileName)

    setPhotos((prev) => [
      ...prev,
      {
        name: file.name,
        dataUrl: data.publicUrl,
      },
    ])
  }
}

  const removePhoto = (i) => setPhotos((prev) => prev.filter((_, idx) => idx !== i))

  const canNext = location.length >= 5

  const handleLanjut = () => {
    localStorage.setItem(
      "pengaduan",
      JSON.stringify({ ...saved, location, rt, rw, kelurahan, kecamatan, photos })
    )
    router.push("/user/konfirmasi")
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar user={user} back="/user/detail" title="Buat Pengajuan" />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <StepBar current={3} steps={STEPS} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* LOKASI */}
          <div className="bg-white border border-[#e9edf5] rounded-[35px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center text-slate-700">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Lokasi Kejadian</h2>
                <p className="text-slate-400 text-sm">Informasi lokasi membantu petugas menemukan tempat</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama jalan, nomor, patokan terdekat..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">RT</label>
                <input
                  type="text" placeholder="Contoh: 005" value={rt}
                  onChange={(e) => setRt(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">RW</label>
                <input
                  type="text" placeholder="Contoh: 003" value={rw}
                  onChange={(e) => setRw(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kelurahan</label>
                <input
                  type="text" placeholder="Nama kelurahan" value={kelurahan}
                  onChange={(e) => setKelurahan(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kecamatan</label>
                <input
                  type="text" placeholder="Nama kecamatan" value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
            </div>
          </div>

          {/* FOTO */}
          <div className="bg-white border border-[#e9edf5] rounded-[35px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center text-slate-700">
                <FaCamera />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Foto Bukti</h2>
                <p className="text-slate-400 text-sm">Tambahkan foto untuk memperkuat laporan (maks. 5 foto)</p>
              </div>
            </div>

            {photos.length < 5 && (
              <label className="w-full border-2 border-dashed border-[#d1d9e8] rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-[#111111] hover:bg-[#f8f9fb] transition-all mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#f3f5f9] flex items-center justify-center text-slate-500 text-2xl">
                  <FaUpload />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700">Klik untuk upload foto</p>
                  <p className="text-sm text-slate-400">JPG, PNG, atau HEIC • Maks 10MB per foto</p>
                </div>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
              </label>
            )}

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden aspect-square bg-[#f3f5f9]">
                    <img
                        src={photo.dataUrl}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <NavButtons
          onBack={() => router.push("/user/detail")}
          onNext={handleLanjut}
          canNext={canNext}
          isLast={false}
        />
      </div>
    </div>
  )
}