"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaClock, FaSpinner, FaFileAlt, FaRoad, FaLightbulb, FaTree, FaWater, FaTrash, FaBuilding } from "react-icons/fa";
import { getUserReportsWithFilter } from "@/lib/api";

const CATEGORY_ICONS = {
  jalan: FaRoad, lampu: FaLightbulb, lingkungan: FaTree, air: FaWater, sampah: FaTrash, fasilitas: FaBuilding,
};

const STEPS = ["Diterima", "Ditinjau", "Dikerjakan", "Selesai"];

const getActiveStep = (status) => {
  switch (status) { 
    case "pending": return 1; 
    case "diproses": return 3; 
    default: return 1; 
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const getEstimasi = (priority) => {
  switch (priority) { 
    case "tinggi": return "1-3 hari kerja"; 
    case "sedang": return "3-5 hari kerja"; 
    case "rendah": return "5-7 hari kerja"; 
    default: return "3-5 hari kerja"; 
  }
};

const getCatatan = (report) => {
  if (report.admin_notes) return report.admin_notes;
  if (report.status === "pending") return "Pengaduan telah diterima dan sedang menunggu peninjauan oleh admin.";
  return "Pengaduan sedang diproses oleh tim terkait.";
};

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function SedangDiprosesPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const result = await getUserReportsWithFilter("Diproses", "");
      if (result.success) setReports(result.data || []);
      else setError("Gagal mengambil data");
    } catch (err) { 
      setError(err.message); 
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center">
        <FaSpinner className="w-10 h-10 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/user/beranda">
            <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
              <FaArrowLeft className="text-slate-600 text-sm" />
            </button>
          </Link>
          <div>
            <h1 className="font-bold text-slate-900">Sedang Diproses</h1>
            <p className="text-xs text-slate-400">{reports.length} pengajuan aktif</p>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <FaSpinner className="text-yellow-500 animate-spin flex-shrink-0" />
          <p className="text-sm text-yellow-700">Pengajuan Anda sedang ditangani. Notifikasi akan dikirim saat ada pembaruan.</p>
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FaFileAlt className="text-slate-400 text-xl" />
            </div>
            <p className="font-semibold text-slate-600 text-sm">Tidak ada pengajuan yang diproses</p>
            <p className="text-xs text-slate-400">Pengajuan aktif akan muncul di sini</p>
            <Link href="/user/buatPengaduan">
              <button className="mt-4 px-5 py-2 bg-black text-white rounded-xl text-sm hover:bg-slate-800 transition">+ Buat Pengaduan</button>
            </Link>
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
            {reports.map((report) => {
              const Icon = CATEGORY_ICONS[report.category_kode] || FaFileAlt;
              const activeStep = getActiveStep(report.status);
              return (
                <motion.div key={report.id} variants={fadeUp}>
                  <div className="bg-white border border-slate-200 rounded-[24px] p-5">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-600 flex-shrink-0">
                        <Icon className="text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 leading-snug">{report.judul}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                          <span className="font-mono">{report.report_number}</span>
                          <span>•</span>
                          <span>{formatDate(report.created_at)}</span>
                          <span>•</span>
                          <span className="capitalize">{report.category_name}</span>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${report.status === "pending" ? "bg-slate-100 text-slate-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {report.status === "pending" ? "Pending" : "Diproses"}
                      </span>
                    </div>

                    <div className="relative mb-6 px-1">
                      <div className="absolute top-3.5 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-0.5 bg-slate-200">
                        <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${(activeStep / 3) * 100}%` }} />
                      </div>
                      <div className="relative flex justify-between">
                        {STEPS.map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 w-1/4">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 transition ${idx < activeStep ? "bg-black border-black text-white" : idx === activeStep ? "bg-black border-black text-white ring-4 ring-black/10" : "bg-white border-slate-200 text-slate-400"}`}>
                              {idx < activeStep ? "✓" : idx + 1}
                            </div>
                            <span className={`text-[10px] text-center font-medium leading-tight ${idx <= activeStep ? "text-slate-800" : "text-slate-400"}`}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-4 py-3 mb-4">
                      <p className="text-xs font-semibold text-yellow-700 mb-1">Catatan Petugas</p>
                      <p className="text-sm text-slate-700">{getCatatan(report)}</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl px-4 py-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Prioritas</span>
                        <span className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs ${report.priority === "tinggi" ? "bg-red-100 text-red-700" : report.priority === "sedang" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{report.priority}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Estimasi Selesai</span>
                        <span className="font-medium text-slate-800 flex items-center gap-1"><FaClock className="text-xs text-slate-400" /> {getEstimasi(report.priority)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Lokasi</span>
                        <span className="font-medium text-slate-800 text-right max-w-[55%] text-xs leading-snug">{report.lokasi}</span>
                      </div>
                    </div>

                    <Link href={`/user/detail/${report.id}`}>
                      <button className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition">Lihat Detail Lengkap</button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}