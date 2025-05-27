import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearState } from "../Redux/Slices/authSlice"; // adjust path as needed

// Language translations for login page
const loginTranslations = {
  eng: {
    welcome: "Welcome back",
    signInToContinue: "Sign in to your account to continue",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    signIn: "Sign in",
    dontHave: "Don't have an account?",
    signUp: "Sign up"
  },
  amh: {
    welcome: "እንኳን ደህና መጡ",
    signInToContinue: "ለመቀጠል ወደ መለያዎ ይግቡ",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    forgot: "የይለፍ ቃል ረሱ?",
    signIn: "ይግቡ",
    dontHave: "መለያ የለዎትም?",
    signUp: "ይመዝገቡ"
  },
  orm: {
    welcome: "Baga nagaan dhuftan",
    signInToContinue: "Itti fufuuf gara herrega keetti seeni",
    email: "Imeelii",
    password: "Jecha darbii",
    forgot: "Jecha darbii dagatte?",
    signIn: "Seeni",
    dontHave: "Herrega hin qabduu?",
    signUp: "Galmaa'i"
  }
};
const language = localStorage.getItem("language") || "eng";
const t = loginTranslations[language];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      dispatch(clearState());
      navigate("/"); // adjust route as needed
    }
  }, [success, dispatch, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-700 mb-2">{t.welcome}</h1>
              <p className="text-green-700">{t.signInToContinue}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-blue-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-blue-700 block">
                    {t.password}
                  </label>
                  {/* Removed forgot password link */}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-blue-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <p className="text-red-500 text-sm text-center">
                {typeof error === "string" ? error : ""}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
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
                    {t.signIn} <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t.dontHave}{" "}
                <Link to="/role" className="text-blue-700 hover:text-green-700 font-semibold">
                  {t.signUp}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}