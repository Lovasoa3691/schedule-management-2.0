import { useEffect, useState } from "react";
import axios from "axios";

const MessageBox = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([
    {
      sender_id: 1,
      receiver_id: 2,
      message: "Bonjour, comment ça va ?",
      timestamp: "2023-10-01T10:00:00Z",
    },
    {
      sender_id: 2,
      receiver_id: 1,
      message: "Ça va bien, merci ! Et toi ?",
      timestamp: "2023-10-01T10:05:00Z",
    },
  ]);
  const [newMsg, setNewMsg] = useState("");

  //   useEffect(() => {
  //     axios.get(`/api/messages/${senderId}/${receiverId}`)
  //       .then(res => setMessages(res.data));
  //   }, [senderId, receiverId]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    await axios.post("/api/messages/send", {
      sender_id: senderId,
      receiver_id: receiverId,
      message: newMsg,
    });

    setMessages([
      ...messages,
      {
        sender_id: senderId,
        receiver_id: receiverId,
        message: newMsg,
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewMsg("");
  };

  return (
    <div className="border p-4 rounded-md max-w-xl mx-auto w-full bg-white shadow-md">
      <div className="h-[650px] overflow-y-auto space-y-2 mb-4 bg-gray-100 p-2 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md w-fit ${
              msg.sender_id === senderId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300"
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {new Date(msg.timestamp).toLocaleDateString() +
                " " +
                new Date(msg.timestamp).toLocaleTimeString()}
            </div>
            {/* <strong>{msg.sender_id === senderId ? "Moi" : "Enseignant"}</strong> */}
            <br />
            {msg.message}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Écrire un message..."
        />
        <button
          //   onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
