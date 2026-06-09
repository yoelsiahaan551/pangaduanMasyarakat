import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", password: "" });

  const handleRegister = async () => {
    if (!form.nama || !form.email || !form.password) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }
    if (form.password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      // REGISTER
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          email: form.email,
          password: form.password,
          role: "user"
        }),
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        // REGISTER SUKSES, LANGSUNG LOGIN
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          await AsyncStorage.setItem("token", loginData.token);
          await AsyncStorage.setItem("user", JSON.stringify(loginData.user));
          
          // ✅ LANGSUNG KE BERANDA
          window.location.href = "/beranda";
        } else {
          Alert.alert("Info", "Registrasi berhasil, silakan login");
          window.location.href = "/login";
        }
      } else {
        Alert.alert("Registrasi Gagal", registerData.message || "Terjadi kesalahan");
      }
    } catch (error) {
      Alert.alert("Error", "Backend tidak jalan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Daftar Akun</Text>
        <Text style={styles.subtitle}>Buat akun baru untuk melaporkan pengaduan</Text>

        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={form.nama}
          onChangeText={(text) => setForm({ ...form, nama: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min 6)"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Daftar & Masuk</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => window.location.href = "/login"}>
          <Text style={styles.loginText}>Sudah punya akun? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 24, elevation: 4 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1e293b", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#94a3b8", marginBottom: 24 },
  input: { backgroundColor: "#f8fafc", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: "#e2e8f0", marginBottom: 16 },
  button: { backgroundColor: "#000", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loginText: { textAlign: "center", marginTop: 16, color: "#3b82f6", fontSize: 14 },
});