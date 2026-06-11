import React, { useState } from "react";
import { User, Sparkles, Award, RefreshCw, Layers, Check, Share2, Compass, Lock } from "lucide-react";

export interface PlateDesign {
  text: string;
  styleId: "vice" | "leonida" | "outlaw" | "pomigliano";
  tag: string;
  year: string;
  sticker: "VCN" | "NONE" | "WANTED" | "POMI";
}

interface PlateCustomizerProps {
  onSave?: (design: PlateDesign) => void;
  savedDesign?: PlateDesign | null;
  isUnlocked?: boolean;
}

const playLocalAudio = (type: "select" | "save" | "random") => {
  try {
    const AudioContextClass = globalThis.AudioContext || (globalThis as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === "select") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "random") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "save") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    // Avoid noisy exceptions if blocked by user interaction gesture policy
  }
};

const STYLES = [
  {
    id: "vice",
    name: "Vice Beach Neon",
    label: "Sfumatura Sunset & Lettere Gialle",
    bgClass: "bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-800",
    textClass: "text-[#ffd700] border-[#ffd700]/30 shadow-[#ffd700]/20",
    fontFamily: "font-sans font-black tracking-[0.15em] uppercase",
    textColor: "#ffd700",
    headerText: "Leonida - Vice City",
    footerText: "☀️ SUNSHINE STATE ☀️",
    accentBorder: "border-pink-300/40"
  },
  {
    id: "outlaw",
    name: "Outlaw Midnight",
    label: "Nero Carbonio & Neon Cyan",
    bgClass: "bg-gradient-to-br from-[#0c0c16] via-[#121224] to-[#0a071d] border-2 border-neon-cyan/40",
    textClass: "text-neon-cyan shadow-cyan-500/30",
    fontFamily: "font-mono font-extrabold tracking-[0.2em] uppercase",
    textColor: "#00ffff",
    headerText: "OUTLAW SPEC - UNDERGROUND",
    footerText: "✖️ LEONIDA DEPT OF CORRECTIONS ✖️",
    accentBorder: "border-neon-cyan/50"
  },
  {
    id: "leonida",
    name: "Leonida Highway",
    label: "Verde Autostradale Retro & Oro",
    bgClass: "bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900",
    textClass: "text-[#fcd34d] border-yellow-500/20 shadow-yellow-500/10",
    fontFamily: "font-serif font-black tracking-[0.12em] uppercase",
    textColor: "#fcd34d",
    headerText: "Leonida - Express Route",
    footerText: "🐊 FLORIDA BOUND 🐊",
    accentBorder: "border-emerald-500/30"
  },
  {
    id: "pomigliano",
    name: "Pomigliano Velvet",
    label: "Viola Napoli & Cornice Dorata",
    bgClass: "bg-gradient-to-br from-[#1e0b36] via-[#18082c] to-[#0d0419]",
    textClass: "text-[#ffd700] shadow-[#ffd700]/20 text-shadow-gold",
    fontFamily: "font-sans font-black tracking-[0.22em] uppercase italic",
    textColor: "#ffd700",
    headerText: "CAMPANIA — NAPOLI",
    footerText: "🍷 AZALE FLOWER BAR VIP 🍷",
    accentBorder: "border-yellow-600/50"
  }
];

const STICKERS = [
  { id: "NONE", label: "Nessun Adesivo", emoji: " " },
  { id: "VCN", label: "VCN Official", emoji: "★" },
  { id: "WANTED", label: "WANTED", emoji: "✦" },
  { id: "POMI", label: "POMI Pride", emoji: "✦" }
];

const TAGS = ["JUN", "AUG", "OCT", "DEC", "JAN", "APR"];

