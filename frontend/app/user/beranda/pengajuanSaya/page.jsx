"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaEye,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const STATUS_CONFIG = {
  Semua: { label: "Semua Pengaduan", icon: FaClipboardList, color: "bg-slate-500", bgLight: "bg-slate-50", textColor: "text-slate-600" },
  Diproses: { label: "Sedang Diproses", icon: FaClock, color: "bg-yellow-500", bgLight: "bg-yellow-50", textColor: "text-yellow-600" },
  Selesai: { label: "Selesai", icon: FaCheckCircle, color: "bg-green-500", bgLight: "bg-green-50", textColor: "text-green-600" },
  Ditolak: { label: "Ditolak", icon: FaTimesCircle, color: "bg-red-500", bgLight: "bg-red-50", textColor: "text-red-600" },
};

const STATUS_BADGE = {
  pending: { bg: "bg-slate-100", text: "text-slate-700", label: "Pending" },
  diproses: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Diproses" },
  selesai: { bg: "bg-green-100", text: "text-green-700", label: "Selesai" },
  ditolak: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
};

const PRIORITY_BADGE = {
  rendah: "bg-blue-100 text-blue-700",
  sedang: "bg-yellow-100 text-yellow-700",
  tinggi: "bg-red-100 text-red-700",
};

export default function PengajuanSayaPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  // ✅ PERBAIKAN: Pakai kurung kurawal {}, bukan kurung siku []
  const [counts, setCounts] = useState({ Semua: 0, Diproses: 0, Selesai: 0, Ditolak: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
    fetchData(activeTab, searchQuery);
  }, []);

  const fetchData = async (status, search) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams();
      if (status && status !== "Semua") params.append("status", status);
      if (search) params.append("search", search);
      
      const response = await fetch(`http://localhost:5000/api/reports/my/filter?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      
      if (result.success) {
        setReports(result.data || []);
        setCounts(result.counts || { Semua: 0, Diproses: 0, Selesai: 0, Ditolak: 0 });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab, searchQuery);
  }, [activeTab, searchQuery]);

  const getProgressWidth = (status) => {
    switch (status) {
      case "pending": return "25%";
      case "diproses": return "75%";
      case "selesai": return "100%";
      default: return "0%";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <FaSpinner className="w-10 h-10 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => router.push("/user/beranda")} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
            <FaArrowLeft className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Pengajuan Saya</h1>
            <p className="text-xs text-slate-400">Kelola dan pantau status pengaduan Anda</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 4 BUTTON NAVIGATION */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
                  isActive ? "bg-black text-white shadow-lg" : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-white/20" : config.bgLight}`}>
                    <Icon className={`text-lg ${isActive ? "text-white" : config.textColor}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isActive ? "text-white/70" : "text-slate-500"}`}>{config.label}</p>
                    <p className={`text-xl font-bold ${isActive ? "text-white" : "text-slate-800"}`}>{counts[key] || 0}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, kode, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-black"
          />
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Belum ada pengaduan</h3>
            <p className="text-slate-500 mb-6">
              {activeTab === "Semua" ? "Anda belum pernah membuat pengaduan" :
               activeTab === "Diproses" ? "Tidak ada pengaduan yang sedang diproses" :
               activeTab === "Selesai" ? "Belum ada pengaduan yang selesai" :
               "Tidak ada pengaduan yang ditolak"}
            </p>
            <Link href="/user/buatPengaduan">
              <button className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition">+ Buat Pengaduan Baru</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, index) => {
              const statusInfo = STATUS_BADGE[report.status] || STATUS_BADGE.pending;
              const priorityClass = PRIORITY_BADGE[report.priority] || PRIORITY_BADGE.sedang;
              return (
                <div key={report.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{report.report_number}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.bg} ${statusInfo.text}`}>{statusInfo.label}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityClass}`}>Prioritas {report.priority}</span>
                        <span className="text-xs text-slate-400">{formatDate(report.created_at)}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-1">{report.judul}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{report.deskripsi}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span className="capitalize">Kategori: {report.category_name}</span>
                        <span>Lokasi: {report.lokasi}</span>
                      </div>
                    </div>
                    <Link href={`/user/detail/${report.id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition">
                        <FaEye className="text-sm" /> Lihat Detail
                      </button>
                    </Link>
                  </div>

                  {["pending", "diproses"].includes(report.status) && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span>Diterima</span><span>Ditinjau</span><span>Dikerjakan</span><span>Selesai</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: getProgressWidth(report.status) }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}