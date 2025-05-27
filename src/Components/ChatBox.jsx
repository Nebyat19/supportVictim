"use client"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getChatSocket } from "../socket"
import { sendMessage, getMessages } from "../Redux/Slices/chatSlice"
import { Send, Mic, Paperclip, Smile } from "lucide-react"
import { Link } from "react-router-dom"

const ChatBox = ({ room, userId }) => {
  const [message, setMessage] = useState("")
  const dispatch = useDispatch()
  const chatSocket = useRef(null)
  const { messages = [] } = useSelector((state) => state.chat || {})
  const [localMessages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const { user } = useSelector((state) => state.auth)
  const allMessages = [...messages, ...localMessages].sort((a, b) => new Date(a.time) - new Date(b.time))

  console.log(" role", user.role)
  useEffect(() => {
    if (!room) {
      console.error("❌ Room is not defined.")
      return
    }

    const token = localStorage.getItem("token")
    console.log("🔑 Token retrieved:", token)

    const socket = getChatSocket(token)

    if (!socket) {
      console.error("❌ Failed to initialize chat socket.")
      return
    }

    console.log("✅ Chat socket initialized:", socket)

    chatSocket.current = socket

    socket.on("connect", () => {
      console.log("✅ Connected to chat server")
      console.log(`🔗 Joining room: ${room}`)
      socket.emit("joinRoom", { room_name: room })
    })

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message)
    })

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected, attempting reconnection...")
      setTimeout(() => {
        chatSocket.current?.connect()
      }, 3000)
    })

    socket.on("newMessage", (newMsg) => {
      console.log(`📩 Received message from server:`, newMsg)

      // Avoid adding duplicate messages
      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg.time === newMsg.time && msg.sender_id === newMsg.sender_id)
        if (isDuplicate) return prev
        return [...prev, newMsg]
      })
    })

    dispatch(getMessages({ room_name: room }))

    return () => {
      if (chatSocket.current) {
        console.log("🔌 Disconnecting chat socket...")
        chatSocket.current.disconnect()
      }
    }
  }, [dispatch, room])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [allMessages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Emit the message to the server
    chatSocket.current?.emit("sendMessage", { room_name: room, message, sender_id: userId })

    // Dispatch the message to save it in the database
    dispatch(sendMessage({ room_name: room, message, sender_id: userId }))

    // Clear the input field
    setMessage("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timeString) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Chat Header */}
      {user?.role === "client" ? (
        <Link to={"/supporterProfile"}>
          <div className="bg-emerald-600 text-white px-4 py-3 flex items-center cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold mr-3">
              S
            </div>
            <div>
              <h2 className="font-semibold">Support Chat</h2>
              <p className="text-xs text-emerald-100">Online</p>
            </div>
          </div>
        </Link>
      ) : (
        <div className="bg-emerald-600 text-white px-4 py-3 flex items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold mr-3">
            S
          </div>
          <div>
            <h2 className="font-semibold">Support Chat</h2>
            <p className="text-xs text-emerald-100">Online</p>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ded8] border-b border-gray-200"
        style={{
          minHeight: "350px",
          maxHeight: "420px",
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1zbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1zbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzVBRUUzOEI3QjcyMTFFQThFMThGNjhCQkU2RjlFQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzVBRUUzOEM3QjcyMTFFQThFMThGNjhCQkU2RjlFQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NUFFRTM4OTdCNzIxMUVBOEUxOEY2OEJCRTZGOUVBM+KAoiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NUFFRTM4QTdCNzIxMUVBOEUxOEY2OEJCRTZGOUVBM+KAoiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj95Hs0AAABnSURBVHjaYvz//z8DGdgFiP8TBCxEKL2MX+k1BgYmBrKBC9CsZ0aY8uoqFmBJYWFhIg3cuWMHXClRBv78+RNuIBMxKv/8+QNXR5SBv3//hqtjIsrAP3/+oKgj1kAGYgETQIABAENaIhLMSm8wAAAAAElFTkSuQmCC')",
          backgroundRepeat: "repeat",
        }}
      >
        {allMessages.map((msg, index) => {
          const isCurrentUser = msg.sender_id === userId
          return (
            <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                  isCurrentUser ? "bg-emerald-100 rounded-tr-none" : "bg-white rounded-tl-none"
                }`}
              >
                <p className="text-gray-800">{msg.message}</p>
                <span className="text-xs text-gray-500 flex justify-end mt-1">{formatTime(msg.time)}</span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-700">
            <Smile size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          {message.trim() ? (
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
            >
              <Send size={18} />
            </button>
          ) : (
            <button className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
              <Mic size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatBox
