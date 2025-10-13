import { useEffect, useState } from "react";

export default function History() {

    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch("https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/data/competitiveLeaderboard.json");
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error("Erreur lors du chargement des compétiteurs :", error);
            }
        }
        fetchHistory();
    }, []);

    const badgeDefinitions = [
        { key: 'verified', color: '#1DA1F2', label: 'Verified', svg: (
            <path d="M22.5 11.5l-7 7-4-4" stroke="white" strokeWidth="2" fill="none" />
        ) },
        { key: 'owner', color: '#FF4500', label: 'Owner', svg: (
            <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" />
        ) },
        { key: 'new', color: '#32CD32', label: 'New', svg: (
            <circle cx="12" cy="12" r="10" />
        ) },
        { key: 'feedback', color: '#FFA500', label: 'Feedback', svg: (
            <path d="M4 4h16v16H4z" />
        ) },
        { key: 'energy', color: '#FFD700', label: 'Energy', svg: (
            <polygon points="12 2 15 11 22 11 16 16 18 22 12 18 6 22 8 16 2 11 9 11" />
        ) },
        { key: 'bughunter', color: '#8B0000', label: 'Bug Hunter', svg: (
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM7 9l5 5 5-5" stroke="white" strokeWidth="2" fill="none" />
        ) },
        { key: 'betatester', color: '#4B0082', label: 'Beta Tester', svg: (
            <circle cx="12" cy="12" r="10" />
        ) },
    ];

    return (
        <div className="page history">
            <h1>Voici la page Compétitive</h1>
            <p>Cette page à pour but de répertorier chaque capteur et faire un classement des ces dernier par utilisateurs volontaires.</p>

            <div className="leaderboard">
                <h2>🏆 Classement des Joueurs</h2>
                <div className="leaderboard-list">
                    {history
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => (
                            <div key={player.name} className="leaderboard-card">
                                <div className="rank">#{index + 1}</div>
                                <div className="info">
                                    <div className="player-name">
                                        {player.icon ? 
                                            (<img className="competitor-icon" src={player.icon} alt={player.name}/>) : 
                                            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="placeholder-icon">
                                                <path d="M24 24c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 4c-5.333 0-16 2.667-16 8v4h32v-4c0-5.333-10.667-8-16-8z" />
                                             </svg>
                                            )}
                                        <span>{player.name}</span>
                                    </div>
                                    <div className="score">{player.score} pts</div>
                                    <div className="badges">
                                      {badgeDefinitions.map(({ key, color, label, svg }) => {
                                        const count = player.badges?.[key];
                                        if (count > 0) {
                                          return (
                                            <span key={key} className={`badge ${key}`} title={label}>
                                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill={color}>
                                                {svg}
                                              </svg>
                                              {count}
                                            </span>
                                          );
                                        }
                                        return null;
                                      })}
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
}