export default function PlateCustomizer({ onSave, savedDesign, isUnlocked = false }: PlateCustomizerProps) {
  const [text, setText] = useState(savedDesign?.text || "VICE NY");
  const [styleId, setStyleId] = useState<PlateDesign["styleId"]>(savedDesign?.styleId || "vice");
  const [tag, setTag] = useState(savedDesign?.tag || "DEC");
  const [year, setYear] = useState(savedDesign?.year || "26");
  const [sticker, setSticker] = useState<PlateDesign["sticker"]>(savedDesign?.sticker || "VCN");
  const [isApplied, setIsApplied] = useState(false);

  // Safe checks if unlocked state changes and resets classified options dynamically
  const effectiveStyleId = (!isUnlocked && styleId === "pomigliano") ? "vice" : styleId;
  const effectiveSticker = (!isUnlocked && sticker === "POMI") ? "VCN" : sticker;

  const currentStyleSelected = STYLES.find((s) => s.id === effectiveStyleId) || STYLES[0];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    val = val.replace(/[^A-Z0-9 ]/g, "");
    if (val.length <= 8) {
      setText(val);
      setIsApplied(false);
    }
  };

  const handleApply = () => {
    const design: PlateDesign = {
      text: text.trim().length > 0 ? text.trim() : "GETAWAY",
      styleId: effectiveStyleId,
      tag,
      year: isUnlocked ? year : "25",
      sticker: effectiveSticker
    };
    if (onSave) {
      onSave(design);
    }
    setIsApplied(true);
    playLocalAudio("save");
    setTimeout(() => setIsApplied(false), 2500);
  };

  const setRandomPlateCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    
    const templates = [
      () => letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)] + numbers[Math.floor(Math.random() * 10)] + " " + letters[Math.floor(Math.random() * 26)] + numbers[Math.floor(Math.random() * 10)] + numbers[Math.floor(Math.random() * 10)],
      () => "GTAVI " + numbers[Math.floor(Math.random() * 10)] + numbers[Math.floor(Math.random() * 10)],
      () => "OUTLAW" + numbers[Math.floor(Math.random() * 10)],
      ...(isUnlocked ? [
        () => "AZALE " + numbers[Math.floor(Math.random() * 10)],
        () => "POMI " + numbers[Math.floor(Math.random() * 10)] + numbers[Math.floor(Math.random() * 10)]
      ] : [])
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setText(randomTemplate());
    setIsApplied(false);
    playLocalAudio("random");
  };

  const visibleStyles = isUnlocked ? STYLES : STYLES.filter(s => s.id !== "pomigliano");
  const visibleStickers = isUnlocked ? STICKERS : STICKERS.filter(s => s.id !== "POMI");

  return (
    <div id="plate-customizer-container" className="flex flex-col h-full bg-[#110a24]/90 border border-neon-cyan/20 rounded-3xl p-5 overflow-hidden relative group shadow-md hover:shadow-cyan-500/5 transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 opacity-70 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-neon-cyan" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan">GARAGE: PERSONALIZZA TARGA IMPRESSA</span>
        </div>
        <div className="px-2 py-0.5 bg-neon-pink/15 border border-neon-pink/30 text-[9px] text-neon-pink font-mono rounded-md font-bold uppercase tracking-wider">
          🚘 DRIVER LICENSE CUSTOMIZER
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-4">
        
        {/* BIG INTERACTIVE FLUID LICENSE PLATE PREVIEW */}
        <div className="flex flex-col items-center justify-center p-3 bg-black/40 rounded-2xl border border-white/5 relative">
          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-2 block text-center">ANTEPRIMA VANO TARGA PERSONALIZZATO</span>
          
          {/* THE PHYSICAL LICENSE PLATE CONTAINER */}
          <div className={`w-full max-w-[340px] aspect-[2/1] rounded-2xl p-4 flex flex-col justify-between items-center text-center relative shadow-2xl transition-all duration-500 ${currentStyleSelected.bgClass} border`}>
            {/* Screws on top corners */}
            <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-slate-600/90 border border-slate-700 shadow-inner flex items-center justify-center">
              <span className="w-1.5 h-[1.5px] bg-slate-800 rotate-45 block" />
            </div>
            <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-slate-600/90 border border-slate-700 shadow-inner flex items-center justify-center">
              <span className="w-1.5 h-[1.5px] bg-slate-800 -rotate-45 block" />
            </div>
            
            {/* Screws on bottom corners */}
            <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-slate-600/90 border border-slate-700 shadow-inner flex items-center justify-center">
              <span className="w-1.5 h-[1.5px] bg-slate-800 -rotate-12 block" />
            </div>
            <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-slate-600/90 border border-slate-700 shadow-inner flex items-center justify-center">
              <span className="w-1.5 h-[1.5px] bg-slate-800 rotate-12 block" />
            </div>

            {/* Top State Bar */}
            <div className="w-full flex justify-between items-center px-6">
              <div className="bg-black/40 text-[8px] px-1.5 py-0.2 rounded border border-white/10 font-mono text-white select-none">
                {tag}
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase opacity-90 select-none text-white drop-shadow-md">
                {currentStyleSelected.headerText}
              </span>
              <div className="bg-neon-pink text-white text-[8px] px-1.5 py-0.2 rounded font-mono font-bold select-none">
                {isUnlocked ? year : "25"}
              </div>
            </div>

            {/* Embossed Main Text Display */}
            <div className="relative w-full flex items-center justify-center py-2">
              <span className="absolute top-[9px] left-[1px] select-none text-3xl sm:text-4xl text-black/60 font-black tracking-[0.16em] uppercase">
                {text || "OUTLAW"}
              </span>
              <span className={`text-3xl sm:text-4xl select-all select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${currentStyleSelected.fontFamily} font-black tracking-[0.15em] hover:scale-[1.02] transform transition-transform duration-300 ${currentStyleSelected.textClass}`}>
                {text || "OUTLAW"}
              </span>
            </div>

            {/* Footer Tag and Sticker */}
            <div className="w-full flex justify-between items-center px-6">
              <span className="text-[8px] sm:text-[9.5px] font-mono font-extrabold text-white/80 select-none drop-shadow-sm">
                {currentStyleSelected.footerText}
              </span>

              {/* Holographic custom sticker */}
              {effectiveSticker !== "NONE" && (
                <div className="bg-gradient-to-tr from-yellow-300 via-pink-400 to-indigo-400 p-1 rounded border border-white/40 shadow-md animate-pulse transform rotate-6 scale-95 flex items-center gap-0.5 select-none">
                  <span className="text-[10px]">{STICKERS.find(s => s.id === effectiveSticker)?.emoji}</span>
                  <span className="text-[7.5px] font-mono font-black text-black tracking-tighter uppercase">
                    {effectiveSticker}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-[9.5px] text-gray-400 font-mono mt-2 text-center leading-normal">
            * Questa targa personalizzata sarà impressa sulla ricevuta ufficiale come accessorio da collezione!
          </p>
        </div>

        {/* INPUT AND STYLE SELECTORS */}
        <div className="space-y-3 text-left">
          
          {/* Custom Text and Random Button */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 block uppercase font-bold">DIGITA TESTO TARGA (LETTERE & NUMERI)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                placeholder="VICE CITY"
                className="flex-1 bg-black/40 border border-white/10 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan uppercase font-mono tracking-widest font-black"
              />
              <button
                type="button"
                onClick={setRandomPlateCode}
                className="px-3 bg-[#171138] border border-white/10 hover:border-neon-cyan/40 hover:bg-white/10 text-gray-300 text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Genera Targa Casuale"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="hidden sm:inline font-mono text-[9px]">CASUALE</span>
              </button>
            </div>
          </div>

          {/* Style Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 block uppercase font-bold">STILE & MATRICE VISIVA SFUMATA</label>
            <div className="grid grid-cols-2 gap-2">
              {visibleStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => { setStyleId(style.id as any); setIsApplied(false); playLocalAudio("select"); }}
                  className={`flex flex-col text-left p-2 rounded-xl transition-all cursor-pointer ${
                    effectiveStyleId === style.id
                      ? "bg-[#1d163a] border-2 border-neon-cyan shadow-sm shadow-cyan-500/20"
                      : "bg-[#150f2f]/60 hover:bg-[#1a133d]/80 border border-white/5"
                  }`}
                >
                  <span className="text-[10.5px] font-bold text-white uppercase">{style.name}</span>
                  <span className="text-[8.5px] text-gray-400 line-clamp-1">{style.label}</span>
                </button>
              ))}

              {/* Locked mystery slot if not unlocked */}
              {!isUnlocked && (
                <div className="flex flex-col justify-center items-center p-2 rounded-xl bg-black/40 border border-dashed border-white/10 select-none text-center">
                  <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                    <Lock className="w-3 h-3 text-neon-pink" /> [??] BLOCCO SPECIALE
                  </div>
                  <span className="text-[7.5px] text-gray-600 block mt-0.5">Sblocca prenotando</span>
                </div>
              )}
            </div>
          </div>

          {/* Tag & Year stickers Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 block uppercase font-bold">MESE DI EMISSIONE</label>
              <select
                value={tag}
                onChange={(e) => { setTag(e.target.value); setIsApplied(false); playLocalAudio("select"); }}
                className="w-full bg-[#110c24] border border-white/10 p-2.5 rounded-xl text-xs text-white cursor-pointer font-mono"
              >
                {TAGS.map((m) => (
                  <option key={m} value={m}>{m} (VALIDO)</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 block uppercase font-bold">ADESIVO DECAL SECRETO</label>
              <select
                value={effectiveSticker}
                onChange={(e) => { setSticker(e.target.value as any); setIsApplied(false); playLocalAudio("select"); }}
                className="w-full bg-[#110c24] border border-white/10 p-2.5 rounded-xl text-xs text-white cursor-pointer font-mono"
              >
                {visibleStickers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleApply}
          className={`w-full py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
            isApplied
              ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
              : "bg-gradient-to-r from-neon-cyan via-cyan-600 to-indigo-700 hover:opacity-95 text-black"
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-4 h-4 text-black stroke-[3]" />
              TARGA SALVATA PER IL TICKET!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              CONFERMA & ASSOCIA AL TICKET
            </>
          )}
        </button>

      </div>
    </div>
  );
}
