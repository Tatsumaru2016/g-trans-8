import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Languages, 
  ArrowRight, 
  Cpu, 
  Zap, 
  Globe, 
  Activity, 
  CornerDownRight, 
  Radio, 
  Volume2, 
  Moon, 
  Sun, 
  ExternalLink,
  Sliders,
  Sparkles,
  RefreshCw,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NetworkUniverse, LANGUAGES } from './components/NetworkUniverse';
import { SceneConfig } from './types';

// Narrative step configuration (7 Scenes)
const SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "Connected Humans",
    subtitle: "The emergence of global dialog",
    description: "G.trans begins at the individual scale. Over 1,500 highly active user nodes are mapped across the digital globe. Their conversations traverse borders, instantly translated dynamically as communication scanning arcs activate the surface.",
    stats: [
      { label: "Active User Nodes", value: "1,500+" },
      { label: "Direct Connections", value: "45 Arcs" },
      { label: "Dialogue Pipelines", value: "Simultaneous" }
    ],
    visuals: ["Human Spheres Mapping", "Dynamic Data Lines", "Active Scanning"]
  },
  {
    id: 2,
    title: "Expanding Connections",
    subtitle: "Exponential citizen convergence",
    description: "As traditional language borders fade, conversational density grows exponentially. Thousands of digital tunnels wrap around the globe, streaming information and greetings. G.trans handles translations directly within sub-millisecond pipelines.",
    stats: [
      { label: "Daily Dialogues", value: "892,104" },
      { label: "Core Bandwidth", value: "480 Gbps" },
      { label: "Average Routing Delay", value: "1.12ms" }
    ],
    visuals: ["Instanced Mesh Node Fields", "Flythrough High Velocity Tunnels", "Language Clouds"]
  },
  {
    id: 3,
    title: "Nations Connect",
    subtitle: "Sovereign grids dissolving beautifully",
    description: "Zooming into illuminated continental frameworks. G.trans bridges sovereign borders seamlessly, letting governments, businesses, and cultures sync instantly. Intercontinental highways link diverse languages without friction.",
    stats: [
      { label: "Sovereign Connections", value: "196 Nations" },
      { label: "Border Links", value: "4,212 Streams" },
      { label: "Daily Inbound Queries", value: "14.8M" }
    ],
    visuals: ["National Coordinate Grids", "Primary Data Arcs", "Cultural Integration Nodes"]
  },
  {
    id: 4,
    title: "Planetary Expansion",
    subtitle: "Interstellar context highways",
    description: "The communication grid expands deep into light-years. High-frequency orbital pathways bridge Earth with the outer worlds of our Solar System: Mars, Venus, Jupiter, Saturn, Neptune, and Mercury, transporting context and conversation through deep space.",
    stats: [
      { label: "Interstellar Nodes", value: "7 Worlds" },
      { label: "Orbital Data Bridges", value: "12 Highways" },
      { label: "Signal Coverage Radius", value: "6.4B Kilometers" }
    ],
    visuals: ["Planetary Alignments", "Orbital Data Rings", "Space Dust Background"]
  },
  {
    id: 5,
    title: "The G.trans Hub",
    subtitle: "The master routing center",
    description: "The camera crashes back to Earth. G.trans serves as the core processor of our civilization, maintaining semantic structures, checking contexts, and routing languages dynamically so the whole planet functions in perfect harmony.",
    stats: [
      { label: "Context Accuracy Rate", value: "99.98%" },
      { label: "Virtual Cores Active", value: "4,096 Thread" },
      { label: "System Load Factor", value: "Optimal" }
    ],
    visuals: ["Hero Earth Centered", "Heavy Data Bridges", "Dynamic Energy Halo"]
  },
  {
    id: 6,
    title: "Infinite Network Growth",
    subtitle: "Autogenous communication ecosystems",
    description: "Dialogue patterns form self-generating structures, multiplying connection pathways organically. Information density reaches its peak, laying the groundwork for a continuously developing linguistic network.",
    stats: [
      { label: "Dynamic Pathways", value: "Unbounded" },
      { label: "Network State", value: "Self-governing" },
      { label: "Civilization Index", value: "Type I Node" }
    ],
    visuals: ["Ecosystem Growth Swarms", "Multilingual Rivers", "Data Wave Pulses"]
  },
  {
    id: 7,
    title: "The G.trans Revelation",
    subtitle: "Language is no longer a limit",
    description: "We reach the ultimate cybernetic convergence. Through G.trans, there are no separate peoples—only a single continuous, open, and fully connected global family. Every thought, word, and planet operates in harmonious synchronization.",
    stats: [
      { label: "Global Unity Density", value: "1.0 Perfect" },
      { label: "Adaptive Synchronization", value: "Instantaneous" },
      { label: "Next Project Phase", value: "Galactic Grid" }
    ],
    visuals: ["Intense Central Glow", "Infinite Horizon Tunnels", "Universal Integration Resonance"]
  }
];

