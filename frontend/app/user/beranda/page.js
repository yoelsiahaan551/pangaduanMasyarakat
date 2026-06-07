"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FaPlus,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaBell,
  FaChevronRight,
  FaFileAlt,
} from "react-icons/fa"

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fadeUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

const STATS = [
  { value: "1.2K", label: "Total Pengaduan"  },
  { value: "340",  label: "Selesai Ditangani" },
  { value: "48j",  label: "Rata-rata Respons" },
]

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
]

const STATUS_MAP = {
  Selesai:  { pill: "bg-green-100 text-green-700",   dot: "bg-green-500"  },
  Diproses: { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  Pending:  { pill: "bg-slate-100 text-slate-600",   dot: "bg-slate-400"  },
}

export default function UserBerandaPage() {
  const router = useRouter()

  const [mounted, setMounted]     = useState(false)
  const [user, setUser]           = useState(null)
  const [pengajuan, setPengajuan] = useState([])

  useEffect(() => {
    setMounted(true)

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const getProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (response.ok) {
          setUser(data.user)
          localStorage.setItem("user", JSON.stringify(data.user))
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          router.push("/login")
        }
      } catch (error) {
        console.log(error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }
    }

    const getPengajuan = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pengaduan/saya", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (response.ok) {
          setPengajuan(data.pengaduan?.slice(0, 3) || [])
        }
      } catch (error) {
        console.log(error)
      }
    }

    getProfile()
    getPengajuan()
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">PengaduanKu</h1>
              <p className="text-sm text-slate-400">Portal Pengaduan Masyarakat</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
              <FaBell />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black" />
            </button>

            <div className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-semibold">
                {user?.nama ? user.nama.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-800">{user?.nama || "User"}</p>
                <p className="text-xs text-slate-400">Masyarakat</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
                  router.push("/login")
                }}
                className="ml-3 px-4 py-2 rounded-xl bg-black text-white text-xs font-medium hover:bg-slate-800 transition"
              >
                Logout
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">

          {/* HERO */}
          <motion.div variants={fadeUp}>
            <div className="bg-[#111111] rounded-[30px] px-8 py-8 relative overflow-hidden">
              <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] rounded-full border border-white/5" />

              <div className="relative z-10 flex items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-5">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-sm text-white/70">Portal Pengaduan Masyarakat</span>
                  </div>

                  <h1
                    className="text-4xl md:text-5xl font-bold text-white leading-[1.05]"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    Sampaikan
                    <br />
                    Pengajuan Anda
                    <br />
                    Dengan Mudah
                  </h1>

                  <p className="text-white/50 text-sm leading-relaxed max-w-xl mt-4">
                    Laporkan permasalahan fasilitas umum dan pelayanan
                    masyarakat secara online dengan cepat dan mudah.
                  </p>

                  <Link href="/user/buatPengaduan">
                    <button className="mt-5 flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all">
                      <FaPlus className="text-sm" />
                      Buat Pengajuan
                    </button>
                  </Link>
                </div>

                <div className="hidden lg:flex flex-col gap-3 w-[200px]">
                  {STATS.map((item, index) => (
                    <div key={index} className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4">
                      <h2 className="text-2xl font-bold text-white">{item.value}</h2>
                      <p className="text-xs text-white/40 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4 BUTTON MENU */}
          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {MENU.map((item, index) => (
                <Link key={index} href={item.href}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`rounded-[28px] border p-5 transition-all duration-200 cursor-pointer ${
                      item.primary
                        ? "bg-black border-black hover:bg-slate-800 hover:shadow-lg"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {/* ICON */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                        item.primary
                          ? "bg-white/10 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* TITLE */}
                    <h3
                      className={`mt-5 font-bold text-lg ${
                        item.primary ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h3>

                    {/* DESC */}
                    <p
                      className={`text-sm mt-1 ${
                        item.primary ? "text-white/60" : "text-slate-400"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* RIWAYAT PENGAJUAN */}
          <motion.div variants={fadeUp}>
            <div className="bg-white rounded-[30px] border border-slate-200 p-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
                    Riwayat Pengajuan
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    Pengajuan Saya
                  </h2>
                </div>

                {pengajuan.length > 0 && (
                  <Link href="/user/beranda/pengajuanSaya">
                    <button className="text-sm font-medium text-slate-500 hover:text-black flex items-center gap-2 transition">
                      Lihat Semua
                      <FaChevronRight className="text-xs" />
                    </button>
                  </Link>
                )}
              </div>

              {/* KOSONG */}
              {pengajuan.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <FaFileAlt className="text-slate-400 text-2xl" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-700">Belum ada pengajuan</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Pengajuan yang Anda buat akan muncul di sini
                    </p>
                  </div>
                  <Link href="/user/buatPengaduan">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black text-white text-sm font-semibold hover:bg-slate-800 transition">
                      <FaPlus className="text-xs" />
                      Buat Pengajuan Pertama
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {pengajuan.map((item, index) => {
                    const status = STATUS_MAP[item.status] ?? STATUS_MAP["Pending"]
                    return (
                      <motion.div
                        key={item._id || index}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white hover:border-slate-300 transition cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                          <FaFileAlt />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {item.judul}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                            <span className="font-mono">
                              {item.kodeAduan || item._id?.slice(-8).toUpperCase()}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.pill}`}>
                            {item.status ?? "Pending"}
                          </span>
                        </div>

                        <FaChevronRight className="text-slate-400 text-sm flex-shrink-0" />
                      </motion.div>
                    )
                  })}
                </div>
              )}

            </div>
          </motion.div>

        </motion.div>
      </div>

    </div>
  )
}