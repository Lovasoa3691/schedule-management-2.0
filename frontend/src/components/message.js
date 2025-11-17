import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageBox from "./messageBox";
import { MdSend } from "react-icons/md";

const Messagerie = ({ currentUserId }) => {
  const [enseignants, setEnseignants] = useState([
    {
      id: 1,
      nom: "Rajaonarivelo",
      prenom: "Jean",
      specialite: "Developpement Web",
      grade: "Doctorant en Informatique",
      online: true,
    },
    {
      id: 2,
      nom: "Rasolo",
      prenom: "Marie",
      specialite: "Intelligence Artificielle",
      grade: "Maître de Conférences",
      online: false,
    },
    {
      id: 3,
      nom: "Rakotovao",
      prenom: "Paul",
      specialite: "Design UX/UI",
      grade: "Doctorant",
      online: true,
    },
  ]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  //   useEffect(() => {
  //     // Récupérer les enseignants connectés
  //     axios.get('/api/enseignants/online')
  //       .then(res => setEnseignants(res.data));
  //   }, []);

  const sendMessage = async () => {
    if (!message.trim() || !selectedTeacher) return;
    const newMessage = {
      from: "me",
      to: selectedTeacher.id,
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
    setMessage("");

    // await axios.post("/api/messages/send", {
    //   sender_id: currentUserId,
    //   receiver_id: selectedTeacher.id,
    //     message: message,
    // });
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-[500px] max-h-[900px] overflow-y-auto border-r border-gray-300 p-4">
        <h2 className="text-lg font-semibold mb-4">Tous les messages</h2>
        <input
          type="text"
          placeholder="Search Message"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <ul className="space-y-4 max-h-[900px] overflow-y-auto pr-2">
          {enseignants.map((teacher) => (
            <li
              key={teacher.id}
              onClick={() => setSelectedTeacher(teacher)}
              className="h-32 flex items-center cursor-pointer bg-white hover:bg-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
                  {teacher.nom.charAt(0)}
                </div>

                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    teacher.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              <div className="ml-4">
                <p className="text-sm text-gray-500">
                  {teacher.nom} {teacher.prenom}
                </p>
                <p className="font-semibold text-gray-800">
                  {teacher.specialite} - {teacher.grade}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 flex flex-col justify-between">
        <header className="p-4 bg-slate-100 border-b flex items-center">
          <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
            {selectedTeacher?.nom?.charAt(0)}
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-lg">
              {selectedTeacher?.nom} {selectedTeacher?.prenom}
            </h2>
            <p
              className={
                selectedTeacher?.online
                  ? "text-sm text-green-500"
                  : "text-sm text-gray-500"
              }
            >
              {selectedTeacher?.online ? "Actif" : "Inactif"}
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.from === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <footer className="p-4 border-t bg-white flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            <MdSend className="inline-block mr-2" />
            Envoyer
          </button>
        </footer>
      </main>
    </div>
  );
};

export default Messagerie;
