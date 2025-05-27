import { Link } from "react-router-dom";
import Heart from "../assets/favicon.png"

// Language translations for footer
const footerTranslations = {
  eng: {
    about: "SupportLine is your trusted platform for online sexual abuse protection, offering legal aid, professional therapy, and confidential support.",
    quickLinks: "Quick Links",
    home: "Home",
    resource: "Resource",
    support: "Support",
    emergency: "Emergency",
    copyright: `© ${new Date().getFullYear()} SupportLine. All rights reserved.`
  },
  amh: {
    about: "ፕሮቴክቲቭ ቮይስ የእርስዎ የታመነ መድረክ ሲሆን በመስመር ላይ የወሰነ ጥፋት መከላከያ፣ የህግ እርዳታ፣ የባለሙያ ስነ-ልቦና እና የሚያደርጉ የሚያደርጉ ድጋፍ ይሰጣል።",
    quickLinks: "ፈጣን አገናኞች",
    home: "መነሻ",
    resource: "ምንጮች",
    support: "ድጋፍ",
    emergency: "አደጋ",
    copyright: `© ${new Date().getFullYear()} SupportLine. መብት የተጠበቀ ነው።`
  },
  orm: {
    about: "SupportLine bu'uura amansiisaa keessan kan tajaajila marsariitii irratti ittisa miidhaa saalaa, gargaarsa seeraa, yaala ogeessaafi deeggarsa iccitii kennu dha.",
    quickLinks: "Hiriira Ariifachiisaa",
    home: "Mana",
    resource: "Qabeenya",
    support: "Deggersa",
    emergency: "S.O.S.",
    copyright: `© ${new Date().getFullYear()} SupportLine. Mirgi eegamee jira.`
  }
};
const language = localStorage.getItem("language") || "eng";
const t = footerTranslations[language];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src={Heart} alt="Heart" className="h-8 w-8" />
              <span className="ml-2 text-2xl font-extrabold tracking-wide">
               SupportLine
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t.about}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 border-b-2 border-gray-400 inline-block pb-1">
              {t.quickLinks}
            </h3>
            <ul className="space-y-3 md:space-y-0 md:flex md:space-x-6">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
                >
                  {t.home}
                </Link>
              </li>
              <li>
                <Link
                  to="/resource"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
                >
                  {t.resource}
                </Link>
              </li>
              <li>
                <Link
                  to="/supportApply"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
                >
                  {t.support}
                </Link>
              </li>

              <li>
                <Link
                  to="/emergency"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
                >
                  {t.emergency}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-400">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}
