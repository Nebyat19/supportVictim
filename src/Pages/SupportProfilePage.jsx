import { useState, useRef, useEffect } from "react";
import { User, Mail, Briefcase, BookOpen, Upload, Save } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { completeSupportProfile } from "../Redux/Slices/suporterProfileSlice" 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Language translations for SupportProfilePage
const supportProfileTranslations = {
  eng: {
    volunteerProfile: "Volunteer Profile",
    shareExpertise: "Share your expertise and availability to help others",
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    gender: "Gender",
    selectGender: "Select your gender",
    male: "Male",
    female: "Female",
    religion: "Religion (Optional)",
    profileImage: "Profile Image",
    clickToUpload: "Click to upload image",
    professionalInfo: "Professional Information",
    supportType: "Support Type",
    legalSupport: "Legal Support",
    legalDesc: "Provide legal advice and assistance",
    psychSupport: "Psychological Support",
    psychDesc: "Provide mental health support",
    yearsOfExp: "Years of Experience",
    specialization: "Specialization",
    specializationPlaceholder: "E.g., Family Law, Trauma Counseling",
    save: "Save Profile",
    saving: "Saving..."
  },
  amh: {
    volunteerProfile: "የበጎ ፈቃድ መለያ",
    shareExpertise: "ልምድዎንና ቅድሚያዎን ለሌሎች ለመስጠት ያጋሩ",
    personalInfo: "የግል መረጃ",
    firstName: "የመጀመሪያ ስም",
    lastName: "የአባት ስም",
    email: "ኢሜይል",
    gender: "ፆታ",
    selectGender: "ፆታዎን ይምረጡ",
    male: "ወንድ",
    female: "ሴት",
    religion: "ሃይማኖት (አማራጭ)",
    profileImage: "የመለያ ምስል",
    clickToUpload: "ምስል ለማስገባት ይጫኑ",
    professionalInfo: "የሙያ መረጃ",
    supportType: "የድጋፍ አይነት",
    legalSupport: "የህግ ድጋፍ",
    legalDesc: "የህግ ምክርና እገዛ ይስጡ",
    psychSupport: "የአእምሮ ድጋፍ",
    psychDesc: "የአእምሮ ጤና ድጋፍ ይስጡ",
    yearsOfExp: "የስራ ልምድ ዓመታት",
    specialization: "ስፋት",
    specializationPlaceholder: "ለምሳሌ፦ የቤተሰብ ህግ፣ የችግር ምክንያት ምክር",
    save: "መለያ አስቀምጥ",
    saving: "በማስቀመጥ ላይ..."
  },
  orm: {
    volunteerProfile: "Profaayila Gargaaraa",
    shareExpertise: "Ogummaa fi yeroo kee namoota gargaaruuf qoodi",
    personalInfo: "Odeeffannoo Dhuunfaa",
    firstName: "Maqaa Duraa",
    lastName: "Maqaa Abbaa",
    email: "Imeelii",
    gender: "Saala",
    selectGender: "Saala kee fili",
    male: "Dhiira",
    female: "Dubartii",
    religion: "Amantii (Filannoo)",
    profileImage: "Suuraa Profaayilii",
    clickToUpload: "Suuraa olkaa'uuf cuqaasi",
    professionalInfo: "Odeeffannoo Ogummaa",
    supportType: "Gosa Deeggarsa",
    legalSupport: "Deeggarsa Seeraa",
    legalDesc: "Gorsa seeraa fi deeggarsa kenni",
    psychSupport: "Deeggarsa Sammuu",
    psychDesc: "Deeggarsa fayyaa sammuu kenni",
    yearsOfExp: "Waggaa Muuxannoo",
    specialization: "Dandeettii Addaa",
    specializationPlaceholder: "Fakkeenyaaf: Seera Maatii, Gorsa Miidhaa",
    save: "Profaayila Olkaa'i",
    saving: "Olkaa'aa jirta..."
  }
};
const language = localStorage.getItem("language") || "eng";
const t = supportProfileTranslations[language];

