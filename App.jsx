import { useState } from "react";
import TierList from "./TierList.jsx";
import Quiz from "./Quiz.jsx";

const C = {
  coral:   "#FF6B47",
  orange:  "#FF9A3C",
  pink:    "#FF3CAC",
  teal:    "#00C9B1",
  sky:     "#4ECDC4",
  navy:    "#0A0F1E",
  sand:    "#F5E6D3",
  gold:    "#FFD166",
  dimText: "rgba(245,230,211,0.45)",
  mutText: "rgba(245,230,211,0.25)",
  border:  "rgba(255,255,255,0.08)",
};

const HEISTS = [
  { id:"bank",      short:"NATIONAL BANK",     base:2400000, diff:3, color:C.gold,   icon:"🏦", desc:"Vice City centrum. Zwaarst beveiligd." },
  { id:"casino",    short:"STARDUST CASINO",    base:1800000, diff:2, color:C.pink,   icon:"🎰", desc:"Ocean Drive, Vice City. Goede risk/reward." },
  { id:"yacht",     short:"EL RUBIO YACHT",     base:1100000, diff:1, color:C.teal,   icon:"⛵", desc:"Leonida Keys. Offshore, lagere bewaking." },
  { id:"transport", short:"ARMORED TRANSPORT",  base:650000,  diff:1, color:C.sky,    icon:"🚛", desc:"Leonida snelweg. Snel en minimale planning." },
];

const APPROACHES = [
  { id:"stealth",    label:"STEALTH",    icon:"👁",  riskMod:0.28, payoutMod:1.25, color:C.teal,   desc:"Geen alarm = +25% bonus" },
  { id:"smart",      label:"SMART",      icon:"⚡",  riskMod:0.52, payoutMod:1.10, color:C.orange, desc:"Flexibel in het veld" },
  { id:"aggressive", label:"AGGRESSIVE", icon:"💥",  riskMod:0.83, payoutMod:1.15, color:C.coral,  desc:"Guns blazing. Hoog risico." },
];

const ALL_CREW = [
  { id:"h3", role:"hacker", name:"Ghost",   tier:"ELITE",  cut:15, skill:95, bonus:"+120s vault", col:C.teal   },
  { id:"h2", role:"hacker", name:"Paige",   tier:"GOED",   cut:9,  skill:72, bonus:"+60s vault",  col:C.sky    },
  { id:"h1", role:"hacker", name:"Rickie",  tier:"BUDGET", cut:3,  skill:38, bonus:"+20s vault",  col:"#6B7280"},
  { id:"g3", role:"gunman", name:"Chef",    tier:"ELITE",  cut:12, skill:95, bonus:"Mil. gear",   col:C.coral  },
  { id:"g2", role:"gunman", name:"Packie",  tier:"GOED",   cut:8,  skill:68, bonus:"Zware wapens",col:C.orange },
  { id:"g1", role:"gunman", name:"Norm",    tier:"BUDGET", cut:7,  skill:32, bonus:"Std. gear",   col:"#6B7280"},
  { id:"d3", role:"driver", name:"Taliana", tier:"ELITE",  cut:7,  skill:95, bonus:"Geen schade", col:C.teal   },
  { id:"d2", role:"driver", name:"Karim",   tier:"GOED",   cut:8,  skill:62, bonus:"Lichte schade",col:C.sky   },
  { id:"d1", role:"driver", name:"Eddie",   tier:"BUDGET", cut:6,  skill:28, bonus:"Hoog risico", col:"#6B7280"},
];

