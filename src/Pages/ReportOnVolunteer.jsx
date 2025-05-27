import { useState } from "react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"

// Language translations for ReportOnVolunteer page
const reportTranslations = {
  eng: {
    title: "Report an Issue",
    subtitle: "We're sorry you're experiencing difficulties. Please fill out this form to report any issues with your assigned personnel.",
    description: "Description of the Issue",
    placeholder: "Please provide details about the issue you're experiencing...",
    submit: "Submit Report",
    thankYou: "Thank You!",
    submitted: "Your report has been submitted successfully. Our team will review your issue and get back to you shortly."
  },
  amh: {
    title: "ችግር ያሳውቁ",
    subtitle: "ችግር እየተጋጠማችሁ እንደሆነ እናዝናለን። ከተመደበላችሁ ሰው ጋር ችግር ካለ ይህን ቅፅ ይሙሉ።",
    description: "የችግሩ መግለጫ",
    placeholder: "እየተጋጠማችሁ ያለውን ችግር ዝርዝር ያብራሩ...",
    submit: "ሪፖርት ያቅርቡ",
    thankYou: "አመሰግናለሁ!",
    submitted: "ሪፖርቶ በተሳካ ሁኔታ ተልኳል። ቡድናችን ችግሩን ይመርምራል እና በቅርቡ ይመለሳል።"
  },
  orm: {
    title: "Rakkoo Gabaasi",
    subtitle: "Rakkoo mudateef dhiifama. Namni siif ramadame rakkoo qaba taanaan, foormii kana guuti.",
    description: "Ibsa Rakkoo",
    placeholder: "Rakkoo si mudate ibsi...",
    submit: "Gabaasi Ergi",
    thankYou: "Galatoomi!",
    submitted: "Gabaasni kee milkaa'inaan ergameera. Gareen keenya rakkoo kee ni ilaala, siif deebisa."
  }
};
const language = localStorage.getItem("language") || "eng";
const t = reportTranslations[language];

const ReportPage = () => {
  const [formData, setFormData] = useState({
    description: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        description: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <>

    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          <p className="text-blue-100 mt-1">{t.subtitle}</p>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.thankYou}</h2>
            <p className="text-gray-600">{t.submitted}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-blue-700">
                {t.description}
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder={t.placeholder}
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {t.submit}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
    
    <Footer />
    </>
  )
}

export default ReportPage


