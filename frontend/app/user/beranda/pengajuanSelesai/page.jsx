"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCheckCircle, FaStar, FaFileAlt, FaRoad, FaLightbulb, FaTree, FaWater, FaTrash, FaBuilding, FaSpinner } from "react-icons/fa";

const CATEGORY_ICONS = {
  jalan: FaRoad, lampu: FaLightbulb, lingkungan: FaTree, air: FaWater, sampah: FaTrash, fasilitas: FaBuilding,
};

const StarRating = ({ value }) => (
  <div className="flex gap-0.5">{[1,2,3,4,5].map((s) => (<FaStar key={s} className={`text-sm ${s <= (value || 4) ? "text-yellow-400" : "text-slate-200"}`} />))}</div>
);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const hitungDurasi = (startDate, endDate) => {
  if (!startDate || !endDate) return "-";
  const diff = Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  return `${diff} hari`;
};

const getTanggalSelesai = (report) => {
  if (report.updated_at && report.status === "selesai") return report.updated_at;
  const date = new Date(report.created_at);
  date.setDate(date.getDate() + 5);
  return date.toISOString();
};

export default function PengajuanSelesaiPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reports/my/filter?status=Selesai", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) setReports(result.data || []);
    } catch (err) { 
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
          <button onClick={() => router.push("/user/beranda")} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
            <FaArrowLeft className="text-slate-600 text-sm" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900">Pengajuan Selesai</h1>
            <p className="text-xs text-slate-400">{reports.length} pengajuan selesai</p>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <FaCheckCircle className="text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">Pengajuan berikut telah selesai ditangani. Terima kasih atas laporan Anda!</p>
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center"><FaFileAlt className="text-slate-400 text-xl" /></div>
            <p className="font-semibold text-slate-600 text-sm">Belum ada pengajuan selesai</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const Icon = CATEGORY_ICONS[report.category_kode] || FaFileAlt;
              const tanggalSelesai = getTanggalSelesai(report);
              return (
                <div key={report.id} className="bg-white border border-slate-200 rounded-[24px] p-5">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 flex-shrink-0">
                      <Icon className="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 leading-snug">{report.judul}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="font-mono">{report.report_number}</span><span>•</span><span className="capitalize">{report.category_name}</span><span>•</span><span>Selesai {formatDate(tanggalSelesai)}</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Selesai</span>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mb-4">
                    <p className="text-xs font-semibold text-green-700 mb-1">Catatan Penyelesaian</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{report.admin_notes || "Pengaduan telah selesai ditangani. Terima kasih atas laporan Anda!"}</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl px-4 py-3 space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Prioritas</span>
                      <span className={`font-medium capitalize px-2 py-0.5 rounded-full text-xs ${report.priority === "tinggi" ? "bg-red-100 text-red-700" : report.priority === "sedang" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{report.priority}</span>
                    </div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Tanggal Masuk</span><span className="font-medium text-slate-800">{formatDate(report.created_at)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Tanggal Selesai</span><span className="font-medium text-slate-800">{formatDate(tanggalSelesai)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Durasi Penanganan</span><span className="font-medium text-slate-800">{hitungDurasi(report.created_at, tanggalSelesai)}</span></div>
                    <div className="flex justify-between text-sm items-center"><span className="text-slate-500">Rating</span><StarRating value={4} /></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 truncate max-w-[80%]">{report.lokasi}</p>
                    <Link href={`/user/detail/${report.id}`}><button className="text-xs text-green-600 font-medium hover:text-green-700 transition">Lihat Detail →</button></Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}