const VEHICLES = [
  { id:"kuruma",    name:"Armored Kuruma", icon:"🚗", spd:80,  arm:95,  stl:30, tags:["aggressive","smart"]  },
  { id:"maverick",  name:"Maverick Heli",  icon:"🚁", spd:100, arm:35,  stl:45, tags:["smart","aggressive"]  },
  { id:"schnee",    name:"Schnee Hauler",  icon:"🚛", spd:40,  arm:70,  stl:92, tags:["stealth","smart"]     },
  { id:"speedo",    name:"Speedo Custom",  icon:"🚐", spd:55,  arm:48,  stl:88, tags:["stealth"]             },
  { id:"insurgent", name:"Insurgent",      icon:"🛻", spd:58,  arm:100, stl:8,  tags:["aggressive"]          },
];

function calc(heist, approach, crew, vehicle, guards, cameras) {
  const h = HEISTS.find(x => x.id === heist);
  const a = APPROACHES.find(x => x.id === approach);
  const members = ["hacker","gunman","driver"].map(r => ALL_CREW.find(c => c.id === crew[r]));
  const totalCut = members.reduce((s, m) => s + (m?.cut || 0), 0);
  const avgSkill = members.reduce((s, m) => s + (m?.skill || 50), 0) / 3;
  const v = VEHICLES.find(x => x.id === vehicle);
  const net = Math.round(
    h.base * a.payoutMod *
    (v?.tags.includes(approach) ? 1.05 : 1) *
    (1 - (guards-1)*0.04) *
    (approach==="stealth" ? 1-(cameras-1)*0.03 : 1) *
    (1 - totalCut/100)
  );
  const risk = Math.min(99, Math.round((a.riskMod + (100-avgSkill)/300 + (guards-1)*0.04)*100));
  return { net, risk, totalCut, avgSkill: Math.round(avgSkill) };
}

// ── Mini components ──────────────────────────────────────────────────────────

function MiamiBar({ style = {} }) {
  return <div style={{ height: 2, background: `linear-gradient(90deg,${C.coral},${C.orange},${C.pink},${C.coral})`, backgroundSize:"300%", animation:"miamiShift 4s ease infinite", ...style }} />;
}

function PanelTitle({ children }) {
  return (
    <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:10, letterSpacing:4, fontWeight:700, textTransform:"uppercase", color:C.coral, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ width:2, height:10, background:C.coral }} />{children}
    </div>
  );
}

function StatBar({ label, value, color, suffix="" }) {
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.dimText, marginBottom:3 }}>
        <span style={{ letterSpacing:1, textTransform:"uppercase" }}>{label}</span>
        <span style={{ color, fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:13 }}>{value}{suffix}</span>
      </div>
      <div style={{ height:2, background:"rgba(255,255,255,0.07)" }}>
        <div style={{ height:"100%", width:`${Math.min(value,100)}%`, background:color, transition:"width 0.5s cubic-bezier(0.34,1.2,0.64,1)" }} />
      </div>
    </div>
  );
}

function SelectCard({ selected, color, onClick, children }) {
  return (
    <div onClick={onClick} style={{
      border:`1px solid ${selected ? color : "rgba(255,255,255,0.06)"}`,
      borderLeft:`3px solid ${selected ? color : "transparent"}`,
      background: selected ? `linear-gradient(90deg,${color}14,transparent)` : "rgba(255,255,255,0.02)",
      padding:"10px 12px", cursor:"pointer", marginBottom:6, transition:"all 0.15s ease",
    }}>
      {children}
    </div>
  );
}

const GtaSlider = ({ label, value, min, max, onChange, color }) => (
  <div style={{ marginBottom:18 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
      <span style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:C.dimText }}>{label}</span>
      <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:20, color, lineHeight:1 }}>{value}</span>
    </div>
    <input type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width:"100%", accentColor:color, cursor:"pointer" }}
    />
    <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:C.mutText, marginTop:2 }}>
      <span>{min}</span><span>{max}</span>
    </div>
  </div>
);


