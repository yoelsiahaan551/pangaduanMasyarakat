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
    <div className="
      min-h-screen
      bg-[#f5f5f7]
      flex
      items-center
      justify-center
      overflow-hidden
      p-6
      relative
    ">

      {/* BACKGROUND EFFECT */}
      <div className="
        absolute
        top-[-120px]
        left-[-120px]
        w-[350px]
        h-[350px]
        bg-black/5
        rounded-full
        blur-3xl
      " />

      <div className="
        absolute
        bottom-[-120px]
        right-[-120px]
        w-[350px]
        h-[350px]
        bg-gray-400/10
        rounded-full
        blur-3xl
      " />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          relative
          w-[980px]
          h-[650px]
          bg-white/80
          backdrop-blur-xl
          border
          border-white/50
          rounded-[40px]
          overflow-hidden
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
        "
      >

        {/* LEFT PANEL */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.7 }}
          className="
            absolute
            left-0
            top-0
            w-[45%]
            h-full
            bg-[#111111]
            rounded-r-[100px]
            flex
            flex-col
            justify-center
            px-14
            text-white
            overflow-hidden
          "
        >

          {/* EFFECT */}
          <div className="
            absolute
            bottom-[-80px]
            left-[-80px]
            w-[250px]
            h-[250px]
            bg-white/5
            rounded-full
            blur-3xl
          " />

          <div className="relative z-10">

            <div className="
              inline-flex
              items-center
              gap-2
              bg-white/10
              border
              border-white/10
              px-4
              py-2
              rounded-full
              text-sm
              text-gray-300
              mb-8
            ">
              Modern Complaint System
            </div>

            <h1 className="
              text-5xl
              font-bold
              leading-tight
              mb-6
            ">
              Join Our
              Platform
            </h1>

            <p className="
              text-gray-400
              text-lg
              leading-relaxed
              mb-10
            ">
              Buat akun baru untuk mulai
              menggunakan layanan pengaduan
              masyarakat secara digital.
            </p>

            <Link href="/login">

              <motion.button
                whileHover={{
                  scale: 1.03
                }}
                whileTap={{
                  scale: 0.97
                }}
                className="
                  bg-white
                  text-black
                  px-8
                  py-4
                  rounded-2xl
                  font-medium
                  hover:bg-gray-200
                  transition-all
                "
              >
                Login
              </motion.button>

            </Link>

          </div>

        </motion.div>

        {/* RIGHT SIDE */}
        <div className="
          absolute
          right-0
          top-0
          w-[55%]
          h-full
          flex
          items-center
          justify-center
        ">

          <div className="w-full max-w-md px-12">

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >

              <h1 className="
                text-5xl
                font-bold
                text-gray-900
                mb-4
                tracking-tight
              ">
                Create Account
              </h1>

              <p className="
                text-gray-500
                leading-relaxed
                text-base
              ">
                Daftar akun baru untuk mulai
                menggunakan layanan kami.
              </p>

            </motion.div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    bg-[#f8f8f8]
                    border
                    border-gray-200
                    px-5
                    py-4
                    rounded-2xl
                    outline-none
                    transition-all
                    focus:border-black
                    focus:bg-white
                    text-gray-800
                    placeholder:text-gray-400
                  "
                />

              </div>

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    bg-[#f8f8f8]
                    border
                    border-gray-200
                    px-5
                    py-4
                    rounded-2xl
                    outline-none
                    transition-all
                    focus:border-black
                    focus:bg-white
                    text-gray-800
                    placeholder:text-gray-400
                  "
                />

              </div>

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                ">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    bg-[#f8f8f8]
                    border
                    border-gray-200
                    px-5
                    py-4
                    rounded-2xl
                    outline-none
                    transition-all
                    focus:border-black
                    focus:bg-white
                    text-gray-800
                    placeholder:text-gray-400
                  "
                />

              </div>

              <motion.button
                whileHover={{
                  scale: 1.01
                }}
                whileTap={{
                  scale: 0.98
                }}
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-black
                  text-white
                  py-4
                  rounded-2xl
                  font-medium
                  mt-3
                  shadow-lg
                  hover:bg-gray-900
                  transition-all
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