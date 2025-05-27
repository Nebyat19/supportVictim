import { Shield, Gavel, Heart, MessageSquare } from "lucide-react";
import About_section from "../assets/about_section.png";

export default function About() {
  // Language translations for About section
  const aboutTranslations = {
    eng: {
      howWorks: "How SupportLine Works",
      intro: "SupportLine is your trusted platform for online sexual abuse protection, offering legal aid, professional therapy, and confidential support.",
      features: [
        {
          title: "Legal Aid",
          description: "Access expert legal assistance to navigate the justice system and protect your rights."
        },
        {
          title: "Professional Therapy",
          description: "Connect with licensed therapists trained in trauma care to support your healing journey."
        },
        {
          title: "Confidential Support",
          description: "Receive discreet and secure support tailored to your unique needs."
        },
        {
          title: "24/7 Messaging",
          description: "Stay connected with our team anytime through secure messaging for ongoing assistance."
        }
      ],
      approachTitle: "Our Commitment to Your Safety and Healing",
      approach1: "At SupportLine, we are dedicated to empowering survivors of sexual abuse by providing accessible and compassionate support.",
      approach2: "Our platform combines legal expertise and therapeutic care to ensure you receive the help you need in a safe and confidential environment.",
      approach3: "Whether you need legal guidance, emotional support, or someone to listen, we are here to stand by your side every step of the way."
    },
    amh: {
      howWorks: "SupportLine እንዴት እንደሚሰራ",
      intro: "SupportLine የምስጢራዊ ድጋፍና የህግ እርዳታ እና የሙያ ስነ-ምግባር ምክርን ያቀርባል።",
      features: [
        {
          title: "የህግ እርዳታ",
          description: "የህግ አገልግሎትን ለመጠቀም እና መብቶችዎን ለማስቀመጥ የተሟላ ድጋፍ ያግኙ።"
        },
        {
          title: "የሙያ ስነ-ምግባር",
          description: "በትምህርት የተሟላ ታካሚዎችን ለመጠቀም ያግኙ።"
        },
        {
          title: "የምስጢራዊ ድጋፍ",
          description: "በምስጢራዊነት እና በደህንነት የተሟላ ድጋፍ ያግኙ።"
        },
        {
          title: "24/7 የመልእክት ድጋፍ",
          description: "በማንኛውም ጊዜ ከቡድናችን ጋር በመልእክት ይገናኙ።"
        }
      ],
      approachTitle: "የእርዳታና የፈውስ ተስፋችን",
      approach1: "SupportLine ለተጎዳኘው የምስጢራዊ እና የህግ ድጋፍን ያቀርባል።",
      approach2: "መድረካችን የህግ እና የስነ-ምግባር እርዳታን በምስጢራዊነት ያቀርባል።",
      approach3: "የህግ መምሪያ፣ የአእምሮ ድጋፍ ወይም ማንኛውንም ነገር ለመናገር ከፈለጉ እኛ ከእርስዎ ጋር እንቆማለን።"
    },
    orm: {
      howWorks: "Akka SupportLine Hojjetu",
      intro: "SupportLine deggersa iccitii fi ogeeyyii seeraa fi fayyaa sammuu siif dhiheessa.",
      features: [
        {
          title: "Deggersa Seeraa",
          description: "Deggersa seeraa argachuuf ogeeyyii hayyamamoo waliin hojjedhu."
        },
        {
          title: "Ogeeyyii Fayyaa Sammuu",
          description: "Ogeeyyii leenjii miidhaa qaban waliin wal qunnamu."
        },
        {
          title: "Deggersa Iccitii",
          description: "Deggersa iccitii fi nageenyaan siif kenname argadhu."
        },
        {
          title: "Ergaa 24/7",
          description: "Yeroo kamiyyuu ergaa nageenyaan wal jijjiiri."
        }
      ],
      approachTitle: "Kaayyoo Nageenya Kee",
      approach1: "SupportLine nageenya fi fayyaa kee eegsisuuf qophaa'edha.",
      approach2: "Marsariitiin keenya deggersa seeraa fi fayyaa sammuu iccitii siif dhiheessa.",
      approach3: "Deggersa barbaaddu kamiyyuu argachuuf si waliin hojjenna."
    }
  };

  const language = localStorage.getItem("language") || "eng";
  const t = aboutTranslations[language];

  const features = [
    {
      icon: <Gavel className="h-8 w-8 text-blue-600" />,
      title: "Legal Aid",
      description: "Access expert legal assistance to navigate the justice system and protect your rights."
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "Professional Therapy",
      description: "Connect with licensed therapists trained in trauma care to support your healing journey."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Confidential Support",
      description: "Receive discreet and secure support tailored to your unique needs."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "24/7 Messaging",
      description: "Stay connected with our team anytime through secure messaging for ongoing assistance."
    }
  ];

  return (
    <section id="about" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{t.howWorks}</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">{t.intro}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-blue-50 p-3 rounded-full w-fit mb-4">{features[index].icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <img
                src={About_section}
                alt="Our approach to therapy"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>

            <div className="md:w-1/2">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t.approachTitle}</h3>
              <p className="text-gray-600 mb-6">{t.approach1}</p>
              <p className="text-gray-600 mb-6">{t.approach2}</p>
              <p className="text-gray-600">{t.approach3}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
