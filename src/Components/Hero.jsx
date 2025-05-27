import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import hero_image from "../assets/image01.jpg"

// Language translations for hero section
const heroTranslations = {
  eng: {
    title: (
      <>Empower Yourself with <span className="text-blue-600">SupportLine</span></>
    ),
    description: (
      <>
       SupportLine offers <span className="font-medium text-blue-600">online sexual abuse protection</span> through legal aid and professional therapy.  
        Get the support you need from experts who care about your safety and healing.
      </>
    ),
    cta: "Get Started"
  },
  amh: {
    title: (
      <>እርዳታን በ<span className="text-blue-600"> SupportLine</span> ያግኙ</>
    ),
    description: (
      <>
       SupportLine በመስመር ላይ የምስጢራዊ የህግ እርዳታና የሙያ ስነ-ምግባር ምክርን ያቀርባል።  
        ከተሟላ ባለሙያዎች ድጋፍ እና ደህንነት ያግኙ።
      </>
    ),
    cta: "ጀምር"
  },
  orm: {
    title: (
      <>Ofii Kee <span className="text-blue-600">Protected Voice</span> Wajjin Jajjabeessi</>
    ),
    description: (
      <>
       SupportLine deggersa miidhaa saalaa ittisuuf gargaarsa seeraa fi ogeeyyii fayyaa sammuu ni dhiheessa.  
        Nageenya fi fayyaa kee eegsisuuf deggersa argadhu.
      </>
    ),
    cta: "Jalqabi"
  }
};
const language = localStorage.getItem("language") || "eng";
const t = heroTranslations[language];

export default function Hero() {
  return (
    <section className="relative overflow-hidden -mt-8">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 right-0 w-72 h-72 bg-blue-100 rounded-full opacity-70 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-100 rounded-full opacity-70 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text content */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              {t.title}
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              {t.description}
            </p>
            <div className="mt-8 w-1/2 md:w-1/3">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-1 md:px-3 py-2 md:py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {t.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Image container - now taller */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="w-full h-full bg-blue-100 rounded-2xl absolute -top-4 -right-4"></div>
              <img
                src={hero_image}
                alt="Compassionate therapy support"
                className="rounded-2xl shadow-lg relative w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}