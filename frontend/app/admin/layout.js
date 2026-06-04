"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  FaHome,
  FaClipboardList,
  FaChartLine,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa"

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: <FaHome /> },
  { href: "/admin/laporan", label: "Semua Laporan", icon: <FaClipboardList /> },
  { href: "/admin/statistik", label: "Statistik", icon: <FaChartLine /> },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [adminName, setAdminName] = useState("Administrator")

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    
    if (!token) {
      router.push("/login")
    }
    
    if (user?.nama) {
      setAdminName(user.nama)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="h-20 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black to-slate-800 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
                <p className="text-sm text-slate-500">Manajemen Pengaduan</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/admin" && pathname?.startsWith(item.href))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-4">
              <button className="relative w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
                <FaBell />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-slate-800 text-white flex items-center justify-center font-semibold shadow-md">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800">{adminName}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden border-t border-slate-100 py-2 flex justify-around">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition ${
                    isActive ? "text-black" : "text-slate-500"
                  }`}
                >
                  <div className={`text-xl ${isActive ? "scale-110" : ""}`}>{item.icon}</div>
                  <span className="text-xs">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        {children}
      </main>
    </div>
  )
}