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
                                        {player.icon ? (<img src={player.icon} alt={player.name} style={{ width: "32px", borderRadius: "50%", marginRight: "8px" }}/>) : (<span className="placeholder-icon">👤</span>)}
                                        <span>{player.name}</span>
                                        <div className="player-country">
                                            <img src={`https://flagcdn.com/24x18/${player.country.toLowerCase()}.png`} alt={player.country} style={{ borderRadius: "3px" }}/>
                                        </div>
                                    </div>
                        
                                    <div className="score">{player.score} pts</div>
                                </div>
                      
                                <div className="badges">🥇 {player.badges.gold} &nbsp; 🥈 {player.badges.silver} &nbsp; 🥉 {player.badges.bronze}</div>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
}