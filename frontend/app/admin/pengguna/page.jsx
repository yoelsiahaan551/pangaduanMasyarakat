"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUserPlus, FaEye, FaBan, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { AdminSidebar } from "../dashboard/page";

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700", "bg-pink-100 text-pink-700", "bg-cyan-100 text-cyan-700"
];

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) setUsers(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.nama?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Semua" || 
                        (filter === "Aktif" && u.status === "aktif") ||
                        (filter === "Nonaktif" && u.status === "nonaktif") ||
                        (filter === "Admin" && u.role === "admin");
    return matchSearch && matchFilter;
  });

  const counts = {
    Semua: users.length,
    Aktif: users.filter(u => u.status === "aktif").length,
    Nonaktif: users.filter(u => u.status === "nonaktif").length,
    Admin: users.filter(u => u.role === "admin").length
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Manajemen User" />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="w-10 h-10 text-slate-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <AdminSidebar active="Manajemen User" />

      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-900">Manajemen Pengguna</h1>
            <p className="text-xs text-slate-400">{filtered.length} pengguna ditemukan</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-slate-800 transition">
            <FaUserPlus className="text-xs" /> Tambah User
          </button>
        </header>

        <div className="px-8 py-6 space-y-5">
          {/* STAT STRIP */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Pengguna", value: users.length, bg: "bg-white", accent: "text-slate-800" },
              { label: "Aktif", value: users.filter(u => u.status === "aktif").length, bg: "bg-green-50", accent: "text-green-700" },
              { label: "Nonaktif", value: users.filter(u => u.status === "nonaktif").length, bg: "bg-red-50", accent: "text-red-700" },
              { label: "Admin", value: users.filter(u => u.role === "admin").length, bg: "bg-purple-50", accent: "text-purple-700" }
            ].map((s, i) => (
              <div key={i} className={`${s.bg} border border-slate-200 rounded-2xl p-4`}>
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* FILTER TABS + SEARCH */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {["Semua", "Aktif", "Nonaktif", "Admin"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === f ? "bg-black text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {f}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {counts[f]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* USER TABLE */}
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Pengguna</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Kontak</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Role</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Bergabung</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3.5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-slate-400">Tidak ada data</td></tr>
                  ) : (
                    filtered.map((user, i) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                              {user.nama?.charAt(0) || "U"}
                            </div>
                            <p className="font-semibold text-slate-800">{user.nama}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700 text-xs">{user.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${user.status === "aktif" ? "bg-green-500" : "bg-red-400"}`} />
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${user.status === "aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {user.status || "aktif"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{formatDate(user.created_at)}</td>
                        <td className="px-5 py-4">
                          <button className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition text-xs">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
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