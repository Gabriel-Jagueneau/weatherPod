import { useEffect, useState, useRef } from "react";
import "ol/ol.css?url";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import { Select } from 'ol/interaction';
import { click } from 'ol/events/condition';

export default function History() {

    const [history, setHistory] = useState([]);
    const [locations, setLocations] = useState({});
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const vectorSourceRef = useRef(null);

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

    useEffect(() => {
        if (history.length === 0) return;

        const newLocations = {};
        history.forEach(player => {
            if (player.lat && player.lon) {
                newLocations[player.name] = {
                    lat: player.lat,
                    lon: player.lon,
                    address: player.localisation
                };
            }
        });
        setLocations(newLocations);
    }, [history]);

    useEffect(() => {
        if (!mapRef.current) return;

        vectorSourceRef.current = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSourceRef.current,
            style: new Style({
                image: new Icon({
                    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    scale: 0.05
                })
            })
        });

        mapInstanceRef.current = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat([2, 46]),
                zoom: 5
            })
        });

        return () => mapInstanceRef.current?.setTarget(null);
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        if (!vectorSourceRef.current) return;

        vectorSourceRef.current.clear();

        const vectorLayer = mapInstanceRef.current.getLayers().getArray().find(l => l instanceof VectorLayer);
        if (!vectorLayer) return;

        Object.entries(locations).forEach(([name, loc]) => {
            if (!loc.lat || !loc.lon) return;
            const offset = 0.0001 * Math.random();
            const player = history.find(p => p.name === name);
            const feature = new Feature({
                geometry: new Point(fromLonLat([loc.lon + offset, loc.lat + offset])),
                name: player?.name,
                score: player?.score || 0,
                system: player?.system || {}
            });
            vectorSourceRef.current.addFeature(feature);
        });

        let container = document.getElementById('minimap-popup');
        if (!container) return;
        container.style.display = 'block';

        const popup = new Overlay({
            element: container,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -10]
        });
        mapInstanceRef.current.addOverlay(popup);

        const selectClick = new Select({
            condition: click,
            layers: [vectorLayer]
        });
        mapInstanceRef.current.addInteraction(selectClick);

        selectClick.on('select', (e) => {
            const feature = e.selected[0];
            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                popup.setPosition(coordinates);
                const name = feature.get('name');
                const score = feature.get('score');
                const system = feature.get('system') || {};
                const capteursCount = system.capteurs ? system.capteurs.length : 0;
                const isStation = system.Station ? "Yes" : "No";
                popup.getElement().innerHTML = `<strong>${name}</strong><br/>Score: ${score}<br/>Équipement: ${capteursCount} capteur(s), Station: ${isStation}`;
            } else {
                popup.setPosition(undefined);
            }
        });

        return () => {
            mapInstanceRef.current.removeOverlay(popup);
            mapInstanceRef.current.removeInteraction(selectClick);
        };
    }, [locations, history]);

    const badgeDefinitions = [
        { key: 'verified', label: 'Verified', color: 'currentColor', d: "m346-60-76-130-151-31 17-147-96-112 96-111-17-147 151-31 76-131 134 62 134-62 77 131 150 31-17 147 96 111-96 112 17 147-150 31-77 130-134-62-134 62Zm27-79 107-45 110 45 67-100 117-30-12-119 81-92-81-94 12-119-117-28-69-100-108 45-110-45-67 100-117 28 12 119-81 94 81 92-12 121 117 28 70 100Zm107-341Zm-43 133 227-225-45-41-182 180-95-99-46 45 141 140Z" },
        { key: 'owner', label: 'Owner', color: 'currentColor', d: "M203-160v-60h554v60H203Zm-1-144-53-334q-5 2-9.5 2.5t-9.5.5q-21 0-35.5-14.5T80-685q0-21 14.5-36t35.5-15q21 0 36 15t15 36q0 8-2.5 16t-7.5 14l148 66 141-194q-14-6-22.5-18.5T429-830q0-21 15-35.5t36-14.5q21 0 36 14.5t15 35.5q0 16-8.5 28.5T500-783l141 194 148-66q-5-6-7.5-14t-2.5-16q0-21 15-36t35-15q21 0 36 15t15 36q0 21-15 35.5T829-635q-5 0-9-1t-9-3l-53 335H202Zm51-60h454l32-203-118 53-141-195-141 195-118-53 32 203Zm227 0Z" },
        { key: 'new', label: 'New', color: 'currentColor', d: "M100-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h760q24.75 0 42.38 18Q920-764 920-740v520q0 24-17.62 42-17.63 18-42.38 18H100Zm0-60h760v-520H100v520Zm30-137h45v-170l116 170h43v-246h-45v170L175-603h-45v246Zm249 0h157v-45H429v-54h107v-45H429v-56h107v-46H379v246Zm248 0h170q14.45 0 24.22-9.49Q831-375.98 831-390v-213h-45v196h-53v-155h-45v155h-49v-196h-45v213q0 14.02 9.49 23.51Q612.97-357 627-357ZM100-220v-520 520Z" },
        { key: 'feedback', label: 'Feedback', color: 'currentColor', d: "M482-80 123-433l197-240h323l198 240L482-80ZM173-701l-72-70 43-44 71 72-42 42Zm279-78v-101h60v101h-60Zm336 78-42-42 72-72 42 44-72 70ZM482-164l246-242H236l246 242ZM349-613 228-466h508L615-613H349Z" },
        { key: 'energy', label: 'Energy', color: 'currentColor', d: "M460-290q70.83 0 120.42-49.58Q630-389.17 630-460v-170H460q-70.83 0-120.42 49.58Q290-530.83 290-460q0 26.35 8.5 50.68Q307-385 321-363l-22 22q-9 9-9 21t9 21q9 9 21 9t21-9l22-22q22 14 46.32 22.5Q433.65-290 460-290Zm0-60q-14 0-27-4t-27-9l95-96q9-9 9-21t-9-21q-9-9-21-9t-21 9l-96 95q-5-14-9-27t-4-27q0-46.2 31.9-78.1Q413.8-570 460-570h110v110q0 46.2-31.9 78.1Q506.2-350 460-350Zm20 310L342-148l-173-21-21-173L40-480l108-138 21-173 173-21 138-108 138 108 173 21 21 173 108 138-108 138-21 173-173 21L480-40Zm0-77 113.84-88.07 143.91-18.25 17.18-142.84L843-480l-88.07-113.84-18.25-142.84-142.84-18.25L480-843l-113.84 88.07-143.91 18.25-17.18 142.84L117-480l88.07 113.84 18.25 143.91 142.84 17.18L480-117Zm0-363Zm0 0Z" },
        { key: 'bughunter', label: 'Bug Hunter', color: 'currentColor', d: "M480-180q72 0 123-50.5T654-353v-167q0-72-51-122.5T480-693q-72 0-123 50.5T306-520v167q0 72 51 122.5T480-180Zm-80-140h160v-60H400v60Zm0-173h160v-60H400v60Zm80 57h.5-.5.5-.5.5-.5.5-.5Zm0 316q-65 0-121-31t-83-89H160v-60h92q-7-26-7-52.5V-406h-85v-60h85q0-29 .5-57.5T254-580h-94v-60h120q14-28 37-49t51-35l-77-76 40-40 94 94q28-10 56.5-10t56.5 10l94-94 40 40-76 76q28 14 49.5 35.5T683-640h117v60h-94q9 28 8.5 56.5T714-466h86v60h-86q0 27 .5 53.5T708-300h92v60H685q-26 59-82.5 89.5T480-120Z" },
        { key: 'betatester', label: 'Beta Tester', color: 'currentColor', d: "M480-80q-155 0-268.53-102.14Q97.94-284.28 83-437h60q15.93 128.35 112.05 212.67Q351.17-140 479.68-140 622-140 721-238.81q99-98.82 99-241.19 0-142.38-98.81-241.19T480-820q-96.33 0-178.67 51Q219-718 177-633h127v60H91q32-136 140.5-221.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm115-243L450-467.98V-674h60v182l127 127-42 42Z" },
    ];

    return (
        <div className="page history">
            <h1>Voici la page Compétitive</h1>
            <p>Cette page à pour but de répertorier chaque capteur et faire un classement des ces dernier par utilisateurs volontaires.</p>
            <br />
            <h2>Classement des Joueurs</h2>
            <p>Toutes les informations montrées ici, sont à tout moment supprimables par l'utilisateur en question et/ou des administrateurs.</p>
            <div className="leaderboard">

                <div className="minimap">
                    <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
                </div>

                <div id="minimap-popup"></div>

                <div className="leaderboard-list">
                    {history
                        .sort((a, b) => b.score - a.score)
                        .map((player, index) => (
                            <div key={player.name} className="leaderboard-card">
                                <div className="rank">#{index + 1}</div>
                                <div className="info">
                                    <div className="player-name">
                                        {player.icon && player.icon.length > 0 ? (
                                            <img className="competitor-icon" src={`https://raw.githubusercontent.com/Gabriel-Jagueneau/weatherPod/refs/heads/main/${player.icon}`} alt={player.name}/>) : 
                                            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="placeholder-icon">
                                                <path d="M24 24c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 4c-5.333 0-16 2.667-16 8v4h32v-4c0-5.333-10.667-8-16-8z" />
                                            </svg>)}
                                        <span>{player.name}</span>
                                    </div>
                                    <div className="description">
                                        <div className="essential">
                                            <div className="score">{player.score} pts</div>
                                            <div className="badges">
                                                {player.badges && player.badges.map(badgeKey => {
                                                    const badgeDef = badgeDefinitions.find(b => b.key === badgeKey);
                                                    if (!badgeDef) return null;
                                                    return (
                                                        <span key={badgeDef.key} className="badge" title={badgeDef.label}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={badgeDef.color}>
                                                                <path d={badgeDef.d} />
                                                            </svg>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="equipment">
                                            <strong>Équipement:</strong> {player.system?.capteurs ? player.system.capteurs : 0} capteur(s), Station: {player.system?.Station ? "Oui" : "Non"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}