const SupportProfilePage = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const user  = useSelector((state) => state.auth.user);
  const { profile, loading, error } = useSelector((state) => state.supportProfile);
  const navigate = useNavigate();

  // Helper to split full_name
  const splitFullName = (fullName = "") => {
    const [first = "", ...rest] = fullName.trim().split(" ");
    return {
      firstName: first,
      lastName: rest.join(" ") || "",
    };
  };

  // Set default values from user/support_profile
  const initialFullName = user?.support_profile?.full_name || "";
  const { firstName, lastName } = splitFullName(initialFullName);

  const [formData, setFormData] = useState({
    firstName: firstName || user?.firstName || "",
    lastName: lastName || user?.lastName || "",
    full_name: initialFullName,
    email: user?.support_profile?.email || user?.email || "",
    support_type: user?.support_profile?.support_type || "",
    yearsOfExperience: user?.support_profile?.years_of_experience || "",
    gender: user?.support_profile?.gender || "",
    specialization: Array.isArray(user?.support_profile?.specializations)
      ? user.support_profile.specializations.join(", ")
      : user?.support_profile?.specializations || "",
    religion: user?.support_profile?.religion || "",
  });

  // Update formData if user/support_profile changes
  useEffect(() => {
    const profile = user?.support_profile;
    const fullName = profile?.full_name || "";
    const { firstName, lastName } = splitFullName(fullName);

    setFormData((prev) => ({
      ...prev,
      firstName: firstName || user?.firstName || "",
      lastName: lastName || user?.lastName || "",
      full_name: fullName,
      email: profile?.email || user?.email || "",
      support_type: profile?.support_type || "",
      yearsOfExperience: profile?.years_of_experience || "",
      gender: profile?.gender || "",
      specialization: Array.isArray(profile?.specializations)
        ? profile.specializations.join(", ")
        : profile?.specializations || "",
      religion: profile?.religion || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      let newFormData = { ...prevFormData, [name]: value };
      // Update full_name if firstName or lastName changes
      if (name === "firstName" || name === "lastName") {
        newFormData.full_name = `${name === "firstName" ? value : prevFormData.firstName} ${name === "lastName" ? value : prevFormData.lastName}`.trim();
      }
      return newFormData;
    });
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData for multipart/form-data
    const data = new FormData();
    // Always combine firstName and lastName for full_name
    data.append("full_name", `${formData.firstName} ${formData.lastName}`.trim());
    data.append("support_type", formData.support_type);
    data.append("email", formData.email);
    data.append("years_of_experience", formData.yearsOfExperience);
    data.append("gender", formData.gender);
    // Send specialization as array if comma separated
    data.append(
      "specializations",
      JSON.stringify(
        formData.specialization
          ? formData.specialization.split(",").map((s) => s.trim()).filter(Boolean)
          : []
      )
    );
    data.append("religion", formData.religion);
    setIsSubmitting(true);
    try {
      await dispatch(completeSupportProfile(data));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
<>
<Navbar />
    {/* Success Popup */}
    {showSuccess && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white border border-green-400 rounded-lg shadow-lg px-8 py-6 flex flex-col items-center">
          <svg className="w-10 h-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700 font-semibold text-lg">Profile saved successfully!</span>
        </div>
      </div>
    )}
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Remove profile image upload UI */}
              {/* <div
                className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden"
                onClick={triggerFileInput}
              >
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-green-600" />
                )}
              </div> */}
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
                <User className="w-12 h-12 text-green-600" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{t.volunteerProfile}</h1>
                <p className="text-green-100 mt-1">{t.shareExpertise}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Remove hidden file input */}
            {/* <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">{t.personalInfo}</h2>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6"></div>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  {t.firstName}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  {t.lastName}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    // Make email read-only since it's set from user data
                    readOnly
                    className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-100 cursor-not-allowed"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  {t.gender}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                >
                  <option value="" disabled>
                    {t.selectGender}
                  </option>
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
      
                </select>
              </div>

              {/* Religion */}
              <div className="space-y-2">
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700">
                  {t.religion}
                </label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter your religion (optional)"
                />
              </div>

              {/* Professional Information Section */}
              <div className="md:col-span-2 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">{t.professionalInfo}</h2>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6"></div>
              </div>

              {/* Support Type */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">{t.supportType}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
                      ${
                        formData.support_type === "legal"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    onClick={() => setFormData({ ...formData, support_type: "legal" })}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t.legalSupport}</h3>
                        <p className="text-sm text-gray-500">{t.legalDesc}</p>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${formData.support_type === "legal" ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                        >
                          {formData.support_type === "legal" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
                      ${
                        formData.support_type === "psychological"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    onClick={() => setFormData({ ...formData, support_type: "psychological" })}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t.psychSupport}</h3>
                        <p className="text-sm text-gray-500">{t.psychDesc}</p>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${
                              formData.support_type === "psychological"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                        >
                          {formData.support_type === "psychological" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                  {t.yearsOfExp}
                </label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter years of experience"
                  required
                />
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                  {t.specialization}
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization.split(",").map((s) => s.trim()).join(", ")}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder={t.specializationPlaceholder}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col md:flex-row justify-end gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200
                  ${
                    isSubmitting
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-green-200"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {t.save}
                  </>
                )}
              </button>
              {/* Redirect to /supportApply on click */}
              <button
                type="button"
                onClick={() => navigate("/supportApply")}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              >
                Apply as Volunteer
              </button>
            </div>
          </form>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
<Footer />
</>

  )
}

export default SupportProfilePage
