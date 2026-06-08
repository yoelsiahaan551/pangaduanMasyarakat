import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

export default function RegisterPage() {
  const router = useRouter();
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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
          await AsyncStorage.setItem("token", loginData.token);
          await AsyncStorage.setItem("user", JSON.stringify(loginData.user));
          Alert.alert("Berhasil", "Register berhasil!");
          router.replace("/(tabs)/beranda");
        } else {
          router.replace("/login");
        }
      } else {
        Alert.alert("Registrasi Gagal", data.message);
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Daftar akun baru</Text>

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
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Daftar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.registerText}>Sudah punya akun? Login</Text>
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