import React, { useState } from "react";
import { Image, Maximize, Film, Star, Sparkles, Sliders } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  type: "Official Art" | "Trailer Frame" | "In-Game Render";
  category: "Ufficiale" | "Veicoli" | "Mappa" | "Personaggi";
  imageUrl: string;
  description: string;
  specs: string;
}

const GALLERY_ITEMS: MediaItem[] = [
  {
    id: "img-1",
    title: "Lucia & Jason Outlaw Keyart",
    type: "Official Art",
    category: "Personaggi",
    imageUrl: "/src/assets/images/gta_six_couple_1781185836179.png",
    description: "La lussuosa locandina promozionale della coppia criminale seduta sul cofano di una Tulip personalizzata mentre il crepuscolo fuxia avvolge lo skyline tropicale di Vice Beach.",
    specs: "FORMAT: 4K HIGH FIDELITY RASTER • SOURCE: ROCKSTAR REVEAL"
  },
  {
    id: "img-2",
    title: "Ocean Drive Neon Hotel Strip",
    type: "Trailer Frame",
    category: "Ufficiale",
    imageUrl: "/src/assets/images/gta_six_neon_strip_1781185855057.png",
    description: "Una panoramica ad altissima densità dei viali costieri di Vice Beach di notte, con riflessi volumetrici delle scritte neon dei locali ricalcati sui canoni classici.",
    specs: "TRAILER SCREENSHOT • HIGH DENSITY TROPICAL NIGHT LIFE"
  },
  {
    id: "img-3",
    title: "Bayside Luxury Marina & Yachts",
    type: "Trailer Frame",
    category: "Mappa",
    imageUrl: "/src/assets/images/gta_six_yacht_marina_1781185874029.png",
    description: "La meravigliosa marina fluviale brulicante di motoscafi ultra veloci, yacht da diporto e grattacieli moderni sullo sfondo della baia.",
    specs: "TRAILER SCREENSHOT • COMPREHENSIVE REFLECTION RENDERING ENGINE"
  },
  {
    id: "img-4",
    title: "Grassriver Everglades Airboat Scan",
    type: "In-Game Render",
    category: "Mappa",
    imageUrl: "https://images.unsplash.com/photo-1547841243-eacb14453cd9?w=1200&auto=format&fit=crop&q=80",
    description: "La palude incontaminata del Grassriver. Il frollino dell'aero-scivolatore genera spruzzi volumetrici e polvere in tempo reale sulle carcasse metalliche esterne.",
    specs: "IN-GAME GRAPHIC PROFILE • ACCREDITED DESIGN WORK"
  },
  {
    id: "img-5",
    title: "Retro Muscle Car Escape",
    type: "Official Art",
    category: "Veicoli",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&auto=format&fit=crop&q=80",
    description: "Fuga spettacolare ad alta velocità sulle highways dello Stato di Leonida. Particolare focalizzazione sui motori truccati e sulle sospensioni pneumatiche ribassate.",
    specs: "PHYSICS ENGINE ACCORD • DESTRUCTION MODEL PROFILE"
  },
  {
    id: "img-6",
    title: "Saratoga Keys Bridge Roadblock",
    type: "Trailer Frame",
    category: "Veicoli",
    imageUrl: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&auto=format&fit=crop&q=80",
    description: "Le barriere e le pattuglie stradali della polizia sul lunghissimo ponte autostradale oceanico che collega le Keys al continente.",
    specs: "TRAILER TIME: 0:52 • VOLUMETRIC COLLISION SCAN"
  }
];

interface MediaGalleryProps {
  onNavigateToTab?: (tabId: "newsroom" | "preorder" | "radar" | "chat", targetElementId?: string) => void;
}

