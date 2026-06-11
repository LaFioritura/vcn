import React from "react";
import { Award, User, Mail, Sparkles, Navigation, Ticket } from "lucide-react";
import PlateCustomizer, { PlateDesign } from "./PlateCustomizer";
import TriviaZone from "./TriviaZone";
import { GameBooking } from "../types";

interface PassMezzanotteProps {
  bookingName: string;
  setBookingName: (val: string) => void;
  bookingEmail: string;
  setBookingEmail: (val: string) => void;
  bookingPlatform: "PS5" | "Xbox Series X" | "PC";
  setBookingPlatform: (val: "PS5" | "Xbox Series X" | "PC") => void;
  bookingEdition: string;
  setBookingEdition: (val: string) => void;
  bookingNotes: string;
  setBookingNotes: (val: string) => void;
  bookingSuccessTicket: GameBooking | null;
  savedPlate: PlateDesign | null;
  onSavePlate: (p: PlateDesign) => void;
  wantedStars: number;
  onStarsUpdate: (stars: number) => void;
  earnedBadge: string;
  onSuccessBadge: (badge: string) => void;
  handleCreateBooking: (e: React.FormEvent) => void;
  isLoading: boolean;
  onGoToRadar: () => void;
}

export default function PassMezzanotteTab({
  bookingName,
  setBookingName,
  bookingEmail,
  setBookingEmail,
  bookingPlatform,
  setBookingPlatform,
  bookingEdition,
  setBookingEdition,
  bookingNotes,
  setBookingNotes,
  bookingSuccessTicket,
  savedPlate,
  onSavePlate,
  wantedStars,
  onStarsUpdate,
  earnedBadge,
  onSuccessBadge,
  handleCreateBooking,
  isLoading,
  onGoToRadar
}: PassMezzanotteProps) {

  const calculatedDiscount = wantedStars >= 5 ? 15 : 10;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Alert Notice Header */}
      {!bookingSuccessTicket ? (
        <div id="booking-party" className="bg-gradient-to-r from-[#170fd3]/10 to-[#ff00cc]/10 border-l-4 border-neon-pink p-4 rounded-xl flex items-start gap-3">
          <Ticket className="w-5 h-5 text-neon-pink shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">GARAGE PRESTAZIONALE E CREAZIONE BOARDING PASS</h4>
            <p className="text-xs text-gray-300">
              Personalizza la targa celebrativa e rispondi correttamente ad almeno 5 quesiti della Trivia per innalzare il tuo sconto al 15%. Ti basterà registrare l'email per sbloccare l'HUD radar satellitare dell'evento di fiera!
            </p>
          </div>
        </div>
      ) : (
        <div id="booking-party" className="bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">BOARDING PASS GENERATO CON SUCCESSO</h4>
              <p className="text-xs text-stone-300">
                La tua prenotazione è registrata nel database sicuro di Leonida. Mostra il QR-Code all'ingresso per ritirare il gioco fisico!
              </p>
            </div>
          </div>
          <button
            onClick={onGoToRadar}
            className="px-4 py-2 bg-gradient-to-r from-[#ff00cc] to-purple-600 border border-white/20 rounded-xl text-xs font-mono font-bold uppercase tracking-widest text-white shadow-lg shadow-pink-500/15 pulse-glow cursor-pointer flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-white" />
            ACCEDI AL RADAR SAT-MAP COMUNITARIO
          </button>
        </div>
      )}

      {/* Grid of Customization Workshops */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Booking Form & Success Ticket (Col 7) */}
        <div className="xl:col-span-7 space-y-6">
          
          <div className="bg-gradient-to-br from-[#15102a] to-[#0a071d] border border-neon-pink/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-neon-pink/10 opacity-60 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="inline-flex px-3 py-1 bg-neon-pink/15 border border-neon-pink/30 text-neon-pink text-[10px] font-mono font-bold tracking-widest rounded-md uppercase items-center gap-1">
                  <Sparkles className="w-3 h-3 text-neon-pink animate-pulse" /> EVENTO MEZZANOTTE ESCLUSIVO
                </span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">CAPIENZA FISSA</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black italic tracking-tighter leading-none mb-2">
                  MIDNIGHT PRE-LAUNCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-[#a855f7] to-[#00ffff]">BLOCK PARTY</span>
                </h2>
                <p className="text-gray-300 text-[12px] leading-relaxed">
                  Ci riuniamo sul litorale la sera che precede il lancio ufficiale di GTA VI! Musica synthwave, cocktail fuxia tropicali e la tua copia fisica garantita col 15% di sconto.
                </p>
              </div>

              <hr className="border-white/5" />

              {!bookingSuccessTicket ? (
                <form onSubmit={handleCreateBooking} className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Award className="w-4 h-4 text-neon-pink" /> DATI DI PRE_NOTAZIONE DISCO
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase">NOME & COGNOME / NICKNAME</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Tommy Vercetti"
                          className="w-full bg-black/40 border border-white/10 hover:border-white/20 p-2 pl-9 rounded-xl text-xs text-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase">EMAIL VALIDA</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="tommy@malibumail.com"
                          className="w-full bg-black/40 border border-white/10 hover:border-white/20 p-2 pl-9 rounded-xl text-xs text-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase">PIATTAFORMA</label>
                      <select
                        value={bookingPlatform}
                        onChange={(e: any) => setBookingPlatform(e.target.value)}
                        className="w-full bg-[#110c24] border border-white/10 p-2 rounded-xl text-xs text-white cursor-pointer focus:outline-none"
                      >
                        <option value="PS5">PlayStation 5</option>
                        <option value="Xbox Series X">Xbox Series X</option>
                        <option value="PC">PC (Leonida Launch Pack)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase">EDIZIONE</label>
                      <select
                        value={bookingEdition}
                        onChange={(e) => setBookingEdition(e.target.value)}
                        className="w-full bg-[#110c24] border border-white/10 p-2 rounded-xl text-xs text-white cursor-pointer focus:outline-none"
                      >
                        <option value="Standard Neon Steelbook">Standard Neon (+ 15% Sconto)</option>
                        <option value="Deluxe Retro Edition">Deluxe Retro (+ Poster)</option>
                        <option value="Leonida's Outlaw Pack">Leonida's Collector (+ Gadgets)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase">STATUS SCONTO</label>
                      <div className="bg-[#1c1439] border border-neon-cyan/20 p-2 rounded-xl text-xs font-mono font-bold text-neon-cyan flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-yellow-500" />
                          {earnedBadge}
                        </span>
                        <span>{calculatedDiscount}% OFF</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400 block uppercase">NOTE SPECIALI / COMMENTI AL DJ</label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="es. vorrei ascoltare un pezzo synthwave retrò..."
                      className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#ff00cc] to-purple-600 hover:scale-[1.01] hover:opacity-90 rounded-xl font-bold font-mono uppercase tracking-[0.1em] text-xs cursor-pointer select-none text-white border-t border-white/20 transition-all font-black"
                  >
                    {isLoading ? "ELABORAZIONE IN CORSO..." : "REGISTRA PRENOTAZIONE DEL DISCO FISICO"}
                  </button>
                </form>
              ) : (
                /* Sleek Boarding Pass Render */
                <div className="bg-black/80 border-2 border-neon-pink p-5 rounded-2xl space-y-4 relative overflow-hidden animate-fade-in text-left">
                  <div className="absolute right-[-70px] bottom-[-20px] w-48 h-10 bg-neon-cyan/30 rotate-45 pointer-events-none" />

                  <div className="flex justify-between items-center bg-[#15102a] p-3 rounded-xl border border-white/10">
                    <div>
                      <span className="text-[8px] font-mono text-gray-500 uppercase block">CODICE PRENOTAZIONE:</span>
                      <strong className="text-sm font-mono text-neon-cyan uppercase font-black">{bookingSuccessTicket.id}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-mono text-gray-400 uppercase block">STATUS PASS</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 border border-emerald-500 text-emerald-400 uppercase">
                        {bookingSuccessTicket.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-gray-500 block">NOME FAN:</span>
                      <strong className="text-white font-bold block">{bookingSuccessTicket.name}</strong>
                      <span className="text-gray-400 block mt-1">{bookingSuccessTicket.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 block">CONSOLE SELEZIONATA:</span>
                      <strong className="text-neon-pink font-bold block">{bookingSuccessTicket.platform}</strong>
                      <span className="text-gray-400 block mt-1">{bookingSuccessTicket.edition}</span>
                    </div>
                  </div>

                  {/* Sbloccamento visualizzazione targa */}
                  {(bookingSuccessTicket.plateText || savedPlate) && (
                    <div className="bg-[#120d24] p-3 rounded-xl border border-neon-cyan/20 flex flex-col items-center">
                      <span className="text-[8.5px] font-mono text-neon-cyan uppercase tracking-widest mb-2 block font-bold leading-none">🚘 TARGA DIGITALE REGISTRATA</span>
                      <div className={`w-full max-w-[240px] aspect-[2/1] rounded-xl p-2.5 flex flex-col justify-between items-center text-center relative shadow-lg text-[9px] border bg-gradient-to-br ${
                        (bookingSuccessTicket.plateStyle || savedPlate?.styleId) === "vice" ? "from-pink-500 via-purple-600 to-indigo-800 border-pink-300/20" :
                        (bookingSuccessTicket.plateStyle || savedPlate?.styleId) === "outlaw" ? "from-[#0c0c16] via-[#121224] to-[#0a071d] border-neon-cyan/40" :
                        (bookingSuccessTicket.plateStyle || savedPlate?.styleId) === "leonida" ? "from-emerald-800 via-teal-900 to-slate-900 border-emerald-500/20" :
                        "from-[#1e0b36] via-[#18082c] to-[#0d0419] border-yellow-600/30"
                      }`}>
                        <div className="w-full flex justify-between items-center px-2 text-[7px] text-white/90 font-mono font-bold leading-none">
                          <span>{savedPlate?.tag || "DEC"}</span>
                          <span>
                            {(bookingSuccessTicket.plateStyle || savedPlate?.styleId) === "vice" ? "Leonida - Vice City" :
                             (bookingSuccessTicket.plateStyle || savedPlate?.styleId) === "outlaw" ? "OUTLAW SPEC" :
                             (bookingSuccessTicket.plateStyle || savedPlate?.styleId) === "leonida" ? "Leonida Highway" :
                             "CAMPANIA — NAPOLI"}
                          </span>
                          <span>{savedPlate?.year || "26"}</span>
                        </div>
                        
                        <div className="text-2xl font-black italic tracking-wider filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans text-white uppercase mt-1">
                          {bookingSuccessTicket.plateText || savedPlate?.text || "VICE VI"}
                        </div>
                        
                        <div className="w-full flex justify-between items-center px-2 text-[6.5px] text-gray-400 font-mono leading-none">
                          <span className="text-white bg-black/50 px-1 rounded">{savedPlate?.sticker || "VCN"}</span>
                          <span className="text-[7.5px] text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan uppercase font-black">
                            {(bookingSuccessTicket.plateStyle || savedPlate?.styleId) === "pomigliano" ? "🍷 AZALE FLOWER BAR VIP" : "VCN REGISTERED"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-white/5 font-mono">
                    <div>
                      <span className="text-[9px] text-gray-500 block">TAG SCONTO ATTIVO AL PARTY:</span>
                      <span className="text-sm font-black text-neon-cyan">{bookingSuccessTicket.discountPercent}% OFF SULLA COPIA FISICA</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 block font-bold">BADGE UTENTE:</span>
                      <span className="text-xs text-yellow-400 font-bold flex items-center justify-end gap-1">
                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                        {bookingSuccessTicket.badgeEarned}
                      </span>
                    </div>
                  </div>

                  {/* Dettagli Party Esclusivi */}
                  <div className="bg-black/30 border border-[#00ffff]/10 rounded-2xl p-4 space-y-3 text-left">
                    <span className="text-[9px] font-mono text-neon-pink uppercase tracking-widest font-black block">★ SERATA DI RILASCIO - ACCREDITO EXCLUSIVE PARTY</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-[#140f2d] border border-white/5 rounded-xl space-y-1">
                        <span className="font-mono text-[9px] text-neon-pink font-bold block uppercase">🔊 DJ SET A TEMA</span>
                        <p className="text-[10px] text-gray-400 leading-normal">Selezione esclusiva synthwave, electro e le iconiche stazioni radio di Vice City per ballare tutta la notte!</p>
                      </div>
                      <div className="p-2.5 bg-[#140f2d] border border-white/5 rounded-xl space-y-1">
                        <span className="font-mono text-[9px] text-neon-cyan font-bold block uppercase">👕 GADGET & T-SHIRT</span>
                        <p className="text-[10px] text-gray-400 leading-normal">T-shirt ufficiali fuxia a tiratura limitata e adesivi esclusivi del portale VCN in omaggio al ritiro.</p>
                      </div>
                      <div className="p-2.5 bg-[#140f2d] border border-white/5 rounded-xl space-y-1">
                        <span className="font-mono text-[9px] text-yellow-500 block uppercase font-bold">🍹 COCKTAIL DEDICATI</span>
                        <p className="text-[10px] text-gray-400 leading-normal">Menu drink tropicale con miscele speciali ispirate a Leonida Beach preparate appositamente per gli accreditati.</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[9.5px] font-mono text-gray-400 italic text-center leading-normal">
                    Fai uno screenshot o stampa questa ricevuta digitale. Al check-in della festa, il nostro staff verificherà il QR Code della prenotazione.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: License Plate Customizer & Trivia Game Challenge (Col 5) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div id="plate-customizer">
            <PlateCustomizer 
              savedDesign={savedPlate} 
              onSave={onSavePlate} 
              isUnlocked={!!bookingSuccessTicket} 
            />
          </div>

          <div id="trivia-zone">
            <TriviaZone 
              currentStars={wantedStars} 
              onStarsUpdate={onStarsUpdate} 
              onSuccessBadge={onSuccessBadge} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
