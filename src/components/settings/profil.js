import axios from "axios";
import { useEffect, useState } from "react";
import { MdSave, MdSend } from "react-icons/md";

const Profil = () => {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    prenom: "",
    genre: "",
    phone: "",
    adresse: "",
    fonction: "",
    email: "",
  });

  const [id, setId] = useState(() => {
    const storedKey = localStorage.getItem("user");
    return storedKey ? storedKey : null;
  });

  const getUser = (key) => {
    axios
      .get(`http://localhost:5142/api/utilisateur/${key}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Erreur de recuperation: ", err));
  };

  useEffect(() => {
    if (id) {
      getUser(id);
      console.log(id);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!user) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <main className="flex flex flex-col h-screen">
      <header className="p-4 bg-slate-100 border-b flex items-center">
        <div className="w-10 h-10  text-white flex items-center justify-center text-lg font-bold">
          {/* {selectedTeacher?.nom?.charAt(0)} */}
        </div>
      </header>

      <div className="h-[600px] p-14  bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 mr-4 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.nom.charAt(0)}
              {user.prenom.charAt(0)}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-gray-700">
                {user.nom} {user.prenom}
              </span>
              <span className="text-gray-600">{user?.email ?? "N/A"}</span>
            </div>
          </div>
          <div>
            <button className="text-white bg-blue-600 p-2 w-20 rounded-lg hover:bg-blue-700 transition-colors">
              Editer
            </button>
          </div>
        </div>

        <form className="mt-8">
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={user?.nom}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={user?.prenom}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Doe"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Genre
              </label>

              <select
                value={user?.genre ?? "Inconnu"}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="genre"
                id=""
              >
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Feminin</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Adresse
              </label>
              <input
                type="text"
                name="adresse"
                value={user?.adresse ?? "Inconnu"}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="123-45-678"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Numéro de téléphone
              </label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="123-45-678"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Rôle
              </label>
              <input
                disabled
                type="text"
                id="fonction"
                name="fonction"
                value={user.fonction}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="123-45-678"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
          </div>
          <div className="">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Adresse mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user?.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="exemple@gmail.com"
              required
            />
          </div>

          {/* <div className="mt-3">
                <span className="text-gray-600">Votre</span>
              </div> */}
        </form>
      </div>

      <footer className="p-6 px-14 border-t bg-white flex gap-2">
        <button
          //   onClick={sendMessage}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          <MdSave className="inline-block mr-2" />
          Enregister les modifications
        </button>
      </footer>
    </main>
  );
};

export default Profil;
