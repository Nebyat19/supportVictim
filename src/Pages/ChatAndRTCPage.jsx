"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAssignedRoom } from "../Redux/Slices/chatSlice"
import { me } from "../Redux/Slices/authSlice"
import ChatBox from "../Components/ChatBox"
import VideoCall from "../Components/VideoCall"

const ChatAndRTCPage = () => {
  const dispatch = useDispatch()
  
  const { assignedRoom } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.auth)
  const room = "room_61fff2a54bed"

  useEffect(() => {
    dispatch(me()).then((action) => {
      if (action.payload?.id) {
        dispatch(getAssignedRoom({ userId: action.payload.id }))
      }
    })
  }, [dispatch])

  //console.log("get assigned room", assignedRoom);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              {user?.username?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Chat Box */}
          <div className="h-full">
            <ChatBox room={room} userId={user?.id} />
          </div>

          {/* Video Call */}
          <div className="h-full">
            <VideoCall room={room} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatAndRTCPage
