import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyForVolunteer, resetVolunteerState } from "../Redux/Slices/supporterApplySlice";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

// Language translations for SupportApplyPage
const supportApplyTranslations = {
  eng: {
    title: "Volunteer Application",
    submitting: "Submitting...",
    document: "Document",
    remove: "Remove",
    docTitle: "Document Title *",
    docTitlePlaceholder: "Enter document title",
    titleRequired: "Title is required",
    uploadDoc: "Upload Document *",
    uploadFile: "Upload a file",
    fileRequired: "File is required",
    selected: "Selected:",
    addAnother: "+ Add Another Document",
    submit: "Submit Application",
    submittingBtn: "Submitting...",
    pdfNote: "PDF, DOC, DOCX up to 10MB"
  },
  amh: {
    title: "የበጎ ፈቃድ ማመልከቻ",
    submitting: "በማስገባት ላይ...",
    document: "ሰነድ",
    remove: "አስወግድ",
    docTitle: "የሰነዱ ርዕስ *",
    docTitlePlaceholder: "የሰነዱን ርዕስ ያስገቡ",
    titleRequired: "ርዕሱ አስፈላጊ ነው",
    uploadDoc: "ሰነድ ያስገቡ *",
    uploadFile: "ፋይል ያስገቡ",
    fileRequired: "ፋይሉ አስፈላጊ ነው",
    selected: "የተመረጠ:",
    addAnother: "+ ሌላ ሰነድ ያክሉ",
    submit: "ማመልከቻ ያስገቡ",
    submittingBtn: "በማስገባት ላይ...",
    pdfNote: "PDF, DOC, DOCX እስከ 10MB"
  },
  orm: {
    title: "Galmee Gargaaraa",
    submitting: "Ergaa jira...",
    document: "Dokumantii",
    remove: "Haquu",
    docTitle: "Mata-duree Dokumantii *",
    docTitlePlaceholder: "Mata-duree dokumantii galchi",
    titleRequired: "Mata-dureen dirqama",
    uploadDoc: "Dokumantii fe'i *",
    uploadFile: "Faayili fe'i",
    fileRequired: "Faayili dirqama",
    selected: "Kan filatame:",
    addAnother: "+ Dokumantii biraa dabaluu",
    submit: "Galmee ergi",
    submittingBtn: "Ergaa jira...",
    pdfNote: "PDF, DOC, DOCX hanga 10MB"
  }
};
const language = localStorage.getItem("language") || "eng";
const t = supportApplyTranslations[language];

export default function SupportApply() {
  const [documents, setDocuments] = useState([{ id: 1, title: "", file: null }]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const dispatch = useDispatch();
  
  const { loading, message, error } = useSelector((state) => state.supportApply);

  useEffect(() => {
    // Reset the state when component mounts
    return () => {
      dispatch(resetVolunteerState());
    };
  }, [dispatch]);

  const handleChange = (id, field, value) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc)));
  };

  const handleFileChange = (id, files) => {
    if (files.length > 0) {
      handleChange(id, "file", files[0]);
    }
  };

  const addDocument = () => {
    const newId = Math.max(...documents.map((doc) => doc.id), 0) + 1;
    setDocuments([...documents, { id: newId, title: "", file: null }]);
  };

  const removeDocument = (id) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Validate form
    if (documents.some(doc => !doc.title || !doc.file)) {
      return;
    }

    const formData = new FormData();

    // Append each file as credentials[]
    documents.forEach((doc) => {
      formData.append("credentials[]", doc.file);
    });

    try {
      await dispatch(applyForVolunteer(formData)).unwrap();
      // Reset form after successful submission
      setDocuments([{ id: 1, title: "", file: null }]);
      setSubmitAttempted(false);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
<>
<Navbar />
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-green-200">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">{t.title}</h2>

          {loading && <p className="text-center text-blue-500">{t.submitting}</p>}
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 border border-blue-200 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-blue-700">{t.document} #{doc.id}</h3>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      {t.remove}
                    </button>
                  )}
                </div>

                <div>
                  <label htmlFor={`title-${doc.id}`} className="block text-sm font-medium text-blue-700 mb-1">
                    {t.docTitle}
                  </label>
                  <input
                    type="text"
                    id={`title-${doc.id}`}
                    value={doc.title}
                    onChange={(e) => handleChange(doc.id, "title", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={t.docTitlePlaceholder}
                  />
                  {submitAttempted && !doc.title && (
                    <p className="mt-1 text-sm text-red-600">{t.titleRequired}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`file-${doc.id}`} className="block text-sm font-medium text-blue-700 mb-1">
                    {t.uploadDoc}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-blue-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-blue-600 justify-center">
                        <label
                          htmlFor={`file-${doc.id}`}
                          className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                        >
                          <span>{t.uploadFile}</span>
                          <input
                            id={`file-${doc.id}`}
                            name={`file-${doc.id}`}
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleFileChange(doc.id, e.target.files)}
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-blue-500">{t.pdfNote}</p>
                    </div>
                  </div>
                  {doc.file ? (
                    <p className="mt-2 text-sm text-blue-500">{t.selected} {doc.file.name}</p>
                  ) : submitAttempted ? (
                    <p className="mt-1 text-sm text-red-600">{t.fileRequired}</p>
                  ) : null}
                </div>
              </div>
            ))}

            <div className="flex flex-col space-y-4">
              <button
                type="button"
                onClick={addDocument}
                className="w-full flex justify-center py-2 px-4 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {t.addAnother}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.submittingBtn : t.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

<Footer/>
</>

  );
}