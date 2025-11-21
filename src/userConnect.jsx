import React, { useState, useEffect, useRef, useCallback } from "react";
// Import de la librairie de recadrage
import Cropper from 'react-easy-crop';

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
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Utilisation de canvas.toDataURL() qui est synchrone.
      // Le format 'image/jpeg' est préférable pour la taille du fichier.
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(dataUrl);
    };
    image.onerror = (error) => reject(error);
  });
};


// ----------------------------------------------------
// --- COMPOSANT CropModal (IMPLÉMENTATION RÉELLE) ---
// ----------------------------------------------------
const CropModal = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); 

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      // Appel de la fonction utilitaire pour créer l'image recadrée
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
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

        {/* CONTENEUR DU CROPPER */}
        <div style={styles.cropperContainer}>
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} 
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropAreaChange}
                cropShape="round" 
                showGrid={true}
            />
        </div>
        
        {/* CONTRÔLE DE ZOOM */}
        <div style={{ padding: '10px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: '#555', fontSize: '14px' }}>Zoom:</span>
            <input 
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => onZoomChange(parseFloat(e.target.value))} // IMPORTANT: parseFloat pour le range
                style={{ flexGrow: 1 }}
            />
        </div>

        {/* BOUTONS D'ACTION */}
        <div style={styles.buttonGroup}>
          <button 
            style={{ ...styles.button, ...styles.secondaryButton, flexGrow: 0 }} 
            onClick={onCancel}
          >
            Annuler
          </button>
          <button 
            style={{ ...styles.button, ...styles.primaryButton, flexGrow: 2 }} 
            onClick={showCroppedImage}
            disabled={!croppedAreaPixels}
          >
            Confirmer le Recadrage
          </button>
        </div>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// --- Styles & Fonctions utilitaires (inchangés ou ajustés) ---
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
  placeholderIcon: { width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#ccc", marginBottom: "10px", color: "#888", padding: "10px", cursor: "pointer", border: "3px dashed #007bff" },
  hiddenInput: { display: 'none' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '450px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' },
  cropperContainer: { position: 'relative', width: '100%', height: '300px', backgroundColor: '#f0f0f0', marginBottom: '15px', overflow: 'hidden' },
  imageToCrop: { width: '100%', height: '100%', objectFit: 'contain' }
};

const getUsersDB = () => JSON.parse(localStorage.getItem("usersDB") || "{}");
const saveUsersDB = (db) => localStorage.setItem("usersDB", JSON.stringify(db));
const INACTIVITY_TIMEOUT = 10 * 60 * 1000;


// --- Composant d'authentification (inchangé) ---
const AuthCard = ({ username, setUsername, password, setPassword, handleLogin, handleRegister }) => (
  <div style={styles.card}>
    <h2>Se Connecter ou S'inscrire</h2>
    <p>Accédez au programme de compétition.</p>
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
        <button type="button" onClick={handleRegister} style={{ ...styles.button, ...styles.secondaryButton }}>S'inscrire</button>
      </div>
    </form>
  </div>
);

// --- Composant de Paramètres du Profil (inchangé) ---
const SettingsCard = ({ 
  profile, newUsername, newPassword, 
  updateProfile, logout, loggedInUser, handleAvatarFileSelect,
  isDirty, setNewUsernameAndDirty, setNewPasswordAndDirty, setProfileAndDirty 
}) => {
    
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

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
            <input 
                style={styles.input} 
                value={newUsername} 
                onChange={(e) => setNewUsernameAndDirty(e.target.value)} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nouveau mot de passe (Laisser vide si inchangé)</label>
            <input 
                style={styles.input} 
                type="password" 
                placeholder="••••••••" 
                value={newPassword} 
                onChange={(e) => setNewPasswordAndDirty(e.target.value)} 
            />
          </div>
      </div>

      {/* 2. Zone des Informations Publiques */}
      <div className="profile-edit-area">
          <h3>Informations Publiques</h3>
          
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <AvatarDisplay />
              <p style={{ marginTop: '0' }}>Utilisateur: *{loggedInUser}*</p>
          </div>
          
          {/* Input file masqué */}
          <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarFileSelect} 
              style={styles.hiddenInput} 
          />

          <div style={styles.inputGroup}>
            <label style={styles.label}>Pseudo (Nom affiché)</label>
            <input 
                style={styles.input} 
                value={profile.name} 
                onChange={(e) => setProfileAndDirty({ ...profile, name: e.target.value })} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Localisation</label>
            <input 
                style={styles.input} 
                value={profile.location} 
                onChange={(e) => setProfileAndDirty({ ...profile, location: e.target.value })} 
            />
          </div>
      </div>

      {/* 3. Zone des Actions (Bouton "Enregistrer" conditionnel) */}
      <div style={styles.buttonGroup}>
        
        {isDirty && (
          <button onClick={updateProfile} style={{ ...styles.button, ...styles.primaryButton }}>
              Enregistrer les modifications
          </button>
        )}
        
        <button onClick={logout} style={{ ...styles.button, ...styles.dangerButton }}>
            Se déconnecter
        </button>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// --- Composant Principal Connect (Logique de Dirty Check) ---
// ----------------------------------------------------
export default function Connect() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", location: "", avatar: "" });
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [imageToCrop, setImageToCrop] = useState(null); 
  const [isDirty, setIsDirty] = useState(false);

  const savedState = useRef({});
  const inactivityTimer = useRef(null);

  // --- 1. Fonctions de gestion de l'état/session (useCallback) ---

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
    });

    const savedProfileString = JSON.stringify({
        name: savedState.current.profile?.name,
        location: savedState.current.profile?.location,
        avatar: savedState.current.profile?.avatar,
    });
    
    return currentProfileString !== savedProfileString;
  }, []);

  // --- 2. Handlers qui mettent à jour l'état ET le flag Dirty ---
  
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


  // --- 3. Logique d'initialisation et d'inactivité (useEffect) ---
  
  useEffect(() => {
    const usersDB = getUsersDB();
    const savedUser = localStorage.getItem("loggedInUser");
    
    if (savedUser && usersDB[savedUser]) {
      const initialProfile = usersDB[savedUser + "_profile"] || { name: savedUser, location: "", avatar: "" };
      
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


  // --- 4. Logique d'authentification et de mise à jour ---

  const handleLogin = (e) => {
    e.preventDefault();
    const usersDB = getUsersDB();
    
    if (usersDB[username] && usersDB[username] === password) {
      const initialProfile = usersDB[username + "_profile"] || { name: username, location: "", avatar: "" };
      
      setLoggedInUser(username);
      setProfile(initialProfile);
      setNewUsername(username);
      
      usersDB[username + "_lastLogin"] = new Date().toISOString();
      saveUsersDB(usersDB);
      localStorage.setItem("loggedInUser", username);
      
      updateSavedState(initialProfile, username, usersDB[username]);
      
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
    
    let usersDB = getUsersDB();
    if (usersDB[username]) {
      setMessage("Utilisateur déjà existant.");
      return;
    }
    
    const initialProfile = { name: username, location: "", avatar: "" };
    
    usersDB[username] = password;
    usersDB[username + "_lastLogin"] = new Date().toISOString();
    usersDB[username + "_profile"] = initialProfile;
    saveUsersDB(usersDB);
    
    setLoggedInUser(username);
    setProfile(initialProfile);
    setNewUsername(username);
    localStorage.setItem("loggedInUser", username);
    updateSavedState(initialProfile, username, password);
    
    setMessage("Utilisateur créé et connecté !");
    startInactivityTimer();
  };

  const updateProfile = () => {
    if (!loggedInUser || !isDirty) return;

    let usersDB = getUsersDB();
    let currentUser = loggedInUser;
    
    // 1. Changement de nom d'utilisateur
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
    
    // 2. Changement de mot de passe
    if (newPassword) { 
        usersDB[currentUser] = newPassword;
    }

    // 3. Mise à jour du profil (name, location, avatar)
    usersDB[currentUser + "_profile"] = profile;
    saveUsersDB(usersDB);
    
    updateSavedState(profile, currentUser, usersDB[currentUser]);
    
    setMessage("Profil mis à jour !");
    setNewPassword(""); 
  };


  // --- 5. Logique de Recadrage (Appel au composant réel) ---
  
  const handleAvatarFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        setImageToCrop(reader.result); 
    };
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


  // --- 6. Rendu Final ---
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
      
      {/* AFFICHAGE DU CROPPER RÉEL */}
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