import React, { useState, useEffect } from "react";
import { Star, Award, ChevronRight, CheckCircle2, XCircle, Volume2, ShieldAlert, Trophy, HelpCircle } from "lucide-react";
import { TriviaQuestion } from "../types";

// Dynamic sound generator using standard Web Audio API - no external assets required!
const playAudioFeedback = (type: "select" | "correct" | "wrong" | "complete") => {
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
      // Short retro click synth
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "correct") {
      // Retro chime cascade
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.08);
      osc.frequency.setValueAtTime(659, now + 0.16);
      osc.frequency.setValueAtTime(880, now + 0.24);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "wrong") {
      // Low buzz sound
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "complete") {
      // Victory digital fan-fare!
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.65);
    }
  } catch (err) {
    // Audio Context blocked by browser autoplay rules
  }
};

// Expanded master catalog of trivia questions
const ALL_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 1,
    question: "Chi canta il brano 'Love Is a Long Road' del primo, incredibile trailer ufficiale di GTA VI?",
    options: ["Phil Collins", "Tom Petty", "Duran Duran", "Lana Del Rey"],
    correctAnswer: 1,
    hint: "È una leggenda del rock della Florida nativa, tristemente scomparso nel 2017."
  },
  {
    id: 2,
    question: "Qual era la celebre emittente pop capitanata dall'esuberante Toni in GTA Vice City?",
    options: ["K-Chat", "Wave 103", "Flash FM", "Emotion 98.3"],
    correctAnswer: 2,
    hint: "Ha come frequenza ufficiale 105.1 FM e suona le migliori hit degli anni '80."
  },
  {
    id: 3,
    question: "Qual è il nome ufficiale dello Stato ispirato alla Florida in cui giocheremo a GTA VI?",
    options: ["San Andreas", "Leonida", "Alderney", "Vice State"],
    correctAnswer: 1,
    hint: "Deriva dal navigatore ed esploratore storico spagnolo Juan Ponce de León."
  },
  {
    id: 4,
    question: "Quante visualizzazioni record ha accumulato il primo trailer di GTA VI nelle prime 24 ore su YouTube?",
    options: ["Circa 45 milioni", "Oltre 93 milioni", "Esattamente 12 milioni", "Oltre 200 milioni"],
    correctAnswer: 1,
    hint: "È diventato il video non musicale più visto di sempre al debutto su YouTube!"
  },
  {
    id: 5,
    question: "Quale bizzarra gang rurale con aeroscafi è emersa dai leak storici del 2022 nelle Everglades?",
    options: ["Vance Raiders", "ThrillBilly Club", "The Swamp Lords", "Gator Boys"],
    correctAnswer: 1,
    hint: "Amano correre nel fango e sono noti per camicie a quadri e barbecue folli."
  },
  {
    id: 6,
    question: "Che cognome porta Lucia, la co-protagonista femminile introdotta nella storia di Leonida?",
    options: ["Lopez", "Mercer", "Nessun cognome ufficiale rivelato", "Vercetti"],
    correctAnswer: 2,
    hint: "Rockstar ha mantenuto il mistero. Finora nessun documento ha svelato il suo cognome ufficiale!"
  }
];

interface TriviaZoneProps {
  currentStars: number;
  onStarsUpdate: (stars: number) => void;
  onSuccessBadge: (badge: string) => void;
}

