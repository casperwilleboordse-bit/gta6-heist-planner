import { useState } from "react";

const C = {
  coral:"#FF6B47", orange:"#FF9A3C", pink:"#FF3CAC",
  teal:"#00C9B1", sky:"#4ECDC4", navy:"#0A0F1E",
  sand:"#F5E6D3", gold:"#FFD166",
  dimText:"rgba(245,230,211,0.45)", mutText:"rgba(245,230,211,0.25)",
  border:"rgba(255,255,255,0.08)",
};

const QUESTIONS = [
  {
    id:1, category:"🌴 Setting",
    q:"Hoe heet de fictieve staat waar GTA 6 zich afspeelt?",
    options:["Vice City","San Andreas","Leonida","Carcer City"],
    correct:2,
    explanation:"GTA 6 speelt in de staat Leonida, gebaseerd op Florida. Vice City (gebaseerd op Miami) is de grootste stad erin.",
  },
  {
    id:2, category:"👥 Protagonisten",
    q:"Hoe heet de vrouwelijke protagonist van GTA 6 — de eerste ooit in de franchise?",
    options:["Lisa","Lucia","Luna","Lara"],
    correct:1,
    explanation:"Lucia is de eerste vrouwelijke hoofdpersonage in een mainline GTA-game. Samen met Jason vormt ze een Bonnie & Clyde-duo.",
  },
  {
    id:3, category:"⭐ Gameplay",
    q:"Hoeveel sterren telt het vernieuwde wanted systeem in GTA 6?",
    options:["4 sterren","5 sterren","6 sterren","7 sterren"],
    correct:2,
    explanation:"GTA 6 introduceert een zes-sterren wanted systeem — een upgrade op de vijf sterren uit GTA 5.",
  },
  {
    id:4, category:"🗓️ Release",
    q:"Op welke datum komt GTA 6 officieel uit?",
    options:["26 mei 2026","19 november 2026","15 september 2026","1 december 2026"],
    correct:1,
    explanation:"Na twee delays is 19 november 2026 de definitieve releasedatum voor PS5 en Xbox Series X|S.",
  },
  {
    id:5, category:"🎬 Netflix",
    q:"Hoe lang was de 'GTA VI: An Extended Look' showcase op Netflix?",
    options:["10 minuten","26 minuten","45 minuten","1 uur"],
    correct:1,
    explanation:"De showcase duurde precies 26 minuten en was volledig gefilmd op een basis PS5.",
  },
  {
    id:6, category:"🗺️ Leonida",
    q:"Welke van deze locaties is NIET bevestigd in GTA 6?",
    options:["Port Gellhorn","Ambrosia","Liberty City","Mount Kalaga"],
    correct:2,
    explanation:"Liberty City (gebaseerd op New York) is de setting van GTA 4, niet GTA 6. Leonida heeft Port Gellhorn, Ambrosia en Mount Kalaga als bevestigde locaties.",
  },
  {
    id:7, category:"⚡ Abilities",
    q:"Wat is Jason's speciale ability in GTA 6?",
    options:["Onzichtbaarheid","Slow-motion die vijandelijke zwakke punten target","Snellere sprint","Extra pantsering"],
    correct:1,
    explanation:"Jason heeft een slow-motion ability gericht op zwakke punten van vijanden. Lucia heeft een single-shot slow-motion variant.",
  },
  {
    id:8, category:"📦 Pre-order",
    q:"Wat kost de standaard editie van GTA 6 in de VS?",
    options:["$59.99","$69.99","$79.99","$89.99"],
    correct:2,
    explanation:"GTA 6 kost $79.99 voor de standaard editie. De Ultimate Edition is $99.99.",
  },
  {
    id:9, category:"🏙️ Vice City",
    q:"Hoe groot is Vice City in GTA 6 vergeleken met Los Santos in GTA 5?",
    options:["Even groot","Twee keer zo groot","Drie keer zo groot","Kleiner"],
    correct:1,
    explanation:"Rockstar heeft bevestigd dat Vice City alleen al ongeveer twee keer zo groot is als Los Santos in GTA 5.",
  },
  {
    id:10, category:"🎮 Platforms",
    q:"Op welke platforms komt GTA 6 uit bij launch?",
    options:["PS5, Xbox Series X|S en PC","PS5 en Xbox Series X|S","PS5, Xbox Series X|S, PS4 en Xbox One","Alleen PS5"],
    correct:1,
    explanation:"GTA 6 is een current-gen exclusive voor PS5 en Xbox Series X|S. PC wordt later verwacht maar is nog niet bevestigd.",
  },
];

