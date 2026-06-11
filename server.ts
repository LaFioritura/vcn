import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Path definitions for persistence
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const NEWS_FILE = path.join(DATA_DIR, "news.json");
const BLOG_FILE = path.join(DATA_DIR, "blog.json");

// Helper for atomic file reading & writing
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Ensure pre-populated data looks absolutely amazing and retro-humorous
const defaultNews = [
  {
    id: "news-1",
    title: "Rockstar Games conferma la finestra di rilascio di GTA 6!",
    content: "Il comunicato ufficiale di Take-Two fissa la data di uscita ufficiale per l'autunno del 2025. I fan di tutto il mondo stanno già calcolando i giorni, le ore e i secondi. Noi di Vice City News abbiamo attivato il contatore assoluto per non farvi perdere neanche un battito di questa folle attesa!",
    date: "2026-06-10",
    category: "Ufficiale",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80",
    badge: "ROCKSTAR APPROVED",
    views: 4890
  },
  {
    id: "news-2",
    title: "LEAK: Analisi dettagliata della mappa di Leonida. Grandezza record!",
    content: "Analisti indipendenti e appassionati di cartografia digitale hanno assemblato i frammenti dei leak e delle coordinate del promo, revealing che lo Stato di Leonida sarà circa 3.2 volte più grande di Los Santos (GTA 5). Include paludi sterminate sul modello delle Everglades, tre aeroporti principali, e ben 60 sobborghi satellite intorno a Vice City portando l'immersività a livelli inauditi.",
    date: "2026-06-08",
    category: "Rumor & Leak",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
    badge: "94% CREDIBILE",
    views: 12431
  },
  {
    id: "news-3",
    title: "ANNUNCIO SOCIAL: Midnight Release Party ufficiale di Vice City News!",
    content: "Ancora non conosci la venue esatta? Stiamo finalizzando la location segreta a tema neon tropicale! Quello che sappiamo è che la sera antecedente al rilascio a mezzanotte, ci ritroveremo tutti per celebrare il capolavoro. Saranno distribuite le prime copie fisiche in assoluto a costo ridotto (15% di sconto sul prezzo ufficiale), gadget personalizzati VCN, cocktail neon stile Malibu Club e fiumi di musica synthwave anni '80. Prenota ora il ritiro della tua copia fisica al party compilando il form in homepage per garantirti il ticket d'accesso prioritario!",
    date: "2026-06-11",
    category: "Evento & Party",
    imageUrl: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=1200&auto=format&fit=crop&q=80",
    badge: "REGISTRAZIONI APERTE",
    views: 954
  }
];

const defaultBlog = [
  {
    id: "blog-1",
    title: "La teoria dell'agente sotto copertura: Lucia è davvero un poliziotto?",
    author: "NerdGamer_99",
    content: "Se guardiamo attentamente la scena del trailer in cui Lucia e Jason compiono la rapina, notiamo una forte asimmetria nella postura. Inoltre, l'immagine chiave di lei in manette in un carcere statale all'inizio potrebbe essere un flashback di un inserimento andato male. E se la storia di fiducia e tradimento vertesse proprio sul dilemma morale di dover arrestare l'uomo che ama? Ne parliamo qui sotto!",
    likes: 134,
    comments: [
      { nickname: "SpeedyGonzales", comment: "Caspita, questo spiegherebbe perché Rockstar insiste tanto sulla fiducia nel trailer!", date: "2026-06-11" },
      { nickname: "Tommy_V_Back", comment: "Mi ricorda molto la dinamica di coppie criminali storiche, sarebbe pazzesco avere finali multipli in base a chi tradisce chi.", date: "2026-06-11" }
    ],
    date: "2026-06-09"
  },
  {
    id: "blog-2",
    title: "Midnight Launch Party: perché non puoi assolutamente mancare!",
    author: "Reporter_VCN",
    content: "Trovare copie fisiche scontate il primo giorno è utopia pura nel mercato odierno. Abbiamo stretto partnership con distributori indipendenti di altissimo livello per premiare i veri fan. Chi prenota online il ritiro fisico sul nostro portale riceverà una borsa gadget esclusiva di Vice City News (adesivi neon, t-shirt, spilla da collezione) e l'ingresso prioritario al party. Sarà la notte nerd del decennio!",
    likes: 89,
    comments: [
      { nickname: "GtaFanatic", comment: "Ho prenotato il mio ritiro fisico ora! Non vedo l'ora, speriamo riveliate presto la location!", date: "2026-06-11" }
    ],
    date: "2026-06-11"
  }
];