export default function TriviaZone({ currentStars, onStarsUpdate, onSuccessBadge }: TriviaZoneProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [shakeWanted, setShakeWanted] = useState(false);

  // Initialize and shuffle questions pool on mount
  useEffect(() => {
    // Draw 3 random unique questions from dataset
    const shuffled = [...ALL_TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 3));
  }, []);

  const question = questions[currentQuestionIdx];

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    playAudioFeedback("select");
    setSelectedOption(optionIdx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswered || !question) return;
    
    setIsAnswered(true);
    const isCorrect = selectedOption === question.correctAnswer;
    
    if (isCorrect) {
      playAudioFeedback("correct");
      setScore((s) => s + 1);
      // Increase stars count
      const nextStar = Math.min(5, currentStars + 1);
      onStarsUpdate(nextStar);
    } else {
      playAudioFeedback("wrong");
      // Trigger visually engaging shake vibration on red star panel
      setShakeWanted(true);
      setTimeout(() => setShakeWanted(false), 500);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((i) => i + 1);
    } else {
      // Trivia session successfully finalized
      playAudioFeedback("complete");
      setCompleted(true);
      if (score >= 2) {
        onSuccessBadge("Trivia Champion");
        onStarsUpdate(5); // Maximum level gives best prices!
      } else {
        onSuccessBadge("Vice Explorer");
      }
    }
  };

  const handleRetry = () => {
    const freshShuffled = [...ALL_TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestions(freshShuffled.slice(0, 3));
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setScore(0);
    setCompleted(false);
    onStarsUpdate(2); // Restart from basic loyalty stars
  };

  if (questions.length === 0 || !question) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#15102a] border border-neon-pink/30 rounded-3xl p-6 text-center text-xs text-gray-500">
        Caricamento pool quiz...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#15102a] border-2 border-neon-pink/40 rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-pink-500/5 transition-all">
      {/* Visual background sun flare aura */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-neon-pink/15 opacity-60 rounded-full blur-2xl pointer-events-none" />

      {/* Audio volume indicator to suggest soundness */}
      <div className="absolute top-6 right-6 hidden sm:flex items-center gap-1 text-[8px] font-mono text-gray-600">
        <Volume2 className="w-3.5 h-3.5 text-neon-pink" /> AUDIO AUTO_ACTIVE
      </div>

      {/* Gamified Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 border-b border-white/5 pb-3">
        <div>
          <span className="text-[9px] uppercase font-mono text-neon-pink tracking-widest font-black block">
            STREET CREDIBILITY CHALLENGE
          </span>
          <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tight">
            TRIVIA DI LEONIDA
          </h3>
        </div>

        {/* Dynamic Interactive Wanted Stars HUD Tracker */}
        <div className={`flex flex-col items-end shrink-0 ${shakeWanted ? 'animate-bounce border-red-500 bg-red-950/20' : ''}`}>
          <div className="flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 shadow-lg select-none">
            <span className="text-[8px] font-mono text-gray-400 mr-2 uppercase">WANTED:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  s <= currentStars
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)] animate-pulse"
                    : "text-gray-700 opacity-40"
                }`}
              />
            ))}
          </div>
          <span className="text-[7.5px] font-mono text-gray-400 mt-1 uppercase text-right">
            Sconto copia: <strong className="text-neon-cyan">{currentStars >= 5 ? "15%" : "10%"}</strong>
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-neon-cyan font-bold">
                PROVA {currentQuestionIdx + 1} DI {questions.length}
              </span>
              <span className="text-gray-400 uppercase">RISPOSTE ESATTE: {score}</span>
            </div>

            <div className="bg-black/35 rounded-2xl p-4 border border-white/5">
              <p className="text-sm font-bold text-white leading-relaxed">
                {question.question}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20";
                
                if (isAnswered) {
                  if (idx === question.correctAnswer) {
                    optionStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold";
                  } else if (isSelected) {
                    optionStyle = "bg-red-950/40 border-red-500 text-red-300";
                  } else {
                    optionStyle = "bg-black/40 border-white/5 text-gray-500 opacity-50";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-neon-pink/25 border-neon-pink text-white font-extrabold scale-[1.015] shadow-lg shadow-pink-500/5";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer select-none ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === question.correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && idx !== question.correctAnswer && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {/* Secret Hint toggle board */}
            {showHint ? (
              <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-500/20 text-[10px] font-mono text-gray-300 leading-relaxed flex items-start gap-1">
                <HelpCircle className="w-4 h-4 text-neon-pink shrink-0" />
                <div>
                  <span className="text-neon-pink font-bold uppercase">AIUTO DETECTIVE:</span> {question.hint}
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  playAudioFeedback("select");
                  setShowHint(true);
                }}
                className="text-[9px] font-mono text-gray-500 hover:text-white cursor-pointer select-none transition-colors underline block"
              >
                Rivela suggerimento d'intelligence della strada
              </button>
            )}

            {/* Submitting controller buttons */}
            <div className="flex gap-2">
              {!isAnswered ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="w-full bg-[#ff00cc] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-extrabold uppercase text-xs py-3.5 rounded-xl cursor-pointer select-none tracking-widest hover:brightness-110 active:scale-98 transition-all"
                >
                  Conferma Scelta
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full bg-[#00ffff] text-black font-extrabold uppercase text-xs py-3.5 rounded-xl cursor-pointer select-none tracking-widest flex items-center justify-center gap-1 hover:brightness-110 active:scale-98 transition-all"
                >
                  {currentQuestionIdx < questions.length - 1 ? "Procedi" : "Rapporto Finale"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* HIGHEST VALUATION VIP CERTIFICATION PASS CARD */
        <div className="flex-1 flex flex-col justify-between items-center text-center space-y-4 py-2">
          
          <div className="w-full max-w-sm bg-black/60 border border-yellow-500/40 p-5 rounded-2xl relative overflow-hidden space-y-3 shadow-2xl">
            {/* Angled holographic badge corner banner */}
            <div className="absolute top-0 right-0 w-24 h-6 bg-yellow-500/20 text-[7px] font-bold text-yellow-400 flex items-center justify-center rotate-45 translate-x-7 translate-y-3 uppercase tracking-widest">
              CERTIFIED
            </div>

            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center mx-auto animate-bounce">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-display font-black text-white uppercase italic tracking-tight">
                {score >= 2 ? "ACCESSO OUTLAW CERTIFICATO" : "SORVEGLIATO SPECIALE!"}
              </h4>
              <p className="text-[8px] font-mono text-yellow-500 uppercase tracking-widest">
                VERDETTO RANGO: {score >= 2 ? "LEONIDA ELITE VIP" : "VICE SUSPECTED"}
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Hai centrato <strong className="text-neon-cyan font-mono">{score} su 3</strong> quesiti.
              {score >= 2 ? (
                <span> Ottima stima! Sblocchi il badge <strong className="text-yellow-400">⚡ TRIVIA CHAMPION</strong> che ti dà diritto al <strong className="text-neon-pink">15% DI SCONTO</strong> sulla copia fisica del gioco al party di mezzanotte, borsa gadget premium!</span>
              ) : (
                <span> Livello sospetto. Non hai racimolato abbastanza stima nei blog locali. Riprova per sbloccare la borsa gadget esclusiva e l'ammontare massimo dello sconto!</span>
              )}
            </p>

            <div className="flex justify-between items-center pt-2.5 border-t border-white/5 font-mono text-[9px] text-gray-400">
              <span>SBLOCCATO VALORE: {score >= 2 ? "15% DISCOUNT" : "10% DISCOUNT"}</span>
              <span className="text-neon-pink">ID: VCN_TICKET_{Math.floor(Math.random() * 9000 + 1000)}</span>
            </div>
          </div>

          <div className="w-full flex gap-2">
            <button
              onClick={handleRetry}
              className="w-1/2 bg-gray-950 border border-white/10 hover:border-white/20 text-white text-[10px] py-3 font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Sfida Di Nuovo
            </button>
            <button
              onClick={() => {
                const form = document.getElementById("booking-party");
                if (form) form.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-1/2 bg-gradient-to-r from-neon-pink to-purple-600 text-white text-[10px] py-3 font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:neon-border-pink flex items-center justify-center gap-1 shadow-lg shadow-pink-500/15"
            >
              Compila il Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
