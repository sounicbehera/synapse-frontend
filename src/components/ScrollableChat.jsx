import React from 'react';

const ScrollableChat = ({ messages, loggedInUser }) => {
    // A. Validate top-level data models cleanly
    if (!messages || !loggedInUser) return null;

    return (
        <div className="flex flex-col gap-2 overflow-y-auto px-2 py-4 custom-scrollbar">
            {messages.map((m) => {
                if (!m || !m.sender) return null; // Early skip broken data nodes

                const isMyMessage = m.sender._id?.toString() === loggedInUser._id?.toString();

                return (
                    <div
                        key={m._id}
                        className={`flex w-full ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className="flex items-end gap-2 max-w-[70%]">
                            {/* Show opponent's avatar on the left row entry */}
                            {!isMyMessage && (
                                <img
                                    src={
                                        m.sender?.pic
                                            ? m.sender.pic.replace("http://", "https://")
                                            : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                                    }
                                    alt={m.sender?.name || "User Node"}
                                    className="h-6 w-6 rounded-full object-cover border border-slate-700/60 flex-shrink-0 mb-1"
                                />
                            )}

                            {/* Message Payload Content Bubble */}
                            <div
                                className={`rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all duration-150 ${isMyMessage
                                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-none border border-cyan-500/20'
                                    : 'bg-slate-900 text-slate-100 rounded-bl-none border border-slate-800'
                                    }`}
                            >
                                {!isMyMessage && (
                                    <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide mb-0.5">
                                        {m.sender?.name || "User Node"}
                                    </p>
                                )}
                                <p className="leading-relaxed break-words">{m.content}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ScrollableChat;