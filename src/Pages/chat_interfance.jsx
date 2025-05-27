"use client"

import { useState } from "react"
import { Sidebar } from "../Components/sidebar"
import { ChatArea } from "../Components/chat_area"
import { CallOverlay } from "../Components/call_overlay"

export default function ChatInterface() {
  const [activeChat, setActiveChat] = useState("1")
  const [activeCall, setActiveCall] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)

  const handleStartCall = (type, userId) => {
    setActiveCall({
      type,
      user: userId,
      active: true,
    })
  }

  const handleEndCall = () => {
    setActiveCall(null)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Mobile sidebar - shown/hidden based on state */}
      <div
        className={`fixed inset-0 z-20 transform ${showSidebar ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-0`}
      >
        <Sidebar
          activeChat={activeChat}
          setActiveChat={(id) => {
            setActiveChat(id)
            setShowSidebar(false) // Close sidebar on mobile after selection
          }}
        />
      </div>

      {/* Overlay to close sidebar on mobile */}
      {showSidebar && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" onClick={() => setShowSidebar(false)} />
      )}

      <ChatArea activeChat={activeChat} onStartCall={handleStartCall} toggleSidebar={toggleSidebar} />

      {activeCall && <CallOverlay type={activeCall.type} userId={activeCall.user} onEndCall={handleEndCall} />}
    </div>
  )
}
