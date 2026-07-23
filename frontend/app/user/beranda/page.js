"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaBell,
  FaChevronRight,
  FaFileAlt,
  FaTimes,
  FaSpinner,
  FaInfoCircle,
  FaRoad,
  FaLightbulb,
  FaLeaf,
  FaWater,
  FaTrash,
  FaBuilding,
} from "react-icons/fa";

// ─── Animation variants ───────────────────────────────────────────────────────

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const MENU = [
  {
    href: "/user/buatPengaduan",
    icon: <FaPlus />,
    title: "Buat Pengajuan",
    desc: "Laporkan masalah baru",
    primary: true,
  },
  {
    href: "/user/beranda/pengajuanSaya",
    icon: <FaClipboardList />,
    title: "Pengajuan Saya",
    desc: "Lihat semua laporan",
  },
  {
    href: "/user/beranda/sedangDiproses",
    icon: <FaClock />,
    title: "Sedang Diproses",
    desc: "Pantau perkembangan",
  },
  {
    href: "/user/beranda/pengajuanSelesai",
    icon: <FaCheckCircle />,
    title: "Pengajuan Selesai",
    desc: "Riwayat terselesaikan",
  },
];

const STATUS_MAP = {
  selesai: { pill: "bg-green-100 text-black", dot: "bg-green-500", label: "Selesai" },
  diproses: { pill: "bg-yellow-100 text-black", dot: "bg-yellow-500", label: "Diproses" },
  pending: { pill: "bg-slate-100 text-black", dot: "bg-slate-400", label: "Pending" },
  ditolak: { pill: "bg-red-100 text-black", dot: "bg-red-500", label: "Ditolak" },
};

// ✅ KATEGORI UNTUK PANDUAN - TEKS HITAM
const CATEGORIES = [
  { icon: <FaRoad />, label: "Jalan & Infrastruktur", color: "bg-amber-100 text-black" },
  { icon: <FaLightbulb />, label: "Penerangan Jalan", color: "bg-blue-100 text-black" },
  { icon: <FaLeaf />, label: "Lingkungan & Taman", color: "bg-green-100 text-black" },
  { icon: <FaWater />, label: "Drainase & Air", color: "bg-cyan-100 text-black" },
  { icon: <FaTrash />, label: "Kebersihan & Sampah", color: "bg-purple-100 text-black" },
  { icon: <FaBuilding />, label: "Fasilitas Umum", color: "bg-red-100 text-black" },
];

// ✅ ONBOARDING STEPS - TEKS HITAM SEMUA
const ONBOARDING_STEPS = [
  {
    icon: <FaClipboardList />,
    title: "Selamat datang! 👋",
    desc: "Portal pengaduan masyarakat yang memudahkan Anda melaporkan masalah fasilitas umum.",
    hint: "Klik 'Lanjut' untuk mempelajari cara penggunaan.",
  },
  {
    icon: <FaPlus />,
    title: "Buat Pengajuan",
    desc: 'Klik tombol "Buat Pengajuan" untuk melaporkan masalah. Isi judul, deskripsi, kategori, dan lampirkan foto.',
    hint: "Pastikan data yang diisi lengkap agar cepat diproses.",
  },
  {
    icon: <FaClock />,
    title: "Pantau Status",
    desc: 'Lihat perkembangan pengajuan di menu "Sedang Diproses" atau "Pengajuan Saya".',
    hint: "Status berubah: Pending → Diproses → Selesai.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Siap Digunakan! 🎉",
    desc: "Anda sudah siap menggunakan PengaduanKu. Mulai buat pengajuan sekarang!",
    hint: "Panduan ini tidak akan muncul lagi.",
  },
];

// ─── KATEGORI CARD UNTUK PANDUAN ─────────────────────────────────────────────

