import { useState, useEffect } from "react";
import { Heart, Scale, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

const translations = {
  eng: {
    welcome: "Welcome to SupportHub",
    description: "Please select the service you need assistance with today",
    services: [
      {
        id: 1,
        title: "Psychological Help",
        description:
          "Professional mental health support and counseling services to help you maintain your emotional well-being.",
        icon: Heart,
      },
      {
        id: 2,
        title: "Legal Aid",
        description: "Expert legal assistance and consultation for various legal matters and concerns.",
        icon: Scale,
      },
      {
        id: 3,
        title: "Report Cases",
        description: "Safely document and report incidents with confidential, trauma-informed support.",
        icon: AlertTriangle,
      },
    ],
    buttonText: "Continue with Selected Service",
    buttonDisabledText: "Please Select a Service",
    processingText: "Processing...",
  },
  amh: {
    welcome: "እንኳን ወደ SupportHub በደህና መጡ",
    description: "እባኮትን ዛሬ የሚያስፈልግዎትን አገልግሎት ይምረጡ",
    services: [
      {
        id: 1,
        title: "ሥነ-ልቦና እርዳታ",
        description: "የሥነ-ልቦና ጤናዎን ለማስቀጠል የሚያስችል የሙያ ድጋፍ እና አማካይነት አገልግሎት።",
        icon: Heart,
      },
      {
        id: 2,
        title: "የህግ እርዳታ",
        description: "ለበለይነት የህግ ጉዳዮች እና ሐሳቦች የሙያ ድጋፍ እና አማካይነት።",
        icon: Scale,
      },
      {
        id: 3,
        title: "ጉዳዮችን ማመልከት",
        description: "ጉዳዮችን በደህና ማስቀመጥ እና ማመልከት በአስቸኳይ የተሰማራ ድጋፍ።",
        icon: AlertTriangle,
      },
    ],
    buttonText: "በተመረጠው አገልግሎት ይቀጥሉ",
    buttonDisabledText: "እባኮትን አገልግሎት ይምረጡ",
    processingText: "በሂደት ላይ...",
  },
  orm: {
    welcome: "Baga Nagaan Dhuftan SupportHub",
    description: "Tajaajila har'a isin barbaachisu filadhaa",
    services: [
      {
        id: 1,
        title: "Gargaarsa Sammuu",
        description: "Tajaajila deeggarsa fayyaa sammuu fi gorsa ogummaa fayyaa sammuu keessan eeguuf gargaaru.",
        icon: Heart,
      },
      {
        id: 2,
        title: "Gargaarsa Seeraa",
        description: "Deeggarsa ogummaa seeraa fi gorsaaf tajaajila gosa seeraa garaagaraa.",
        icon: Scale,
      },
      {
        id: 3,
        title: "Himannaa Galchuu",
        description: "Himannaa balaa sirnaan galmeessuu fi gabaasuu deeggarsa iccitii fi hubannoo qabuun.",
        icon: AlertTriangle,
      },
    ],
    buttonText: "Tajaajila Filatameen Itti Fufi",
    buttonDisabledText: "Tajaajila Filadhaa",
    processingText: "Hojii Irra Jira...",
  },
};

function ServiceSelection() {
  const [selectedService, setSelectedService] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "eng");
  const navigate = useNavigate();

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
  };

  const handleConfirm = () => {
    if (!selectedService) return;

    setIsNavigating(true);

    if (selectedService === 3) {
      // Navigate to ReportForm for "Report Cases"
      navigate("/report", { state: { serviceType: "direct_report" } });
    } else if (selectedService === 1 || selectedService === 2) {
      // Navigate to VictimReport for "Psychological Help" or "Legal Aid"
      const serviceType = selectedService === 1 ? "psychological" : "legal";
      navigate("/victimReport", { state: { serviceType } });
    } else {
      setTimeout(() => {
        alert(`Navigating to the next page with service ID: ${selectedService}`);
        setIsNavigating(false);
      }, 500);
    }
  };

  const content = translations[language];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-1/2 -left-48 w-96 h-96 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-teal-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block animate-bounce bg-white rounded-full p-2 shadow-md">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
              {content.welcome}
            </h1>
            <p className="mt-5 text-xl text-gray-500 max-w-2xl mx-auto">
              {content.description}
            </p>
          </div>

          {/* Service selection */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {content.services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service.id)}
                className={`relative group cursor-pointer transform transition-all duration-300 ease-in-out ${
                  selectedService === service.id ? "scale-105" : "hover:scale-105"
                } bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${
                  selectedService === service.id ? "border-blue-500" : "border-transparent"
                }`}
              >
                {/* Service card content */}
                <div className="p-8">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 rounded-xl ${service.color} ${service.bgColor} transform transition-transform duration-500 group-hover:rotate-6`}
                  >
                    <service.icon className="h-8 w-8 text-blue-500" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-2xl font-bold text-gray-900 group-hover:text-gray-800">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-lg text-gray-600 group-hover:text-gray-700">
                    {service.description}
                  </p>

                  {/* Selection indicator */}
                  <div
                    className={`mt-6 flex items-center justify-between ${
                      selectedService === service.id ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
                  >
                    <span className="text-lg font-medium text-gray-900">Selected</span>
                    <CheckCircle className={`h-6 w-6 ${service.color}`} />
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    selectedService === service.id ? "opacity-100" : ""
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Confirmation button */}
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleConfirm}
              disabled={!selectedService || isNavigating}
              className={`flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform ${
                selectedService && !isNavigating
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isNavigating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {content.processingText}
                </>
              ) : (
                <>
                  {selectedService ? content.buttonText : content.buttonDisabledText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ServiceSelection;
