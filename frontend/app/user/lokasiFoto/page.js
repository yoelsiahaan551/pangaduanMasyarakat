"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCamera, FaUpload, FaTimes } from "react-icons/fa";
import { supabase } from "@/lib/supabase";  // ← Pastikan import supabase

const STEPS = [
  { id: 1, label: "Kategori" },
  { id: 2, label: "Detail" },
  { id: 3, label: "Lokasi & Foto" },
  { id: 4, label: "Konfirmasi" },
];

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

export default function LokasiFotoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState({});
  const [location, setLocation] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const savedData = JSON.parse(localStorage.getItem("pengaduan") || "{}");
    setUser(userData);
    setSaved(savedData);
    if (savedData.location) setLocation(savedData.location);
    if (savedData.rt) setRt(savedData.rt);
    if (savedData.rw) setRw(savedData.rw);
    if (savedData.kelurahan) setKelurahan(savedData.kelurahan);
    if (savedData.kecamatan) setKecamatan(savedData.kecamatan);
    if (savedData.photos) setPhotos(savedData.photos);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ✅ Upload foto ke Supabase dan simpan URL
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    for (const file of files) {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        
        // Upload ke Supabase Storage
        const { data, error } = await supabase.storage
          .from("pengaduan")
          .upload(fileName, file);

        if (error) {
          console.error("Upload error:", error);
          continue;
        }

        // Dapatkan public URL
        const { data: publicUrlData } = supabase.storage
          .from("pengaduan")
          .getPublicUrl(fileName);

        const photoUrl = publicUrlData.publicUrl;
        
        // Simpan URL foto
        setPhotos(prev => [...prev, {
          name: file.name,
          url: photoUrl,
          dataUrl: photoUrl
        }]);
        
        console.log("Foto uploaded:", photoUrl);
      } catch (err) {
        console.error("Error:", err);
      }
    }
    
    setUploading(false);
  };

  const removePhoto = (i) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  const canNext = location.length >= 5;

  const handleLanjut = () => {
    if (!location) {
      setError("Harap isi alamat lokasi");
      return;
    }

    // Simpan data ke localStorage termasuk URL foto
    const pengaduanData = { 
      ...saved, 
      location, 
      rt, 
      rw, 
      kelurahan, 
      kecamatan, 
      photos: photos  // photos sekarang berisi {name, url}
    };
    
    console.log("Menyimpan ke localStorage:", pengaduanData);
    console.log("Jumlah foto:", photos.length);
    
    localStorage.setItem("pengaduan", JSON.stringify(pengaduanData));
    router.push("/user/konfirmasi");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Navbar user={user} back="/user/detail" title="Buat Pengajuan" />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <StepBar current={3} steps={STEPS} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* LOKASI */}
          <div className="bg-white border border-[#e9edf5] rounded-[35px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center text-slate-700">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Lokasi Kejadian</h2>
                <p className="text-slate-400 text-sm">Informasi lokasi membantu petugas menemukan tempat</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama jalan, nomor, patokan terdekat..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">RT</label>
                <input
                  type="text" 
                  placeholder="Contoh: 005" 
                  value={rt}
                  onChange={(e) => setRt(e.target.value.slice(0, 10))}
                  maxLength={10}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">RW</label>
                <input
                  type="text" 
                  placeholder="Contoh: 003" 
                  value={rw}
                  onChange={(e) => setRw(e.target.value.slice(0, 10))}
                  maxLength={10}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kelurahan</label>
                <input
                  type="text" 
                  placeholder="Nama kelurahan" 
                  value={kelurahan}
                  onChange={(e) => setKelurahan(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kecamatan</label>
                <input
                  type="text" 
                  placeholder="Nama kecamatan" 
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-[#e9edf5] bg-[#f8f9fb] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#111111] transition-all"
                />
              </div>
            </div>
          </div>

          {/* FOTO */}
          <div className="bg-white border border-[#e9edf5] rounded-[35px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#f3f5f9] flex items-center justify-center text-slate-700">
                <FaCamera />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Foto Bukti</h2>
                <p className="text-slate-400 text-sm">Tambahkan foto untuk memperkuat laporan (maks. 5 foto)</p>
              </div>
            </div>

            {photos.length < 5 && (
              <label className="w-full border-2 border-dashed border-[#d1d9e8] rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-[#111111] hover:bg-[#f8f9fb] transition-all mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#f3f5f9] flex items-center justify-center text-slate-500 text-2xl">
                  <FaUpload />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700">Klik untuk upload foto</p>
                  <p className="text-sm text-slate-400">JPG, PNG • Maks 10MB per foto</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                  disabled={uploading}
                />
              </label>
            )}

            {uploading && (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500">Mengupload foto...</p>
              </div>
            )}

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden aspect-square bg-[#f3f5f9]">
                    <img
                      src={photo.url || photo.dataUrl}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => router.push("/user/detail")}
            className="px-7 py-4 rounded-2xl border border-[#e9edf5] bg-white text-slate-600 font-medium hover:bg-[#f3f5f9] transition-all"
          >
            ← Kembali
          </button>
          <button
            onClick={handleLanjut}
            disabled={!canNext}
            className="px-8 py-4 rounded-2xl bg-[#111111] text-white font-medium hover:bg-[#222222] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Lanjut ke Konfirmasi →
          </button>
        </div>
      </div>
    </div>
  );
}