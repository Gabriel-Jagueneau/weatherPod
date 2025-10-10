import { useState } from "react";

export default function Connect() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const usersDB = JSON.parse(localStorage.getItem("usersDB") || "{}");

  const handleLogin = (e) => {
    e.preventDefault();
    if (usersDB[username] && usersDB[username] === password) {
      setMessage("Connexion réussie !");
      usersDB[username + "_lastLogin"] = new Date().toISOString();
      localStorage.setItem("usersDB", JSON.stringify(usersDB));
    } else {
      setMessage("Nom d'utilisateur ou mot de passe incorrect.");
    }
  };

  const handleRegister = () => {
    if (!username || !password) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }
    if (usersDB[username]) {
      setMessage("Utilisateur déjà existant.");
      return;
    }
    usersDB[username] = password;
    usersDB[username + "_lastLogin"] = new Date().toISOString();
    localStorage.setItem("usersDB", JSON.stringify(usersDB));
    setMessage("Utilisateur créé et connecté !");
  };

  return (
    <div className="page connect">
      <div className="connect-card">
        <h1>Se Connecter</h1>
        <p>Connectez-vous pour accéder au programme de compétition.</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder=" "
              value={username}
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label id="username">Nom d'utilisateur</label>
            {username && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setUsername("")}
              >Effacer</button>
            )}
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label id="password">Mot de passe</label>
            {password && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setPassword("")}
              >Effacer</button>
            )}
          </div>
          <div className="buttons">
            <button type="submit">Se connecter</button>
            <button type="button" onClick={handleRegister}>S'inscrire</button>
          </div>
        </form>
      </div>
      {message && (<div className="message-bubble">{message}</div>)}
    </div>
  );
}