import { useState, useEffect, useRef } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,800;9..144,900&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --w:   #ffffff;
  --c0:  #020d1f;
  --c1:  #0a1a35;
  --c2:  #1a3a6b;
  --c3:  #4a72a8;
  --c4:  #7ba3d4;
  --c5:  #c5d9f0;
  --c6:  #e8f0fb;
  --c7:  #f0f5fd;
  --acc: #1547e8;
  --acc2:#3b6bff;
  --adim:#ddeaff;
  --ok:  #047857;
  --warn:#b45309;
  --bad: #b91c1c;
  --serif:'Fraunces',Georgia,serif;
  --mono:'IBM Plex Mono',monospace;
  --sans:'IBM Plex Sans',sans-serif;
}

.pr *,.pr *::before,.pr *::after{box-sizing:border-box;margin:0;padding:0;}
.pr{font-family:var(--sans);background:var(--w);color:var(--c0);-webkit-font-smoothing:antialiased;overflow-x:hidden;}

@keyframes pr-up   {from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
@keyframes pr-in   {from{opacity:0}to{opacity:1}}
@keyframes pr-right{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:none}}
@keyframes pr-spin {to{transform:rotate(360deg)}}
@keyframes pr-tick {from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pr-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes pr-scan {
  0%  {top:0%;opacity:1}
  90% {top:88%;opacity:1}
  100%{top:88%;opacity:0}
}
@keyframes pr-ring{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.6);opacity:0}}

/* topbar */
.pr-topbar{height:2px;background:var(--acc2);position:relative;}
.pr-topbar::after{content:'';position:absolute;left:0;top:0;width:100px;height:100%;background:var(--c0);}

.pr-wrap{max-width:1240px;margin:0 auto;padding:0 40px;}

/* typography */
.pr-over{font-family:var(--mono);font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--c3);}
.pr-over-a{font-family:var(--mono);font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);}
.pr-serif{font-family:var(--serif);font-weight:800;line-height:1.0;letter-spacing:-0.04em;color:var(--c0);}

/* side label */
.pr-slab{writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--c4);user-select:none;flex-shrink:0;}

/* buttons */
.pr-btn{display:inline-flex;align-items:center;gap:10px;padding:14px 32px;border:2px solid var(--c0);background:var(--c0);color:#fff;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .2s ease;position:relative;overflow:hidden;}
.pr-btn::after{content:'';position:absolute;inset:0;background:var(--acc);transform:translateX(-100%);transition:transform .22s ease;}
.pr-btn:hover:not(:disabled)::after{transform:translateX(0);}
.pr-btn:hover:not(:disabled){border-color:var(--acc);}
.pr-btn span{position:relative;z-index:1;}
.pr-btn:disabled{opacity:.4;cursor:not-allowed;}

.pr-btn-o{display:inline-flex;align-items:center;gap:10px;padding:14px 32px;border:2px solid var(--c5);background:transparent;color:var(--c2);font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .2s ease;}
.pr-btn-o:hover{border-color:var(--c0);color:var(--c0);}

/* stat block */
.pr-stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--c5);border-top:2px solid var(--acc);}
.pr-stat{padding:30px 26px;border-right:1px solid var(--c5);}
.pr-stat:last-child{border-right:none;}

/* steps */
.pr-steps{display:grid;grid-template-columns:repeat(3,1fr);border-top:2px solid var(--acc);border-left:1px solid var(--c5);}
.pr-step{padding:40px 32px;border-right:1px solid var(--c5);border-bottom:1px solid var(--c5);position:relative;}
.pr-step::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:var(--acc);transform:scaleX(0);transform-origin:left;transition:transform .4s ease;}
.pr-step.sa::after{transform:scaleX(1);}
.pr-step.sd::after{background:var(--ok);transform:scaleX(1);}
.pr-step-n{font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:.16em;color:var(--acc);margin-bottom:20px;display:flex;align-items:center;gap:10px;}
.pr-step-n::before{content:'';display:block;width:22px;height:1px;background:var(--acc);}

