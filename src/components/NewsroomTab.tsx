import React from "react";
import { Flame, MessageSquare, Heart, Rss, ArrowUpRight } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import RadioPlayer from "./RadioPlayer";
import MediaGallery from "./MediaGallery";
import { NewsPost, BlogPost } from "../types";

interface NewsroomTabProps {
  news: NewsPost[];
  blog: BlogPost[];
  onNavigateToTab?: (tabId: "newsroom" | "preorder" | "radar" | "chat", targetElementId?: string) => void;
}

// Map beautiful GTA Vice-city lookalike presets to individual blogs
const getBlogImage = (id: string, index: number) => {
  const images = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80", // Neon pink/purple synth retro gaming street
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&auto=format&fit=crop&q=80", // Classic sport car against sunset neon
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80", // Tropical vaporwave beach palm tree skyline
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80"  // Retro future night city grids
  ];
  return images[index % images.length];
};

export default function NewsroomTab({ news, blog, onNavigateToTab }: NewsroomTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Launch Countdown Banner */}
      <CountdownTimer onNavigateToTab={onNavigateToTab} />

      {/* Modern 3-Column Immersive Grid Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: Live Audio Transmitter and Art Gallery (Col 4) */}
        <div className="xl:col-span-4 space-y-6">
          <RadioPlayer />
          <MediaGallery onNavigateToTab={onNavigateToTab} />
        </div>

        {/* COLUMN 2: Official Bulletin News Updates (Col 4) */}
        <div className="xl:col-span-4 bg-[#110c24]/90 border border-white/10 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 text-left">
              <Flame className="w-4 h-4 text-neon-pink animate-pulse" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                📢 BOLLETTINO LIVE UFFICIALE
              </h3>
            </div>
            <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              ONLINE
            </span>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1">
            {news.length === 0 ? (
              <p className="text-xs text-center text-gray-500 py-10 font-mono">Nessun bollettino pubblicato attualmente.</p>
            ) : (
              news.map((item) => (
                <div key={item.id} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:border-neon-cyan/20 transition-all flex flex-col group/news">
                  <div className="aspect-video relative bg-slate-900 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/news:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="bg-neon-pink text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border border-white/10">
                        {item.category}
                      </span>
                      <span className="bg-black/85 text-neon-cyan text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-[#00ffff]/20">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-400">
                      <span>📅 INVIATO IL {item.date}</span>
                      <span>👁️ {item.views} LETTURE</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight group-hover/news:text-neon-cyan transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-[10.5px] text-gray-300 leading-relaxed font-sans line-clamp-3">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: Public Automated Live Community Blog & Forums (Col 4) */}
        <div className="xl:col-span-4 bg-[#140e2b]/95 border border-[#a855f7]/30 rounded-3xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 text-left">
              <Rss className="w-4 h-4 text-[#a855f7] animate-pulse" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                💬 FORUM LIVE POST & DISCUSSIDNI
              </h3>
            </div>
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab("chat")}
              className="text-[9px] font-mono text-[#a855f7] hover:text-white transition-all flex items-center gap-0.5 uppercase font-bold"
            >
              SCRIVI ↗
            </button>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1">
            {blog.length === 0 ? (
              <p className="text-xs text-center text-gray-500 py-10 font-mono">Nessuna discussione caricata nel blog.</p>
            ) : (
              blog.map((post, idx) => (
                <div 
                  key={post.id} 
                  className="bg-black/45 border border-white/5 rounded-2xl overflow-hidden hover:border-[#a855f7]/40 transition-all flex flex-col group/blog cursor-pointer"
                  onClick={() => onNavigateToTab?.("chat")}
                >
                  <div className="aspect-video relative bg-slate-900 overflow-hidden">
                    <img
                      src={getBlogImage(post.id, idx)}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/blog:scale-103 transition-transform duration-500 opacity-80 group-hover/blog:opacity-100"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-purple-950/90 text-purple-200 text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-purple-500/20 flex items-center gap-1">
                        <MessageSquare className="w-2.5 h-2.5 text-purple-400" />
                        DISCUSSIONE ATTIVA
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-400">
                      <span>👤 @{post.author}</span>
                      <span>📅 {post.date}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight group-hover/blog:text-[#a855f7] transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h4>

                    <p className="text-[10.5px] text-gray-300 leading-relaxed font-sans line-clamp-3">
                      {post.content}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5 text-pink-500">
                          <Heart className="w-3 h-3 fill-pink-500/10" /> {post.likes}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="flex items-center gap-0.5 text-purple-400">
                          <MessageSquare className="w-3 h-3" /> {post.comments?.length || 0} risposte-fan
                        </span>
                      </div>
                      <span className="text-[#a855f7] group-hover/blog:translate-x-0.5 transition-transform flex items-center">
                        LEGGI TUTTO <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