export default function MediaGallery({ onNavigateToTab }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tutto");
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);

  const categories = ["Tutto", "Ufficiale", "Veicoli", "Mappa", "Personaggi"];

  const filteredItems = selectedCategory === "Tutto" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-[#15102a] border-2 border-white/10 rounded-3xl p-5 overflow-hidden group shadow-lg">
      
      {/* Visual top bar headers */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
        <div>
          <span className="text-[9px] font-mono font-black text-neon-pink tracking-widest uppercase block">
            MULTIMEDIA ARCHIVE SYSTEM
          </span>
          <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tight">
            GALLERIA MULTIMEDIALE
          </h3>
        </div>

        {/* Categories toggler buttons */}
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[9.5px] font-mono font-bold px-2 px-3 py-1.5 rounded transition-all uppercase cursor-pointer ${
                selectedCategory === cat 
                  ? "bg-neon-pink text-white font-black scale-102 shadow-md shadow-pink-500/20" 
                  : "bg-black/40 text-gray-400 border border-white/5 hover:text-white hover:bg-black/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid items layout */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setModalItem(item)}
              className="bg-black/40 border border-white/5 hover:border-neon-pink/50 rounded-2xl overflow-hidden cursor-pointer relative group/item transition-all hover:-translate-y-0.5"
            >
              {/* Image Canvas */}
              <div className="aspect-video relative overflow-hidden bg-gray-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover/item:scale-103 transition-transform duration-500 opacity-75 group-hover/item:opacity-100"
                />
                
                {/* Meta overlays */}
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  <span className="bg-black/80 text-[7px] font-mono text-white px-1.5 py-0.5 rounded border border-white/15 tracking-wider font-extrabold uppercase">
                    {item.type}
                  </span>
                  <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded text-white font-extrabold tracking-wider uppercase ${
                    item.category === 'Ufficiale' || item.category === 'Personaggi' ? 'bg-emerald-600/90' : 'bg-neon-pink/90'
                  }`}>
                    {item.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <Maximize className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Descriptions Footer block */}
              <div className="p-3 bg-black/15">
                <h4 className="text-[11px] font-black text-white truncate uppercase tracking-tight group-hover/item:text-neon-pink transition-colors">
                  {item.title}
                </h4>
                <p className="text-[8.5px] text-gray-400 truncate mt-0.5 font-mono">
                  {item.specs}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep diagnostic screenshot Modal */}
      {modalItem && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50">
          <div
            className="bg-[#120e26] border-2 border-neon-pink/50 max-w-2xl w-full rounded-2xl overflow-hidden relative shadow-2xl animate-scale-in max-h-[90vh] md:max-h-[94vh] flex flex-col"
          >
            {/* Close Cross */}
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/80 border border-white/15 flex items-center justify-center text-white hover:bg-neon-pink transition-all z-20 cursor-pointer text-xs"
            >
              ✕
            </button>

            {/* Cinematic HD viewport */}
            <div className="aspect-video w-full bg-black relative shrink-0">
              <img
                src={modalItem.imageUrl}
                alt={modalItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/85 text-[8px] font-mono text-[#00ffff] px-3 py-1 rounded-full border border-neon-cyan/25 uppercase font-black">
                  📡 HIGH RESOLUTION ANALYZED
                </span>
                <span className="bg-neon-pink text-white text-[8px] font-mono font-black px-3 py-1 rounded-full uppercase">
                  {modalItem.type}
                </span>
              </div>

              {/* Technical scope lines overlay inside modal screen */}
              <div className="absolute inset-5 border border-white/5 pointer-events-none flex justify-between items-start text-[6.5px] font-mono text-white/20 p-1 uppercase">
                <span>REC_043</span>
                <span>FPS: 60.00</span>
              </div>
            </div>

            {/* Breakdown specifications metrics (Scrollable to prevent screen overflow) */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-left custom-scrollbar">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-display font-black text-white tracking-tight uppercase">
                  {modalItem.title}
                </h3>
                <span className="text-[9px] font-mono text-gray-500">SPEC_ID: {modalItem.id.toUpperCase()}</span>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                {modalItem.description}
              </p>

              {/* Technical details report stripe */}
              <div className="bg-pink-950/20 p-3 rounded-xl border border-pink-500/25 flex gap-3 text-xs items-start">
                <Sliders className="w-5 h-5 text-neon-pink shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-neon-pink uppercase font-mono block text-[9px] tracking-widest font-black">
                    REPORT TECNICO & FILE INFO
                  </strong>
                  <p className="text-[10px] text-gray-300 leading-snug">
                    {modalItem.specs}. Ottimizzato per PC Desktop con supporto HDR e colori estesi e calibrati.
                  </p>
                </div>
              </div>

              {/* PC Desktop Browser Instructions Block */}
              <div className="bg-[#0b081e] p-3 rounded-xl border border-[#00ffff]/20 space-y-1 text-left font-mono text-[10px]">
                <span className="text-[#00ffff] font-bold block uppercase tracking-wider">🖥️ ISTRUZIONI DI DOWNLOAD PC/DESKTOP:</span>
                <p className="text-gray-300 leading-relaxed text-[9.5px]">
                  Per applicare questa spettacolare opera d'arte come sfondo sul tuo computer: 
                  Fai <strong>click destro</strong> direttamente sopra l'immagine ed ordina la voce <strong>"Salva immagine con nome..."</strong> dal menu del browser. Oppure usa il pulsante in basso per visualizzare l'originale ad altissima risoluzione a schermo intero!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={modalItem.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 bg-[#110c24] border border-[#00ffff]/30 text-neon-cyan hover:bg-[#00ffff]/10 font-bold text-[10.5px] uppercase tracking-widest rounded-xl text-center cursor-pointer select-none transition-all flex items-center justify-center gap-1.5"
                >
                  🌐 APRI REALE IMMAGINE HD ↗
                </a>
                
                <button
                  onClick={() => {
                    if (onNavigateToTab) {
                      onNavigateToTab("preorder", "booking-party");
                    } else {
                      const el = document.getElementById("booking-party");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                    setModalItem(null);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#ff00cc] to-purple-600 text-white font-extrabold text-[10.5px] uppercase tracking-widest rounded-xl cursor-pointer hover:brightness-110 active:scale-98 transition-all"
                >
                  RISERVA COPIA AL PARTY NOW
                </button>
                
                <button
                  onClick={() => setModalItem(null)}
                  className="px-5 py-2.5 bg-gray-955 border border-white/10 text-gray-400 font-extrabold text-[10.5px] uppercase tracking-widest rounded-xl cursor-pointer hover:text-white"
                >
                  CHIUDI
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
