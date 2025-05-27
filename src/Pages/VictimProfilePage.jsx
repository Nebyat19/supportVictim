import { useState, useEffect } from "react";
import { User, Phone, Heart, Save, Eye, EyeOff } from "lucide-react";
import Header from "../Components/Navbar";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { completeClientProfile} from "../Redux/Slices/clientProfileSlice";
import { useDispatch, useSelector } from "react-redux";

// Language translations for VictimProfilePage
const victimProfileTranslations = {
  eng: {
    profileInfo: "Profile Information",
    updateDetails: "Update your personal details and preferences",
    success: "Profile updated successfully!",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    gender: "Gender",
    selectGender: "Select your gender",
    male: "Male",
    female: "Female",
    ageGroup: "Age Group",
    selectAge: "Select your age group",
    under18: "Under 18",
    age18_24: "18-24",
    age25_34: "25-34",
    age35_44: "35-44",
    age45_54: "45-54",
    age55_64: "55-64",
    age65plus: "65+",
    clientType: "Client Type",
    selectClientType: "Select client type",
    survivor: "Victims",
    reporter: "Reporter",
    contactInfo: "Contact Information",
    contactPhone: "Contact Phone",
    emergencyContact: "Emergency Contact",
    emergencyPhone: "Emergency Contact Phone",
    save: "Save Profile",
    saving: "Saving..."
  },
  amh: {
    profileInfo: "የመለያ መረጃ",
    updateDetails: "የግል ዝርዝሮችንና ምርጫዎችን ያዘምኑ",
    success: "መለያ በተሳካ ሁኔታ ተዘምኗል!",
    personalInfo: "የግል መረጃ",
    fullName: "ሙሉ ስም",
    gender: "ፆታ",
    selectGender: "ፆታዎን ይምረጡ",
    male: "ወንድ",
    female: "ሴት",
    ageGroup: "የዕድሜ ቡድን",
    selectAge: "የዕድሜ ቡድኑን ይምረጡ",
    under18: "18 በታች",
    age18_24: "18-24",
    age25_34: "25-34",
    age35_44: "35-44",
    age45_54: "45-54",
    age55_64: "55-64",
    age65plus: "65+",
    clientType: "የደንበኛ አይነት",
    selectClientType: "የደንበኛ አይነት ይምረጡ",
    survivor: "ተጎዳኙ",
    reporter: "ሪፖርተር",
    contactInfo: "የእውቂያ መረጃ",
    contactPhone: "የእውቂያ ስልክ",
    emergencyContact: "የአደጋ ጊዜ አገናኝ",
    emergencyPhone: "የአደጋ ጊዜ ስልክ",
    save: "መለያ አስቀምጥ",
    saving: "በማስቀመጥ ላይ..."
  },
  orm: {
    profileInfo: "Odeeffannoo Herregaa",
    updateDetails: "Odeeffannoo dhuunfaa fi filannoo kee haaromsi",
    success: "Odeeffannoon herregaa milkaa'inaan haaromfame!",
    personalInfo: "Odeeffannoo Dhuunfaa",
    fullName: "Maqaa Guutuu",
    gender: "Saala",
    selectGender: "Saala kee fili",
    male: "Dhiira",
    female: "Dubartii",
    ageGroup: "Gosa Umurii",
    selectAge: "Gosa umurii kee fili",
    under18: "Jalaa 18",
    age18_24: "18-24",
    age25_34: "25-34",
    age35_44: "35-44",
    age45_54: "45-54",
    age55_64: "55-64",
    age65plus: "65+",
    clientType: "Gosa Deeggarsa",
    selectClientType: "Gosa deeggarsa fili",
    survivor: "Miidhamtoota",
    reporter: "Gabaasaa",
    contactInfo: "Odeeffannoo Quunnamtii",
    contactPhone: "Lakkoofsa Bilbilaa",
    emergencyContact: "Quunnamtii Ariifachiisaa",
    emergencyPhone: "Lakkoofsa Ariifachiisaa",
    save: "Herrega Olkaa'i",
    saving: "Olkaa'aa jirta..."
  }
};
const language = localStorage.getItem("language") || "eng";
const t = victimProfileTranslations[language];

const ProfilePage = () => {
  const profile = useSelector((state) => state.auth?.user.client_profile || {});
  const [formData, setFormData] = useState({
    gender: profile.gender || "",
    age_group: profile.age_group || "",
    client_type: profile.client_type || "",
    preferred_name: profile.preferred_name || "",
    contact_phone: profile.contact_phone || "",
    emergency_contact: profile.emergency_contact || "",
  });

  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      setFormData((prevData) => {
        const hasChanges =
          prevData.gender !== (profile.gender || "") ||
          prevData.age_group !== (profile.age_group || "") ||
          prevData.client_type !== (profile.client_type || "") ||
          prevData.preferred_name !== (profile.preferred_name || "") ||
          prevData.contact_phone !== (profile.contact_phone || "") ||
          prevData.emergency_contact !== (profile.emergency_contact || "");

        if (hasChanges) {
          return {
            gender: profile.gender || "",
            age_group: profile.age_group || "",
            client_type: profile.client_type || "",
            preferred_name: profile.preferred_name || "",
            contact_phone: profile.contact_phone || "",
            emergency_contact: profile.emergency_contact || "",
          };
        }
        return prevData;
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
    };

    dispatch(completeClientProfile(payload));

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-green-600" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{t.profileInfo}</h1>
                  <p className="text-green-100 mt-1">{t.updateDetails}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Success Message */}
              {showSuccessMessage && (
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded animate-fade-in-down">
                  {t.success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-800">{t.personalInfo}</h2>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6"></div>
                  </div>

                  {/* Preferred Name */}
                  <div>
                    <label htmlFor="preferred_name" className="block text-sm font-medium text-gray-700">
                      Preferred Name
                    </label>
                    <input
                      type="text"
                      id="preferred_name"
                      name="preferred_name"
                      value={formData.preferred_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter your preferred name"
                    />
                  </div>

                  {/* Gender */}
                  <div>
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

                  {/* Age Group */}
                  <div>
                    <label htmlFor="age_group" className="block text-sm font-medium text-gray-700">
                      {t.ageGroup}
                    </label>
                    <select
                      id="age_group"
                      name="age_group"
                      value={formData.age_group}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    >
                      <option value="" disabled>
                        {t.selectAge}
                      </option>
                      <option value="under_18">{t.under18}</option>
                      <option value="18_24">{t.age18_24}</option>
                      <option value="25_34">{t.age25_34}</option>
                      <option value="35_44">{t.age35_44}</option>
                      <option value="45_54">{t.age45_54}</option>
                      <option value="55_64">{t.age55_64}</option>
                      <option value="65_plus">{t.age65plus}</option>
                    </select>
                  </div>

                  {/* Client Type */}
                  <div>
                    <label htmlFor="client_type" className="block text-sm font-medium text-gray-700">
                      {t.clientType}
                    </label>
                    <select
                      id="client_type"
                      name="client_type"
                      value={formData.client_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    >
                      <option value="" disabled>
                        {t.selectClientType}
                      </option>
                      <option value="survivor">{t.survivor}</option>
                      <option value="reporter">{t.reporter}</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Contact Information Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Phone className="w-5 h-5 text-green-600" />
                      <h2 className="text-xl font-semibold text-gray-800">{t.contactInfo}</h2>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6"></div>
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                      {t.contactPhone}
                    </label>
                    <input
                      type="tel"
                      id="contact_phone"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
                      {t.emergencyPhone}
                    </label>
                    <input
                      type="tel"
                      id="emergency_contact"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter emergency contact phone"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-10 flex justify-end">
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
  );
};

export default ProfilePage;