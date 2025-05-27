import React from "react"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center px-6 md:px-12 py-16 max-w-md mx-auto">
        <div className="relative mb-8 mx-auto">
          {/* 404 Graphic */}
          <div className="text-[180px] font-bold leading-none">
            <span className="absolute top-0 left-0 text-blue-500 opacity-20 transform -translate-x-4 -translate-y-4">
              404
            </span>
            <span className="absolute top-0 left-0 text-green-500 opacity-20 transform translate-x-4 translate-y-4">
              404
            </span>
            <span className="relative text-blue-600">404</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>


        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            Return Home
          </button>

        </div>
      </div>
    </div>
  )
}
