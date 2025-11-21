import React, { useState, useEffect, useRef, useCallback } from "react";
import Cropper from 'react-easy-crop';

// URL du fichier users.json sur GitHub (version raw)
const GITHUB_USERS_DB_URL = "https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/main/storage/data/users.json";

// --- Définition des Badges ---
const badgeDefinitions = [
    { key: 'verified', label: 'Verified', color: '#28a745', d: "m346-60-76-130-151-31 17-147-96-112 96-111-17-147 151-31 76-131 134 62 134-62 77 131 150 31-17 147 96 111-96 112 17 147-150 31-77 130-134-62-134 62Zm27-79 107-45 110 45 67-100 117-30-12-119 81-92-81-94 12-119-117-28-69-100-108 45-110-45-67 100-117 28 12 119-81 94 81 92-12 121 117 28 70 100Zm107-341Zm-43 133 227-225-45-41-182 180-95-99-46 45 141 140Z" },
    { key: 'owner', label: 'Owner', color: '#ffc107', d: "M203-160v-60h554v60H203Zm-1-144-53-334q-5 2-9.5 2.5t-9.5.5q-21 0-35.5-14.5T80-685q0-21 14.5-36t35.5-15q21 0 36 15t15 36q0 8-2.5 16t-7.5 14l148 66 141-194q-14-6-22.5-18.5T429-830q0-21 15-35.5t36-14.5q21 0 36 14.5t15 35.5q0 16-8.5 28.5T500-783l141 194 148-66q-5-6-7.5-14t-2.5-16q0-21 15-36t35-15q21 0 36 15t15 36q0 21-15 35.5T829-635q-5 0-9-1t-9-3l-53 335H202Zm51-60h454l32-203-118 53-141-195-141 195-118-53 32 203Zm227 0Z" },
    { key: 'bughunter', label: 'Bug Hunter', color: '#dc3545', d: "M480-180q72 0 123-50.5T654-353v-167q0-72-51-122.5T480-693q-72 0-123 50.5T306-520v167q0 72 51 122.5T480-180Zm-80-140h160v-60H400v60Zm0-173h160v-60H400v60Zm80 57h.5-.5.5-.5.5-.5.5-.5Zm0 316q-65 0-121-31t-83-89H160v-60h92q-7-26-7-52.5V-406h-85v-60h85q0-29 .5-57.5T254-580h-94v-60h120q14-28 37-49t51-35l-77-76 40-40 94 94q28-10 56.5-10t56.5 10l94-94 40 40-76 76q28 14 49.5 35.5T683-640h117v60h-94q9 28 8.5 56.5T714-466h86v60h-86q0 27 .5 53.5T708-300h92v60H685q-26 59-82.5 89.5T480-120Z" },
    { key: 'betatester', label: 'Beta Tester', color: '#17a2b8', d: "M480-80q-155 0-268.53-102.14Q97.94-284.28 83-437h60q15.93 128.35 112.05 212.67Q351.17-140 479.68-140 622-140 721-238.81q99-98.82 99-241.19 0-142.38-98.81-241.19T480-820q-96.33 0-178.67 51Q219-718 177-633h127v60H91q32-136 140.5-221.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm115-243L450-467.98V-674h60v182l127 127-42 42Z" },
    { key: 'new', label: 'New', color: '#007bff', d: "M100-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h760q24.75 0 42.38 18Q920-764 920-740v520q0 24-17.62 42-17.63 18-42.38 18H100Zm0-60h760v-520H100v520Zm30-137h45v-170l116 170h43v-246h-45v170L175-603h-45v246Zm249 0h157v-45H429v-54h107v-45H429v-56h107v-46H379v246Zm248 0h170q14.45 0 24.22-9.49Q831-375.98 831-390v-213h-45v196h-53v-155h-45v155h-49v-196h-45v213q0 14.02 9.49 23.51Q612.97-357 627-357ZM100-220v-520 520Z" },
];

// --- Fonctions utilitaires ---
const getUsersDB = () => JSON.parse(localStorage.getItem("usersDB") || "{}");
const saveUsersDB = (db) => localStorage.setItem("usersDB", JSON.stringify(db));
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;


