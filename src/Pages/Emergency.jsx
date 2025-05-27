import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEmergencyContacts } from "../Redux/Slices/emergencySlice"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import Loading from "../Components/Loading" // Import the loading component

const EmergencyContactsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All")
  const dispatch = useDispatch()
  const { emergencyContacts = [], loading = false, error = null } = useSelector((state) => state.emergency || {})

  useEffect(() => {
    dispatch(fetchEmergencyContacts())
  }, [dispatch])

  // Language translations for Emergency page
  const emergencyTranslations = {
    eng: {
      title: "Emergency Contacts",
      subtitle: "Quick access to important numbers in case of emergency. Stay safe and prepared.",
      all: "All",
      law: "Law Enforcement",
      medical: "Medical",
      police: "Police Department",
      fire: "Fire Department",
      ambulance: "Ambulance",
      copy: "Copy",
      noContacts: "No contacts found",
      noContactsIn: "No contacts available in",
    },
    amh: {
      title: "የአደጋ ቁጥሮች",
      subtitle: "በአደጋ ጊዜ ወደ አስፈላጊ ቁጥሮች በፍጥነት ይደውሉ። ደህና ይቆዩ።",
      all: "ሁሉም",
      law: "ህግ አካላት",
      medical: "ሕክምና",
      police: "ፖሊስ መደብር",
      fire: "የእሳት አደጋ መደብር",
      ambulance: "አምቡላንስ",
      copy: "ቅዳ",
      noContacts: "ምንም አገናኞች አልተገኙም",
      noContactsIn: "በ",
    },
    orm: {
      title: "Lakkoofsa Ariifachiisaa",
      subtitle: "Yeroo balaa lakkoofsa barbaachisaa saffisaan argachuuf. Nagaadhaan jiraadhu.",
      all: "Hundaa",
      law: "Seeraa Kabachiiftuu",
      medical: "Fayyaa",
      police: "Polisii",
      fire: "Dhaabbata Ibiddaa",
      ambulance: "Ambulaansii",
      copy: "Kopi'i",
      noContacts: "Lakkoofsi hin argamne",
      noContactsIn: "Keessatti lakkoofsi hin jiru",
    },
  }
  const language = localStorage.getItem("language") || "eng"
  const t = emergencyTranslations[language]

  // Map categories and names to translations
  const categoryMap = {
    "All": t.all,
    "Law Enforcement": t.law,
    "Medical": t.medical,
  }
  const nameMap = {
    "Police Department": t.police,
    "Fire Department": t.fire,
    "Ambulance": t.ambulance,
  }

  // Reset activeCategory when language changes
  useEffect(() => {
    setActiveCategory(t.all)
  }, [language])

  // Get all unique categories
  const categories = [t.all, ...new Set(emergencyContacts.map((contact) => categoryMap[contact.category] || contact.category))]

  // Filter contacts based on active category
  const filteredContacts = emergencyContacts.filter(
    (contact) => activeCategory === t.all || (categoryMap[contact.category] || contact.category) === activeCategory,
  )

  if (loading) {
    return <Loading /> // Display the loading component for the entire page
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-800">
        <div className="container mx-auto px-4 py-12">
          <header className="mb-12 relative">
            <h1 className="text-5xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
              {t.title}
            </h1>
            <p className="text-center text-gray-600 mb-8 text-xl max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </header>

          <div className="categories-filter mb-10 overflow-x-auto pb-2">
            <div className="flex space-x-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold shadow-lg transform -translate-y-1"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <main>
            {error ? (
              <div className="text-center py-16">
                <p className="text-2xl font-bold text-red-800 mb-2">Error: {error}</p>
              </div>
            ) : filteredContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="relative group">
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="h-2 "></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-500 transition-colors duration-300">
                            {nameMap[contact.name] || contact.name}
                          </h3>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                            {categoryMap[contact.category] || contact.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center group-hover:scale-105 transition-transform duration-300"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mr-4 shadow-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
                              {contact.phone}
                            </span>
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(contact.phone)
                            }}
                            className="px-4 py-2 bg-gradient-to-r cursor-pointer from-blue-500 to-green-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            {t.copy}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-100 rounded-2xl border border-gray-300">
                <p className="text-2xl font-bold text-gray-800 mb-2">{t.noContacts}</p>
                <p className="text-gray-600 mb-6">
                  {t.noContactsIn} {activeCategory}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default EmergencyContactsPage
