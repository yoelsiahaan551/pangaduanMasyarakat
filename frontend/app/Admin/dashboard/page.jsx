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

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null

  return (
    <div className="
      min-h-screen
      bg-[#f5f7fb]
      flex
    ">

      {/* SIDEBAR */}
      <aside className="
        w-[280px]
        bg-white
        border-r
        border-[#e9edf5]
        px-6
        py-8
        flex
        flex-col
        justify-between
      ">

        <div>

          {/* LOGO */}
          <div className="mb-12">

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-[#111111]
              text-white
              flex
              items-center
              justify-center
              text-xl
              font-semibold
              mb-5
            ">
              P
            </div>

            <h1 className="
              text-2xl
              font-bold
              text-slate-800
              tracking-tight
            ">
              PengaduanKu
            </h1>

            <p className="
              text-slate-400
              mt-2
              text-sm
              leading-relaxed
            ">
              Sistem pengaduan masyarakat modern
            </p>

          </div>

          {/* PROFILE */}
          <div className="
            bg-[#f8fafc]
            border
            border-[#e9edf5]
            rounded-3xl
            p-5
            mb-10
          ">

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-[#111111]
              text-white
              flex
              items-center
              justify-center
              text-lg
              font-semibold
            ">
              {
                user?.username?.charAt(0).toUpperCase()
              }
            </div>

            <h2 className="
              mt-4
              text-lg
              font-semibold
              text-slate-800
            ">
              {user?.username || "Administrator"}
            </h2>

            <p className="
              text-slate-400
              text-sm
              mt-1
            ">
              {user?.role || "Admin"}
            </p>

          </div>

          {/* MENU */}
          <div className="space-y-2">

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
        <button className="
          flex
          items-center
          gap-4
          w-full
          p-4
          rounded-2xl
          border
          border-[#e5e7eb]
          text-slate-600
          hover:bg-[#f8fafc]
          transition-all
        ">
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="
        flex-1
        p-8
        overflow-auto
      ">

        {/* HEADER */}
        <div className="
          flex
          justify-between
          items-center
          mb-10
        ">

          <div>

            <h1 className="
              text-4xl
              font-bold
              text-slate-800
              tracking-tight
            ">
              Dashboard
            </h1>

            <p className="
              text-slate-500
              mt-2
            ">
              Monitoring laporan pengaduan masyarakat
            </p>

          </div>

          <div className="
            bg-white
            border
            border-[#e9edf5]
            px-6
            py-4
            rounded-3xl
            shadow-sm
          ">

            <p className="
              text-slate-400
              text-sm
              mb-1
            ">
              Total Hari Ini
            </p>

            <h1 className="
              text-3xl
              font-bold
              text-slate-800
            ">
              12
            </h1>

          </div>

        </div>

        {/* STATS */}
        <div className="
          grid
          grid-cols-4
          gap-6
          mb-8
        ">

          <DashboardCard
            title="Total Laporan"
            total="120"
            icon={<FaClipboardList />}
          />

          <DashboardCard
            title="Pending"
            total="25"
            icon={<FaClock />}
          />

          <DashboardCard
            title="Approved"
            total="80"
            icon={<FaCheckCircle />}
          />

          <DashboardCard
            title="Rejected"
            total="15"
            icon={<FaTimesCircle />}
          />

        </div>

        {/* CHART */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white
            border
            border-[#e9edf5]
            rounded-[32px]
            p-8
            shadow-sm
          "
        >

          <div className="
            flex
            items-center
            justify-between
            mb-10
          ">

            <div>

              <h1 className="
                text-2xl
                font-bold
                text-slate-800
                mb-2
              ">
                Statistik Laporan
              </h1>

              <p className="
                text-slate-400
              ">
                Jumlah laporan masyarakat per hari
              </p>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-[#f8fafc]
              border
              border-[#e2e8f0]
              flex
              items-center
              justify-center
              text-slate-700
              text-xl
            ">
              <FaChartBar />
            </div>

          </div>

          <div className="w-full h-[380px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={dataLaporan}>

                <XAxis
                  dataKey="hari"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="laporan"
                  radius={[10, 10, 0, 0]}
                  fill="#111111"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

      </main>

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
        px-4
        py-4
        rounded-2xl
        transition-all
        text-sm
        font-medium
        ${
          active
            ? "bg-[#111111] text-white"
            : "text-slate-600 hover:bg-[#f8fafc]"
        }
      `}
    >

      <div className="text-lg">
        {icon}
      </div>

      {title}

    </button>
  )
}

function DashboardCard({
  title,
  total,
  icon
}) {
  return (
    <motion.div
      whileHover={{
        y: -4
      }}
      className="
        bg-white
        border
        border-[#e9edf5]
        rounded-[28px]
        p-6
        shadow-sm
      "
    >

      <div className="
        flex
        justify-between
        items-start
      ">

        <div>

          <p className="
            text-slate-400
            text-sm
            mb-3
          ">
            {title}
          </p>

          <h1 className="
            text-4xl
            font-bold
            text-slate-800
          ">
            {total}
          </h1>

        </div>

        <div className="
          w-14
          h-14
          rounded-2xl
          bg-[#f8fafc]
          border
          border-[#e2e8f0]
          flex
          items-center
          justify-center
          text-slate-700
          text-xl
        ">
          {icon}
        </div>

      </div>

    </motion.div>
  )
}