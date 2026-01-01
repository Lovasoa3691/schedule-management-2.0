import React, { useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const AssistantFloatingForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    const newUserMessage = { sender: "user", text: trimmed };
    setChatHistory((prev) => [...prev, newUserMessage]);

    setMessage("");

    setTimeout(() => {
      const assistantReply = {
        sender: "assistant",
        text: `Bonjour! Je suis votre assistant. Qu'est ce que je peux vous aidez ?: "${trimmed}"`,
      };
      setChatHistory((prev) => [...prev, assistantReply]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <div
          onClick={() => setIsOpen(true)}
          className="flex flex-row items-center gap-4 bg-indigo-600 text-white p-4 rounded-lg shadow-lg hover:bg-indigo-700 transition"
        >
          <span className="font-semibold">Assistant</span>
          <IoMdChatbubbles className="w-8 h-8" />
        </div>
      ) : (
        <div className="w-80 bg-white shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[500px]">
          {/* En-tête */}
          <div className="bg-indigo-600 text-white flex justify-between items-center px-4 py-3">
            <span className="font-bold">Assistant IA</span>
            <button onClick={() => setIsOpen(false)}>
              <IoClose size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-gray-700 bg-slate-50">
            {chatHistory.length === 0 ? (
              <p className="text-gray-400 italic">
                Posez votre question pour commencer
              </p>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-indigo-100 text-right ml-auto max-w-[80%]"
                      : "bg-gray-100 text-left mr-auto max-w-[80%]"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Votre question..."
              className="w-full border border-gray-300 rounded-md p-2 mb-2 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition font-semibold"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssistantFloatingForm;
