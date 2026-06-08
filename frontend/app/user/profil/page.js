"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function UserProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        if (response.ok && result.success) {
          setUser(result.user);
          localStorage.setItem("user", JSON.stringify(result.user));
        } else {
          setError("Gagal mengambil data profil");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleBack = () => router.back();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const getInitial = (nama) => nama?.charAt(0).toUpperCase() || "U";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center">
        <FaSpinner className="w-10 h-10 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-[28px] p-8 text-center max-w-sm w-full">
          <p className="text-slate-700 font-semibold mb-1">Terjadi Masalah</p>
          <p className="text-slate-400 text-sm mb-5">{error || "User tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/user/beranda")}
            className="px-5 py-2.5 bg-black text-white rounded-2xl text-sm font-semibold hover:bg-slate-800 transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Profil Saya</h1>
            <p className="text-sm text-slate-400">Informasi akun Anda</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6 max-w-2xl mx-auto">

          {/* HERO CARD — center layout, lebih tinggi */}
          <motion.div variants={fadeUp}>
            <div className="bg-[#111111] rounded-[30px] px-8 py-12 relative overflow-hidden text-center">
              {/* Dekorasi */}
              <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute bottom-[-60px] left-[-60px] w-[180px] h-[180px] rounded-full border border-white/5 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-sm text-white/70">Portal Pengaduan Masyarakat</span>
                </div>

                {/* Avatar */}
                <div className="w-24 h-24 rounded-[24px] bg-white text-black flex items-center justify-center text-4xl font-bold shadow-2xl mb-5">
                  {getInitial(user.nama)}
                </div>

                {/* Nama & Role */}
                <h2 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  {user.nama}
                </h2>
                <p className="text-white/50 text-sm mt-2">
                  {user.role === "admin" ? "Administrator" : "Masyarakat"}
                </p>

                {/* Status badge */}
                <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-white/70 font-medium">Akun Aktif</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INFO CARD */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-[30px] border border-slate-200 p-6 space-y-3">
              <div className="mb-4">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">Detail Akun</p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">Informasi Profil</h2>
              </div>

              <InfoRow icon={FaUser}        label="Nama Lengkap"   value={user.nama} />
              <InfoRow icon={FaEnvelope}    label="Email"          value={user.email} />
              <InfoRow icon={FaCalendarAlt} label="Bergabung Sejak" value={formatDate(user.created_at)} />

              {/* Status — custom render */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status Akun</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="font-semibold text-slate-800">Aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INFO BANTUAN */}
          <motion.div variants={fadeUp}>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
              <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Akun Anda dalam status aktif. Jika ada masalah, hubungi admin di{" "}
                <strong>admin@ukk.id</strong>
              </p>
            </div>
          </motion.div>

          {/* TOMBOL KEMBALI */}
          <motion.div variants={fadeUp}>
            <button
              onClick={handleBack}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-black text-white text-sm font-semibold hover:bg-slate-800 transition-all"
            >
              <FaArrowLeft className="text-xs" />
              Kembali
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}