const defaultBookings = [
  {
    id: "pt-8371",
    name: "Tommy Vercetti Jr.",
    email: "tommy.young@malibu-club.com",
    edition: "Deluxe Retro Edition",
    platform: "PS5",
    badgeEarned: "Vice Legend",
    discountPercent: 15,
    status: "Approvato",
    timestamp: "2026-06-11T05:32:00Z",
    notes: "Non vede l'ora di bere un cocktail tropicale!"
  },
  {
    id: "pt-2934",
    name: "Ken Rosenberg III",
    email: "ken.law@leonida-courts.org",
    edition: "Standard Neon Steelbook",
    platform: "Xbox Series X",
    badgeEarned: "Trivia Champion",
    discountPercent: 12,
    status: "In Attesa",
    timestamp: "2026-06-11T05:48:10Z",
    notes: "Chiede se ci sarà un avvocato reperibile la notte del party."
  }
];

// Initialize JSON files if empty or non-existent
if (!fs.existsSync(NEWS_FILE)) writeJsonFile(NEWS_FILE, defaultNews);
if (!fs.existsSync(BLOG_FILE)) writeJsonFile(BLOG_FILE, defaultBlog);
if (!fs.existsSync(BOOKINGS_FILE)) writeJsonFile(BOOKINGS_FILE, defaultBookings);

// Expose API routes
app.get("/api/news", (req, res) => {
  const news = readJsonFile(NEWS_FILE, defaultNews);
  res.json(news);
});

app.post("/api/news", (req, res) => {
  const news = readJsonFile(NEWS_FILE, defaultNews);
  const newPost = {
    id: "news-" + Date.now(),
    title: req.body.title || "Notizia senza titolo",
    content: req.body.content || "",
    category: req.body.category || "Generale",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500",
    badge: req.body.badge || "NUOVO",
    date: new Date().toISOString().split("T")[0],
    views: 1
  };
  news.unshift(newPost);
  writeJsonFile(NEWS_FILE, news);
  res.json(newPost);
});

// Blog routes
app.get("/api/blog", (req, res) => {
  const blog = readJsonFile(BLOG_FILE, defaultBlog);
  res.json(blog);
});

app.post("/api/blog", (req, res) => {
  const blog = readJsonFile(BLOG_FILE, defaultBlog);
  const newBlog = {
    id: "blog-" + Date.now(),
    title: req.body.title || "Discussione senza titolo",
    author: req.body.author || "Fan_Anonimo",
    content: req.body.content || "",
    likes: 0,
    comments: [],
    date: new Date().toISOString().split("T")[0]
  };
  blog.unshift(newBlog);
  writeJsonFile(BLOG_FILE, blog);
  res.json(newBlog);
});

app.post("/api/blog/:id/comment", (req, res) => {
  const blog = readJsonFile(BLOG_FILE, defaultBlog);
  const { id } = req.params;
  const { nickname, comment } = req.body;
  
  const post = blog.find(b => b.id === id);
  if (post) {
    const newComment = {
      nickname: nickname || "Anonimo",
      comment: comment || "",
      date: new Date().toISOString().split("T")[0]
    };
    post.comments.push(newComment);
    writeJsonFile(BLOG_FILE, blog);
    res.json(post);
  } else {
    res.status(404).json({ error: "Post non trovato" });
  }
});

app.post("/api/blog/:id/like", (req, res) => {
  const blog = readJsonFile(BLOG_FILE, defaultBlog);
  const { id } = req.params;
  const post = blog.find(b => b.id === id);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    writeJsonFile(BLOG_FILE, blog);
    res.json(post);
  } else {
    res.status(404).json({ error: "Post non trovato" });
  }
});

// Reservation/Booking routes
app.get("/api/bookings", (req, res) => {
  const bookings = readJsonFile(BOOKINGS_FILE, defaultBookings);
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const bookings = readJsonFile(BOOKINGS_FILE, defaultBookings);
  const { name, email, platform, edition, badgeEarned, discountPercent, notes, plateText, plateStyle } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "I campi Nome ed Email sono obbligatori!" });
  }
  
  const ticketId = "PT-" + Math.floor(1000 + Math.random() * 9000);
  const newBooking = {
    id: ticketId.toLowerCase(),
    name,
    email,
    platform: platform || "PS5",
    edition: edition || "Standard Neon Steelbook",
    badgeEarned: badgeEarned || "Hype Follower",
    discountPercent: discountPercent || 15,
    status: "Approvato", // Instantly approved to make the flow satisfying and prompt!
    timestamp: new Date().toISOString(),
    notes: notes || "",
    plateText: plateText || "VICE NY",
    plateStyle: plateStyle || "vice"
  };
  
  bookings.unshift(newBooking);
  writeJsonFile(BOOKINGS_FILE, bookings);
  res.json(newBooking);
});

