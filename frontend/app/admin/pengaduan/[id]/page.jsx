"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowLeft, FaMapMarkerAlt, FaUser, FaClock,
  FaCheckCircle, FaCamera, FaPaperPlane, FaSpinner,
} from "react-icons/fa";
import { AdminSidebar } from "../../dashboard/page";
import AdminGuard from "@/components/AdminGuard";

const STEPS = ["Diterima", "Ditinjau", "Dikerjakan", "Selesai"];

const STATUS_OPTIONS = ["pending", "diproses", "selesai", "ditolak"];
const STATUS_LABEL = { pending: "Pending", diproses: "Diproses", selesai: "Selesai", ditolak: "Ditolak" };

const PRIORITAS_MAP = {
  tinggi: "bg-red-100 text-red-700 border-red-200",
  sedang: "bg-yellow-100 text-yellow-700 border-yellow-200",
  rendah: "bg-green-100 text-green-700 border-green-200"
};

const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

export default function AdminDetailPengaduanPage({ params }) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [newCatatan, setNewCatatan] = useState("");
  const [newPetugas, setNewPetugas] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setResolvedParams(unwrapped);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      fetchDetail(resolvedParams.id);
    }
  }, [resolvedParams]);

  const fetchDetail = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setNewStatus(result.data.status);
        setNewPetugas(result.data.petugas || "");
      } else {
        setError("Data tidak ditemukan");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!resolvedParams) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/admin/${resolvedParams.id}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: newCatatan || data?.admin_notes
        })
      });
      const result = await response.json();
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchDetail(resolvedParams.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStepAktif = (status) => {
    const index = STATUS_OPTIONS.indexOf(status);
    return index >= 0 ? index : 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading || !resolvedParams) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Kelola Pengaduan" />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="w-10 h-10 text-slate-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Kelola Pengaduan" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">{error || "Data tidak ditemukan"}</div>
        </div>
      </div>
    );
  }

  const stepAktif = getStepAktif(data.status);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f6f8fc]">
        <AdminSidebar active="Kelola Pengaduan" />

        <div className="flex-1">
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin/pengaduan">
                <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
                  <FaArrowLeft className="text-sm" />
                </button>
              </Link>
              <div>
                <h1 className="font-bold text-slate-900">Detail Pengaduan</h1>
                <p className="text-xs text-slate-400 font-mono">{data.report_number}</p>
              </div>
            </div>
            {saved && (
              <span className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl font-medium">
                <FaCheckCircle /> Perubahan disimpan
              </span>
            )}
          </header>

          <div className="px-8 py-6">
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-3 gap-5">
              <div className="col-span-2 space-y-5">
                <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                  <h2 className="font-bold text-xl text-slate-800 leading-snug mb-2">{data.judul}</h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${PRIORITAS_MAP[data.priority]}`}>
                      Prioritas {data.priority}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(data.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-2xl p-4 mt-4">{data.deskripsi}</p>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                  <h3 className="font-bold text-slate-800 mb-5">Progress Penanganan</h3>
                  <div className="relative px-2">
                    <div className="absolute top-3.5 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-0.5 bg-slate-100">
                      <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${(stepAktif / 3) * 100}%` }} />
                    </div>
                    <div className="relative flex justify-between">
                      {STEPS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-1/4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 transition ${
                            i < stepAktif ? "bg-black border-black text-white" :
                            i === stepAktif ? "bg-black border-black text-white ring-4 ring-black/10" :
                            "bg-white border-slate-200 text-slate-400"
                          }`}>
                            {i < stepAktif ? "✓" : i + 1}
                          </div>
                          <span className={`text-[10px] text-center font-medium ${i <= stepAktif ? "text-slate-800" : "text-slate-400"}`}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-slate-500" />
                    <h3 className="font-bold text-slate-800">Lokasi Kejadian</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Alamat</p><p className="font-medium text-slate-800">{data.lokasi}</p></div>
                    <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">RT/RW</p><p className="font-medium text-slate-800">RT {data.rt || "-"} / RW {data.rw || "-"}</p></div>
                    <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Kelurahan</p><p className="font-medium text-slate-800">{data.kelurahan || "-"}</p></div>
                    <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Kecamatan</p><p className="font-medium text-slate-800">{data.kecamatan || "-"}</p></div>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaCamera className="text-slate-500" />
                    <h3 className="font-bold text-slate-800">Foto Bukti</h3>
                  </div>
                  {!data.photos || data.photos.length === 0 ? (
                    <p className="text-sm text-slate-400">Tidak ada foto yang dilampirkan</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {data.photos.map((f, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-slate-100 overflow-hidden">
                          <img src={f.url || f} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="space-y-5">
                <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FaUser className="text-slate-500 text-sm" />
                    <h3 className="font-bold text-slate-800">Pelapor</h3>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {data.user_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{data.user_name || "-"}</p>
                      <p className="text-xs text-slate-400">{data.user_email || "-"}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-[20px] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FaClock className="text-slate-500 text-sm" />
                    <h3 className="font-bold text-slate-800">Update Status</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status Baru</label>
                      <div className="grid grid-cols-2 gap-2">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => setNewStatus(s)}
                            className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                              newStatus === s ? "bg-black border-black text-white" : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                            }`}
                          >
                            {STATUS_LABEL[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Catatan Petugas</label>
                      <textarea
                        rows={3}
                        placeholder="Tulis catatan update..."
                        value={newCatatan}
                        onChange={(e) => setNewCatatan(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-all bg-slate-50 resize-none"
                      />
                    </div>
                    <button
                      onClick={handleUpdate}
                      className="w-full py-3 rounded-xl bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                      <FaPaperPlane className="text-xs" /> Simpan Update
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-slate-50 border border-slate-200 rounded-[20px] p-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Petugas</span>
                    <span className="font-medium text-slate-800 text-right">{data.petugas || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Masuk</span>
                    <span className="font-medium text-slate-800">{formatDate(data.created_at)}</span>
                  </div>
                  {data.admin_notes && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Catatan Admin</span>
                      <span className="font-medium text-slate-800 text-right text-xs">{data.admin_notes}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}