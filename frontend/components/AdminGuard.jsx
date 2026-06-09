"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data dari localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    console.log("========== ADMIN GUARD ==========");
    console.log("Raw token:", token);
    console.log("Raw user string:", userStr);
    
    let user = null;
    try {
      user = JSON.parse(userStr || "{}");
      console.log("Parsed user:", user);
      console.log("User role:", user.role);
    } catch (e) {
      console.error("Gagal parse user:", e);
      user = {};
    }

    // Validasi 1: Apakah token ada?
    if (!token) {
      console.log("❌ AdminGuard: Token TIDAK ADA, redirect ke login");
      router.replace("/login");
      return;
    }

    // Validasi 2: Apakah user ada dan role-nya admin?
    if (!user || user.role !== "admin") {
      console.log("❌ AdminGuard: User role BUKAN ADMIN (" + (user?.role || "undefined") + "), redirect ke login");
      // Hapus data yang salah agar tidak menyebabkan loop
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
      return;
    }

    console.log("✅ AdminGuard: Verifikasi BERHASIL, akses diizinkan");
    setIsAuthorized(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}