app.post("/api/bookings/:id/status", (req, res) => {
  const bookings = readJsonFile(BOOKINGS_FILE, defaultBookings);
  const { id } = req.params;
  const { status } = req.body;
  const booking = bookings.find(b => b.id.toLowerCase() === id.toLowerCase());
  if (booking) {
    booking.status = status;
    writeJsonFile(BOOKINGS_FILE, bookings);
    res.json(booking);
  } else {
    res.status(404).json({ error: "Prenotazione non trovata" });
  }
});

app.delete("/api/bookings/:id", (req, res) => {
  const bookings = readJsonFile(BOOKINGS_FILE, defaultBookings);
  const { id } = req.params;
  const filtered = bookings.filter(b => b.id.toLowerCase() !== id.toLowerCase());
  if (filtered.length < bookings.length) {
    writeJsonFile(BOOKINGS_FILE, filtered);
    res.json({ success: true, message: "Prenotazione eliminata" });
  } else {
    res.status(404).json({ error: "Prenotazione non trovata" });
  }
});

// Admin analytics endpoint
app.get("/api/status", (req, res) => {
  const bookings = readJsonFile(BOOKINGS_FILE, defaultBookings);
  const news = readJsonFile(NEWS_FILE, defaultNews);
  
  const totalBooked = bookings.length;
  const ps5Count = bookings.filter(b => b.platform === "PS5").length;
  const xboxCount = bookings.filter(b => b.platform === "Xbox Series X").length;
  const pcCount = bookings.filter(b => b.platform === "PC").length;
  
  // Calculate potential earnings or discount counts
  const triviaChampions = bookings.filter(b => b.badgeEarned === "Trivia Champion").length;
  
  res.json({
    totalBooked,
    platforms: { ps5: ps5Count, xbox: xboxCount, pc: pcCount },
    triviaChampions,
    newsCount: news.length
  });
});

