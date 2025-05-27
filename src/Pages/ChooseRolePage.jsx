import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Shield, ArrowRight } from "lucide-react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
const ChooseRolePage = () => {
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      navigate("/register", { state: { role: selectedRole } })
    }
  }

  // Language translations for ChooseRolePage
const chooseRoleTranslations = {
  eng: {
    chooseRole: "Choose Your Role",
    selectHow: "Select how you would like to participate in our platform",
    volunteer: "Volunteer",
    volunteerDesc: "Join as a volunteer to provide assistance, resources, and support to those in need.",
    seekingHelp: "Seeking Help",
    seekingHelpDesc: "Register to receive support, connect with resources, and find the assistance you need.",
    continue: "Continue to Registration"
  },
  amh: {
    chooseRole: "ሚናዎን ይምረጡ",
    selectHow: "በመድረካችን ላይ እንዴት መሳተፍ እንደሚፈልጉ ይምረጡ",
    volunteer: "በበጎ ፈቃድ",
    volunteerDesc: "ለሚያስፈልጋቸው ሰዎች እገዛ፣ ምንጮችና ድጋፍ ለመስጠት በበጎ ፈቃድ ይቀላቀሉ።",
    seekingHelp: "እገዛ ማግኘት",
    seekingHelpDesc: "ድጋፍ ለማግኘት፣ ምንጮችን ለመገናኘት እና የሚያስፈልጉትን እገዛ ለማግኘት ይመዝገቡ።",
    continue: "ወደ መመዝገብያ ቀጥሉ"
  },
  orm: {
    chooseRole: "Gahee Kee Filadhu",
    selectHow: "Akka marsariitii keenya irratti hirmaattu filadhu",
    volunteer: "Barsiisaa",
    volunteerDesc: "Namoota gargaarsa barbaadan deeggaruuf, qabeenya fi deeggarsa kennuuf gargaaraa ta'i.",
    seekingHelp: "Gargaarsa Barbaadu",
    seekingHelpDesc: "Deeggarsa argachuuf, qabeenya waliin wal qunnamsiisuuf fi gargaarsa barbaaddu argachuuf galmaa'i.",
    continue: "Galmee itti fufi"
  }
};
const language = localStorage.getItem("language") || "eng";
const t = chooseRoleTranslations[language];

  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">{t.chooseRole}</h1>
          <p className="text-blue-700/80 mb-8">{t.selectHow}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Volunteer Option */}
            <div
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md
                ${
                  selectedRole === "support"
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 hover:border-green-200 bg-white"
                }`}
              onClick={() => handleRoleSelect("support")}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{t.volunteer}</h2>
                <p className="text-blue-700/80 text-center">
                  {t.volunteerDesc}
                </p>
              </div>
              <div className="mt-4 flex justify-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${selectedRole === "support" ? "border-green-400 bg-green-400" : "border-gray-300"}`}
                >
                  {selectedRole === "support" && <div className="w-3 h-3 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>

            {/* Victim Option */}
            <div
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md
                ${selectedRole === "client" ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-200 bg-white"}`}
              onClick={() => handleRoleSelect("client")}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{t.seekingHelp}</h2>
                <p className="text-blue-700/80 text-center">
                  {t.seekingHelpDesc}
                </p>
              </div>
              <div className="mt-4 flex justify-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${selectedRole === "client" ? "border-blue-400 bg-blue-400" : "border-gray-300"}`}
                >
                  {selectedRole === "client" && <div className="w-3 h-3 rounded-full bg-white"></div>}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
              ${selectedRole ? "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
          >
            {t.continue}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>



      <Footer />
    </>
  )
}

export default ChooseRolePage
