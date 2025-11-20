import { useState, useEffect, useRef } from "react";

export default function Connect() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", location: "", avatar: "" });
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const inactivityTimer = useRef(null);
  const usersDB = JSON.parse(localStorage.getItem("usersDB") || "{}");

  // --- Session persistante ---
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser && usersDB[savedUser]) {
      setLoggedInUser(savedUser);
      setProfile(usersDB[savedUser + "_profile"] || { name: savedUser, location: "", avatar: "" });
      setNewUsername(savedUser);
      startInactivityTimer();
    }
  }, []);

  const startInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
      setMessage("Vous avez été déconnecté pour cause d'inactivité.");
    }, 10 * 60 * 1000);
  };

  const resetInactivityTimer = () => {
    if (loggedInUser) startInactivityTimer();
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer));
    return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      clearTimeout(inactivityTimer.current);
    };
  }, [loggedInUser]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (usersDB[username] && usersDB[username] === password) {
      setLoggedInUser(username);
      setProfile(usersDB[username + "_profile"] || { name: username, location: "", avatar: "" });
      setNewUsername(username);
      usersDB[username + "_lastLogin"] = new Date().toISOString();
      localStorage.setItem("usersDB", JSON.stringify(usersDB));
      localStorage.setItem("loggedInUser", username);
      setMessage("Connexion réussie !");
      startInactivityTimer();
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
    usersDB[username + "_profile"] = { name: username, location: "", avatar: "" };
    localStorage.setItem("usersDB", JSON.stringify(usersDB));
    setLoggedInUser(username);
    setProfile({ name: username, location: "", avatar: "" });
    setNewUsername(username);
    localStorage.setItem("loggedInUser", username);
    setMessage("Utilisateur créé et connecté !");
    startInactivityTimer();
  };

  const logout = () => {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    localStorage.removeItem("loggedInUser");
    clearTimeout(inactivityTimer.current);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = () => {
    if (!loggedInUser) return;

    // Changement nom d'utilisateur
    if (newUsername !== loggedInUser) {
      if (usersDB[newUsername]) {
        setMessage("Nom d'utilisateur déjà utilisé !");
        return;
      }
      usersDB[newUsername] = newPassword || usersDB[loggedInUser];
      usersDB[newUsername + "_profile"] = profile;
      usersDB[newUsername + "_lastLogin"] = new Date().toISOString();
      delete usersDB[loggedInUser];
      delete usersDB[loggedInUser + "_profile"];
      delete usersDB[loggedInUser + "_lastLogin"];
      setLoggedInUser(newUsername);
      localStorage.setItem("loggedInUser", newUsername);
    } else if (newPassword) {
      usersDB[loggedInUser] = newPassword;
    }

    usersDB[loggedInUser + "_profile"] = profile;
    localStorage.setItem("usersDB", JSON.stringify(usersDB));
    setMessage("Profil mis à jour !");
    setNewPassword("");
  };

  return (
    <div className="page connect">
      {!loggedInUser ? (
        <div className="connect-card">
          <h1>Se Connecter</h1>
          <p>Connectez-vous pour accéder au programme de compétition.</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input type="text" placeholder=" " value={username} onChange={(e) => setUsername(e.target.value)} />
              <label>Nom d'utilisateur</label>
              {username && <button type="button" className="clear-btn" onClick={() => setUsername("")}>Effacer</button>}
            </div>
            <div className="input-group">
              <input type="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} />
              <label>Mot de passe</label>
              {password && <button type="button" className="clear-btn" onClick={() => setPassword("")}>Effacer</button>}
            </div>
            <div className="buttons">
              <button type="submit">Se connecter</button>
              <button type="button" onClick={handleRegister}>S'inscrire</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="settings-card">
          <h1>Paramètres du profil</h1>
          <p>Cette fenêtre permet de modifier ses informations personnelles</p>

          <div className="content">
            <div className="inputs">
              <div className="input-group">
                <input value={newUsername} placeholder=" " onChange={(e) => setNewUsername(e.target.value)} />
                <label>Nom d'utilisateur</label>
              </div>

              <div className="input-group">
                <input type="password" placeholder=" " value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <label>Nouveau mot de passe</label>
              </div>

              <br />
              <br />

              <div className="input-group">
                <input value={profile.name} placeholder=" " onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <label>Pseudo</label>
              </div>

              <div className="input-group">
                <input value={profile.location} placeholder=" " onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                <label>Localisation</label>
              </div>

              <div className="input-group">
                <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                <label>Avatar</label>
              </div>

              <br />
              <br />

              <div className="buttons">
                <button onClick={updateProfile}>Enregistrer</button>
                <button onClick={logout}>Se déconnecter</button>
              </div>
            </div>
            <div className="preview">
            {loggedInUser && (
              <div className="leaderboard-card profile-preview-card">
                <div className="info">
                  <div className="player-name">
                    {profile.avatar ? (
                      <img
                        className="competitor-icon"
                        src={profile.avatar}
                        alt={profile.name}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        fill="currentColor"
                        className="placeholder-icon"
                      >
                        <path d="M24 24c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 4c-5.333 0-16 2.667-16 8v4h32v-4c0-5.333-10.667-8-16-8z" />
                      </svg>
                    )}
                    <span className="player-name-text">{profile.name || newUsername}</span>
                  </div>

                  <div className="description">
                    <div className="essential">
                      <div className="score">9999 pts</div>
                      <div className="badges">
                        <div className="badges">
                          <span className="badge" title="Owner">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                              <path d="M203-160v-60h554v60H203Zm-1-144-53-334q-5 2-9.5 2.5t-9.5.5q-21 0-35.5-14.5T80-685q0-21 14.5-36t35.5-15q21 0 36 15t15 36q0 8-2.5 16t-7.5 14l148 66 141-194q-14-6-22.5-18.5T429-830q0-21 15-35.5t36-14.5q21 0 36 14.5t15 35.5q0 16-8.5 28.5T500-783l141 194 148-66q-5-6-7.5-14t-2.5-16q0-21 15-36t35-15q21 0 36 15t15 36q0 21-15 35.5T829-635q-5 0-9-1t-9-3l-53 335H202Zm51-60h454l32-203-118 53-141-195-141 195-118-53 32 203Zm227 0Z"></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="equipment">
                      <strong>Équipement:</strong> 0 capteur(s), Station: Non
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      )}
      {message && <div className="message-bubble">{message}</div>}
    </div>
  );
}