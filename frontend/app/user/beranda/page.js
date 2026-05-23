"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaPlus,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaBell,
  FaChevronRight,
  FaRoad,
  FaLightbulb,
  FaLeaf,
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
  {
    value: "1.2K",
    label: "Total Pengaduan",
  },
  {
    value: "340",
    label: "Selesai Ditangani",
  },
  {
    value: "48j",
    label: "Rata-rata Respons",
  },
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
    icon: <FaClipboardList />,
    title: "Pengajuan Saya",
    desc: "Lihat semua laporan",
  },
  {
    icon: <FaClock />,
    title: "Sedang Diproses",
    desc: "Pantau perkembangan",
  },
  {
    icon: <FaCheckCircle />,
    title: "Pengajuan Selesai",
    desc: "Riwayat terselesaikan",
  },
]

const PENGAJUAN = [
  {
    title: "Pengajuan Perbaikan Jalan",
    id: "ADU-7F2K1A",
    date: "20 Mei 2026",
    status: "Diproses",
    icon: <FaRoad />,
  },
  {
    title: "Pengajuan Lampu Jalan",
    id: "ADU-3B9M2C",
    date: "17 Mei 2026",
    status: "Selesai",
    icon: <FaLightbulb />,
  },
  {
    title: "Pengajuan Kebersihan Lingkungan",
    id: "ADU-1X4P8D",
    date: "12 Mei 2026",
    status: "Pending",
    icon: <FaLeaf />,
  },
]

const STATUS_MAP = {
  Selesai: {
    pill: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },

  Diproses: {
    pill: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },

  Pending: {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
}

export default function UserBerandaPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setMounted(true)

    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-black flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                P
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                PengaduanKu
              </h1>

              <p className="text-sm text-slate-400">
                Portal Pengaduan Masyarakat
              </p>
            </div>

          </div>

          {/* USER */}
          <div className="flex items-center gap-4">

            <button className="relative w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
              <FaBell />

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black" />
            </button>

            <div className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-2xl">

              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-semibold">
                {user?.username
                  ? user.username.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.username || "User"}
                </p>

                <p className="text-xs text-slate-400">
                  Masyarakat
                </p>
              </div>

            </div>

          </div>

        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >

          {/* HERO */}
          <motion.div variants={fadeUp}>
            <div className="bg-[#111111] rounded-[30px] px-8 py-8 relative overflow-hidden">

              <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] rounded-full border border-white/5" />

              <div className="relative z-10 flex items-center justify-between gap-8">

                {/* LEFT */}
                <div className="max-w-2xl">

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-5">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />

                    <span className="text-sm text-white/70">
                      Portal Pengaduan Masyarakat
                    </span>
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

                {/* STATS */}
                <div className="hidden lg:flex flex-col gap-3 w-[200px]">

                  {STATS.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4"
                    >

                      <h2 className="text-2xl font-bold text-white">
                        {item.value}
                      </h2>

                      <p className="text-xs text-white/40 mt-1">
                        {item.label}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

            </div>
          </motion.div>

          {/* MENU */}
          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

              {MENU.map((item, index) => (
                <Link
                  key={index}
                  href={item.href || "#"}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`rounded-[28px] border p-5 transition-all ${
                      item.primary
                        ? "bg-black text-white border-black"
                        : "bg-white border-slate-200"
                    }`}
                  >

                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                        item.primary
                          ? "bg-white/10 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <h3
                      className={`mt-5 font-bold text-lg ${
                        item.primary
                          ? "text-white"
                          : "text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`text-sm mt-1 ${
                        item.primary
                          ? "text-white/60"
                          : "text-slate-400"
                      }`}
                    >
                      {item.desc}
                    </p>

                  </motion.div>
                </Link>
              ))}

            </div>
          </motion.div>

          {/* PENGAJUAN */}
          <motion.div variants={fadeUp}>

            <div className="bg-white rounded-[30px] border border-slate-200 p-6">

              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
                    Riwayat Pengajuan
                  </p>

                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    Pengajuan Saya
                  </h2>

                </div>

                <button className="text-sm font-medium text-slate-500 hover:text-black flex items-center gap-2">
                  Lihat Semua
                  <FaChevronRight className="text-xs" />
                </button>

              </div>

              {/* LIST */}
              <div className="space-y-4">

                {PENGAJUAN.map((item, index) => {

                  const status = STATUS_MAP[item.status]

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white transition"
                    >

                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                        {item.icon}
                      </div>

                      {/* TEXT */}
                      <div className="flex-1 min-w-0">

                        <h3 className="font-semibold text-slate-800 truncate">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">

                          <span className="font-mono">
                            {item.id}
                          </span>

                          <span>•</span>

                          <span>
                            {item.date}
                          </span>

                        </div>

                      </div>

                      {/* STATUS */}
                      <div className="flex items-center gap-2">

                        <div
                          className={`w-2 h-2 rounded-full ${status.dot}`}
                        />

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${status.pill}`}
                        >
                          {item.status}
                        </span>

                      </div>

                      <FaChevronRight className="text-slate-400 text-sm" />

                    </motion.div>
                  )
                })}

              </div>

            </div>

          </motion.div>

        </motion.div>

      </div>

    </div>
  )
}