export default function App() {
  const [activeTab, setActiveTab] = useState("planner");
  const [heist,    setHeist]    = useState("bank");
  const [approach, setApproach] = useState("stealth");
  const [crew,     setCrew]     = useState({ hacker:"h3", gunman:"g3", driver:"d3" });
  const [vehicle,  setVehicle]  = useState("schnee");
  const [guards,   setGuards]   = useState(3);
  const [cameras,  setCameras]  = useState(3);
  const [maxRisk,  setMaxRisk]  = useState(40);
  const [optMsg,   setOptMsg]   = useState("");
  const [copied,   setCopied]   = useState(false);
  // Mobile: which section is open in accordion
  const [openSection, setOpenSection] = useState("heist");

  const r = calc(heist, approach, crew, vehicle, guards, cameras);
  const riskCol = r.risk > 65 ? C.coral : r.risk > 35 ? C.orange : C.teal;
  const selApproach = APPROACHES.find(a => a.id === approach);
  const selHeist    = HEISTS.find(h => h.id === heist);

  const crewOf = (role) => ALL_CREW.find(c => c.id === crew[role]);

  // Tactisch advies: berekend, geen API nodig
  const tips = (() => {
    const out = [];
    const v = VEHICLES.find(x => x.id === vehicle);
    const g = crewOf("gunman"), h = crewOf("hacker");
    if (r.risk > 65) out.push({ icon:"⚠️", text:`Risico staat op ${r.risk}%. Haal bewakers omlaag of kies een rustigere aanpak.` });
    if (approach === "stealth" && cameras >= 5) out.push({ icon:"⚠️", text:`${cameras} camera's kosten je ${Math.round((cameras-1)*3)}% payout bij Stealth. Met minder camera's wordt dit je beste aanpak.` });
    if (approach === "aggressive" && g?.skill < 60) out.push({ icon:"⚠️", text:`${g.name} is te zwak voor een Aggressive aanpak. Neem Packie of Chef.` });
    if (v && !v.tags.includes(approach)) {
      const better = VEHICLES.filter(x => x.tags.includes(approach)).map(x => x.name).join(" of ");
      out.push({ icon:"🎯", text:`${v.name} past niet bij ${selApproach?.label}. Kies ${better} voor +5% payout.` });
    }
    if (h?.tier === "BUDGET" && selHeist?.diff >= 3) out.push({ icon:"⚠️", text:`Een budget-hacker op ${selHeist.short} is vragen om problemen.` });
    if (r.totalCut >= 30) out.push({ icon:"💰", text:`Je crew neemt ${r.totalCut}% van de payout. Probeer de optimalisatie hieronder voor de beste balans.` });
    if (out.length === 0) out.push({ icon:"✅", text:"Solide plan. Geen directe zwakke plekken gevonden." });
    return out.slice(0, 4);
  })();

  // Zoekt de combinatie met de hoogste payout binnen je risicolimiet
  const optimize = () => {
    let best = null;
    for (const a of APPROACHES) for (const v of VEHICLES)
      for (const hk of ALL_CREW.filter(c => c.role === "hacker"))
      for (const gm of ALL_CREW.filter(c => c.role === "gunman"))
      for (const dr of ALL_CREW.filter(c => c.role === "driver")) {
        const res = calc(heist, a.id, { hacker:hk.id, gunman:gm.id, driver:dr.id }, v.id, guards, cameras);
        if (res.risk <= maxRisk && (!best || res.net > best.res.net)) best = { a, v, hk, gm, dr, res };
      }
    if (!best) { setOptMsg(`Geen plan mogelijk met risico ≤ ${maxRisk}% bij ${guards} bewakers. Verhoog de limiet of verlaag het aantal bewakers.`); return; }
    setApproach(best.a.id); setVehicle(best.v.id);
    setCrew({ hacker:best.hk.id, gunman:best.gm.id, driver:best.dr.id });
    setOptMsg(`Beste plan gevonden: $${best.res.net.toLocaleString()} bij ${best.res.risk}% risico.`);
  };

  const planText = () =>
    `🎯 Mijn GTA 6 heist plan\nDoelwit: ${selHeist?.short} · Aanpak: ${selApproach?.label}\nCrew: ${["hacker","gunman","driver"].map(x => crewOf(x)?.name).join(" / ")}\nVoertuig: ${VEHICLES.find(x => x.id === vehicle)?.name}\nPayout: $${r.net.toLocaleString()} · Risico: ${r.risk}%\n\nPlan jouw eigen heist → ${typeof window !== "undefined" ? window.location.origin : ""}`;

  const copyPlan = () => {
    navigator.clipboard.writeText(planText()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // Accordion section for mobile
  const Section = ({ id, title, children }) => {
    const isOpen = openSection === id;
    return (
      <div style={{ border:`1px solid ${C.border}`, borderTop:`2px solid ${isOpen ? C.coral : "rgba(255,255,255,0.06)"}`, background:"rgba(10,15,30,0.9)", marginBottom:8 }}>
        <div onClick={() => setOpenSection(isOpen ? null : id)} style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
          <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, letterSpacing:3, color: isOpen ? C.coral : C.dimText, fontWeight:700 }}>{title}</div>
          <div style={{ color: isOpen ? C.coral : C.mutText, fontSize:16, transition:"transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</div>
        </div>
        {isOpen && <div style={{ padding:"0 16px 16px" }}>{children}</div>}
      </div>
    );
  };

  const HeistPicker = () => (
    <>
      {HEISTS.map(h => (
        <SelectCard key={h.id} selected={heist===h.id} color={h.color} onClick={() => setHeist(h.id)}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18 }}>{h.icon}</span>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:13, fontWeight:700, letterSpacing:1, color: heist===h.id ? "#fff" : C.dimText }}>{h.short}</div>
                <div style={{ fontSize:10, color:C.mutText }}>{h.desc}</div>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:14, color:h.color }}>${(h.base/1e6).toFixed(1)}M</div>
              <div style={{ display:"flex", gap:2, justifyContent:"flex-end", marginTop:3 }}>
                {[1,2,3].map(i => <div key={i} style={{ width:8, height:2, background: i<=h.diff ? h.color : "rgba(255,255,255,0.1)" }} />)}
              </div>
            </div>
          </div>
        </SelectCard>
      ))}
    </>
  );

  const ApproachPicker = () => (
    <>
      {APPROACHES.map(a => (
        <SelectCard key={a.id} selected={approach===a.id} color={a.color} onClick={() => setApproach(a.id)}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, background: approach===a.id ? `${a.color}22` : "rgba(255,255,255,0.04)", border:`1px solid ${approach===a.id ? a.color : "rgba(255,255,255,0.08)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{a.icon}</div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:14, fontWeight:800, letterSpacing:2, color: approach===a.id ? a.color : C.dimText }}>{a.label}</div>
                <div style={{ fontSize:10, color:C.mutText }}>{a.desc}</div>
              </div>
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:15, color:C.teal }}>+{Math.round((a.payoutMod-1)*100)}%</div>
          </div>
        </SelectCard>
      ))}
    </>
  );

  const CrewPicker = () => (
    <>
      {[
        { role:"hacker", label:"HACKER" },
        { role:"gunman", label:"GUNMAN" },
        { role:"driver", label:"DRIVER" },
      ].map(({ role, label }) => (
        <div key={role} style={{ marginBottom:16 }}>
          <div style={{ fontSize:9, letterSpacing:4, color:C.mutText, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:16, height:1, background:C.coral }} />{label}
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {ALL_CREW.filter(c => c.role===role).map(m => (
              <div key={m.id} onClick={() => setCrew(p => ({...p,[role]:m.id}))} style={{
                flex:1, border:`1px solid ${crew[role]===m.id ? m.col : "rgba(255,255,255,0.06)"}`,
                borderBottom:`2px solid ${crew[role]===m.id ? m.col : "transparent"}`,
                background: crew[role]===m.id ? `${m.col}14` : "rgba(255,255,255,0.02)",
                padding:"10px 6px", cursor:"pointer", transition:"all 0.15s ease", textAlign:"center",
              }}>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, fontWeight:800, color: crew[role]===m.id ? "#fff" : C.dimText, marginBottom:2 }}>{m.name}</div>
                <div style={{ fontSize:9, color:m.col, letterSpacing:1, marginBottom:5 }}>{m.tier}</div>
                <div style={{ height:2, background:"rgba(255,255,255,0.07)", marginBottom:4 }}>
                  <div style={{ height:"100%", width:`${m.skill}%`, background:m.col }} />
                </div>
                <div style={{ fontSize:8, color:C.mutText }}>{m.bonus}</div>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, color:C.coral, marginTop:3 }}>{m.cut}%</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  const VehiclePicker = () => (
    <>
      {VEHICLES.map(v => {
        const rec = v.tags.includes(approach);
        const sel = vehicle===v.id;
        return (
          <SelectCard key={v.id} selected={sel} color={rec ? C.teal : C.coral} onClick={() => setVehicle(v.id)}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{v.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, fontWeight:700, letterSpacing:1, color: sel ? "#fff" : C.dimText }}>{v.name}</span>
                  {rec && <span style={{ fontSize:8, background:`${C.teal}22`, color:C.teal, padding:"1px 5px", fontWeight:700, letterSpacing:1 }}>REC</span>}
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {[["SPD",v.spd,C.sky],["ARM",v.arm,C.coral],["STL",v.stl,C.pink]].map(([lbl,val,col]) => (
                    <div key={lbl} style={{ flex:1 }}>
                      <div style={{ height:2, background:"rgba(255,255,255,0.06)", marginBottom:2 }}>
                        <div style={{ height:"100%", width:`${val}%`, background:col }} />
                      </div>
                      <div style={{ fontSize:8, color:C.mutText, letterSpacing:1 }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SelectCard>
        );
      })}
    </>
  );

  const ResultPanel = () => (
    <>
      {/* Payout hero */}
      <div style={{ background:`${C.teal}08`, border:`1px solid ${C.teal}22`, borderTop:`2px solid ${C.teal}`, padding:"16px", textAlign:"center", marginBottom:12 }}>
        <div style={{ fontSize:9, letterSpacing:4, color:C.mutText, textTransform:"uppercase", marginBottom:6 }}>Netto Payout</div>
        <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:"clamp(32px,8vw,52px)", fontWeight:900, fontStyle:"italic", letterSpacing:2, lineHeight:1, color:C.teal, textShadow:`0 0 30px ${C.teal}66` }}>
          ${r.net.toLocaleString()}
        </div>
        <div style={{ fontSize:10, color:C.mutText, marginTop:6 }}>{selHeist?.short} · {selApproach?.label}</div>
        <MiamiBar style={{ margin:"12px 0 0" }} />
      </div>

      <StatBar label="Risico" value={r.risk} color={riskCol} suffix="%" />
      <StatBar label="Crew kwaliteit" value={r.avgSkill} color={C.pink} suffix="/100" />
      <StatBar label="Bewakers impact" value={Math.round((guards-1)*14.3)} color={C.orange} suffix="%" />

      {/* Crew summary */}
      <div style={{ marginTop:14, marginBottom:14, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
        <PanelTitle>Crew Breakdown</PanelTitle>
        {["hacker","gunman","driver"].map(role => {
          const m = ALL_CREW.find(c => c.id===crew[role]);
          return (
            <div key={role} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:2, height:16, background:m?.col }} />
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:13, fontWeight:700 }}>{m?.name}</div>
                  <div style={{ fontSize:9, color:C.mutText, letterSpacing:1 }}>{role.toUpperCase()} · {m?.tier}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ fontSize:10, color:C.dimText }}>skill {m?.skill}</div>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:15, color:C.coral }}>{m?.cut}%</div>
              </div>
            </div>
          );
        })}
        <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, fontSize:10 }}>
          <span style={{ color:C.mutText, letterSpacing:1 }}>TOTALE CUT</span>
          <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:16, color:C.coral }}>{r.totalCut}%</span>
        </div>
      </div>

      {/* Tactisch advies */}
      <div style={{ background:`${C.pink}08`, border:`1px solid ${C.pink}22`, borderLeft:`2px solid ${C.pink}`, padding:"12px 14px", marginBottom:12 }}>
        <div style={{ fontSize:9, letterSpacing:3, color:C.pink, marginBottom:8, fontWeight:700 }}>TACTISCH ADVIES</div>
        {tips.map((t, i) => (
          <div key={i} style={{ fontSize:12.5, lineHeight:1.6, color:C.sand, marginBottom:6, display:"flex", gap:8 }}>
            <span>{t.icon}</span><span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Optimalisatie */}
      <div style={{ border:`1px solid ${C.border}`, borderTop:`2px solid ${C.teal}`, padding:"12px 14px", marginBottom:12 }}>
        <div style={{ fontSize:9, letterSpacing:3, color:C.teal, marginBottom:10, fontWeight:700 }}>AUTO-OPTIMALISEER</div>
        <GtaSlider label="Max risico" value={maxRisk} min={10} max={90} onChange={setMaxRisk} color={C.teal} />
        <button onClick={optimize} style={{
          width:"100%", padding:"12px", border:"none", cursor:"pointer",
          background:`linear-gradient(90deg,${C.teal},${C.sky})`, color:C.navy,
          fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:14, fontWeight:800, letterSpacing:3,
        }}>◆ VIND BESTE PLAN</button>
        {optMsg && <div style={{ fontSize:11.5, color:C.dimText, marginTop:8, lineHeight:1.5 }}>{optMsg}</div>}
      </div>

      {/* Delen */}
      <button onClick={copyPlan} style={{
        width:"100%", padding:"13px", border:"none", cursor:"pointer", marginBottom:10,
        background: copied ? `${C.teal}22` : `linear-gradient(90deg,${C.coral},${C.pink})`, color:"#fff",
        fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:14, fontWeight:800, letterSpacing:3,
        boxShadow: copied ? "none" : `0 4px 20px ${C.coral}44`,
      }}>{copied ? "✓ PLAN GEKOPIEERD" : "◆ DEEL MIJN PLAN"}</button>

      <div style={{ fontSize:10, color:C.mutText, lineHeight:1.6 }}>
        Onofficiële fan-tool, niet gelieerd aan Rockstar Games of Take-Two. Heists, crew en cijfers zijn fictief (gebaseerd op GTA Online) en niet bevestigd voor GTA 6.
      </div>
    </>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.navy, fontFamily:"'Barlow','Segoe UI',sans-serif", color:C.sand }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { overflow-x: hidden; }
        @keyframes miamiShift { 0%{background-position:0%} 50%{background-position:100%} 100%{background-position:0%} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dot-grid { background-image: radial-gradient(circle,rgba(255,107,71,0.1) 1px,transparent 1px); background-size:24px 24px; }
        input[type=range] { -webkit-appearance:none; appearance:none; height:3px; border-radius:2px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; background:${C.coral}; border:2px solid ${C.navy}; cursor:pointer; clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%); }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${C.coral}55; }

        /* ── Desktop: 3 columns ── */
        .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .mobile-accordion { display:none; }
        .desktop-col { display:flex; flex-direction:column; gap:16px; }
        .panel { background:rgba(10,15,30,0.9); border:1px solid ${C.border}; border-top:2px solid ${C.coral}; padding:16px 18px; }

        /* ── Mobile: single column accordion ── */
        @media (max-width: 768px) {
          .grid { display:none; }
          .mobile-accordion { display:block; padding:12px; }
          .mobile-stats { flex-wrap:wrap; }
          .mobile-stat { min-width:80px; flex:1; }
        }

        /* ── Tablet: 2 columns ── */
        @media (min-width:769px) and (max-width:1024px) {
          .grid { grid-template-columns:1fr 1fr; }
          .col3 { grid-column: 1 / -1; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        }
      `}</style>

      {/* Miami bar */}
      <div style={{ height:3, background:`linear-gradient(90deg,${C.coral},${C.orange},${C.pink},${C.coral})`, backgroundSize:"300%", animation:"miamiShift 4s ease infinite" }} />

      {/* Dot grid */}
      <div className="dot-grid" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:`radial-gradient(ellipse at 20% 0%,${C.coral}0D 0%,transparent 40%),radial-gradient(ellipse at 80% 100%,${C.teal}0A 0%,transparent 40%)` }} />

      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── TOPBAR ── */}
        <div style={{ borderBottom:`1px solid ${C.border}`, background:"rgba(10,15,30,0.95)", backdropFilter:"blur(12px)", padding:"0 16px" }}>
          <div style={{ maxWidth:1140, margin:"0 auto", display:"flex", alignItems:"stretch", justifyContent:"space-between", flexWrap:"wrap" }}>
            <div style={{ padding:"12px 0" }}>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontWeight:900, fontStyle:"italic", fontSize:"clamp(20px,4vw,32px)", letterSpacing:2, lineHeight:1, color:"#fff" }}>HEIST PLANNER</div>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:9, letterSpacing:5, color:C.coral, marginTop:1 }}>GTA VI · LEONIDA · VICE CITY · VICEBOT AI</div>
            </div>
            <div className="mobile-stats" style={{ display:"flex", alignItems:"stretch", gap:0 }}>
              {[
                { label:"PAYOUT", value:`$${(r.net/1e6).toFixed(2)}M`, color:C.teal },
                { label:"RISICO",  value:`${r.risk}%`,                  color:riskCol },
                { label:"CUT",     value:`${r.totalCut}%`,              color:C.orange },
                { label:"SKILL",   value:`${r.avgSkill}`,               color:C.pink },
              ].map(s => (
                <div key={s.label} className="mobile-stat" style={{ borderLeft:`1px solid ${C.border}`, padding:"10px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:8, letterSpacing:2, color:C.mutText, textTransform:"uppercase", marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:"clamp(15px,2.5vw,22px)", color:s.color, letterSpacing:1, lineHeight:1 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TAB NAV ── */}
        <div style={{ borderBottom:`1px solid ${C.border}`, background:"rgba(10,15,30,0.8)", padding:"0 16px" }}>
          <div style={{ maxWidth:1140, margin:"0 auto", display:"flex", gap:0 }}>
            {[["planner","🎯 HEIST PLANNER"],["tierlist","📊 TIER LIST"],["quiz","🎬 NETFLIX QUIZ"]].map(([id,label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                padding:"11px 20px", background:"transparent", border:"none",
                borderBottom:`2px solid ${activeTab===id ? C.coral : "transparent"}`,
                color: activeTab===id ? C.coral : C.dimText,
                fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, letterSpacing:3,
                fontWeight:700, cursor:"pointer", transition:"all 0.15s ease",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {activeTab === "tierlist" && (
          <div style={{ maxWidth:1140, margin:"0 auto", padding:"20px 16px 60px" }}>
            <div style={{ background:"rgba(10,15,30,0.9)", border:`1px solid ${C.border}`, borderTop:`2px solid ${C.coral}`, padding:"20px 20px" }}>
              <TierList />
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div style={{ maxWidth:720, margin:"0 auto", padding:"20px 16px 60px" }}>
            {/* Netflix badge */}
            <div style={{ background:"rgba(229,9,20,0.1)", border:"1px solid rgba(229,9,20,0.3)", padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:20 }}>🎬</div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, fontWeight:800, letterSpacing:2, color:"#E50914" }}>NETFLIX EXCLUSIVE · 27 AUG 2026</div>
                <div style={{ fontSize:11, color:C.dimText }}>GTA VI: An Extended Look — 26 min · gefilmd op PS5</div>
              </div>
            </div>
            <div style={{ background:"rgba(10,15,30,0.9)", border:`1px solid ${C.border}`, borderTop:`2px solid ${C.coral}`, padding:"20px 20px" }}>
              <Quiz />
            </div>
          </div>
        )}

        {/* ── DESKTOP GRID ── */}
        {activeTab === "planner" && <div className="grid" style={{ maxWidth:1140, margin:"0 auto", padding:"16px 16px 60px" }}>

          {/* Col 1 */}
          <div className="desktop-col">
            <div className="panel"><PanelTitle>01 · Doelwit</PanelTitle><HeistPicker /></div>
            <div className="panel"><PanelTitle>02 · Aanpak</PanelTitle><ApproachPicker /></div>
            <div className="panel">
              <PanelTitle>03 · Situatie</PanelTitle>
              <GtaSlider label="Bewakers" value={guards} min={1} max={8} onChange={setGuards} color={C.coral} />
              <GtaSlider label="Camera's" value={cameras} min={1} max={8} onChange={setCameras} color={C.orange} />
              <div style={{ fontSize:10, color:C.mutText, lineHeight:1.6, borderTop:`1px solid ${C.border}`, paddingTop:8 }}>
                ↑ Bewakers verhogen risico & verlagen payout. Camera's extra zwaar bij Stealth.
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="desktop-col">
            <div className="panel" style={{ flex:1 }}><PanelTitle>04 · Crew</PanelTitle><CrewPicker /></div>
            <div className="panel"><PanelTitle>05 · Voertuig</PanelTitle><VehiclePicker /></div>
          </div>

          {/* Col 3 */}
          <div className="desktop-col col3">
            <div className="panel" style={{ borderTopColor:C.teal }}><ResultPanel /></div>
          </div>
        </div>}

        {/* ── MOBILE ACCORDION ── */}
        {activeTab === "planner" && <div className="mobile-accordion">
          {[
            { id:"heist",    title:"01 · DOELWIT",   content:<><HeistPicker /></> },
            { id:"approach", title:"02 · AANPAK",     content:<><ApproachPicker /></> },
            { id:"situation",title:"03 · SITUATIE",   content:
              <>
                <GtaSlider label="Bewakers" value={guards} min={1} max={8} onChange={setGuards} color={C.coral} />
                <GtaSlider label="Camera's" value={cameras} min={1} max={8} onChange={setCameras} color={C.orange} />
              </>
            },
            { id:"crew",    title:"04 · CREW",        content:<><CrewPicker /></> },
            { id:"vehicle", title:"05 · VOERTUIG",    content:<><VehiclePicker /></> },
            { id:"result",  title:"06 · RESULTAAT",   content:<><ResultPanel /></> },
            { id:"quiz",    title:"🎬 NETFLIX QUIZ",   content:<><Quiz /></> },
          ].map(s => (
            <div key={s.id} style={{ border:`1px solid ${C.border}`, borderTop:`2px solid ${openSection===s.id ? C.coral : "rgba(255,255,255,0.06)"}`, background:"rgba(10,15,30,0.9)", marginBottom:8 }}>
              <div onClick={() => setOpenSection(openSection===s.id ? null : s.id)} style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, letterSpacing:3, color: openSection===s.id ? C.coral : C.dimText, fontWeight:700 }}>{s.title}</div>
                <div style={{ color: openSection===s.id ? C.coral : C.mutText, fontSize:14, transition:"transform 0.2s", transform: openSection===s.id ? "rotate(180deg)" : "none" }}>▼</div>
              </div>
              {openSection===s.id && <div style={{ padding:"0 16px 16px" }}>{s.content}</div>}
            </div>
          ))}
        </div>}

      </div>
    </div>
  );
}
