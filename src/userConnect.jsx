import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Cropper from 'react-easy-crop';

const GITHUB_USERS_DB_URL = "https://raw.githubusercontent.com/Gabriel-Jagueneau/Plinzy/main/storage/data/users.json";

const badgeDefinitions = [
    { key: 'verified', label: 'Verified', color: '#28a745', d: "m346-60-76-130-151-31 17-147-96-112 96-111-17-147 151-31 76-131 134 62 134-62 77 131 150 31-17 147 96 111-96 112 17 147-150 31-77 130-134-62-134 62Zm27-79 107-45 110 45 67-100 117-30-12-119 81-92-81-94 12-119-117-28-69-100-108 45-110-45-67 100-117 28 12 119-81 94 81 92-12 121 117 28 70 100Zm107-341Zm-43 133 227-225-45-41-182 180-95-99-46 45 141 140Z" },
    { key: 'owner', label: 'Owner', color: '#ffc107', d: "M203-160v-60h554v60H203Zm-1-144-53-334q-5 2-9.5 2.5t-9.5.5q-21 0-35.5-14.5T80-685q0-21 14.5-36t35.5-15q21 0 36 15t15 36q0 8-2.5 16t-7.5 14l148 66 141-194q-14-6-22.5-18.5T429-830q0-21 15-35.5t36-14.5q21 0 36 14.5t15 35.5q0 16-8.5 28.5T500-783l141 194 148-66q-5-6-7.5-14t-2.5-16q0-21 15-36t35-15q21 0 36 15t15 36q0 21-15 35.5T829-635q-5 0-9-1t-9-3l-53 335H202Zm51-60h454l32-203-118 53-141-195-141 195-118-53 32 203Zm227 0Z" },
    { key: 'bughunter', label: 'Bug Hunter', color: '#dc3545', d: "M480-180q72 0 123-50.5T654-353v-167q0-72-51-122.5T480-693q-72 0-123 50.5T306-520v167q0 72 51 122.5T480-180Zm-80-140h160v-60H400v60Zm0-173h160v-60H400v60Zm80 57h.5-.5.5-.5.5-.5.5-.5Zm0 316q-65 0-121-31t-83-89H160v-60h92q-7-26-7-52.5V-406h-85v-60h85q0-29 .5-57.5T254-580h-94v-60h120q14-28 37-49t51-35l-77-76 40-40 94 94q28-10 56.5-10t56.5 10l94-94 40 40-76 76q28 14 49.5 35.5T683-640h117v60h-94q9 28 8.5 56.5T714-466h86v60h-86q0 27 .5 53.5T708-300h92v60H685q-26 59-82.5 89.5T480-120Z" },
    { key: 'betatester', label: 'Beta Tester', color: '#d58d41', d: "M480-80q-155 0-268.53-102.14Q97.94-284.28 83-437h60q15.93 128.35 112.05 212.67Q351.17-140 479.68-140 622-140 721-238.81q99-98.82 99-241.19 0-142.38-98.81-241.19T480-820q-96.33 0-178.67 51Q219-718 177-633h127v60H91q32-136 140.5-221.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm115-243L450-467.98V-674h60v182l127 127-42 42Z" },
    { key: 'new', label: 'New', color: '#41c9d5', d: "M100-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h760q24.75 0 42.38 18Q920-764 920-740v520q0 24-17.62 42-17.63 18-42.38 18H100Zm0-60h760v-520H100v520Zm30-137h45v-170l116 170h43v-246h-45v170L175-603h-45v246Zm249 0h157v-45H429v-54h107v-45H429v-56h107v-46H379v246Zm248 0h170q14.45 0 24.22-9.49Q831-375.98 831-390v-213h-45v196h-53v-155h-45v155h-49v-196h-45v213q0 14.02 9.49 23.51Q612.97-357 627-357ZM100-220v-520 520Z" },
];

const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

const getAccountAgeInDays = (joinedAtString) => {
    if (!joinedAtString) return Infinity; 
    const registrationDate = new Date(joinedAtString);
    const today = new Date();
    const diffTime = Math.abs(today - registrationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
};

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
    <div className="modal-overlay is-active"> 
      <div className="modal-content">
        <h2>Recadrer l'Avatar</h2>
        <div className="cropper-container">
            <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} 
                onCropChange={onCropChange} onZoomChange={onZoomChange}
                onCropComplete={onCropAreaChange} cropShape="round" showGrid={true}
            />
        </div>
        <div className="cropper-container-range">
            <span>Zoom:</span>
            <input type="range" value={zoom} min={1} max={3} step={0.1}
                onChange={(e) => onZoomChange(parseFloat(e.target.value))} style={{ flexGrow: 1 }}
            />
        </div>
        <div className="button-group">
          <button className="button button--secondary" onClick={onCancel}>Annuler</button>
          <button className="button button--primary" onClick={showCroppedImage} disabled={!croppedAreaPixels}>Confirmer le Recadrage</button>
        </div>
      </div>
    </div>
  );
};

