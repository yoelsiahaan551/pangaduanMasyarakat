"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaSearch, FaChevronRight, FaChevronDown, FaSpinner,
  FaRoad, FaLightbulb, FaLeaf, FaWater, FaTrash, FaBuilding,
  FaEdit, FaTimes, FaSave, FaBan, FaCheckCircle,
} from "react-icons/fa";
import { AdminSidebar } from "../dashboard/page";
import AdminGuard from "@/components/AdminGuard";

// ICON MAP
const ICON_MAP = {
  jalan: FaRoad, lampu: FaLightbulb, lingkungan: FaLeaf,
  air: FaWater, sampah: FaTrash, fasilitas: FaBuilding,
  "Jalan & Infrastruktur": FaRoad, "Penerangan Jalan": FaLightbulb,
  "Lingkungan & Taman": FaLeaf, "Drainase & Air": FaWater,
  "Kebersihan & Sampah": FaTrash, "Fasilitas Umum": FaBuilding,
};

// WARNA: Background terang, TEKS HITAM SEMUA
const COLOR_MAP = {
  jalan: "bg-amber-100 text-black",
  lampu: "bg-blue-100 text-black",
  lingkungan: "bg-green-100 text-black",
  air: "bg-cyan-100 text-black",
  sampah: "bg-purple-100 text-black",
  fasilitas: "bg-red-100 text-black",
  "Jalan & Infrastruktur": "bg-amber-100 text-black",
  "Penerangan Jalan": "bg-blue-100 text-black",
  "Lingkungan & Taman": "bg-green-100 text-black",
  "Drainase & Air": "bg-cyan-100 text-black",
  "Kebersihan & Sampah": "bg-purple-100 text-black",
  "Fasilitas Umum": "bg-red-100 text-black",
};

// STATUS MAP
const STATUS_MAP = {
  selesai: { pill: "bg-green-100 text-black", dot: "bg-green-500", label: "Selesai" },
  diproses: { pill: "bg-yellow-100 text-black", dot: "bg-yellow-500", label: "Diproses" },
  pending: { pill: "bg-slate-100 text-black", dot: "bg-slate-400", label: "Pending" },
  ditolak: { pill: "bg-red-100 text-black", dot: "bg-red-500", label: "Ditolak" }
};

// PRIORITAS MAP
const PRIORITAS_MAP = {
  tinggi: "bg-red-100 text-black",
  sedang: "bg-yellow-100 text-black",
  rendah: "bg-green-100 text-black"
};

const KATEGORI_OPTIONS = [
  { kode: "jalan", label: "Jalan & Infrastruktur" },
  { kode: "lampu", label: "Penerangan Jalan" },
  { kode: "lingkungan", label: "Lingkungan & Taman" },
  { kode: "air", label: "Drainase & Air" },
  { kode: "sampah", label: "Kebersihan & Sampah" },
  { kode: "fasilitas", label: "Fasilitas Umum" }
];

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const getCategoryDisplay = (categoryName, categoryCode) => {
  if (categoryName && categoryName !== "null" && categoryName !== "undefined" && categoryName !== "") {
    return categoryName;
  }
  const codeToLabel = {
    jalan: "Jalan & Infrastruktur", lampu: "Penerangan Jalan",
    lingkungan: "Lingkungan & Taman", air: "Drainase & Air",
    sampah: "Kebersihan & Sampah", fasilitas: "Fasilitas Umum"
  };
  return codeToLabel[categoryCode] || "Jalan & Infrastruktur";
};

