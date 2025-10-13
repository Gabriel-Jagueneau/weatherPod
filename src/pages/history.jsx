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
                                        🥇 {player.badges.gold}
                                        🥈 {player.badges.silver}
                                        🥉 {player.badges.bronze}
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
}