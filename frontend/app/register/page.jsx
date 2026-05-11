"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function RegisterPage() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ================= REGISTER =================
  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      )

      const data = await response.json()

      if (response.ok) {

        alert("Register berhasil")

        router.push("/login")

      } else {

        alert(data.message)

      }

    } catch (error) {

      console.log(error)
      alert("Server error")

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#dce8ff] to-[#eef4ff] flex items-center justify-center overflow-hidden p-5">

      {/* BACKGROUND */}
      <div className="absolute w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-indigo-300/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      <motion.div
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="
          relative
          w-[950px]
          h-[620px]
          bg-white/80
          backdrop-blur-xl
          rounded-[45px]
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          overflow-hidden
        "
      >

        {/* LEFT PANEL */}
        <motion.div
          initial={{ x: -150 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8 }}
          className="
            absolute
            top-0
            left-0
            w-[45%]
            h-full
            bg-gradient-to-br
            from-[#5b86ff]
            to-[#7aa6ff]
            rounded-r-[120px]
            flex
            flex-col
            justify-center
            items-center
            text-white
            px-14
          "
        >

          <h1 className="text-5xl font-semibold mb-6 text-center">
            Welcome ✨
          </h1>

          <p className="text-center text-lg text-blue-100 leading-relaxed mb-10">
            Sudah punya akun?
            <br />
            Login kembali untuk melanjutkan.
          </p>

          <Link href="/login">

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#ffffff",
                color: "#5b86ff"
              }}
              className="
                border-2
                border-white
                px-10
                py-4
                rounded-2xl
                text-lg
                transition-all
              "
            >
              Sign In
            </motion.button>

          </Link>

        </motion.div>

        {/* REGISTER FORM */}
        <div className="absolute top-0 right-0 w-[55%] h-full flex items-center justify-center">

          <div className="w-full max-w-md px-12">

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >

              <h1 className="text-5xl font-semibold text-slate-800 mb-3">
                Create Account
              </h1>

              <p className="text-slate-500 text-base leading-relaxed">
                Buat akun baru untuk mulai membuat
                laporan masyarakat.
              </p>

            </motion.div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <input
                type="text"
                name="username"
                placeholder="Masukkan Username"
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-[#f5f8ff]
                  p-5
                  rounded-2xl
                  outline-none
                  border
                  border-transparent
                  focus:border-[#5b86ff]
                  text-slate-700
                  placeholder:text-slate-400
                "
              />

              <input
                type="email"
                name="email"
                placeholder="Masukkan Email"
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-[#f5f8ff]
                  p-5
                  rounded-2xl
                  outline-none
                  border
                  border-transparent
                  focus:border-[#5b86ff]
                  text-slate-700
                  placeholder:text-slate-400
                "
              />

              <input
                type="password"
                name="password"
                placeholder="Masukkan Password"
                onChange={handleChange}
                required
                className="
                  w-full
                  bg-[#f5f8ff]
                  p-5
                  rounded-2xl
                  outline-none
                  border
                  border-transparent
                  focus:border-[#5b86ff]
                  text-slate-700
                  placeholder:text-slate-400
                "
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-gradient-to-r
                  from-[#5b86ff]
                  to-[#79a2ff]
                  text-white
                  p-5
                  rounded-2xl
                  text-lg
                  shadow-lg
                "
              >
                {
                  loading
                  ? "Loading..."
                  : "Create Account"
                }
              </motion.button>

            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}