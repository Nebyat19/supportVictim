import React from "react"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../Redux/Slices/authSlice"


export default function RegisterPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const role = location.state?.role
  const dispatch = useDispatch()
  const { loading, error, user, success } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    role: role ,
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  console.log("data", formData);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username) newErrors.name = "Name is required"

    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"


    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

    if (!formData.password_confirmation) newErrors.password_confirmation = "Please confirm your password"
    else if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  // Redirect to login page after successful registration
  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      dispatch(registerUser(formData))
    }
  }
  

  // Language translations for registration page
const regTranslations = {
  eng: {
    createAccount: "Create an account",
    join: "Join us today and start your journey",
    fullName: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    terms: "I agree to the ",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",
    createBtn: "Create Account",
    already: "Already have an account?",
    signIn: "Sign in"
  },
  amh: {
    createAccount: "መለያ ይፍጠሩ",
    join: "ዛሬ ይቀላቀሉና ጉዞዎን ይጀምሩ",
    fullName: "ሙሉ ",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    confirmPassword: "የይለፍ ቃል ያረጋግጡ",
    terms: "እኔ እስማማለሁ ",
    termsOfService: "የአገልግሎት ውሎች",
    and: "እና",
    privacyPolicy: "የግላዊነት ፖሊሲ",
    createBtn: "መለያ ይፍጠሩ",
    already: "አካውንት አለዎት?",
    signIn: "ይግቡ"
  },
  orm: {
    createAccount: "Herrega Uumi",
    join: "Har'a nu waliin hirmaadhu fi imala kee jalqabi",
    fullName: "Maqaa Guutuu",
    email: "Imeelii",
    password: "Jecha Darbii",
    confirmPassword: "Jecha Darbii Mirkaneessi",
    terms: "Waliigaltee tajaajilaa fi",
    termsOfService: "Waliigaltee Tajaajilaa",
    and: "fi",
    privacyPolicy: "Karoora Dhuunfaa",
    createBtn: "Herrega Uumi",
    already: "Herrega qabdaa?",
    signIn: "Seeni"
  }
};
const language = localStorage.getItem("language") || "eng";
const t = regTranslations[language];


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">{t.createAccount}</h1>
              <p className="text-blue-700/80">{t.join}</p>
            </div>

            {/* Backend error display */}
            {error &&
              !(
                typeof error === "object" &&
                error !== null &&
                error.message === "Unauthenticated."
              ) && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm border border-red-300">
                  {typeof error === "string"
                    ? error
                    : Array.isArray(error)
                    ? error.join(", ")
                    : typeof error === "object" && error !== null
                    ? Object.values(error)
                        .filter((v) => typeof v === "string")
                        .join(", ")
                    : "Registration failed. Please try again."}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-blue-700 block">
                  {t.fullName}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-blue-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                      errors.name ? "border-red-500" : "border-blue-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-blue-700 block">
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-blue-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-blue-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-blue-700 block">
                  {t.password}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-blue-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-blue-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-green-400 hover:text-blue-600" />
                    ) : (
                      <Eye size={18} className="text-blue-400 hover:text-green-600" />
                    )}
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-blue-700 block">
                  {t.confirmPassword}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-blue-400" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                      errors.password_confirmation ? "border-red-500" : "border-blue-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} className="text-green-400 hover:text-blue-600" />
                    ) : (
                      <Eye size={18} className="text-blue-400 hover:text-green-600" />
                    )}
                  </div>
                </div>
                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-blue-700">
                  {t.terms}
                  <a href="#" className="text-green-700 hover:underline">
                    {t.termsOfService}
                  </a>{" "}
                  {t.and}{" "}
                  <a href="#" className="text-green-700 hover:underline">
                    {t.privacyPolicy}
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 shadow-md hover:from-blue-600 hover:to-green-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    {t.createBtn} <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-700">
                {t.already}{" "}
                <Link to="/login" className="text-green-700 font-medium hover:underline">
                  {t.signIn}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