// ----------------------------------------------------
// --- FONCTION UTILITAIRE : GÉNÉRER L'IMAGE RECADRÉE ---
// ----------------------------------------------------
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
      );

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(dataUrl);
    };
    image.onerror = (error) => reject(error);
  });
};

// --- Composant CropModal ---
const CropModal = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); 

  const onCropChange = useCallback((crop) => { setCrop(crop); }, []);
  const onZoomChange = useCallback((zoom) => { setZoom(zoom); }, []);
  const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => { setCroppedAreaPixels(croppedAreaPixels); }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error("Erreur lors du recadrage :", e);
      onCancel();
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete, onCancel]);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3>Recadrer l'Avatar</h3>
        <div style={styles.cropperContainer}>
            <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} 
                onCropChange={onCropChange} onZoomChange={onZoomChange}
                onCropComplete={onCropAreaChange} cropShape="round" showGrid={true}
            />
        </div>
        <div style={{ padding: '10px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#555', fontSize: '14px' }}>Zoom:</span>
            <input type="range" value={zoom} min={1} max={3} step={0.1}
                onChange={(e) => onZoomChange(parseFloat(e.target.value))} style={{ flexGrow: 1 }}
            />
        </div>
        <div style={styles.buttonGroup}>
          <button style={{ ...styles.button, ...styles.secondaryButton, flexGrow: 0 }} onClick={onCancel}>Annuler</button>
          <button style={{ ...styles.button, ...styles.primaryButton, flexGrow: 2 }} onClick={showCroppedImage} disabled={!croppedAreaPixels}>Confirmer le Recadrage</button>
        </div>
      </div>
    </div>
  );
};

// --- Composant d'affichage des Badges ---
const BadgeDisplay = ({ badges, badgeDefinitions }) => {
    if (!badges || badges.length === 0) {
        return <p style={{ fontSize: '12px', color: '#6c757d', fontStyle: 'italic' }}>Aucun badge actif.</p>;
    }

    return (
        <div style={styles.badgeContainer}>
            {badges.map(badgeKey => {
                const badge = badgeDefinitions.find(def => def.key === badgeKey);
                if (!badge) return null;

                return (
                    <div 
                        key={badge.key} 
                        title={badge.label} 
                        style={styles.badgeItem}
                    >
                        <svg 
                            style={{ fill: badge.color, width: '20px', height: '20px', minWidth: '20px', marginRight: '5px' }} 
                            viewBox="0 0 960 960"
                        >
                            <path d={badge.d} />
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: badge.color }}>{badge.label}</span>
                    </div>
                );
            })}
        </div>
    );
};


