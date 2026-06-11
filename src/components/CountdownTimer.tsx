import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Flame, Sparkles } from "lucide-react";

interface CountdownTimerProps {
  onNavigateToTab?: (tabId: "newsroom" | "preorder" | "radar" | "chat", targetElementId?: string) => void;
}

export default function CountdownTimer({ onNavigateToTab }: CountdownTimerProps) {
  const targetDate = new Date("2026-11-18T21:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isExpired: true }));
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleActionClick = (targetId: string) => {
    if (onNavigateToTab) {
      onNavigateToTab("preorder", targetId);
    } else {
      scrollToSection(targetId);
    }
  };

  const padZero = (num: number) => String(num).padStart(2, "0");

  const timeBlocks = [
    { label: "GIORNI", value: padZero(timeLeft.days), id: "cd-days" },
    { label: "ORE", value: padZero(timeLeft.hours), id: "cd-hours" },
    { label: "MINUTI", value: padZero(timeLeft.minutes), id: "cd-mins" },
    { label: "SECONDI", value: padZero(timeLeft.seconds), id: "cd-secs" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-purple-900/10 to-transparent p-6 sm:p-10 border border-neon-pink/30 rounded-3xl backdrop-blur-md shadow-2xl">
      {/* Abstract neon glow behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neon-pink/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-pink/15 border border-neon-pink/40 text-neon-pink text-xs font-mono font-bold tracking-widest rounded-full uppercase">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            COUNTDOWN DI RILASCIO UFFICIALE GTA VI
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-neon-cyan leading-tight uppercase">
            VICE CITY BLOCK PARTY <br className="hidden sm:inline" />
            18-19 NOVEMBRE 2026
          </h2>
          <p className="text-gray-300 max-w-md text-sm sm:text-base leading-relaxed">
            Riserva il tuo ticket d'ingresso esclusivo per la notte del lancio e assicurati una delle pochissime copie fisiche disponibili per il ritiro a mezzanotte con sconti pazzeschi calcolati in base alla tua conoscenza di Vice City!
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 border border-gray-800 bg-gray-950/50 px-3 py-1.5 rounded-md font-mono">
              <Calendar className="w-3.5 h-3.5 text-neon-cyan" /> NOTTE TRA 18 E 19 NOV 2026
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 border border-gray-800 bg-gray-950/50 px-3 py-1.5 rounded-md font-mono">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> LOCK-IN MEZZANOTTE LIVE
            </span>
          </div>
        </div>

        {/* Digital LCD Clock Grid */}
        <div className="w-full max-w-lg space-y-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {timeBlocks.map((block, i) => (
              <div
                key={block.label}
                id={block.id}
                className="flex flex-col items-center p-3 sm:p-5 rounded-2xl bg-[#0f0a21]/90 border border-neon-cyan/20 group hover:border-neon-pink/40 transition-colors"
              >
                <div className="relative">
                  {/* Faded background LCD characters */}
                  <span className="absolute inset-0 select-none font-mono font-bold text-gray-950 text-2xl sm:text-4xl md:text-5xl tracking-widest leading-none text-center opacity-10">
                    88
                  </span>
                  <motion.span
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    key={block.value}
                    className="relative font-mono font-bold text-neon-pink neon-text-pink text-2xl sm:text-4xl md:text-5xl tracking-widest leading-none"
                  >
                    {block.value}
                  </motion.span>
                </div>
                <span className="mt-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#a855f7] opacity-80 group-hover:text-neon-cyan transition-colors">
                  {block.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleActionClick("booking-party")}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-neon-pink to-purple-600 hover:scale-103 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-pink-500/10 cursor-pointer select-none border-t border-white/20 hover:neon-border-pink transition-all"
            >
              PRENOTA RITIRO DISCO AL PARTY
            </button>
            <button
              onClick={() => handleActionClick("trivia-zone")}
              className="px-6 py-3.5 bg-gray-950 hover:bg-[#1a1236] border border-neon-cyan/30 text-neon-cyan text-sm font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer select-none transition-all"
            >
              SBLOCCA PASS SCONTI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
