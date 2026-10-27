
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import logo from '../assets/logo.png'
import adminAuth from '../Api/adminAuthApi'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // If already authenticated, redirect straight to dashboard
    if (adminAuth.isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const response = await adminAuth.login(email, password)
      if (response.success) {
        navigate('/dashboard')
      } else {
        setErrorMessage(response.message || 'Invalid email or password.')
      }
    } catch (err) {
      console.error('Login error:', err)
      const msg =
        err.response?.data?.message ||
        'Unable to connect to the authentication server. Please verify your connection.'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden bg-[#faf9f6] lg:h-screen lg:min-h-0 lg:grid-cols-2 lg:overflow-hidden">

      {/* LEFT BRANDING SECTION */}
      <section className="relative flex min-h-[400px] flex-col justify-between overflow-hidden bg-[#72000f] px-7 py-8 text-white sm:px-12 sm:py-10 lg:h-screen lg:min-h-0 lg:px-10 lg:py-7 xl:px-14 xl:py-9">

        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 top-16 h-[420px] w-[420px] rounded-full border border-[#800018]/30" />

          <div className="absolute -right-20 top-28 h-[320px] w-[320px] rounded-full border border-[#800018]/25" />

          <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full border border-[#800018]/20" />

          <div className="absolute inset-0 bg-gradient-to-br from-[#a90020]/70 via-transparent to-black/70" />

          <div className="absolute bottom-0 left-0 h-2/3 w-full bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg ring-2 ring-[#fca5a5]/80 sm:h-16 sm:w-16">
            <img src={logo} alt="GCAAA Logo" className="h-full w-full object-contain" />
          </div>

          <div>
            <h2 className="font-serif text-3xl leading-none tracking-wide sm:text-4xl text-white">
              GCAAA
            </h2>

            <p className="mt-2 text-[9px] tracking-[0.3em] text-[#fca5a5] sm:text-[10px]">
              ALUMNI ASSOCIATION
            </p>
          </div>
        </div>

        {/* Welcome content */}
        <div className="relative z-10 my-8 max-w-xl lg:my-4">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fca5a5] sm:text-xs sm:tracking-[0.25em]">
            Government College of Architecture
          </p>

          <div className="mb-5 h-[2px] w-16 bg-[#800018]" />

          <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl xl:text-7xl">
            Welcome Back,
            <span className="mt-2 block text-[#fca5a5]">
              Admin
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
            Manage alumni, events, publications and the legacy we share.
          </p>

          <div className="mt-6 h-[2px] w-16 bg-[#800018]" />

          <p className="mt-4 text-[10px] uppercase leading-6 tracking-[0.25em] text-white/60 sm:text-xs sm:leading-7">
            People
            <br />
            Architecture
            <br />
            Ideas
            <br />
            A Stronger Tomorrow
          </p>
        </div>

        {/* Bottom text */}
        <p className="relative z-10 text-[9px] tracking-[0.18em] text-white/60 sm:text-[10px] sm:tracking-[0.25em]">
          GOVERNMENT COLLEGE ALUMNI ASSOCIATION
        </p>
      </section>

      {/* RIGHT LOGIN SECTION */}
      <section className="relative flex min-h-0 items-center justify-center overflow-hidden px-5 py-8 sm:px-10 lg:h-screen lg:px-8 lg:py-4 xl:px-12">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-28 h-96 w-96 rounded-full border-[30px] border-[#800018]/5" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[25px] border-[#72000f]/5" />

        {/* Login card */}
        <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#e9e2dc] bg-white/95 p-6 shadow-[0_20px_70px_rgba(60,20,20,0.08)] sm:p-8 lg:p-7 xl:p-9">

          {/* Heading */}
          <div className="mb-6 text-center lg:mb-5">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-200">
              <img src={logo} alt="GCAAA Emblem" className="h-full w-full object-contain" />
            </div>

            <div className="mx-auto mb-4 h-[2px] w-14 bg-[#800018]" />

            <h2 className="font-serif text-3xl font-bold text-[#17131b] sm:text-4xl">
              Admin Portal
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to manage the GCAAA website.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 shadow-sm animate-shake">
              <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#26212a]"
              >
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-[#ded7d5] bg-[#fdfcfb] px-4 transition focus-within:border-[#b50928] focus-within:ring-2 focus-within:ring-[#b50928]/10">
                <Mail
                  size={20}
                  className="shrink-0 text-[#67565c]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-transparent py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#26212a]"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-[#ded7d5] bg-[#fdfcfb] px-4 transition focus-within:border-[#b50928] focus-within:ring-2 focus-within:ring-[#b50928]/10">
                <LockKeyhole
                  size={20}
                  className="shrink-0 text-[#67565c]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-transparent py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="shrink-0 text-[#67565c] transition hover:text-[#b50928]"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#4a4148]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 accent-[#b50928]"
                />

                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-lg bg-[#bd0929] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#bd0929]/15 transition duration-300 hover:bg-[#93001d] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-white" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight
                    size={20}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-[#eee6e2] pt-5 text-center">
            <p className="text-xs tracking-wide text-gray-500">
              © 2026 GCAAA Alumni Association
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
