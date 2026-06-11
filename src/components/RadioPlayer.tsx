import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Volume2, Radio, Heart, Sparkles, Waves, Zap, Flame, Mic } from "lucide-react";
import { RadioStation } from "../types";

const STATIONS: RadioStation[] = [
  {
    id: "wave-103",
    name: "Wave 103",
    freq: "103.5 FM",
    genre: "Synthwave / New Wave",
    description: "I sintetizzatori oscuri e la malinconia futuristica direttamente per le strade di Vice Beach.",
    trackName: "Kavinsky — Nightcall",
    accentColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
    iconName: "🌊"
  },
  {
    id: "flash-fm",
    name: "Flash FM",
    freq: "105.1 FM",
    genre: "Pop Anni '80 / Dance",
    description: "Le canzoni più pop, energiche e adatte alle fughe in barca al tramonto nello Stato di Leonida.",
    trackName: "Duran Duran — Girls on Film",
    accentColor: "text-pink-500 bg-pink-950/40 border-pink-500/30",
    iconName: "⚡"
  },
  {
    id: "fever-105",
    name: "Fever 105",
    freq: "108 flex",
    genre: "Soul, Funk & Disco",
    description: "Pezzi caldi per ballare al Malibu Club fino all'alba con aria tropicale.",
    trackName: "Kool & The Gang — Get Down On It",
    accentColor: "text-purple-400 bg-purple-950/40 border-purple-500/30",
    iconName: "🔥"
  },
  {
    id: "vcpr",
    name: "VCPR Talk Radio",
    freq: "94.3 talk",
    genre: "Notiziario & Teatro dell'Assurdo",
    description: "Interviste folli a politici corrotti dello Stato di Leonida e fanatici di coccodrilli.",
    trackName: "Maurice Chavez — Lo Show dei Disperati",
    accentColor: "text-yellow-400 bg-yellow-950/40 border-yellow-500/30",
    iconName: "🎤"
  }
];

// Funny simulated radio host radio sweeps/soundbites to display to user!
const HOST_SPEECHES = [
  "« Stai ascoltando l'unica emittente non censurata dal dipartimento dello sceriffo di Leonida! »",
  "« Ricordati: se vedi un coccodrillo in piscina, è solo una borsa firmata che cerca cibo. VCN Radio! »",
  "« Vuoi evitare i droni spia? Compra una lacca stile anni '80 stasera al minimarket. »",
  "« Midnight Launch Party è alle porte! Copie scontate la notte prima all'evento segreto. Prenota subito! »",
  "« Sintonizzati con noi, abbiamo notizie calde, leak incredibili e cocktail refrigeranti! »"
];

