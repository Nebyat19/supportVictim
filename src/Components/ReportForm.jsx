import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { submitReport, clearReportState } from "../Redux/Slices/reportSlice"

export default function ReportForm() {
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [mediaFile, setMediaFile] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const dispatch = useDispatch()
  const { loading, success, error } = useSelector((state) => state.report)

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file && (file.type.startsWith("audio/") || file.type.startsWith("video/"))) {
      setMediaFile(file)
    } else {
      alert("Please upload a valid audio or video file.")
      e.target.value = null
      setMediaFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("date", date)
    formData.append("location", location)
    formData.append("description", description)
    formData.append("serviceType", "direct_report") // Pass the service type as "direct_report"

    // Attach the media file as "voice" if present
    if (mediaFile) {
      formData.append("voice", mediaFile)
    }

    dispatch(submitReport(formData))
  }

  useEffect(() => {
    if (success) {
      setDate("")
      setLocation("")
      setDescription("")
      setMediaFile(null)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        dispatch(clearReportState())
      }, 2500)
    }
  }, [success, dispatch])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-green-400 rounded-lg shadow-lg px-8 py-6 flex flex-col items-center">
            <svg className="w-10 h-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700 font-semibold text-lg">Report submitted successfully!</span>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-blue-700 mb-1">
          Date of Incident*
        </label>
        <input
          type="date"
          id="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-blue-700 mb-1">
          Location*
        </label>
        <input
          type="text"
          id="location"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where did this happen?"
          className="w-full px-3 py-2 border border-green-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-blue-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe what happened..."
          className="w-full px-3 py-2 border border-green-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
        />
      </div>

      <div>
        <label htmlFor="media" className="block text-sm font-medium text-blue-700 mb-1">
          Upload Media File (Audio/Video, Optional)
        </label>
        <input
          type="file"
          id="media"
          accept="audio/*,video/*"
          onChange={handleMediaChange}
          className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm"
        />
        {mediaFile && (
          <div className="mt-2 text-xs text-green-700">
            Selected file: {mediaFile.name}
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"}`}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-2">Error: {error}</p>}
      <p className="text-xs text-gray-500 mt-2">* Required fields. All reports are kept strictly confidential.</p>
    </form>
  )
}
