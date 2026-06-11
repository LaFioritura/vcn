import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { Compass, ShieldAlert, Sparkles, Navigation, Target, Lock, Unlock, MapPin, ZoomIn, ZoomOut, RotateCcw, Crosshair, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

interface SpeculationMapProps {
  isUnlocked?: boolean;
}

// Google Maps API Key handling
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

// Encrypted values of the venue to prevent pre-booking code inspection/leaks
const CLASSIFIED_INFO = {
  locked: {
    name: "🎯 TARGET CRITTOGRAFATO",
    address: "INDIRIZZO PROPRIETARIO CONFIDENZIALE",
    description: "La location esatta del Midnight Launch Party di GTA VI (Napoli Zone) è protetta da un algoritmo crittografico di classe VCN. Prenota il tuo ticket gratuito con sconto del 15% per decodificare in tempo reale la traccia satellitare!",
    azimuth: "AZ-███° NA_████",
    radarZone: "CLASSIFIED LOCK"
  },
  unlocked: {
    name: "Azale Flower & Bar",
    address: "Via Roma, 290, 80038 Pomigliano d'Arco, Napoli, Italia",
    description: "La venue d'eccezione sbloccata per il Midnight Release Party di GTA VI! Abbiamo scelto questo spettacolare bar a Pomigliano d'Arco, interamente allestito in perfetto stile neon tropicale di Vice Beach. Musica synthwave, cocktail fuxia esclusivi, gadget speciali della community VCN e la tua copia fisica di GTA VI garantita con il 15% di sconto!",
    azimuth: "AZ-081° NA_POMI",
    radarZone: "POMIGLIANO_ZONE",
    lat: 40.9126,
    lng: 14.3918
  }
};

// Custom Google Maps Dark Styling matching GTA HUD
const darkRadarMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#0d0a21" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0d0a21" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#9d4edd" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#00ffff" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#f72585" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#120f3a" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#39c2c9" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1a163a" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#2a245c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca3af" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#ff00cc" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#110b29" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#1b1933" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#040314" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#00ffff" }] }
];

function MapPanController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
      map.setZoom(16);
    }
  }, [map, center]);
  return null;
}