/* pipeline */
.pr-shell{border:1px solid var(--c5);border-top:2px solid var(--acc);overflow:hidden;}
.pr-head{background:var(--c0);padding:18px 28px;display:flex;align-items:center;justify-content:space-between;}
.pr-body{display:grid;grid-template-columns:272px 1fr;}
.pr-side{border-right:1px solid var(--c5);background:var(--c7);padding:30px 26px;display:flex;flex-direction:column;gap:26px;}
.pr-main{padding:36px 40px;background:var(--w);min-height:520px;display:flex;flex-direction:column;}

/* file item */
.pr-file{display:flex;align-items:center;gap:12px;padding:11px 13px;border:1px solid var(--c5);background:var(--w);cursor:pointer;transition:all .15s ease;margin-bottom:6px;position:relative;}
.pr-file::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--acc);transform:scaleY(0);transition:transform .2s ease;}
.pr-file:hover::before,.pr-file.on::before{transform:scaleY(1);}
.pr-file.on{border-color:var(--acc);background:var(--adim);}

/* progress */
.pr-prog{height:2px;background:var(--c5);position:relative;overflow:hidden;}
.pr-prog-f{position:absolute;left:0;top:0;bottom:0;background:var(--acc);transition:width .8s cubic-bezier(.4,0,.2,1);}

/* results */
.pr-met-grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--c5);border-top:2px solid var(--acc);margin-bottom:22px;}
.pr-met{padding:20px 18px;border-right:1px solid var(--c5);}
.pr-met:last-child{border-right:none;}
.pr-met-v{font-family:var(--serif);font-size:26px;font-weight:700;line-height:1;letter-spacing:-0.03em;margin-bottom:5px;}

.pr-gauges{display:flex;border:1px solid var(--c5);border-top:2px solid var(--acc);margin-bottom:22px;}
.pr-gauge-c{flex:1;padding:22px 16px;border-right:1px solid var(--c5);text-align:center;transition:background .2s;}
.pr-gauge-c:last-child{border-right:none;}
.pr-gauge-c:hover{background:var(--c7);}

.pr-rec{border-left:3px solid var(--acc);padding:15px 18px;background:var(--adim);margin-bottom:20px;}

/* features */
.pr-feats{display:grid;grid-template-columns:repeat(2,1fr);border-top:2px solid var(--acc);border-left:1px solid var(--c5);}
.pr-feat{padding:44px 40px;border-right:1px solid var(--c5);border-bottom:1px solid var(--c5);position:relative;transition:background .25s;}
.pr-feat:hover{background:var(--c7);}
.pr-feat-bg{position:absolute;top:16px;right:24px;font-family:var(--serif);font-size:88px;font-weight:900;color:var(--c5);line-height:1;user-select:none;pointer-events:none;transition:color .25s;}
.pr-feat:hover .pr-feat-bg{color:var(--adim);}

/* ticker */
.pr-ticker{overflow:hidden;border-top:1px solid var(--c5);border-bottom:1px solid var(--c5);padding:11px 0;background:var(--c0);}
.pr-ticker-i{display:flex;gap:68px;width:max-content;animation:pr-tick 36s linear infinite;}
.pr-ticker-i:hover{animation-play-state:paused;}

/* live dot */
.pr-live{display:inline-flex;align-items:center;gap:7px;font-family:var(--mono);font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--ok);}
.pr-dot{width:7px;height:7px;border-radius:50%;background:var(--ok);position:relative;}
.pr-dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:var(--ok);animation:pr-ring 1.8s ease-out infinite;}

/* cta */
.pr-cta{border:1px solid var(--c5);border-top:2px solid var(--acc);padding:72px 60px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:40px;position:relative;overflow:hidden;background:var(--c0);}
.pr-cta::after{content:'';position:absolute;right:-40px;bottom:-40px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(26,79,255,.3) 0%,transparent 70%);pointer-events:none;}

/* scan */
.pr-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--acc),transparent);animation:pr-scan 3s ease-in-out infinite;pointer-events:none;}

