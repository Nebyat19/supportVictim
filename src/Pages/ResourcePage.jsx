"use client"

import { useState, useEffect, Fragment, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchResources } from "../Redux/Slices/resourceSlice"
import { Play, FileText, BookOpen, Download, Clock, Calendar, User, Heart, Scale } from "lucide-react"
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import Loading from "../Components/Loading"

export default function ResourcePage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState(null);
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources || []) // Ensure resources is always an array
  const loading = useSelector((state) => state.resources.loading)
  const error = useSelector((state) => state.resources.error) // Select error state

  useEffect(() => {
    dispatch(fetchResources())
  }, [dispatch])

  console.log("Resources:", resources.resources); // Debugging line to check the resources
  // Filter resources based on active filter
  const filteredResources = Array.isArray(resources.resources)
    ? activeFilter === "all"
      ? resources.resources // Correctly access the array of resources
      : resources.resources.filter((resource) => resource.type.toLowerCase() === activeFilter)
    : [] // Ensure filteredResources is always an array

    if(loading){
      return(
        <Loading />
      )
    }

  return (
    <>
      <Navbar />
      {/* Article Popup Modal */}
      {selectedArticle && (
        <ArticlePopup article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 mb-4">Support Resources</h1>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-10 max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              <FilterButton
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
                label="All Resources"
              />
              <FilterButton
                active={activeFilter === "video"}
                onClick={() => setActiveFilter("video")}
                icon={<Play size={16} />}
                label="Video Guides"
              />
              <FilterButton
                active={activeFilter === "pdf"}
                onClick={() => setActiveFilter("pdf")}
                icon={<FileText size={16} />}
                label="Downloadable Guides"
              />
              <FilterButton
                active={activeFilter === "article"}
                onClick={() => setActiveFilter("article")}
                icon={<BookOpen size={16} />}
                label="Articles"
              />
            </div>
          </div>

          {/* Resources Grid */}
          {error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-500">Failed to load resources: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => {
                const type = resource.type?.toLowerCase();
                if (type === "video") return <VideoCard key={resource.id} video={resource} />;
                if (type === "pdf") return <PDFCard key={resource.id} pdf={resource} />;
                if (type === "blog" || type === "article")
                  return (
                    <BlogCard
                      key={resource.id}
                      blog={resource}
                      onReadArticle={() => setSelectedArticle(resource)}
                    />
                  );
                return null;
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredResources.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No resources found for this category.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

// Filter Button Component
function FilterButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{label}</span>
    </button>
  )
}

// Video Card Component
function VideoCard({ video }) {
  const isLegal = video.category === "legal"

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4 text-white">
            <div className="flex items-center">
              <Play size={16} className="mr-1" />
              <span>{video.duration}</span>
            </div>
          </div>
        </div>
        <div
          className={`absolute top-3 right-3 ${isLegal ? "bg-blue-600" : "bg-teal-600"} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center`}
        >
          {isLegal ? <Scale size={12} className="mr-1" /> : <Heart size={12} className="mr-1" />}
          {isLegal ? "LEGAL" : "MENTAL HEALTH"}
        </div>
      </div>
      <div className="p-5">
        <h3 className={`text-xl font-bold ${isLegal ? "text-blue-700" : "text-teal-700"} mb-2`}>{video.title}</h3>
        <p className="text-gray-600 mb-4">{video.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock size={14} className="mr-1" />
          <span className="mr-4">{video.duration}</span>
          <Calendar size={14} className="mr-1" />
          <span>{video.date}</span>
        </div>
        <a
          href={video.url}
          className={`block w-full text-center ${
            isLegal
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
          } text-white font-medium py-2 rounded-lg transition-colors duration-300`}
        >
          Watch Video
        </a>
      </div>
    </div>
  )
}

// PDF Card Component
function PDFCard({ pdf }) {
  const isLegal = pdf.category === "legal"

  return (
    <div
      className={`bg-gradient-to-br ${isLegal ? "from-blue-50 to-blue-100" : "from-teal-50 to-teal-100"} rounded-xl overflow-hidden shadow-lg border ${isLegal ? "border-blue-200" : "border-teal-200"}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`${isLegal ? "bg-blue-100" : "bg-teal-100"} rounded-lg p-3`}>
            <FileText size={24} className={`${isLegal ? "text-blue-700" : "text-teal-700"}`} />
          </div>
          <div
            className={`${isLegal ? "bg-blue-600" : "bg-teal-600"} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center`}
          >
            {isLegal ? <Scale size={12} className="mr-1" /> : <Heart size={12} className="mr-1" />}
            {isLegal ? "LEGAL" : "MENTAL HEALTH"}
          </div>
        </div>
        <h3 className={`text-xl font-bold ${isLegal ? "text-blue-700" : "text-teal-700"} mb-2`}>{pdf.title}</h3>
        <p className="text-gray-600 mb-4">{pdf.description}</p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div
            className={`${isLegal ? "bg-blue-100 text-blue-800" : "bg-teal-100 text-teal-800"} text-xs font-medium px-2.5 py-1 rounded-full`}
          >
            {pdf.pages} pages
          </div>
          <div
            className={`${isLegal ? "bg-blue-100 text-blue-800" : "bg-teal-100 text-teal-800"} text-xs font-medium px-2.5 py-1 rounded-full`}
          >
            {pdf.fileSize}
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-5">
          <User size={14} className="mr-1" />
          <span className="mr-4">{pdf.author}</span>
          <Calendar size={14} className="mr-1" />
          <span>{pdf.date}</span>
        </div>
        <a
          href={pdf.url}
          download
          className={`flex items-center justify-center w-full ${
            isLegal
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
          } text-white font-medium py-2.5 rounded-lg transition-colors duration-300`}
        >
          <Download size={16} className="mr-2" />
          Download Guide
        </a>
      </div>
    </div>
  )
}

// Blog Card Component
function BlogCard({ blog, onReadArticle }) {
  const isLegal = blog.category === "legal";

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-t-4 ${isLegal ? "border-blue-500" : "border-teal-500"}`}
    >
      <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <div
            className={`${isLegal ? "bg-blue-100 text-blue-800" : "bg-teal-100 text-teal-800"} text-xs font-bold px-2 py-1 rounded-full flex items-center`}
          >
            {isLegal ? <Scale size={12} className="mr-1" /> : <Heart size={12} className="mr-1" />}
            {isLegal ? "LEGAL" : "MENTAL HEALTH"}
          </div>
          <div className="text-sm text-gray-500">{blog.readTime}</div>
        </div>
        <h3 className={`text-xl font-bold ${isLegal ? "text-blue-700" : "text-teal-700"} mb-2`}>{blog.title}</h3>
        <p className="text-gray-600 mb-4">{blog.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User size={14} className="mr-1" />
          <span className="mr-4">{blog.author}</span>
          <Calendar size={14} className="mr-1" />
          <span>{blog.date}</span>
        </div>
        <button
          onClick={onReadArticle}
          className={`block w-full text-center ${
            isLegal
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              : "bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
          } text-white font-medium py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg`}
        >
          Read Article
        </button>
      </div>
    </div>
  );
}

// Article Popup Modal Component
function ArticlePopup({ article, onClose }) {
  const modalRef = useRef();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 animate-fadeIn"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <img
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            className="w-32 h-32 object-cover rounded-full shadow-lg mb-4 border-4 border-teal-100"
          />
          <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center">{article.title}</h2>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <User size={16} className="mr-1" />
            <span className="mr-4">{article.author}</span>
            <Calendar size={16} className="mr-1" />
            <span>{article.date}</span>
            {article.readTime && (
              <>
                <span className="mx-2">•</span>
                <span>{article.readTime}</span>
              </>
            )}
          </div>
          <div className="w-full max-h-[50vh] overflow-y-auto text-gray-700 text-lg leading-relaxed px-2 py-4 border-t border-b border-gray-200">
            {article.content || article.description}
          </div>
        </div>
      </div>
    </div>
  );
}