const BadgeDisplay = ({ badges, badgeDefinitions }) => {
  if (!badges || badges.length === 0) {
    return <p className="default">Aucun badge actif.</p>;
  }
  return (
    <div className="badge-container">
      {badges.map(badgeKey => {
        const badge = badgeDefinitions.find(def => def.key === badgeKey);
        if (!badge) return null;
        return (
          <div key={badge.key} title={badge.label} className="badge-item blur-box">
            <svg style={{ fill: badge.color }} viewBox="0 -960 960 960">
              <path d={badge.d} />
            </svg>
            <span style={{ color: badge.color }}>{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const AuthCard = ({ 
  username, setUsername, password, setPassword, 
  handleLogin, handleRegister, rememberMe, setRememberMe 
}) => (
  <div className="connect">
    <h2>Connexion</h2>
    <p>Utilisez votre identifiant fourni.</p>
    <form onSubmit={handleLogin}>
      <div className="input-group">
        <input className="input blur-box" type="text" placeholder=" " value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label className="label blur-box">Nom d'utilisateur</label>
      </div>
      <div className="input-group">
        <input className="input blur-box" type="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label className="label blur-box">Mot de passe</label>
      </div>
      
      <div className="checkbox-container">
        <div className="checkbox">
          <div className="cbx">
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
            />
            <label></label>
            <svg viewbox="0 0 15 14" fill="none">
              <path d="M2 8.36364L6.23077 12L13 2"></path>
            </svg>
          </div>
        </div>
        <span>Rester connecté</span>
      </div>
      <div className="button-group">
        <button type="submit" className="button button--primary">
          Se connecter
        </button>
        <button 
          type="button" 
          onClick={handleRegister} 
          className="button button--secondary" 
          disabled={true} 
          style={{ cursor: 'not-allowed' }}
        >Vous ne pouvez pas créer de compte</button>
      </div>
    </form>
  </div>
);

const SettingsCard = ({ 
  profile, loggedInUser, logout, 
  setProfile, 
  handleAvatarFileSelect,
  handleProfileSave, 
  isModified 
}) => {
  const fileInputRef = useRef(null);
  const handleAvatarClick = () => { fileInputRef.current.click(); };
    
  const AvatarDisplay = () => (
    <div onClick={handleAvatarClick} style={{ cursor: 'pointer' }} className="zone-select">
      {profile.avatar ? (
        <img className="avatar" src={profile.avatar} alt={profile.name || loggedInUser} />
      ) : (
        <svg className="placeholder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 24c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 4c-5.333 0-16 2.667-16 8v4h32v-4c0-5.333-10.667-8-16-8z" />
        </svg>
      )}
      <p>Cliquer pour changer d'avatar</p>
    </div>
  );
  
  const setProfileValue = (key, value) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [key]: value
    }));
  };

  const saveButtonClass = isModified ? 'button--save-visible' : 'button--save-hidden';

  return (
    <div className="connect">
      <h2>Paramètres du profil</h2>
      <p>Vos données viennent de GitHub. Les modifications d'avatar/pseudo ne sont valables que pour cette session.</p>
      
      <div className="idf-secu">
          <h3>Identifiants et Sécurité</h3>
          <div className="input-group">
            <input className="input blur-box" value={loggedInUser} placeholder=" " readOnly />
            <label className="label blur-box">Nom d'utilisateur</label>
          </div>
          <div className="input-group">
            <input className="input blur-box" type="password" placeholder=" " value="••••••••••" readOnly />
            <label className="label blur-box">Mot de passe</label>
          </div>
      </div>
      
      <div className="profile-edit-area">
          <h3>Informations Publiques</h3>
          <div className="avatar-change">
            <AvatarDisplay />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFileSelect} className="input--hidden" />
          </div>
          
          <div className="input-group">
            <input 
              className="input blur-box" 
              placeholder=" "
              value={profile.name} 
              onChange={(e) => setProfileValue('name', e.target.value)}
            />
            <label className="label blur-box">Pseudo (Nom affiché)</label>
          </div>
          <div className="input-group">
            <input 
              className="input blur-box" 
              placeholder=" "
              value={profile.location} 
              onChange={(e) => setProfileValue('location', e.target.value)}
            />
            <label className="label blur-box">Localisation</label>
          </div>

          <div className="badges-group">
            <h4 className="label">Badges Actifs</h4>
            <BadgeDisplay badges={profile.badges} badgeDefinitions={badgeDefinitions} />
          </div>
      </div>
      
      <div className="stat-syst">
          <h3>Statistiques et Système</h3>
          <div className="stats-grid">
              <div className="stat-item">
                  <span className="stat-label">Score :</span>
                  <span className="stat-value">{profile.score !== undefined ? profile.score : 'N/A'}</span>
              </div>
              <div className="stat-item">
                  <span className="stat-label">Abonnement :</span>
                  <span className="stat-value">{profile.subscription || 'Standard'}</span>
              </div>
              <div className="stat-item">
                  <span className="stat-label">Capteurs actifs :</span>
                  <span className="stat-value">{profile.system?.capteurs !== undefined ? profile.system.capteurs : 0}</span>
              </div>
              <div className="stat-item">
                  <span className="stat-label">Stations possédées :</span>
                  <span className="stat-value">{profile.system?.Station !== undefined ? profile.system.Station : 0}</span>
              </div>
          </div>
      </div>
      
      <div className="button-group">
        <button onClick={handleProfileSave} className={`button button--success ${saveButtonClass}`}>
          Enregistrer
        </button>
        <button onClick={logout} className="button button--danger">
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default function Connect() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const messageTimeoutRef = useRef(null);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [profile, setProfile] = useState({ 
    name: "", location: "", avatar: "", badges: [], 
    score: undefined, subscription: "", system: { capteurs: 0, Station: 0 } 
  }); 
  const [rememberMe, setRememberMe] = useState(
      localStorage.getItem("rememberMe") === "true" 
  );
  const [imageToCrop, setImageToCrop] = useState(null); 
  
  const [githubUsers, setGithubUsers] = useState(null); 
  const [sessionProfileData, setSessionProfileData] = useState({}); 

  const inactivityTimer = useRef(null);
  
  const showMessage = useCallback((text) => {
    setMessage(text);
    setIsMessageVisible(true);
    
    if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
    }
    
    messageTimeoutRef.current = setTimeout(() => {
        setIsMessageVisible(false);
    }, 3000); 
    
  }, []);

  useEffect(() => {
      return () => {
          clearTimeout(messageTimeoutRef.current);
          clearTimeout(inactivityTimer.current);
      };
  }, []);

  const logout = useCallback(() => {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
    localStorage.removeItem("loggedInUser");
    clearTimeout(inactivityTimer.current);
    showMessage("Déconnexion réussie.");
  }, [showMessage]);

  const startInactivityTimer = useCallback(() => {
    if (localStorage.getItem("rememberMe") === "true") return; 

    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
      showMessage("Vous avez été déconnecté pour cause d'inactivité.");
    }, INACTIVITY_TIMEOUT);
  }, [logout, showMessage]); 

  const resetInactivityTimer = useCallback(() => {
    if (loggedInUser) startInactivityTimer();
  }, [loggedInUser, startInactivityTimer]);
  
  const isProfileModified = useMemo(() => {
    const keysToCompare = ['name', 'location', 'avatar'];

    for (const key of keysToCompare) {
        if (profile[key] !== sessionProfileData[key]) {
            return true;
        }
    }
    return false;
  }, [profile, sessionProfileData]);

  const handleProfileSave = useCallback(() => {
      if (!loggedInUser) return;
      
      const saveKey = `profile_${loggedInUser}`;
      
      const savedData = {
          name: profile.name,
          location: profile.location,
          avatar: profile.avatar,
      };
      
      localStorage.setItem(saveKey, JSON.stringify(savedData));
      
      setSessionProfileData(savedData); 
      
      showMessage("Profil mis à jour pour cette session !");
  }, [loggedInUser, profile, showMessage]);

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
        showMessage("Erreur de connexion à la base de données utilisateurs.");
        setGithubUsers({}); 
      }
    };
    fetchUsers();
  }, [showMessage]); 

  useEffect(() => {
    if (!githubUsers) return; 
    
    const savedUser = localStorage.getItem("loggedInUser");
    const isRemembered = localStorage.getItem("rememberMe") === "true";
    
    if (savedUser && githubUsers[savedUser]) {
      
      if (!isRemembered) {
          localStorage.removeItem("loggedInUser");
          setLoggedInUser(null);
          return; 
      }
      
      const userCredentials = githubUsers[savedUser];
      const accountAgeDays = getAccountAgeInDays(userCredentials.joined); 
      const isNew = accountAgeDays < 182.5; 
      
      let badges = userCredentials.badges || [];
      const hasNewBadge = badges.includes('new');

      if (isNew && !hasNewBadge) {
          badges = [...badges, 'new'];
      } else if (!isNew && hasNewBadge) {
          badges = badges.filter(b => b !== 'new');
      }

      let initialProfile = { 
          name: userCredentials.name || savedUser, 
          location: userCredentials.localisation || "", 
          avatar: userCredentials.icon || "",
          badges: badges,
          score: userCredentials.score,
          subscription: userCredentials.subscription,
          system: userCredentials.system || { capteurs: 0, Station: 0 }
      };

      let savedData = {
          name: initialProfile.name,
          location: initialProfile.location,
          avatar: initialProfile.avatar,
      };

      const saveKey = `profile_${savedUser}`;
      const savedProfileJSON = localStorage.getItem(saveKey);
      
      if (savedProfileJSON) {
          try {
              const profileOverrides = JSON.parse(savedProfileJSON);
              initialProfile = { ...initialProfile, ...profileOverrides };
              savedData = profileOverrides; 
          } catch (e) {
              console.error("Erreur de parsing du profil sauvegardé:", e);
              localStorage.removeItem(saveKey);
          }
      }
      
      setLoggedInUser(savedUser);
      setProfile(initialProfile);
      setSessionProfileData(savedData);
      
      if (isRemembered) {
          startInactivityTimer();
      }
      
    } else {
        localStorage.removeItem("loggedInUser");
    }
  }, [githubUsers, startInactivityTimer]);


  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!githubUsers) {
        showMessage("Base de données en cours de chargement, veuillez patienter.");
        return;
    }

    const userCredentials = githubUsers[username];
    
    if (userCredentials && userCredentials.password === password) {
      
      localStorage.setItem("rememberMe", rememberMe.toString());
      localStorage.setItem("loggedInUser", username); 
      
      const accountAgeDays = getAccountAgeInDays(userCredentials.joined);
      const isNew = accountAgeDays < 182.5; 
      
      let badges = userCredentials.badges || [];
      const hasNewBadge = badges.includes('new');

      if (isNew && !hasNewBadge) {
          badges = [...badges, 'new'];
      } else if (!isNew && hasNewBadge) {
          badges = badges.filter(b => b !== 'new');
      }

      let initialProfile = { 
          name: userCredentials.name || username, 
          location: userCredentials.localisation || "", 
          avatar: userCredentials.icon || "",
          badges: badges,
          score: userCredentials.score,
          subscription: userCredentials.subscription,
          system: userCredentials.system || { capteurs: 0, Station: 0 }
      };
      
      let savedData = {
          name: initialProfile.name,
          location: initialProfile.location,
          avatar: initialProfile.avatar,
      };

      const saveKey = `profile_${username}`;
      const savedProfileJSON = localStorage.getItem(saveKey);
      
      if (savedProfileJSON) {
          try {
              const profileOverrides = JSON.parse(savedProfileJSON);
              initialProfile = { ...initialProfile, ...profileOverrides };
              savedData = profileOverrides;
          } catch (e) {
              console.error("Erreur de parsing du profil sauvegardé:", e);
              localStorage.removeItem(saveKey);
          }
      }

      setLoggedInUser(username);
      setProfile(initialProfile);
      setSessionProfileData(savedData);
      
      showMessage("Connexion réussie !");
      
      if (!rememberMe) {
          startInactivityTimer();
      }
      
    } else {
      showMessage("Nom d'utilisateur ou mot de passe incorrect.");
    }
  };


  const handleRegister = () => {
    showMessage("L'inscription est désactivée. Veuillez utiliser un identifiant fourni.");
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
    showMessage("Avatar mis à jour pour cette session ! (En attente d'enregistrement)");
  };
  
  const handleCropCancel = () => {
    setImageToCrop(null); 
    showMessage("Modification d'avatar annulée.");
  };

  return (
    <div className="page" onMouseMove={resetInactivityTimer} onKeyPress={resetInactivityTimer}>
      
      {loggedInUser ? (
        <SettingsCard 
          profile={profile} 
          loggedInUser={loggedInUser}
          logout={logout} 
          setProfile={setProfile} 
          handleAvatarFileSelect={handleAvatarFileSelect}
          handleProfileSave={handleProfileSave}
          isModified={isProfileModified}
        />
      ) : (
        <AuthCard 
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword} 
          handleLogin={handleLogin} 
          handleRegister={handleRegister}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
      )}
      
      {imageToCrop && (
        <CropModal 
          imageSrc={imageToCrop} 
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      {message && isMessageVisible && (
        <div key={message} className="message-bubble blur-box">
          {message}
        </div>
      )}
    </div>
  );
}