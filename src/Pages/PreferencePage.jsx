import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, ChevronDown, Users, Calendar, Globe, ArrowRight } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { savePreferences, setPreference, resetPreferenceStatus, fetchPreferences } from "../Redux/Slices/preferenceSlice";
import Loading from "../Components/Loading"

function PreferenceSelection() {
  const dispatch = useDispatch();
  const { preferences, loading, error, success } = useSelector((state) => state.preferences);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [isNavigating, setIsNavigating] = useState(false);
  const clientId = user?.client_profile?.id;


  useEffect(() => {
    if (clientId) {
      dispatch(fetchPreferences(clientId)); // Fetch preferences for the specific client ID
    }
  }, [dispatch, clientId]);



  // Ensure preferences.preferred_languages and preferences.preferred_religions are arrays
  const preferred_languages = preferences.preferred_languages || [];
  const preferred_religions = preferences.preferred_religions || [];

  const genderOptions = [
    { id: "any", label: "No Preference" },
    { id: "female", label: "Female" },
    { id: "male", label: "Male" },
  ];

  const ageGroupOptions = [
    { id: "any", label: "No Preference", icon: Users },
    { id: "20-35", label: "20-35 years", icon: Calendar },
    { id: "36-50", label: "36-50 years", icon: Calendar },
    { id: "51-plus", label: "51+ years", icon: Calendar },
  ];

  const languageOptions = [
    { id: "english", label: "English" },
    { id: "amharic", label: "Amharic" },
    { id: "oromiffa", label: "Oromiffa" },
  ];

  const religionOptions = [
    { id: "christian", label: "Christian" },
    { id: "islam", label: "Islam" },
    { id: "other", label: "Other" },
  ];

  const handleGenderSelect = (genderId) => {
    dispatch(setPreference({ preferred_gender: genderId }));
  };

  const handleAgeGroupSelect = (ageGroupId) => {
    dispatch(setPreference({ ageGroup: ageGroupId }));
  };

  const toggleLanguage = (languageId) => {
    const langs = preferred_languages.includes(languageId)
      ? preferred_languages.filter((id) => id !== languageId)
      : [...preferred_languages, languageId];
    dispatch(setPreference({ preferred_languages: langs }));
  };

  const toggleReligion = (religionId) => {
    const updatedReligions = preferred_religions.includes(religionId)
      ? preferred_religions.filter((id) => id !== religionId)
      : [...preferred_religions, religionId];
    dispatch(setPreference({ preferred_religions: updatedReligions }));
  };

  const handleContinue = () => {
    setIsNavigating(true);
    const data = {
      preferred_gender: preferences.preferred_gender || "no_preference", // Ensure valid value
      preferred_religions: preferred_religions.length > 0 ? preferred_religions : [],
      preferred_languages: preferred_languages.length > 0 ? preferred_languages : ["english"],
      avoid_triggers: preferences.avoid_triggers || 0 , // Convert to string ("true" or "false")
      contact_method: preferences.contact_method || "all", // Default to "all"
      preferred_contact_start: preferences.preferred_contact_start || "09:00", // Default to 9:00 AM
      preferred_contact_end: preferences.preferred_contact_end || "17:00", // Default to 5:00 PM
    };
    dispatch(savePreferences(data)).finally(() => setIsNavigating(false));
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetPreferenceStatus());
      }, 1500);
    }
  }, [success, dispatch]);

  const isFormComplete = preferences.preferred_gender !== null && preferences.ageGroup !== null && preferred_religions.length > 0;

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-100">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-1/2 -left-48 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block bg-white rounded-full p-2 shadow-md mb-6">
              <div className="bg-gradient-to-r from-blue-500 via-green-400 to-green-500 rounded-full p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-400 to-green-600">
                Preferences
              </span>
            </h1>
            <p className="mt-5 text-xl text-gray-500 max-w-2xl mx-auto">
              Help us match you with the right specialist by selecting your preferences
            </p>
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            {/* Gender Preference */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="mr-3 h-6 w-6 text-blue-500" />
                Gender Preference
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {genderOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleGenderSelect(option.id)}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 flex items-center transition-all duration-300 hover:shadow-md ${
                      preferences.preferred_gender === option.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-200"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{option.label}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        preferences.preferred_gender === option.id ? "border-green-500 bg-green-500" : "border-gray-300"
                      }`}
                    >
                      {preferences.preferred_gender === option.id && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Group Preference */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="mr-3 h-6 w-6 text-blue-500" />
                Age Group Preference
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ageGroupOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleAgeGroupSelect(option.id)}
                    className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-md ${
                      preferences.ageGroup === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="absolute top-4 right-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          preferences.ageGroup === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {preferences.ageGroup === option.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <div
                      className={`inline-flex p-3 rounded-lg bg-blue-100 ${
                        preferences.ageGroup === option.id ? "text-blue-600" : "text-blue-400"
                      }`}
                    >
                      <option.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-medium text-gray-900">{option.label}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Preference */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Globe className="mr-3 h-6 w-6 text-green-500" />
                Language Preference
              </h2>
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-green-200 transition-colors"
                >
                  <span className="text-gray-700">
                    {preferred_languages.length === 0
                      ? "Select languages (optional)"
                      : `${preferred_languages.length} language${
                          preferred_languages.length > 1 ? "s" : ""
                        } selected`}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isLanguageDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-2 max-h-60 overflow-auto">
                    {languageOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => toggleLanguage(option.id)}
                        className="flex items-center px-4 py-3 hover:bg-green-50 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                            preferred_languages.includes(option.id)
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {preferred_languages.includes(option.id) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-gray-700">{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {preferred_languages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {preferred_languages.map((langId) => (
                    <div
                      key={langId}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {languageOptions.find((lang) => lang.id === langId)?.label}
                      <button onClick={() => toggleLanguage(langId)} className="ml-2 focus:outline-none">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Language selection is optional. If none selected, we'll match you with English-speaking specialists.
              </p>
            </div>

            {/* Religion Preference */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3 h-6 w-6 text-green-500">🛐</span>
                Religion Preference
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {religionOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => toggleReligion(option.id)}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 flex items-center transition-all duration-300 hover:shadow-md ${
                      preferred_religions.includes(option.id)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-200"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{option.label}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        preferred_religions.includes(option.id) ? "border-green-500 bg-green-500" : "border-gray-300"
                      }`}
                    >
                      {preferred_religions.includes(option.id) && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                ))}
              </div>
              {preferred_religions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {preferred_religions.map((religionId) => (
                    <div
                      key={religionId}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {religionOptions.find((religion) => religion.id === religionId)?.label}
                      <button onClick={() => toggleReligion(religionId)} className="ml-2 focus:outline-none">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Religion selection is optional. If none selected, we'll match you with specialists of any religion.
              </p>
            </div>

            {/* Continue Button */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleContinue}
                disabled={!isFormComplete || isNavigating || loading}
                className={`flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform ${
                  isFormComplete && !isNavigating && !loading
                    ? "bg-gradient-to-r from-blue-500 via-green-400 to-green-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isNavigating || loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
    
            {success && <div className="mt-4 text-center text-green-600">Preferences saved successfully!</div>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PreferenceSelection;