// Server-side AI Rumor/Leak Analyzer endpoint using `@google/genai`
app.post("/api/analyze-leak", async (req, res) => {
  const { leakText } = req.body;
  if (!leakText || leakText.trim().length === 0) {
    return res.status(400).json({ error: "Nessun leak inserito da analizzare!" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Let's implement beautiful fallback analysis if key is missing or not configured
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Elegant deterministic comedic analysis simulating real analyzer
    const mockAnalyses = [
      {
        rating: 12,
        reviewerName: "Gary 'The Cop' Henderson - Leonida County Sheriff Detective",
        comment: "Questo pseudo-leak odora di fandonia da chilometri. I dettagli sulla rapina dell'elicottero non coincidono con i budget delle nostre forze sul campo. Probabilmente è stato scritto da un ragazzino in arresto domiciliare a Vice Beach. Voto: Altamente improbabile.",
        label: "SPAZZATURA TOTALE",
        neonColor: "from-red-500 to-red-800",
        advice: "Faresti meglio a registrarti per la physical pickup list della serata reale per rincuorarti!"
      },
      {
        rating: 87,
        reviewerName: "Zack 'Neon' Rider - Vice City Speculator & Leaker Pro",
        comment: "Aspetta un secondo... il riferimento alle targhe elettroniche e agli uragani in tempo reale quadra al millimetro con i depositi brevettuali di Rockstar del 2024! Questa potrebbe essere una descrizione rubata a un dipendente del QA. Il mio contatore di hype si è surriscaldato!",
        label: "PRATICAMENTE REALE",
        neonColor: "from-green-500 to-emerald-800",
        advice: "Un leak così merita di essere festeggiato sfidando te stesso a sbloccare il badge 'Trivia Champion' in homepage e prenotare un ritiro scontato per la serata dello show!"
      },
      {
        rating: 50,
        reviewerName: "Gloria Martinez - VCN Vice Editor-in-Chief",
        comment: "Metà di queste informazioni sono riciclate da vecchi post di Reddit del 2022, ma l'altra metà sui ritrovi delle gang nel cuore delle paludi ha dettagli geografici spaventosamente specifici. Rockstar ci sta spiando o noi stiamo spiando loro? Voto medio: Rumor di mezza estate.",
        label: "NEBULOSO / METÀ REALE",
        neonColor: "from-amber-500 to-amber-800",
        advice: "Nel dubbio, le notizie reali le distribuiamo noi la sera della release con uno sconto da brividi. Riserva il tuo posto prima che la capienza si esaurisca."
      }
    ];

    const chosen = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
    // Add minor variation based on string length to make it look responsive
    let index = Math.abs(leakText.length) % mockAnalyses.length;
    const finalMock = mockAnalyses[index];

    return res.json({
      success: true,
      aiAnalysis: {
        score: finalMock.rating,
        reviewer: finalMock.reviewerName,
        verdict: finalMock.comment,
        classification: finalMock.label,
        colorTheme: finalMock.neonColor,
        proTip: finalMock.advice,
        mode: "Simulated Vice Detective (Attiva le chiavi in Secrets per sbloccare l'AI di Gemini!)"
      }
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemPrompt = `Sei l'analista dei segreti e dei rumor di Vice City News, un giornalista nerd e divertente, appassionato di gta 6 e dell'estetica tropicale neon anni 80.
Il tuo compito è analizzare il testo di un presunto rumor o leak su GTA 6 inserito dall'utente.
Devi rispondere ESCLUSIVAMENTE con un oggetto JSON valido (senza blocchi markdown \`\`\` o scritte esterne) contenente i seguenti campi:
- score: un numero intero tra 0 e 100 che rappresenta il grado di credibilità e hype.
- reviewer: una firma simpatica (es. "L'Infiltrato di Washington", "Gary il detective", "Zack dei Forum Neon").
- verdict: una divertente recensione sardonica e critica, scritta in ottimo italiano goliardico, che analizza il rumor se ha senso, se è inventato di sana pianta o se ha elementi attendibili.
- classification: un'etichetta di 2-3 parole (es: "SPAZZATURA ASSOLUTA", "POTENZIALE BOMBA", "DELIRIO DI FINISYSTER", "PROFEZIA DIVINA").
- colorTheme: due classi di gradient Tailwind per il badge (es: "from-pink-500 to-rose-700", "from-cyan-400 to-blue-600", "from-amber-500 to-yellow-600").
- proTip: un consiglio ironico che reindirizza l'utente a prenotare il proprio biglietto di ritiro del videogioco per festeggiare all'evento neon pre-lancio per dimenticare i brutti rumor o festeggiare quelli veri.

Usa solo italiano, sii creativo, nerd ed epico. Non aggiungere frasi prima o dopo il JSON.`;

    const userPrompt = `Analizza questo leak: "${leakText}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: systemPrompt },
        { text: userPrompt }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const textOutput = response.text || "{}";
    const cleanedOutput = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const resultJson = JSON.parse(cleanedOutput);

    return res.json({
      success: true,
      aiAnalysis: {
        score: resultJson.score ?? 50,
        reviewer: resultJson.reviewer ?? "Redazione Leonida Speculazioni",
        verdict: resultJson.verdict ?? "Il leak si muove in zone liminali, ma la chimica è alta.",
        classification: resultJson.classification ?? "STIMA INCERTA",
        colorTheme: resultJson.colorTheme ?? "from-purple-500 to-indigo-700",
        proTip: resultJson.proTip ?? "Vieni a festeggiare la verità al party pre-release della mezzanotte!",
        mode: "Gemini 3.5 AI Driven"
      }
    });

  } catch (err: any) {
    console.error("Gemini analysis error:", err?.message || err);
    // Silent failover to a charming, realistic layout so the user always has a sublime experience
    return res.json({
      success: true,
      aiAnalysis: {
        score: 68,
        reviewer: "Gloria Martinez - Vice City News Reporter",
        verdict: `[AI Fallback] Il leak propone tesi avvincenti ma la commissione di controllo della Leonida District ritiene gran parte dei dati classificati. Il testo contiene tracce di verità frammiste a puro hype per Vice City.`,
        classification: "FANTASIOSO MA POSSIBILE",
        colorTheme: "from-fuchsia-500 to-pink-700",
        proTip: "Non stare sulle spine: prenota la tua copia fisica garantita per l'evento reale e vieni a scambiare speculazioni di persona ad alto tasso di adrenalina!",
        mode: "Offline Speculation Solver"
      }
    });
  }
});

// Vite configuration and asset serving handles
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Vite production static assets path integrated.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vice City News Hub running at http://localhost:${PORT}`);
  });
}

startServer();
