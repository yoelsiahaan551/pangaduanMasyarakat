"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaArrowLeft, FaRoad, FaMapMarkerAlt, FaUser, FaClock,
  FaCheckCircle, FaCamera, FaStar, FaPaperPlane,
} from "react-icons/fa"
import { AdminSidebar } from "../../dashboard/page"

// ─── Dummy Detail (simulasi data untuk _id = "1") ──────────────────────────

const DUMMY_DETAIL = {
  _id: "1",
  judul: "Jalan berlubang di depan SD Negeri 5",
  kodeAduan: "ADU-7F2K1A",
  kategori: "jalan",
  prioritas: "tinggi",
  status: "Diproses",
  stepAktif: 2,
  lokasi: "Jl. Sudirman No.12, Jakarta Pusat",
  rt: "005", rw: "003",
  kelurahan: "Karet Tengsin", kecamatan: "Tanah Abang",
  deskripsi: "Terdapat lubang besar di jalan utama depan SD Negeri 5. Lubang berukuran sekitar 1x1 meter dengan kedalaman 30cm. Sudah menyebabkan 2 motor terperosok minggu lalu. Sangat berbahaya terutama saat hujan karena terisi air dan tidak terlihat.",
  createdAt: "2026-06-07T08:00:00Z",
  pelapor: { nama: "Budi Santoso", email: "budi@email.com", telepon: "0812-3456-7890" },
  petugas: "Dinas PU Jakarta Pusat",
  estimasi: "3-5 hari kerja",
  catatan: "Tim lapangan sudah diterjunkan untuk survei lokasi. Perbaikan dijadwalkan besok pagi.",
  foto: [],
  riwayat: [
    { tanggal: "2026-06-07T08:00:00Z", status: "Pending",  catatan: "Pengaduan diterima oleh sistem." },
    { tanggal: "2026-06-07T10:30:00Z", status: "Ditinjau", catatan: "Pengaduan sedang ditinjau oleh admin." },
    { tanggal: "2026-06-07T14:00:00Z", status: "Diproses", catatan: "Tim lapangan sudah diterjunkan untuk survei lokasi." },
  ],
}

const STEPS = ["Diterima", "Ditinjau", "Dikerjakan", "Selesai"]

const STATUS_OPTIONS = ["Pending", "Ditinjau", "Diproses", "Selesai"]

const PRIORITAS_MAP = {
  tinggi: "bg-red-100 text-red-700 border-red-200",
  sedang: "bg-yellow-100 text-yellow-700 border-yellow-200",
  rendah: "bg-green-100 text-green-700 border-green-200",
}

const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const stagger = { animate: { transition: { staggerChildren: 0.07 } } }

