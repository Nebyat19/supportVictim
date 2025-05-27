import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitRating, clearRateState, fetchSupporterProfile } from "../Redux/Slices/rateSlice";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Loading from "../Components/Loading"
import { useNavigate } from "react-router-dom";

const VolunteerProfile = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error, supporterProfile } = useSelector((state) => state.rate);
  const getAssignedRoom = useSelector((state) => state.chat);

  // Extract client_id and supporterId from chat messages
  let client_id = null;
  let supporterId = null;
  if (getAssignedRoom && Array.isArray(getAssignedRoom.messages) && getAssignedRoom.messages.length > 0 && user) {
    // Get unique sender IDs
    const senderIds = [
      ...new Set(getAssignedRoom.messages.map((msg) => msg.sender_id)),
    ];
    // The client is the logged-in user
    client_id = user?.id;
    // The supporter is the other participant
    supporterId = senderIds.find((id) => id !== user.id);
  }



  useEffect(() => {
    if (supporterId) {
      dispatch(fetchSupporterProfile(supporterId));
    }
  }, [dispatch, supporterId]);

  // Use a dynamic support_request_id if available, else fallback
  const support_request_id = 1;

  // Extract volunteer and support_profile from the fetched data
  const volunteer = supporterProfile?.volunteer || {};
  const supportProfile = volunteer.support_profile || {};
  const averageRating = supporterProfile?.average_rating || 0;

  useEffect(() => {
    if (success) {
      setRating(0);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        dispatch(clearRateState());
        navigate("/chat"); // Redirect after success
      }, 2500);
    }
  }, [success, dispatch, navigate]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    dispatch(
      submitRating({
        support_request_id,
        client_id,
        support_personnel_id: volunteer.id,
        rating,
      })
    );
  };

  const renderStars = (count, interactive = false) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <button
          key={i}
          className={`${
            interactive ? "cursor-pointer transform hover:scale-110 transition-transform duration-200" : "cursor-default"
          }`}
          onClick={interactive ? () => handleRatingClick(i + 1) : undefined}
          onMouseEnter={interactive ? () => handleRatingHover(i + 1) : undefined}
          onMouseLeave={interactive ? () => handleRatingHover(0) : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-6 h-6 ${
              i < (hoverRating || rating || count)
                ? "text-yellow-400"
                : interactive
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ));
  };

  // Parse specializations and credentials safely
  let specializations = [];
  try {
    if (supportProfile.specializations) {
      specializations = JSON.parse(supportProfile.specializations);
      // Flatten if nested
      if (Array.isArray(specializations) && Array.isArray(specializations[0])) {
        specializations = specializations.flat(Infinity);
      }
    }
  } catch {
    specializations = [];
  }

  let credentials = [];
  try {
    if (supportProfile.credentials) {
      credentials = JSON.parse(supportProfile.credentials);
    }
  } catch {
    credentials = [];
  }

  // Parse languages if present
  let languages = [];
  try {
    if (supportProfile.languages) {
      languages = JSON.parse(supportProfile.languages);
    }
  } catch {
    languages = [];
  }

  // Show loading indicator while fetching supporter profile or submitting review
  if (loading) {
    return (
      <>
        <Navbar />
      
          <Loading />
   
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 text-black">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-200 rounded-2xl blur opacity-75 -z-10"></div>
                <div className="relative bg-white backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-300 hover:border-gray-400 transition-all duration-300">
                  <div className="h-32 bg-gray-300 relative">
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                      <div className="w-32 h-32 rounded-full bg-gray-400 p-1">
                        <img
                          src={supportProfile.profile_image || "/placeholder.svg"}
                          alt={supportProfile.full_name || volunteer.username || "Volunteer"}
                          className="w-full h-full rounded-full object-cover bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-20 pb-6 px-6 text-center">
                    <h1 className="text-2xl font-bold text-black mb-1">
                      {supportProfile.full_name || volunteer.username}
                    </h1>
                    <p className="text-gray-600 mb-2">{supportProfile.support_type}</p>
                    <p className="text-gray-500 mb-2 capitalize">{supportProfile.gender}</p>
                    <p className="text-gray-500 mb-2">{supportProfile.religion}</p>
                    <div className="flex justify-center items-center mb-4">
                      <div className="flex">{renderStars(averageRating)}</div>
                      <span className="ml-2 text-black font-bold">{averageRating}</span>
                    </div>
                    <div className="flex justify-center space-x-4">
                      {volunteer.email && (
                        <a
                          href={`mailto:${volunteer.email}`}
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </a>
                      )}
                      {supportProfile.contact_phone && (
                        <a
                          href={`tel:${supportProfile.contact_phone}`}
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
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
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporter Info Section */}
              <div className="mt-8 relative">
                <div className="absolute inset-0 bg-gray-200 rounded-2xl blur opacity-75 -z-10"></div>
                <div className="relative bg-white backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-300 p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Supporter Info</h2>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Role:</span> {volunteer.role}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Registration Date:</span>{" "}
                    {volunteer.registration_date && new Date(volunteer.registration_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Verification Status:</span> {supportProfile.verification_status}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Years of Experience:</span> {supportProfile.years_of_experience}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Specializations */}
              <div className="relative">
                <div className="absolute inset-0 bg-gray-200 rounded-2xl blur opacity-75 -z-10"></div>
                <div className="relative bg-white backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-300 p-6">
                  <h2 className="text-2xl font-bold text-black mb-4">Specializations</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {specializations.length > 0
                      ? specializations.map((spec, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-gray-600 text-sm">
                            {spec}
                          </span>
                        ))
                      : <span className="text-gray-400">No specializations listed.</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-4">Languages</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {languages.length > 0
                      ? languages.map((lang, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-gray-600 text-sm">
                            {lang}
                          </span>
                        ))
                      : <span className="text-gray-400">No languages listed.</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-4">Credentials</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {credentials.length > 0
                      ? credentials.map((cred, idx) => (
                          <a
                            key={idx}
                            href={cred.startsWith("http") ? cred : `/storage/${cred}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-200 rounded-full text-blue-700 text-sm underline"
                          >
                            Credential {idx + 1}
                          </a>
                        ))
                      : <span className="text-gray-400">No credentials uploaded.</span>}
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <div className="relative">
                <div className="absolute inset-0 bg-gray-200 rounded-2xl blur opacity-75 -z-10"></div>
                <div className="relative bg-white backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-300 p-6">
                  <h2 className="text-2xl font-bold text-black mb-4">Rate this Volunteer</h2>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-6">
                      <label className="block text-gray-600 mb-2">Your Rating</label>
                      <div className="flex">{renderStars(0, true)}</div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || rating === 0}
                      className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all duration-300 ${
                        loading || rating === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {loading ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                  {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}
                </div>
              </div>
            </div>
          </div>
          {/* Popup for success */}
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white border border-green-400 rounded-lg shadow-lg px-8 py-6 flex flex-col items-center">
                <svg className="w-10 h-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 font-semibold text-lg">Thank you for your review!</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VolunteerProfile;
