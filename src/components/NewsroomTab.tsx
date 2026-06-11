import React from "react";
import { Flame } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import RadioPlayer from "./RadioPlayer";
import MediaGallery from "./MediaGallery";
import { NewsPost } from "../types";

interface NewsroomTabProps {
  news: NewsPost[];
  onNavigateToTab?: (tabId: "newsroom" | "preorder" | "radar" | "chat", targetElementId?: string) => void;
}

export default function NewsroomTab({ news, onNavigateToTab }: NewsroomTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Launch Countdown Banner */}
      <CountdownTimer onNavigateToTab={onNavigateToTab} />

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Live Radio and Trailers (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <RadioPlayer />
          <MediaGallery onNavigateToTab={onNavigateToTab} />
        </div>

        {/* Right Side: Official Bulletin updates (Col 7) */}
        <div className="lg:col-span-7 bg-[#110c24]/90 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 text-left">
              <Flame className="w-5 h-5 text-neon-pink animate-pulse" />
              <h3 className="text-lg font-display font-extrabold text-white uppercase italic tracking-tight">
                LATEST BULLETIN NEWS
              </h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-5 max-h-[850px] overflow-y-auto pr-1">
            {news.length === 0 ? (
              <p className="text-xs text-center text-gray-500 py-10 font-mono">Nessun bollettino pubblicato attualmente.</p>
            ) : (
              news.map((item) => (
                <div key={item.id} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:border-neon-cyan/20 transition-all flex flex-col">
                  <div className="aspect-video relative bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="bg-neon-pink text-white text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded border border-white/10">
                        {item.category}
                      </span>
                      <span className="bg-black/80 text-neon-cyan text-[8px] font-mono px-2 py-0.5 rounded border border-[#00ffff]/20">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                      <span>📅 INVIATO IL {item.date}</span>
                      <span>👁️ {item.views} LETTURE</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight hover:text-neon-cyan transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans line-clamp-3">
                      {item.content}
                    </p>
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
