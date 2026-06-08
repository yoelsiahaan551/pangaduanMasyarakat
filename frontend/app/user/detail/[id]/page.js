"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaCamera,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

const STATUS_BADGE = {
  pending: { bg: "bg-slate-100", text: "text-slate-700", label: "Pending", icon: <FaClock className="text-slate-500" /> },
  diproses: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Diproses", icon: <FaClock className="text-yellow-500" /> },
  selesai: { bg: "bg-green-100", text: "text-green-700", label: "Selesai", icon: <FaCheckCircle className="text-green-500" /> },
  ditolak: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak", icon: <FaTimesCircle className="text-red-500" /> },
};

const PRIORITY_BADGE = {
  rendah: "bg-blue-100 text-blue-700",
  sedang: "bg-yellow-100 text-yellow-700",
  tinggi: "bg-red-100 text-red-700",
};

const STEPS = ["Diterima", "Ditinjau", "Dikerjakan", "Selesai"];

export default function UserDetailPengaduanPage({ params }) {
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportId, setReportId] = useState(null);

  // Unwrap params untuk Next.js 15+
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setReportId(unwrapped.id);
    };
    unwrapParams();
  }, [params]);

  // Fetch setelah reportId didapat
  useEffect(() => {
    if (reportId) {
      fetchDetail();
    }
  }, [reportId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setReport(result.data);
      } else {
        setError("Data pengaduan tidak ditemukan");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (status) => {
    switch (status) {
      case "pending": return 1;
      case "diproses": return 3;
      case "selesai": return 4;
      case "ditolak": return 4;
      default: return 1;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // ✅ KEMBALI KE PENGAJUAN SAYA (yang ada di dalam folder beranda)
  const handleBack = () => {
    router.push("/user/beranda/pengajuanSaya");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <FaSpinner className="w-10 h-10 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600">{error || "Pengaduan tidak ditemukan"}</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-slate-800 transition"
            >
              Kembali ke Pengajuan Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_BADGE[report.status] || STATUS_BADGE.pending;
  const priorityClass = PRIORITY_BADGE[report.priority] || PRIORITY_BADGE.sedang;
  const activeStep = getActiveStep(report.status);
  const hasAdminNote = report.admin_notes && report.admin_notes.trim() !== "";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar dengan Tombol Kembali */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
          >
            <FaArrowLeft className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Detail Pengaduan</h1>
            <p className="text-xs text-slate-400 font-mono">{report.report_number}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
          
          {/* HEADER CARD */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{report.judul}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityClass}`}>
                    Prioritas {report.priority}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {statusInfo.icon}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Dibuat pada</p>
                <p className="text-sm font-medium text-slate-700">{formatDateShort(report.created_at)}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{report.deskripsi}</p>
            </div>
          </motion.div>

          {/* PROGRESS STEPPER */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-5">Progress Penanganan</h3>
            <div className="relative px-2">
              <div className="absolute top-3.5 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-0.5 bg-slate-100">
                <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${((activeStep - 1) / 3) * 100}%` }} />
              </div>
              <div className="relative flex justify-between">
                {STEPS.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 w-1/4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 transition ${
                      idx < activeStep - 1 ? "bg-black border-black text-white" :
                      idx === activeStep - 1 ? "bg-black border-black text-white ring-4 ring-black/20" :
                      "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {idx < activeStep - 1 ? "✓" : idx + 1}
                    </div>
                    <span className={`text-[11px] text-center font-medium ${idx < activeStep ? "text-slate-800" : "text-slate-400"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan dari Admin */}
            {hasAdminNote && (
              <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FaInfoCircle className="text-blue-500 text-sm" />
                  <p className="text-xs font-semibold text-blue-700">Informasi dari Petugas</p>
                </div>
                <p className="text-sm text-slate-700">{report.admin_notes}</p>
                {report.petugas && (
                  <p className="text-xs text-blue-600 mt-2">Petugas: {report.petugas}</p>
                )}
              </div>
            )}

            {/* Pesan default berdasarkan status */}
            {!hasAdminNote && report.status === "pending" && (
              <div className="mt-5 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                <p className="text-xs font-semibold text-yellow-700 mb-1">⏳ Menunggu Verifikasi</p>
                <p className="text-sm text-slate-700">Pengaduan Anda sedang menunggu diverifikasi oleh admin.</p>
              </div>
            )}

            {!hasAdminNote && report.status === "diproses" && (
              <div className="mt-5 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                <p className="text-xs font-semibold text-yellow-700 mb-1">🔄 Sedang Diproses</p>
                <p className="text-sm text-slate-700">Pengaduan Anda sedang dalam proses penanganan oleh tim terkait.</p>
              </div>
            )}

            {!hasAdminNote && report.status === "selesai" && (
              <div className="mt-5 p-3 bg-green-50 border border-green-100 rounded-xl">
                <p className="text-xs font-semibold text-green-700 mb-1">✅ Selesai</p>
                <p className="text-sm text-slate-700">Pengaduan Anda telah selesai ditangani. Terima kasih!</p>
              </div>
            )}

            {!hasAdminNote && report.status === "ditolak" && (
              <div className="mt-5 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-semibold text-red-700 mb-1">❌ Ditolak</p>
                <p className="text-sm text-slate-700">Pengaduan Anda tidak dapat diproses. Silakan hubungi admin.</p>
              </div>
            )}
          </motion.div>

          {/* LOKASI */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <FaMapMarkerAlt className="text-red-500 text-sm" />
              </div>
              <h3 className="font-bold text-slate-800">Lokasi Kejadian</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Alamat</p>
                <p className="font-medium text-slate-800">{report.lokasi}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">RT / RW</p>
                <p className="font-medium text-slate-800">RT {report.rt || "-"} / RW {report.rw || "-"}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Kelurahan</p>
                <p className="font-medium text-slate-800">{report.kelurahan || "-"}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">Kecamatan</p>
                <p className="font-medium text-slate-800">{report.kecamatan || "-"}</p>
              </div>
            </div>
          </motion.div>

          {/* FOTO BUKTI */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <FaCamera className="text-purple-500 text-sm" />
              </div>
              <h3 className="font-bold text-slate-800">Foto Bukti</h3>
            </div>
            {!report.photos || report.photos.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Tidak ada foto yang dilampirkan</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {report.photos.map((photoUrl, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img 
                      src={photoUrl} 
                      alt={`Foto bukti ${idx + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(photoUrl, '_blank')}
                      onError={(e) => { e.target.src = "/placeholder-image.png"; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* INFORMASI TAMBAHAN */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Informasi Lainnya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaUser className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Pelapor</p>
                  <p className="font-medium text-slate-800">{report.user_name || "User"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Tanggal Pengaduan</p>
                  <p className="font-medium text-slate-800">{formatDate(report.created_at)}</p>
                </div>
              </div>
              {report.status === "selesai" && report.updated_at && (
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500" />
                  <div>
                    <p className="text-xs text-slate-400">Tanggal Selesai</p>
                    <p className="font-medium text-slate-800">{formatDate(report.updated_at)}</p>
                  </div>
                </div>
              )}
              {report.petugas && (
                <div className="flex items-center gap-3">
                  <FaUser className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Petugas</p>
                    <p className="font-medium text-slate-800">{report.petugas}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* TOMBOL KEMBALI */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-slate-800 transition"
            >
              ← Kembali ke Pengajuan Saya
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}