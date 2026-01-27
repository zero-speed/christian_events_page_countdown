"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, LogIn } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Credenciales por defecto (usuario: admin, contraseña: admin123)
    const validUsername = "admin"
    const validPassword = "admin123"

    if (username === validUsername && password === validPassword) {
      // Guardar sesión en localStorage
      localStorage.setItem("adminAuth", JSON.stringify({ authenticated: true, timestamp: Date.now() }))
      router.push("/admin")
    } else {
      setError("Usuario o contraseña incorrectos")
      setPassword("")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-full p-4 mb-6">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Administración</h1>
          <p className="text-slate-400">Acceso restringido a administradores</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-8 mb-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">{error}</div>
          )}

          {/* Username */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-semibold text-white mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-slate-800 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-900 font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? "Iniciando sesión..." : "Acceder"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
            ← Volver a inicio
          </Link>
          <p className="text-slate-500 text-xs mt-4">Credenciales de prueba: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}