export default function SpeculationMap({ isUnlocked = false }: SpeculationMapProps) {
  const [isRotatingRadar, setIsRotatingRadar] = useState(true);
  const [mapMode, setMapMode] = useState<"vector" | "google">(hasValidKey ? "google" : "vector");
  
  // Interactive Simulated GPS Vector Map states
  const [zoomLevel, setZoomLevel] = useState(1.4); // 0.8x to 3x
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isSonarScanning, setIsSonarScanning] = useState(false);
  const [sonarSignals, setSonarSignals] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  // Decrypt feedback animation
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    if (isUnlocked && decryptProgress < 100) {
      setIsDecrypting(true);
      const interval = setInterval(() => {
        setDecryptProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDecrypting(false);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  // Handle Sonar Beep Action
  const triggerSonarScan = () => {
    if (!isUnlocked) return;
    setIsSonarScanning(true);
    // Audio synthesis of a radar submarine sonar beep
    try {
      const AudioContextClass = globalThis.AudioContext || (globalThis as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        // High sonar frequency gliding down
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(1200, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(300, now + 1.2);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.2);
        
        osc.start(now);
        osc.stop(now + 1.3);
      }
    } catch(e) {}

    // Simulated scanner feedback coordinates
    setSonarSignals([
      { x: -30, y: 40, id: Math.random() },
      { x: 50, y: -20, id: Math.random() },
      { x: 10, y: -65, id: Math.random() }
    ]);

    setTimeout(() => {
      setIsSonarScanning(false);
      setSonarSignals([]);
    }, 1800);
  };

  const handlePan = (dir: "N" | "S" | "E" | "W") => {
    const step = 25 / zoomLevel;
    setPanOffset(prev => {
      let nx = prev.x;
      let ny = prev.y;
      if (dir === "N") ny += step;
      if (dir === "S") ny -= step;
      if (dir === "E") nx -= step;
      if (dir === "W") nx += step;
      return { x: nx, y: ny };
    });
  };

  const handleResetMap = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1.4);
  };

  const currentInfo = isUnlocked ? CLASSIFIED_INFO.unlocked : CLASSIFIED_INFO.locked;

  // Render simulated streets layouts inside vector SVG map
  // Street coordinates centered at 150, 150
  const streetsData = [
    // Main avenue (Horizontal)
    "M -100 150 L 400 150", 
    // Sub avenues (Vertical)
    "M 150 -100 L 150 400",
    // Loop roads
    "M 70 70 A 110 110 0 1 1 230 230",
    "M 110 110 A 55 55 0 1 1 190 190",
    // Diagonal bypass expressway
    "M -50 -50 L 350 350",
    // Urban secondary blocks
    "M 50 150 L 50 250",
    "M 250 150 L 250 50",
    "M 152 70 L 300 70",
    "M 152 230 L 20 230"
  ];

  return (
    <div id="vcn-radar-container" className="flex flex-col h-full bg-[#0d0a1b] border-2 border-neon-cyan/40 rounded-3xl p-5 overflow-hidden relative group shadow-lg shadow-cyan-500/5 transition-all">
      {/* CRT Scanline & Retro Grid Style */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-30" />
      <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 z-10 gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-neon-cyan animate-spin-slow" />
          <span className="text-xs font-mono font-black uppercase tracking-widest text-neon-cyan">
            VCN GPS SAT-RADAR HUD • DIRETTORE SATELLITARE
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[9px]">
          <span className="text-gray-500">FREQUENZA: G-TRACK_M-88</span>
          <span className={`font-bold flex items-center gap-1 ${isUnlocked ? 'text-emerald-400' : 'text-neon-pink'}`}>
            <span className={`w-2 h-2 rounded-full ${isUnlocked ? 'bg-emerald-500' : 'bg-neon-pink animate-ping'}`} />
            {isUnlocked ? "● DISPOSITIVO ONLINE" : "● SEGNALE CRITTOGRAFATO"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch z-10">
        
        {/* LEFT COLUMN: Circular Tactical Radar Interface (Col 7) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/40 border border-white/5 p-4 rounded-3xl relative min-h-[360px]">
          
          {/* Circular Frame replicating GTA 6 Mini-map HUD */}
          <div className="relative w-full aspect-square max-w-[310px] rounded-full overflow-hidden border-[6px] border-[#18152c] shadow-2xl hover:border-neon-cyan/30 transition-all select-none bg-[#070514]">
            
            {/* Real-time coordinates HUD accents */}
            <div className="absolute inset-0 border-[2px] border-neon-cyan/20 rounded-full pointer-events-none z-10" />
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-neon-cyan/20 pointer-events-none z-10" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-neon-cyan/20 pointer-events-none z-10" />
            
            {/* Sweeping dynamic radar Scan */}
            {isRotatingRadar && (
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_60%,rgba(0,255,255,0.2)_100%)] rounded-full animate-radar-sweep pointer-events-none z-10" />
            )}

            {/* Simulated mini HUD telemetry */}
            <div className="absolute top-3.5 left-3.5 bg-black/80 text-[7px] font-mono text-neon-cyan border border-neon-cyan/30 px-1.5 py-0.5 rounded uppercase z-20 select-none">
              MAG_HEADING: {180 + Math.round(panOffset.x)}°
            </div>

            <div className="absolute top-3.5 right-3.5 bg-black/80 text-[7px] font-mono text-neon-pink border border-neon-pink/30 px-1.5 py-0.5 rounded uppercase z-20 select-none">
              SCALE: {Math.round(zoomLevel * 100)}%
            </div>

            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 bg-black/95 text-[7.5px] font-mono text-emerald-400 border border-white/10 px-2 py-0.5 rounded whitespace-nowrap uppercase z-20 select-none">
              🛰️ SAT_LINKS: {isUnlocked ? "12/12 HD_LOCK" : "01/12 PEER_SEARCH"}
            </div>

            {/* MAP VIEW SWITCHER */}
            {isUnlocked && hasValidKey && (
              <div className="absolute bottom-12 left-3.5 z-20 flex flex-col gap-1">
                <button
                  onClick={() => setMapMode(mapMode === "google" ? "vector" : "google")}
                  className="p-1 px-2 bg-black/90 border border-neutral-700 text-[6.5px] font-mono font-bold text-white rounded hover:bg-neon-cyan hover:text-black hover:border-neon-cyan"
                >
                  📡 {mapMode === "google" ? "PASSA A BLUEPRINT" : "PASSA A SATELLITE SITO"}
                </button>
              </div>
            )}

            {/* RENDER THE CORRESPONDING VIEW */}
            {/* 1. ACTUAL GOOGLE MAP (ONLY IF UNLOCKED AND HAS VALID KEY) */}
            {isUnlocked && hasValidKey && mapMode === "google" ? (
              <APIProvider apiKey={API_KEY} version="weekly">
                <Map
                  defaultCenter={{ lat: CLASSIFIED_INFO.unlocked.lat, lng: CLASSIFIED_INFO.unlocked.lng }}
                  defaultZoom={16}
                  onBoundsChanged={(e: any) => {
                    // Update offset internally to align with panner
                  }}
                  mapId="DEMO_MAP_ID"
                  styles={darkRadarMapStyle as any}
                  disableDefaultUI={true}
                  gestureHandling="cooperative"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: "100%", height: "100%", borderRadius: "9999px" }}
                >
                  <MapPanController center={{ lat: CLASSIFIED_INFO.unlocked.lat, lng: CLASSIFIED_INFO.unlocked.lng }} />
                  <AdvancedMarker position={{ lat: CLASSIFIED_INFO.unlocked.lat, lng: CLASSIFIED_INFO.unlocked.lng }}>
                    <div className="relative w-10 h-10 flex items-center justify-center cursor-pointer">
                      <span className="absolute -inset-2 rounded-full bg-neon-pink/40 animate-ping" />
                      <div className="relative w-7 h-7 rounded-full bg-neon-pink border-2 border-white flex items-center justify-center shadow-lg font-bold text-xs">
                        🍹
                      </div>
                    </div>
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            ) : (
              /* 2. PREMIUM FULLY INTERACTIVE CUSTOM VECTOR GPS RADAR BLUEPRINT (WORKS EVERYWHERE FOR EVERYONE!) */
              <div 
                className="w-full h-full relative"
                style={{
                  cursor: isUnlocked ? "grab" : "not-allowed"
                }}
              >
                {/* SVG canvas elements mapping roads */}
                <svg 
                  className="w-full h-full transform transition-transform duration-300"
                  viewBox="0 0 300 300"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                    transformOrigin: "150px 150px"
                  }}
                >
                  {/* Outer Sector Reference Lines */}
                  <circle cx="150" cy="150" r="145" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
                  <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx="150" cy="150" r="25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                  {/* Ocean waterways background if unlocked */}
                  {isUnlocked && (
                    <path d="M -100 -50 Q 80 80 -100 280 L -100 -50 Z" fill="rgba(6, 182, 212, 0.05)" />
                  )}

                  {/* Rendering Vector Roads */}
                  {streetsData.map((dStr, idx) => (
                    <path
                      key={idx}
                      d={dStr}
                      fill="none"
                      stroke={isUnlocked ? "rgba(0, 255, 255, 0.28)" : "rgba(100, 116, 139, 0.15)"}
                      strokeWidth={idx < 2 ? "3.5" : "2"}
                      strokeDasharray={idx === 4 ? "4 4" : "none"}
                      className="transition-all duration-1000"
                    />
                  ))}

                  {/* Custom Highway Glow Line if unlocked */}
                  {isUnlocked && (
                    <path 
                      d="M -50 -50 L 350 350" 
                      fill="none" 
                      stroke="rgba(247, 37, 133, 0.45)" 
                      strokeWidth="5" 
                      className="animate-pulse"
                    />
                  )}

                  {/* Sonar Beacon rings animating on scan */}
                  {isSonarScanning && isUnlocked && (
                    <>
                      <circle cx="150" cy="150" r="30" fill="none" stroke="#ff00cc" strokeWidth="2" className="animate-ping" />
                      <circle cx="150" cy="150" r="65" fill="none" stroke="#00ffff" strokeWidth="1" className="animate-ping" style={{ animationDelay: "0.2s" }} />
                    </>
                  )}

                  {/* Dynamic Sonar Signal Blobs */}
                  {isUnlocked && sonarSignals.map((sig) => (
                    <circle 
                      key={sig.id} 
                      cx={150 + sig.x} 
                      cy={150 + sig.y} 
                      r="4" 
                      fill="#eab308" 
                      opacity="0.7" 
                      className="animate-pulse" 
                    />
                  ))}

                  {/* TARGET PULSATOR (THE SECRET VENUE MARKER) */}
                  {isUnlocked ? (
                    <g transform="translate(150, 150)">
                      {/* Pulse rings */}
                      <circle cx="0" cy="0" r="14" fill="none" stroke="#ff00cc" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                      <circle cx="0" cy="0" r="8" fill="none" stroke="#00ffff" strokeWidth="1" className="animate-ping" style={{ animationDelay: "0.4s" }} />
                      
                      {/* Interactive click Pin inside SVG */}
                      <circle cx="0" cy="0" r="6" fill="#f72585" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="0" cy="-1.5" r="1.5" fill="#ffffff" />
                    </g>
                  ) : null}
                </svg>

                {/* 3. SECURITY CLEARANCE GLITCH SHIELD OVERLAY (FOR LOCKED STATE) */}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-[#0cf0ff]/[0.02] backdrop-blur-[3px] flex flex-col items-center justify-center text-center p-6 bg-black/60 transition-all duration-700">
                    <div className="w-11 h-11 rounded-full bg-neon-pink/15 border border-neon-pink flex items-center justify-center text-neon-pink mb-3 animate-pulse shadow-md">
                      <Lock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <strong className="text-neon-pink font-mono text-[10px] uppercase tracking-widest font-black block">
                      SEGNALE CRITTOGRAFATO
                    </strong>
                    <div className="text-[7.5px] font-mono text-gray-500 uppercase mt-1 leading-snug">
                      RILEVATORE GPS: BLOCCO CHIAVI
                    </div>
                    <p className="text-[9px] text-gray-400 mt-2.5 max-w-[210px] leading-relaxed font-sans">
                      Per salvaguardare la sicurezza pubblica dei partecipanti, il localizzatore si decrittograferà solo al rilascio della ricevuta di pre-ordinazione.
                    </p>
                  </div>
                )}

                {/* DECRYPTING ANALYZER PROGRESS OVERLAY */}
                {isDecrypting && (
                  <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center z-35 animate-fade-in">
                    <Target className="w-8 h-8 text-neon-cyan animate-spin mb-2" />
                    <span className="text-[9px] font-mono text-neon-cyan uppercase tracking-widest block font-bold">DECRYPTING FREQUENCY COORD...</span>
                    <strong className="text-xl font-mono text-white font-black mt-1">{decryptProgress}%</strong>
                    <div className="w-36 h-1.5 bg-neutral-900 rounded-full overflow-hidden mt-3 border border-white/5">
                      <div className="h-full bg-neon-cyan transition-all duration-100" style={{ width: `${decryptProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* REALTIME INTERACTIVE BLUEPRINT TACTICAL CONTROLS */}
          <div className="w-full mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between bg-[#130f2b] p-3 rounded-2xl border border-white/5 gap-3">
            
            {/* PAN Directional Pad (Only active if unlocked) */}
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-gray-500 block uppercase font-bold leading-tight mr-1">PAN_GRID:</span>
              <div className="grid grid-cols-3 gap-1 shrink-0">
                <div />
                <button
                  disabled={!isUnlocked}
                  onClick={() => handlePan("N")}
                  className="w-5 h-5 bg-black border border-white/10 hover:border-neon-cyan rounded flex items-center justify-center text-[10px] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-white"
                  title="Sposta Nord"
                >
                  <ArrowUp className="w-3 h-3 text-neon-cyan" />
                </button>
                <div />
                <button
                  disabled={!isUnlocked}
                  onClick={() => handlePan("W")}
                  className="w-5 h-5 bg-black border border-white/10 hover:border-neon-cyan rounded flex items-center justify-center text-[10px] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-white"
                  title="Sposta Ovest"
                >
                  <ArrowLeft className="w-3 h-3 text-neon-cyan" />
                </button>
                <button
                  disabled={!isUnlocked}
                  onClick={handleResetMap}
                  className="w-5 h-5 bg-black border border-white/10 hover:border-pink-500 rounded flex items-center justify-center text-[10px] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-white"
                  title="Ripristina Offset"
                >
                  <Crosshair className="w-2.5 h-2.5 text-neon-pink" />
                </button>
                <button
                  disabled={!isUnlocked}
                  onClick={() => handlePan("E")}
                  className="w-5 h-5 bg-black border border-white/10 hover:border-neon-cyan rounded flex items-center justify-center text-[10px] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-white"
                  title="Sposta Est"
                >
                  <ArrowRight className="w-3 h-3 text-neon-cyan" />
                </button>
                <div />
                <button
                  disabled={!isUnlocked}
                  onClick={() => handlePan("S")}
                  className="w-5 h-5 bg-black border border-white/10 hover:border-neon-cyan rounded flex items-center justify-center text-[10px] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-white"
                  title="Sposta Sud"
                >
                  <ArrowDown className="w-3 h-3 text-neon-cyan" />
                </button>
                <div />
              </div>

              {/* Zoom Buttons */}
              <div className="flex gap-1">
                <button
                  disabled={!isUnlocked}
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.2))}
                  className="w-7 h-7 bg-black hover:bg-neutral-900 border border-white/10 hover:border-neon-cyan rounded-lg flex items-center justify-center disabled:opacity-20 text-white cursor-pointer"
                  title="Zoom Avanti"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={!isUnlocked}
                  onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                  className="w-7 h-7 bg-black hover:bg-neutral-900 border border-white/10 hover:border-neon-cyan rounded-lg flex items-center justify-center disabled:opacity-20 text-white cursor-pointer"
                  title="Zoom Indietro"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sweep & Sonar Actions */}
            <div className="flex gap-2 font-mono items-center">
              <button
                disabled={!isUnlocked}
                onClick={triggerSonarScan}
                className="px-2 py-1.5 bg-neutral-900 border border-yellow-500/20 hover:border-yellow-500 rounded text-[8px] uppercase tracking-wider text-yellow-500 hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer font-bold flex items-center gap-1"
              >
                📡 EMETTI SONAR
              </button>
              <button
                onClick={() => setIsRotatingRadar(!isRotatingRadar)}
                className="px-2 py-1.5 bg-black rounded border border-white/10 text-gray-400 hover:text-white hover:border-neon-cyan uppercase transition-colors text-[8px] cursor-pointer"
              >
                SWEEP: {isRotatingRadar ? "OFF" : "ON"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INFORMATION DESCRIPTION COGNITO (Col 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[#130f25]/80 border border-white/10 p-5 rounded-3xl relative">
          
          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            
            <div className="text-left space-y-1">
              {isUnlocked ? (
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black flex items-center gap-1 text-left">
                  <Unlock className="w-3.5 h-3.5" /> 🔓 SEGNALATORE LOCALE DEODIFICATO
                </span>
              ) : (
                <span className="text-[9.5px] font-mono text-neon-pink uppercase tracking-widest font-black flex items-center gap-1.5 animate-pulse text-left">
                  <Lock className="w-3.5 h-3.5" /> 🔒 AREA SPECU_MAP SEGRETATA
                </span>
              )}
              
              <h3 className="text-xl sm:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-neon-cyan uppercase italic tracking-tighter leading-none mt-1 text-left">
                {currentInfo.name}
              </h3>
              
              <div className="text-[9px] font-mono text-neon-cyan font-bold tracking-tight uppercase select-none leading-none pt-0.5 text-left">
                🎯 {currentInfo.address}
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Simulated terminal specs block -- NEVER leaks any static files, purely dynamic */}
            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl relative text-left">
              <span className="absolute top-2 right-2 text-[6.5px] font-mono text-gray-500">SYS_RE: LOCK_M</span>
              <div className="space-y-0.5 text-[8.5px] font-mono leading-normal text-gray-400">
                <div>TARGET ZONE: <span className={isUnlocked ? "text-emerald-400 font-bold" : "text-neon-pink"}>{currentInfo.radarZone}</span></div>
                <div>COORDINATES: <span className="text-white">{isUnlocked ? `${CLASSIFIED_INFO.unlocked.lat.toFixed(4)}N / ${CLASSIFIED_INFO.unlocked.lng.toFixed(4)}W` : "██.████ / ██.████"}</span></div>
                <div>LOCAL TEMPERATURE: <span className="text-neon-cyan">28.5°C (VICE BAY)</span></div>
                <div>SATELLITE BEARING: <span className="text-white">{currentInfo.azimuth}</span></div>
              </div>
            </div>

            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono text-gray-400 block font-bold">ANALISI DI MEZZANOTTE:</span>
              <p className="text-xs text-gray-300 leading-relaxed font-sans bg-black/20 p-3.5 rounded-xl border border-white/5 text-left">
                {currentInfo.description}
              </p>
            </div>

            {/* Dynamic Status Callout based on Unlock status */}
            {!isUnlocked ? (
              <div className="bg-neon-pink/10 p-3.5 rounded-2xl border border-neon-pink/30 flex gap-2.5 text-[10px] font-sans text-gray-300 text-left">
                <span className="text-lg leading-none mt-0.5">📢</span>
                <span className="leading-relaxed">
                  Compila il modulo di pre-ordinazione nella scheda <strong>Pass Mezzanotte</strong> per generare il tuo Boarding Pass. Il localizzatore satellitare lo decodificherà istantaneamente!
                </span>
              </div>
            ) : (
              <div className="bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/30 flex gap-2.5 text-[10px] font-sans text-stone-200 text-left">
                <span className="text-lg leading-none mt-0.5">⭐</span>
                <span className="leading-relaxed">
                  <strong>CONGRATULAZIONI AGENTE!</strong> Il canale satellitare è attivo. Mostra il QR Code stampato sul ticket quando ritiri il gioco per certificare l'accesso in fiera.
                </span>
              </div>
            )}

            {!isUnlocked && (
              <p className="text-[9.5px] font-mono text-gray-500 leading-tight block text-center mt-1">
                * Nessun dato è immagazzinato all'infuori del browser. Sicurezza locale e crittografazione end-to-end.
              </p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