export default function AdminDetailPengaduanPage({ params }) {
  const [data, setData]           = useState(DUMMY_DETAIL)
  const [newStatus, setNewStatus] = useState(data.status)
  const [newCatatan, setNewCatatan] = useState("")
  const [newPetugas, setNewPetugas] = useState(data.petugas)
  const [saved, setSaved]         = useState(false)

  const handleUpdate = () => {
    setData((prev) => ({
      ...prev,
      status: newStatus,
      petugas: newPetugas,
      catatan: newCatatan || prev.catatan,
      riwayat: newCatatan
        ? [...prev.riwayat, { tanggal: new Date().toISOString(), status: newStatus, catatan: newCatatan }]
        : prev.riwayat,
    }))
    setSaved(true)
    setNewCatatan("")
    setTimeout(() => setSaved(false), 3000)
  }

  const stepAktif = ["Pending", "Ditinjau", "Diproses", "Selesai"].indexOf(data.status)

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <AdminSidebar active="Kelola Pengaduan" />

      <div className="flex-1">

        {/* TOPBAR */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/pengaduan">
              <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
                <FaArrowLeft className="text-sm" />
              </button>
            </Link>
            <div>
              <h1 className="font-bold text-slate-900">Detail Pengaduan</h1>
              <p className="text-xs text-slate-400 font-mono">{data.kodeAduan}</p>
            </div>
          </div>
          {saved && (
            <span className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl font-medium">
              <FaCheckCircle /> Perubahan disimpan
            </span>
          )}
        </header>

        <div className="px-8 py-6">
          <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-3 gap-5">

            {/* KIRI: Info Pengaduan */}
            <div className="col-span-2 space-y-5">

              {/* HEADER CARD */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <FaRoad />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-xl text-slate-800 leading-snug">{data.judul}</h2>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${PRIORITAS_MAP[data.prioritas]}`}>
                        Prioritas {data.prioritas}
                      </span>
                      <span className="text-xs text-slate-400">{new Date(data.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-2xl p-4">{data.deskripsi}</p>
              </motion.div>

              {/* STEPPER */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                <h3 className="font-bold text-slate-800 mb-5">Progress Penanganan</h3>
                <div className="relative px-2">
                  <div className="absolute top-3.5 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-0.5 bg-slate-100">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-700"
                      style={{ width: `${(stepAktif / (STEPS.length - 1)) * 100}%` }}
                    />
                  </div>
                  <div className="relative flex justify-between">
                    {STEPS.map((s, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 w-1/4">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 transition ${
                          i < stepAktif ? "bg-black border-black text-white"
                            : i === stepAktif ? "bg-black border-black text-white ring-4 ring-black/10"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}>
                          {i < stepAktif ? "✓" : i + 1}
                        </div>
                        <span className={`text-[10px] text-center font-medium ${i <= stepAktif ? "text-slate-800" : "text-slate-400"}`}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* LOKASI */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-slate-500" />
                  <h3 className="font-bold text-slate-800">Lokasi Kejadian</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    ["Alamat", data.lokasi],
                    ["RT/RW", `RT ${data.rt} / RW ${data.rw}`],
                    ["Kelurahan", data.kelurahan],
                    ["Kecamatan", data.kecamatan],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                      <p className="font-medium text-slate-800">{val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* FOTO */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaCamera className="text-slate-500" />
                  <h3 className="font-bold text-slate-800">Foto Bukti</h3>
                </div>
                {data.foto.length === 0 ? (
                  <p className="text-sm text-slate-400">Tidak ada foto yang dilampirkan</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {data.foto.map((f, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-slate-100 overflow-hidden">
                        <img src={f} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* RIWAYAT */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                <h3 className="font-bold text-slate-800 mb-4">Riwayat Aktivitas</h3>
                <div className="space-y-4">
                  {data.riwayat.map((r, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-black mt-0.5 flex-shrink-0" />
                        {i < data.riwayat.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">{r.status}</span>
                          <span className="text-xs text-slate-400">{new Date(r.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-sm text-slate-600">{r.catatan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* KANAN: Panel Aksi */}
            <div className="space-y-5">

              {/* INFO PELAPOR */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FaUser className="text-slate-500 text-sm" />
                  <h3 className="font-bold text-slate-800">Pelapor</h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                    {data.pelapor.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{data.pelapor.nama}</p>
                    <p className="text-xs text-slate-400">{data.pelapor.email}</p>
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telepon</span>
                    <span className="font-medium text-slate-800">{data.pelapor.telepon}</span>
                  </div>
                </div>
              </motion.div>

              {/* UPDATE STATUS */}
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FaClock className="text-slate-500 text-sm" />
                  <h3 className="font-bold text-slate-800">Update Status</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status Baru</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setNewStatus(s)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            newStatus === s ? "bg-black border-black text-white" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Petugas / Instansi</label>
                    <input
                      type="text"
                      value={newPetugas}
                      onChange={(e) => setNewPetugas(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-slate-400 transition-all bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Catatan Petugas</label>
                    <textarea
                      rows={3}
                      placeholder="Tulis catatan update..."
                      value={newCatatan}
                      onChange={(e) => setNewCatatan(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-all bg-slate-50 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleUpdate}
                    className="w-full py-3 rounded-xl bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                  >
                    <FaPaperPlane className="text-xs" /> Simpan Update
                  </button>
                </div>
              </motion.div>

              {/* ESTIMASI */}
              <motion.div variants={fadeUp} className="bg-slate-50 border border-slate-200 rounded-[20px] p-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Petugas</span>
                  <span className="font-medium text-slate-800 text-right">{data.petugas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi</span>
                  <span className="font-medium text-slate-800">{data.estimasi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Masuk</span>
                  <span className="font-medium text-slate-800">{new Date(data.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}