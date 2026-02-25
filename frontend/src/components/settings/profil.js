import { useEffect, useState } from "react";
import api from "../../hooks/api";
import { FiEdit2 } from "react-icons/fi";

import { FiCamera } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { Loader, Spinner } from "../spin/Spinner";

const Avatar = ({ user, avatar, setAvatar }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatar(preview);

    // 👉 plus tard : upload vers backend
    // const formData = new FormData();
    // formData.append("avatar", file);
    // api.post("/utilisateur/avatar", formData);
  };

  return (
    <div className="relative w-24 h-24">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="avatar-upload"
      />

      <label htmlFor="avatar-upload" className="cursor-pointer">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <FaUser className="w-24 h-24 text-gray-300 rounded-full border" />
          // <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          //   {user.nom.charAt(0)}
          //   {user.prenom.charAt(0)}
          // </div>
        )}

        {/* Icône modifier */}
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
          <FiCamera className="w-3 h-3 text-gray-600" />
        </div>
      </label>
    </div>
  );
};

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-md font-semibold transition
      ${
        active
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
  >
    {label}
  </button>
);

const InfosPersonnelles = ({ user }) => {
  const Item = ({ label, value }) => (
    <div className="flex justify-between py-8 border-b last:border-none">
      <span className="text-gray-500 text-md">{label}</span>
      <span className="text-gray-800 text-md font-medium">{value ?? "—"}</span>
    </div>
  );

  return (
    <div>
      <Item label="Nom" value={user.nom} />
      <Item label="Prénom" value={user.prenom} />
      <Item label="Nom d'utilisateur" value={user.username} />
      <Item label="Genre" value={user.genre} />
      <Item label="Téléphone" value={user.phone} />
      <Item label="Adresse" value={user.adresse} />
    </div>
  );
};

const Input = ({ label, editable = false, disabled = false, ...props }) => (
  <div>
    <label className="block text-sm text-gray-500 mb-2">{label}</label>

    <div className="relative">
      <input
        {...props}
        disabled={disabled}
        className={`w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? "cursor-not-allowed text-gray-400" : ""}
        `}
      />

      {editable && (
        <FiEdit2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      )}
    </div>
  </div>
);

const Parametres = ({ formData, setFormData, onSave }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">
        Paramètres du compte
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nom"
          name="nom"
          value={formData.nom}
          disabled
          onChange={handleChange}
        />

        <Input
          label="Prénom"
          name="prenom"
          disabled
          value={formData.prenom}
          onChange={handleChange}
        />

        <Input
          label="Nom d'utilisateur"
          name="username"
          value={formData.username ?? ""}
          onChange={handleChange}
        />

        <Input
          label="Teléphone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          editable
        />

        <Input
          label="E-mail"
          name="email"
          value={formData.email}
          onChange={handleChange}
          // editable
          disabled
        />

        <Input
          label="Mot de passe"
          name="password"
          type="password"
          value="••••••••"
          disabled
          editable
        />
      </div>

      <div className="flex items-center gap-6 pt-4">
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white text-md font-medium hover:bg-blue-500 transition"
        >
          Enregistrer les modifications
        </button>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-md text-gray-500 hover:underline"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

const Profil = () => {
  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatar(user.avatarUrl);
    }
  }, [user]);

  useEffect(() => {
    api
      .get("/utilisateur/profile")
      .then((res) => {
        setId(res.data.userId);
        setRole(res.data.userRole);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (id && role) {
      api
        .get(`/utilisateur/info?id=${id}&role=${role}`)
        .then((res) => setUser(res.data[0]))
        .catch((err) => console.error(err));
    }
  }, [id, role]);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        genre: user.genre,
        phone: user.phone,
        adresse: user.adresse,
        email: user.email,
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await api.put(`/utilisateur/${id}`, formData);
      alert("Profil mis à jour");
    } catch (err) {
      console.error(err);
    }
  };

  // if (!user) {
  //   return <div className="text-center mt-10">Chargement...</div>;
  // }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="md" color="blue" />
        {/* <div className="text-gray-500 text-lg">Chargement du profil...</div> */}
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen bg-slate-50">
      <section className="flex-1 overflow-y-auto">
        <div className="bg-white mx-4 mt-6 p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <Avatar user={user} avatar={avatar} setAvatar={setAvatar} />

          <div className="flex-1">
            <p className="text-gray-600 font-semibold">
              {user.nom} {user.prenom}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mx-4 mt-6 bg-white rounded-xl shadow-sm border">
          <div className="flex border-b">
            <TabButton
              label="Infos personnelles"
              active={activeTab === "info"}
              onClick={() => setActiveTab("info")}
            />
            <TabButton
              label="Paramètres"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </div>

          <div className="p-4">
            {activeTab === "info" && <InfosPersonnelles user={user} />}
            {activeTab === "settings" && (
              <Parametres
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profil;
