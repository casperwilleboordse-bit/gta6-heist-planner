import { useState, useRef } from "react";

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

const TIERS = [
  { id:"S", label:"S", color:"#FF3CAC", bg:"rgba(255,60,172,0.12)", desc:"God tier" },
  { id:"A", label:"A", color:"#FF6B47", bg:"rgba(255,107,71,0.10)", desc:"Uitstekend" },
  { id:"B", label:"B", color:"#FFD166", bg:"rgba(255,209,102,0.08)", desc:"Goed" },
  { id:"C", label:"C", color:"#00C9B1", bg:"rgba(0,201,177,0.08)",  desc:"Oké" },
  { id:"D", label:"D", color:"#6B7280", bg:"rgba(107,114,128,0.08)", desc:"Zwak" },
];

const ALL_ITEMS = [
  // Heists
  { id:"bank",       label:"National Bank",      icon:"🏦", cat:"Heist"   },
  { id:"casino",     label:"Stardust Casino",     icon:"🎰", cat:"Heist"   },
  { id:"yacht",      label:"El Rubio Yacht",      icon:"⛵", cat:"Heist"   },
  { id:"transport",  label:"Armored Transport",   icon:"🚛", cat:"Heist"   },
  // Crew
  { id:"ghost",      label:"Ghost (Hacker)",      icon:"💻", cat:"Crew"    },
  { id:"paige",      label:"Paige (Hacker)",      icon:"💻", cat:"Crew"    },
  { id:"chef",       label:"Chef (Gunman)",        icon:"🔫", cat:"Crew"    },
  { id:"packie",     label:"Packie (Gunman)",      icon:"🔫", cat:"Crew"    },
  { id:"taliana",    label:"Taliana (Driver)",     icon:"🚗", cat:"Crew"    },
  { id:"karim",      label:"Karim (Driver)",       icon:"🚗", cat:"Crew"    },
  // Voertuigen
  { id:"kuruma",     label:"Armored Kuruma",       icon:"🚘", cat:"Voertuig"},
  { id:"maverick",   label:"Maverick Heli",        icon:"🚁", cat:"Voertuig"},
  { id:"schnee",     label:"Schnee Hauler",        icon:"🚛", cat:"Voertuig"},
  { id:"insurgent",  label:"Insurgent",            icon:"🛻", cat:"Voertuig"},
  // Aanpakken
  { id:"stealth_ap", label:"Stealth Aanpak",       icon:"👁", cat:"Aanpak"  },
  { id:"smart_ap",   label:"Smart Aanpak",         icon:"⚡", cat:"Aanpak"  },
  { id:"aggro_ap",   label:"Aggressive Aanpak",    icon:"💥", cat:"Aanpak"  },
  // Leonida locaties
  { id:"vice_city",     label:"Vice City",          icon:"🌴", cat:"Locatie" },
  { id:"port_gellhorn", label:"Port Gellhorn",      icon:"⚓", cat:"Locatie" },
  { id:"ambrosia",      label:"Ambrosia",           icon:"🏘️", cat:"Locatie" },
  { id:"leonida_keys",  label:"Leonida Keys",       icon:"🏝️", cat:"Locatie" },
  { id:"grassrivers",   label:"Grassrivers",        icon:"🌿", cat:"Locatie" },
  { id:"mt_kalaga",     label:"Mount Kalaga",       icon:"⛰️", cat:"Locatie" },
  // Gameplay features
  { id:"six_star",      label:"6-Sterren Wanted",  icon:"⭐", cat:"Feature" },
  { id:"prone",         label:"Prone Crawling",     icon:"🪖", cat:"Feature" },
  { id:"zip_ties",      label:"Zip Ties",           icon:"🔗", cat:"Feature" },
  { id:"human_shield",  label:"Human Shield",       icon:"🛡️", cat:"Feature" },
  { id:"lucia_power",   label:"Lucia Slow-Mo",      icon:"⚡", cat:"Feature" },
  { id:"jason_power",   label:"Jason Weak Point",   icon:"🎯", cat:"Feature" },
  { id:"700_interiors", label:"700+ Interieurs",    icon:"🏢", cat:"Feature" },
  { id:"ray_trace",     label:"Ray Tracing",        icon:"✨", cat:"Feature" },
];

const CATS = ["Alles", "Heist", "Crew", "Voertuig", "Aanpak", "Locatie", "Feature"];

function PanelTitle({ children }) {
  return (
    <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:10, letterSpacing:4, fontWeight:700, textTransform:"uppercase", color:C.coral, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ width:2, height:10, background:C.coral }} />{children}
    </div>
  );
}

