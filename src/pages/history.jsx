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
                                            (<img className="placeholder-icon" src="https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/storage/images/person_60dp_000000_FILL0_wght400_GRAD0_opsz48.svg" alt={player.name}/>)}
                                        <span>{player.name}</span>
                                    </div>
                                    <div className="score">{player.score} pts</div>
                                    <div className="badges">🥇 {player.badges.gold} &nbsp; 🥈 {player.badges.silver} &nbsp; 🥉 {player.badges.bronze}</div>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
}