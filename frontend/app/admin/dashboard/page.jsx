"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaBell, FaClipboardList, FaClock, FaCheckCircle, FaUsers,
  FaRoad, FaLightbulb, FaLeaf, FaWater, FaTrash, FaBuilding,
  FaChevronRight, FaChartBar, FaExclamationTriangle, FaSpinner,
} from "react-icons/fa";

// ─── Shared Sidebar ───────────────────────────────────────────────────────────
export function AdminSidebar({ active }) {
  const nav = [
    { href: "/admin/dashboard",  icon: <FaChartBar />,      label: "Dashboard" },
    { href: "/admin/pengaduan",  icon: <FaClipboardList />, label: "Kelola Pengaduan" },
    { href: "/admin/pengguna",   icon: <FaUsers />,         label: "Manajemen User" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#111111] flex flex-col sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">PengaduanKu</h1>
            <p className="text-xs text-white/40">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === item.label
                ? "bg-white text-black"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center font-semibold text-sm">A</div>
          <div>
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-white/40">admin@ukk.id</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Status Mapping ───────────────────────────────────────────────────────────
const STATUS_MAP = {
  selesai:  { pill: "bg-green-100 text-green-700",  dot: "bg-green-500", label: "Selesai" },
  diproses: { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500", label: "Diproses" },
  pending:  { pill: "bg-slate-100 text-slate-600",   dot: "bg-slate-400", label: "Pending" },
  ditolak:  { pill: "bg-red-100 text-red-700",       dot: "bg-red-500", label: "Ditolak" },
};

const PRIORITAS_MAP = {
  tinggi: "bg-red-100 text-red-700",
  sedang: "bg-yellow-100 text-yellow-700",
  rendah: "bg-green-100 text-green-700",
};

const KATEGORI_ICONS = {
  jalan:      { icon: <FaRoad />, color: "text-amber-600 bg-amber-50" },
  lampu:      { icon: <FaLightbulb />, color: "text-blue-600 bg-blue-50" },
  lingkungan: { icon: <FaLeaf />, color: "text-green-600 bg-green-50" },
  air:        { icon: <FaWater />, color: "text-cyan-600 bg-cyan-50" },
  sampah:     { icon: <FaTrash />, color: "text-purple-600 bg-purple-50" },
  fasilitas:  { icon: <FaBuilding />, color: "text-red-600 bg-red-50" },
};

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
    urgent: 0,
    totalUsers: 0,
    byCategory: [],
  });
  const [recentReports, setRecentReports] = useState([]);
  const [urgentReports, setUrgentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/reports/admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.stats);
        setRecentReports(result.data.recent || []);
        setUrgentReports(result.data.urgent || []);
      } else {
        setError("Gagal mengambil data dashboard");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  const totalKategori = stats.byCategory?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

  const STATS_CARDS = [
    { 
      label: "Total Pengaduan", 
      value: formatNumber(stats.total), 
      delta: `${stats.diproses + stats.pending} sedang diproses`, 
      icon: <FaClipboardList />, 
      color: "bg-blue-50 text-blue-600", 
      border: "border-blue-100" 
    },
    { 
      label: "Sedang Diproses", 
      value: formatNumber(stats.diproses + stats.pending), 
      delta: `${stats.urgent} mendesak`, 
      icon: <FaClock />, 
      color: "bg-yellow-50 text-yellow-600", 
      border: "border-yellow-100" 
    },
    { 
      label: "Selesai", 
      value: formatNumber(stats.selesai), 
      delta: `${stats.ditolak} ditolak`, 
      icon: <FaCheckCircle />, 
      color: "bg-green-50 text-green-600", 
      border: "border-green-100" 
    },
    { 
      label: "Total Pengguna", 
      value: formatNumber(stats.totalUsers), 
      delta: "terdaftar", 
      icon: <FaUsers />, 
      color: "bg-purple-50 text-purple-600", 
      border: "border-purple-100" 
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="w-10 h-10 text-slate-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
            <FaExclamationTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <AdminSidebar active="Dashboard" />

      <div className="flex-1">

        {/* TOPBAR */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">

            {/* STAT CARDS - DATA REAL */}
            <motion.div variants={fadeUp} className="grid grid-cols-4 gap-4">
              {STATS_CARDS.map((s, i) => (
                <div key={i} className={`bg-white border ${s.border} rounded-[20px] p-5`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.delta}</p>
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-3 gap-4">

              {/* PENGADUAN PER KATEGORI - DATA REAL */}
              <motion.div variants={fadeUp} className="col-span-1 bg-white border border-slate-200 rounded-[20px] p-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Kategori</p>
                <h2 className="font-bold text-slate-800 mb-4">Sebaran Laporan</h2>
                <div className="space-y-3">
                  {stats.byCategory && stats.byCategory.length > 0 ? (
                    stats.byCategory.map((k) => {
                      const categoryIcon = KATEGORI_ICONS[k.kode] || KATEGORI_ICONS.jalan;
                      const count = k.count || 0;
                      const percent = totalKategori > 0 ? (count / totalKategori) * 100 : 0;
                      return (
                        <div key={k.kode} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${categoryIcon.color}`}>
                            {categoryIcon.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-slate-700">{k.category_name}</span>
                              <span className="text-slate-400">{count}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-slate-800 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">Belum ada data</p>
                  )}
                </div>
              </motion.div>

              {/* PENGADUAN MENDESAK - DATA REAL */}
              <motion.div variants={fadeUp} className="col-span-2 bg-white border border-slate-200 rounded-[20px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Perhatian</p>
                    <h2 className="font-bold text-slate-800">Pengaduan Mendesak</h2>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full font-semibold">
                    <FaExclamationTriangle className="text-xs" /> {stats.urgent} perlu tindakan
                  </span>
                </div>
                <div className="space-y-3">
                  {urgentReports.length > 0 ? (
                    urgentReports.map((item) => {
                      const st = STATUS_MAP[item.status] || STATUS_MAP.pending;
                      return (
                        <div key={item.id} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{item.judul}</p>
                            <p className="text-xs text-slate-400">{item.report_number} • {item.user_name}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.pill}`}>{st.label}</span>
                          <Link href={`/admin/pengaduan/${item.id}`}>
                            <button className="w-8 h-8 rounded-xl bg-white border border-red-100 flex items-center justify-center text-slate-500 hover:bg-red-100 transition">
                              <FaChevronRight className="text-xs" />
                            </button>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-8">Tidak ada pengaduan mendesak</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* TABEL PENGADUAN TERBARU - DATA REAL */}
            <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">Terbaru</p>
                  <h2 className="font-bold text-slate-800">Pengaduan Masuk</h2>
                </div>
                <Link href="/admin/pengaduan">
                  <button className="text-sm font-medium text-slate-500 hover:text-black flex items-center gap-1.5 transition">
                    Lihat Semua <FaChevronRight className="text-xs" />
                  </button>
                </Link>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Kode</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Judul</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Pelapor</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Prioritas</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-400 pb-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentReports.length > 0 ? (
                    recentReports.map((item) => {
                      const st = STATUS_MAP[item.status] || STATUS_MAP.pending;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 pr-4 font-mono text-xs text-slate-400">{item.report_number}</td>
                          <td className="py-3 pr-4">
                            <p className="font-medium text-slate-800 truncate max-w-[220px]">{item.judul}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[220px]">{item.lokasi}</p>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">{item.user_name}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PRIORITAS_MAP[item.priority]}`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.pill}`}>{st.label}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <Link href={`/admin/pengaduan/${item.id}`}>
                              <button className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition">
                                Detail
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Belum ada data pengaduan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}