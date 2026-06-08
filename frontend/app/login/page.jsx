"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ HANYA SIMPAN KE LOCALSTORAGE (JANGAN PAKAI COOKIE!)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // ✅ HAPUS COOKIE JIKA ADA
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect berdasarkan ROLE
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/beranda";
        }
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (error) {
      console.error(error);
      setError("Server error. Pastikan backend running di port 5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center overflow-hidden p-6 relative">
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-black/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-gray-400/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-[980px] h-[650px] bg-white/80 backdrop-blur-xl border border-white/50 rounded-[40px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
      >
        <div className="absolute left-0 top-0 w-[55%] h-full flex items-center justify-center">
          <div className="w-full max-w-md px-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 leading-relaxed text-base">
                Login untuk mengakses layanan pengaduan masyarakat dengan cepat dan aman.
              </p>
            </motion.div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f8f8f8] border border-gray-200 px-5 py-4 rounded-2xl outline-none transition-all focus:border-black focus:bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f8f8f8] border border-gray-200 px-5 py-4 rounded-2xl outline-none transition-all focus:border-black focus:bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-2xl font-medium mt-3 shadow-lg hover:bg-gray-900 transition-all"
              >
                {loading ? "Loading..." : "Login"}
              </motion.button>
            </form>
          </div>
        </div>

        <motion.div
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute right-0 top-0 w-[45%] h-full bg-[#111111] rounded-l-[100px] flex flex-col justify-center px-14 text-white overflow-hidden"
        >
          <div className="absolute top-[-80px] right-[-80px] w-[250px] h-[250px] bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 mb-8">
              Modern Complaint System
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">Smart Digital Platform</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Sistem pengaduan masyarakat modern dengan pengalaman yang lebih cepat, aman, dan efisien.
            </p>
            <Link href="/register">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="bg-white text-black px-8 py-4 rounded-2xl font-medium hover:bg-gray-200 transition-all">
                Create Account
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}