export default function RadioPlayer() {
  const [currentStation, setCurrentStation] = useState<RadioStation>(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [trackProgress, setTrackProgress] = useState(35);
  const [hostAlert, setHostAlert] = useState<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Trigger funny host voice alerts every few seconds to enhance premium radio immersion
  useEffect(() => {
    setHostAlert(HOST_SPEECHES[0]);
    const hostInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * HOST_SPEECHES.length);
      setHostAlert(HOST_SPEECHES[idx]);
    }, 12000);

    return () => clearInterval(hostInterval);
  }, []);

  // Update mock track timeline
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTrackProgress((p) => (p >= 100 ? 0 : p + 1.2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Let's implement real retro synthetic soundtrack using Web Audio API when user clicks play!
  // This produces real cool retro synth sci-fi sine waves that adjust based on selected station!
  const startSynth = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Stop any existing oscillator
      stopSynth();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Station customization for custom synthesized hum/tune
      if (currentStation.id === "wave-103") {
        osc.type = "sawtooth";
        // Beautiful ambient dark sequence
        osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A hum
      } else if (currentStation.id === "flash-fm") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, ctx.currentTime); // Warm A
      } else if (currentStation.id === "fever-105") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(165, ctx.currentTime); // Deep bass
      } else {
        osc.type = "square";
        osc.frequency.setValueAtTime(80, ctx.currentTime); 
      }

      gain.gain.setValueAtTime((volume / 100) * 0.04, ctx.currentTime); // Safe low comfortable volume

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn("Audio Context not supported yet: required user gesture", e);
    }
  };

  const stopSynth = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      startSynth();
    } else {
      stopSynth();
    }
  };

  const handleStationChange = (station: RadioStation) => {
    setCurrentStation(station);
    setTrackProgress(Math.floor(Math.random() * 60));
    setHostAlert(HOST_SPEECHES[Math.floor(Math.random() * HOST_SPEECHES.length)]);
    if (isPlaying) {
      // Re-trigger synth frequency with next station settings
      setTimeout(() => {
        startSynth();
      }, 50);
    }
  };

  // Adjust synthesizer volume
  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime((volume / 100) * 0.04, audioContextRef.current.currentTime);
    }
  }, [volume, isPlaying]);

  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#110c24]/90 border border-neon-pink/30 rounded-3xl p-5 overflow-hidden relative group">
      {/* Dynamic neon particle beam */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-neon-pink/10 to-transparent pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-neon-pink animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-pink text-shadow">VICE BEACH AMBIENT RADIO</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          LIVE STEREO
        </div>
      </div>

      {/* Main interactive tuner list */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {STATIONS.map((station) => {
          const isSelected = currentStation.id === station.id;
          return (
            <button
              key={station.id}
              onClick={() => handleStationChange(station)}
              className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? `${station.accentColor} font-bold opacity-100 scale-102`
                  : "bg-black/20 border-white/5 opacity-60 hover:opacity-90 hover:bg-black/30"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="shrink-0">
                  {station.id === "wave-103" && <Waves className="w-4 h-4 text-cyan-400" />}
                  {station.id === "flash-fm" && <Zap className="w-4 h-4 text-pink-500" />}
                  {station.id === "fever-105" && <Flame className="w-4 h-4 text-purple-400" />}
                  {station.id === "vcpr" && <Mic className="w-4 h-4 text-yellow-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-display text-white">{station.name}</h4>
                  <p className="text-[9px] font-mono text-gray-400">{station.freq}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected playing station box */}
      <div className="flex-1 flex flex-col justify-between bg-black/40 border border-white/10 p-3.5 rounded-2xl relative overflow-hidden">
        {/* Subtle audio waves when playing */}
        {isPlaying && (
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neon-pink/10 to-transparent flex items-end justify-center gap-1 opacity-50 pointer-events-none">
            <span className="w-1 h-6 bg-neon-pink rounded-t animate-[bounce_0.8s_infinite]" />
            <span className="w-1 h-3 bg-neon-pink rounded-t animate-[bounce_1.2s_infinite]" />
            <span className="w-1 h-5 bg-neon-pink rounded-t animate-[bounce_0.6s_infinite]" />
            <span className="w-1 h-8 bg-neon-cyan rounded-t animate-[bounce_1s_infinite_delay-100]" />
            <span className="w-1 h-4 bg-neon-pink rounded-t animate-[bounce_1.4s_infinite_delay-300]" />
            <span className="w-1 h-6 bg-neon-cyan rounded-t animate-[bounce_1.1s_infinite_delay-200]" />
          </div>
        )}

        <div>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-mono text-neon-cyan tracking-wider font-bold">
              {currentStation.genre}
            </span>
            <span className="text-[9px] text-gray-500 font-mono tracking-tighter">
              VOL {volume}%
            </span>
          </div>
          <h3 className="text-sm font-display font-extrabold text-white mt-1 uppercase tracking-tight">
            {currentStation.trackName}
          </h3>
          <p className="text-[10px] text-gray-400 italic mt-1 line-clamp-2 leading-relaxed">
            {currentStation.description}
          </p>
        </div>

        {/* Dynamic sweeping text overlay representing host live dialogue */}
        <div className="bg-black/50 border-l-2 border-neon-pink px-2.5 py-1.5 rounded-md mt-2 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 shrink-0 text-neon-pink animate-pulse" />
          <p className="text-[10px] font-mono text-neon-pink leading-snug tracking-tight">
            {hostAlert || "Ascolta gli spifferi di Vice. Sottofrequenza in corso."}
          </p>
        </div>

        {/* Timeline progress line */}
        <div className="mt-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan transition-all duration-1000"
              style={{ width: `${isPlaying ? trackProgress : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom controls row */}
      <div className="flex items-center justify-between gap-4 mt-4">
        <button
          onClick={handleTogglePlay}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-neon-pink hover:bg-neon-pink/80 cursor-pointer text-white shadow-lg shadow-pink-500/10 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        {/* Volume controls bar */}
        <div className="flex-1 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-pink focus:outline-none"
          />
        </div>

        <button
          onClick={() => handleStationChange(STATIONS[Math.floor(Math.random() * STATIONS.length)])}
          className="p-1 px-1.5 hover:bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
          title="Cambia frequenza casualmente"
        >
          <SkipForward className="w-3.5 h-3.5" /> AM/FM
        </button>
      </div>
    </div>
  );
}
