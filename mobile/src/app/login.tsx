import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ PAKAI localhost untuk Expo Web
const API_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        Alert.alert("Berhasil", "Login berhasil!");
        router.replace("/(tabs)/beranda");
      } else {
        Alert.alert("Login Gagal", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server error. Pastikan backend running di port 5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login untuk mengakses layanan pengaduan</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>Belum punya akun? Daftar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, elevation: 4 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#94a3b8", marginBottom: 24 },
  input: { backgroundColor: "#f8fafc", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: "#e2e8f0", marginBottom: 16 },
  button: { backgroundColor: "#000", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  registerText: { textAlign: "center", marginTop: 16, color: "#3b82f6", fontSize: 14 },
});