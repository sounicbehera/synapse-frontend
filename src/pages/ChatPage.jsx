import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, LogOut, Search, Send, Loader2 } from 'lucide-react';
import io from 'socket.io-client'; // 1. Import Socket Client
import UserListItem from '../components/UserListItem';
import ScrollableChat from '../components/ScrollableChat';

// Point this to your backend server URL
const ENDPOINT = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
let socket;

const ChatPage = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chats, setChats] = useState([]); // Will hold active conversation threads
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Keep a mutable reference of selectedChat available inside the socket listener
  const selectedChatRef = useRef(selectedChat);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // --- INITIALIZE ACCOUNTS AND SOCKET CONNECTION ---
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) setUser(userInfo);

    // Establish persistent socket highway link
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
  }, []); // Must remain an empty array dependency!

  // --- SOCKET LISTENER FOR INCOMING REAL-TIME PACKETS ---
  useEffect(() => {
    if (!socket) return;
    socket.on("message received", (newMessageReceived) => {
      if (!newMessageReceived || !newMessageReceived.chat) return;
      const incomingChatId = newMessageReceived.chat._id || newMessageReceived.chat;
      if (selectedChatRef.current && selectedChatRef.current._id === incomingChatId) {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
      moveChatToTop(newMessageReceived.chat);
    });
    return () => socket.off("message received");
  }, []);

  // Helper function to shift a chat item to the top of the sidebar array
  const moveChatToTop = (chatToMove) => {
    if (!chatToMove) return;
    setChats((prevChats) => {
      const chatId = chatToMove._id || chatToMove;
      const existingChat = prevChats.find((c) => c._id === chatId);
      const chatObject = (typeof chatToMove === "object" && chatToMove._id) ? chatToMove : existingChat;

      if (!chatObject) return prevChats;

      const filtered = prevChats.filter((c) => c._id !== chatId);
      return [chatObject, ...filtered];
    });
  };

  // --- FETCH ACTIVE CHATS FOR THE SIDEBAR ---
  const fetchChats = async (currentUser) => {
    try {
      const res = await fetch(`${ENDPOINT}/api/chat`, {
        method: "GET",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const data = await res.json();
      if (res.ok) setChats(data);
    } catch (err) {
      console.error("Failed to load sidebar synapses:", err.message);
    }
  };

  useEffect(() => {
    if (user) fetchChats(user);
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      setSearchLoading(true);
      const res = await fetch(`${ENDPOINT}/api/user?search=${search}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSearchResults(data);
    } catch (err) {
      alert("Failed to fetch search nodes.");
    } finally {
      setSearchLoading(false);
    }
  };

  const accessChatRoom = async (userId) => {
    try {
      const res = await fetch(`${ENDPOINT}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Move or append this chat cleanly onto the top of the local state stack
      moveChatToTop(data);
      setSelectedChat(data);
      setSearch("");
      setSearchResults([]); // Clear search result view back to active chats list
    } catch (err) {
      console.error("Chat Routing Error:", err.message);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setMessagesLoading(true);
      const res = await fetch(`${ENDPOINT}/api/message/${selectedChat._id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessages(data);
      // Tell the server we are entering this specific room channel
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      console.error("Message Fetch Error:", err.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const sendNewMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageContent = newMessage;
      setNewMessage("");

      const res = await fetch(`${ENDPOINT}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: messageContent, chatId: selectedChat._id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Fire the message packet over the WebSocket channel instantly before database updates
      socket.emit("new message", data);

      setMessages([...messages, data]);
      moveChatToTop(selectedChat); // Push our active conversation back to the top layout row
    } catch (err) {
      console.error("Message Dispatch Error:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-100 overflow-hidden">

      {/* PANEL 1: MINI NAV BAR */}
      <div className="w-16 bg-slate-900 border-r border-slate-800/60 flex flex-col items-center justify-between py-6">
        <div className="flex flex-col items-center gap-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
            S
          </div>
          <button className="p-3 bg-slate-800 text-cyan-400 rounded-xl transition-colors">
            <MessageSquare size={20} />
          </button>
        </div>

        {/* PANEL 1: MINI NAV BAR - USER PROFILE TARGET */}
        <div className="flex flex-col items-center gap-4">
          <img 
            src={
              user?.pic 
                ? user.pic.replace("http://", "https://") 
                : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            } 
            alt="Logged In User Private Avatar" 
            className="h-9 w-9 rounded-full border border-slate-700 object-cover shadow-sm shadow-cyan-500/10"
          />
          <button 
            onClick={handleLogout} 
            className="p-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* PANEL 2: LATERAL CHAT ROOM INDEX */}
      <div className="w-80 bg-slate-900/40 border-r border-slate-800/60 flex flex-col">
        <div className="p-4 border-b border-slate-800/40">
          <h2 className="text-xl font-bold tracking-tight mb-4">Synapses</h2>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search or start new chat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800/80 rounded-xl py-2.5 pl-4 pr-10 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/40 transition-colors"
            />
            <button type="submit" className="absolute right-3 top-3 text-slate-500 hover:text-cyan-400 transition-colors">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Dynamic List Rendering (Search Results OR Active Chats) */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-1">
          {searchLoading ? (
            <div className="flex items-center justify-center py-8 text-slate-500 gap-2 text-sm">
              <Loader2 className="animate-spin text-cyan-500" size={18} />
              Searching Directory...
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-cyan-500/70 tracking-wider uppercase mb-3 px-2">Search Results</p>
              {searchResults.map((searchUser) => (
                <UserListItem
                  key={searchUser._id}
                  user={searchUser}
                  handleFunction={() => accessChatRoom(searchUser._id)}
                />
              ))}
            </div>
          ) : chats.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3 px-2">Recent Connections</p>
              {chats.map((chat) => {
                const chatUser = chat.isGroupChat ? null : chat.users?.find((u) => u._id !== user?._id);
                const isSelected = selectedChat?._id === chat._id;
                return (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full flex items-center gap-3 p-3 mb-2 rounded-xl border transition-all duration-150 cursor-pointer ${isSelected
                      ? 'bg-gradient-to-r from-slate-800 to-slate-800/40 border-cyan-500/40 text-cyan-400'
                      : 'bg-slate-900/20 border-slate-800/40 hover:bg-slate-800/40 text-slate-300'
                      }`}
                  >
                    <img
                      src={chat.isGroupChat ? "https://icon-library.com/images/group-icon/group-icon-10.jpg" : chatUser?.pic}
                      className="h-9 w-9 rounded-full object-cover border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{chat.isGroupChat ? chat.chatName : chatUser?.name}</p>
                      {chat.latestMessage && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{chat.latestMessage.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-600">
              No recent channels established.
            </div>
          )}
        </div>
      </div>

      {/* PANEL 3: CHAT HUB WINDOW VIEWPORT */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {selectedChat ? (
          <>
            <div className="h-16 border-b border-slate-800/40 flex items-center justify-between px-6 bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                  <img
                    src={selectedChat.isGroupChat ? "https://icon-library.com/images/group-icon/group-icon-10.jpg" : selectedChat.users?.find(u => u._id !== user?._id)?.pic}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    {selectedChat.isGroupChat ? selectedChat.chatName : selectedChat.users?.find(u => u._id !== user?._id)?.name}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium">
                    {socketConnected ? "Real-Time Node Sync Active" : "REST Link Pipeline Active"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end bg-slate-950/20">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <Loader2 className="animate-spin text-cyan-500" size={24} />
                </div>
              ) : (
                <ScrollableChat messages={messages} loggedInUser={user} />
              )}
            </div>

            <div className="p-4 bg-slate-900/10 border-t border-slate-800/40">
              <form onSubmit={sendNewMessage} className="flex items-center gap-3 max-w-4xl mx-auto">
                <input
                  type="text"
                  placeholder="Transmit encrypted message token..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-500/40 transition-colors"
                />
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl shadow-lg shadow-cyan-600/10 transition-colors active:scale-95">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
            <div className="p-4 bg-slate-900/60 rounded-full border border-slate-800 text-cyan-400 mb-4 animate-pulse">
              <MessageSquare size={32} />
            </div>
            <h4 className="text-base font-semibold text-slate-300">Synchronize a Node</h4>
            <p className="text-xs text-slate-500 mt-1">
              Select a cognitive user synapse node from the sidebar registry array to secure an active live connection pipeline.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatPage;