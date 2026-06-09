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
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    judul: "",
    deskripsi: "",
    lokasi: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
  });

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setReportId(unwrapped.id);
    };
    unwrapParams();
  }, [params]);

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
        setEditForm({
          judul: result.data.judul,
          deskripsi: result.data.deskripsi,
          lokasi: result.data.lokasi,
          rt: result.data.rt || "",
          rw: result.data.rw || "",
          kelurahan: result.data.kelurahan || "",
          kecamatan: result.data.kecamatan || "",
        });
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      judul: report.judul,
      deskripsi: report.deskripsi,
      lokasi: report.lokasi,
      rt: report.rt || "",
      rw: report.rw || "",
      kelurahan: report.kelurahan || "",
      kecamatan: report.kecamatan || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          judul: editForm.judul,
          deskripsi: editForm.deskripsi,
          lokasi: editForm.lokasi,
          rt: editForm.rt,
          rw: editForm.rw,
          kelurahan: editForm.kelurahan,
          kecamatan: editForm.kecamatan,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setReport(result.data);
        setIsEditing(false);
        alert("✅ Pengaduan berhasil diperbarui!");
      } else {
        alert(result.message || "Gagal memperbarui");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(`⚠️ Apakah Anda yakin ingin menghapus pengaduan "${report?.judul}"?\n\nTindakan ini tidak dapat dibatalkan!`);
    if (!confirm) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        alert("🗑️ Pengaduan berhasil dihapus");
        router.push("/user/beranda/pengajuanSaya");
      } else {
        alert(result.message || "Gagal menghapus");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan");
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

  const showActionButtons = report.status === "pending" || report.status === "diproses";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
            
            {/* Tombol Edit & Hapus */}
            {!isEditing && showActionButtons && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEdit}
                  style={{ backgroundColor: "#3b82f6" }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition shadow-md hover:opacity-90"
                >
                  <FaEdit className="text-sm" /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{ backgroundColor: "#ef4444" }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition shadow-md hover:opacity-90"
                >
                  <FaTrash className="text-sm" /> Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
          
          {/* HEADER CARD */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-6">
            {isEditing ? (
              // ==================== MODE EDIT ====================
              <div className="space-y-4">
                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Judul Pengaduan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={editForm.judul}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="Masukkan judul pengaduan"
                  />
                </div>
                
                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="deskripsi"
                    value={editForm.deskripsi}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                    placeholder="Jelaskan detail masalah"
                  />
                </div>
                
                {/* Tombol Aksi */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all"
                  >
                    <FaTimes className="inline mr-1" /> Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {saving ? <FaSpinner className="animate-spin inline mr-1" /> : <FaSave className="inline mr-1" />} Simpan
                  </button>
                </div>
              </div>
            ) : (
              // ==================== MODE TAMPILAN ====================
              <>
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
              </>
            )}
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

            {hasAdminNote && (
              <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FaInfoCircle className="text-blue-500 text-sm" />
                  <p className="text-xs font-semibold text-blue-700">Informasi dari Petugas</p>
                </div>
                <p className="text-sm text-slate-700">{report.admin_notes}</p>
                {report.petugas && <p className="text-xs text-blue-600 mt-2">Petugas: {report.petugas}</p>}
              </div>
            )}

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
          </motion.div>

          {/* LOKASI */}
          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <FaMapMarkerAlt className="text-red-500 text-sm" />
              </div>
              <h3 className="font-bold text-slate-800">Lokasi Kejadian</h3>
            </div>
            
            {isEditing ? (
              // ==================== EDIT LOKASI ====================
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alamat *</label>
                  <input 
                    type="text" 
                    name="lokasi" 
                    value={editForm.lokasi} 
                    onChange={handleEditChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">RT</label>
                    <input 
                      type="text" 
                      name="rt" 
                      value={editForm.rt} 
                      onChange={handleEditChange} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      placeholder="RT"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">RW</label>
                    <input 
                      type="text" 
                      name="rw" 
                      value={editForm.rw} 
                      onChange={handleEditChange} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      placeholder="RW"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kelurahan</label>
                    <input 
                      type="text" 
                      name="kelurahan" 
                      value={editForm.kelurahan} 
                      onChange={handleEditChange} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      placeholder="Kelurahan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kecamatan</label>
                    <input 
                      type="text" 
                      name="kecamatan" 
                      value={editForm.kecamatan} 
                      onChange={handleEditChange} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      placeholder="Kecamatan"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // ==================== TAMPILAN LOKASI ====================
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
            )}
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
                    <img src={photoUrl} alt={`Foto bukti ${idx + 1}`} className="w-full h-full object-cover" />
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
            <button onClick={handleBack} className="px-6 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-slate-800 transition">
              ← Kembali ke Pengajuan Saya
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}