const MEDALS = [
  { min:9,  label:"VICE CITY LEGEND",    icon:"🏆", color:C.gold,   desc:"Je weet alles over GTA 6. Rockstar zou je moeten inhuren." },
  { min:7,  label:"HEIST SPECIALIST",    icon:"🎯", color:C.teal,   desc:"Sterke kennis. Je bent klaar voor dag 1." },
  { min:5,  label:"STREET HUSTLER",      icon:"💪", color:C.orange, desc:"Niet slecht. Kijk de Netflix showcase nog een keer." },
  { min:3,  label:"FRESH FISH",          icon:"🐟", color:C.sky,    desc:"Je hebt nog veel te leren over Leonida." },
  { min:0,  label:"WANTED: CLUELESS",    icon:"⭐", color:C.coral,  desc:"Heb je wel eens van GTA gehoord?" },
];

function PanelTitle({ children }) {
  return (
    <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:10, letterSpacing:4, fontWeight:700, textTransform:"uppercase", color:C.coral, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ width:2, height:10, background:C.coral }} />{children}
    </div>
  );
}

export default function Quiz() {
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState({});
  const [revealed, setRevealed] = useState(false);
  const [done, setDone]         = useState(false);
  const [copied, setCopied]     = useState(false);

  const q = QUESTIONS[current];
  const selectedAnswer = answers[q?.id];
  const score = Object.entries(answers).filter(([id, ans]) => {
    const question = QUESTIONS.find(x => x.id === Number(id));
    return question && ans === question.correct;
  }).length;

  const medal = MEDALS.find(m => score >= m.min);

  const handleAnswer = (idx) => {
    if (revealed) return;
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
    setRevealed(true);
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setRevealed(false);
    } else {
      setDone(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setAnswers({}); setRevealed(false); setDone(false);
  };

  const shareText = () =>
    `🎮 GTA 6 Quiz op ViceBot.gg\n${medal?.icon} ${medal?.label}\nScore: ${score}/10\n\nJij ook? → vicebot.gg`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  if (done) return (
    <div className="fade-in">
      <PanelTitle>Resultaat — Netflix Extended Look Quiz</PanelTitle>

      {/* Score card */}
      <div style={{ background:`${medal?.color}10`, border:`1px solid ${medal?.color}30`, borderTop:`3px solid ${medal?.color}`, padding:"28px 24px", textAlign:"center", marginBottom:16 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>{medal?.icon}</div>
        <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:"clamp(22px,5vw,34px)", fontWeight:900, letterSpacing:3, color:medal?.color, marginBottom:6 }}>{medal?.label}</div>
        <div style={{ fontSize:13, color:C.dimText, marginBottom:16 }}>{medal?.desc}</div>
        <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:"clamp(40px,8vw,64px)", color:"#fff", lineHeight:1, letterSpacing:2 }}>
          {score}<span style={{ fontSize:"0.5em", color:C.dimText }}>/{QUESTIONS.length}</span>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
        {QUESTIONS.map((question, i) => {
          const ans = answers[question.id];
          const correct = ans === question.correct;
          return (
            <div key={question.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"rgba(255,255,255,0.02)", border:`1px solid ${correct ? C.teal+"44" : C.coral+"44"}`, borderLeft:`3px solid ${correct ? C.teal : C.coral}` }}>
              <div style={{ fontSize:14 }}>{correct ? "✅" : "❌"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:C.dimText, marginBottom:1 }}>{question.category}</div>
                <div style={{ fontSize:11, color:"rgba(245,230,211,0.6)" }}>{question.q}</div>
              </div>
              <div style={{ fontSize:10, color: correct ? C.teal : C.coral, fontWeight:700, fontFamily:"'Barlow Condensed',Impact,sans-serif", letterSpacing:1, flexShrink:0 }}>
                {correct ? "GOED" : `ANT: ${question.options[question.correct]}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={handleRestart} style={{ flex:1, padding:"12px", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, color:C.dimText, cursor:"pointer", fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, letterSpacing:2, fontWeight:700 }}>
          ↺ OPNIEUW
        </button>
        <button onClick={handleCopy} style={{ flex:2, padding:"12px", background: copied ? `${C.teal}22` : `linear-gradient(90deg,${C.coral},${C.pink})`, border:"none", color:"#fff", cursor:"pointer", fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:13, letterSpacing:2, fontWeight:700, boxShadow: copied ? "none" : `0 2px 16px ${C.coral}44`, transition:"all 0.2s" }}>
          {copied ? "✓ GEKOPIEERD" : "◆ DEEL SCORE"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <PanelTitle>GTA 6 Netflix Extended Look Quiz</PanelTitle>

      {/* Progress */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.mutText, marginBottom:6 }}>
          <span style={{ letterSpacing:2 }}>VRAAG {current+1} VAN {QUESTIONS.length}</span>
          <span style={{ color:C.teal }}>{score} correct</span>
        </div>
        <div style={{ height:3, background:"rgba(255,255,255,0.07)" }}>
          <div style={{ height:"100%", width:`${((current+1)/QUESTIONS.length)*100}%`, background:`linear-gradient(90deg,${C.coral},${C.pink})`, transition:"width 0.4s ease" }} />
        </div>
        <div style={{ display:"flex", gap:3, marginTop:6 }}>
          {QUESTIONS.map((_, i) => {
            const ans = answers[QUESTIONS[i].id];
            const isAnswered = ans !== undefined;
            const isCorrect = isAnswered && ans === QUESTIONS[i].correct;
            return (
              <div key={i} style={{ flex:1, height:3, borderRadius:1, background: i === current ? C.orange : isAnswered ? (isCorrect ? C.teal : C.coral) : "rgba(255,255,255,0.07)", transition:"background 0.3s" }} />
            );
          })}
        </div>
      </div>

      {/* Question card */}
      <div style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderTop:`2px solid ${C.orange}`, padding:"20px", marginBottom:14 }}>
        <div style={{ fontSize:11, color:C.orange, letterSpacing:2, fontWeight:700, marginBottom:10, fontFamily:"'Barlow Condensed',Impact,sans-serif" }}>{q.category}</div>
        <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:"clamp(16px,3vw,22px)", fontWeight:800, color:"#fff", lineHeight:1.3 }}>{q.q}</div>
      </div>

      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
        {q.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect  = idx === q.correct;
          let bg = "rgba(255,255,255,0.02)";
          let border = C.border;
          let textColor = C.dimText;
          if (revealed) {
            if (isCorrect)                    { bg = `${C.teal}18`;  border = C.teal;  textColor="#fff"; }
            else if (isSelected && !isCorrect){ bg = `${C.coral}18`; border = C.coral; textColor="#fff"; }
          } else if (isSelected) {
            bg = `${C.orange}18`; border = C.orange; textColor="#fff";
          }

          return (
            <div key={idx} onClick={() => handleAnswer(idx)} style={{
              border:`1px solid ${border}`, borderLeft:`3px solid ${revealed && isCorrect ? C.teal : revealed && isSelected && !isCorrect ? C.coral : "transparent"}`,
              background:bg, padding:"12px 16px", cursor: revealed ? "default" : "pointer",
              display:"flex", alignItems:"center", gap:12, transition:"all 0.15s ease",
            }}>
              <div style={{ width:24, height:24, border:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, fontWeight:700, color:textColor }}>
                {revealed ? (isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65+idx)) : String.fromCharCode(65+idx)}
              </div>
              <div style={{ fontSize:13, color:textColor, fontWeight: revealed && isCorrect ? 600 : 400 }}>{opt}</div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className="fade-in" style={{ background:`${selectedAnswer === q.correct ? C.teal : C.coral}0D`, border:`1px solid ${selectedAnswer === q.correct ? C.teal : C.coral}33`, padding:"12px 14px", marginBottom:14 }}>
          <div style={{ fontSize:9, letterSpacing:3, color: selectedAnswer === q.correct ? C.teal : C.coral, fontWeight:700, marginBottom:6, fontFamily:"'Barlow Condensed',Impact,sans-serif" }}>
            {selectedAnswer === q.correct ? "✓ CORRECT" : "✗ FOUT"} — UITLEG
          </div>
          <div style={{ fontSize:13, color:C.dimText, lineHeight:1.7 }}>{q.explanation}</div>
        </div>
      )}

      {/* Next button */}
      {revealed && (
        <button onClick={handleNext} className="fade-in" style={{
          width:"100%", padding:"13px", border:"none",
          background:`linear-gradient(90deg,${C.coral},${C.pink})`,
          color:"#fff", cursor:"pointer", fontFamily:"'Barlow Condensed',Impact,sans-serif",
          fontSize:14, fontWeight:800, letterSpacing:3,
          boxShadow:`0 4px 20px ${C.coral}44`,
        }}>
          {current < QUESTIONS.length-1 ? "VOLGENDE VRAAG →" : "BEKIJK RESULTAAT →"}
        </button>
      )}
    </div>
  );
}