// --- Composant d'authentification ---
const AuthCard = ({ username, setUsername, password, setPassword, handleLogin, handleRegister }) => (
  <div style={styles.card}>
    <h2>Connexion</h2>
    <p>Utilisez votre identifiant fourni.</p>
    <form onSubmit={handleLogin}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Nom d'utilisateur</label>
        <input style={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Mot de passe</label>
        <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div style={styles.buttonGroup}>
        <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Se connecter</button>
        
        <button 
          type="button" 
          onClick={handleRegister} 
          style={{ ...styles.button, ...styles.secondaryButton, cursor: 'not-allowed' }} 
          disabled={true} 
        >
          Vous ne pouvez pas créer de compte
        </button>
      </div>
    </form>
  </div>
);

// --- Composant de Paramètres du Profil ---
const SettingsCard = ({ 
  profile, newUsername, newPassword, 
  updateProfile, logout, loggedInUser, handleAvatarFileSelect,
  isDirty, setNewUsernameAndDirty, setNewPasswordAndDirty, setProfileAndDirty 
}) => {
    
  const fileInputRef = useRef(null);
  const handleAvatarClick = () => { fileInputRef.current.click(); };
  
  const AvatarDisplay = () => (
    <div onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
        {profile.avatar ? (
          <img style={styles.avatar} src={profile.avatar} alt={profile.name || newUsername} />
        ) : (
          <svg style={styles.placeholderIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 24c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 4c-5.333 0-16 2.667-16 8v4h32v-4c0-5.333-10.667-8-16-8z" />
          </svg>
        )}
        <p style={{ fontSize: '12px', color: '#007bff', fontWeight: 'bold' }}>Cliquer pour changer d'avatar</p>
    </div>
  );

  return (
    <div style={styles.card}>
      <h2>Paramètres du profil</h2>
      <p>Modifier vos identifiants et informations publiques.</p>
      
      {/* 1. Zone d'Identifiants et Sécurité */}
      <div style={{ paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
          <h3>Identifiants et Sécurité</h3>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom d'utilisateur (Connexion)</label>
            <input style={styles.input} value={newUsername} onChange={(e) => setNewUsernameAndDirty(e.target.value)} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nouveau mot de passe (Laisser vide si inchangé)</label>
            <input style={styles.input} type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPasswordAndDirty(e.target.value)} />
          </div>
      </div>
      
      {/* 2. Zone des Informations Publiques */}
      <div className="profile-edit-area">
          <h3>Informations Publiques</h3>
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <AvatarDisplay />
              <p style={{ marginTop: '0' }}>Utilisateur: *{loggedInUser}*</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFileSelect} style={styles.hiddenInput} />
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Pseudo (Nom affiché)</label>
            <input style={styles.input} value={profile.name} onChange={(e) => setProfileAndDirty({ ...profile, name: e.target.value })} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Localisation</label>
            <input style={styles.input} value={profile.location} onChange={(e) => setProfileAndDirty({ ...profile, location: e.target.value })} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Badges Actifs 🏅</label>
            <BadgeDisplay badges={profile.badges} badgeDefinitions={badgeDefinitions} />
          </div>
      </div>
      
      {/* 3. Zone des Actions */}
      <div style={styles.buttonGroup}>
        {isDirty && (
          <button onClick={updateProfile} style={{ ...styles.button, ...styles.primaryButton }}>Enregistrer les modifications</button>
        )}
        <button onClick={logout} style={{ ...styles.button, ...styles.dangerButton }}>Se déconnecter</button>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// --- Composant Principal Connect ---
// ----------------------------------------------------
export default function Connect() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", location: "", avatar: "", badges: [] }); 
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [imageToCrop, setImageToCrop] = useState(null); 
  const [isDirty, setIsDirty] = useState(false);
  const [githubUsers, setGithubUsers] = useState({}); // Utilisation d'un objet pour la map

  const savedState = useRef({});
  const inactivityTimer = useRef(null);

  // --- Fonctions de gestion de l'état/session (useCallback) ---

  const logout = useCallback(() => {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    localStorage.removeItem("loggedInUser");
    clearTimeout(inactivityTimer.current);
    setMessage("Déconnexion réussie.");
  }, []);

  const startInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
      setMessage("Vous avez été déconnecté pour cause d'inactivité.");
    }, INACTIVITY_TIMEOUT);
  }, [logout]); 

  const resetInactivityTimer = useCallback(() => {
    if (loggedInUser) startInactivityTimer();
  }, [loggedInUser, startInactivityTimer]);

  const updateSavedState = useCallback((profile, username, password) => {
      savedState.current = {
          profile: {...profile},
          username: username,
          password: password 
      };
      setIsDirty(false); 
  }, []);
  
  const checkIfDirty = useCallback((currentProfile, currentUsername, currentPassword) => {
    if (!currentUsername) return false; 
    if (currentPassword !== "") return true;
    if (currentUsername !== savedState.current.username) return true;
    
    const currentProfileString = JSON.stringify({
        name: currentProfile.name,
        location: currentProfile.location,
        avatar: currentProfile.avatar,
        badges: currentProfile.badges, 
    });

    const savedProfileString = JSON.stringify({
        name: savedState.current.profile?.name,
        location: savedState.current.profile?.location,
        avatar: savedState.current.profile?.avatar,
        badges: savedState.current.profile?.badges,
    });
    
    return currentProfileString !== savedProfileString;
  }, []);

  // --- Handlers qui mettent à jour l'état ET le flag Dirty ---
  
  const setNewUsernameAndDirty = (value) => {
      setNewUsername(value);
      setIsDirty(checkIfDirty(profile, value, newPassword));
  };
  
  const setNewPasswordAndDirty = (value) => {
      setNewPassword(value);
      setIsDirty(true); 
  };
  
  const setProfileAndDirty = (newProfile) => {
      setProfile(newProfile);
      setIsDirty(checkIfDirty(newProfile, newUsername, newPassword));
  };

  // --- Chargement des utilisateurs GitHub ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(GITHUB_USERS_DB_URL);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        const usersMap = {};
        data.forEach(user => { usersMap[user.username] = user; });
        setGithubUsers(usersMap);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs GitHub:", error);
        setMessage("Erreur de connexion à la base de données utilisateurs.");
      }
    };
    fetchUsers();
  }, []); 


  // --- Logique d'initialisation et d'inactivité (CORRIGÉE) ---
  
  useEffect(() => {
    const usersDB = getUsersDB();
    const savedUser = localStorage.getItem("loggedInUser");
    
    if (savedUser && usersDB[savedUser]) {
      // ⚠️ CORRECTION ICI : Assurez-vous que le champ badges est bien chargé.
      // Si la clé profile existe, utilisons-la, sinon initialisons-la.
      const savedProfile = usersDB[savedUser + "_profile"];
      
      const initialProfile = { 
        name: savedUser, 
        location: "", 
        avatar: "", 
        badges: [], // Par défaut vide
        ...(savedProfile || {}) // Écrase les valeurs par défaut avec les données sauvegardées
      };
      
      setLoggedInUser(savedUser);
      setProfile(initialProfile);
      setNewUsername(savedUser);
      setNewPassword("");
      
      updateSavedState(initialProfile, savedUser, usersDB[savedUser]);
      startInactivityTimer();
    }
  }, [startInactivityTimer, updateSavedState]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer));
    
    return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      clearTimeout(inactivityTimer.current);
    };
  }, [loggedInUser, resetInactivityTimer]);


  // --- Logique d'authentification (CORRIGÉE) ---

  const handleLogin = (e) => {
    e.preventDefault();
    
    const userCredentials = githubUsers[username];
    
    if (userCredentials && userCredentials.password === password) {
      
      // ⚠️ CORRECTION ICI : Initialisation du profil local avec les badges de GitHub
      const initialProfile = { 
          name: userCredentials.name || username, 
          location: userCredentials.localisation || "", 
          avatar: userCredentials.icon || "",
          badges: userCredentials.badges || [] 
      };

      let usersDB = getUsersDB();
      usersDB[username] = password; 
      usersDB[username + "_profile"] = initialProfile; // Enregistre le profil AVEC les badges
      usersDB[username + "_lastLogin"] = new Date().toISOString();
      saveUsersDB(usersDB);

      setLoggedInUser(username);
      setProfile(initialProfile); // Met à jour l'état AVEC les badges
      setNewUsername(username);
      localStorage.setItem("loggedInUser", username);
      updateSavedState(initialProfile, username, password);
      
      setMessage("Connexion réussie !");
      startInactivityTimer();
    } else {
      setMessage("Nom d'utilisateur ou mot de passe incorrect.");
    }
  };

  const handleRegister = () => {
    setMessage("L'inscription est désactivée. Veuillez utiliser un identifiant fourni.");
  };

  // --- updateProfile et Logique de Recadrage (inchangés) ---

  const updateProfile = () => {
    if (!loggedInUser || !isDirty) return;

    let usersDB = getUsersDB();
    let currentUser = loggedInUser;
    
    if (newUsername !== currentUser) {
      if (usersDB[newUsername]) {
        setMessage("Nom d'utilisateur déjà utilisé !");
        return;
      }
      usersDB[newUsername] = newPassword || usersDB[currentUser];
      usersDB[newUsername + "_profile"] = profile;
      usersDB[newUsername + "_lastLogin"] = new Date().toISOString();
      delete usersDB[currentUser];
      delete usersDB[currentUser + "_profile"];
      delete usersDB[currentUser + "_lastLogin"];
      setLoggedInUser(newUsername);
      localStorage.setItem("loggedInUser", newUsername);
      currentUser = newUsername;
    } 
    
    if (newPassword) { usersDB[currentUser] = newPassword; }

    usersDB[currentUser + "_profile"] = profile;
    saveUsersDB(usersDB);
    
    updateSavedState(profile, currentUser, usersDB[currentUser]);
    
    setMessage("Profil mis à jour !");
    setNewPassword(""); 
  };
  
  const handleAvatarFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImageToCrop(reader.result); };
    reader.readAsDataURL(file);
    e.target.value = null; 
  };
  
  const handleCropComplete = (croppedImage) => {
    const newProfile = { ...profile, avatar: croppedImage }; 
    setProfile(newProfile); 
    setImageToCrop(null); 
    setIsDirty(checkIfDirty(newProfile, newUsername, newPassword));
    setMessage("Avatar prêt à être enregistré !");
  };
  
  const handleCropCancel = () => {
    setImageToCrop(null); 
    setMessage("Modification d'avatar annulée.");
  };


  // --- Rendu Final ---
  return (
    <div style={styles.page}>
      
      {loggedInUser ? (
        <SettingsCard 
          profile={profile} 
          newUsername={newUsername} 
          setNewUsernameAndDirty={setNewUsernameAndDirty} 
          newPassword={newPassword} 
          setNewPasswordAndDirty={setNewPasswordAndDirty} 
          updateProfile={updateProfile} 
          logout={logout} 
          loggedInUser={loggedInUser}
          handleAvatarFileSelect={handleAvatarFileSelect}
          isDirty={isDirty} 
          setProfileAndDirty={setProfileAndDirty} 
        />
      ) : (
        <AuthCard 
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword} 
          handleLogin={handleLogin} 
          handleRegister={handleRegister} 
        />
      )}
      
      {imageToCrop && (
        <CropModal 
          imageSrc={imageToCrop} 
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      {message && <div style={styles.messageBubble}>{message}</div>}
    </div>
  );
}

