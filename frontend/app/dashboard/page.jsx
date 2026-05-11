"use client"

import {
  FaChartBar,
  FaClipboardList,
  FaComments,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
  FaPlusCircle
} from "react-icons/fa"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import { motion } from "framer-motion"

const dataLaporan = [
  { hari: "Sen", laporan: 4 },
  { hari: "Sel", laporan: 7 },
  { hari: "Rab", laporan: 3 },
  { hari: "Kam", laporan: 10 },
  { hari: "Jum", laporan: 8 },
  { hari: "Sab", laporan: 12 },
  { hari: "Min", laporan: 5 }
]

export default function DashboardPage() {

  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="min-h-screen flex bg-[#eef3ff]">

      {/* SIDEBAR */}
      <div className="w-[280px] bg-white shadow-xl p-6 flex flex-col justify-between">

        <div>

          {/* LOGO */}
          <div className="mb-10">

            <h1 className="text-3xl font-semibold text-[#4f7cff]">
              PengaduanKu
            </h1>

            <p className="text-slate-400 mt-1">
              Sistem Pengaduan Masyarakat
            </p>

          </div>

          {/* PROFILE */}
          <div className="bg-[#f5f8ff] rounded-3xl p-5 mb-8">

            <div className="w-16 h-16 rounded-full bg-[#5b86ff] flex items-center justify-center text-white text-2xl font-semibold">
              {
                user?.username?.charAt(0).toUpperCase()
              }
            </div>

            <h2 className="mt-4 text-xl text-slate-700 font-medium">
              {user?.username || "Administrator"}
            </h2>

            <p className="text-slate-400">
              {user?.role || "Admin"}
            </p>

          </div>

          {/* MENU */}
          <div className="space-y-3">

            <SidebarItem
              icon={<FaHome />}
              title="Dashboard"
              active
            />

            <SidebarItem
              icon={<FaClipboardList />}
              title="Data Laporan"
            />

            <SidebarItem
              icon={<FaPlusCircle />}
              title="Tambah Laporan"
            />

            <SidebarItem
              icon={<FaComments />}
              title="Komentar"
            />

            <SidebarItem
              icon={<FaUsers />}
              title="Users"
            />

            <SidebarItem
              icon={<FaUserShield />}
              title="Admin Panel"
            />

          </div>
        </div>

        {/* LOGOUT */}
        <button
          className="
            flex
            items-center
            gap-4
            bg-red-500
            hover:bg-red-600
            transition-all
            text-white
            p-4
            rounded-2xl
          "
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-semibold text-slate-800">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Monitoring laporan pengaduan masyarakat
            </p>

          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow">
            <p className="text-slate-500">
              Total Hari Ini
            </p>

            <h1 className="text-2xl font-semibold text-[#5b86ff]">
              12 Laporan
            </h1>
          </div>

        </div>

        {/* CARD */}
        <div className="grid grid-cols-4 gap-6 mb-8">

          <DashboardCard
            title="Total Laporan"
            total="120"
            icon={<FaClipboardList />}
            color="bg-blue-500"
          />

          <DashboardCard
            title="Pending"
            total="25"
            icon={<FaClock />}
            color="bg-yellow-500"
          />

          <DashboardCard
            title="Approved"
            total="80"
            icon={<FaCheckCircle />}
            color="bg-green-500"
          />

          <DashboardCard
            title="Rejected"
            total="15"
            icon={<FaTimesCircle />}n
            color="bg-red-500"
          />

        </div>

        {/* CHART */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white
            p-8
            rounded-[35px]
            shadow-lg
          "
        >

          <div className="flex items-center gap-3 mb-8">

            <div className="bg-[#eef3ff] p-4 rounded-2xl text-[#5b86ff] text-2xl">
              <FaChartBar />
            </div>

            <div>

              <h1 className="text-2xl font-semibold text-slate-800">
                Grafik Laporan Harian
              </h1>

              <p className="text-slate-400">
                Jumlah laporan masyarakat setiap hari
              </p>

            </div>

          </div>

          <div className="w-full h-[400px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={dataLaporan}>

                <XAxis dataKey="hari" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="laporan"
                  radius={[12, 12, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

      </div>
    </div>
  )
}

function SidebarItem({
  icon,
  title,
  active
}) {
  return (
    <button
      className={`
        flex
        items-center
        gap-4
        w-full
        p-4
        rounded-2xl
        transition-all
        ${
          active
          ? "bg-[#5b86ff] text-white shadow-lg"
          : "hover:bg-[#eef3ff] text-slate-600"
        }
      `}
    >

      <div className="text-xl">
        {icon}
      </div>

      <span className="text-base">
        {title}
      </span>

    </button>
  )
}

function DashboardCard({
  title,
  total,
  icon,
  color
}) {
  return (
    <motion.div
      whileHover={{
        y: -5
      }}
      className="
        bg-white
        p-6
        rounded-[30px]
        shadow-lg
      "
    >

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 mb-2">
            {title}
          </p>

          <h1 className="text-4xl font-semibold text-slate-800">
            {total}
          </h1>

        </div>

        <div className={`
          ${color}
          w-16
          h-16
          rounded-2xl
          flex
          items-center
          justify-center
          text-white
          text-2xl
        `}>
          {icon}
        </div>

      </div>
    </motion.div>
  )
}