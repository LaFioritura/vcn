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
  bookingTicketType: "regular" | "deluxe" | "vip";
  setBookingTicketType: (val: "regular" | "deluxe" | "vip") => void;
  bookingPaymentMethod: "paypal" | "stripe";
  setBookingPaymentMethod: (val: "paypal" | "stripe") => void;
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
  bookingTicketType,
  setBookingTicketType,
  bookingPaymentMethod,
  setBookingPaymentMethod,
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase font-bold text-neon-cyan">🎮 SELEZIONA PIATTAFORMA</label>
                      <select
                        value={bookingPlatform}
                        onChange={(e: any) => setBookingPlatform(e.target.value)}
                        className="w-full bg-[#110c24] border border-[#00ffff]/20 p-2.5 rounded-xl text-xs text-white cursor-pointer focus:border-neon-cyan outline-none font-mono"
                      >
                        <option value="PS5">PlayStation 5</option>
                        <option value="Xbox Series X">Xbox Series X</option>
                        <option value="PC">PC (Vice-City Digital Pack)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase font-bold text-neon-pink">🏆 PRESTIGIO BADGE ATTUALE</label>
                      <div className="bg-[#1c1439] border border-neon-pink/20 p-2.5 rounded-xl text-xs font-mono font-bold text-pink-300 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                          {earnedBadge}
                        </span>
                        <span className="text-neon-pink">{calculatedDiscount}% DI ABBUONO</span>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL TICKET TIER CARDS WITH CLEAR INSTRUCTIONS */}
                  <div className="space-y-3">
                    <div className="bg-[#0b071a]/95 border-2 border-dashed border-[#a855f7]/30 p-3.5 rounded-2xl text-[11px] leading-relaxed text-gray-300 text-left font-sans space-y-2">
                      <p className="font-mono text-neon-pink text-xs uppercase font-black tracking-wider">💡 REGOLE & ISTRUZIONI DI PRENOTAZIONE TICKET:</p>
                      <ul className="list-disc pl-4 space-y-1 text-gray-300">
                        <li><strong>Accesso Totale Garantito:</strong> Tutti e tre i pacchetti di seguito dicono sì all'ingresso e ti danno accesso immediato alla location e alla magica serata del Launch Party (con DJ Set a tema, gadget e cocktail dedicati!).</li>
                        <li><strong>Esclusiva Copia Standard:</strong> Vendiamo e distribuiamo <strong>esclusivamente la copia fisica standard</strong> del gioco. La trovi inclusa solo nel pacchetto Premium da <span className="text-white font-bold">99€</span>.</li>
                        <li><strong>Zero Attese e Code:</strong> Paghi tutto comodamente da casa in sicurezza tramite <strong>PayPal</strong> o <strong>Stripe</strong>. Al tuo arrivo ti basterà mostrare il QR code del tuo ticket per iniziare a festeggiare!</li>
                      </ul>
                    </div>

                    <label className="text-[10px] font-mono text-gray-400 block uppercase font-bold">🎟️ SELEZIONA PACCHETTO INGRESSO & BENEFITS</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Regular Card */}
                      <div 
                        type="button"
                        onClick={() => setBookingTicketType("regular")}
                        className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left relative ${
                          bookingTicketType === "regular" 
                            ? "bg-gradient-to-b from-[#1c113e] to-[#0e0724] border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.15)] ring-1 ring-neon-cyan" 
                            : "bg-[#0b071a]/60 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {bookingTicketType === "regular" && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                        )}
                        <div>
                          <div className="text-[10px] font-mono font-black tracking-widest text-emerald-400 uppercase">TIER 01 • BASE</div>
                          <h4 className="text-sm font-display font-black tracking-tight text-white mt-0.5">REGULAR PASS</h4>
                          <ul className="text-[9.5px] text-gray-400 mt-2 space-y-1 font-mono">
                            <li className="flex items-center gap-1">✔ Ingresso garantito</li>
                            <li className="flex items-center gap-1">✔ 1 Drink tropicale</li>
                          </ul>
                        </div>
                        <div className="text-xl font-display font-black text-neon-cyan mt-4">15 € <span className="text-[9px] font-mono font-normal text-gray-400 block">Drink incluso</span></div>
                      </div>

                      {/* Deluxe Card */}
                      <div 
                        type="button"
                        onClick={() => setBookingTicketType("deluxe")}
                        className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left relative ${
                          bookingTicketType === "deluxe" 
                            ? "bg-gradient-to-b from-[#1c113e] to-[#0e0724] border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-[#a855f7]" 
                            : "bg-[#0b071a]/60 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {bookingTicketType === "deluxe" && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-[#a855f7] rounded-full animate-ping" />
                        )}
                        <div>
                          <div className="text-[10px] font-mono font-black tracking-widest text-[#a855f7] uppercase">TIER 02 • FAN PACK</div>
                          <h4 className="text-sm font-display font-black tracking-tight text-white mt-0.5">DELUXE GADGET PASS</h4>
                          <ul className="text-[9.5px] text-gray-400 mt-2 space-y-1 font-mono">
                            <li className="flex items-center gap-1 text-white">✔ Ingresso + Drink</li>
                            <li className="flex items-center gap-1">✔ Adesivo olografico R*</li>
                            <li className="flex items-center gap-1">✔ Logo GTA 3D Special</li>
                          </ul>
                        </div>
                        <div className="text-xl font-display font-black text-[#a855f7] mt-4">35 € <span className="text-[9px] font-mono font-normal text-gray-400 block">Miglior rapporto benefits</span></div>
                      </div>

                      {/* VIP Card */}
                      <div 
                        type="button"
                        onClick={() => setBookingTicketType("vip")}
                        className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left relative ${
                          bookingTicketType === "vip" 
                            ? "bg-gradient-to-b from-[#1c113e] to-[#0e0724] border-neon-pink shadow-[0_0_15px_rgba(255,0,204,0.15)] ring-1 ring-neon-pink" 
                            : "bg-[#0b071a]/60 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {bookingTicketType === "vip" && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full animate-ping" />
                        )}
                        <div>
                          <div className="text-[10px] font-mono font-black tracking-widest text-neon-pink uppercase">TIER 03 • COLLECTOR</div>
                          <h4 className="text-sm font-display font-black tracking-tight text-white mt-0.5">VIP GAME PASS</h4>
                          <ul className="text-[9.5px] text-gray-400 mt-2 space-y-1 font-mono">
                            <li className="flex items-center gap-1 text-white">✔ Ingresso + Drink</li>
                            <li className="flex items-center gap-1 font-bold text-neon-cyan">✔ COPIA STANDARD GIOCO</li>
                            <li className="flex items-center gap-1">✔ Adesivo + Logo 3D R*</li>
                          </ul>
                        </div>
                        <div className="text-xl font-display font-black text-neon-pink mt-4">
                          99 € 
                          <span className="text-[8.5px] font-mono font-normal text-[#00ffff] block mt-0.5">
                            {calculatedDiscount}% sconto applicato alla cassa per gioco!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT METHOD SELECTION */}
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-400 uppercase font-black">💳 METODO DI PAGAMENTO CRITTOGRAFATO</span>
                      <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        SSL SECURE CHANNEL
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingPaymentMethod("paypal")}
                        className={`py-2 px-3 rounded-xl border font-mono font-bold text-xs flex items-center justify-center gap-2 select-none cursor-pointer transition-all ${
                          bookingPaymentMethod === "paypal"
                            ? "bg-[#002f87]/40 border-[#0079c1] text-white font-black"
                            : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="text-sky-400 font-sans italic font-black">PayPal</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setBookingPaymentMethod("stripe")}
                        className={`py-2 px-3 rounded-xl border font-mono font-bold text-xs flex items-center justify-center gap-2 select-none cursor-pointer transition-all ${
                          bookingPaymentMethod === "stripe"
                            ? "bg-[#635bff]/25 border-[#635bff] text-white font-black"
                            : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="text-purple-400 font-sans italic font-bold">Stripe Pay</span>
                      </button>
                    </div>
                    <p className="text-[9px] font-mono text-gray-400 italic leading-tight text-center">
                      Nessun addebito reale verrà effettuato su conti veri. La transazione è simulata in sandbox locale e sbloccherà istantaneamente il tuo Boarding Pass e il radar della fiera!
                    </p>
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

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-white/5 pb-3">
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

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[9px] text-gray-500 block">🏷️ TIPO TICKET:</span>
                      <strong className="text-[#00ffff] font-bold block uppercase">
                        {bookingSuccessTicket.ticketType === "vip" 
                          ? "VIP COLLECTOR (99€)" 
                          : bookingSuccessTicket.ticketType === "deluxe" 
                            ? "DELUXE GADGETS (35€)" 
                            : "REGULAR PASS (15€)"}
                      </strong>
                      <span className="text-[9.5px] text-gray-400 leading-tight block mt-0.5">
                        {bookingSuccessTicket.ticketType === "vip"
                          ? "Include Copia Fisica Standard"
                          : bookingSuccessTicket.ticketType === "deluxe"
                            ? "Include Logo 3D & Adesivo"
                            : "Include Ingresso & 1 Drink"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 block">💳 PAGATO DIGITALMENTE DA CASA:</span>
                      <strong className="text-emerald-400 font-bold block uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        {bookingSuccessTicket.paymentMethod || "paypal"} (PROTETTO)
                      </strong>
                      <span className="text-[9px] text-gray-400 block mt-0.5">Transazione ID: Sandbox_VCN_{bookingSuccessTicket.id}</span>
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
