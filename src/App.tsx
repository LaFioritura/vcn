import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  Heart,
  Award,
  BookOpen,
  RefreshCw,
  Compass,
  Radio,
  FileText,
  Newspaper,
  Ticket,
  Lock,
  Unlock,
  Globe,
  ShieldAlert
} from "lucide-react";

import SpeculationMap from "./components/SpeculationMap";
import { PlateDesign } from "./components/PlateCustomizer";
import NewsroomTab from "./components/NewsroomTab";
import PassMezzanotteTab from "./components/PassMezzanotteTab";
import AdminConsole from "./components/AdminConsole";
import { BlogPost, NewsPost, GameBooking } from "./types";

export default function App() {
  // Active View selection: 'fan' portal or 'admin' dashboard gestionale
  const [activeView, setActiveView] = useState<"fan" | "admin">("fan");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");

  // Fan portal navigation sub-view tab select
  const [activeTab, setActiveTab] = useState<"newsroom" | "preorder" | "radar" | "chat">("newsroom");

  // State arrays fetched from backend routes
  const [news, setNews] = useState<NewsPost[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [bookings, setBookings] = useState<GameBooking[]>([]);
  const [adminStatus, setAdminStatus] = useState<any>(null);

  // States for live fan booking ticket generator
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPlatform, setBookingPlatform] = useState<"PS5" | "Xbox Series X" | "PC">("PS5");
  const [bookingEdition, setBookingEdition] = useState("Standard Neon Steelbook");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState<GameBooking | null>(null);

  // Custom live vehicle license plate
  const [savedPlate, setSavedPlate] = useState<PlateDesign | null>({
    text: "VICE NY",
    styleId: "vice",
    tag: "DEC",
    year: "26",
    sticker: "VCN"
  });

  // Gamification stats (connected to Trivia Zone & Pre-order discount)
  const [wantedStars, setWantedStars] = useState(2); // starts at 2 stars, 5 unlock maximum discount
  const [earnedBadge, setEarnedBadge] = useState("Hype Follower");

  // Loading indicator helper
  const [isLoading, setIsLoading] = useState(false);

  // Message states
  const [uiFeedbackMessage, setUiFeedbackMessage] = useState<string | null>(null);

  // Submit comment state
  const [commentNickname, setCommentNickname] = useState("");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  // Real-time local timezone clock for Miami/Leonida State (EST)
  const [miamiTime, setMiamiTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setMiamiTime(now.toLocaleTimeString("it-IT", options));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Global navigator that can change tabs AND scroll elegantly with attention flash highlight!
  const handleNavigateToTab = (tabId: "newsroom" | "preorder" | "radar" | "chat", targetElementId?: string) => {
    setActiveTab(tabId);
    if (targetElementId) {
      setTimeout(() => {
        const el = document.getElementById(targetElementId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-4", "ring-neon-pink", "ring-offset-2", "ring-offset-[#06040b]", "transition-all", "duration-500");
          setTimeout(() => {
            el.classList.remove("ring-4", "ring-neon-pink", "ring-offset-2", "ring-offset-[#06040b]");
          }, 2500);
        }
      }, 250);
    }
  };

  // Fetch initial content
  useEffect(() => {
    fetchInitialData();
  }, [activeView]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [newsRes, blogRes, bookingsRes, statusRes] = await Promise.all([
        fetch("/api/news").then((r) => r.json()),
        fetch("/api/blog").then((r) => r.json()),
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/status").then((r) => r.json()),
      ]);

      setNews(newsRes || []);
      setBlog(blogRes || []);
      setBookings(bookingsRes || []);
      setAdminStatus(statusRes || null);
    } catch (error) {
      console.error("Error fetching state data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-order Booking submission
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail) {
      triggerNotification("Nome ed Email sono richiesti per riservare il ticket!");
      return;
    }

    // Dynamic scale based on user stars:
    // 0-1 questions correct: 10%
    // 2-3 questions correct: 12%
    // 4 questions correct: 13%
    // 5-6 questions correct: 15% Max Sconto
    let calculatedDiscount = 10;
    if (wantedStars >= 5) {
      calculatedDiscount = 15;
    } else if (wantedStars === 4) {
      calculatedDiscount = 13;
    } else if (wantedStars >= 2) {
      calculatedDiscount = 12;
    } else {
      calculatedDiscount = 10;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          platform: bookingPlatform,
          edition: bookingEdition,
          badgeEarned: earnedBadge,
          discountPercent: calculatedDiscount,
          notes: bookingNotes,
          plateText: savedPlate?.text || "VICE NY",
          plateStyle: savedPlate?.styleId || "vice"
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nella prenotazione del ticket.");
      }

      const newBookingResult = await response.json();
      setBookingSuccessTicket(newBookingResult);
      triggerNotification(`Ticket Party & Copia Fisica (${calculatedDiscount}% Sconto) Riservati! La location è sbloccata!`);
      
      // Reset forms
      setBookingName("");
      setBookingEmail("");
      setBookingNotes("");
      
      // Refresh list
      fetchInitialData();
    } catch (err: any) {
      triggerNotification(err?.message || "Impossibile salvare prenotazione.");
    } finally {
      setIsLoading(false);
    }
  };

  // Like a Blog Post speculation
  const handleLikeBlog = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/${postId}/like`, { method: "POST" });
      if (response.ok) {
        const updatedPost = await response.json();
        setBlog((p) => p.map((item) => (item.id === postId ? updatedPost : item)));
        triggerNotification("Hai supportato questa teoria!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit comment on blog speculation
  const handleAddComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const response = await fetch(`/api/blog/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: commentNickname || "Street_Rat_Anonimo",
          comment: text
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setBlog((p) => p.map((item) => (item.id === postId ? updatedPost : item)));
        setCommentText((prev) => ({ ...prev, [postId]: "" }));
        triggerNotification("Commento inviato con successo nel forum di discussione!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Admin News helper
  const handlePublishNews = async (title: string, content: string, category: string, badge: string, imageUrl: string) => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, badge, imageUrl }),
      });

      if (response.ok) {
        fetchInitialData();
        triggerNotification("Notizia ufficiale pubblicata nell'archivio home feed!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Admin Forum thread helper
  const handlePublishBlogThread = async (title: string, author: string, content: string) => {
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, content }),
      });

      if (response.ok) {
        fetchInitialData();
        triggerNotification("Nuova discussione pubblicata con successo nel forum di Leonida!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update reservation status helper
  const handleUpdateBookingStatus = async (bookingId: string, nextStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });

      if (response.ok) {
        const updated = await response.json();
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
        triggerNotification(`Stato prenotazione aggiornato a: ${nextStatus}`);
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        triggerNotification(`Prenotazione ${bookingId} eliminata con successo.`);
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger brief alert notifications
  const triggerNotification = (msg: string) => {
    setUiFeedbackMessage(msg);
    setTimeout(() => {
      setUiFeedbackMessage(null);
    }, 4500);
  };

  return (
    <div id="vcn-layout-core" className="min-h-screen bg-[#06040b] text-white relative font-sans leading-relaxed selection:bg-neon-pink selection:text-white pb-12 text-left">
      
      {/* Dynamic Background elements based on theme specs */}
      <div className="absolute top-[-250px] left-[-200px] w-[600px] h-[600px] bg-neon-pink/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-neon-cyan/8 blur-[130px] rounded-full pointer-events-none" />

      {/* Retro pink grid lining behind */}
      <div className="absolute inset-0 retro-grid opacity-[0.06] pointer-events-none" />

      {/* Ambient Top Light Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-neon-pink via-[#a855f7] to-neon-cyan relative z-10" />

      {/* Floating brief action banner */}
      {uiFeedbackMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce max-w-sm bg-gradient-to-r from-neon-pink to-[#15102a] border-l-4 border-neon-cyan p-4 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-neon-cyan" />
            <p className="text-xs font-mono font-bold text-white tracking-wide">{uiFeedbackMessage}</p>
          </div>
        </div>
      )}

      {/* Top Bar Status Ticker & Security Toggle */}
      <div className="bg-black/80 border-b border-white/5 py-1.5 px-4 text-[10px] sm:text-[11px] font-mono flex flex-col sm:flex-row justify-between items-center z-10 gap-2 select-none relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-neon-pink">
            <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
            <span className="font-extrabold uppercase tracking-widest text-[#ec4899]">VCN SATELLITE CONNECTION ACTIVE</span>
          </div>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="text-gray-400 uppercase hidden sm:inline">SECURE LATENCY: 14ms VIA VICE NET</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-neon-cyan">
            <span className="text-gray-500 font-bold">MIA/EST LOCAL TIME:</span>
            <span className="font-extrabold text-[#06b6d4] tracking-widest">{miamiTime || "Loading..."}</span>
          </div>
          <span className="text-gray-700">|</span>
          <button
            onClick={() => {
              if (activeView === "fan") {
                setActiveView("admin");
                triggerNotification("Accesso alla consolle di sicurezza autorizzato.");
              } else {
                setActiveView("fan");
              }
            }}
            className="text-gray-300 hover:text-white uppercase transition-all duration-200 outline-none cursor-pointer flex items-center gap-1.5 text-[9.5px] font-mono font-black border border-white/10 hover:border-neon-pink/40 rounded px-2.5 py-0.5 bg-white/5 hover:bg-neon-pink/10"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-neon-pink" />
            {activeView === "fan" ? "SECURITY PORTAL" : "PUBLIC HUB"}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        
        {/* Navigation / Header */}
        <header id="header" className="flex flex-col lg:flex-row justify-between items-center z-10 border-b border-white/10 pb-6 gap-6 pt-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="bg-gradient-to-tr from-neon-pink via-[#bf5af2] to-neon-cyan p-[3px] rounded-2xl shadow-2xl shadow-pink-500/20">
              <div className="bg-black px-6 py-3 rounded-[13px] font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter hover:scale-102 transition-transform select-none">
                VCN <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">NEWS</span>
              </div>
            </div>
            <div className="text-center sm:text-left self-center space-y-1">
              <span className="text-[11px] tracking-[0.4em] uppercase opacity-90 font-mono font-black block text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan leading-tight">LEONIDA STATE REVOLUTIONARY HUB</span>
              <span className="text-[9px] text-gray-400 font-mono tracking-wider block uppercase">EST. 2024 • PORTALE ANALISI REVELATIONS & PRE-ORDINE MIDNIGHT PARTY</span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-neon-pink/15 text-neon-pink text-[8px] font-mono tracking-widest font-black border border-neon-pink/20 uppercase">
                🚨 ACCREDITI LIMITATI & TARGA ALLEGATA
              </span>
            </div>
          </div>

          {/* Interactive Navigation Tab buttons - Emojis removed and replaced with elegant Lucide Icons */}
          <nav className="flex flex-wrap gap-2 text-[10px] uppercase font-mono font-bold select-none">
            <button
              onClick={() => handleNavigateToTab("newsroom")}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "newsroom" 
                  ? "bg-neon-pink/15 text-neon-pink border-neon-pink" 
                  : "bg-black/40 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" /> NEWSROOM FEED
            </button>
            <button
              onClick={() => handleNavigateToTab("preorder")}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "preorder"
                  ? "bg-neon-cyan/15 text-neon-cyan border-neon-cyan"
                  : "bg-black/40 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" /> PASS MEZZANOTTE 
              {bookingSuccessTicket && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
            <button
              onClick={() => handleNavigateToTab("radar")}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "radar"
                  ? "bg-yellow-500/15 text-yellow-500 border-yellow-500"
                  : "bg-black/40 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> RADAR SAT-HUD 
              {bookingSuccessTicket ? (
                <span className="px-1 bg-emerald-500 text-black text-[7px] rounded animate-pulse font-black">LIVE</span>
              ) : (
                <span className="px-1 bg-neon-pink text-white text-[7px] rounded font-black">LOCK</span>
              )}
            </button>
            <button
              onClick={() => handleNavigateToTab("chat")}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "chat"
                  ? "bg-purple-500/15 text-purple-400 border-purple-500"
                  : "bg-black/40 text-gray-400 border-white/5 hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> DISCUSSION TALK
            </button>
          </nav>

          <div className="flex gap-2">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-white hover:text-black transition-all">IG</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-white hover:text-black transition-all">X</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-neon-pink border border-neon-pink flex items-center justify-center text-[10px] font-bold cursor-pointer hover:scale-105 hover:bg-neon-pink/80 transition-all text-white">YT</a>
          </div>
        </header>

        {/* LOADING INDICATOR SKELETON */}
        {isLoading && (
          <div className="flex items-center justify-center py-2 text-xs font-mono text-neon-pink uppercase tracking-widest gap-2 bg-black/40 border border-white/5 p-3 rounded-2xl animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-neon-pink" />
            CONNETTENDOSI CON LA RETE SAT SATELLITARE DI LEONIDA...
          </div>
        )}

        {/* VIEW CONTROLLER CONTENT: Renders either fan custom tabs or administrative console */}
        {activeView === "fan" ? (
          
          <div className="space-y-6">
            
            {/* 1. NEWSROOM FEED TAB SECTION */}
            {activeTab === "newsroom" && (
              <NewsroomTab news={news} onNavigateToTab={handleNavigateToTab} />
            )}

            {/* 2. PASS MEZZANOTTE TICKET COMPILATION TAB SECTION */}
            {activeTab === "preorder" && (
              <PassMezzanotteTab
                bookingName={bookingName}
                setBookingName={setBookingName}
                bookingEmail={bookingEmail}
                setBookingEmail={setBookingEmail}
                bookingPlatform={bookingPlatform}
                setBookingPlatform={setBookingPlatform}
                bookingEdition={bookingEdition}
                setBookingEdition={setBookingEdition}
                bookingNotes={bookingNotes}
                setBookingNotes={setBookingNotes}
                bookingSuccessTicket={bookingSuccessTicket}
                savedPlate={savedPlate}
                onSavePlate={setSavedPlate}
                wantedStars={wantedStars}
                onStarsUpdate={setWantedStars}
                earnedBadge={earnedBadge}
                onSuccessBadge={setEarnedBadge}
                handleCreateBooking={handleCreateBooking}
                isLoading={isLoading}
                onGoToRadar={() => handleNavigateToTab("radar")}
              />
            )}

            {/* 3. RADAR EVENTO TAB ROADMAP SECTION */}
            {activeTab === "radar" && (
              <div className="space-y-6 animate-fade-in text-left">
                
                {/* Lock CTA notification if the user hasn't booked yet */}
                {!bookingSuccessTicket && (
                  <div className="bg-[#ff00cc]/5 border-2 border-dashed border-[#ff00cc]/30 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <strong className="text-neon-pink text-xs uppercase font-mono font-black tracking-widest block">TRACCIAMENTO REALE SATELLITE DISATTIVATO</strong>
                      <p className="text-xs text-gray-300">
                        La traccia radio locale sul party di lancio è inattiva. Compila la richiesta di pre-ordine nella sezione <strong>Pass Mezzanotte</strong> per ricevere il ticket crittografato che decodifica istantaneamente le coordinate GPS della venue!
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigateToTab("preorder", "booking-party")}
                      className="px-5 py-2.5 bg-neon-pink hover:bg-neon-pink/90 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg text-nowrap cursor-pointer"
                    >
                      🚀 OTTIENI DETTAGLI ORA
                    </button>
                  </div>
                )}

                {/* Tactical Radar HUD Component */}
                <SpeculationMap isUnlocked={!!bookingSuccessTicket} />

              </div>
            )}

            {/* 4. CHAT COMMUNITY FORUM DISCUSSION BOARD */}
            {activeTab === "chat" && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="bg-[#110c24] border border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-neon-pink" />
                      <h3 className="text-lg font-display font-extrabold text-white uppercase italic tracking-tight">
                        LEONIDA COMMUNITY FORUM
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-black/40 border border-white/10 text-[9px] font-mono text-neutral-400 rounded-lg font-bold">
                      {blog.length} DISCUSSIONI ATTIVE
                    </span>
                  </div>

                  <div className="space-y-5">
                    {blog.length === 0 ? (
                      <p className="text-xs text-center text-gray-500 py-10 font-mono">Nessuna discussione aperta nel forum. Torna più tardi o contatta la redazione!</p>
                    ) : (
                      blog.map((post) => (
                        <div key={post.id} className="bg-black/40 border border-white/5 hover:border-neon-pink/20 rounded-2xl p-4 space-y-3 transition-colors">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-bold text-white uppercase tracking-tight leading-snug">
                              {post.title}
                            </h4>
                            <span className="text-[9px] font-mono text-gray-500 whitespace-nowrap">{post.date}</span>
                          </div>

                          <p className="text-xs text-gray-300 leading-relaxed font-sans">
                            {post.content}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[10px] font-mono text-gray-400">
                            <div className="flex items-center gap-1">
                              <span className="text-neon-cyan">Thread da:</span>
                              <span className="text-white font-semibold">@{post.author}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLikeBlog(post.id)}
                                className="flex items-center gap-1 text-neon-pink hover:scale-105 active:scale-95 cursor-pointer transition-transform font-bold"
                              >
                                <Heart className="w-4 h-4 fill-neon-pink/10" />
                                <span>{post.likes} Mi piace</span>
                              </button>
                              <span className="flex items-center gap-1 text-gray-400">
                                <MessageSquare className="w-4 h-4" />
                                <span>{post.comments?.length || 0} Risposte</span>
                              </span>
                            </div>
                          </div>

                          {/* Comments box rendered beautifully inside the thread card */}
                          {post.comments && post.comments.length > 0 && (
                            <div className="bg-black/30 border-t border-white/5 rounded-xl p-3 space-y-2 mt-2">
                              {post.comments.map((comm, idx) => (
                                <div key={idx} className="text-[11px] leading-relaxed border-b border-white/5 pb-1.5 last:border-0 last:pb-0 text-left">
                                  <div className="flex justify-between font-mono text-[9px] text-[#00ffff] mb-0.5 font-bold">
                                    <span>@{comm.nickname}</span>
                                    <span className="text-gray-500">{comm.date}</span>
                                  </div>
                                  <p className="text-gray-300 font-sans">{comm.comment}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Interactive Reply component inline */}
                          <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-2 mt-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={commentNickname}
                                onChange={(e) => setCommentNickname(e.target.value)}
                                placeholder="Nickname (es. TommyV)"
                                className="bg-black/50 border border-white/10 rounded-lg p-1 text-[10px] text-white focus:outline-none"
                              />
                              <span className="text-[9px] text-gray-500 uppercase font-mono">Dì la tua teoria</span>
                            </div>
                            
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={commentText[post.id] || ""}
                                onChange={(e) =>
                                  setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                                }
                                placeholder="Partecipa al dibattito dei fan di Leonida..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="px-3 bg-neon-pink hover:opacity-90 text-white rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                              >
                                RISPONDI
                              </button>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        ) : (
          /* ========================================================== */
          /*                 ADMIN DASHBOARD VIEW                       */
          /* ========================================================== */
          !isAdminAuthenticated ? (
            <div className="bg-[#0e0921] border-2 border-neon-pink p-8 rounded-3xl max-w-sm mx-auto my-12 text-center space-y-6 shadow-2xl relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[8px] font-mono text-neon-pink">
                <span className="w-1.5 h-1.5 bg-neon-pink rounded-full animate-ping" />
                SECURE ACCESS REQUIRED
              </div>
              <div className="space-y-2 mt-2">
                <div className="w-12 h-12 rounded-full bg-neon-pink/15 border border-neon-pink flex items-center justify-center mx-auto text-neon-pink">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">CONSOLLE DI SICUREZZA</h3>
                <p className="text-[10px] font-mono text-gray-400">Inserisci il codice di sblocco a 4 cifre per autenticare lo stato di Amministratore</p>
              </div>

              {/* Character display */}
              <div className="bg-black/80 border border-white/15 p-4 rounded-xl font-mono text-2xl tracking-widest text-center h-16 flex items-center justify-center text-neon-cyan neon-text-cyan">
                {adminPinInput ? "• ".repeat(adminPinInput.length) + "_".repeat(4 - adminPinInput.length) : "____"}
              </div>

              {/* Simulated numeric keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto select-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      if (adminPinInput.length < 4) {
                        setAdminPinInput(prev => prev + num);
                      }
                    }}
                    className="py-2.5 bg-[#171032] hover:bg-[#251b47] active:scale-95 text-white font-mono font-bold text-sm rounded-lg border border-white/5 transition-all cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAdminPinInput("")}
                  className="py-2.5 bg-red-950/45 hover:bg-red-900/40 text-[10px] text-red-400 font-mono font-bold rounded-lg border border-red-500/20 cursor-pointer"
                >
                  DELETE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (adminPinInput.length < 4) {
                      setAdminPinInput(prev => prev + "0");
                    }
                  }}
                  className="py-2.5 bg-[#171032] hover:bg-[#251b47] active:scale-95 text-white font-mono font-bold text-sm rounded-lg border border-white/5 transition-all cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (adminPinInput === "0000") {
                      setIsAdminAuthenticated(true);
                      triggerNotification("CONSOLLE SBLOCCATA. BENVENUTO AMMINISTRATORE!");
                    } else {
                      setAdminPinInput("");
                      triggerNotification("CODICE ERRATO! ACCESSO NEGATO.");
                    }
                  }}
                  className="py-2.5 bg-emerald-950/45 hover:bg-emerald-800/40 text-[10px] text-emerald-400 font-mono font-bold rounded-lg border border-emerald-500/20 cursor-pointer"
                >
                  ENTER
                </button>
              </div>

              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveView("fan")}
                  className="text-[10px] font-mono font-bold text-gray-500 hover:text-white uppercase transition-colors"
                >
                  ← Torna al Portale Pubblico
                </button>
              </div>
            </div>
          ) : (
            <AdminConsole
              news={news}
              blog={blog}
              bookings={bookings}
              adminStatus={adminStatus}
              onPublishNews={handlePublishNews}
              onPublishBlogThread={handlePublishBlogThread}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
              onBack={() => {
                setActiveView("fan");
              }}
            />
          )

        )}

        {/* Footer info segment bar */}
        <footer id="footer" className="flex flex-col md:flex-row justify-between items-center z-10 pt-6 mt-12 border-t border-white/10 gap-4 text-center">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold opacity-75 uppercase text-gray-400">VCN Satellite Network: Connesso</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold opacity-75 uppercase text-gray-400">Server Status: Live in Leonida State</span>
            </div>
          </div>

          <div className="text-[9px] opacity-40 font-mono tracking-tighter max-w-sm leading-relaxed text-center">
            VICE CITY NEWS NON È IN ALCUN MODO AFFILIATO A ROCKSTAR GAMES O TAKE-TWO INTERACTIVE • EST. 2026
          </div>

          {/* Toggle View Controller Button */}
          <div>
            {activeView === "fan" ? (
              <button
                onClick={() => setActiveView("admin")}
                className="bg-white/10 hover:bg-neon-pink hover:text-white px-4 py-2 border border-white/10 rounded-xl text-[10px] font-mono font-black italic cursor-pointer transition-all uppercase tracking-wider"
              >
                🔐 ACCEDI A DASHBOARD GESTIONALE
              </button>
            ) : (
              <button
                onClick={() => setActiveView("fan")}
                className="bg-neon-pink text-white px-4 py-2 rounded-xl text-[10px] font-mono font-black italic cursor-pointer transition-all uppercase tracking-wider shadow-lg shadow-pink-500/10"
              >
                🏝️ TORNA A VICE HUB PUBBLICO
              </button>
            )}
          </div>
        </footer>

      </div>

      {/* Floating Call to Action on Mobile */}
      {activeView === "fan" && !bookingSuccessTicket && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-gradient-to-r from-neon-pink via-[#bf5af2] to-neon-cyan p-[1.5px] rounded-2xl shadow-2xl shadow-pink-500/30">
          <button
            onClick={() => handleNavigateToTab("preorder", "booking-party")}
            className="w-full bg-black hover:bg-neutral-900 py-3 px-4 rounded-[14.5px] flex items-center justify-between text-xs font-mono font-black uppercase text-white animate-pulse"
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-neon-pink" />
              <span>🎫 RITIRO 15% SCONTO GARANTITO</span>
            </span>
            <span className="text-neon-cyan select-none tracking-widest font-black animate-ping text-[10px]">PRENOTA →</span>
          </button>
        </div>
      )}
    </div>
  );
}
