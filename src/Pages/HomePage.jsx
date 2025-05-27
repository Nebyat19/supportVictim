import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import About from "../Components/About";
import Footer from "../Components/Footer";
import PopupMessage from "../Components/PopupMessage"; // Import PopupMessage
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Home() {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  // Show popup only if user is logged in and does NOT have full_name in support_profile or gender in client_profile
  const [showPopup, setShowPopup] = useState(
    !!token && !(user?.support_profile?.full_name || user?.client_profile?.gender)
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      {showPopup && (
        <PopupMessage
          message="Complete your profile to get started!"
          onClose={() => setShowPopup(false)}
        />
      )}
      <Hero />
      <About />
      <Footer />
    </main>
  );
}