// Aesthetic mock translation feed updates to simulate live routing activity
const MOCK_FLOW_LOGS = [
  { from: "JA", to: "FR", text: "お元気ですか？", result: "Comment allez-vous?" },
  { from: "EN", to: "KO", text: "Welcome to orbit.", result: "궤도 진입을 환영합니다." },
  { from: "ES", to: "AR", text: "Paz en la tierra.", result: "السلام في العالم." },
  { from: "HI", to: "ZH", text: "हम सब जुड़े हुए हैं।", result: "我们都是连接在一起的。" },
  { from: "FR", to: "EN", text: "Le temps est relatif.", result: "Time is relative." },
  { from: "DE", to: "JA", text: "Künstliche Intelligenz.", result: "人工知能。" },
  { from: "PT", to: "ES", text: "Conexões infinitas.", result: "Conexiones infinitas." },
  { from: "RU", to: "EN", text: "Открой свое сознание.", result: "Open your mind." }
];

export default function App() {
  // Lerped scrolling variables
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0); 
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  // Custom interactive routing states
  const [customFrom, setCustomFrom] = useState('en');
  const [customTo, setCustomTo] = useState('ja');
  const [customText, setCustomText] = useState('Language is an infinite connection.');
  const [customRouteTrigger, setCustomRouteTrigger] = useState<{
    from: string;
    to: string;
    text: string;
    triggeredAt: number;
  } | null>(null);

  // Live simulation telemetry feeds
  const [systemUptime, setSystemUptime] = useState("02:44:12");
  const [currentLogs, setCurrentLogs] = useState(MOCK_FLOW_LOGS.slice(0, 3));
  const [activeChannelCount, setActiveChannelCount] = useState(134291);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef(0);

  const syncScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return;

    const progress = container.scrollTop / maxScroll;
    setScrollPercent(progress);

    const floatScene = progress * (SCENES.length - 1);
    const sceneIndex = Math.min(Math.round(floatScene), SCENES.length - 1);

    setCurrentSceneIndex((prev) => {
      if (sceneIndex === prev) return prev;
      if (!isMuted) {
        try {
          const osc = new AudioContext();
          const node = osc.createOscillator();
          const gain = osc.createGain();
          node.type = 'sine';
          node.frequency.setValueAtTime(320 + sceneIndex * 80, osc.currentTime);
          gain.gain.setValueAtTime(0.012, osc.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, osc.currentTime + 0.12);
          node.connect(gain);
          gain.connect(osc.destination);
          node.start();
          node.stop(osc.currentTime + 0.14);
        } catch (_) {}
      }
      return sceneIndex;
    });
  }, [isMuted]);

  const scheduleScrollSync = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      syncScrollState();
    });
  }, [syncScrollState]);

  // Proxy wheel/touch to scroll container (HUD panels sit above z-10 scroll layer)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const shouldIgnoreScrollProxy = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(target.closest('input, textarea, select'));
    };

    const onWheel = (e: WheelEvent) => {
      if (shouldIgnoreScrollProxy(e.target)) return;
      container.scrollTop += e.deltaY;
      scheduleScrollSync();
      e.preventDefault();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (shouldIgnoreScrollProxy(e.target)) return;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (shouldIgnoreScrollProxy(e.target)) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      container.scrollTop += deltaY;
      scheduleScrollSync();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreScrollProxy(e.target)) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        container.scrollTop += window.innerHeight * 0.85;
        scheduleScrollSync();
        e.preventDefault();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        container.scrollTop -= window.innerHeight * 0.85;
        scheduleScrollSync();
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    scheduleScrollSync();

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [scheduleScrollSync]);

  // Time metrics logic
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      // Format system up time elegantly
      const diffSecs = Math.floor((Date.now() - start) / 1000);
      const hrs = String(Math.floor(diffSecs / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0');
      const secs = String(diffSecs % 60).padStart(2, '0');
      setSystemUptime(`${hrs}:${mins}:${secs}`);

      // Gently oscillate live connections count (re-emphasizing live data ecosystem)
      setActiveChannelCount(prev => prev + Math.floor(Math.random() * 21) - 10);
    }, 1000);

    // Swap transaction logs over time
    const logInterval = setInterval(() => {
      setCurrentLogs(prev => {
        const nextIdx = Math.floor(Math.random() * MOCK_FLOW_LOGS.length);
        const nextLog = MOCK_FLOW_LOGS[nextIdx];
        // Ensure no immediate duplicates for high-end feel
        const filtered = prev.filter(l => l.text !== nextLog.text);
        return [nextLog, ...filtered.slice(0, 2)];
      });
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(logInterval);
    };
  }, []);

  // Update scroll status when the scroll container moves
  const handleScroll = () => {
    scheduleScrollSync();
  };

  // Jump smoothly to a specific scene by clicking on indicators/sidebar nodes
  const jumpToScene = (idx: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Calculate precise target scroll coordinates
    const totalScrollableHeight = container.scrollHeight - container.clientHeight;
    const targetScrollTop = (idx / (SCENES.length - 1)) * totalScrollableHeight;

    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    scheduleScrollSync();
  };

  // Action callback when user triggers "ROUTE DESIGN" in Sandbox Translator
  const handleRouteEstablish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    // Dispatch the payload down to the WebGL Three.js visual engine wrapper
    setCustomRouteTrigger({
      from: customFrom,
      to: customTo,
      text: customText,
      triggeredAt: Date.now()
    });

    // Make an elegant synthetic synthesizer routing noise
    if (!isMuted) {
      try {
        const audioCtx = new AudioContext();
        // Node 1
        const osc1 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.6);
        
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.61);
        
        osc1.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.62);
      } catch (_) {}
    }
  };

  // Get current scene settings
  const activeScene = SCENES[currentSceneIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* 1. THREE.JS IMMERSIVE SPACE CANVAS BACKGROUND */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <NetworkUniverse 
          scrollProgress={scrollPercent * (SCENES.length - 1)} 
          customRoute={customRouteTrigger} 
        />
      </div>

      {/* 2. PREMIUM AMBIENT GLASSMORPHIC HEADER */}
      <header className="absolute top-0 inset-x-0 h-20 bg-linear-to-b from-white/60 via-white/20 to-transparent backdrop-blur-xs border-b border-slate-200/10 z-30 px-6 sm:px-12 flex items-center justify-between pointer-events-none select-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="relative w-9 h-9 bg-slate-900 flex items-center justify-center rounded-lg shadow-lg">
            <span className="text-white font-mono font-bold text-lg">G</span>
            {/* Pulsing beacon indicator */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-slate-800 font-extrabold">G.trans</span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-mono">Ver. 4.0.0</span>
          </div>
        </div>

        {/* Global Metric Indicators (Literal, Human labels only) */}
        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">ACTIVE GLOBAL PIPELINES</span>
            <span className="font-mono text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              {activeChannelCount.toLocaleString()} 
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">SESSION RUNTIME</span>
            <span className="font-mono text-xs font-semibold text-slate-700 mt-0.5">
              {systemUptime}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">LATENCY INDEX</span>
            <span className="font-mono text-xs font-bold text-rose-500 flex items-center gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5" />
              1.12ms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Synthesizer Feedback Sound Button */}
          <button 
            type="button"
            id="synth-sound-toggler"
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 border border-slate-200 bg-white/60 hover:bg-white backdrop-blur-sm shadow-xs flex items-center justify-center rounded-full transition-all cursor-pointer text-slate-700"
            title={isMuted ? "Unmute UI synthesis sound effects" : "Mute audio synthesis feedback"}
          >
            <Volume2 className={`w-4 h-4 transition-all ${isMuted ? 'opacity-45 line-through' : 'text-slate-900 animate-bounce'}`} />
          </button>
        </div>
      </header>

      {/* 3. SMOOTH VIRTUAL CHRONOLOGY SCROLL CONTAINER */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full overflow-y-scroll z-10 snap-y snap-mandatory scroll-smooth pointer-events-none"
        id="narrative-vscroll-engine"
      >
        {/* Generate spacious layout anchors that trigger canvas camera steps */}
        {SCENES.map((sc, index) => (
          <section 
            key={sc.id} 
            className="w-full h-screen snap-start relative flex items-center pointer-events-none"
            id={`experience-checkpoint-0${sc.id}`}
          >
            {/* Scroll Anchor label visually positioning height step */}
            <div className="absolute right-6 sm:right-12 top-10 font-mono text-xs text-slate-300 pointer-events-none">
              NARRATIVE LAYER 0{sc.id} / 07
            </div>
          </section>
        ))}
      </div>

      {/* 4. COHESIVE NARRATIVE GLASS PANEL (DYNAMIC OVERLAY FIXED ON TOP LAYER) */}
      <div className="absolute left-6 sm:left-12 bottom-6 sm:bottom-12 max-w-lg w-[calc(100%-3rem)] bg-white/70 backdrop-blur-2xl border border-white/50 p-6 sm:p-8 rounded-2xl shadow-2xl z-20 pointer-events-auto select-none">
        
        {/* Top chronological tags */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-600 block flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-ping" />
            Active Scene {activeScene.id} of 7
          </span>
          <span className="font-mono text-xs text-slate-400 font-bold">
            G.trans Network Chronology
          </span>
        </div>

        {/* Dynamic transition block for Content descriptions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col"
          >
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
              {activeScene.subtitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans tracking-tight font-extrabold text-slate-900 mt-1">
              {activeScene.title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-3.5">
              {activeScene.description}
            </p>

            {/* Sub components layout stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
              {activeScene.stats.map((st, sidx) => (
                <div key={sidx} className="flex flex-col">
                  <span className="font-mono text-[8px] uppercase tracking-wide text-slate-400 font-semibold">
                    {st.label}
                  </span>
                  <span className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5">
                    {st.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Procedural Visualizers metadata tags list */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {activeScene.visuals.map((vis, vidx) => (
                <span 
                  key={vidx} 
                  className="font-mono text-[8px] uppercase px-2 py-1 bg-slate-100/70 border border-slate-200/40 rounded-sm text-slate-500 font-semibold"
                >
                  {vis}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Chronological Navigation Dots under information card */}
        <div className="flex items-center gap-2 mt-7 pt-4 border-t border-slate-100">
          {SCENES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              id={`nav-scene-quickpoint-0${idx}`}
              onClick={() => jumpToScene(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSceneIndex === idx ? 'w-8 bg-slate-900' : 'w-2.5 bg-slate-200 hover:bg-slate-400'
              }`}
              title={`Jump smoothly to Scene 0${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 5. LIVE INTERACTIVE TRANSLATOR SANDBOX (FLOATING RIGHT PANEL) */}
      <div className="absolute right-6 sm:right-12 top-24 max-w-sm w-[calc(100%-3rem)] bg-white/70 backdrop-blur-2xl border border-white/50 p-6 rounded-2xl shadow-xl z-20 pointer-events-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-rose-500 rounded-sm flex items-center justify-center">
            <Sliders className="w-3 h-3 text-white" />
          </div>
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-slate-800 font-extrabold flex-1">
            Universal Core Sandbox
          </h3>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
          Choose from-to languages on G.trans and type a custom message to project it live through the 3D grid pathways.
        </p>

        {/* Routing Selector Forms */}
        <form onSubmit={handleRouteEstablish} className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="route-source-lang" className="block font-mono text-[8px] uppercase tracking-wider text-slate-400 mb-1">
                Source Node
              </label>
              <select
                id="route-source-lang"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="w-full text-xs bg-slate-100/80 border border-slate-200 px-2.5 py-1.5 rounded-md text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-rose-400 focus:border-rose-400 font-semibold cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="route-target-lang" className="block font-mono text-[8px] uppercase tracking-wider text-slate-400 mb-1">
                Target Node
              </label>
              <select
                id="route-target-lang"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="w-full text-xs bg-slate-100/80 border border-slate-200 px-2.5 py-1.5 rounded-md text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-rose-400 focus:border-rose-400 font-semibold cursor-pointer"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} disabled={l.code === customFrom}>
                    {l.name} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="route-custom-text" className="block font-mono text-[8px] uppercase tracking-wider text-slate-400 mb-1 flex justify-between">
              <span>MESSAGE CONTENT</span>
              <span className="text-[7px] text-slate-300 font-mono">MAX 80 CHARS</span>
            </label>
            <div className="relative">
              <input
                id="route-custom-text"
                type="text"
                maxLength={80}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full text-xs bg-slate-100/80 border border-slate-200 px-3 py-2.5 pr-8 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-rose-400 focus:border-rose-400 font-medium"
                placeholder="Type anything to translate and route..."
              />
              <button
                type="button"
                id="reset-message-template"
                onClick={() => setCustomText("Language is an infinite connection.")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-1 rounded-sm transition-all cursor-pointer"
                title="Reset input text format"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick templates trigger buttons */}
          <div className="flex gap-1 items-center">
            <span className="font-mono text-[7px] uppercase tracking-wider text-slate-400 mr-2">Quick presets:</span>
            <button
              type="button"
              id="preset-connect-globe"
              onClick={() => setCustomText("Welcome to the infinite connection.")}
              className="font-mono text-[8px] bg-slate-100 hover:bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded-sm border border-slate-200/50 transition-all cursor-pointer"
            >
              "Infinite Connection"
            </button>
            <button
              type="button"
              id="preset-universal-grect"
              onClick={() => setCustomText("Hello Universe! G.trans is active.")}
              className="font-mono text-[8px] bg-slate-100 hover:bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded-sm border border-slate-200/50 transition-all cursor-pointer"
            >
              "Hello Universe!"
            </button>
          </div>

          <button
            type="submit"
            id="trigger-route-engine-submit"
            className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-900 hover:shadow-lg active:scale-98 text-white px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest text-center flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer group"
          >
            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            ESTABLISH CONNECTION
          </button>
        </form>

        {/* Sandbox translation status overlay feedback */}
        {customRouteTrigger && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
              <span className="font-mono text-[9px] font-bold text-rose-800 uppercase tracking-widest">
                TRANSMISSION ROUTED SUCCESSFULLY
              </span>
            </div>
            <p className="text-[10px] text-rose-700 leading-normal">
              Text routed from <span className="font-bold">{customFrom.toUpperCase()}</span> node, projected across 3D bezier matrix into <span className="font-bold">{customTo.toUpperCase()}</span> coordinates.
            </p>
          </div>
        )}

        {/* Immersive Local Translation Feed Activity Dashboard */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              LIVE METROPOLIS LOG
            </span>
            <span className="text-[8px] text-slate-300 font-mono text-[8px]">ROUTER SECURE</span>
          </div>

          {/* Scrolling simulated logs block */}
          <div className="space-y-1.5 text-[10px] font-mono select-none">
            {currentLogs.map((log, idx) => (
              <div 
                key={log.text} 
                className="p-2 bg-slate-100/60 rounded border border-slate-200/20 text-slate-600 hover:bg-slate-100 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between font-bold text-[8px] text-slate-400 mb-0.5">
                  <span className="flex items-center gap-0.5">
                    {log.from} <ArrowRight className="w-2 h-2 text-rose-400" /> {log.to}
                  </span>
                  <span className="text-[8px] text-cyan-600">✓ SECURED</span>
                </div>
                <div className="text-[10px] text-slate-800 line-clamp-1">
                  "{log.text}"
                </div>
                <div className="text-[10px] text-rose-600 mt-0.5 font-bold flex items-center gap-1">
                  <CornerDownRight className="w-2.5 h-2.5" />
                  "{log.result}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. CORNER CONTROLS HEADER HUD (LEFT SIDEBAR CHRONOLOGY LIST) */}
      <div className="hidden lg:flex absolute left-6 sm:left-12 top-24 flex-col gap-1 z-20 pointer-events-auto select-none">
        <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400 font-extrabold mb-2 ml-1">
          Grid Layers
        </span>
        {SCENES.map((sc, index) => (
          <button
            key={sc.id}
            type="button"
            id={`tab-scene-jump-${sc.id}`}
            onClick={() => jumpToScene(index)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer font-mono text-[10px] uppercase border group ${
              currentSceneIndex === index 
                ? 'bg-slate-900 border-slate-800 text-white font-bold shadow-md' 
                : 'bg-white/40 hover:bg-white/90 text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <span className={`w-3.5 h-3.5 flex items-center justify-center rounded-xs text-[8px] font-bold ${
              currentSceneIndex === index ? 'bg-rose-500 text-white' : 'bg-slate-100/80 text-slate-400 group-hover:bg-slate-200'
            }`}>
              {index + 1}
            </span>
            <span className="tracking-wider">{sc.title}</span>
          </button>
        ))}
      </div>

      {/* 7. BOTTOM FOOTER & INSTRUCTIONS HELP MODAL */}
      <footer className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 z-20 flex flex-col items-end gap-1.5 pointer-events-none select-none text-[10px] font-mono text-slate-400">
        <p className="pointer-events-auto flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-full border border-white/60 text-slate-600 backdrop-blur-xs">
          <span>Scroll down to navigate chronology</span>
          <span className="inline-block animate-bounce text-slate-800 italic font-bold">↓↓</span>
        </p>
        <span className="mr-3 opacity-75">
          G.trans Communication Ecosystem © 2026
        </span>
      </footer>

      {/* 8. AMBIENT WHITE/SLATE CYBER DECORATIVE GRID GRADIENT */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-50/70 via-slate-50/20 to-transparent pointer-events-none z-5" />
    </div>
  );
}
