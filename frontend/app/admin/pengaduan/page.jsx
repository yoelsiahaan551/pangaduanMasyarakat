"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaSearch, FaChevronRight, FaChevronDown, FaSpinner,
  FaRoad, FaLightbulb, FaLeaf, FaWater, FaTrash, FaBuilding,
} from "react-icons/fa";
import { AdminSidebar } from "../dashboard/page";
import AdminGuard from "@/components/AdminGuard";

const ICON_MAP = {
  jalan: FaRoad, lampu: FaLightbulb, lingkungan: FaLeaf, 
  air: FaWater, sampah: FaTrash, fasilitas: FaBuilding
};

const COLOR_MAP = {
  jalan: "text-amber-600 bg-amber-50",
  lampu: "text-blue-600 bg-blue-50",
  lingkungan: "text-green-600 bg-green-50",
  air: "text-cyan-600 bg-cyan-50",
  sampah: "text-purple-600 bg-purple-50",
  fasilitas: "text-red-600 bg-red-50"
};

const STATUS_MAP = {
  selesai: { pill: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Selesai" },
  diproses: { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500", label: "Diproses" },
  pending: { pill: "bg-slate-100 text-slate-600", dot: "bg-slate-400", label: "Pending" },
  ditolak: { pill: "bg-red-100 text-red-700", dot: "bg-red-500", label: "Ditolak" }
};

const PRIORITAS_MAP = {
  tinggi: "bg-red-100 text-red-700",
  sedang: "bg-yellow-100 text-yellow-700",
  rendah: "bg-green-100 text-green-700"
};

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function AdminPengaduanPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");
  const [prioritas, setPrioritas] = useState("Semua");

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
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter((p) => {
    const matchSearch = p.judul?.toLowerCase().includes(search.toLowerCase()) ||
                        p.report_number?.toLowerCase().includes(search.toLowerCase()) ||
                        p.user_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "Semua" || 
                        (status === "Diproses" && (p.status === "pending" || p.status === "diproses")) ||
                        (status !== "Diproses" && p.status === status.toLowerCase());
    const matchPrioritas = prioritas === "Semua" || p.priority === prioritas;
    return matchSearch && matchStatus && matchPrioritas;
  });

  const counts = {
    Semua: reports.length,
    Pending: reports.filter(p => p.status === "pending").length,
    Diproses: reports.filter(p => p.status === "diproses").length,
    Selesai: reports.filter(p => p.status === "selesai").length
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
              <p className="text-xs text-slate-400">{filtered.length} pengaduan ditemukan</p>
            </div>
          </header>

          <div className="px-8 py-6 space-y-5">
            <div className="flex items-center gap-2">
              {["Semua", "Pending", "Diproses", "Selesai"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    status === s ? "bg-black text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${status === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {counts[s] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Cari kode, judul, atau nama pelapor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
              </div>
              <div className="relative">
                <select
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="Semua">Semua Prioritas</option>
                  <option value="tinggi">Tinggi</option>
                  <option value="sedang">Sedang</option>
                  <option value="rendah">Rendah</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>
            </div>

            <motion.div variants={stagger} initial="initial" animate="animate">
              <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden">
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
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                          Tidak ada pengaduan yang cocok
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => {
                        const Icon = ICON_MAP[item.category_kode] || FaRoad;
                        const st = STATUS_MAP[item.status] || STATUS_MAP.pending;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50 transition">
                            <td className="px-5 py-4 font-mono text-xs text-slate-400">{item.report_number}</td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-800 truncate max-w-[200px]">{item.judul}</p>
                              <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.user_name} • {item.lokasi}</p>
                            </td>
                            <td className="px-5 py-4">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ${COLOR_MAP[item.category_kode] || COLOR_MAP.jalan}`}>
                                <Icon className="text-xs" />
                                <span className="capitalize">{item.category_name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PRIORITAS_MAP[item.priority]}`}>
                                {item.priority}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.pill}`}>{st.label}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-500">{formatDate(item.created_at)}</td>
                            <td className="px-5 py-4">
                              <Link href={`/admin/pengaduan/${item.id}`}>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition">
                                  Detail <FaChevronRight className="text-[10px]" />
                                </button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}