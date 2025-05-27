export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center px-6 py-12 max-w-md mx-auto">
        {/* Spinner Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-green-500 rounded-full animate-spin"></div>
          <div
            className="absolute top-2 left-2 w-20 h-20 border-8 border-transparent border-t-blue-500 rounded-full animate-spin"
            style={{ animationDuration: "1.5s" }}
          ></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading</h2>


        {/* Loading Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "0.6s" }}></div>
        </div>
      </div>
    </div>
  )
}
