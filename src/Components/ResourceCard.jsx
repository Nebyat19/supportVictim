
import { useState } from "react"

const ResourceCard = ({ resource }) => {
  const [showVideo, setShowVideo] = useState(false)

  const toggleMedia = () => {
    if (resource.videoUrl) {
      setShowVideo(!showVideo)
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl border border-gray-100">
      <div className="relative">
        {showVideo && resource.videoUrl ? (
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={resource.videoUrl}
              title={resource.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img
            src={resource.imageUrl || "/placeholder.svg"}
            alt={resource.title}
            className="w-full h-52 object-cover"
          />
        )}

        {resource.videoUrl && (
          <button
            onClick={toggleMedia}
            className="absolute bottom-3 right-3 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full shadow-md transition-colors"
            aria-label={showVideo ? "Show image" : "Play video"}
          >
            {showVideo ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>
        )}

        <div className="absolute top-3 left-3">
          <span
            className={`text-white text-xs font-bold px-3 py-1 rounded-full ${
              resource.category === "Psychology" ? "bg-teal-600" : "bg-blue-600"
            }`}
          >
            {resource.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{resource.title}</h3>
        <p className="text-gray-600 mb-5">{resource.description}</p>
        <div className="flex justify-between items-center">
          <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-5 py-2 rounded-lg transition-colors font-medium">
            View Resource
          </button>
          <button className="text-teal-600 hover:text-teal-800 transition-colors p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResourceCard
