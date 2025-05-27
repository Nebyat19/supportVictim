import { useState, useEffect } from "react";
import { Menu, X, User, ChevronDown, LogOut, Bell, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { me, logoutUser } from "../Redux/Slices/authSlice";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog";
import { getAssignedRoom } from "../Redux/Slices/chatSlice";
import Heart from "../assets/favicon.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "eng");
  const [hasAssignedRoom, setHasAssignedRoom] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  // Check for assigned room when user is logged in
  useEffect(() => {
    const checkRoom = async () => {
      if (token && user && user.id) {
        try {
          // You may need to adjust the payload according to your backend
          const resultAction = await dispatch(getAssignedRoom({ user_id: user.id }));
          if (getAssignedRoom.fulfilled.match(resultAction) && resultAction.payload?.room_name) {
            setHasAssignedRoom(true);
          } else {
            setHasAssignedRoom(false);
          }
        } catch {
          setHasAssignedRoom(false);
        }
      } else {
        setHasAssignedRoom(false);
      }
    };
    checkRoom();
  }, [dispatch, token, user]);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
    window.location.reload(); // Reload the page to apply language changes dynamically
  };

  const handleProfileClick = () => {
    if (user.role === "support") {
      navigate("/supportProfile");
    } else if (user.role === "client") {
      navigate("/victimProfile");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Language translations for navbar
  const navbarTranslations = {
    eng: {
      emergency: "Emergency",
      resource: "Resource",
      support: "Support",
      getStarted: "Get Started",
      apply: "Apply",
      logout: "Logout",
      lang: "Lang:",
      preferences: "Preferences"
    },
    amh: {
      emergency: "አደጋ",
      resource: "ምንጮች",
      support: "ድጋፍ",
      getStarted: "መጀመሪያ ጀምር",
      apply: "ያመልክቱ",
      logout: "ውጣ",
      lang: "ቋንቋ:",
      preferences: "ቅድሚያዎች"
    },
    orm: {
      emergency: "S.O.S.",
      resource: "Qabeenya",
      support: "Deggersa",
      getStarted: "Jalqabi",
      apply: "Hirmaadhu",
      logout: "Ba'i",
      lang: "Afaan:",
      preferences: "Filannoo"
    }
  };
  const t = navbarTranslations[language];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white/90 to-teal-50/90 backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img src={Heart} alt="Heart" className="h-9 w-9" />
                <div className="absolute -inset-1 rounded-full bg-emerald-100/50 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="ml-2.5 text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              SupportLine
              </span>
            </Link>
          </div>

          {/* Desktop Menu (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/emergency" className="text-slate-700 hover:text-slate-900 transition-colors">
              {t.emergency}
            </Link>
            {/* Resource menu for all users */}
            <Link to="/resource" className="text-slate-700 hover:text-slate-900 transition-colors">
              {t.resource}
            </Link>
            <div className="flex items-center space-x-2">
              <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="eng">English</option>
                <option value="amh">አማ</option>
                <option value="orm">Afaan Oromo</option>
              </select>
            </div>
            {!token ? (
              <Link
                to="/login"
                className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-teal-200/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10">{t.getStarted}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            ) : (
              <div className="flex items-center space-x-6">
                {/* Menu List for Client Role */}
                {user?.role === "client" && (
                  <>
                    <Link to="/services" className="text-slate-700 hover:text-slate-900 transition-colors">
                      {t.support}
                    </Link>
                    <Link to="/preferences" className="text-slate-700 hover:text-slate-900 transition-colors">
                      {t.preferences}
                    </Link>
                  </>
                )}

                {/* Chat Icon (replaces Notification Icon) - only show if hasAssignedRoom */}
                {hasAssignedRoom && (
                  <Link to="/chat">
                    <button
                      className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:bg-slate-50"
                      aria-label="Chat"
                    >
                      <MessageCircle className="h-6 w-6 text-slate-700 hover:text-emerald-500 transition-colors" />
                    </button>
                  </Link>
                )}

                {/* Profile Button */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-3 bg-white/80 px-5 py-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-300 group border border-slate-200"
                >
                  <div className="relative h-8 w-8 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white overflow-hidden shadow-inner">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-slate-700 font-medium group-hover:text-slate-900">{user?.username}</span>
                  </div>
                </button>

                {/* Removed Apply Button for Support Role */}

                <button
                  onClick={() => setIsLogoutDialogOpen(true)}
                  className="relative overflow-hidden group flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 hover:from-blue-500/20 hover:to-emerald-500/20 text-slate-700 px-4 py-2.5 rounded-full font-medium transition-all duration-300 border border-slate-200/50 hover:border-emerald-200"
                >
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 font-medium">
                    {t.logout}
                  </span>
                  <LogOut className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                  <span className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (hidden on desktop) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-full text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (dropdown) */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 animate-fadeIn">
            <div className="flex flex-col space-y-3 mt-2 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-100">
              <Link
                to="/emergency"
                className="block w-full text-slate-700 hover:text-slate-900 px-4 py-3 rounded-xl text-center font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.emergency}
              </Link>
              {/* Resource menu for all users */}
              <Link
                to="/resource"
                className="block w-full text-slate-700 hover:text-slate-900 px-4 py-3 rounded-xl text-center font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.resource}
              </Link>
              {/* Preferences menu for client role */}
              {user?.role === "client" && (
                <Link
                  to="/preferences"
                  className="block w-full text-slate-700 hover:text-slate-900 px-4 py-3 rounded-xl text-center font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.preferences}
                </Link>
              )}
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="eng">English</option>
                <option value="amh">አማ</option>
                <option value="orm"> Oromo</option>
                
              </select>
              {!token ? (
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-4 py-3 rounded-xl text-center font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.getStarted}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleProfileClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-slate-800 font-medium">{user.username}</span>
                      <span className="text-xs text-slate-500">
                        {user.role === "support" ? "Support Team" : "Client"}
                      </span>
                    </div>
                  </button>
                  {/* Chat Icon for mobile - only show if hasAssignedRoom */}
                  {hasAssignedRoom && (
                    <Link
                      to="/chat"
                      className="block w-full text-slate-700 hover:text-slate-900 px-4 py-3 rounded-xl text-center font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 mr-2" />
                        <span>Chat</span>
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsLogoutDialogOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 hover:from-blue-500/20 hover:to-emerald-500/20 text-slate-700 px-4 py-3 rounded-xl font-medium transition-all duration-300 border border-slate-200/50"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600 font-medium">
                      {t.logout}
                    </span>
                    <LogOut className="h-4 w-4 text-emerald-500" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <LogoutConfirmationDialog
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          onConfirm={() => {
            setIsLogoutDialogOpen(false);
            handleLogout();
          }}
        />
      </div>
    </nav>
  );
}
