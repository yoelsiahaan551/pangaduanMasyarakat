"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaCamera,
  FaPaperPlane,
} from "react-icons/fa"

import { Navbar, StepBar, NavButtons } from "../buatPengaduan/page"

const STEPS = [
  { id: 1, label: "Kategori" },
  { id: 2, label: "Detail" },
  { id: 3, label: "Lokasi & Foto" },
  { id: 4, label: "Konfirmasi" },
]

const CATEGORY_MAP = {
  jalan: "Jalan & Infrastruktur",
  lampu: "Penerangan Jalan",
  lingkungan: "Lingkungan & Taman",
  air: "Drainase & Air",
  sampah: "Kebersihan & Sampah",
  fasilitas: "Fasilitas Umum",
}

export default function KonfirmasiPage() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [data, setData] = useState({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "null"))

    const pengaduan = JSON.parse(
      localStorage.getItem("pengaduan") || "{}"
    )

    setData(pengaduan)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSubmit = () => {
    const laporanBaru = {
      id: "ADU-" + Date.now(),
      ...data,
      status: "pending",
      tanggal: new Date().toLocaleDateString("id-ID"),
      pelapor: user?.nama || "User",
    }

    const laporanLama = JSON.parse(
      localStorage.getItem("laporan") || "[]"
    )

    laporanLama.unshift(laporanBaru)

    localStorage.setItem(
      "laporan",
      JSON.stringify(laporanLama)
    )

    localStorage.removeItem("pengaduan")

    alert("Pengaduan berhasil dikirim!")

    router.push("/user/beranda")
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar
        user={user}
        back="/user/lokasiFoto"
        title="Konfirmasi Pengaduan"
      />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <StepBar current={4} steps={STEPS} />

        {/* Ringkasan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center">
              <FaClipboardCheck />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Ringkasan Pengaduan
              </h2>

              <p className="text-sm text-slate-400">
                Periksa kembali data sebelum dikirim
              </p>
            </div>
          </div>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-slate-400 mb-1">
                Kategori
              </p>

              <p className="font-semibold text-slate-800">
                {CATEGORY_MAP[data.category] ||
                  data.category ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">
                Judul
              </p>

              <p className="font-semibold text-slate-800">
                {data.title || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">
                Deskripsi
              </p>

              <p className="text-slate-700 whitespace-pre-wrap">
                {data.description || "-"}
              </p>
            </div>

          </div>
        </motion.div>

        {/* Lokasi */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center">
              <FaMapMarkerAlt />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Lokasi Kejadian
              </h2>

              <p className="text-sm text-slate-400">
                Informasi lokasi laporan
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-slate-400">
                Alamat
              </p>

              <p className="font-medium text-slate-800">
                {data.location || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                RT / RW
              </p>

              <p className="font-medium text-slate-800">
                {data.rt || "-"} / {data.rw || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Kelurahan
              </p>

              <p className="font-medium text-slate-800">
                {data.kelurahan || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Kecamatan
              </p>

              <p className="font-medium text-slate-800">
                {data.kecamatan || "-"}
              </p>
            </div>

          </div>
        </motion.div>

        {/* Foto */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center">
              <FaCamera />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Foto Bukti
              </h2>

              <p className="text-sm text-slate-400">
                Lampiran yang akan dikirim
              </p>
            </div>
          </div>

          {data.photos?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-2xl overflow-hidden bg-[#f3f5f9]"
                >
                  <img
                    src={photo.dataUrl}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              Tidak ada foto yang diupload
            </div>
          )}
        </motion.div>

        {/* Peringatan */}
        <div className="bg-amber-50 border border-amber-200 rounded-[25px] p-5">
          <p className="text-sm text-amber-700">
            Dengan mengirim pengaduan ini, Anda menyatakan
            bahwa informasi yang diberikan benar dan dapat
            dipertanggungjawabkan.
          </p>
        </div>

        {/* Tombol */}
        <div className="flex justify-between gap-4">

          <button
            onClick={() =>
              router.push("/user/lokasiFoto")
            }
            className="px-6 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 transition"
          >
            Kembali
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-2xl bg-black text-white font-semibold flex items-center gap-2 hover:opacity-90 transition"
          >
            <FaPaperPlane />
            Kirim Pengaduan
          </button>

        </div>
      </div>
    </div>
  )
}