import React, { useState } from "react";
import { ArrowLeft, PlusCircle, MessageSquare, RefreshCw, Trash2, Search, SlidersHorizontal } from "lucide-react";
import { NewsPost, BlogPost, GameBooking } from "../types";

interface AdminConsoleProps {
  news: NewsPost[];
  blog: BlogPost[];
  bookings: GameBooking[];
  adminStatus: any;
  onPublishNews: (title: string, content: string, category: string, badge: string, imageUrl: string) => Promise<void>;
  onPublishBlogThread: (title: string, author: string, content: string) => Promise<void>;
  onUpdateBookingStatus: (bookingId: string, status: string) => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>;
  onBack: () => void;
}

export default function AdminConsole({
  news,
  blog,
  bookings,
  adminStatus,
  onPublishNews,
  onPublishBlogThread,
  onUpdateBookingStatus,
  onDeleteBooking,
  onBack
}: AdminConsoleProps) {
  // Booking filters state
  const [bookingSearch, setBookingSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Admin form states
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState("Ufficiale");
  const [newsBadge, setNewsBadge] = useState("ROCKSTAR APPROVED");
  const [newsImage, setNewsImage] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500");

  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;
    setIsSubmittingNews(true);
    try {
      await onPublishNews(newsTitle, newsContent, newsCategory, newsBadge, newsImage);
      // Reset
      setNewsTitle("");
      setNewsContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingNews(false);
    }
  };

  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;
    setIsSubmittingBlog(true);
    try {
      await onPublishBlogThread(blogTitle, blogAuthor || "Redazione VCN", blogContent);
      // Reset
      setBlogTitle("");
      setBlogAuthor("");
      setBlogContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBlog(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in unique-admin-console">
      {/* Header control path */}
      <div className="bg-[#110c24] border border-white/10 p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-black hover:bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-left">
            <h2 className="text-lg font-display font-extrabold text-white uppercase italic">
              PANNELLO DI CONTROLLO GESTIONALE
            </h2>
            <p className="text-[10px] font-mono text-neon-cyan uppercase">Consolle di approvazione e pubblicazione in tempo reale</p>
          </div>
        </div>

        <div className="flex gap-2 text-xs font-mono font-bold">
          <span className="px-3 py-1.5 bg-[#00ffff]/10 border border-[#00ffff]/30 text-neon-cyan rounded-lg uppercase">
            📡 SECURE SERVER CONSOLE
          </span>
        </div>
      </div>

      {/* REAL-TIME METRICS ANALYTICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#15102a] border border-white/10 p-4 rounded-2xl relative text-left">
          <span className="text-[9px] font-mono text-gray-500 block uppercase">TICKET PRENOTATI PARTY:</span>
          <strong className="text-2xl font-mono text-neon-pink font-black">{adminStatus?.totalBooked || bookings.length}</strong>
          <p className="text-[9px] text-gray-400 mt-1 uppercase font-mono">DISTRIBUZIONE COPIE ATTIVA</p>
        </div>

        <div className="bg-[#15102a] border border-white/10 p-4 rounded-2xl relative text-left">
          <span className="text-[9px] font-mono text-gray-500 block uppercase">PIATTAFORME SCOPE:</span>
          <div className="text-xs font-mono space-y-0.5 mt-1">
            <div className="flex justify-between"><span>PS5:</span> <strong className="text-white">{adminStatus?.platforms?.ps5 || 0}</strong></div>
            <div className="flex justify-between"><span>Xbox X:</span> <strong className="text-white">{adminStatus?.platforms?.xbox || 0}</strong></div>
            <div className="flex justify-between"><span>PC:</span> <strong className="text-white">{adminStatus?.platforms?.pc || 0}</strong></div>
          </div>
        </div>

        <div className="bg-[#15102a] border border-white/10 p-4 rounded-2xl relative text-left">
          <span className="text-[9px] font-mono text-gray-500 block uppercase">UTENTI TRIVIA CHAMPION:</span>
          <strong className="text-2xl font-mono text-yellow-500 font-black">{adminStatus?.triviaChampions || 0}</strong>
          <p className="text-[9px] text-gray-400 mt-1 uppercase font-mono">15% SCONTO APPLICATO</p>
        </div>

        <div className="bg-[#15102a] border border-white/10 p-4 rounded-2xl relative text-left">
          <span className="text-[9px] font-mono text-gray-500 block uppercase">NOTIZIE IN ARCHIVIO:</span>
          <strong className="text-2xl font-mono text-neon-cyan font-black">{news.length}</strong>
          <p className="text-[9px] text-gray-400 mt-1 uppercase font-mono">HOME BULLETINS LIVE</p>
        </div>
      </div>

      {/* LOWER PORTION: RESERVATION TABLE AND PUBLICATION FORMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Full Interactive Reservation Table (Span 8) */}
        <div className="lg:col-span-8 bg-[#110c24] border border-white/10 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-mono font-bold text-white uppercase block text-left">
              REGISTRO DI PRENOTAZIONE DISCO FISICO PER LA SERATA
            </span>
            <span className="text-[9px] font-mono text-gray-400 uppercase">DATABASE_LIVE</span>
          </div>

          {/* Smart Filtering Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-black/40 rounded-2xl border border-white/5 text-xs">
            <div className="relative">
              <span className="absolute left-2.5 top-2.5 text-gray-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Cerca nome, email, QR ID, targa..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-xl font-mono text-xs text-white placeholder-gray-500 focus:border-neon-pink outline-none"
              />
            </div>

            <div>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl font-mono text-xs text-white focus:border-neon-pink outline-none cursor-pointer"
              >
                <option value="all">Tutte le Piattaforme</option>
                <option value="PS5">PlayStation 5</option>
                <option value="Xbox">Xbox Series X</option>
                <option value="PC">PC (Vice-City Net)</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl font-mono text-xs text-white focus:border-neon-pink outline-none cursor-pointer"
              >
                <option value="all">Tutti gli Stati</option>
                <option value="Approvato">Approvato</option>
                <option value="In Attesa">In Attesa</option>
                <option value="Ritiro Eseguito">Ritiro Eseguito</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[10px] text-gray-500 uppercase">
                  <th className="py-2.5 px-3">QR ID</th>
                  <th className="py-2.5 px-3">UTENTE / EMAIL</th>
                  <th className="py-2.5 px-3">PIATTAFORMA</th>
                  <th className="py-2.5 px-3">SCONTO</th>
                  <th className="py-2.5 px-3">LOYA_TAG</th>
                  <th className="py-2.5 px-3 text-right">STATO / AZIONE</th>
                </tr>
              </thead>
              <tbody>
                {bookings.filter((b) => {
                  const matchesSearch =
                    b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                    b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                    b.email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                    (b.plateText && b.plateText.toLowerCase().includes(bookingSearch.toLowerCase()));

                  const matchesPlatform =
                    platformFilter === "all" || 
                    b.platform.toLowerCase().includes(platformFilter.toLowerCase()) || 
                    (platformFilter === "Xbox" && b.platform.includes("Xbox"));
                  
                  const matchesStatus =
                    statusFilter === "all" || b.status === statusFilter;

                  return matchesSearch && matchesPlatform && matchesStatus;
                }).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500 font-mono">Nessun biglietto soddisfa i criteri di ricerca impostati.</td>
                  </tr>
                ) : (
                  bookings.filter((b) => {
                    const matchesSearch =
                      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                      b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                      b.email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                      (b.plateText && b.plateText.toLowerCase().includes(bookingSearch.toLowerCase()));

                    const matchesPlatform =
                      platformFilter === "all" || 
                      b.platform.toLowerCase().includes(platformFilter.toLowerCase()) || 
                      (platformFilter === "Xbox" && b.platform.includes("Xbox"));
                    
                    const matchesStatus =
                      statusFilter === "all" || b.status === statusFilter;

                    return matchesSearch && matchesPlatform && matchesStatus;
                  }).map((b) => (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/2 hover:text-white transition-colors group">
                      <td className="py-3 px-3 font-mono font-black text-neon-cyan uppercase">{b.id}</td>
                      <td className="py-3 px-3 text-left">
                        <strong className="text-white block">{b.name}</strong>
                        <span className="text-[10px] text-gray-400 block">{b.email}</span>
                        {b.plateText && (
                          <span className="inline-block mt-1 font-mono text-[9px] bg-neon-cyan/10 text-neon-cyan px-1.5 py-0.5 rounded border border-neon-cyan/20">
                            🚘 Targa: <strong className="font-bold">{b.plateText}</strong> [Style: {b.plateStyle || "vice"}]
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-left text-gray-300">
                        <span className="block font-semibold">{b.platform}</span>
                        <span className="text-[9px] text-gray-500 block">{b.edition}</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded capitalize ${
                            b.ticketType === "vip" ? "bg-pink-900/40 text-pink-300 border border-pink-500/20" :
                            b.ticketType === "deluxe" ? "bg-purple-900/40 text-purple-300 border border-purple-500/20" :
                            "bg-cyan-900/40 text-cyan-300 border border-cyan-500/20"
                          }`}>
                            🎫 {b.ticketType || "regular"} ({b.ticketPrice || 15}€)
                          </span>
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-zinc-900 text-emerald-400 rounded border border-emerald-500/15 uppercase">
                            💳 {b.paymentMethod || "paypal"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-left font-mono text-neon-pink font-bold">{b.discountPercent}% OFF</td>
                      <td className="py-3 px-3 text-left text-[10px] text-yellow-400 font-bold">🏆 {b.badgeEarned}</td>
                      <td className="py-3 px-3 text-right space-y-1">
                        {/* Status colored label Badge */}
                        <div className="inline-block uppercase">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            b.status === 'Approvato' 
                              ? 'bg-emerald-990 bg-emerald-900/40 text-emerald-400 border border-emerald-600/30' 
                              : b.status === 'Ritiro Eseguito'
                              ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-600/30'
                              : 'bg-amber-900/40 text-amber-400 border border-amber-600/30'
                          }`}>
                            {b.status}
                          </span>
                        </div>

                        {/* Controls selectors row */}
                        <div className="flex justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Approvato')}
                            className="px-1 py-0.5 bg-emerald-950 hover:bg-emerald-800 text-[8px] font-mono text-emerald-400 rounded border border-emerald-700/30 cursor-pointer"
                            title="Approva ticket"
                          >
                            Approva
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'Ritiro Eseguito')}
                            className="px-1 py-0.5 bg-cyan-950 hover:bg-cyan-800 text-[8px] font-mono text-cyan-400 rounded border border-cyan-700/30 cursor-pointer"
                            title="Segnala ritiro disco eseguito"
                          >
                            Ritirato
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'In Attesa')}
                            className="px-1 py-0.5 bg-amber-950 hover:bg-amber-800 text-[8px] font-mono text-amber-400 rounded border border-amber-700/30 cursor-pointer"
                            title="Metti in attesa"
                          >
                            Sospendi
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Eliminare definitivamente la prenotazione di ${b.name}?`)) {
                                onDeleteBooking(b.id);
                              }
                            }}
                            className="px-1 py-0.5 bg-red-950/60 hover:bg-red-800 text-[8px] font-mono text-red-400 rounded border border-red-700/30 cursor-pointer flex items-center justify-center gap-0.5"
                            title="Elimina prenotazione"
                          >
                            <Trash2 className="w-2 h-2" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Fast Publish forms (Span 4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* News creation form card */}
          <div className="bg-[#15102a] border border-white/10 p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-bold text-left">
              <PlusCircle className="w-4 h-4 text-neon-pink" /> PUBBLICA AGGIORNAMENTO / NOTIZIA
            </h3>

            <form onSubmit={handleSubmitNews} className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">Titolo Notizia</label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Rockstar rivela la copertina ufficiale..."
                  className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 block uppercase">Categoria</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-2 rounded-xl text-xs text-white cursor-pointer"
                  >
                    <option value="Ufficiale">Ufficiale</option>
                    <option value="Speculazione">Speculazione</option>
                    <option value="Analisi Leak">Analisi Leak</option>
                    <option value="Esclusivo VCN">Esclusivo VCN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 block uppercase">Badge Voci</label>
                  <select
                    value={newsBadge}
                    onChange={(e) => setNewsBadge(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-2 rounded-xl text-xs text-white cursor-pointer"
                  >
                    <option value="ROCKSTAR APPROVED">APPROVED</option>
                    <option value="RUMOR ACCREDITATO">RUMOR OK</option>
                    <option value="SCOOP DE REDAZIONE">SCOOP</option>
                    <option value="CRITICO / TEORICO">CRITICO</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">URL Copertina / Immagine Bulletin</label>
                <input
                  type="text"
                  value={newsImage}
                  onChange={(e) => setNewsImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">Contenuto Notizia</label>
                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Scrivi qui i dettagli salienti..."
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingNews}
                className="w-full py-2.5 bg-neon-pink hover:bg-neon-pink/80 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer text-white flex items-center justify-center gap-1"
              >
                {isSubmittingNews ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                Invia Notizia in Homepage
              </button>
            </form>
          </div>

          {/* Blog discussion post form card */}
          <div className="bg-[#15102a] border border-white/10 p-5 rounded-3xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-bold text-left">
              <MessageSquare className="w-4 h-4 text-neon-cyan" /> AVVIA NUOVA DISCUSSIONE FORUM
            </h3>

            <form onSubmit={handleSubmitBlog} className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">Titolo Thread</label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="Teoria sulla rapina finale..."
                  className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">Nickname Autore</label>
                <input
                  type="text"
                  value={blogAuthor}
                  onChange={(e) => setBlogAuthor(e.target.value)}
                  placeholder="VCN_Infiltrato"
                  className="w-full bg-black/40 border border-white/10 p-2 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 block uppercase">Analisi / Testo Discussione</label>
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Scrivi qui gli spunti di dibattito..."
                  className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBlog}
                className="w-full py-2.5 bg-neon-cyan text-black hover:bg-neon-cyan/80 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer flex items-center justify-center gap-1"
              >
                {isSubmittingBlog ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                Apri Discussione Community
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
