"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/services/authService"

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "user"
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const result = await registerUser(form)

      if (result.success) {
        alert("Register berhasil")

        router.push("/login")
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="nama"
            placeholder="Masukkan nama"
            className="w-full border p-3 rounded-xl"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Masukkan email"
            className="w-full border p-3 rounded-xl"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Masukkan password"
            className="w-full border p-3 rounded-xl"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-xl"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}