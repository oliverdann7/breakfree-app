import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const C = {
  navy: "#0A2540",
  deep: "#061829",
  royal: "#0B72B9",
  cyan: "#14B8D4",
  cream: "#F4E8C8",
  gold: "#E6B530",
  amber: "#C99419",
};

/* ── tiny icon set (pure SVG, no dependency) ── */
const Icon = ({ d, size = 14, stroke = "currentColor", fill = "none", sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Ico = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  mic:       "M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3zm-7 9a7 7 0 0014 0M12 19v4M8 23h8",
  activity:  "M22 12h-4l-3 9L9 3l-3 9H2",
  users:     "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  user:      "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  heart:     "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  flame:     "M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z",
  moon:      "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  zap:       "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  play:      "M5 3l14 9-14 9V3z",
  search:    "M11 17a6 6 0 100-12 6 6 0 000 12zM21 21l-4.35-4.35",
  plus:      "M12 5v14M5 12h14",
  check:     "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  arrow:     "M5 12h14M12 5l7 7-7 7",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  target:    "M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z",
  chart:     "M18 20V10M12 20V4M6 20v-6",
  sparkles:  "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM4 17l.8 2.4L7 20l-2.2.8L4 23l-.8-2.2L1 20l2.2-.8L4 17zM20 3l.8 2.4L23 6l-2.2.8L20 9l-.8-2.2L17 6l2.2-.8L20 3z",
  calendar:  "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  brain:     "M9.5 2A2.5 2.5 0 007 4.5v.5H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-2v-.5A2.5 2.5 0 0014.5 2h-5z",
  mappin:    "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
  clock:     "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
  video:     "M23 7l-7 5 7 5V7zM1 5h15v14H1z",
  message:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  award:     "M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  trending:  "M23 6l-9.5 9.5-5-5L1 18",
  headphone: "M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z",
  foot:      "M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5M20 10v10a1 1 0 01-1 1h-5M9 21v-6a1 1 0 011-1h4a1 1 0 011 1v6",
};

/* ── Phone Frame ── */
function Phone({ children, label, sub, delay = 0, accent = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      {/* label */}
      <div className="mb-5 text-center">
        <span style={{
          display: "inline-block",
          background: accent ? C.gold : "transparent",
          border: accent ? "none" : "1px solid rgba(255,255,255,0.12)",
          color: accent ? C.navy : "rgba(255,255,255,0.5)",
          borderRadius: 999, padding: "3px 12px", fontSize: 9,
          textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 600,
        }}>{label}</span>
        <div style={{ marginTop: 10, fontSize: 16, color: "rgba(255,255,255,0.85)", fontFamily: "'Fraunces',Georgia,serif", fontWeight: 300 }}>{sub}</div>
      </div>

      <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} style={{ position: "relative" }}>
        {/* glow */}
        <div style={{
          position: "absolute", inset: -24, borderRadius: 56,
          background: accent ? C.gold : C.cyan, opacity: 0.18, filter: "blur(40px)", pointerEvents: "none"
        }} />
        {/* frame */}
        <div style={{
          width: 260, height: 560, borderRadius: 44,
          border: "2.5px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(160deg,#1c1c1c,#000)",
          padding: 7, boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}>
          {/* side buttons */}
          {[{t:80,h:28,left:true},{t:120,h:44,left:true},{t:174,h:44,left:true},{t:100,h:56,left:false}].map((b,i)=>(
            <div key={i} style={{
              position:"absolute", width:2.5, height:b.h, borderRadius:2,
              background:"rgba(255,255,255,0.15)", top:b.t,
              left:b.left?-2.5:"auto", right:b.left?"auto":-2.5,
            }}/>
          ))}
          {/* screen */}
          <div style={{
            width:"100%", height:"100%", borderRadius: 37,
            background: C.navy, overflow:"hidden", position:"relative"
          }}>
            {/* notch */}
            <div style={{
              position:"absolute", top:6, left:"50%", transform:"translateX(-50%)",
              width:80, height:20, borderRadius:999, background:"#000", zIndex:30
            }}/>
            {/* status */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, zIndex:20,
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"6px 16px 0", fontSize:9, fontWeight:700, color:"#fff"
            }}>
              <span>9:41</span>
              <span style={{opacity:0}}>.</span>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{display:"flex",gap:2,alignItems:"flex-end"}}>
                  {[6,8,10,10].map((h,i)=><div key={i} style={{width:2,height:h,background:"#fff",borderRadius:1}}/>)}
                </div>
                <div style={{width:14,height:8,borderRadius:2,border:"1px solid #fff",padding:1,display:"flex",alignItems:"center"}}>
                  <div style={{width:8,height:4,background:"#fff",borderRadius:1}}/>
                </div>
              </div>
            </div>
            {/* content */}
            <div style={{ height:"100%", width:"100%", paddingTop:28, overflow:"hidden" }}>
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Tab Bar ── */
function TabBar({ active = 0 }) {
  const tabs = [
    { ico: Ico.home, l: "Ana" },
    { ico: Ico.mic, l: "Talks" },
    { ico: Ico.activity, l: "Sağlık" },
    { ico: Ico.users, l: "Topluluk" },
    { ico: Ico.user, l: "Profil" },
  ];
  return (
    <div style={{
      position:"absolute", bottom:0, left:0, right:0,
      borderTop:"1px solid rgba(255,255,255,0.08)",
      background:"rgba(6,24,41,0.95)", backdropFilter:"blur(20px)",
      display:"flex", justifyContent:"space-around", padding:"6px 0 8px",
    }}>
      {tabs.map((t,i)=>(
        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2,
          color: i===active ? C.gold : "rgba(255,255,255,0.35)", cursor:"pointer" }}>
          <Icon d={t.ico} size={14} sw={i===active?2.2:1.5}/>
          <span style={{fontSize:7,fontWeight:i===active?700:500}}>{t.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Animated ring ── */
function Ring({ score = 76, r = 34, size = 84, color = C.gold }) {
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6}/>
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
      />
    </svg>
  );
}

/* ══════════════════ SCREENS ══════════════════ */

/* 1 · Onboarding */
function S1() {
  return (
    <div style={{ height:"100%", position:"relative", background: `linear-gradient(135deg, ${C.navy}, ${C.royal}50, ${C.navy})` }}>
      {/* blobs */}
      {[
        { t:-40, l:-30, bg:C.gold, size:120 },
        { b:-30, r:-30, bg:C.cyan, size:140 },
      ].map((b,i)=>(
        <motion.div key={i} animate={{ x:[0,20,0], y:[0,-15,0] }}
          transition={{ duration:8+i*2, repeat:Infinity, ease:"easeInOut", delay:i*1.5 }}
          style={{ position:"absolute", ...b.t!==undefined?{top:b.t}:{bottom:b.b},
            ...b.l!==undefined?{left:b.l}:{right:b.r}, width:b.size, height:b.size,
            borderRadius:"50%", background:b.bg, opacity:0.25, filter:"blur(40px)" }}
        />
      ))}
      <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", height:"100%", padding:"16px 20px 16px" }}>
        {/* logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:24, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.amber})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.navy }}/>
          </div>
          <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:16, color:"#fff", fontWeight:400 }}>BreakFree<span style={{color:C.gold}}>.</span></span>
        </div>

        {/* orbit */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <motion.div animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", width:140, height:140, borderRadius:"50%", border:`1px solid rgba(230,181,48,0.2)` }}/>
          <motion.div animate={{ rotate:-360 }} transition={{ duration:30, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", width:180, height:180, borderRadius:"50%", border:`1px solid rgba(20,184,212,0.12)` }}/>

          {/* floating tags */}
          {[
            { l:"💛 Sağlık", t:-30, le:-50 },
            { l:"🌊 Topluluk", t:20, r:-50 },
            { l:"🧠 Zihin", b:0, le:-30 },
          ].map((tag,i)=>(
            <motion.div key={i} animate={{ y:[0, i%2===0 ? -6:6, 0] }}
              transition={{ duration:3+i, repeat:Infinity, delay:i*0.5 }}
              style={{ position:"absolute", ...tag.t!==undefined?{top:tag.t}:{bottom:tag.b},
                ...tag.le!==undefined?{left:tag.le}:{right:tag.r},
                background:"rgba(255,255,255,0.08)", backdropFilter:"blur(12px)",
                border:"1px solid rgba(255,255,255,0.1)", borderRadius:999,
                padding:"4px 10px", fontSize:9, color:"rgba(255,255,255,0.9)", whiteSpace:"nowrap" }}
            >{tag.l}</motion.div>
          ))}

          <div style={{ width:88, height:88, borderRadius:"50%",
            background:`linear-gradient(135deg,${C.gold},${C.amber})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 20px 60px ${C.gold}50` }}>
            <Icon d={Ico.sparkles} size={36} stroke={C.navy} sw={1.5}/>
          </div>
        </div>

        {/* text */}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:26, fontWeight:300, color:"#fff", lineHeight:1.1, margin:0 }}>
            Özgürlüğüne<br/><em style={{color:C.gold}}>hoş geldin.</em>
          </h2>
          <p style={{ fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:8, lineHeight:1.6 }}>
            Türkiye'nin wellness topluluğu cebinde.
          </p>
        </div>

        {/* ctas */}
        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:8 }}>
          <button style={{ width:"100%", background:C.gold, color:C.navy, border:"none", borderRadius:999, padding:"11px 0", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            Başla →
          </button>
          <button style={{ width:"100%", background:"transparent", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:999, padding:"11px 0", fontSize:12, cursor:"pointer" }}>
            Hesabım var
          </button>
        </div>

        {/* dots */}
        <div style={{ display:"flex", gap:6, marginTop:12 }}>
          <div style={{ width:20, height:3, borderRadius:999, background:C.gold }}/>
          <div style={{ width:6, height:3, borderRadius:999, background:"rgba(255,255,255,0.2)" }}/>
          <div style={{ width:6, height:3, borderRadius:999, background:"rgba(255,255,255,0.2)" }}/>
        </div>
      </div>
    </div>
  );
}

/* 2 · Dashboard */
function S2() {
  const metrics = [
    { ico:Ico.moon, l:"Uyku", v:"7s 24dk", c:C.cyan },
    { ico:Ico.heart, l:"Nabız", v:"64 bpm", c:C.gold },
    { ico:Ico.foot, l:"Adım", v:"8.2k", c:C.cyan },
    { ico:Ico.flame, l:"Kalori", v:"1,847", c:C.gold },
  ];
  const plan = [
    { t:"Sabah meditasyonu", dur:"10dk", done:true, ico:Ico.brain },
    { t:"Fitness · Üst beden", dur:"45dk", done:false, ico:Ico.activity },
    { t:"Wellness palestra", dur:"30dk", done:false, ico:Ico.mic, live:true },
  ];
  return (
    <div style={{ height:"100%", background:C.deep, position:"relative", overflow:"hidden" }}>
      <div style={{ height:"100%", overflowY:"auto", padding:"8px 14px 60px", scrollbarWidth:"none" }}>
        {/* header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:8, textTransform:"uppercase", letterSpacing:"0.2em", color:"rgba(255,255,255,0.35)" }}>Pazar, 15 Haziran</div>
            <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, fontWeight:300, color:"#fff", marginTop:2 }}>
              Günaydın, <em style={{color:C.gold}}>Elif</em>
            </div>
          </div>
          <div style={{ width:32, height:32, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <Icon d={Ico.bell} size={13} stroke="rgba(255,255,255,0.6)"/>
            <div style={{ position:"absolute", top:0, right:0, width:7, height:7, borderRadius:"50%", background:C.gold, border:`2px solid ${C.deep}` }}/>
          </div>
        </div>

        {/* wellness ring card */}
        <div style={{ borderRadius:20, border:`1px solid rgba(230,181,48,0.2)`, background:"linear-gradient(135deg,rgba(230,181,48,0.08),transparent,rgba(20,184,212,0.05))", padding:14, marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative", width:70, height:70, flexShrink:0 }}>
            <Ring score={76} r={29} size={70}/>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, fontWeight:300, color:"#fff" }}>76</span>
              <span style={{ fontSize:7, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Skor</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>Wellness skorun</div>
            <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:15, color:"#fff", marginTop:2 }}>
              Bugün <em style={{color:C.gold}}>hazırsın.</em>
            </div>
            <div style={{ fontSize:9, color:C.cyan, marginTop:4, display:"flex", alignItems:"center", gap:3 }}>
              <Icon d={Ico.trending} size={10} stroke={C.cyan}/> Dünden +8 puan
            </div>
          </div>
        </div>

        {/* metrics */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
          {metrics.map((m,i)=>(
            <div key={i} style={{ borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", padding:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <Icon d={m.ico} size={12} stroke={m.c}/>
                <span style={{ fontSize:7, textTransform:"uppercase", letterSpacing:"0.15em", color:"rgba(255,255,255,0.3)" }}>{m.l}</span>
              </div>
              <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:17, color:"#fff", marginTop:6 }}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* today plan */}
        <div>
          <div style={{ fontSize:10, fontWeight:600, color:"#fff", marginBottom:6 }}>Bugünkü plan</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {plan.map((p,i)=>(
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:8, borderRadius:12,
                border: p.live ? `1px solid rgba(230,181,48,0.3)` : "1px solid rgba(255,255,255,0.07)",
                background: p.live ? "rgba(230,181,48,0.06)" : "rgba(255,255,255,0.02)", padding:"8px 10px"
              }}>
                <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                  background: p.done ? "rgba(20,184,212,0.2)" : p.live ? C.gold : "rgba(255,255,255,0.08)",
                  color: p.done ? C.cyan : p.live ? C.navy : "#fff" }}>
                  <Icon d={p.done ? Ico.check : p.ico} size={13} stroke={p.done ? C.cyan : p.live ? C.navy : "#fff"}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:600, color: p.done ? "rgba(255,255,255,0.35)" : "#fff", textDecoration: p.done ? "line-through" : "none" }}>{p.t}</div>
                  <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)" }}>{p.dur}</div>
                </div>
                {p.live && <span style={{ background:C.gold, color:C.navy, borderRadius:999, padding:"2px 7px", fontSize:7, fontWeight:800, textTransform:"uppercase" }}>Canlı</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active={0}/>
    </div>
  );
}

/* 3 · Talks */
function S3() {
  const list = [
    { cat:"Zihin", t:"Anksiyeteyi anlamak", dur:"28dk", g:`linear-gradient(135deg,${C.cyan},${C.royal})` },
    { cat:"Hareket", t:"Koşunun bilimi", dur:"35dk", g:`linear-gradient(135deg,${C.gold},${C.amber})` },
    { cat:"Uyku", t:"Derin uykuya yolculuk", dur:"22dk", g:`linear-gradient(135deg,${C.royal},${C.navy})` },
  ];
  return (
    <div style={{ height:"100%", background:C.deep, position:"relative", overflow:"hidden" }}>
      <div style={{ height:"100%", overflowY:"auto", padding:"8px 14px 60px", scrollbarWidth:"none" }}>
        {/* header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, fontWeight:300, color:"#fff" }}>
            Palestralar <em style={{color:C.gold}}>&</em> sesler
          </div>
          <Icon d={Ico.search} size={14} stroke="rgba(255,255,255,0.4)"/>
        </div>

        {/* live card */}
        <div style={{ borderRadius:18, border:`1px solid rgba(230,181,48,0.3)`, background:"linear-gradient(135deg,rgba(230,181,48,0.12),rgba(230,181,48,0.04),transparent)", padding:14, marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <motion.div animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.2, repeat:Infinity }} style={{ width:6, height:6, borderRadius:"50%", background:C.gold }}/>
            <span style={{ background:C.gold, color:C.navy, borderRadius:999, padding:"2px 8px", fontSize:8, fontWeight:800, textTransform:"uppercase" }}>Canlı</span>
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)" }}>347 dinleyici</span>
          </div>
          <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:17, color:"#fff", marginTop:10, lineHeight:1.2 }}>
            Yorgunluğun ardındaki<br/><em style={{color:C.gold}}>gerçek hikaye</em>
          </div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)", marginTop:6 }}>Dr. Ayşe Demir · Coach Burak</div>
          <button style={{ marginTop:10, width:"100%", background:C.gold, color:C.navy, border:"none", borderRadius:999, padding:"9px 0", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Icon d={Ico.headphone} size={12} stroke={C.navy}/> Şimdi dinle
          </button>
        </div>

        {/* categories */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:12, scrollbarWidth:"none" }}>
          {["Tümü","Beslenme","Zihin","Hareket","Uyku"].map((c,i)=>(
            <div key={i} style={{ flexShrink:0, borderRadius:999, padding:"5px 12px", fontSize:9, fontWeight:600, cursor:"pointer",
              background: i===0 ? "#fff" : "transparent", color: i===0 ? C.navy : "rgba(255,255,255,0.6)",
              border: i===0 ? "none" : "1px solid rgba(255,255,255,0.12)" }}>{c}</div>
          ))}
        </div>

        {/* featured */}
        <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", marginBottom:12 }}>
          <div style={{ height:80, background:`linear-gradient(135deg,${C.royal},${C.cyan},${C.gold})`, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.25)" }}/>
            <div style={{ position:"relative", width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon d={Ico.play} size={14} fill="#fff" stroke="none"/>
            </div>
            <div style={{ position:"absolute", top:6, left:8, background:"rgba(0,0,0,0.4)", borderRadius:999, padding:"2px 8px", fontSize:8, color:"#fff" }}>42 dk</div>
          </div>
          <div style={{ padding:"10px 12px", background:"rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize:8, color:C.cyan, textTransform:"uppercase", letterSpacing:"0.15em" }}>Beslenme · Bölüm 12</div>
            <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:13, color:"#fff", marginTop:4, lineHeight:1.2 }}>Sezgisel beslenme: kuralları unutmak</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.4)", marginTop:5 }}>Selin Kaya</div>
          </div>
        </div>

        {/* list */}
        <div style={{ fontSize:10, fontWeight:600, color:"#fff", marginBottom:6 }}>Senin için</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {list.map((t,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", padding:"8px 10px" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:t.g, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon d={Ico.play} size={12} fill="#fff" stroke="none"/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:8, color:C.gold, textTransform:"uppercase", letterSpacing:"0.15em" }}>{t.cat}</div>
                <div style={{ fontSize:10, fontWeight:600, color:"#fff", marginTop:2 }}>{t.t}</div>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)" }}>{t.dur}</div>
              </div>
              <Icon d={Ico.plus} size={12} stroke="rgba(255,255,255,0.25)"/>
            </div>
          ))}
        </div>
      </div>
      <TabBar active={1}/>
    </div>
  );
}

/* 4 · Metrics */
function S4() {
  const bars = [
    { l:"Uyku", v:84, c:C.cyan, s:"Mükemmel · 7s 24dk" },
    { l:"Hareket", v:72, c:C.gold, s:"İyi · 8.2k adım" },
    { l:"Zihin", v:68, c:C.royal, s:"İyi · 3 meditasyon" },
    { l:"Beslenme", v:81, c:C.amber, s:"Çok iyi · 2.1L su" },
  ];
  const pts = [[0,52],[40,42],[80,48],[120,28],[160,33],[200,18],[240,12]];
  return (
    <div style={{ height:"100%", background:C.deep, position:"relative", overflow:"hidden" }}>
      <div style={{ height:"100%", overflowY:"auto", padding:"8px 14px 60px", scrollbarWidth:"none" }}>
        <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, fontWeight:300, color:"#fff", marginBottom:12 }}>
          Sağlık <em style={{color:C.gold}}>verilerin</em>
        </div>

        {/* period */}
        <div style={{ display:"flex", gap:4, borderRadius:999, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.02)", padding:4, marginBottom:12 }}>
          {["Gün","Hafta","Ay","Yıl"].map((p,i)=>(
            <div key={i} style={{ flex:1, textAlign:"center", borderRadius:999, padding:"5px 0", fontSize:9, fontWeight:600, cursor:"pointer",
              background: i===1 ? C.gold : "transparent", color: i===1 ? C.navy : "rgba(255,255,255,0.5)" }}>{p}</div>
          ))}
        </div>

        {/* chart card */}
        <div style={{ borderRadius:18, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", padding:14, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.15em" }}>Wellness skoru</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:6, marginTop:4 }}>
                <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:30, fontWeight:300, color:"#fff" }}>76</span>
                <span style={{ fontSize:9, color:C.cyan }}>↑ +12%</span>
              </div>
            </div>
            <Icon d={Ico.chart} size={16} stroke="rgba(255,255,255,0.2)"/>
          </div>

          <svg viewBox="0 0 240 72" style={{ width:"100%", height:60, marginTop:8 }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.gold} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M ${pts[0][0]} ${pts[0][1]} ${pts.slice(1).map(p=>`L ${p[0]} ${p[1]}`).join(" ")} L 240 72 L 0 72 Z`} fill="url(#cg)"/>
            <motion.path
              d={`M ${pts[0][0]} ${pts[0][1]} ${pts.slice(1).map(p=>`L ${p[0]} ${p[1]}`).join(" ")}`}
              fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:1.5, ease:"easeOut", delay:0.3 }}
            />
            {pts.map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r={3} fill={C.navy} stroke={C.gold} strokeWidth={1.5}/>
            ))}
          </svg>

          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"].map(d=>(
              <span key={d} style={{ fontSize:7, color:"rgba(255,255,255,0.3)" }}>{d}</span>
            ))}
          </div>
        </div>

        {/* breakdowns */}
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {bars.map((b,i)=>(
            <div key={i} style={{ borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", padding:"10px 12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:10, fontWeight:600, color:"#fff" }}>{b.l}</span>
                <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:14, color:"#fff" }}>{b.v}</span>
              </div>
              <div style={{ height:4, borderRadius:999, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                <motion.div
                  initial={{ width:0 }} animate={{ width:`${b.v}%` }}
                  transition={{ duration:1, delay:0.4+i*0.1 }}
                  style={{ height:"100%", borderRadius:999, background:b.c }}
                />
              </div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)", marginTop:4 }}>{b.s}</div>
            </div>
          ))}
        </div>

        {/* AI insight */}
        <div style={{ marginTop:10, borderRadius:14, border:`1px solid rgba(230,181,48,0.25)`, background:"rgba(230,181,48,0.07)", padding:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
            <Icon d={Ico.sparkles} size={11} stroke={C.gold}/>
            <span style={{ fontSize:8, textTransform:"uppercase", letterSpacing:"0.2em", color:C.gold }}>AI İçgörü</span>
          </div>
          <p style={{ fontSize:10, color:"rgba(255,255,255,0.85)", lineHeight:1.6, margin:0 }}>
            Uyku puanın bu hafta <span style={{color:C.gold,fontWeight:700}}>%14 yükseldi</span>. Akşam rutinini sürdür!
          </p>
        </div>
      </div>
      <TabBar active={2}/>
    </div>
  );
}

/* 5 · Mentor */
function S5() {
  const goals = [
    { l:"22:00'da ekranları kapat", done:true },
    { l:"10dk akşam meditasyonu", done:true },
    { l:"Günlük journal — 3 minnet", done:false },
    { l:"Hafif yoga · 15dk", done:false },
  ];
  return (
    <div style={{ height:"100%", background:C.deep, position:"relative", overflow:"hidden" }}>
      <div style={{ height:"100%", overflowY:"auto", padding:"0 0 60px", scrollbarWidth:"none" }}>
        {/* mentor header */}
        <div style={{ height:130, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${C.royal},${C.cyan},${C.gold})` }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(6,24,41,0.95) 0%, transparent 60%)" }}/>
          <div style={{ position:"absolute", bottom:12, left:14, display:"flex", alignItems:"flex-end", gap:10 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${C.gold},${C.amber})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fraunces',Georgia,serif", fontSize:22, color:C.navy, border:`2px solid ${C.deep}` }}>A</div>
              <div style={{ position:"absolute", bottom:-2, right:-2, width:12, height:12, borderRadius:"50%", background:C.cyan, border:`2px solid ${C.deep}` }}/>
            </div>
            <div>
              <div style={{ fontSize:8, textTransform:"uppercase", letterSpacing:"0.15em", color:"rgba(255,255,255,0.6)" }}>Mentörün</div>
              <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:16, color:"#fff" }}>Dr. Ayşe Demir</div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)" }}>Wellness · 8 yıl deneyim</div>
            </div>
          </div>
        </div>

        <div style={{ padding:"0 14px" }}>
          {/* quick actions */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginTop:10, marginBottom:12 }}>
            {[{i:Ico.message,l:"Sohbet"},{i:Ico.video,l:"Görüşme"},{i:Ico.calendar,l:"Planla"}].map((a,i)=>(
              <div key={i} style={{ borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", padding:10, textAlign:"center" }}>
                <Icon d={a.i} size={14} stroke={C.gold}/>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)", marginTop:4 }}>{a.l}</div>
              </div>
            ))}
          </div>

          {/* focus */}
          <div style={{ borderRadius:16, border:`1px solid rgba(230,181,48,0.2)`, background:"rgba(230,181,48,0.07)", padding:12, marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon d={Ico.target} size={11} stroke={C.gold}/>
              <span style={{ fontSize:8, textTransform:"uppercase", letterSpacing:"0.2em", color:C.gold }}>Bu hafta odak</span>
            </div>
            <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:15, color:"#fff", marginTop:6, marginBottom:10, lineHeight:1.2 }}>
              Akşam rutini ve <em style={{color:C.gold}}>uyku kalitesi</em>
            </div>
            {goals.map((g,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                <Icon d={Ico.check} size={12} stroke={g.done ? C.gold : "rgba(255,255,255,0.2)"}/>
                <span style={{ fontSize:10, color: g.done ? "rgba(255,255,255,0.4)" : "#fff", textDecoration: g.done ? "line-through" : "none" }}>{g.l}</span>
              </div>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
              <div style={{ flex:1, height:3, borderRadius:999, background:"rgba(255,255,255,0.1)", overflow:"hidden" }}>
                <motion.div initial={{width:0}} animate={{width:"50%"}} transition={{duration:1,delay:0.5}}
                  style={{ height:"100%", background:C.gold, borderRadius:999 }}/>
              </div>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)" }}>2/4</span>
            </div>
          </div>

          {/* message */}
          <div style={{ borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", padding:10, marginBottom:8 }}>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)", marginBottom:8 }}>Son mesaj · 2sa önce</div>
            <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.amber})`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:C.navy }}>A</div>
              <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"12px 12px 12px 4px", padding:"8px 10px" }}>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.9)", margin:0, lineHeight:1.5 }}>
                  Elif, bu haftaki ilerlemen harika 🌟 Pazartesi seansında uyku verilerine birlikte bakalım.
                </p>
              </div>
            </div>
          </div>

          {/* next session */}
          <div style={{ borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(20,184,212,0.06)", padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:"rgba(20,184,212,0.2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:C.cyan }}>
              <span style={{ fontSize:7, textTransform:"uppercase" }}>Pzt</span>
              <span style={{ fontSize:13, fontWeight:700 }}>17</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:600, color:"#fff" }}>Görüntülü görüşme</div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.4)" }}>19:00 · 30dk</div>
            </div>
            <Icon d={Ico.arrow} size={14} stroke="rgba(255,255,255,0.3)"/>
          </div>
        </div>
      </div>
      <TabBar active={4}/>
    </div>
  );
}

/* 6 · Community */
function S6() {
  return (
    <div style={{ height:"100%", background:C.deep, position:"relative", overflow:"hidden" }}>
      <div style={{ height:"100%", overflowY:"auto", padding:"8px 14px 60px", scrollbarWidth:"none" }}>
        <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, fontWeight:300, color:"#fff", marginBottom:12 }}>
          Topluluk <em style={{color:C.gold}}>akışı</em>
        </div>

        {/* stories */}
        <div style={{ display:"flex", gap:10, overflowX:"auto", marginBottom:12, scrollbarWidth:"none" }}>
          {[
            { l:"Sen", add:true },
            { l:"Burak", g:`linear-gradient(135deg,${C.gold},${C.amber})` },
            { l:"Selin", g:`linear-gradient(135deg,${C.cyan},${C.royal})` },
            { l:"Can", g:`linear-gradient(135deg,${C.royal},${C.navy})` },
            { l:"Aslı", g:`linear-gradient(135deg,${C.gold},${C.cyan})` },
          ].map((s,i)=>(
            <div key={i} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", padding:2,
                background: s.add ? "transparent" : `linear-gradient(135deg,${C.gold},${C.cyan})`,
                border: s.add ? `1.5px dashed ${C.gold}` : "none",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:"100%", height:"100%", borderRadius:"50%", background: s.add ? C.deep : s.g,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize: s.add ? 18 : 14, color: s.add ? C.gold : "#fff", fontWeight:600 }}>
                  {s.add ? "+" : s.l[0]}
                </div>
              </div>
              <span style={{ fontSize:8, color:"rgba(255,255,255,0.5)" }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* event banner */}
        <div style={{ borderRadius:18, overflow:"hidden", border:`1px solid rgba(230,181,48,0.25)`, marginBottom:10 }}>
          <div style={{ height:80, position:"relative", background:`linear-gradient(135deg,${C.royal},${C.cyan},${C.gold})` }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(6,24,41,0.85) 0%, transparent 50%)" }}/>
            <div style={{ position:"absolute", top:8, left:10, display:"flex", alignItems:"center", gap:4, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(8px)", borderRadius:999, padding:"2px 8px" }}>
              <motion.div animate={{opacity:[1,0.4,1]}} transition={{duration:1.2,repeat:Infinity}} style={{width:5,height:5,borderRadius:"50%",background:C.gold}}/>
              <span style={{fontSize:8,color:"#fff"}}>Yarın</span>
            </div>
            <div style={{ position:"absolute", bottom:8, left:10 }}>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.8)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Doğa yürüyüşü</div>
              <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:15, color:"#fff" }}>Belgrad Şafak</div>
            </div>
          </div>
          <div style={{ padding:"10px 12px", background:"rgba(230,181,48,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ display:"flex" }}>
                {[C.gold,C.cyan,C.royal].map((c,i)=>(
                  <div key={i} style={{ width:18, height:18, borderRadius:"50%", background:`linear-gradient(135deg,${c},${c}90)`, marginLeft:i>0?-5:0, border:`2px solid ${C.deep}` }}/>
                ))}
              </div>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.5)" }}>+24 kişi</span>
            </div>
            <button style={{ background:C.gold, color:C.navy, border:"none", borderRadius:999, padding:"5px 12px", fontSize:9, fontWeight:700, cursor:"pointer" }}>Katıl</button>
          </div>
        </div>

        {/* post */}
        <div style={{ borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", padding:12, marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.cyan},${C.royal})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>B</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", gap:4 }}>
                Burak Yılmaz <Icon d={Ico.award} size={10} stroke={C.gold}/>
              </div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)" }}>2 saat önce · Sarıyer</div>
            </div>
          </div>
          <p style={{ fontSize:10, color:"rgba(255,255,255,0.85)", lineHeight:1.6, margin:"0 0 10px" }}>
            Bu sabahki 10K koşuyu bitirdim 🌅 İlk kez sub-50'ye girdim!
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:10 }}>
            {[{l:"10.2 km",i:Ico.foot},{l:"48:32",i:Ico.clock},{l:"142 bpm",i:Ico.heart}].map((s,i)=>(
              <div key={i} style={{ borderRadius:10, background:"rgba(255,255,255,0.04)", padding:8, textAlign:"center" }}>
                <Icon d={s.i} size={12} stroke={C.gold}/>
                <div style={{ fontSize:9, fontWeight:700, color:"#fff", marginTop:4 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:14, fontSize:9, color:"rgba(255,255,255,0.45)" }}>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Icon d={Ico.heart} size={10} fill={C.gold} stroke={C.gold}/> 47
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Icon d={Ico.message} size={10} stroke="rgba(255,255,255,0.45)"/> 12
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Icon d={Ico.zap} size={10} stroke="rgba(255,255,255,0.45)"/> Tebrik et
            </span>
          </div>
        </div>

        {/* challenge */}
        <div style={{ borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(20,184,212,0.06)", padding:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon d={Ico.flame} size={12} stroke={C.gold}/>
              <span style={{ fontSize:8, textTransform:"uppercase", letterSpacing:"0.2em", color:C.cyan }}>Haftalık meydan okuma</span>
            </div>
            <span style={{ fontSize:8, color:"rgba(255,255,255,0.35)" }}>3 gün</span>
          </div>
          <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:14, color:"#fff", marginBottom:8 }}>50K adım haftası 👟</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, height:4, borderRadius:999, background:"rgba(255,255,255,0.1)", overflow:"hidden" }}>
              <motion.div initial={{width:0}} animate={{width:"67%"}} transition={{duration:1.2,delay:0.5}}
                style={{ height:"100%", background:`linear-gradient(90deg,${C.cyan},${C.gold})`, borderRadius:999 }}/>
            </div>
            <span style={{ fontSize:9, fontWeight:700, color:"#fff" }}>33.4k/50k</span>
          </div>
        </div>
      </div>
      <TabBar active={3}/>
    </div>
  );
}

/* 7 · Deep Workout Detail */
function S7() {
  const workout = {
    name: "Upper Body Strength",
    coach: "Coach Mehmet",
    difficulty: "Intermediate",
    duration: 45,
    cal: 380,
    exercises: [
      { name: "Push-ups", sets: "3x12", rest: "60s", done: 2 },
      { name: "Dumbbell rows", sets: "4x10", rest: "90s", done: 0 },
      { name: "Shoulder press", sets: "3x8", rest: "60s", done: 0 },
    ],
  };
  return (
    <div style={{ height:"100%", background:C.deep, position:"relative", overflow:"hidden" }}>
      <div style={{ height:"100%", overflowY:"auto", padding:"0 0 60px", scrollbarWidth:"none" }}>
        {/* hero */}
        <div style={{ height:120, position:"relative", background:`linear-gradient(135deg,${C.royal},${C.cyan})`, display:"flex", alignItems:"flex-end", padding:14 }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent, rgba(6,24,41,0.9))" }}/>
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", textTransform:"uppercase", letterSpacing:"0.15em" }}>{workout.coach} · {workout.difficulty}</div>
            <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, color:"#fff", marginTop:2 }}>{workout.name}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)", marginTop:2 }}>{workout.duration}min · {workout.cal} cal</div>
          </div>
        </div>

        <div style={{ padding:"12px 14px" }}>
          {/* quick stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:12, marginTop:-8, position:"relative", zIndex:10 }}>
            {[
              { l:"Kalori", v:workout.cal, u:"", i:Ico.flame },
              { l:"Süre", v:workout.duration, u:"min", i:Ico.clock },
              { l:"Zorluk", v:"Orta", u:"", i:Ico.zap },
            ].map((s,i)=>(
              <div key={i} style={{ borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", padding:10 }}>
                <Icon d={s.i} size={12} stroke={C.gold}/>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginTop:4 }}>{s.v}{s.u}</div>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* exercises */}
          <div>
            <div style={{ fontSize:10, fontWeight:600, color:"#fff", marginBottom:8 }}>Egzersizler</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {workout.exercises.map((ex,i)=>(
                <div key={i} style={{ borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", padding:12 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:"#fff" }}>{ex.name}</span>
                    <span style={{ fontSize:9, color:C.cyan }}>{ex.sets}</span>
                  </div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>Dinlenme: {ex.rest}</div>
                  <div style={{ display:"flex", gap:3 }}>
                    {Array(parseInt(ex.sets.split("x")[0])).fill(0).map((_, j)=>(
                      <div key={j} style={{ flex:1, height:24, borderRadius:8, background: j < ex.done ? C.gold : "rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color: j < ex.done ? C.navy : "rgba(255,255,255,0.3)" }}>
                        {j+1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button style={{ width:"100%", marginTop:12, background:C.gold, color:C.navy, border:"none", borderRadius:12, padding:"12px 0", fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.15em" }}>
            Antrenmanı başlat
          </button>
        </div>
      </div>
      <TabBar active={2}/>
    </div>
  );
}

/* 8 · Settings / Profile */
function S8() {
  return (
    <div style={{ height:"100%", background:C.deep, position:"relative", overflow:"hidden" }}>
      <div style={{ height:"100%", overflowY:"auto", padding:"8px 14px 60px", scrollbarWidth:"none" }}>
        {/* header */}
        <div style={{ fontSize:18, fontFamily:"'Fraunces',Georgia,serif", fontWeight:300, color:"#fff", marginBottom:16 }}>
          Ayarlar
        </div>

        {/* profile card */}
        <div style={{ borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", padding:14, marginBottom:12, textAlign:"center" }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.amber})`, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, color:C.navy }}>E</div>
          <div style={{ fontSize:14, fontFamily:"'Fraunces',Georgia,serif", color:"#fff" }}>Elif Kaya</div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginTop:2 }}>elif@breakfree.com</div>
          <div style={{ display:"flex", justifyContent:"space-around", marginTop:10, paddingTop:10, borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            {[
              { v:76, l:"Skor" },
              { v:127, l:"Gün" },
              { v:42, l:"Etkinlik" },
            ].map((s,i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.gold }}>{s.v}</div>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* sections */}
        {[
          { title:"Tercihler", items:[
            { l:"Dil", v:"Türkçe" },
            { l:"Birim", v:"Metrik" },
            { l:"Temayı seç", v:"Koyu" },
          ]},
          { title:"Bağlantılar", items:[
            { l:"Apple Health", v:"Bağlı" },
            { l:"Google Fit", v:"Bağlı" },
            { l:"Garmin", v:"Bağla" },
          ]},
          { title:"Daha fazla", items:[
            { l:"Yardım & destek", v:"→" },
            { l:"Gizlilik politikası", v:"→" },
            { l:"Çıkış yap", v:"→" },
          ]},
        ].map((sec,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.gold, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>{sec.title}</div>
            <div style={{ borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", overflow:"hidden" }}>
              {sec.items.map((item,j)=>(
                <div key={j} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 12px", borderBottom: j < sec.items.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none", background:"rgba(255,255,255,0.01)" }}>
                  <span style={{ fontSize:10, color:"#fff" }}>{item.l}</span>
                  <span style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <TabBar active={4}/>
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ to, suffix="" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  const [n, setN] = useState(0);
  useEffect(()=>{
    if(!inView) return;
    const dur=1600, t0=performance.now();
    const tick=t=>{ const p=Math.min((t-t0)/dur,1); setN(Math.floor((1-Math.pow(1-p,3))*to)); if(p<1)requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  },[inView,to]);
  return <span ref={ref}>{n.toLocaleString("tr-TR")}{suffix}</span>;
}

/* ══════════════════ MAIN ══════════════════ */
export default function App() {
  const [activeScreen, setActiveScreen] = useState(null);
  const screens = [
    { comp: S1, label:"01 · Karşılama", sub:"Onboarding", delay:0 },
    { comp: S2, label:"02 · Ana sayfa", sub:"Dashboard", delay:0.08, accent:true },
    { comp: S3, label:"03 · İçerik", sub:"Palestralar & Sesler", delay:0.16 },
    { comp: S4, label:"04 · Veriler", sub:"Sağlık Metrikleri", delay:0, accent:true },
    { comp: S5, label:"05 · Mentor", sub:"1-1 Mentörlük", delay:0.08 },
    { comp: S6, label:"06 · Sosyal", sub:"Topluluk & Etkinlik", delay:0.16 },
    { comp: S7, label:"07 · Antrenman", sub:"Workout Detail", delay:0, accent:true },
    { comp: S8, label:"08 · Ayarlar", sub:"Profil & Tercihler", delay:0.08 },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.deep, color:"#fff", fontFamily:"'Manrope',system-ui,sans-serif", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Manrope:wght@300;400;600;700&display=swap');
        * { box-sizing:border-box; }
        ::selection { background:${C.gold}; color:${C.navy}; }
        body { margin:0; }
      `}</style>

      {/* bg atmosphere */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(160deg,${C.navy},${C.deep},#000)` }}/>
        <motion.div animate={{ x:[0,60,0], y:[0,-40,0] }} transition={{ duration:20, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", top:-200, left:-200, width:500, height:500, borderRadius:"50%", background:C.gold, opacity:0.07, filter:"blur(100px)" }}/>
        <motion.div animate={{ x:[0,-50,0], y:[0,60,0] }} transition={{ duration:25, repeat:Infinity, ease:"easeInOut" }}
          style={{ position:"absolute", bottom:-200, right:-200, width:600, height:600, borderRadius:"50%", background:C.cyan, opacity:0.08, filter:"blur(120px)" }}/>
        <div style={{ position:"absolute", inset:0, opacity:0.025,
          backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
          backgroundSize:"70px 70px" }}/>
      </div>

      <div style={{ position:"relative", zIndex:1 }}>
        {/* ─── HERO ─── */}
        <header style={{ maxWidth:1100, margin:"0 auto", padding:"64px 32px 48px" }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}>
            {/* logo row */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.amber})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:C.navy }}/>
              </div>
              <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, fontWeight:400, color:"#fff" }}>
                BreakFree<span style={{color:C.gold}}>.</span>
              </span>
              <span style={{ marginLeft:8, border:`1px solid rgba(230,181,48,0.3)`, background:"rgba(230,181,48,0.08)", color:C.gold, borderRadius:999, padding:"3px 12px", fontSize:9, textTransform:"uppercase", letterSpacing:"0.2em", fontWeight:600 }}>
                App Konsepti · 2026
              </span>
            </div>

            <h1 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(2.4rem,7vw,5.5rem)", fontWeight:300, lineHeight:0.95, letterSpacing:"-0.02em", margin:"0 0 24px" }}>
              Topluluk<br/><em style={{color:C.gold}}>cebinde.</em>
            </h1>
            <p style={{ maxWidth:520, fontSize:"clamp(14px,2vw,18px)", fontWeight:300, color:"rgba(255,255,255,0.6)", lineHeight:1.7, margin:0 }}>
              Bütünsel sağlık metrikleri, canlı palestralar, kişisel mentörlük ve topluluk — tek uygulamada. Türkiye'nin wellness hareketinin dijital yüzü.
            </p>

            {/* stats */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:24, marginTop:40 }}>
              {[
                { v:850, s:"+", l:"Beklenen üye" },
                { v:6, s:" ekran", l:"Ana akış" },
                { v:3, s:" platform", l:"iOS · Android · Web" },
              ].map((s,i)=>(
                <div key={i} style={{ borderRadius:16, border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.02)", backdropFilter:"blur(12px)", padding:"14px 20px" }}>
                  <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:28, fontWeight:300, color:"#fff" }}>
                    <Counter to={s.v} suffix={s.s}/>
                  </div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.15em", marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* feature chips */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:24 }}>
              {[
                [Ico.activity,"Sağlık Metrikleri"],
                [Ico.mic,"Canlı Palestralar"],
                [Ico.brain,"1-1 Mentörlük"],
                [Ico.users,"Topluluk Akışı"],
                [Ico.calendar,"Etkinlik Takvimi"],
                [Ico.sparkles,"AI İçgörüler"],
              ].map(([ico,l],i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:7, borderRadius:999, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.03)", padding:"7px 14px", fontSize:11, color:"rgba(255,255,255,0.7)" }}>
                  <Icon d={ico} size={12} stroke={C.gold}/> {l}
                </div>
              ))}
            </div>
          </motion.div>
        </header>

        {/* ─── PHONES GRID ─── */}
        <section style={{ maxWidth:1160, margin:"0 auto", padding:"40px 24px 80px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
            <div style={{ height:1, width:48, background:C.gold }}/>
            <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.3em", color:C.gold, fontWeight:600 }}>8 tela completa</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"80px 32px", justifyItems:"center" }}>
            {screens.map((s,i)=>(
              <Phone key={i} label={s.label} sub={s.sub} delay={s.delay} accent={s.accent}>
                <s.comp/>
              </Phone>
            ))}
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px 80px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40 }}>
            <div style={{ height:1, width:48, background:C.gold }}/>
            <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.3em", color:C.gold, fontWeight:600 }}>Özellikler</span>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {[
              { i:Ico.activity, t:"Bütünsel sağlık paneli", d:"Uyku, nabız, adım, kalori, stres. Apple Health & Google Fit.", accent:true },
              { i:Ico.mic, t:"Canlı palestralar", d:"Türkiye'nin en iyi uzmanlarından canlı yayınlar ve podcast'ler." },
              { i:Ico.sparkles, t:"AI içgörüler", d:"Kişiselleştirilmiş öneriler sunan akıllı asistan." },
              { i:Ico.user, t:"1-1 mentörlük", d:"Sertifikalı koçlar ile haftalık görüntülü görüşme ve hedef takibi.", accent:true },
              { i:Ico.users, t:"Topluluk akışı", d:"Antrenmanlarını paylaş, story'ler, tebrikler, meydan okumalar." },
              { i:Ico.calendar, t:"Etkinlik takvimi", d:"Doğa yürüyüşleri, atölyeler. Tek dokunuşla RSVP ve geri sayım." },
            ].map((f,i)=>(
              <motion.div key={i}
                initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}}
                transition={{duration:0.6,delay:(i%3)*0.08}}
                whileHover={{y:-5}}
                style={{ borderRadius:24, border: f.accent ? `1px solid rgba(230,181,48,0.3)` : "1px solid rgba(255,255,255,0.08)",
                  background: f.accent ? "rgba(230,181,48,0.07)" : "rgba(255,255,255,0.02)", padding:28, cursor:"pointer" }}
              >
                <div style={{ width:44, height:44, borderRadius:14, background: f.accent ? C.gold : "rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                  <Icon d={f.i} size={18} stroke={f.accent ? C.navy : C.gold}/>
                </div>
                <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:20, fontWeight:400, color:"#fff", marginBottom:8 }}>{f.t}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.65 }}>{f.d}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── ROADMAP ─── */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px 80px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40 }}>
            <div style={{ height:1, width:48, background:C.gold }}/>
            <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.3em", color:C.gold, fontWeight:600 }}>Yol haritası</span>
          </div>
          <h2 style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:"clamp(2rem,5vw,4rem)", fontWeight:300, lineHeight:1, margin:"0 0 40px" }}>
            Üç aşamada <em style={{color:C.gold}}>tam ürün.</em>
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
            {[
              { phase:"V1 · MVP", date:"Q3 2026", title:"Topluluk + içerik", items:["Onboarding & profil","Etkinlik takvimi","Topluluk akışı","Podcast/palestralar","Rozetler"], status:"Tasarım aşamasında" },
              { phase:"V2 · Sağlık", date:"Q1 2027", title:"Bütünsel veriler", items:["Apple Health entegrasyon","Wellness skoru","Detaylı analitik","AI içgörüler","Haftalık meydan okumalar"], status:"Planlanıyor", accent:true },
              { phase:"V3 · Mentörlük", date:"Q3 2027", title:"Premium katman", items:["1-1 mentörlük","Görüntülü görüşme","Kişisel plan","Aile hesapları","Sertifika programı"], status:"Vizyon" },
            ].map((p,i)=>(
              <motion.div key={i}
                initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:i*0.12}}
                style={{ borderRadius:24, padding:28, background: p.accent ? `linear-gradient(135deg,${C.gold},${C.amber})` : "rgba(255,255,255,0.02)",
                  border: p.accent ? "none" : "1px solid rgba(255,255,255,0.08)" }}
              >
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                  <span style={{ fontSize:9, textTransform:"uppercase", letterSpacing:"0.2em", color: p.accent ? "rgba(10,37,64,0.7)" : C.gold, fontWeight:600 }}>{p.phase}</span>
                  <span style={{ fontSize:9, color: p.accent ? "rgba(10,37,64,0.6)" : "rgba(255,255,255,0.35)" }}>{p.date}</span>
                </div>
                <div style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:24, fontWeight:300, color: p.accent ? C.navy : "#fff", marginBottom:20, lineHeight:1.1 }}>{p.title}</div>
                <ul style={{ listStyle:"none", padding:0, margin:"0 0 20px", display:"flex", flexDirection:"column", gap:8 }}>
                  {p.items.map((item,j)=>(
                    <li key={j} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color: p.accent ? "rgba(10,37,64,0.75)" : "rgba(255,255,255,0.65)" }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background: p.accent ? C.navy : C.gold, flexShrink:0 }}/>
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, borderRadius:999, padding:"4px 12px", fontSize:9, textTransform:"uppercase", letterSpacing:"0.15em", fontWeight:600,
                  background: p.accent ? C.navy : "rgba(255,255,255,0.06)", color: p.accent ? C.gold : "rgba(255,255,255,0.45)",
                  border: p.accent ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background: p.accent ? C.gold : "rgba(255,255,255,0.3)" }}/>
                  {p.status}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"32px", textAlign:"center" }}>
          <span style={{ fontFamily:"'Fraunces',Georgia,serif", fontSize:18, color:"#fff" }}>
            BreakFree<span style={{color:C.gold}}>.</span>
          </span>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:8 }}>
            App Concept · Design preview · İstanbul, Türkiye · 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
