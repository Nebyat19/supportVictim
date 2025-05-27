import React, { useState, useEffect } from "react";

export default function PopupMessage({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000); // Auto-hide after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 mx-auto max-w-4xl bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg shadow-md z-50">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="text-blue-800 hover:text-blue-600 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
