import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
}

export default function BerandaPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ total: 0, diproses: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
    fetchData();
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    const userData = await AsyncStorage.getItem("user");
    if (!token) {
      router.replace("/login");
    } else {
      setUser(JSON.parse(userData || "{}"));
    }
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/reports/my/filter?status=Semua`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setStats({
          total: result.counts?.Semua || 0,
          diproses: result.counts?.Diproses || 0,
          selesai: result.counts?.Selesai || 0,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const MenuCard = ({ icon, title, desc, onPress, primary = false }: any) => (
    <TouchableOpacity
      style={[styles.menuCard, primary && styles.menuCardPrimary]}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, primary && styles.menuIconPrimary]}>
        <Ionicons name={icon} size={24} color={primary ? "#fff" : "#000"} />
      </View>
      <Text style={[styles.menuTitle, primary && styles.menuTitlePrimary]}>{title}</Text>
      <Text style={[styles.menuDesc, primary && styles.menuDescPrimary]}>{desc}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Datang,</Text>
        <Text style={styles.userName}>{user?.nama || "User"}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Pengaduan</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.diproses}</Text>
          <Text style={styles.statLabel}>Sedang Diproses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.selesai}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <MenuCard
          icon="add-circle-outline"
          title="Buat Pengajuan"
          desc="Laporkan masalah baru"
          primary
          onPress={() => router.push("/pengaduan")}
        />
        <MenuCard
          icon="list-outline"
          title="Riwayat Pengaduan"
          desc="Lihat semua laporan"
          onPress={() => router.push("/riwayat")}
        />
        <MenuCard
          icon="time-outline"
          title="Sedang Diproses"
          desc="Pantau perkembangan"
          onPress={() => router.push("/riwayat?tab=diproses")}
        />
        <MenuCard
          icon="checkmark-done-circle-outline"
          title="Pengajuan Selesai"
          desc="Riwayat terselesaikan"
          onPress={() => router.push("/riwayat?tab=selesai")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#000000", paddingHorizontal: 20, paddingVertical: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  welcomeText: { color: "#ffffff80", fontSize: 14 },
  userName: { color: "#ffffff", fontSize: 24, fontWeight: "bold", marginTop: 4 },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginTop: -20 },
  statCard: { backgroundColor: "#ffffff", borderRadius: 16, paddingVertical: 12, paddingHorizontal: 20, alignItems: "center", flex: 1, marginHorizontal: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#000000" },
  statLabel: { fontSize: 11, color: "#94a3b8", marginTop: 4 },
  menuContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 24, marginBottom: 24 },
  menuCard: { backgroundColor: "#ffffff", borderRadius: 20, padding: 16, width: "48%", marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2 },
  menuCardPrimary: { backgroundColor: "#000000" },
  menuIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  menuIconPrimary: { backgroundColor: "#ffffff20" },
  menuTitle: { fontSize: 16, fontWeight: "600", color: "#1e293b", marginBottom: 4 },
  menuTitlePrimary: { color: "#ffffff" },
  menuDesc: { fontSize: 12, color: "#94a3b8" },
  menuDescPrimary: { color: "#ffffff80" },
});