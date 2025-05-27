import { Search, Settings } from "lucide-react"

const contacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Are we still meeting today?",
    time: "10:30 AM",
    unread: 2,
  },

]

export function Sidebar({ activeChat, setActiveChat }) {
  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200 md:max-w-[380px]">
      <div className="p-4 bg-gray-50 flex items-center justify-between">
        <div className="h-7 w-7 rounded-full overflow-hidden">
          <img src="data:image/png;base64,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" alt="User" className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full py-2 pl-9 pr-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${
              activeChat === contact.id ? "bg-gray-100" : ""
            }`}
            onClick={() => setActiveChat(contact.id)}
          >
            <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
              <img
                src={contact.avatar || "/placeholder.svg"}
                alt={contact.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                <span className="text-xs text-gray-500">{contact.time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
            </div>
            {contact.unread > 0 && (
              <div className="ml-2 bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {contact.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
