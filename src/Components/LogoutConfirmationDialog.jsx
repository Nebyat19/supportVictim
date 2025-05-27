"use client"

import { useEffect, useState } from "react"

export default function SimpleDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Logout",
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  // Language translations for LogoutConfirmationDialog
  const logoutTranslations = {
    eng: {
      areYouSure: "Are you sure want to logout?",
      cancel: "Cancel",
      logout: "Logout",
    },
    amh: {
      areYouSure: "እርግጠኛ ነዎት ለመውጣት?",
      cancel: "ይቅር",
      logout: "ውጣ",
    },
    orm: {
      areYouSure: "Ba'uuf mirkaneeffataa?",
      cancel: "Haquu",
      logout: "Ba'i",
    },
  }
  const language =
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "eng"
      : "eng"
  const t = logoutTranslations[language]

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center h-screen ${
        isOpen ? "opacity-100" : "opacity-100 pointer-events-none"
      } transition-opacity duration-300`}
    >
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div
        className={`relative w-11/12 max-w-sm rounded-lg bg-white p-6 shadow-xl ${
          isOpen ? "scale-100" : "scale-95"
        } transition-all duration-300`}
      >
        {/* Title */}
        <h3 className="mb-3 text-xl font-bold">{title}</h3>

        {/* Description */}
        <p className="mb-6 text-gray-600">{t.areYouSure}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            {t.logout}
          </button>
        </div>
      </div>
    </div>
  )
}
