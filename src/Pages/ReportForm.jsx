import ReportForm from "../Components/ReportForm"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
export default function Home() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-center text-2xl font-bold text-blue-800 mb-6">Confidential Incident Report Form</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <ReportForm />
        </div>
      </div>
    </main>
    
    <Footer />
    </>
  )
}