/* responsive */
@media(max-width:960px){
  .pr-wrap{padding:0 24px;}
  .pr-stats{grid-template-columns:1fr 1fr;}
  .pr-stat:nth-child(2){border-right:none;}
  .pr-stat:nth-child(3){border-top:1px solid var(--c5);grid-column:span 2;}
  .pr-steps{grid-template-columns:1fr;}
  .pr-step{border-right:none;}
  .pr-body{grid-template-columns:1fr;}
  .pr-side{border-right:none;border-bottom:1px solid var(--c5);}
  .pr-feats{grid-template-columns:1fr;}
  .pr-met-grid{grid-template-columns:1fr 1fr;}
  .pr-met:nth-child(2){border-right:none;}
  .pr-met:nth-child(3){border-top:1px solid var(--c5);grid-column:span 2;}
  .pr-gauges{flex-direction:column;}
  .pr-gauge-c{border-right:none;border-bottom:1px solid var(--c5);}
  .pr-gauge-c:last-child{border-bottom:none;}
  .pr-hero-g{grid-template-columns:1fr !important;}
  .pr-cta{grid-template-columns:1fr;padding:44px 32px;}
}
@media(max-width:600px){
  .pr-htitle{font-size:44px !important;}
  .pr-hbtns{flex-direction:column !important;}
  .pr-stats{grid-template-columns:1fr;}
  .pr-stat{border-right:none;border-bottom:1px solid var(--c5);}
  .pr-met-grid{grid-template-columns:1fr;}
  .pr-met{border-right:none;border-bottom:1px solid var(--c5);}
}
`;

function Styles() {
  useEffect(() => {
    const id = "pr-styles-v5";
    document.getElementById(id)?.remove();
    const s = document.createElement("style");
    s.id = id; s.textContent = G;
    document.head.appendChild(s);
  }, []);
  return null;
}

function Spin() {
  return (
    <div style={{
      width:32,height:32,borderRadius:"50%",
      border:"2px solid var(--c5)",borderTopColor:"var(--acc)",
      animation:"pr-spin .7s linear infinite",flexShrink:0,
    }}/>
  );
}

function Ring({pct,color,label,sub}){
  const R=28,C=2*Math.PI*R;
  return(
    <div>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={R} fill="none" stroke="#e5e7eb" strokeWidth="3.5"/>
        <circle cx="36" cy="36" r={R} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={C} strokeDashoffset={C-(pct/100)*C}
          strokeLinecap="butt" transform="rotate(-90 36 36)"
          style={{transition:"stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)"}}/>
        <text x="36" y="33" textAnchor="middle" fill={color}
          style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,fontWeight:700}}>{pct}</text>
        <text x="36" y="44" textAnchor="middle" fill="#9ca3af"
          style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:6}}>PCT</text>
      </svg>
      <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--c3)",letterSpacing:".1em",textTransform:"uppercase",textAlign:"center",marginTop:4}}>{label}</div>
      <div style={{fontFamily:"var(--sans)",fontSize:11,color:"var(--c2)",fontWeight:600,textAlign:"center",marginTop:2}}>{sub}</div>
    </div>
  );
}

const TICKER=["AI-Powered Monitoring","97% Detection Sensitivity","48h Report Turnaround","Early Signal Detection","Treatment Effectiveness Tracking","Real-Time Blood Analysis","Clinical-Grade AI Inference","Precision Oncology","Non-Invasive Monitoring","Actionable Reports"];

const STEPS=[
  {n:"01",title:"Report Analysis",body:"The AI engine ingests the patient's complete blood panel, parses key diagnostic markers, and establishes baseline reference ranges for longitudinal comparison."},
  {n:"02",title:"Progress Assessment",body:"Multi-layer inference detects subtle variation in treatment response markers. Flags are raised when movement exceeds clinically significant thresholds."},
  {n:"03",title:"Clinical Report Output",body:"A structured, physician-ready document is produced — containing visual trends, flagged anomalies, and suggested next-step actions for the care team."},
];

const FEATS=[
  {n:"01",title:"Tracking Treatment Effectiveness Early",body:"By analyzing routine blood test data, the system identifies meaningful changes in treatment response weeks before they manifest clinically — giving physicians a critical decision window."},
  {n:"02",title:"Visual Progress Trends",body:"Every report surfaces clean, timestamped trend visualizations that distill weeks of data into immediately interpretable clinical signals."},
  {n:"03",title:"Instant Actionable Insights",body:"From a single blood draw to a structured clinical recommendation in under 48 hours. No workflow disruption, no specialist waiting time."},
  {n:"04",title:"Early Signal Detection",body:"Subtle biomarker shifts — too small for conventional imaging to register — are captured and surfaced at the precise moment intervention is most effective."},
];

const FILES=["Patient_BloodPanel_March.pdf","CBC_FullReport_Sample.pdf","Oncology_LabResults_v2.pdf"];

const RESULTS=[
  {status:"Responding Well",sc:"var(--ok)",   rec:"Continue current therapy protocol. Schedule follow-up assessment in 90 days.",ctDNA:"0.03%",conf:96,trend:"Stable",    tc:"var(--ok)",   flag:"No immediate concerns",ti:14},
  {status:"Partial Response",sc:"var(--warn)",rec:"Consult oncologist within 2 weeks. Protocol modification may be indicated.", ctDNA:"0.09%",conf:89,trend:"Increasing",tc:"var(--bad)",  flag:"Monitor closely",ti:48},
  {status:"Low Response",    sc:"var(--bad)", rec:"Immediate specialist consultation required. Consider alternative therapy.",   ctDNA:"0.21%",conf:94,trend:"Increasing",tc:"var(--bad)",  flag:"Urgent clinical review",ti:76},
];

export default function AICancerMonitoring(){
  const [stage,setStage]=useState(0);
  const [running,setRunning]=useState(false);
  const [aStep,setAStep]=useState(null);
  const [result,setResult]=useState(null);
  const [file,setFile]=useState(null);
  const [vis,setVis]=useState(false);
  const [fv,setFv]=useState([]);
  const statRef=useRef(null);
  const featRef=useRef(null);

  useEffect(()=>{
    const o1=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);o1.disconnect();}},{threshold:.1});
    if(statRef.current) o1.observe(statRef.current);
    const o2=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){FEATS.forEach((_,i)=>setTimeout(()=>setFv(p=>[...p,i]),i*130));o2.disconnect();}
    },{threshold:.1});
    if(featRef.current) o2.observe(featRef.current);
    return()=>{o1.disconnect();o2.disconnect();};
  },[]);

  function run(){
    if(running||!file) return;
    setRunning(true);setStage(1);setResult(null);setAStep(0);
    setTimeout(()=>setAStep(1),1400);
    setTimeout(()=>setAStep(2),2800);
    setTimeout(()=>{
      setResult(RESULTS[Math.floor(Math.random()*RESULTS.length)]);
      setStage(2);setRunning(false);setAStep(null);
    },4200);
  }
  function reset(){setStage(0);setResult(null);setFile(null);setAStep(null);}

  const done=(i)=>stage===2||(aStep!==null&&i<aStep);
  const act=(i)=>aStep===i&&running;

  return(
    <div className="pr">
      <Styles/>
      <div className="pr-topbar"/>

      {/* ════════ HERO ════════ */}
      <section style={{padding:"96px 0 80px"}}>
        <div className="pr-wrap">
          <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
            <div className="pr-slab" style={{paddingTop:8}}>Shri-AI · Clinical Intelligence · 2026</div>
            <div style={{flex:1}}>
              <div className="pr-over-a" style={{marginBottom:20}}>
                AI-Powered Precision Cancer Monitoring
              </div>
              <div className="pr-hero-g" style={{display:"grid",gridTemplateColumns:"1fr 400px",gap:80,alignItems:"start"}}>
                {/* Left copy */}
                <div>
                  <h1 className="pr-serif pr-htitle" style={{fontSize:72,marginBottom:32}}>
                    AI Powered<br/>
                    <span style={{color:"var(--acc)"}}>Precision</span><br/>
                    Cancer Monitoring
                  </h1>
                  <p style={{fontSize:15,color:"var(--c2)",lineHeight:1.9,maxWidth:540,marginBottom:40}}>
                    We combine clinical expertise with advanced AI to monitor cancer treatment in real time — helping doctors quickly understand if a therapy is working and enabling better decisions for patients.
                  </p>
                  <div className="pr-hbtns" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                    <button className="pr-btn" onClick={()=>document.getElementById("pr-demo")?.scrollIntoView({behavior:"smooth"})}>
                      <span>View Demo Pipeline &rarr;</span>
                    </button>
                    <button className="pr-btn-o">Learn More</button>
                  </div>
                </div>

                {/* Stats */}
                <div ref={statRef}>
                  <div className="pr-stats">
                    {[
                      {label:"Turnaround",val:"48h", sub:"Report delivery time"},
                      {label:"Sensitivity",val:"97%",sub:"ctDNA detection"},
                      {label:"Biomarkers", val:"14+", sub:"Markers analyzed"},
                    ].map((s,i)=>(
                      <div key={i} className="pr-stat" style={{
                        opacity:vis?1:0,
                        transform:vis?"none":"translateY(16px)",
                        transition:`all .55s ${i*.14}s ease`,
                      }}>
                        <div className="pr-over" style={{marginBottom:12}}>{s.label}</div>
                        <div className="pr-serif" style={{fontSize:44,marginBottom:6}}>{s.val}</div>
                        <div style={{fontFamily:"var(--sans)",fontSize:12,color:"var(--c3)"}}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    borderLeft:"3px solid var(--acc)",
                    borderBottom:"1px solid var(--c5)",
                    borderRight:"1px solid var(--c5)",
                    padding:"22px 24px",
                    background:"var(--c7)",
                    opacity:vis?1:0,
                    transform:vis?"none":"translateY(12px)",
                    transition:"all .55s .44s ease",
                  }}>
                    <div className="pr-over-a" style={{marginBottom:10}}>What Shri-AI does</div>
                    <p style={{fontSize:13,color:"var(--c2)",lineHeight:1.8}}>
                      Takes a patient's routine blood test report and analyzes it to provide clear insights on treatment progress. Identifying subtle changes early helps doctors adjust therapy sooner and more confidently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TICKER ════════ */}
      <div className="pr-ticker">
        <div className="pr-ticker-i">
          {[...TICKER,...TICKER].map((t,i)=>(
            <span key={i} style={{
              fontFamily:"var(--mono)",fontSize:9,fontWeight:600,
              letterSpacing:".18em",textTransform:"uppercase",
              color:i%2===0?"rgba(255,255,255,.75)":"rgba(99,139,255,.8)",
              display:"inline-flex",alignItems:"center",gap:14,
            }}>
              <span style={{width:3,height:3,borderRadius:"50%",background:"currentColor",opacity:.5,display:"inline-block"}}/>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ════════ HOW IT WORKS ════════ */}
      <section style={{padding:"88px 0 0"}}>
        <div className="pr-wrap">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:20}}>
            <div>
              <div className="pr-over-a" style={{marginBottom:12}}>How Our AI Monitoring Works</div>
              <h2 className="pr-serif" style={{fontSize:48}}>Predictive Insights<br/>for Better Care</h2>
            </div>
            <p style={{fontSize:13,color:"var(--c3)",maxWidth:300,lineHeight:1.85,textAlign:"right"}}>
              From a single blood draw to a structured clinical recommendation — fast, accurate, designed for doctors.
            </p>
          </div>
          <div className="pr-steps">
            {STEPS.map((s,i)=>(
              <div key={i} className="pr-step">
                <div className="pr-step-n">{s.n} — {s.title}</div>
                <h3 className="pr-serif" style={{fontSize:22,marginBottom:16,lineHeight:1.25}}>{s.title}</h3>
                <p style={{fontSize:13,color:"var(--c2)",lineHeight:1.85}}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PIPELINE DEMO ════════ */}
      <section id="pr-demo" style={{padding:"88px 0"}}>
        <div className="pr-wrap">
          <div style={{marginBottom:40}}>
            <div className="pr-over-a" style={{marginBottom:12}}>Monitoring Pipeline — Interactive Demo</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
              <h2 className="pr-serif" style={{fontSize:48}}>From Blood Test<br/>to Actionable Insights</h2>
              <p style={{fontSize:13,color:"var(--c3)",maxWidth:300,lineHeight:1.85,textAlign:"right"}}>
                Select a sample report, run the AI pipeline, and receive a structured clinical output instantly.
              </p>
            </div>
          </div>

          <div className="pr-shell">
            {/* Window bar */}
            <div className="pr-head">
              <div style={{display:"flex",alignItems:"center",gap:18}}>
                <div style={{display:"flex",gap:6}}>
                  {["#ef4444","#f59e0b","#22c55e"].map((c,i)=>(
                    <div key={i} style={{width:10,height:10,borderRadius:"50%",background:c,opacity:.7}}/>
                  ))}
                </div>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,.32)",letterSpacing:".1em",paddingLeft:12,borderLeft:"1px solid rgba(255,255,255,.12)"}}>
                  shri-ai / monitoring-pipeline / interactive-demo
                </div>
              </div>
              <div className="pr-live"><div className="pr-dot"/>Live Demo</div>
            </div>

            {/* Body */}
            <div className="pr-body">
              {/* Sidebar */}
              <div className="pr-side">
                {/* Stage progress */}
                <div>
                  <div className="pr-over" style={{marginBottom:16}}>Pipeline Stages</div>
                  {["Upload Report","AI Processing","Generate Report"].map((label,i)=>(
                    <div key={i} style={{marginBottom:16}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{
                            width:18,height:18,
                            border:`2px solid ${done(i)?"var(--ok)":act(i)?"var(--acc)":"var(--c5)"}`,
                            background:done(i)?"var(--ok)":act(i)?"var(--acc)":"transparent",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            flexShrink:0,transition:"all .3s ease",
                          }}>
                            {done(i)&&<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}
                            {act(i)&&<div style={{width:8,height:8,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,.4)",borderTopColor:"#fff",animation:"pr-spin .6s linear infinite"}}/>}
                          </div>
                          <span style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:500,letterSpacing:".06em",color:done(i)?"var(--ok)":act(i)?"var(--acc)":"var(--c3)"}}>
                            {label}
                          </span>
                        </div>
                        {done(i)&&<span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--ok)"}}>DONE</span>}
                        {act(i)&&<span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--acc)",animation:"pr-blink 1s ease-in-out infinite"}}>ACTIVE</span>}
                      </div>
                      <div className="pr-prog"><div className="pr-prog-f" style={{width:done(i)?"100%":act(i)?"52%":"0%"}}/></div>
                    </div>
                  ))}
                </div>

                {/* File selector */}
                <div>
                  <div className="pr-over" style={{marginBottom:12}}>Sample Reports</div>
                  {FILES.map((f,i)=>(
                    <div key={i} className={`pr-file${file===f?" on":""}`}
                      onClick={()=>{if(stage===0) setFile(f);}}>
                      <div style={{
                        width:28,height:34,background:"#fff",
                        border:"1px solid var(--c5)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        flexShrink:0,position:"relative",
                      }}>
                        <div style={{position:"absolute",top:0,right:0,width:7,height:7,borderLeft:"1px solid var(--c5)",borderBottom:"1px solid var(--c5)",background:"var(--c6)"}}/>
                        <span style={{fontFamily:"var(--mono)",fontSize:7,fontWeight:700,color:"var(--bad)",letterSpacing:".05em"}}>PDF</span>
                      </div>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,color:file===f?"var(--acc)":"var(--c2)",fontWeight:500,wordBreak:"break-all",lineHeight:1.5}}>
                        {f}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{marginTop:"auto",display:"flex",flexDirection:"column",gap:8}}>
                  <button className="pr-btn" onClick={run} disabled={running||!file||stage===2} style={{fontSize:10,padding:"12px 20px"}}>
                    <span style={{display:"flex",alignItems:"center",gap:8}}>
                      {running?(
                        <>
                          <div style={{width:12,height:12,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"pr-spin .6s linear infinite"}}/>
                          Processing...
                        </>
                      ):"Run Analysis"}
                    </span>
                  </button>
                  {stage!==0&&(
                    <button className="pr-btn-o" onClick={reset} style={{fontSize:10,padding:"12px 20px"}}>
                      Reset Pipeline
                    </button>
                  )}
                  {!file&&stage===0&&(
                    <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--c4)",textAlign:"center",letterSpacing:".06em"}}>
                      Select a report to begin
                    </div>
                  )}
                </div>
              </div>

              {/* ── MAIN ── */}
              <div className="pr-main">

                {/* IDLE */}
                {stage===0&&(
                  <div style={{flex:1,animation:"pr-in .4s ease"}}>
                    {/* IMAGE */}
                    <div style={{
                      width:"100%",marginBottom:28,
                      position:"relative",overflow:"hidden",
                      borderBottom:"1px solid var(--c5)",
                    }}>
                      <div className="pr-scan"/>
                      <img
                        src="/mnt/user-data/uploads/1774413099528_image.png"
                        alt="AI Biomarker Analysis — Clinical Dashboard"
                        style={{width:"100%",display:"block",objectFit:"cover",maxHeight:300}}
                        onError={e=>{
                          e.target.style.display="none";
                          const p=e.target.parentElement;
                          p.style.minHeight="180px";
                          p.style.background="var(--c7)";
                          p.style.display="flex";
                          p.style.alignItems="center";
                          p.style.justifyContent="center";
                          const d=document.createElement("div");
                          d.style.cssText="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--c4);letter-spacing:.1em;text-transform:uppercase;";
                          d.textContent="AI Analysis Dashboard Visualization";
                          p.appendChild(d);
                        }}
                      />
                      {/* Caption bar */}
                      <div style={{
                        position:"absolute",bottom:0,left:0,right:0,
                        padding:"10px 18px",
                        background:"linear-gradient(transparent,rgba(5,8,15,.72))",
                        display:"flex",alignItems:"center",justifyContent:"space-between",
                      }}>
                        <span style={{fontFamily:"var(--mono)",fontSize:8,color:"rgba(255,255,255,.6)",letterSpacing:".14em",textTransform:"uppercase"}}>
                          AI Analysis Progress — Biomarkers Identified
                        </span>
                        <span style={{fontFamily:"var(--mono)",fontSize:8,color:"rgba(255,255,255,.35)",letterSpacing:".08em"}}>
                          Select report to run pipeline
                        </span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",border:"1px solid var(--c5)",borderTop:"2px solid var(--acc)"}}>
                      {[
                        {idx:"01",text:"AI transforms a routine blood test into meaningful insights in seconds."},
                        {idx:"02",text:"Visual representation of progress trends for immediate clinical interpretation."},
                        {idx:"03",text:"Structured output ready for clinical use with no workflow disruption."},
                      ].map((h,i)=>(
                        <div key={i} style={{padding:"20px 18px",borderRight:i<2?"1px solid var(--c5)":"none"}}>
                          <div style={{fontFamily:"var(--mono)",fontSize:18,fontWeight:700,color:"var(--c5)",marginBottom:8}}>{h.idx}</div>
                          <p style={{fontSize:12,color:"var(--c2)",lineHeight:1.75}}>{h.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RUNNING */}
                {stage===1&&(
                  <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28,animation:"pr-in .3s ease"}}>
                    <Spin/>
                    <div style={{textAlign:"center"}}>
                      <div className="pr-over-a" style={{marginBottom:8}}>
                        {aStep===0&&"Stage 01 — Parsing report..."}
                        {aStep===1&&"Stage 02 — AI inference running..."}
                        {aStep===2&&"Stage 03 — Building clinical output..."}
                      </div>
                      <div className="pr-serif" style={{fontSize:24}}>
                        {aStep===0&&"Reading blood panel data"}
                        {aStep===1&&"Analyzing biomarker patterns"}
                        {aStep===2&&"Generating structured report"}
                      </div>
                    </div>
                    <div style={{width:220}}>
                      <div className="pr-prog" style={{height:3}}>
                        <div className="pr-prog-f" style={{width:aStep===0?"30%":aStep===1?"64%":"88%"}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                        <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--c3)"}}>Processing</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:9,fontWeight:700,color:"var(--acc)"}}>
                          {aStep===0?"30%":aStep===1?"64%":"88%"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* RESULT */}
                {stage===2&&result&&(
                  <div style={{animation:"pr-up .45s ease both"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:10}}>
                      <div>
                        <div className="pr-over-a" style={{marginBottom:6}}>AI Monitoring Report</div>
                        <div className="pr-serif" style={{fontSize:26}}>Analysis Complete</div>
                      </div>
                      <div style={{
                        fontFamily:"var(--mono)",fontSize:9,fontWeight:600,
                        letterSpacing:".12em",textTransform:"uppercase",
                        color:"var(--ok)",border:"1px solid var(--ok)",padding:"5px 12px",
                      }}>
                        Verified · {new Date().toLocaleDateString("en-GB")}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="pr-met-grid">
                      {[
                        {label:"Treatment Status",val:result.status,color:result.sc,sub:`ctDNA ${result.ctDNA}`},
                        {label:"Marker Trend",    val:result.trend,  color:result.tc,sub:"vs previous draw"},
                        {label:"AI Confidence",   val:`${result.conf}%`,color:"var(--acc)",sub:"Inference certainty"},
                      ].map((m,i)=>(
                        <div key={i} className="pr-met" style={{animation:`pr-up .4s ${i*.09}s ease both`}}>
                          <div className="pr-over" style={{marginBottom:10}}>{m.label}</div>
                          <div className="pr-met-v" style={{color:m.color}}>{m.val}</div>
                          <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--c3)",marginTop:4}}>{m.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation */}
                    <div className="pr-rec" style={{animation:"pr-up .4s .24s ease both"}}>
                      <div className="pr-over-a" style={{marginBottom:8}}>Clinical Recommendation</div>
                      <div style={{fontFamily:"var(--sans)",fontSize:14,fontWeight:600,color:"var(--c1)",lineHeight:1.7}}>
                        {result.rec}
                      </div>
                    </div>

                    {/* Gauges */}
                    <div className="pr-gauges" style={{animation:"pr-up .4s .3s ease both"}}>
                      <div className="pr-gauge-c"><Ring pct={result.conf} color="var(--acc)" label="confidence" sub="AI Score"/></div>
                      <div className="pr-gauge-c"><Ring pct={Math.min(99,Math.round(parseFloat(result.ctDNA)*380))} color={result.sc} label="ctDNA" sub="Marker Load"/></div>
                      <div className="pr-gauge-c"><Ring pct={result.ti} color={result.tc} label="activity" sub="Tumour Index"/></div>
                    </div>

                    {/* Flag row */}
                    <div style={{
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"12px 16px",border:"1px solid var(--c5)",
                      borderLeft:"2px solid var(--acc)",flexWrap:"wrap",gap:10,
                      animation:"pr-up .4s .38s ease both",
                    }}>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--c3)"}}>
                        Flag: <span style={{color:"var(--c1)",fontWeight:600}}>{result.flag}</span>
                      </div>
                      <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ok)",fontWeight:600}}>
                        Report Ready for Clinician
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section style={{padding:"0 0 88px"}}>
        <div className="pr-wrap">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:40,flexWrap:"wrap",gap:16}}>
            <div>
              <div className="pr-over-a" style={{marginBottom:12}}>AI Monitoring Output</div>
              <h2 className="pr-serif" style={{fontSize:48}}>Smarter Insights.<br/>Better Care.</h2>
            </div>
            <p style={{fontSize:13,color:"var(--c3)",maxWidth:300,lineHeight:1.85,textAlign:"right"}}>
              Shri-AI turns every blood test into a real-time treatment monitoring report — supporting doctors without replacing their expertise.
            </p>
          </div>
          <div ref={featRef} className="pr-feats">
            {FEATS.map((f,i)=>(
              <div key={i} className="pr-feat" style={{
                opacity:fv.includes(i)?1:0,
                transform:fv.includes(i)?"none":"translateY(20px)",
                transition:`all .5s ${i*.12}s ease`,
              }}>
                <div className="pr-feat-bg">{f.n}</div>
                <div className="pr-over-a" style={{marginBottom:16}}>Feature {f.n}</div>
                <h3 className="pr-serif" style={{fontSize:22,marginBottom:16,lineHeight:1.25,maxWidth:300}}>{f.title}</h3>
                <p style={{fontSize:13,color:"var(--c2)",lineHeight:1.85,maxWidth:340}}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section style={{padding:"0 0 96px"}}>
        <div className="pr-wrap">
          <div className="pr-cta">
            <div style={{position:"relative",zIndex:1}}>
              <div className="pr-over" style={{marginBottom:16,color:"rgba(255,255,255,.3)"}}>
                Shri-AI · Precision Oncology
              </div>
              <h2 className="pr-serif" style={{fontSize:52,color:"#fff",marginBottom:18}}>
                Supporting doctors<br/>with actionable insights
              </h2>
              <p style={{fontSize:14,color:"rgba(255,255,255,.5)",maxWidth:460,lineHeight:1.85,marginBottom:36}}>
                Shri-AI turns every blood test into a real-time treatment monitoring report — without replacing clinical expertise.
              </p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <button className="pr-btn"
                  style={{background:"#fff",color:"var(--c0)",borderColor:"#fff"}}
                  onClick={()=>document.getElementById("pr-demo")?.scrollIntoView({behavior:"smooth"})}>
                  <span>Try the Demo</span>
                </button>
                <button className="pr-btn-o" style={{borderColor:"rgba(255,255,255,.22)",color:"rgba(255,255,255,.6)"}}>
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pr-topbar"/>
    </div>
  );
}