function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIES.map((cat, idx) => (
        <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${cat.color}`}>
          <span className="text-sm">{cat.icon}</span>
          <span className="text-xs font-medium truncate">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── ONBOARDING OVERLAY (PERSEGI) ────────────────────────────────────────────

function OnboardingOverlay({ onClose }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key="ob-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          key="ob-card"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="bg-black px-6 pt-6 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-white text-sm">{current.icon}</span>
              </div>
              <span className="text-xs text-white/50">Langkah {step + 1}/{ONBOARDING_STEPS.length}</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{current.title}</h2>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-black text-sm leading-relaxed mb-4">{current.desc}</p>
            
            {step === 1 && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-black mb-2">📂 Kategori yang tersedia:</p>
                <CategoryGrid />
              </div>
            )}
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 flex items-start gap-2">
              <span className="text-amber-600 text-sm">💡</span>
              <span className="text-xs text-black">{current.hint}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 pb-6 gap-3">
            <button 
              onClick={onClose} 
              className="text-xs text-black/60 hover:text-black transition px-3 py-2"
            >
              Lewati
            </button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button 
                  onClick={() => setStep(step - 1)} 
                  className="px-4 py-2 rounded-lg border border-slate-300 text-black text-sm font-medium hover:bg-slate-50 transition"
                >
                  Kembali
                </button>
              )}
              <button 
                onClick={() => (isLast ? onClose() : setStep(step + 1))} 
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-800 transition"
              >
                {isLast ? "Selesai" : "Lanjut"}
                {!isLast && <FaChevronRight className="text-xs" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function UserBerandaPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [pengajuan, setPengajuan] = useState([]);
  const [stats, setStats] = useState({ total: 0, diproses: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const seen = localStorage.getItem("onboarding_seen");
    if (!seen) {
      setShowOnboarding(true);
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const profileRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      if (profileRes.ok) {
        setUser(profileData.user);
        localStorage.setItem("user", JSON.stringify(profileData.user));
      } else {
        throw new Error("Session expired");
      }

      const reportsRes = await fetch("http://localhost:5000/api/reports/my/filter?status=Semua", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reportsData = await reportsRes.json();
      
      if (reportsData.success) {
        setPengajuan(reportsData.data?.slice(0, 3) || []);
        setStats({
          total: reportsData.counts?.Semua || 0,
          diproses: reportsData.counts?.Diproses || 0,
          selesai: reportsData.counts?.Selesai || 0,
        });
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboarding_seen", "true");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center">
        <FaSpinner className="w-10 h-10 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {showOnboarding && <OnboardingOverlay onClose={handleCloseOnboarding} />}

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">PengaduanKu</h1>
              <p className="text-sm text-black/50">Portal Pengaduan Masyarakat</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-black hover:bg-slate-200 transition">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black" />
            </button>

            <div className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-2xl">
              <Link href="/user/profil">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-semibold cursor-pointer hover:scale-105 transition-transform">
                  {user?.nama ? user.nama.charAt(0).toUpperCase() : "U"}
                </div>
              </Link>
              <div className="leading-tight">
                <Link href="/user/profil">
                  <p className="text-sm font-semibold text-black hover:underline cursor-pointer">
                    {user?.nama || "User"}
                  </p>
                </Link>
                <p className="text-xs text-black/50">Masyarakat</p>
              </div>
              
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  router.push("/login");
                }}
                className="ml-3 px-4 py-2 rounded-xl bg-black text-white text-xs font-medium hover:bg-slate-800 transition"
              >
                Logout
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">

          {/* ── HERO ── */}
          <motion.div variants={fadeUp}>
            <div className="bg-black rounded-3xl px-8 py-8 relative overflow-hidden">
              <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] rounded-full border border-white/5" />

              <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-5">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-sm text-white/70">Selamat Datang, {user?.nama || "User"}!</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Sampaikan
                    <br />
                    Pengajuan Anda
                  </h1>

                  <p className="text-white/50 text-sm max-w-xl mt-4">
                    Laporkan permasalahan fasilitas umum secara online dengan cepat dan mudah.
                  </p>

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <Link href="/user/buatPengaduan">
                      <button className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all">
                        <FaPlus className="text-sm" />
                        Buat Pengajuan
                      </button>
                    </Link>

                    <button onClick={() => setShowOnboarding(true)} className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/20 text-white/70 text-sm hover:bg-white/10 transition">
                      Lihat Panduan
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 min-w-[100px] text-center">
                    <h2 className="text-2xl font-bold text-white">{stats.total}</h2>
                    <p className="text-xs text-white/40 mt-1">Total</p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 min-w-[100px] text-center">
                    <h2 className="text-2xl font-bold text-white">{stats.diproses}</h2>
                    <p className="text-xs text-white/40 mt-1">Diproses</p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 min-w-[100px] text-center">
                    <h2 className="text-2xl font-bold text-white">{stats.selesai}</h2>
                    <p className="text-xs text-white/40 mt-1">Selesai</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── 4 MENU CARDS ── */}
          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MENU.map((item, index) => (
                <Link key={index} href={item.href}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
                      item.primary
                        ? "bg-black border-black hover:bg-slate-800 hover:shadow-lg"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                      item.primary ? "bg-white/10 text-white" : "bg-slate-100 text-black"
                    }`}>
                      {item.icon}
                    </div>
                    <h3 className={`mt-4 font-bold text-base ${item.primary ? "text-white" : "text-black"}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs mt-1 ${item.primary ? "text-white/60" : "text-black/50"}`}>
                      {item.desc}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* ── RIWAYAT PENGAJUAN ── */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-3xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-black/50">Riwayat</p>
                  <h2 className="text-xl font-bold text-black mt-1">Pengajuan Saya</h2>
                </div>
                {pengajuan.length > 0 && (
                  <Link href="/user/beranda/pengajuanSaya">
                    <button className="text-sm font-medium text-black/60 hover:text-black flex items-center gap-2 transition">
                      Lihat Semua <FaChevronRight className="text-xs" />
                    </button>
                  </Link>
                )}
              </div>

              {pengajuan.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <FaFileAlt className="text-black/40 text-2xl" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-black">Belum ada pengajuan</p>
                    <p className="text-sm text-black/50 mt-1">Pengajuan Anda akan muncul di sini</p>
                  </div>
                  <Link href="/user/buatPengaduan">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-slate-800 transition">
                      <FaPlus className="text-xs" /> Buat Pengajuan
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {pengajuan.map((item, index) => {
                    const status = STATUS_MAP[item.status] || STATUS_MAP.pending;
                    return (
                      <Link key={item.id || index} href={`/user/detail/${item.id}`}>
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-white hover:border-slate-300 transition cursor-pointer">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-black flex-shrink-0">
                            <FaFileAlt />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-black text-sm truncate">{item.judul}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-black/50">
                              <span className="font-mono">{item.report_number}</span>
                              <span>•</span>
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.pill}`}>{status.label}</span>
                          </div>
                          <FaChevronRight className="text-black/40 text-xs flex-shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Info Bantuan */}
          <motion.div variants={fadeUp}>
            <div className="bg-blue-100 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <FaInfoCircle className="text-blue-700 text-base flex-shrink-0" />
              <p className="text-sm text-black">
                💡 Butuh bantuan? Hubungi <strong>admin@ukk.id</strong>
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
}