export default function TierList() {
  const [tierMap, setTierMap]       = useState({ S:[], A:[], B:[], C:[], D:[] });
  const [filter, setFilter]         = useState("Alles");
  const [dragging, setDragging]     = useState(null); // { id, fromTier }
  const [dragOver, setDragOver]     = useState(null); // tierId or "pool"
  const [copied, setCopied]         = useState(false);
  const [touchDrag, setTouchDrag]   = useState(null);
  const ghostRef                    = useRef(null);

  const placed = Object.values(tierMap).flat();
  const poolItems = ALL_ITEMS.filter(it =>
    !placed.includes(it.id) &&
    (filter === "Alles" || it.cat === filter)
  );

  const moveItem = (itemId, fromTier, toTier) => {
    setTierMap(prev => {
      const next = { ...prev };
      if (fromTier && fromTier !== "pool") {
        next[fromTier] = next[fromTier].filter(x => x !== itemId);
      }
      if (toTier !== "pool") {
        if (!next[toTier].includes(itemId)) {
          next[toTier] = [...next[toTier], itemId];
        }
      }
      return next;
    });
  };

  const removeItem = (itemId) => {
    setTierMap(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { next[k] = next[k].filter(x => x !== itemId); });
      return next;
    });
  };

  // ── Drag handlers ──
  const onDragStart = (e, id, fromTier) => {
    setDragging({ id, fromTier });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropTier = (e, tierId) => {
    e.preventDefault();
    if (!dragging) return;
    moveItem(dragging.id, dragging.fromTier, tierId);
    setDragging(null); setDragOver(null);
  };

  const onDropPool = (e) => {
    e.preventDefault();
    if (!dragging || !dragging.fromTier || dragging.fromTier === "pool") return;
    removeItem(dragging.id);
    setDragging(null); setDragOver(null);
  };

  // ── Touch handlers ──
  const onTouchStart = (e, id, fromTier) => {
    const touch = e.touches[0];
    setTouchDrag({ id, fromTier, startX: touch.clientX, startY: touch.clientY });
  };

  const onTouchEnd = (e) => {
    if (!touchDrag) return;
    const touch = e.changedTouches[0];
    // Find which tier/pool is under finger
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const tierTarget = el?.closest("[data-tier]")?.getAttribute("data-tier");
    const isPool = el?.closest("[data-pool]");
    if (tierTarget) moveItem(touchDrag.id, touchDrag.fromTier, tierTarget);
    else if (isPool && touchDrag.fromTier && touchDrag.fromTier !== "pool") removeItem(touchDrag.id);
    setTouchDrag(null);
  };

  // ── Share ──
  const shareText = () => {
    const lines = TIERS.map(t => {
      const names = tierMap[t.id].map(id => ALL_ITEMS.find(x => x.id === id)?.label).filter(Boolean);
      return names.length ? `${t.label}: ${names.join(", ")}` : null;
    }).filter(Boolean);
    return `🎯 Mijn GTA 6 Tier List:\n${lines.join("\n")}\n\nMaak jouw eigen tier list op vicebot.gg`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => setTierMap({ S:[], A:[], B:[], C:[], D:[] });

  const ItemChip = ({ id, fromTier, compact = false }) => {
    const item = ALL_ITEMS.find(x => x.id === id);
    if (!item) return null;
    return (
      <div
        draggable
        onDragStart={e => onDragStart(e, id, fromTier)}
        onDragEnd={() => { setDragging(null); setDragOver(null); }}
        onTouchStart={e => onTouchStart(e, id, fromTier)}
        onTouchEnd={onTouchEnd}
        style={{
          display:"flex", alignItems:"center", gap:compact ? 4 : 6,
          background: dragging?.id === id ? "rgba(255,107,71,0.2)" : "rgba(255,255,255,0.07)",
          border:`1px solid ${dragging?.id === id ? C.coral : "rgba(255,255,255,0.12)"}`,
          borderRadius:4, padding: compact ? "4px 8px" : "6px 10px",
          cursor:"grab", userSelect:"none", fontSize: compact ? 11 : 12,
          color: "#fff", flexShrink:0, transition:"all 0.12s ease",
          touchAction:"none",
        }}
      >
        <span style={{ fontSize: compact ? 12 : 14 }}>{item.icon}</span>
        <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontWeight:700, letterSpacing:0.5, whiteSpace:"nowrap" }}>{item.label}</span>
        {fromTier && fromTier !== "pool" && (
          <span
            onClick={e => { e.stopPropagation(); removeItem(id); }}
            style={{ marginLeft:2, color:C.mutText, cursor:"pointer", fontSize:10, lineHeight:1 }}
          >✕</span>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily:"'Barlow','Segoe UI',sans-serif", color:C.sand }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:ital,wght@0,700;0,800;1,800&display=swap');
        .tier-drop { transition: background 0.15s ease; }
        .tier-drop.over { background: rgba(255,107,71,0.08) !important; }
        .pool-drop.over { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:20 }}>
        <div>
          <PanelTitle>GTA 6 · Tier List Maker</PanelTitle>
          <p style={{ fontSize:12, color:C.mutText, marginTop:-8 }}>Sleep items naar een tier · Deel met vrienden</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={handleReset} style={{ padding:"8px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, color:C.dimText, borderRadius:4, cursor:"pointer", fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, letterSpacing:2 }}>
            ↺ RESET
          </button>
          <button onClick={handleCopy} style={{
            padding:"8px 16px", background: copied ? `${C.teal}22` : `linear-gradient(90deg,${C.coral},${C.pink})`,
            border:"none", color:"#fff", borderRadius:4, cursor:"pointer",
            fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:12, letterSpacing:2, fontWeight:700,
            boxShadow: copied ? "none" : `0 2px 12px ${C.coral}44`, transition:"all 0.2s",
          }}>
            {copied ? "✓ GEKOPIEERD" : "◆ DEEL"}
          </button>
        </div>
      </div>

      {/* Tier rows */}
      <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:16 }}>
        {TIERS.map(tier => (
          <div key={tier.id}
            className={`tier-drop ${dragOver === tier.id ? "over" : ""}`}
            data-tier={tier.id}
            onDragOver={e => { e.preventDefault(); setDragOver(tier.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => onDropTier(e, tier.id)}
            style={{ display:"flex", alignItems:"stretch", minHeight:54, background: tier.bg, border:`1px solid ${tier.color}22` }}
          >
            {/* Tier label */}
            <div style={{
              width:52, flexShrink:0, background:`${tier.color}18`,
              borderRight:`2px solid ${tier.color}44`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2,
            }}>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:24, fontWeight:900, color:tier.color, lineHeight:1 }}>{tier.label}</div>
              <div style={{ fontSize:8, color:tier.color, opacity:0.6, letterSpacing:1 }}>{tier.desc}</div>
            </div>

            {/* Items in tier */}
            <div style={{ flex:1, display:"flex", flexWrap:"wrap", gap:6, padding:"8px 10px", alignContent:"center", minHeight:54 }}>
              {tierMap[tier.id].length === 0 && (
                <span style={{ fontSize:11, color:C.mutText, fontStyle:"italic" }}>Sleep hier naartoe…</span>
              )}
              {tierMap[tier.id].map(id => <ItemChip key={id} id={id} fromTier={tier.id} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Pool — unranked items */}
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
        {/* Filter tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
          {CATS.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding:"5px 12px", border:`1px solid ${filter===cat ? C.coral : C.border}`,
              background: filter===cat ? `${C.coral}18` : "rgba(255,255,255,0.02)",
              color: filter===cat ? C.coral : C.dimText, borderRadius:4, cursor:"pointer",
              fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:11, letterSpacing:2, fontWeight:700,
            }}>{cat.toUpperCase()}</button>
          ))}
        </div>

        <div
          className={`pool-drop ${dragOver === "pool" ? "over" : ""}`}
          data-pool="true"
          onDragOver={e => { e.preventDefault(); setDragOver("pool"); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={onDropPool}
          style={{
            display:"flex", flexWrap:"wrap", gap:6,
            minHeight:64, padding:"10px",
            background:"rgba(255,255,255,0.02)", border:`1px solid ${C.border}`,
            alignContent:"flex-start",
          }}
        >
          {poolItems.length === 0 && placed.length > 0 && (
            <span style={{ fontSize:12, color:C.mutText, fontStyle:"italic" }}>Alle items zijn gerankt 🎉</span>
          )}
          {poolItems.map(item => <ItemChip key={item.id} id={item.id} fromTier="pool" compact />)}
        </div>
        <div style={{ fontSize:10, color:C.mutText, marginTop:8 }}>
          ↑ Sleep items omhoog naar een tier · Klik ✕ op een item om het terug te zetten · Op mobiel: ingedrukt houden en slepen
        </div>
      </div>
    </div>
  );
}
