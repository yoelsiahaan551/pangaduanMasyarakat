"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaCamera,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

const STEPS = [
  { id: 1, label: "Kategori" },
  { id: 2, label: "Detail" },
  { id: 3, label: "Lokasi & Foto" },
  { id: 4, label: "Konfirmasi" },
];

const CATEGORY_MAP = {
  jalan: "Jalan & Infrastruktur",
  lampu: "Penerangan Jalan",
  lingkungan: "Lingkungan & Taman",
  air: "Drainase & Air",
  sampah: "Kebersihan & Sampah",
  fasilitas: "Fasilitas Umum",
};

const CATEGORY_ID_MAP = {
  jalan: 1,
  lampu: 2,
  lingkungan: 3,
  air: 4,
  sampah: 5,
  fasilitas: 6,
};

function Navbar({ user, back, title }) {
  const router = useRouter();
  return (
    <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-[#e9edf5] px-10 py-5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push(back)} className="w-11 h-11 rounded-2xl bg-[#f3f5f9] flex items-center justify-center text-slate-600 hover:bg-[#e9edf5] transition-all">
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-400">Portal Pengaduan Masyarakat</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-[#f3f5f9] px-4 py-2 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-semibold">
            {user?.nama?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{user?.nama || "User"}</p>
            <p className="text-xs text-slate-400">Masyarakat</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

function StepBar({ current, steps }) {
  return (
    <div className="bg-white border border-[#e9edf5] rounded-[28px] p-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#e9edf5] mx-16 z-0" />
        <div
          className="absolute left-0 top-5 h-0.5 bg-[#111111] z-0 transition-all duration-500"
          style={{
            width: `${((current - 1) / (steps.length - 1)) * 100}%`,
            marginLeft: "4rem",
            marginRight: "4rem",
            maxWidth: "calc(100% - 8rem)",
          }}
        />
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              current > s.id
                ? "bg-[#111111] text-white"
                : current === s.id
                ? "bg-[#111111] text-white ring-4 ring-[#111111]/20"
                : "bg-white border-2 border-[#e9edf5] text-slate-400"
            }`}>
              {current > s.id ? "✓" : s.id}
            </div>
            <span className={`text-xs font-medium ${current >= s.id ? "text-slate-700" : "text-slate-400"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KonfirmasiPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const pengaduan = JSON.parse(localStorage.getItem("pengaduan") || "{}");
    setUser(userData);
    setData(pengaduan);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Anda belum login. Silakan login terlebih dahulu.");
        router.push("/login");
        return;
      }

      if (!data.title || !data.description || !data.location) {
        setError("Data pengaduan tidak lengkap.");
        return;
      }

      // ✅ Kumpulkan URL foto dari Supabase
      const photoUrls = data.photos?.map(p => p.url || p.dataUrl) || [];
      console.log("URL Foto:", photoUrls);

      // ✅ Kirim sebagai JSON (bukan FormData dengan file)
      const requestData = {
        judul: data.title,
        deskripsi: data.description,
        category_id: CATEGORY_ID_MAP[data.category] || 1,
        priority: data.priority || "sedang",
        lokasi: data.location,
        rt: (data.rt || "").toString().slice(0, 10),
        rw: (data.rw || "").toString().slice(0, 10),
        kelurahan: data.kelurahan || "",
        kecamatan: data.kecamatan || "",
        photos: photoUrls  // ✅ Kirim URL foto
      };

      console.log("Data dikirim:", requestData);

      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok && result.success) {
        localStorage.removeItem("pengaduan");
        alert("Pengaduan berhasil dikirim!");
        router.push("/user/beranda");
      } else {
        setError(result.message || "Gagal mengirim pengaduan");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar user={user} back="/user/lokasiFoto" title="Konfirmasi Pengaduan" />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <StepBar current={4} steps={STEPS} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Ringkasan Kategori */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center">
              <FaClipboardCheck />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Ringkasan Pengaduan</h2>
              <p className="text-sm text-slate-400">Periksa kembali data sebelum dikirim</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-slate-400 mb-1">Kategori</p>
              <p className="font-semibold text-slate-800">
                {CATEGORY_MAP[data.category] || data.category || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Prioritas</p>
              <p className="font-semibold text-slate-800 capitalize">
                {data.priority || "Sedang"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Judul</p>
              <p className="font-semibold text-slate-800">{data.title || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Deskripsi</p>
              <p className="text-slate-700 whitespace-pre-wrap">{data.description || "-"}</p>
            </div>
          </div>
        </motion.div>

        {/* Lokasi */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Lokasi Kejadian</h2>
              <p className="text-sm text-slate-400">Informasi lokasi laporan</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-slate-400">Alamat</p>
              <p className="font-medium text-slate-800">{data.location || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">RT / RW</p>
              <p className="font-medium text-slate-800">
                {data.rt || "-"} / {data.rw || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Kelurahan</p>
              <p className="font-medium text-slate-800">{data.kelurahan || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Kecamatan</p>
              <p className="font-medium text-slate-800">{data.kecamatan || "-"}</p>
            </div>
          </div>
        </motion.div>

        {/* Foto Bukti */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#e9edf5] rounded-[35px] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center">
              <FaCamera />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Foto Bukti</h2>
              <p className="text-sm text-slate-400">Lampiran yang akan dikirim</p>
            </div>
          </div>

          {data.photos?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden bg-[#f3f5f9]">
                  <img src={photo.url || photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-sm">Tidak ada foto yang diupload</div>
          )}
        </motion.div>

        <div className="bg-amber-50 border border-amber-200 rounded-[25px] p-5">
          <p className="text-sm text-amber-700">
            Dengan mengirim pengaduan ini, Anda menyatakan bahwa informasi yang diberikan
            benar dan dapat dipertanggungjawabkan.
          </p>
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => router.push("/user/lokasiFoto")}
            className="px-6 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 transition"
          >
            Kembali
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-black text-white font-semibold flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            {loading ? "Mengirim..." : "Kirim Pengaduan"}
          </button>
        </div>
      </div>
    </div>
  );
}