export default function AdminPengaduanPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [prioritasFilter, setPrioritasFilter] = useState("Semua");
  
  const [editingReport, setEditingReport] = useState(null);
  const [editForm, setEditForm] = useState({
    judul: "", deskripsi: "", category_kode: "", priority: "", lokasi: ""
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reports/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) setReports(result.data || []);
    } catch (error) {
      console.error(error);
      showMessage("error", "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ✅ FUNGSI FILTER YANG BENAR
  const getFilteredReports = () => {
    return reports.filter((report) => {
      // Filter pencarian
      const matchSearch = 
        report.judul?.toLowerCase().includes(search.toLowerCase()) ||
        report.report_number?.toLowerCase().includes(search.toLowerCase()) ||
        report.user_name?.toLowerCase().includes(search.toLowerCase());
      
      // Filter status
      let matchStatus = true;
      if (statusFilter === "Pending") {
        matchStatus = report.status === "pending";
      } else if (statusFilter === "Diproses") {
        matchStatus = report.status === "diproses";
      } else if (statusFilter === "Selesai") {
        matchStatus = report.status === "selesai";
      } else if (statusFilter === "Ditolak") {
        matchStatus = report.status === "ditolak";
      }
      
      // Filter prioritas
      const matchPrioritas = prioritasFilter === "Semua" || report.priority === prioritasFilter;
      
      return matchSearch && matchStatus && matchPrioritas;
    });
  };

  // ✅ FUNGSI HITUNG TOTAL PER STATUS
  const getCountByStatus = (status) => {
    if (status === "Semua") return reports.length;
    if (status === "Pending") return reports.filter(r => r.status === "pending").length;
    if (status === "Diproses") return reports.filter(r => r.status === "diproses").length;
    if (status === "Selesai") return reports.filter(r => r.status === "selesai").length;
    if (status === "Ditolak") return reports.filter(r => r.status === "ditolak").length;
    return 0;
  };

  const filteredReports = getFilteredReports();
  
  const counts = {
    Semua: reports.length,
    Pending: reports.filter(r => r.status === "pending").length,
    Diproses: reports.filter(r => r.status === "diproses").length,
    Selesai: reports.filter(r => r.status === "selesai").length,
    Ditolak: reports.filter(r => r.status === "ditolak").length
  };

  const openEditModal = (report) => {
    setEditingReport(report);
    setEditForm({
      judul: report.judul || "",
      deskripsi: report.deskripsi || "",
      category_kode: report.category_kode || "",
      priority: report.priority || "sedang",
      lokasi: report.lokasi || ""
    });
  };

  const closeEditModal = () => {
    setEditingReport(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editingReport) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/admin/${editingReport.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      const result = await response.json();
      if (result.success) {
        showMessage("success", "Pengaduan berhasil diupdate");
        fetchReports();
        closeEditModal();
      } else {
        showMessage("error", result.message || "Gagal update");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Terjadi kesalahan");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/admin/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        showMessage("success", "Pengaduan berhasil dihapus");
        fetchReports();
      } else {
        showMessage("error", result.message || "Gagal hapus");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Terjadi kesalahan");
    }
    setDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Kelola Pengaduan" />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="w-10 h-10 text-slate-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Kelola Pengaduan" />
        <div className="flex-1">
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-8 h-16 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-slate-900">Kelola Pengaduan</h1>
              <p className="text-xs text-slate-400">{filteredReports.length} pengaduan ditemukan</p>
            </div>
          </header>

          <div className="px-8 py-6 space-y-5">
            {/* Notifikasi */}
            {message.text && (
              <div className={`fixed top-20 right-8 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
                message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}>
                {message.type === "success" ? <FaCheckCircle /> : <FaBan />}
                {message.text}
              </div>
            )}

            {/* Filter Status - 5 TOMBOL */}
            <div className="flex items-center gap-2 flex-wrap">
              {["Semua", "Pending", "Diproses", "Selesai", "Ditolak"].map((s) => (
                <button 
                  key={s} 
                  onClick={() => setStatusFilter(s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    statusFilter === s ? "bg-black text-white" : "bg-white border border-slate-200 text-black hover:border-slate-300"
                  }`}>
                  {s === "Pending" ? "Pending" : 
                   s === "Diproses" ? "Diproses" : 
                   s === "Selesai" ? "Selesai" : 
                   s === "Ditolak" ? "Ditolak" : "Semua"}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${statusFilter === s ? "bg-white/20 text-white" : "bg-slate-100 text-black"}`}>
                    {counts[s] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Search & Filter Prioritas */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input 
                  type="text" 
                  placeholder="Cari kode, judul, atau nama pelapor..."
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-black placeholder-slate-400 focus:outline-none focus:border-slate-400" 
                />
              </div>
              <div className="relative">
                <select 
                  value={prioritasFilter} 
                  onChange={(e) => setPrioritasFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-black focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="Semua">Semua Prioritas</option>
                  <option value="tinggi">Tinggi</option>
                  <option value="sedang">Sedang</option>
                  <option value="rendah">Rendah</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>
            </div>

            {/* Tabel Pengaduan */}
            <motion.div variants={stagger} initial="initial" animate="animate">
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Kode</th>
                        <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Pengaduan</th>
                        <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Kategori</th>
                        <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Prioritas</th>
                        <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Status</th>
                        <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Tanggal</th>
                        <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                            Tidak ada pengaduan yang cocok
                          </td>
                        </tr>
                      ) : (
                        filteredReports.map((item) => {
                          const categoryDisplay = getCategoryDisplay(item.category_name, item.category_kode);
                          const Icon = ICON_MAP[categoryDisplay] || ICON_MAP[item.category_kode] || FaRoad;
                          const colorClass = COLOR_MAP[categoryDisplay] || COLOR_MAP[item.category_kode] || COLOR_MAP.jalan;
                          const st = STATUS_MAP[item.status] || STATUS_MAP.pending;
                          return (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                              <td className="px-5 py-4 font-mono text-xs text-slate-400">{item.report_number}</td>
                              <td className="px-5 py-4">
                                <p className="font-semibold text-black truncate max-w-[200px]">{item.judul}</p>
                                <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.user_name} • {item.lokasi}</p>
                              </td>
                              <td className="px-5 py-4">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${colorClass}`}>
                                  <Icon className="text-sm" /><span>{categoryDisplay}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PRIORITAS_MAP[item.priority] || PRIORITAS_MAP.sedang}`}>
                                  {item.priority || "sedang"}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.pill}`}>
                                    {st.label}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-500">{formatDate(item.created_at)}</td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <Link href={`/admin/pengaduan/${item.id}`}>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-black text-xs font-medium hover:bg-slate-200 transition">
                                      Detail <FaChevronRight className="text-[10px]" />
                                    </button>
                                  </Link>
                                  <button 
                                    onClick={() => openEditModal(item)} 
                                    className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition" 
                                    title="Edit"
                                  >
                                    <FaEdit className="text-sm" />
                                  </button>
                                  <button 
                                    onClick={() => setDeleteConfirm(item)} 
                                    className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition" 
                                    title="Hapus"
                                  >
                                    <FaTrash className="text-sm" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {editingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-xl text-black">Edit Pengaduan</h2>
              <button 
                onClick={closeEditModal} 
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Kode Pengaduan</label>
                <input 
                  type="text" 
                  value={editingReport.report_number || ""} 
                  disabled 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Judul Pengaduan</label>
                <input 
                  type="text" 
                  name="judul" 
                  value={editForm.judul} 
                  onChange={handleEditChange} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-black text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Deskripsi</label>
                <textarea 
                  name="deskripsi" 
                  rows={4} 
                  value={editForm.deskripsi} 
                  onChange={handleEditChange} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-black resize-none text-black"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Kategori</label>
                  <select 
                    name="category_kode" 
                    value={editForm.category_kode} 
                    onChange={handleEditChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-black text-black"
                  >
                    {KATEGORI_OPTIONS.map((cat) => (
                      <option key={cat.kode} value={cat.kode}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Prioritas</label>
                  <select 
                    name="priority" 
                    value={editForm.priority} 
                    onChange={handleEditChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-black text-black"
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Lokasi</label>
                <input 
                  type="text" 
                  name="lokasi" 
                  value={editForm.lokasi} 
                  onChange={handleEditChange} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-black text-black"
                />
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={closeEditModal} 
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-black font-medium hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button 
                onClick={handleUpdate} 
                disabled={editLoading} 
                className="px-5 py-2.5 rounded-xl bg-black text-white font-medium flex items-center gap-2 hover:bg-slate-800 transition disabled:opacity-50"
              >
                {editLoading ? <FaSpinner className="animate-spin" /> : <FaSave />} 
                Simpan Perubahan
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white rounded-3xl w-full max-w-md mx-4"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <FaTrash className="text-2xl text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-black mb-2">Hapus Pengaduan?</h3>
              <p className="text-black text-sm mb-6">
                Apakah Anda yakin ingin menghapus pengaduan "{deleteConfirm.judul}"?<br/>
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)} 
                  className="w-full py-3 rounded-xl border border-slate-200 text-black font-medium hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm.id)} 
                  className="w-full py-3 rounded-xl font-medium text-white transition"
                  style={{ backgroundColor: "#dc2626" }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#b91c1c"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#dc2626"}
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminGuard>
  );
}