// ----------------------------------------------------
// --- Styles (pour la complétude) ---
// ----------------------------------------------------
const styles = {
  page: { padding: "20px", minHeight: "100vh", backgroundColor: "#f4f7f6", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" },
  card: { width: "100%", maxWidth: "400px", margin: "10px 0", padding: "20px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", boxSizing: "border-box" },
  inputGroup: { marginBottom: "15px", position: "relative" },
  input: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box" },
  label: { fontSize: "14px", color: "#555", marginBottom: "5px", display: "block" },
  button: { padding: "12px 15px", borderRadius: "8px", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginRight: "10px", flexGrow: 1 },
  primaryButton: { backgroundColor: "#007bff", color: "white" },
  secondaryButton: { backgroundColor: "#6c757d", color: "white" },
  dangerButton: { backgroundColor: "#dc3545", color: "white" },
  buttonGroup: { display: "flex", gap: "10px", marginTop: "20px" },
  messageBubble: { position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#333", color: "white", padding: "10px 20px", borderRadius: "20px", zIndex: 1000, fontSize: "14px", textAlign: "center" },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px", cursor: "pointer", border: "3px solid #007bff" },
  placeholderIcon: { width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#ccc", marginBottom: "10px", color: "#888", padding: "10px", cursor: 'pointer', border: '3px dashed #007bff' },
  hiddenInput: { display: 'none' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '450px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' },
  cropperContainer: { position: 'relative', width: '100%', height: '300px', backgroundColor: '#f0f0f0', marginBottom: '15px', overflow: 'hidden' },
  imageToCrop: { width: '100%', height: '100%', objectFit: 'contain' },
  badgeContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' },
  badgeItem: { display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: '15px', backgroundColor: '#e9ecef', border: '1px solid #ced4da' }
};