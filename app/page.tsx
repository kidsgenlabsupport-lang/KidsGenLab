"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { ShoppingCart, RotateCcw, ArrowRight, ShieldCheck } from "lucide-react";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton";
import Footer from "../components/Footer";
import { getActiveAffiliateRef } from "../components/AffiliateTracker";

const JumpingTopSiyaCoin = ({ size, onClick, style = {} }: { size?: number; onClick?: (e: React.MouseEvent) => void; style?: React.CSSProperties }) => (
  <span
    onClick={onClick}
    className="run-settle-siya-coin-wrapper"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      margin: '0 4px',
      cursor: 'pointer',
      userSelect: 'none',
      position: 'relative',
      top: '-2px',
      ...style
    }}
    title="Tap Siya Coin to explore Let's Play!"
  >
    <span className="settled-jumping-coin-inner">
      <img
        src="/siya_coin_clean.png"
        alt="Siya Coin"
        className="hero-top-siya-coin-img"
        style={{
          width: size ? `${size}px` : undefined,
          height: 'auto',
          display: 'inline-block',
          transform: 'scaleX(-1)',
          imageRendering: '-webkit-optimize-contrast'
        }}
      />
    </span>
  </span>
);

const StaticSiyaCoin = ({ size, flipped = false, style = {} }: { size?: number; flipped?: boolean; style?: React.CSSProperties }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      margin: '0 6px',
      position: 'relative',
      top: '-2px',
      ...style
    }}
  >
    <img
      src="/siya_coin_clean.png"
      alt="Siya Coin"
      className="static-siya-coin-img"
      style={{
        width: size ? `${size}px` : undefined,
        height: 'auto',
        display: 'inline-block',
        transform: flipped ? 'scaleX(-1)' : 'none',
        imageRendering: '-webkit-optimize-contrast'
      }}
    />
  </span>
);

const StarRating = ({ rating = 5, size = 18 }: { rating?: number; size?: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" style={{ filter: 'drop-shadow(0 1px 3px rgba(245, 158, 11, 0.45))' }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        } else if (i === fullStars && hasHalf) {
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 3px rgba(245, 158, 11, 0.45))' }}>
              <defs>
                <linearGradient id={`halfStar-${i}`}>
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={`url(#halfStar-${i})`} stroke="#D97706" strokeWidth="0.8" />
            </svg>
          );
        } else {
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        }
      })}
    </div>
  );
};

const SuperFlightSection = ({ className = "" }: { className?: string }) => (
  <section className={`super-flight-section ${className}`}>
    <div className="fly-track">
      <div className="super-child-wrapper">
        <div className="super-child-group">
          <div className="super-speech-bubble">Hey, Superboy!</div>
          {/* Character with blue wave trail */}
          <div className="super-child-scene">
            <div className="blue-wave-trail">
              <span className="wave w1"></span>
              <span className="wave w2"></span>
              <span className="wave w3"></span>
            </div>
            <img
              src="/anime_superman_sleep.png"
              alt="Superhero Child Flying"
              className="super-child-anime super-child-flipped"
            />
          </div>
        </div>
      </div>

      <div className="super-girl-wrapper">
        <div className="super-child-group">
          <div className="super-speech-bubble">Hey, Supergirl!</div>
          <div className="super-child-scene">
            <img
              src="/super_girl.png"
              alt="Supergirl Child Flying"
              className="super-child-anime"
            />
            <div className="blue-wave-trail-girl">
              <span className="wave-girl w1"></span>
              <span className="wave-girl w2"></span>
              <span className="wave-girl w3"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500; // 1.5 seconds
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

// Real Person Lifecycle stage data
const STAGES = [
  { maxAge: 3, icon: "👶", label: "Infancy", dress: "👕 Baby Onesie", color: "#60a5fa" },
  { maxAge: 7, icon: "🧒", label: "Early Childhood", dress: "🩳 Playful Casuals", color: "#fb923c" },
  { maxAge: 12, icon: "👦", label: "Late Childhood", dress: "🎒 School Uniform", color: "#a78bfa" },
  { maxAge: 16, icon: "🧑", label: "Adolescence", dress: "🧢 Teen Streetwear", color: "#f472b6" },
  { maxAge: 22, icon: "👨", label: "Young Adult", dress: "👕 College Casual", color: "#34d399" },
  { maxAge: 28, icon: "🤵", label: "Marriage", dress: "🤵 Wedding Suit", color: "#fbbf24" },
  { maxAge: 38, icon: "👨", label: "Family Life", dress: "👔 Smart Casual", color: "#38bdf8" },
  { maxAge: 50, icon: "👨‍💼", label: "Career Peak", dress: "💼 Business Formal", color: "#10b981" },
  { maxAge: 60, icon: "👴", label: "Retirement", dress: "🎽 Leisure Wear", color: "#94a3b8" },
  { maxAge: 999, icon: "🧓", label: "Golden Years", dress: "🧥 Comfort Style", color: "#c084fc" },
];

const CharacterCourier = ({ startAge, endAge }: { startAge: number, endAge: number }) => {
  const [currentAge, setCurrentAge] = useState(startAge);
  const getStage = (age: number) => STAGES.find(s => age <= s.maxAge) || STAGES[STAGES.length - 1];
  const [stage, setStage] = useState(getStage(startAge));

  useEffect(() => {
    const totalDurationMs = 3000;
    const intervalTime = totalDurationMs / ((endAge - startAge) || 1);
    const interval = setInterval(() => {
      setCurrentAge(prev => {
        const next = prev + 1;
        if (next > endAge) { clearInterval(interval); return prev; }
        setStage(getStage(next));
        return next;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [startAge, endAge]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: 'all 0.4s ease' }}>
      {/* Stage label */}
      <div style={{
        fontSize: '0.72rem', fontWeight: 900, color: 'var(--primary-teal)',
        textTransform: 'uppercase', background: '#fff', padding: '2px 10px',
        borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
        letterSpacing: '0.06em', whiteSpace: 'nowrap'
      }}>
        {stage.label}
      </div>
      {/* Face emoji */}
      <div style={{
        fontSize: '4.8rem',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
        lineHeight: 1.1,
        transition: 'all 0.3s ease'
      }}>
        {stage.icon}
      </div>
      {/* Dress code badge */}
      <div style={{
        background: stage.color, color: '#fff',
        padding: '3px 10px', borderRadius: '20px',
        fontSize: '0.65rem', fontWeight: 800,
        boxShadow: `0 4px 12px ${stage.color}55`,
        whiteSpace: 'nowrap', transition: 'background 0.4s ease'
      }}>
        {stage.dress}
      </div>
      {/* Age badge */}
      <div style={{
        background: '#0f172a', color: '#fff',
        padding: '3px 14px', borderRadius: '50px',
        fontSize: '0.85rem', fontWeight: 900,
        boxShadow: '0 6px 12px rgba(0,0,0,0.25)'
      }}>
        AGE {currentAge}
      </div>
    </div>
  );
};





// ─── TRADE FUN SECTION ──────────────────────────────────────────────────────

type ToyType = 'car' | 'ball';
interface ToyInfo { id: ToyType; name: string; color: string; }
const TOYS: Record<ToyType, ToyInfo> = {
  car: { id: 'car', name: 'Blue Toy Car', color: '#0ea5e9' },
  ball: { id: 'ball', name: 'Orange Toy Ball', color: '#f97316' },
};

function ToyIcon({ type, size = 64 }: { type: ToyType; size?: number }) {
  if (type === 'car') return (
    <svg width={size} height={size} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 45C8 40 12 30 22 25C32 20 45 20 52 25L75 30C82 31.5 88 35 90 42C92 49 92 60 90 62C88 64 82 64 78 64H15C10 64 8 60 8 45Z" fill="#0ea5e9" stroke="#0369a1" strokeWidth="4" strokeLinejoin="round" />
      <path d="M30 24.5C38 20.5 48 20.5 54 24.5C57 26.5 64 28 69 29.5L69 42H25C25 38 27.5 25.5 30 24.5Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="4" strokeLinejoin="round" />
      <line x1="47" y1="22" x2="47" y2="42" stroke="#0369a1" strokeWidth="4" />
      <circle cx="28" cy="62" r="14" fill="#1e293b" stroke="#0ea5e9" strokeWidth="4" />
      <circle cx="28" cy="62" r="6" fill="#f8fafc" />
      <circle cx="72" cy="62" r="14" fill="#1e293b" stroke="#0ea5e9" strokeWidth="4" />
      <circle cx="72" cy="62" r="6" fill="#f8fafc" />
      <circle cx="28" cy="62" r="1.5" fill="#0369a1" />
      <circle cx="72" cy="62" r="1.5" fill="#0369a1" />
      <ellipse cx="88" cy="46" rx="4" ry="6" fill="#fef08a" stroke="#0369a1" strokeWidth="2" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#f97316" stroke="#c2410c" strokeWidth="5" />
      <path d="M10 50C25 30 40 30 50 50C60 70 75 70 90 50" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
      <path d="M12 40C26 23 42 23 51 40C60 57 74 57 88 40" stroke="#ffedd5" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 1" />
      <path d="M14 60C28 43 44 43 53 60C62 77 76 77 86 60" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="32" cy="24" rx="10" ry="5" fill="#ffedd5" transform="rotate(-30 32 24)" />
    </svg>
  );
}

function KidCharacter({ gender, shirtColor, expression = 'idle', handRaised = false }: {
  gender: 'girl' | 'boy'; shirtColor: string;
  expression?: 'idle' | 'excited' | 'waiting' | 'happy'; handRaised?: boolean;
}) {
  const irisUrl = gender === 'girl' ? 'url(#girlIrisGrad)' : 'url(#boyIrisGrad)';

  const getFace = () => {
    switch (expression) {
      case 'excited': return (<>
        <g><circle cx="56" cy="74" r="11" fill="url(#scleraGrad)" /><circle cx="56" cy="74" r="8" fill={irisUrl} /><circle cx="57" cy="74" r="5" fill="#111122" /><circle cx="54" cy="71" r="2.8" fill="#fff" /><circle cx="59.5" cy="76.5" r="1.2" fill="#fff" /></g>
        <g><circle cx="104" cy="74" r="11" fill="url(#scleraGrad)" /><circle cx="104" cy="74" r="8" fill={irisUrl} /><circle cx="103" cy="74" r="5" fill="#111122" /><circle cx="101" cy="71" r="2.8" fill="#fff" /><circle cx="106.5" cy="76.5" r="1.2" fill="#fff" /></g>
        <path d="M44 58 C49 51, 63 52, 67 59" stroke="#31190a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M93 59 C97 52, 111 51, 116 58" stroke="#31190a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <ellipse cx="43" cy="88" rx="10" ry="7" fill="url(#cheeksPink)" />
        <ellipse cx="117" cy="88" rx="10" ry="7" fill="url(#cheeksPink)" />
        <g><path d="M68 93 C68 112, 92 112, 92 93 Z" fill="url(#mouthOpenGrad)" stroke="#31190a" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M72 94 C76 98, 84 98, 88 94 C88 94, 72 94, 72 94" fill="#fff" />
          <path d="M74 105 C78 100, 82 100, 86 105 C83 108, 77 108, 74 105" fill="#ff8aa2" /></g>
      </>);
      case 'waiting': return (<>
        <g><circle cx="56" cy="74" r="10.5" fill="url(#scleraGrad)" /><circle cx="58" cy="74" r="7.5" fill={irisUrl} /><circle cx="59.5" cy="74" r="4.5" fill="#111122" /><circle cx="57" cy="71.5" r="2.5" fill="#fff" /></g>
        <g><circle cx="104" cy="74" r="10.5" fill="url(#scleraGrad)" /><circle cx="106" cy="74" r="7.5" fill={irisUrl} /><circle cx="107.5" cy="74" r="4.5" fill="#111122" /><circle cx="105" cy="71.5" r="2.5" fill="#fff" /></g>
        <path d="M46 60 C51 57, 61 58, 65 62" stroke="#31190a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M95 62 C99 58, 109 57, 114 60" stroke="#31190a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="43" cy="88" rx="8" ry="5.5" fill="url(#cheeksPink)" />
        <ellipse cx="117" cy="88" rx="8" ry="5.5" fill="url(#cheeksPink)" />
        <ellipse cx="80" cy="98" rx="4.5" ry="6" fill="#74211e" stroke="#31190a" strokeWidth="2" />
      </>);
      case 'happy': return (<>
        <path d="M45 76 C51 68, 62 68, 67 76" stroke="#31190a" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M93 76 C99 68, 110 68, 116 76" stroke="#31190a" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M43 57 C48 49, 62 49, 67 56" stroke="#31190a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M93 56 C98 49, 112 49, 117 57" stroke="#31190a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <ellipse cx="42" cy="86" rx="11" ry="8" fill="url(#cheeksPink)" />
        <ellipse cx="118" cy="86" rx="11" ry="8" fill="url(#cheeksPink)" />
        <g><path d="M69 94 C69 110, 91 110, 91 94 Z" fill="url(#mouthOpenGrad)" stroke="#31190a" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M72 102 C77 98, 83 98, 88 102" stroke="#ff8aa2" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
      </>);
      default: return (<>
        <g><circle cx="56" cy="74" r="10" fill="url(#scleraGrad)" /><circle cx="56" cy="74" r="7" fill={irisUrl} /><circle cx="56" cy="74" r="4" fill="#111122" /><circle cx="54" cy="71" r="2.2" fill="#fff" /></g>
        <g><circle cx="104" cy="74" r="10" fill="url(#scleraGrad)" /><circle cx="104" cy="74" r="7" fill={irisUrl} /><circle cx="104" cy="74" r="4" fill="#111122" /><circle cx="102" cy="71" r="2.2" fill="#fff" /></g>
        <path d="M45 61 C50 57, 61 57, 65 61" stroke="#31190a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M95 61 C99 57, 110 57, 114 61" stroke="#31190a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="43" cy="88" rx="8" ry="5" fill="url(#cheeksPink)" />
        <ellipse cx="117" cy="88" rx="8" ry="5" fill="url(#cheeksPink)" />
        <path d="M71 94 C75 99, 85 99, 89 94" stroke="#31190a" strokeWidth="3" strokeLinecap="round" fill="none" />
      </>);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', userSelect: 'none' }}>
      <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.18))', overflow: 'visible' }}>
        <defs>
          <radialGradient id="skinGlow" cx="50%" cy="35%" r="65%" fx="40%" fy="30%">
            <stop offset="0%" stopColor="#fffbfc" /><stop offset="25%" stopColor="#ffeedf" />
            <stop offset="75%" stopColor="#ffd3b6" /><stop offset="100%" stopColor="#e5a882" />
          </radialGradient>
          <linearGradient id="neckGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cc916d" /><stop offset="40%" stopColor="#e5a882" /><stop offset="100%" stopColor="#ffd3b6" />
          </linearGradient>
          <radialGradient id="scleraGrad" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
            <stop offset="0%" stopColor="#ffffff" /><stop offset="85%" stopColor="#fbfbff" /><stop offset="100%" stopColor="#dbeafe" />
          </radialGradient>
          <radialGradient id="girlIrisGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" /><stop offset="60%" stopColor="#1d4ed8" /><stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
          <radialGradient id="boyIrisGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" /><stop offset="60%" stopColor="#047857" /><stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
          <linearGradient id="hairGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3a2d" /><stop offset="15%" stopColor="#5c2419" />
            <stop offset="75%" stopColor="#3d130c" /><stop offset="100%" stopColor="#210502" />
          </linearGradient>
          <linearGradient id="shirtVolume" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="15%" stopColor={shirtColor} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="cheeksPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d6d" stopOpacity="0.5" /><stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mouthOpenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#541215" /><stop offset="100%" stopColor="#a31d1d" />
          </linearGradient>
          <filter id="dropShadow"><feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#2e1201" floodOpacity="0.12" /></filter>
        </defs>

        {/* Hair Back */}
        {gender === 'girl' ? (
          <path d="M20 75C20 30, 36 12, 80 12C124 12, 140 30, 140 75C140 105, 132 124, 122 134C122 134, 115 110, 115 100C115 90, 45 90, 45 100C45 110, 38 134, 38 134C28 124, 20 105, 20 75Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="3" filter="url(#dropShadow)" />
        ) : (
          <path d="M32 75C32 35, 48 20, 80 20C112 20, 128 35, 128 75C128 85, 124 91, 118 94C110 83, 102 81, 80 81C58 81, 50 83, 42 94C36 91, 32 85, 32 75Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="3" filter="url(#dropShadow)" />
        )}

        {/* Neck */}
        <path d="M66 112 C66 112, 80 128, 94 112 L92 128 C86 130, 74 130, 68 128 Z" fill="url(#neckGlow)" stroke="#31190a" strokeWidth="2.5" />

        {/* Head */}
        <circle cx="80" cy="80" r="43" fill="url(#skinGlow)" stroke="#31190a" strokeWidth="3.5" />

        {/* Ears */}
        <path d="M38 72 C33 72, 30 78, 30 84 C30 90, 33 96, 38 96" fill="url(#skinGlow)" stroke="#31190a" strokeWidth="3.2" />
        <path d="M35 78 C33 80, 33 88, 35 91" stroke="#cc916d" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M122 72 C127 72, 130 78, 130 84 C130 90, 127 96, 122 96" fill="url(#skinGlow)" stroke="#31190a" strokeWidth="3.2" />
        <path d="M125 78 C127 80, 127 88, 125 91" stroke="#cc916d" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Hair Front */}
        {gender === 'girl' ? (<>
          <path d="M37 53 C37 28, 48 10, 80 10 C112 10, 123 28, 123 53 C120 44, 114 36, 102 38 C90 40, 84 50, 80 50 C76 50, 70 40, 58 38 C46 36, 40 44, 37 53 Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="3" />
          <path d="M48 24 C58 18, 102 18, 112 24" stroke="#bd614e" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45" />
          <path d="M58 20 C64 16, 96 16, 102 20" stroke="#f7bcae" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </>) : (<>
          <path d="M32 54 C30 25, 45 10, 80 10 C115 10, 128 25, 126 54 C121 44, 115 38, 104 40 C94 42, 88 52, 80 52 C72 52, 66 42, 54 40 C44 38, 38 44, 32 54 Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="3.2" strokeLinejoin="round" />
          <path d="M56 38 C56 38, 64 48, 68 53 C64 54, 58 48, 56 38 Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M102 38 C102 38, 94 48, 90 53 C94 54, 100 48, 102 38 Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M72 13 C72 13, 80 5, 82 0 C82 0, 69 5, 72 13 Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M87 14 C87 14, 95 6, 96 1 C96 1, 84 6, 87 14 Z" fill="url(#hairGlow)" stroke="#210502" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M44 26 C60 18, 100 18, 116 26" stroke="#bd614e" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.45" />
          <path d="M54 22 C64 16, 96 16, 106 22" stroke="#f7bcae" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </>)}

        {/* Nose */}
        <path d="M76 83 C78 86, 82 86, 84 83" stroke="#cf8d65" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Face expressions */}
        {getFace()}

        {/* Shirt sleeves */}
        {gender === 'girl' ? (
          <path d="M40 134 C46 132, 58 132, 63 134 L58 122 C53 120, 44 122, 40 134 Z" fill={shirtColor} stroke="#31190a" strokeWidth="2.5" />
        ) : (
          <path d="M120 134 C114 132, 102 132, 97 134 L102 122 C107 120, 116 122, 120 134 Z" fill={shirtColor} stroke="#31190a" strokeWidth="2.5" />
        )}

        {/* Torso */}
        <path d="M44 132 C54 128, 106 128, 116 132 C122 150, 122 188, 117 200 H43 C38 188, 38 150, 44 132 Z" fill="url(#shirtVolume)" stroke="#31190a" strokeWidth="3" strokeLinejoin="round" />
        <path d="M64 131 C64 131, 80 142, 96 131" stroke="#f8fafc" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M43 170 C60 182, 100 182, 117 170 L117 200 H43 Z" fill="#111122" opacity="0.12" />

        {/* Arms */}
        {gender === 'girl' ? (
          <g>
            <path d="M46 142 C58 147, 76 153, 84 157 L80 166 C72 162, 54 155, 44 150 Z" fill={shirtColor} stroke="#31190a" strokeWidth="2.5" strokeLinejoin="round" />
            <motion.path
              animate={{ d: handRaised ? "M82 157 C92 160, 114 154, 121 138" : "M82 157 C92 160, 118 160, 125 157" }}
              stroke="#ffd3b6" strokeWidth="13.5" strokeLinecap="round" fill="none"
              transition={{ duration: 0.3 }}
            />
            <motion.g animate={{ transform: handRaised ? "translate(121px,138px) rotate(-15deg) scale(1.35)" : "translate(125px,157px) rotate(0deg) scale(1.35)" }} transition={{ duration: 0.3 }}>
              <path d="M -11 6 C -12 2, -10 -5, -4 -9 C -1 -12, 5 -12, 9 -8 C 12 -4, 13 2, 11 7 C 9 11, 3 13, -3 12 C -7 11, -10 9, -11 6 Z" fill="#ffd3b6" stroke="#31190a" strokeWidth="2.5" strokeLinejoin="round" />
            </motion.g>
          </g>
        ) : (
          <g>
            <path d="M114 142 C102 147, 84 153, 76 157 L80 166 C88 162, 106 155, 116 150 Z" fill={shirtColor} stroke="#31190a" strokeWidth="2.5" strokeLinejoin="round" />
            <motion.path
              animate={{ d: handRaised ? "M78 157 C68 160, 46 154, 39 138" : "M78 157 C68 160, 42 160, 35 157" }}
              stroke="#ffd3b6" strokeWidth="13.5" strokeLinecap="round" fill="none"
              transition={{ duration: 0.3 }}
            />
            <motion.g animate={{ transform: handRaised ? "translate(39px,138px) rotate(15deg) scale(1.35)" : "translate(35px,157px) rotate(0deg) scale(1.35)" }} transition={{ duration: 0.3 }}>
              <path d="M 11 6 C 12 2, 10 -5, 4 -9 C 1 -12, -5 -12, -9 -8 C -12 -4, -13 2, -11 7 C -9 11, -3 13, 3 12 C 7 11, 10 9, 11 6 Z" fill="#ffd3b6" stroke="#31190a" strokeWidth="2.5" strokeLinejoin="round" />
            </motion.g>
          </g>
        )}
      </svg>
    </div>
  );
}

const TradeFunSection = () => {
  const [leftToy, setLeftToy] = useState<ToyType>('car');
  const [rightToy, setRightToy] = useState<ToyType>('ball');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatStep, setChatStep] = useState(0);
  const [gigglingKid, setGigglingKid] = useState<'none' | 'girl' | 'boy'>('none');
  const [tradeCompleted, setTradeCompleted] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleKidClick = (kid: 'girl' | 'boy') => {
    if (isAnimating) return;
    setGigglingKid(kid);
    setTimeout(() => setGigglingKid('none'), 400);
  };

  const executeSwap = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setChatStep(1); setGigglingKid('girl');
    setTimeout(() => setGigglingKid('none'), 400);
    setTimeout(() => {
      setChatStep(2); setGigglingKid('boy');
      setTimeout(() => setGigglingKid('none'), 400);
      setTimeout(() => {
        setChatStep(3); setGigglingKid('girl');
        setTimeout(() => setGigglingKid('none'), 300);
        setTimeout(() => {
          setChatStep(0);
          setCurrentStep(1);
          setTimeout(() => {
            setCurrentStep(2);
            setTimeout(() => {
              setCurrentStep(3);
              setTimeout(() => {
                setCurrentStep(4); setTradeCompleted(true); setIsAnimating(false);
              }, 1200);
            }, 1000);
          }, 600);
        }, 1500);
      }, 1800);
    }, 1800);
  };

  const getLeftToyStyles = () => {
    if (isMobile) {
      switch (currentStep) {
        case 1: return { left: '26%', top: '62%', scale: 1.05, rotate: 5 };
        case 2: return { left: '74%', top: '62%', scale: 0.95, rotate: 360 };
        case 3: return { left: '74%', top: ['62%', '46%', '70%'], scale: [0.95, 1.1, 0.95] };
        case 4: return { left: '74%', top: '70%', scale: 0.95, rotate: 0 };
        default: return { left: '26%', top: '70%', scale: 0.95, rotate: 0 };
      }
    } else {
      switch (currentStep) {
        case 1: return { left: '25%', top: '64%', scale: 1.15, rotate: 5 };
        case 2: return { left: '75%', top: '64%', scale: 1, rotate: 360 };
        case 3: return { left: '75%', top: ['64%', '52%', '71.5%'], scale: [1, 1.15, 1] };
        case 4: return { left: '75%', top: '71.5%', scale: 1.1, rotate: 0 };
        default: return { left: '25%', top: '71.5%', scale: 1.1, rotate: 0 };
      }
    }
  };

  const getRightToyStyles = () => {
    if (isMobile) {
      switch (currentStep) {
        case 1: return { left: '74%', top: '62%', scale: 1.05, rotate: -5 };
        case 2: return { left: '26%', top: '62%', scale: 0.95, rotate: -360 };
        case 3: return { left: '26%', top: ['62%', '46%', '70%'], scale: [0.95, 1.1, 0.95] };
        case 4: return { left: '26%', top: '70%', scale: 0.95, rotate: 0 };
        default: return { left: '74%', top: '70%', scale: 0.95, rotate: 0 };
      }
    } else {
      switch (currentStep) {
        case 1: return { left: '75%', top: '64%', scale: 1.15, rotate: -5 };
        case 2: return { left: '25%', top: '64%', scale: 1, rotate: -360 };
        case 3: return { left: '25%', top: ['64%', '52%', '71.5%'], scale: [1, 1.15, 1] };
        case 4: return { left: '25%', top: '71.5%', scale: 1.1, rotate: 0 };
        default: return { left: '75%', top: '71.5%', scale: 1.1, rotate: 0 };
      }
    }
  };

  const getGirlExpression = (): 'idle' | 'excited' | 'waiting' | 'happy' => {
    if (gigglingKid === 'girl') return 'excited';
    if (chatStep === 1 || chatStep === 3) return 'happy';
    if (currentStep === 1 || currentStep === 2) return 'waiting';
    if (currentStep >= 3) return 'happy';
    return 'idle';
  };
  const getBoyExpression = (): 'idle' | 'excited' | 'waiting' | 'happy' => {
    if (gigglingKid === 'boy') return 'excited';
    if (chatStep === 2 || chatStep === 3) return 'happy';
    if (currentStep === 1 || currentStep === 2) return 'waiting';
    if (currentStep >= 3) return 'happy';
    return 'idle';
  };

  const toyName = (t: ToyType) => TOYS[t].name.replace(/^(Blue|Orange)\s+/i, '').toLowerCase();

  return (
    <section id="trade" style={{ padding: '20px 16px', background: '#ffffff' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', padding: '8px 28px', borderRadius: '50px', fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', boxShadow: '0 8px 20px rgba(239,68,68,0.25)' }}
          >
            <span>Let&apos;s Trade!</span>
            <StaticSiyaCoin />
          </motion.h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Trading is swapping what you have for what you want!</p>
        </div>

        {/* Main Stage */}
        <div style={{ width: '100%', position: 'relative', aspectRatio: isMobile ? '16/9' : '14/7', minHeight: isMobile ? '180px' : '300px', borderRadius: '24px', background: '#0d9488', overflow: 'hidden', border: '2px solid rgba(13,148,136,0.3)', display: 'flex', alignItems: 'flex-end', boxShadow: '0 20px 60px rgba(13,148,136,0.25)' }}>

          {/* Sky gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(45,212,191,0.2) 0%, rgba(13,148,136,0.35) 100%)', pointerEvents: 'none' }} />

          {/* Speech bubble — Girl */}
          {(chatStep === 1 || chatStep === 3) && (
            <motion.div initial={{ scale: 0.8, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              style={{ position: 'absolute', left: '10%', top: '10%', zIndex: 40, background: 'white', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '10px 14px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', maxWidth: '180px' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '0.8rem', color: '#1e293b', textAlign: 'center', lineHeight: 1.4 }}>
                {chatStep === 1 ? <>Hi! I want the <span style={{ color: '#ea580c', fontWeight: 900 }}>{toyName(rightToy)}</span>! 😊</> : <>Ok! Let&apos;s trade! 👍</>}
              </p>
              <span style={{ position: 'absolute', bottom: '-14px', left: '22%', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '14px solid white' }} />
            </motion.div>
          )}

          {/* Speech bubble — Boy */}
          {(chatStep === 2 || chatStep === 3) && (
            <motion.div initial={{ scale: 0.8, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              style={{ position: 'absolute', right: '10%', top: '10%', zIndex: 40, background: 'white', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '10px 14px', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', maxWidth: '180px' }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '0.8rem', color: '#1e293b', textAlign: 'center', lineHeight: 1.4 }}>
                {chatStep === 2 ? <>I want the <span style={{ color: '#0ea5e9', fontWeight: 900 }}>{toyName(leftToy)}</span>! Let&apos;s trade! 🤩</> : <>Ok! Yay! 🎉</>}
              </p>
              <span style={{ position: 'absolute', bottom: '-14px', right: '22%', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '14px solid white' }} />
            </motion.div>
          )}

          {/* Table edge */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '14px', background: '#f59e0b', borderTop: '1px solid #d97706' }} />

          {/* Characters */}
          <div style={{ position: 'absolute', left: isMobile ? '12px' : '32px', right: isMobile ? '12px' : '32px', bottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>

            {/* Girl - Left */}
            <motion.div onClick={() => handleKidClick('girl')}
              animate={{ y: gigglingKid === 'girl' ? -12 : 0, scale: gigglingKid === 'girl' ? 1.04 : 1 }}
              style={{ width: isMobile ? '32%' : '28%', cursor: 'pointer' }} title="Click me!">
              <KidCharacter gender="girl" shirtColor="#f97316" expression={getGirlExpression()} handRaised={currentStep >= 1} />
              <div style={{ textAlign: 'center', color: 'rgba(204,251,241,0.9)', fontWeight: 800, fontSize: '11px', letterSpacing: '1px', marginTop: '4px' }}>GIRL</div>
            </motion.div>

            {/* Boy - Right */}
            <motion.div onClick={() => handleKidClick('boy')}
              animate={{ y: gigglingKid === 'boy' ? -12 : 0, scale: gigglingKid === 'boy' ? 1.04 : 1 }}
              style={{ width: isMobile ? '32%' : '28%', cursor: 'pointer' }} title="Click me!">
              <KidCharacter gender="boy" shirtColor="#06b6d4" expression={getBoyExpression()} handRaised={currentStep >= 1} />
              <div style={{ textAlign: 'center', color: 'rgba(204,251,241,0.9)', fontWeight: 800, fontSize: '11px', letterSpacing: '1px', marginTop: '4px' }}>BOY</div>
            </motion.div>
          </div>

          {/* Flying Toy A */}
          <motion.div className="toy-wrapper" animate={getLeftToyStyles()} transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ position: 'absolute', zIndex: 30, width: isMobile ? '30px' : '40px', height: isMobile ? '30px' : '40px', pointerEvents: 'none' }}>
            <div style={{ transform: 'translate(-50%,-50%)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
              <ToyIcon type={leftToy} size={isMobile ? 30 : 38} />
            </div>
          </motion.div>

          {/* Flying Toy B */}
          <motion.div className="toy-wrapper" animate={getRightToyStyles()} transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ position: 'absolute', zIndex: 30, width: isMobile ? '30px' : '40px', height: isMobile ? '30px' : '40px', pointerEvents: 'none' }}>
            <div style={{ transform: 'translate(-50%,-50%)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
              <ToyIcon type={rightToy} size={isMobile ? 30 : 38} />
            </div>
          </motion.div>

        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {tradeCompleted ? (
            <>
              <div style={{ padding: '16px 40px', borderRadius: '16px', background: '#10b981', color: 'white', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 8px 20px rgba(16,185,129,0.35)', borderBottom: '4px solid #059669' }}>
                Traded! 🎉
              </div>
              <button suppressHydrationWarning={true} onClick={() => { setLeftToy('car'); setRightToy('ball'); setCurrentStep(0); setChatStep(0); setTradeCompleted(false); setIsAnimating(false); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                Reset & Play Again
              </button>
            </>
          ) : (
            <motion.button suppressHydrationWarning={true} whileHover={!isAnimating ? { scale: 1.05, y: -2 } : {}} whileTap={!isAnimating ? { scale: 0.95 } : {}}
              onClick={executeSwap} disabled={isAnimating}
              style={{ padding: '16px 48px', borderRadius: '16px', background: isAnimating ? '#cbd5e1' : 'linear-gradient(135deg,#10b981,#059669)', color: isAnimating ? '#94a3b8' : 'white', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase', border: 'none', cursor: isAnimating ? 'not-allowed' : 'pointer', boxShadow: isAnimating ? 'none' : '0 10px 30px rgba(16,185,129,0.4)', borderBottom: isAnimating ? 'none' : '4px solid #047857', transition: 'all 0.3s' }}>
              {isAnimating ? 'Trading...' : "Let's Trade!"}
            </motion.button>
          )}
        </div>

        {/* Educational card */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg,#1e293b,#0f172a)',
            padding: isMobile ? '16px 14px' : '22px 30px',
            borderRadius: isMobile ? '18px' : '22px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: isMobile ? '10px' : '12px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
          <img 
            src="/real_handshake.jpg" 
            alt="Value Exchange" 
            style={{ 
              width: isMobile ? '60px' : '75px', 
              height: isMobile ? '60px' : '75px', 
              objectFit: 'cover', 
              borderRadius: isMobile ? '14px' : '16px', 
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              margin: '0 auto' 
            }} 
          />
          <div>
            <h4 style={{ fontSize: isMobile ? '1.12rem' : '1.35rem', fontWeight: 900, marginBottom: '4px', color: 'var(--accent-yellow)' }}>No Money? No Problem!</h4>
            <p style={{ fontSize: isMobile ? '0.82rem' : '0.92rem', lineHeight: isMobile ? 1.4 : 1.5, opacity: 0.92, fontWeight: 500, margin: 0 }}>
              At <strong style={{ color: 'var(--accent-yellow)' }}>KidsGen Lab</strong>, we teach that trading isn&apos;t just about cash—it&apos;s about <strong style={{ color: '#38bdf8' }}>Value Exchange</strong>. Before money existed, people swapped things they had for things they needed (<strong style={{ color: '#38bdf8' }}>Bartering</strong>). It builds great negotiation skills!
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};



const ReelStoriesSection = () => {
  const stories = [
    { id: 1, video: "/videos/reel1.mp4", label: "Smart Saving", tag: "Learning" },
    { id: 2, video: "/videos/reel2.mp4", label: "Invest Early", tag: "Growth" },
    { id: 3, video: "/videos/reel3.mp4", label: "Financial Freedom", tag: "Future" },
  ];

  const [activeReel, setActiveReel] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextReel = () => {
    setActiveReel((prev) => (prev + 1) % stories.length);
  };

  const prevReel = () => {
    setActiveReel((prev) => (prev - 1 + stories.length) % stories.length);
  };

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReel((prev) => (prev + 1) % stories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [stories.length]);

  // Manual touch swipe handling
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextReel();
    } else if (isRightSwipe) {
      prevReel();
    }
  };

  return (
    <section className="reel-stories-section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <p className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>Real-life learning moments in bite-sized stories</span>
            <StaticSiyaCoin />
          </p>
        </div>

        {/* Desktop View: 3-column Grid */}
        <div className="reel-stories-grid desktop-reel-grid">
          {stories.map((story) => (
            <div key={story.id} className="reel-box">
              <video
                src={story.video}
                autoPlay
                loop
                muted
                playsInline
                className="reel-video"
              />
              <div className="reel-overlay">
                <span className="reel-tag">{story.tag}</span>
                <span className="reel-label">{story.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Slide Gallery / Carousel with Touch Swipe and Auto-sliding */}
        <div
          className="mobile-reel-slider"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="mobile-reel-viewport">
            <div
              className="mobile-reel-track"
              style={{ transform: `translateX(-${activeReel * 100}%)` }}
            >
              {stories.map((story) => (
                <div key={story.id} className="mobile-reel-slide">
                  <div className="reel-box" style={{ height: '440px', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                    <video
                      src={story.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="reel-video"
                    />
                    <div className="reel-overlay">
                      <span className="reel-tag">{story.tag}</span>
                      <span className="reel-label">{story.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Slide Dots Indicator without movable arrows */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginTop: '14px' }}>
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReel(i)}
                aria-label={`Go to slide ${i + 1}`}
                suppressHydrationWarning={true}
                style={{
                  width: activeReel === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeReel === i ? 'var(--primary-teal)' : '#cbd5e1',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const getTradingY = (p: number) => {
  // Pure smooth upward curve — zero noise, perfectly stable line
  const trend = Math.pow(p, 1.2);
  const val = Math.max(0, Math.min(1, trend));
  return 450 - val * 350;
};

// 100 evenly-spaced points — classic straight L segments, no shakiness
const graphPoints = Array.from({ length: 100 }, (_, i) => {
  const p = i / 99;
  return {
    x: 50 + p * 900,
    y: getTradingY(p),
    p: p
  };
});
// Old-style classic L line path — straight segments, stable, no curves
const exactGraphPathD = `M ${graphPoints[0].x},${graphPoints[0].y} ` +
  graphPoints.slice(1).map(pt => `L ${pt.x},${pt.y}`).join(' ');
const courierKeyframesX = graphPoints.map(pt => pt.x - 70);
const courierKeyframesY = graphPoints.map(pt => pt.y - 70);
export default function Home() {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, p: number } | null>(null);
  const [showPlayMenu, setShowPlayMenu] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'ta'>('en');

  // Top Coin Flight & Sparkle State
  const [isTopCoinFlying, setIsTopCoinFlying] = useState(false);
  const [flyStart, setFlyStart] = useState({ x: 0, y: 0 });
  const [flyEnd, setFlyEnd] = useState({ x: 0, y: 0 });
  const [topCoinSparkles, setTopCoinSparkles] = useState<{ id: number; x: number; y: number; scale: number; rotation: number; color: string; delay: number }[]>([]);
  const [sparkleCenter, setSparkleCenter] = useState({ x: 0, y: 0 });

  const handleTopCoinClick = (e: React.MouseEvent) => {
    if (isTopCoinFlying) return;

    const playBtn = document.querySelector(".nav-btn-play") as HTMLElement;
    const playRect = playBtn ? playBtn.getBoundingClientRect() : null;

    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = targetRect.left + targetRect.width / 2;
    const startY = targetRect.top + targetRect.height / 2;

    const targetX = playRect ? playRect.left + playRect.width / 2 : window.innerWidth - 80;
    const targetY = playRect ? playRect.top + playRect.height / 2 : 45;

    setFlyStart({ x: startX, y: startY });
    setFlyEnd({ x: targetX, y: targetY });
    setSparkleCenter({ x: targetX, y: targetY });
    setIsTopCoinFlying(true);
  };

  const handleTopFlightComplete = () => {
    setIsTopCoinFlying(false);

    const starColors = ["#FBBF24", "#F59E0B", "#FDE047", "#FFFFFF", "#38BDF8"];
    const generated = Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * 2 * Math.PI;
      const distance = Math.random() * 35 + 20;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * 360,
        color: starColors[i % starColors.length],
        delay: Math.random() * 0.08
      };
    });

    setTopCoinSparkles(generated);

    setTimeout(() => {
      setShowPlayMenu(true);
    }, 150);

    setTimeout(() => {
      setTopCoinSparkles([]);
    }, 1000);
  };

  // Order Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orderName, setOrderName] = useState<string>('');
  const [orderEmail, setOrderEmail] = useState<string>('');
  const [orderPhone, setOrderPhone] = useState<string>('');
  const [orderCity, setOrderCity] = useState<string>('');

  // Selected Package State
  const [selectedPackage, setSelectedPackage] = useState<'solo' | 'sibling' | 'family'>('sibling');

  // Default Package details mapping
  const defaultHomePackages = {
    solo: {
      name: 'Starter Saver Edition',
      price: 1199,
      originalPrice: 1999,
      tagline: 'Anchor Price (Great for 1 kid)',
      items: [
        '1x Full Physical Kit (3 Jars + 1 Book + 1 Medal + App)',
        'Digital eBook Edition & Exercise Guides',
        'Printable Jar Labels & Habit Tracker Chart',
        '1x Official Superpower Medal for Kids'
      ]
    },
    sibling: {
      name: 'Little Achiever Kit',
      price: 1499,
      originalPrice: 3999,
      tagline: 'The Irresistible Sweet Spot (Save 60%!)',
      items: [
        '2x Complete Kits (6 Jars + 2 Books + 2 Medals + 2 App Accounts)',
        'No Sharing Fights - Individual materials for both children',
        'Digital eBook Editions & Parents Mirroring Guides',
        '2x Official Superpower Medals for Kids'
      ]
    },
    family: {
      name: 'Family Champions Bundle',
      price: 2999,
      originalPrice: 5999,
      tagline: 'Luxury Decoy (Ultimate package)',
      items: [
        'Everything in Sibling Pack (2 Complete Kits)',
        'PLUS: Parent Guide and Letter',
        'Personalized allowance system & banking roadmap',
        'Premium Family Wealth Guide & templates'
      ]
    }
  };

  const [packages, setPackages] = useState(defaultHomePackages);

  // Sync pricing from Admin API settings on mount & restore cached user details
  useEffect(() => {
    async function loadLiveSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings?.pricing) {
          const p = data.settings.pricing;
          setPackages({
            solo: {
              ...defaultHomePackages.solo,
              name: p.solo?.name || defaultHomePackages.solo.name,
              price: p.solo?.price || defaultHomePackages.solo.price,
              originalPrice: p.solo?.originalPrice || defaultHomePackages.solo.originalPrice,
              tagline: p.solo?.tagline || defaultHomePackages.solo.tagline
            },
            sibling: {
              ...defaultHomePackages.sibling,
              name: p.starter?.name || p.sibling?.name || defaultHomePackages.sibling.name,
              price: p.starter?.price || p.sibling?.price || defaultHomePackages.sibling.price,
              originalPrice: p.starter?.originalPrice || p.sibling?.originalPrice || defaultHomePackages.sibling.originalPrice,
              tagline: p.starter?.tagline || p.sibling?.tagline || defaultHomePackages.sibling.tagline
            },
            family: {
              ...defaultHomePackages.family,
              name: p.family?.name || defaultHomePackages.family.name,
              price: p.family?.price || defaultHomePackages.family.price,
              originalPrice: p.family?.originalPrice || defaultHomePackages.family.originalPrice,
              tagline: p.family?.tagline || defaultHomePackages.family.tagline
            }
          });
        }
      } catch (e) {
        // Fallback silently
      }
    }
    loadLiveSettings();

    // Auto-restore customer info & affiliate tag from previous visits
    try {
      const savedRef = getActiveAffiliateRef();
      if (savedRef) setActiveAffiliateRef(savedRef);

      const saved = localStorage.getItem('kidzmoney_user_address') || localStorage.getItem('kidsgenlab_customer_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customerName || parsed.name) setOrderName(parsed.customerName || parsed.name);
        if (parsed.email) setOrderEmail(parsed.email);
        if (parsed.phone || parsed.contact) setOrderPhone(parsed.phone || parsed.contact);
        if (parsed.city) setOrderCity(parsed.city);
      }
    } catch (e) {}
  }, []);

  const [activeAffiliateRef, setActiveAffiliateRef] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName.trim() || !orderEmail.trim()) {
      alert('Please fill in your name and email address.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Step 1: Create Order on Backend
      const currentPkg = packages[selectedPackage];
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentPkg.price,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      const createData = await createRes.json();

      if (!createData.success || !createData.order_id) {
        throw new Error(createData.message || 'Failed to initialize payment gateway');
      }

      // Step 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: createData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TWqcqybTpdjice',
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'KidsGenLab',
        description: currentPkg.name,
        image: '/kidsgenlab_logo_transparent.png',
        order_id: createData.order_id,
        prefill: {
          name: orderName.trim(),
          email: orderEmail.trim(),
          contact: orderPhone.trim(),
          method: 'upi'
        },
        display: {
          blocks: {
            upi: {
              name: 'Pay using UPI (GPay, PhonePe, Paytm, QR)',
              instruments: [{ method: 'upi' }]
            },
            other: {
              name: 'Cards / NetBanking / Wallets',
              instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }]
            }
          },
          sequence: ['block.upi', 'block.other'],
          preferences: { show_default_blocks: true }
        },
        theme: {
          color: '#2d8b94',
        },
        handler: async function (response: any) {
          try {
            // Step 3: Verify Payment Signature on Backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  customerName: orderName.trim(),
                  email: orderEmail.trim(),
                  phone: orderPhone.trim(),
                  city: orderCity.trim() || 'Online Customer',
                  packageName: currentPkg.name,
                  price: currentPkg.price,
                }
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setIsModalOpen(false);
              triggerConfetti({ particleCount: 120, spread: 90 });
              alert(`🎉 Payment Successful! Payment ID: ${response.razorpay_payment_id}. Your kit is on the way!`);
              setOrderName('');
              setOrderEmail('');
              setOrderPhone('');
              setOrderCity('');
            } else {
              alert(`❌ Payment verification failed: ${verifyData.message || 'Please contact support.'}`);
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            alert(`Payment completed with ID ${response.razorpay_payment_id}, but automatic verification encountered an issue. Our team will verify it.`);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed event:', response.error);
          alert(`⚠️ Payment Failed: ${response.error?.description || 'Transaction could not be completed.'}`);
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        throw new Error('Payment gateway is loading. Please try again in 3 seconds.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Payment initiation failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const triggerConfetti = (opts?: any) => {
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti(opts);
    }
  };

  // Dynamic header hide-on-scroll logic
  const [showHeader, setShowHeader] = useState(true);
  const [isMainCtaVisible, setIsMainCtaVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
        setShowPlayMenu(false); // Close dropdown menu when header hides
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById('main-secure-btn');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMainCtaVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  const translations = {
    en: {
      budget: "Budget",
      fortune: "Fortune",
      depreciation: "Depreciation",
      trading: "Trading",
      superpower: "Superpower",
      letsPlay: "Let's Play",
      futureFortuneBuilder: "Future Fortune Builder",
      makeKidsMillionaire: "Make your kids Millionaire or Billionaire.",
      pathToWealthKid: "The Path to WealthKid",
      blueprintDesc: "Craft a custom financial blueprint for your child's future. Enter a few details to visualize their journey to wealth.",
      childAgeLabel: "CHILD'S CURRENT AGE",
      monthlyInvestLabel: "MONTHLY INVESTMENT",
      selectAmbition: "🎯 SELECT YOUR WEALTH AMBITION",
      millionaireGoal: "Millionaire Goal",
      billionaireGoal: "Billionaire Goal",
      generateMap: "GENERATE WEALTH MAP",
      depTitle: "Depreciation",
      depSubtitle: "Things lose value over time. Watch it happen live!",
      go: "Go",
      reset: "Reset & Play Again",
      split: "Split",
      budgetBuddy: "Budget Buddy",
      justEnterAmount: "Just enter the amount and watch it split!"
    },
    hi: {
      budget: "बजट",
      fortune: "भविष्य",
      depreciation: "मूल्यह्रास",
      trading: "व्यापार",
      superpower: "महाशक्ति",
      letsPlay: "चलो खेलें",
      futureFortuneBuilder: "भविष्य का खजाना निर्माता",
      makeKidsMillionaire: "अपने बच्चों को करोड़पति या अरबपति बनाएं।",
      pathToWealthKid: "वेल्थकिड का मार्ग",
      blueprintDesc: "अपने बच्चे के भविष्य के लिए एक व्यक्तिगत वित्तीय खाका तैयार करें। उनके अमीर बनने की यात्रा को देखने के लिए कुछ विवरण दर्ज करें।",
      childAgeLabel: "बच्चे की वर्तमान उम्र",
      monthlyInvestLabel: "मासिक निवेश",
      selectAmbition: "🎯 अपनी संपत्ति की आकांक्षा चुनें",
      millionaireGoal: "करोड़पति लक्ष्य",
      billionaireGoal: "अरबपति लक्ष्य",
      generateMap: "वेल्थ मैप बनाएं",
      depTitle: "मूल्यह्रास (डेप्रिसिएशन)",
      depSubtitle: "समय के साथ चीजें अपनी कीमत खो देती हैं। इसे लाइव देखें!",
      go: "शुरू करें",
      reset: "रीसेट करें और फिर से खेलें",
      split: "विभाजित करें",
      budgetBuddy: "बजट बडी",
      justEnterAmount: "बस राशि दर्ज करें और इसे विभाजित होते देखें!"
    },
    ta: {
      budget: "பட்ஜெட்",
      fortune: "செல்வம்",
      depreciation: "மதிப்பிறக்கம்",
      trading: "வர்த்தகம்",
      superpower: "சூப்பர் பவர்",
      letsPlay: "விளையாடுவோம்",
      futureFortuneBuilder: "எதிர்கால செல்வத்தை உருவாக்குபவர்",
      makeKidsMillionaire: "உங்கள் குழந்தைகளை மில்லியனர் அல்லது பில்லியனர் ஆக்குங்கள்.",
      pathToWealthKid: "வெல்த்கிட் நோக்கிய பாதை",
      blueprintDesc: "உங்கள் குழந்தையின் எதிர்காலத்திற்கான தனிப்பயன் நிதி திட்டத்தை உருவாக்குங்கள். அவர்கள் செல்வத்தை அடையும் பயணத்தை காண சில விவரங்களை உள்ளிடவும்.",
      childAgeLabel: "குழந்தையின் தற்போதைய வயது",
      monthlyInvestLabel: "மாதாந்திர முதலீடு",
      selectAmbition: "🎯 உங்கள் செல்வ இலக்கை தேர்வு செய்யவும்",
      millionaireGoal: "மில்லியனர் இலக்கு",
      billionaireGoal: "பில்லியனர் இலக்கு",
      generateMap: "வெல்த் மேப் உருவாக்கவும்",
      depTitle: "மதிப்பிறக்கம் (தேய்மானம்)",
      depSubtitle: "காலப்போக்கில் பொருட்கள் மதிப்பை இழக்கின்றன. அதை நேரலையில் பாருங்கள்!",
      go: "செல்",
      reset: "மீட்டமைத்து மீண்டும் விளையாடு",
      split: "பிரி",
      budgetBuddy: "பட்ஜெட் பட்டி",
      justEnterAmount: "தொகையை உள்ளிட்டு அது பிரிப்பதைப் பாருங்கள்!"
    }
  };

  const t = translations[language];

  const needsList = [
    {
      name: language === 'hi' ? 'घर (Shelter)' : language === 'ta' ? 'வீடு (Shelter)' : 'House (Shelter)',
      desc: language === 'hi' ? 'रहने और सोने के लिए एक सुरक्षित जगह।' : language === 'ta' ? 'வாழவும் உறங்கவும் ஒரு பாதுகாப்பான இடம்.' : 'A safe place to live and sleep.',
      img: '/needs_home_cartoon.jpg',
    },
    {
      name: language === 'hi' ? 'भोजन (Food)' : language === 'ta' ? 'உணவு (Food)' : 'Healthy Food',
      desc: language === 'hi' ? 'मजबूत बनने के लिए स्वस्थ भोजन और फल।' : language === 'ta' ? 'ஆரோக்கியமாக வளர சத்தான உணவுகள்.' : 'Healthy meals and fruits to grow strong.',
      img: '/needs_food_cartoon.jpg',
    },
    {
      name: language === 'hi' ? 'कपड़े (Clothing)' : language === 'ta' ? 'ஆடை (Clothing)' : 'Clothes (Clothing)',
      desc: language === 'hi' ? 'आपको गर्म और सुरक्षित रखने के लिए।' : language === 'ta' ? 'உங்களை வெப்பமாகவும் பாதுகாப்பாகவும் வைத்திருக்க.' : 'To keep you warm and protected.',
      img: '/needs_clothes_cartoon.jpg',
    },
    {
      name: language === 'hi' ? 'शिक्षा (Education)' : language === 'ta' ? 'கல்வி (Education)' : 'Books & Study',
      desc: language === 'hi' ? 'नया सीखने और आगे बढ़ने के लिए किताबें।' : language === 'ta' ? 'புதிய விஷயங்களை கற்றுக்கொள்ள புத்தகங்கள்.' : 'Books and study materials to learn and grow.',
      img: '/needs_books_cartoon.jpg',
    }
  ];

  const wantsList = [
    {
      name: language === 'hi' ? 'आइसक्रीम' : language === 'ta' ? 'ஐஸ்கிரீம்' : 'Ice Cream',
      desc: language === 'hi' ? 'खाने के बाद एक मीठी और स्वादिष्ट ट्रीट।' : language === 'ta' ? 'சாப்பாட்டிற்கு பின் ஒரு இனிமையான சுவை.' : 'A sweet and delicious treat for dessert.',
      img: '/wants_icecream_cartoon.jpg',
    },
    {
      name: language === 'hi' ? 'खिलौने (Toys)' : language === 'ta' ? 'பொம்மைகள்' : 'Toys',
      desc: language === 'hi' ? 'दोस्तों के साथ खेलने के लिए मजेदार चीजें।' : language === 'ta' ? 'நண்பர்களுடன் விளையாட வேடிக்கையான பொம்மைகள்.' : 'Fun things to play with friends.',
      img: '/wants_toy_cartoon.jpg',
    },
    {
      name: language === 'hi' ? 'वीडियो गेम्स' : language === 'ta' ? 'வீடியோ கேம்ஸ்' : 'Video Games',
      desc: language === 'hi' ? 'शानदार डिजिटल रोमांच और खेल।' : language === 'ta' ? 'சுவாரஸ்யமான கணினி விளையாட்டுகள்.' : 'Cool digital adventures and gameplay.',
      img: '/wants_game_cartoon.jpg',
    },
    {
      name: language === 'hi' ? 'साइकिल' : language === 'ta' ? 'மிதிவண்டி' : 'Bicycle',
      desc: language === 'hi' ? 'पार्क में सवारी करने के लिए एक शानदार साइकिल।' : language === 'ta' ? 'பூங்காவில் ஓட்டி மகிழ ஒரு மிதிவண்டி.' : 'A shiny new bicycle to ride in the park.',
      img: '/wants_bike_cartoon.jpg',
    }
  ];

  // --- 1. Slider Gallery State ---
  const [currentSlide, setCurrentSlide] = useState(1); // Default to 'sibling' (index 1) to match default selectedPackage
  const totalSlides = 3;
  const packageKeys: Array<'solo' | 'sibling' | 'family'> = ['solo', 'sibling', 'family'];

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % totalSlides;
      setSelectedPackage(packageKeys[next]);
      return next;
    });
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev - 1 + totalSlides) % totalSlides;
      setSelectedPackage(packageKeys[next]);
      return next;
    });
  };
  const [productTouchStart, setProductTouchStart] = useState<number | null>(null);
  const [productTouchEnd, setProductTouchEnd] = useState<number | null>(null);

  const onProductTouchStart = (e: React.TouchEvent) => {
    setProductTouchEnd(null);
    setProductTouchStart(e.targetTouches[0].clientX);
  };
  const onProductTouchMove = (e: React.TouchEvent) => {
    setProductTouchEnd(e.targetTouches[0].clientX);
  };
  const onProductTouchEnd = () => {
    if (!productTouchStart || !productTouchEnd) return;
    const distance = productTouchStart - productTouchEnd;
    if (distance > 40) nextSlide();
    if (distance < -40) prevSlide();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setSelectedPackage(packageKeys[index]);
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setShowPlayMenu(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  // --- 2. FAQ / Accordion State ---
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  // --- 3. Magic Jars State ---
  const [jarAmount, setJarAmount] = useState<string>("");
  const [jarSplits, setJarSplits] = useState({ spend: 0, save: 0, give: 0 });
  const [isJarAnimated, setIsJarAnimated] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateJarSplits = () => {
    const amount = parseFloat(jarAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }
    setJarSplits({
      spend: Math.round(amount * 0.5),
      save: Math.round(amount * 0.4),
      give: Math.round(amount * 0.1),
    });
    setIsJarAnimated(false);
    setTimeout(() => setIsJarAnimated(true), 10);
  };

  // --- 4. Depreciation State ---
  const [depYear, setDepYear] = useState(0);
  const [depValue, setDepValue] = useState(9500);
  const [depMessage, setDepMessage] = useState("Brand new! No value lost yet.");
  const [isMoving, setIsMoving] = useState(false);
  const maxDepYears = 8;
  const initialDepValue = 9500;

  const handleDepreciate = () => {
    if (depYear < maxDepYears) {
      setIsMoving(true);
      const nextYear = depYear + 1;
      const rate = 0.15;
      const lost = depValue * rate;
      const newValue = depValue - lost;

      setDepYear(nextYear);
      setDepValue(newValue);

      if (nextYear >= maxDepYears) {
        setDepMessage(`After ${maxDepYears} years, it's barely worth anything! That's depreciation.`);
      } else {
        setDepMessage(`Lost ${Math.round(lost).toLocaleString('en-IN')} in value this year! 📉`);
      }

      setTimeout(() => setIsMoving(false), 600);
    }
  };

  const resetDepreciation = () => {
    setDepYear(0);
    setDepValue(initialDepValue);
    setDepMessage("Brand new! No value lost yet.");
  };

  // --- 5. Wealth Goal State (Dynamic Age) ---
  const [wealthGoalMode, setWealthGoalMode] = useState<'millionaire' | 'billionaire'>('millionaire');
  const [monthlyInvest, setMonthlyInvest] = useState<number | "">("");
  const [childAge, setChildAge] = useState<number | "">("");
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [errors, setErrors] = useState({ age: "", invest: "" });

  const calculateAchievement = () => {
    if (childAge === "" || monthlyInvest === "") return { achievementAge: 0, milestones: [] };
    const targetValue = wealthGoalMode === 'billionaire' ? 10000000 : 1000000;
    const r = 12 / 100 / 12; // 1% monthly
    const stepUp = wealthGoalMode === 'billionaire' ? 1.10 : 1.05; // 10% vs 5% annual step up

    let currentWealth = 0;
    let currentMonthly = monthlyInvest;
    let totalMonths = 0;
    let age = childAge;

    while (currentWealth < targetValue && age < 60) {
      currentWealth = (currentWealth + currentMonthly) * (1 + r);
      totalMonths++;
      if (totalMonths % 12 === 0) {
        currentMonthly *= stepUp;
        age++;
      }
    }

    const achievementAge = Math.round(childAge + totalMonths / 12);
    const duration = achievementAge - childAge;

    // Milestones (4-5 points along the journey)
    const milestones = [];
    for (let i = 0; i <= 4; i++) {
      const milestoneAge = Math.round(childAge + (duration * i) / 4);
      milestones.push({
        age: milestoneAge,
        wealth: calculateStepUpSIP(monthlyInvest, 12, milestoneAge - childAge, wealthGoalMode === 'billionaire' ? 10 : 5),
        x: (i / 4) * 100,
        y: 100 - Math.pow(i / 4, 1.5) * 90
      });
    }

    return { achievementAge, milestones };
  };

  const calculateStepUpSIP = (initialP: number, r: number, years: number, stepUpPercent: number) => {
    let totalValue = 0;
    let currentP = initialP;
    const monthlyRate = r / 12 / 100;

    for (let year = 1; year <= (years || 1); year++) {
      for (let month = 1; month <= 12; month++) {
        totalValue = (totalValue + currentP) * (1 + monthlyRate);
      }
      currentP = currentP * (1 + stepUpPercent / 100);
    }
    return Math.round(totalValue);
  };


  // --- 6. Spark Box State ---
  const [sparkInput, setSparkInput] = useState("");
  const [sparkResult, setSparkResult] = useState<{ idea: string; description: string; motivation: string; emoji: string } | null>(null);
  const [isSparkLoading, setIsSparkLoading] = useState(false);

  const adultKeywords = [
    "alcohol", "beer", "wine", "smoke", "cigarette", "weed", "drug", "sex", "porn",
    "gamble", "casino", "vape", "tobacco", "whiskey", "vodka", "marijuana", "adult",
    "dating", "liquor", "pub", "bar", "cocktail", "rum", "tequila", "brandy", "shot",
    "poker", "betting", "lottery", "roulette", "blackjack", "slot machine", "prostitution",
    "hentai", "xxx", "erotic", "kill", "weapons", "gun", "knife", "hack"
  ];

  const hasAdultKeyword = sparkInput.trim() !== "" && adultKeywords.some(kw =>
    sparkInput.toLowerCase().includes(kw)
  );

  const sparkIdeas: { keywords: string[]; idea: string; description: string; motivation: string; emoji: string }[] = [
    { keywords: ["cook", "bake", "food", "cake", "cookie", "chocolate", "pizza", "snack", "kitchen", "recipe"], idea: "Mini Snack Chef 🍪", description: "Bake fresh cookies or healthy trail mixes and sell snack packs to friends and neighbors!", motivation: "Action Step: 1. Pick your best recipe 2. Package in cute bags 3. Take your first orders!", emoji: "🍪" },
    { keywords: ["dog", "cat", "pet", "animal", "puppy", "kitten", "bird", "fish", "rabbit"], idea: "Pet Care Hero 🐾", description: "Offer dog walking, weekend pet-sitting, or make healthy homemade pet treats!", motivation: "Action Step: 1. Introduce yourself to neighbors with pets 2. Set your schedule 3. Have fun!", emoji: "🐾" },
    { keywords: ["draw", "paint", "art", "color", "sketch", "craft", "design", "creative", "doodle"], idea: "Custom Art Studio 🎨", description: "Draw personalized bookmarks, greeting cards, portraits, or cool custom stickers!", motivation: "Action Step: 1. Make 5 sample designs 2. Show classmates and family 3. Start creating!", emoji: "🎨" },
    { keywords: ["game", "computer", "tech", "code", "robot", "app", "website", "video", "youtube"], idea: "Junior Tech Creator 💻", description: "Help elders with phone setups, teach gaming tricks, or design cool Canva posters!", motivation: "Action Step: 1. Pick a skill you know well 2. Offer 15-minute quick-help sessions!", emoji: "💻" },
    { keywords: ["sport", "cricket", "football", "run", "swim", "dance", "yoga", "gym", "exercise", "play"], idea: "Fitness Fun Coach 🏃", description: "Organize outdoor sports games, jump-rope tournaments, or mini weekend fitness races!", motivation: "Action Step: 1. Gather neighborhood friends 2. Set up fun challenges 3. Award mini medals!", emoji: "🏃" },
    { keywords: ["cloth", "fashion", "dress", "style", "shoe", "jewel", "accessory", "bag", "bracelet"], idea: "Fashion Crafter Jr. 👗", description: "Handcraft beaded friendship bracelets, painted tote bags, or trendy hair accessories!", motivation: "Action Step: 1. Craft a small collection 2. Wear them to show 3. Sell at local fairs!", emoji: "👗" },
    { keywords: ["plant", "garden", "flower", "tree", "nature", "earth", "green", "eco", "environment"], idea: "Green Thumb Nursery 🌱", description: "Grow easy potted herbs, make seed bombs, or offer garden-watering services!", motivation: "Action Step: 1. Plant 6 small pots 2. Watch them sprout 3. Sell to family & neighbors!", emoji: "🌱" },
    { keywords: ["music", "sing", "guitar", "piano", "drum", "song", "instrument", "band", "melody"], idea: "Music Maker 🎵", description: "Perform fun songs at family gatherings, teach beginner chords, or make custom jingles!", motivation: "Action Step: 1. Pick 3 popular tunes 2. Practice short mini-sets 3. Perform and inspire!", emoji: "🎵" },
    { keywords: ["read", "book", "write", "story", "poem", "blog", "journal", "library"], idea: "Young Comic Author ✍️", description: "Write illustrated mini-comics, mystery stories, or custom printed storybooks!", motivation: "Action Step: 1. Draw a 4-page adventure 2. Staple into booklets 3. Share with friends!", emoji: "✍️" },
    { keywords: ["math", "science", "study", "teach", "tutor", "learn", "school", "homework"], idea: "Study Buddy Pro 📚", description: "Help younger kids with reading practice, multiplication tables, or homework puzzles!", motivation: "Action Step: 1. Pick your strongest subject 2. Create fun flashcards 3. Start tutoring!", emoji: "📚" },
  ];

  const handleSparkGenerate = () => {
    if (hasAdultKeyword) return;
    const input = sparkInput.toLowerCase().trim();
    if (!input) { alert("Tell us what you love doing!"); return; }

    setIsSparkLoading(true);
    setSparkResult(null);

    setTimeout(() => {
      let matched = sparkIdeas.find((item) => item.keywords.some((kw) => input.includes(kw)));

      if (!matched) {
        matched = {
          idea: "The " + sparkInput.trim().charAt(0).toUpperCase() + sparkInput.trim().slice(1) + " Creator 🌟",
          description: `Turn your passion for ${sparkInput.trim()} into a mini business! Create custom items, share tutorials, or offer mini-services around what you enjoy.`,
          motivation: "Action Step: 1. Create something cool 2. Show friends & family 3. Earn your first money!",
          emoji: "🌟",
          keywords: [],
        };
      }

      setSparkResult({ idea: matched.idea, description: matched.description, motivation: matched.motivation, emoji: matched.emoji });
      setIsSparkLoading(false);
    }, 1500);
  };


  // --- 7. Real Trade Swap State ---
  const [swapPhase, setSwapPhase] = useState<'idle' | 'swapping' | 'swapped'>('idle');
  const [swapKey, setSwapKey] = useState(0);

  const startTrade = () => {
    if (swapPhase === 'swapping') return;
    setSwapKey(k => k + 1);
    setSwapPhase('swapping');
    setTimeout(() => setSwapPhase('swapped'), 1900);
  };

  const resetTrade = () => setSwapPhase('idle');

  return (
    <>


      {/* Main Navigation Header */}
      <header className={`main-header ${!showHeader ? 'header-hidden' : ''}`} id="mainHeader">
        <div className="container header-container">
          <a
            href="#"
            className="header-logo-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
              border: '1.5px solid #E2E8F0',
              borderRadius: '18px',
              padding: '6px 20px',
              height: '62px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)';
            }}
          >
            <img
              src="/kidsgenlab_logo_transparent.png"
              alt="KidsGenLab"
              className="header-logo-img"
              style={{
                height: '52px',
                width: 'auto',
                maxWidth: '260px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </a>

          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '14px' }}>
            <Link
              href="/story"
              prefetch={true}
              className="nav-btn-vision"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(180deg, #10B981 0%, #047857 100%)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 900,
                padding: '8px 16px',
                borderRadius: '16px',
                border: '2px solid #064E3B',
                boxShadow: '0 4px 0 #064E3B, 0 6px 12px rgba(16, 185, 129, 0.35)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.3px',
                transition: 'all 0.15s ease',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 0 #064E3B, 0 10px 16px rgba(16, 185, 129, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #064E3B, 0 6px 12px rgba(16, 185, 129, 0.35)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(3px)';
                e.currentTarget.style.boxShadow = '0 1px 0 #064E3B';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 0 #064E3B, 0 10px 16px rgba(16, 185, 129, 0.45)';
              }}
            >
              <span>Our Vision</span>
            </Link>
            {/* Gamified 3D Let's Play Arcade Button */}
            <button
              suppressHydrationWarning={true}
              onClick={() => setShowPlayMenu(!showPlayMenu)}
              className="nav-btn-play"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)',
                color: '#1E293B',
                border: '2px solid #78350F',
                padding: '8px 16px',
                borderRadius: '16px',
                boxShadow: '0 4px 0 #78350F, 0 6px 12px rgba(245, 158, 11, 0.4)',
                fontSize: '0.85rem',
                fontWeight: 900,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                letterSpacing: '0.3px',
                transition: 'all 0.15s ease',
                textShadow: '0 1px 1px rgba(255, 255, 255, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 0 #78350F, 0 10px 16px rgba(245, 158, 11, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #78350F, 0 6px 12px rgba(245, 158, 11, 0.4)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(3px)';
                e.currentTarget.style.boxShadow = '0 1px 0 #78350F';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 0 #78350F, 0 10px 16px rgba(245, 158, 11, 0.5)';
              }}
            >
              <span>Let&apos;s Play</span>
              <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s ease', transform: showPlayMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Interactive Mobile & Desktop "Let's Play" Menu */}
      <AnimatePresence>
        {showPlayMenu && (
          <>
            {/* Backdrop for click outside dismiss */}
            <div
              onClick={() => setShowPlayMenu(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(2px)'
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="play-dropdown-box"
              style={{
                position: 'fixed',
                top: 'calc(var(--header-height) + 6px)',
                right: '16px',
                zIndex: 9999,
                background: 'linear-gradient(165deg, #134e4a 0%, #115e59 100%)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '6px',
                minWidth: '200px',
                maxWidth: 'calc(100vw - 32px)',
                backdropFilter: 'blur(16px)',
                fontFamily: "'Outfit', 'Inter', sans-serif"
              }}
            >
              <a
                href="#jars"
                onClick={(e) => handleScrollTo(e, 'jars')}
                className="play-dropdown-item"
              >
                <span className="play-item-title">Budget Buddy (Magic Jars)</span>
                <span className="play-item-arrow">→</span>
              </a>

              <a
                href="#wealthCalculator"
                onClick={(e) => handleScrollTo(e, 'wealthCalculator')}
                className="play-dropdown-item"
              >
                <span className="play-item-title">Future Fortune Builder</span>
                <span className="play-item-arrow">→</span>
              </a>

              <a
                href="#depreciation"
                onClick={(e) => handleScrollTo(e, 'depreciation')}
                className="play-dropdown-item"
              >
                <span className="play-item-title">Depreciation</span>
                <span className="play-item-arrow">→</span>
              </a>

              <a
                href="#trade"
                onClick={(e) => handleScrollTo(e, 'trade')}
                className="play-dropdown-item"
              >
                <span className="play-item-title">Let&apos;s Trade</span>
                <span className="play-item-arrow">→</span>
              </a>

              <a
                href="#sparkBox"
                onClick={(e) => handleScrollTo(e, 'sparkBox')}
                className="play-dropdown-item"
              >
                <span className="play-item-title">Brainstormer</span>
                <span className="play-item-arrow">→</span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Banner Title between Navigation Bar and Top Image */}
      <div className="top-banner-title-strip">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="top-book-main-title">
            MY KIDS MONEY BOOK
          </h2>
        </div>
      </div>

      {/* Product Layout Section */}
      <main className="product-layout container" id="overview">
        {/* Interactive Slider Gallery */}
        <div
          className="product-gallery slider-gallery"
          onTouchStart={onProductTouchStart}
          onTouchMove={onProductTouchMove}
          onTouchEnd={onProductTouchEnd}
        >
          <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <img src="/product1.png.jpeg" alt="Starter Saver Edition (1,199)" className="slider-slide" />
            <img src="/product2.png.jpeg" alt="Little Achiever Kit - Best Value (1,499)" className="slider-slide" />
            <img src="/product3.png.jpeg" alt="Family Champions Bundle (2,999)" className="slider-slide" />
          </div>

          <button suppressHydrationWarning={true} className="slider-btn prev-btn" onClick={prevSlide} aria-label="Previous image">❮</button>
          <button suppressHydrationWarning={true} className="slider-btn next-btn" onClick={nextSlide} aria-label="Next image">❯</button>

          <div className="slider-dots">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`dot ${currentSlide === i ? "active" : ""}`} onClick={() => goToSlide(i)}></span>
            ))}
          </div>
        </div>

        {/* Sticky Right Details Area */}
        <div className="product-details">
          <div className="trust-badge">EMPOWERING THE NEXT GENERATION</div>

          <h1 className="product-title">MyKids Know Money – A Smart <JumpingTopSiyaCoin size={50} onClick={handleTopCoinClick} /> Kids and Parents Guide</h1>
          <p className="product-subtitle" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-teal)', marginTop: '-10px' }}>UNSHAKABLE LIFE FOUNDATION</p>

          <div>
            <p>“Raising the next generation of wealth-builders and decision-makers.”</p>
          </div>

          {/* Super Child Flight Section (Mobile view: immediately visible above packages!) */}
          <SuperFlightSection className="super-flight-mobile" />

          {/* Package Selector */}
          <div className="package-selector" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', marginBottom: '16px' }}>
            
            {/* Solo Package */}
            <div 
              onClick={() => { setSelectedPackage('solo'); setCurrentSlide(0); }}
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: selectedPackage === 'solo' ? '3px solid var(--primary-teal)' : '2px solid #e2e8f0',
                background: selectedPackage === 'solo' ? 'rgba(45, 139, 148, 0.05)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'between',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'start' }}>
                <input suppressHydrationWarning={true} type="radio" checked={selectedPackage === 'solo'} onChange={() => { setSelectedPackage('solo'); setCurrentSlide(0); }} style={{ pointerEvents: 'none', marginTop: '4px' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Starter Saver Edition</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>book + stickers set</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>1,999</div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-teal)' }}>1,199</div>
              </div>
            </div>

            {/* Sibling Package */}
            <div 
              onClick={() => { setSelectedPackage('sibling'); setCurrentSlide(1); }}
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: selectedPackage === 'sibling' ? '3px solid var(--accent-yellow)' : '2px solid #e2e8f0',
                background: selectedPackage === 'sibling' ? 'rgba(251, 191, 36, 0.08)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'between',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'var(--accent-yellow)',
                color: '#000000',
                fontSize: '0.65rem',
                fontWeight: 900,
                padding: '2px 10px',
                borderBottomLeftRadius: '8px',
                textTransform: 'uppercase'
              }}>Best Value</div>
              
              <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'start' }}>
                <input suppressHydrationWarning={true} type="radio" checked={selectedPackage === 'sibling'} onChange={() => { setSelectedPackage('sibling'); setCurrentSlide(1); }} style={{ pointerEvents: 'none', marginTop: '4px' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Little Achiever Kit</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>book + stickers set + pencil + keychain + certificate</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>3,999</div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#b45309' }}>1,499</div>
              </div>
            </div>

            {/* Family Package */}
            <div 
              onClick={() => { setSelectedPackage('family'); setCurrentSlide(2); }}
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: selectedPackage === 'family' ? '3px solid var(--primary-teal)' : '2px solid #e2e8f0',
                background: selectedPackage === 'family' ? 'rgba(45, 139, 148, 0.05)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'between',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'start' }}>
                <input suppressHydrationWarning={true} type="radio" checked={selectedPackage === 'family'} onChange={() => { setSelectedPackage('family'); setCurrentSlide(2); }} style={{ pointerEvents: 'none', marginTop: '4px' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Family Champions Bundle</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>books + stickers set + pencil + keychain + certificate + parent guide and letter</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>5,999</div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-teal)' }}>2,999</div>
              </div>
            </div>
          </div>



          <div 
            className="price-section" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: isMobile ? 'center' : 'flex-start', 
              textAlign: isMobile ? 'center' : 'left',
              gap: '4px', 
              borderTop: '1px solid #e2e8f0', 
              paddingTop: '14px', 
              marginBottom: '16px',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: isMobile ? 'center' : 'flex-start', gap: '10px', width: '100%' }}>
              <span className="old-price" style={{ margin: 0 }}>Rs. {packages[selectedPackage].originalPrice.toLocaleString('en-IN')}</span>
              <span className="current-price" style={{ color: 'var(--primary-teal)', fontSize: isMobile ? '1.85rem' : '2.2rem', fontWeight: 900, margin: 0 }}>Rs. {packages[selectedPackage].price.toLocaleString('en-IN')}</span>
              <span className="sale-badge" style={{ margin: 0 }}>SALE</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textAlign: isMobile ? 'center' : 'left', width: '100%' }}>
              {packages[selectedPackage].tagline}
            </div>
          </div>

          <Link 
            id="main-secure-btn"
            href={`/checkout?package=${selectedPackage}${activeAffiliateRef ? `&ref=${encodeURIComponent(activeAffiliateRef)}` : ''}`}
            className="add-to-cart-btn btn-primary pulse" 
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <ShieldCheck size={24} strokeWidth={2.5} />
            <span>SECURE THE FUTURE NOW</span>
          </Link>



          <div className="trust-icons-strip">
            <div className="trust-icon-box">
              <span className="secure-icon"></span>
              <span>Guaranteed safe & secure checkout</span>
            </div>
          </div>
        </div>
      </main>
      {/* Vertical Marquee Section (Desktop: 4-Column Multi-Directional, Mobile: Single Column) */}
      {/* Super Child Flight Section (Desktop view) */}
      <SuperFlightSection className="super-flight-desktop" />

      {/* Future Ready Skills Section */}
      <section className="future-skills container">
        <div className="future-skills-grid">
          <div className="future-image">
            <img src="/kids_gen_lab_box.jpg" alt="KidsGenLab - My Kids Know Money" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }} />
          </div>
          <div className="future-content">
            <h2><StaticSiyaCoin size={44} flipped={true} /> Master the Game of Money — Tactical Skills for the Real World</h2>
            <p><strong>KidsGen Lab</strong> replaces boring theory with high-stakes simulations and real-world projects.We don't just teach kids how to count money-we teach them how to command it,building the executive confidence and tactical mindset needed to thrive in a volatile economy.</p>

            <div className="skills-tags">
              <span className="skill-tag">Battle-Tested by Parents</span>
              <span className="skill-tag">Wealth-Building Intuition</span>
              <span className="skill-tag">Action-First Learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Video Stories Section placed directly above Budget Buddy */}
      <ReelStoriesSection />

      {/* Budget Buddy Section */}
      <section className="magic-jars-section container" id="jars" style={{ padding: isMobile ? '32px 12px' : '48px 20px', margin: isMobile ? '24px auto' : '40px auto' }}>
        <div className="jars-header">
          <h3><StaticSiyaCoin size={44} flipped={true} /> Budget Buddy</h3>
          <p style={{ color: '#475569', fontSize: '1.2rem', fontWeight: 600, marginTop: '-6px', marginBottom: '14px' }}>
            Just enter the amount and watch it split!
          </p>
          <div className="money-input-wrapper">
            <input type="number" id="moneyInput" value={jarAmount} onChange={(e) => setJarAmount(e.target.value)} placeholder="Amount" min="0" suppressHydrationWarning={true} />
            <button onClick={calculateJarSplits} className="btn-primary" suppressHydrationWarning={true}>Split</button>
          </div>
        </div>

        <div className="jars-container">
          {[
            { id: "jarSpend", label: "SPEND", pct: 50, color: "var(--accent-yellow)", amount: jarSplits.spend },
            { id: "jarSave", label: "SAVE", pct: 40, color: "var(--primary-teal)", amount: jarSplits.save },
            { id: "jarGive", label: "GIVE", pct: 10, color: "var(--primary-teal-dark)", amount: jarSplits.give },
          ].map((jar) => (
            <div key={jar.id} className="jar-item" id={jar.id}>
              <div className="jar-glass-svg">
                <svg viewBox="0 0 200 250" className="jar-svg-element">
                  <defs>
                    <clipPath id={`clip-${jar.id}`}>
                      {/* Premium Laboratory Jar Shape */}
                      <path d="M70,20 L130,20 L130,60 L180,110 L180,220 C180,240 160,250 100,250 C40,250 20,240 20,220 L20,110 L70,60 Z" />
                    </clipPath>
                  </defs>

                  {/* Jar Outline & Glass Background - The Greenish Blue Border */}
                  <path
                    d="M70,20 L130,20 L130,60 L180,110 L180,220 C180,240 160,250 100,250 C40,250 20,240 20,220 L20,110 L70,60 Z"
                    fill="rgba(255, 255, 255, 0.05)"
                    stroke="rgba(45, 139, 148, 0.9)"
                    strokeWidth="8"
                    strokeLinejoin="round"
                  />

                  {/* Animated Liquid Section */}
                  <g clipPath={`url(#clip-${jar.id})`}>
                    <g transform={`translate(0, ${250 - (isJarAnimated ? (jar.pct * 2.5) : 0)})`} style={{ transition: 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                      <svg x="0" y="-20" width="400" height="270" viewBox="0 0 400 270" className="water-wave">
                        <path
                          d="M0,20 C50,0 100,40 150,20 C200,0 250,40 300,20 C350,0 400,40 400,20 L400,270 L0,270 Z"
                          fill={jar.color}
                          fillOpacity="0.85"
                        />
                      </svg>
                    </g>
                  </g>

                  {/* Internal Highlights */}
                  <path d="M40,120 Q50,110 60,120" stroke="white" strokeWidth="3" fill="none" opacity="0.3" />
                </svg>
              </div>
              <div className="jar-amount">{jar.amount.toLocaleString('en-IN')}</div>
              <div className="jar-label-text" style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', marginTop: '5px' }}>{jar.label} ({jar.pct}%)</div>
            </div>
          ))}
        </div>
      </section>

      {/* Inflation Section */}
      <section className="infographic-section container" id="wealthCalculator" style={{ padding: isMobile ? '28px 12px' : '48px 20px', margin: isMobile ? '32px auto' : '48px auto', background: 'transparent' }}>
        <div className="wealth-goal-header" style={{ textAlign: 'center', marginBottom: isMobile ? '16px' : '22px' }}>
          <h2 style={{ fontSize: isMobile ? '1.65rem' : '3.2rem', fontWeight: 900, marginBottom: '6px', color: 'var(--primary-teal)', letterSpacing: isMobile ? '-0.3px' : '1px', lineHeight: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>Future Fortune Builder</span> <StaticSiyaCoin size={isMobile ? 40 : 56} />
          </h2>
          <p style={{ fontSize: isMobile ? '0.88rem' : '1.15rem', fontWeight: 700, color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.35 }}>
            Make your kids Millionaire or Billionaire.
          </p>
        </div>

        <div className="wealth-calc-card" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '14px 10px' : '24px 20px',
          background: '#ffffff',
          borderRadius: isMobile ? '18px' : '26px',
          boxShadow: '0 50px 120px rgba(45, 139, 148, 0.12), 0 10px 40px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(45, 139, 148, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Decorative Background Elements */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(250, 209, 41, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(45, 139, 148, 0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          {!isJourneyStarted ? (
            /* Setup Phase Form */
            <div className="journey-setup" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <div style={{ marginBottom: isMobile ? '8px' : '14px' }}>
                <h3 style={{ fontSize: isMobile ? '1.35rem' : '2.1rem', fontWeight: 900, color: '#0f172a', marginTop: '2px', marginBottom: '4px' }}>
                  The Path to <span style={{ color: 'var(--primary-teal)' }}>WealthKid</span>
                </h3>
                <p style={{ fontSize: isMobile ? '0.82rem' : '1rem', fontWeight: 600, color: '#64748b', lineHeight: 1.4 }}>
                  Craft a custom financial blueprint for your child's future.
                </p>
              </div>

              <div className="calc-inputs" style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '8px' : '14px',
                marginBottom: isMobile ? '6px' : '16px',
                textAlign: 'left'
              }}>
                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px', color: '#1e293b', fontSize: '0.80rem' }}>
                    CHILD'S CURRENT AGE
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={childAge}
                      min="0" max="120"
                      onChange={(e) => {
                        setChildAge(e.target.value === "" ? "" : parseInt(e.target.value));
                        if (e.target.value !== "") setErrors(prev => ({ ...prev, age: "" }));
                      }}
                      style={{
                        width: '100%', padding: isMobile ? '9px 12px' : '14px 18px', borderRadius: isMobile ? '12px' : '16px',
                        border: `2px solid ${errors.age ? '#ef4444' : '#e2e8f0'}`, background: '#f8fafc',
                        fontSize: isMobile ? '1.15rem' : '1.4rem', fontWeight: 900, color: '#0f172a',
                        transition: 'all 0.3s ease', outline: 'none',
                        boxShadow: errors.age ? '0 0 0 4px rgba(239, 68, 68, 0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}
                      suppressHydrationWarning={true}
                    />
                  </div>
                  {errors.age && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 800, marginTop: '4px', marginLeft: '4px' }}>
                      ↑ {errors.age}
                    </motion.div>
                  )}
                </div>

                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px', color: '#1e293b', fontSize: '0.80rem' }}>
                    MONTHLY INVESTMENT
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={monthlyInvest}
                      min="0"
                      onChange={(e) => {
                        setMonthlyInvest(e.target.value === "" ? "" : parseInt(e.target.value));
                        if (e.target.value !== "") setErrors(prev => ({ ...prev, invest: "" }));
                      }}
                      style={{
                        width: '100%', padding: isMobile ? '9px 12px' : '14px 18px', borderRadius: isMobile ? '12px' : '16px',
                        border: `2px solid ${errors.invest ? '#ef4444' : '#e2e8f0'}`, background: '#f8fafc',
                        fontSize: isMobile ? '1.15rem' : '1.4rem', fontWeight: 900, color: '#0f172a',
                        transition: 'all 0.3s ease', outline: 'none',
                        boxShadow: errors.invest ? '0 0 0 4px rgba(239, 68, 68, 0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}
                      suppressHydrationWarning={true}
                    />
                  </div>
                  {errors.invest && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 800, marginTop: '4px', marginLeft: '4px' }}>
                      ↑ {errors.invest}
                    </motion.div>
                  )}
                </div>

                <div className="input-group" style={{ gridColumn: isMobile ? '1' : 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: '4px', color: '#1e293b', fontSize: '0.80rem', textAlign: 'center' }}>
                    🎯 SELECT YOUR WEALTH AMBITION
                  </label>
                  <div className="goal-toggle-wrapper" style={{
                    display: 'flex', gap: '6px', background: '#f1f5f9',
                    padding: isMobile ? '4px' : '6px', borderRadius: isMobile ? '12px' : '16px', border: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={() => setWealthGoalMode('millionaire')}
                      style={{
                        flex: 1, padding: isMobile ? '10px 8px' : '14px', borderRadius: isMobile ? '12px' : '14px', fontSize: isMobile ? '0.88rem' : '1.05rem', fontWeight: 800,
                        transition: 'all 0.3s ease', cursor: 'pointer',
                        background: wealthGoalMode === 'millionaire' ? 'var(--primary-teal)' : 'transparent',
                        color: wealthGoalMode === 'millionaire' ? '#fff' : '#64748b',
                        border: 'none',
                        boxShadow: wealthGoalMode === 'millionaire' ? '0 10px 20px rgba(45, 139, 148, 0.2)' : 'none'
                      }}
                      suppressHydrationWarning={true}
                    >
                      Millionaire Goal
                    </button>
                    <button
                      onClick={() => setWealthGoalMode('billionaire')}
                      style={{
                        flex: 1, padding: isMobile ? '10px 8px' : '14px', borderRadius: isMobile ? '12px' : '14px', fontSize: isMobile ? '0.88rem' : '1.05rem', fontWeight: 800,
                        transition: 'all 0.3s ease', cursor: 'pointer',
                        background: wealthGoalMode === 'billionaire' ? 'var(--primary-teal)' : 'transparent',
                        color: wealthGoalMode === 'billionaire' ? '#fff' : '#64748b',
                        border: 'none',
                        boxShadow: wealthGoalMode === 'billionaire' ? '0 10px 20px rgba(45, 139, 148, 0.2)' : 'none'
                      }}
                      suppressHydrationWarning={true}
                    >
                      Billionaire Goal
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(250, 209, 41, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  let ageErr = "";
                  let invErr = "";

                  if (childAge === "") ageErr = "Please provide child's age";
                  else if (childAge > 100) ageErr = "Age cannot be above 100";

                  if (monthlyInvest === "") invErr = "Please provide investment amount";
                  else if (monthlyInvest < 100) invErr = "Minimum investment is 100";

                  setErrors({ age: ageErr, invest: invErr });

                  if (ageErr || invErr) return;

                  setIsJourneyStarted(true);
                }}
                style={{
                  width: '100%', padding: isMobile ? '13px 18px' : '18px 24px', fontSize: isMobile ? '1.1rem' : '1.35rem', borderRadius: isMobile ? '14px' : '18px',
                  boxShadow: '0 15px 35px rgba(250, 209, 41, 0.25)', border: 'none',
                  cursor: 'pointer', background: 'var(--accent-yellow)', color: 'var(--primary-teal)',
                  fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
                suppressHydrationWarning={true}
              >
                <span>GENERATE WEALTH MAP</span>
                <ArrowRight size={22} strokeWidth={2.8} />
              </motion.button>
            </div>
          ) : (
            /* Animated Journey Phase */
            <div className="journey-viz" style={{ minHeight: isMobile ? '400px' : '640px', position: 'relative', paddingTop: isMobile ? '12px' : '0' }}>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#f0fdfa', borderColor: 'var(--primary-teal)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsJourneyStarted(false)}
                style={{
                  position: 'absolute',
                  top: isMobile ? '-10px' : '-20px',
                  right: isMobile ? '2px' : '8px',
                  width: isMobile ? '36px' : '42px',
                  height: isMobile ? '36px' : '42px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '2px solid #cbd5e1',
                  color: 'var(--primary-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  zIndex: 20
                }}
                title="Reset / Try Again"
                aria-label="Try Again"
              >
                <RotateCcw size={isMobile ? 18 : 20} strokeWidth={2.5} />
              </motion.button>

              {/* Animated SVG Path for Achievement */}
              <svg viewBox="0 0 1000 500" style={{ width: '100%', height: isMobile ? '340px' : '560px', zIndex: 1, position: 'relative', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="achieveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--accent-yellow)" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>

                {/* Background Guide Path */}
                <path
                  d={exactGraphPathD}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active Animated Path — thin, clean, no glow */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  d={exactGraphPathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dynamic Milestones */}
                {calculateAchievement().milestones.map((m, i) => (
                  <g key={i}>
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.5 + 0.5 }}
                      cx={m.x * 9 + 50}
                      cy={getTradingY(m.x / 100)}
                      r="13"
                      fill="#10b981"
                      stroke="#fff"
                      strokeWidth="4"
                    />
                    {/* Wealth Label */}
                    <motion.foreignObject
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.5 + 0.8 }}
                      x={m.x * 9 + (i === 0 ? 0 : i === 4 ? -60 : -25)}
                      y={getTradingY(m.x / 100) - 80}
                      width="150"
                      height="70"
                    >
                      <div style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        color: '#34d399',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        fontSize: '1.45rem',
                        fontWeight: 900,
                        textAlign: 'center',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                        border: '2px solid rgba(52, 211, 153, 0.4)'
                      }}>
                        {m.wealth.toLocaleString('en-IN', { notation: 'compact' })}
                      </div>
                    </motion.foreignObject>

                    {/* Axis Labels */}
                    <text
                      x={m.x * 9 + 50}
                      y="490"
                      textAnchor="middle"
                      style={{ fontSize: '1.45rem', fontWeight: 900, fill: '#0f172a' }}
                    >
                      {i === 0 ? `START` : `AGE ${m.age}`}
                    </text>
                  </g>
                ))}
                {/* Growth Courier - Now inside SVG to perfectly match scaling */}
                <motion.foreignObject
                  x={0}
                  y={0}
                  width="140"
                  height="140"
                  animate={{
                    x: courierKeyframesX,
                    y: courierKeyframesY
                  }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  style={{ overflow: 'visible', zIndex: 10 }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <CharacterCourier startAge={Number(childAge)} endAge={calculateAchievement().achievementAge} />
                  </div>
                </motion.foreignObject>
                {/* Hover Zones for Interactivity */}
                {graphPoints.map((pt, i) => (
                  <rect
                    key={`hover-${i}`}
                    x={pt.x - 10} // 20px wide hover zone
                    y={0}
                    width={20}
                    height={500}
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'crosshair' }}
                  />
                ))}

                {/* Tooltip */}
                {hoveredPoint && (
                  <g style={{ pointerEvents: 'none', zIndex: 50 }}>
                    {/* Vertical Line */}
                    <line
                      x1={hoveredPoint.x} y1={hoveredPoint.y}
                      x2={hoveredPoint.x} y2={490}
                      stroke="#94a3b8" strokeDasharray="5,5" strokeWidth="2"
                    />
                    {/* Point Dot */}
                    <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    {/* Tooltip Box */}
                    <foreignObject x={hoveredPoint.x - 80} y={hoveredPoint.y - 90} width="160" height="85">
                      <div style={{
                        background: '#1e293b', color: '#fff', padding: '10px 14px', borderRadius: '12px',
                        fontSize: '1.25rem', fontWeight: 900, textAlign: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
                        border: '1.5px solid #10b981'
                      }}>
                        AGE {Math.round(Number(childAge) + hoveredPoint.p * (calculateAchievement().achievementAge - Number(childAge)))}<br />
                        <span style={{ color: '#34d399', fontSize: '1.4rem' }}>
                          {calculateStepUpSIP(Number(monthlyInvest), 12, Math.round(hoveredPoint.p * (calculateAchievement().achievementAge - Number(childAge))), wealthGoalMode === 'billionaire' ? 10 : 5).toLocaleString('en-IN', { notation: 'compact' })}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                )}
              </svg>

              {/* Compact, Short Goal Achieved Box */}
              <div style={{
                marginTop: isMobile ? '12px' : '18px',
                textAlign: 'center',
                padding: isMobile ? '10px 14px' : '12px 24px',
                background: '#f0fdf4',
                borderRadius: isMobile ? '14px' : '18px',
                border: '1.5px solid #86efac',
                maxWidth: '680px',
                margin: `${isMobile ? '12px' : '18px'} auto 0`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? '8px' : '14px',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: isMobile ? '1.2rem' : '1.4rem' }}>🎯</span>
                <span style={{ fontSize: isMobile ? '0.88rem' : '0.95rem', fontWeight: 900, color: '#166534', letterSpacing: '0.5px' }}>
                  GOAL REACHED:
                </span>
                <span style={{ fontSize: isMobile ? '0.88rem' : '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                  Target <strong style={{ color: '#10b981' }}>{wealthGoalMode === 'billionaire' ? '1 Crore' : '10 Lakh'}</strong> at <strong style={{ color: '#10b981', fontSize: isMobile ? '0.98rem' : '1.1rem' }}>Age {calculateAchievement().achievementAge}</strong> ({monthlyInvest.toLocaleString('en-IN')}/mo)
                </span>
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '40px', maxWidth: '700px', margin: '40px auto 0', fontStyle: 'italic', fontWeight: 500 }}>
          <strong>Disclaimer:</strong> Investments are subject to market risks; past returns don&apos;t guarantee future results, so please consult a professional before investing.
        </p>
      </section>

      {/* Depreciation Section */}
      <section className="depreciation-section container" id="depreciation">
        <div className="dep-title-row">
          <h2 className="dep-main-title"><StaticSiyaCoin size={isMobile ? 32 : 46} flipped={true} /> Depreciation</h2>
          <p className="dep-subtitle">Things lose value over time. Watch it happen live!</p>
        </div>

        {/* Scenic Road World */}
        <div className="dep-scene template-scene">
          {/* Background Layers */}
          <div className="bg-sky"></div>
          <div className="bg-clouds">
            <div className="cloud-bubble cb1"></div>
            <div className="cloud-bubble cb2"></div>
            <div className="cloud-bubble cb3"></div>
            <div className="cloud-bubble cb4"></div>
            <div className="cloud-bubble cb5"></div>
          </div>
          <div className="bg-hill-back"></div>

          {/* Foreground Slope */}
          <div className="slope-container">
            {/* Year Markers on the Slope */}
            <div className="slope-markers">
              {Array.from({ length: maxDepYears + 1 }, (_, i) => i).map((yr) => {
                return (
                  <div
                    key={yr}
                    className={`slope-marker ${depYear >= yr ? "passed" : ""}`}
                    style={{ left: `calc((var(--dep-range) * ${yr / maxDepYears}) * 1% + var(--dep-start) * 1%)` }}
                  >
                    <div className="slope-marker-dot"></div>
                    <div className="slope-marker-text">{2026 + yr}</div>
                  </div>
                );
              })}
            </div>

            {/* Cyclist */}
            <div
              className={`slope-cyclist ${isMoving ? "dep-bike-bounce" : ""}`}
              style={{
                left: `calc((var(--dep-range) * ${depYear / maxDepYears}) * 1% + var(--dep-start) * 1%)`,
                transition: "left 0.6s cubic-bezier(0.25,1,0.5,1)"
              }}
            >
              <div className="slope-cyclist-value">
                {Math.round(depValue).toLocaleString('en-IN')}
              </div>
              <span className="cyclist-emoji">🚴‍♂️</span>
            </div>
          </div>
        </div>

        {/* Interactive Controls & Value Tracking */}
        <div className="dep-interactive-area" style={{
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px'
        }}>
          {/* Primary Action Button - First */}
          <div className="dep-actions">
            {depYear < maxDepYears ? (
              <button
                onClick={handleDepreciate}
                className="btn-primary action-btn"
                style={{
                  padding: '20px 80px',
                  fontSize: '1.8rem',
                  borderRadius: '100px',
                  boxShadow: '0 15px 30px rgba(45, 139, 148, 0.25)'
                }}
                suppressHydrationWarning={true}
              >
                Go
              </button>
            ) : (
              <button
                onClick={resetDepreciation}
                className="btn-secondary"
                style={{
                  padding: '16px 40px',
                  borderRadius: '50px',
                  fontWeight: 800
                }}
                suppressHydrationWarning={true}
              >
                🔄 Try Again
              </button>
            )}
          </div>

          {/* Value Panel - Second - Premium Teal & Yellow Theme */}
          <div className="dep-value-panel" style={{
            background: 'var(--primary-teal)',
            padding: '30px 60px',
            borderRadius: '40px',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(45, 139, 148, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle Inner Glow */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)', pointerEvents: 'none' }} />

            <div className="dep-value-amount" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-yellow)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              {Math.round(depValue).toLocaleString('en-IN')}
            </div>
            <div className="dep-value-label" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.9 }}>
              Current Bicycle Value
            </div>
            {depYear > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="dep-value-message"
                style={{ marginTop: '15px', color: '#fff', fontWeight: 800, fontSize: '1rem', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '50px' }}
              >
                {depMessage}
              </motion.div>
            )}
          </div>

          {depYear > 0 && depYear < maxDepYears && (
            <button
              onClick={resetDepreciation}
              suppressHydrationWarning={true}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Start Over
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="examples-box" style={{ marginTop: "24px" }}>
          <h3>Real-Life Depreciation Examples</h3>
          <p>Cars, phones, and toys lose value over time. A new video game is pricey, but a year later, a used one costs far less.</p>
        </div>
      </section>

      <TradeFunSection />

      <section className="struggle-section" id="vision">
        <div className="container">
          <div className="struggle-header">
            <span className="vision-label">Our Vision</span>
            <h2 className="struggle-main-title">
              <StaticSiyaCoin flipped={true} /> To parents who want their children to have <span style={{ color: 'var(--primary-teal)' }}>choices — not pressure.</span>
            </h2>
            <div className="struggle-subheader-wrap">
              <h3 className="struggle-subtitle">The Invisible Struggle</h3>
              <p className="struggle-subtitle-text">
                What many parents miss until it's too late: the heavy burden of financial unawareness and insecurity that children inherit.
              </p>
            </div>
          </div>
          <div className="struggle-grid">
            <div className="struggle-card" style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px 20px',
              color: '#0f172a',
              boxShadow: '0 20px 40px rgba(45, 139, 148, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '100%',
                marginBottom: '14px',
              }}>
                <img src="/financial_dna_realistic.jpg" alt="Financial DNA realistic photo" style={{ width: '100%', height: 'auto', borderRadius: '14px' }} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-teal)', marginBottom: '8px' }}>Financial DNA</h3>
              <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>Children don't fail financially. They copy silently. Your spending, budgeting, debt, and risk habits become their financial blueprint.</p>
            </div>

            <div className="struggle-card" style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px 20px',
              color: '#0f172a',
              boxShadow: '0 20px 40px rgba(45, 139, 148, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '100%',
                marginBottom: '14px',
              }}>
                <img src="/emi_trap_realistic.jpg" alt="The EMI Trap realistic photo" style={{ width: '100%', height: 'auto', borderRadius: '16px' }} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-teal)', marginBottom: '8px' }}>The EMI Trap</h3>
              <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>EMI → Stress → Job Trap → No Risk → No Growth. Without debt awareness early on, children fall into cycles that limit their life choices.</p>
            </div>

            <div className="struggle-card" style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px 20px',
              color: '#0f172a',
              boxShadow: '0 20px 40px rgba(45, 139, 148, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '100%',
                marginBottom: '14px',
              }}>
                <img src="/financial_shock_realistic.jpg" alt="The 22-Year Shock realistic photo" style={{ width: '100%', height: 'auto', borderRadius: '16px' }} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-teal)', marginBottom: '8px' }}>The 22-Year Shock</h3>
              <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>No financial education until 22, then suddenly: Rent, Bills, Loans, Taxes. This sudden responsibility creates deep anxiety and fear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Spark Box Section */}
      <section className="spark-box-section" id="sparkBox">
        <div className="container">
          <div className="spark-box-card">
            <div className="spark-box-glow"></div>
            <div className="spark-header">
              <h2 className="spark-title">Business Idea Brainstormer <StaticSiyaCoin /></h2>
              <p className="spark-subtitle">Every big business started with a small idea. Tell us what you love, and we'll spark your first business idea! 🚀</p>
            </div>

            <div className="spark-input-area">
              <div className="spark-input-wrapper">
                <input
                  type="text"
                  className="spark-input"
                  value={sparkInput}
                  onChange={(e) => setSparkInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSparkGenerate()}
                  placeholder="I love cooking, drawing, animals..."
                  style={hasAdultKeyword ? { borderColor: '#ef4444', boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' } : {}}
                  suppressHydrationWarning={true}
                />
              </div>
              <button
                className="spark-generate-btn"
                onClick={handleSparkGenerate}
                disabled={isSparkLoading || hasAdultKeyword}
                style={hasAdultKeyword ? { background: '#94a3b8', color: '#cbd5e1', cursor: 'not-allowed', boxShadow: 'none' } : {}}
                suppressHydrationWarning={true}
              >
                {isSparkLoading ? (
                  <span className="spark-loading">
                    <span className="spark-dot"></span>
                    <span className="spark-dot"></span>
                    <span className="spark-dot"></span>
                  </span>
                ) : (
                  "⚡ Spark My Idea!"
                )}
              </button>
            </div>

            {hasAdultKeyword && (
              <div style={{
                color: '#f87171',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginTop: '12px',
                textAlign: 'center',
                background: 'rgba(239, 68, 68, 0.15)',
                padding: '10px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)',
                display: 'block'
              }}>
                ⚠️ Enter a valid kid-friendly idea!
              </div>
            )}

            {sparkResult && (
              <div className="spark-result">
                <div className="spark-result-emoji">{sparkResult.emoji}</div>
                <h3 className="spark-result-title">{sparkResult.idea}</h3>
                <p className="spark-result-desc">{sparkResult.description}</p>
                <div className="spark-motivation">
                  <span className="spark-motivation-icon">🔥</span>
                  <p>{sparkResult.motivation}</p>
                </div>
                <button className="spark-retry-btn" onClick={() => { setSparkResult(null); setSparkInput(""); }} suppressHydrationWarning={true}>
                  Try Another Interest →
                </button>
              </div>
            )}

            <div className="spark-examples">
              <span className="spark-example-label">Try:</span>
              {["🐶 Dogs", "🎨 Drawing", "🍪 Baking", "💻 Coding", "📚 Reading"].map((tag) => (
                <button
                  key={tag}
                  className="spark-example-tag"
                  onClick={() => {
                    setSparkInput(tag.slice(2).trim());
                    setSparkResult(null);
                  }}
                  suppressHydrationWarning={true}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shopping-spree-section container" id="shoppingSpree">
        <div className="money-magic-header">
          <span className="money-magic-badge" style={{ backgroundColor: '#ecc94b', color: '#1a202c' }}>{"\uD83D\uDECD\uFE0F"} MY SHOPPING SPREE</span>
          <h2 className="section-title text-center"><StaticSiyaCoin flipped={true} /> Needs vs Wants</h2>
          <p className="section-subtitle text-center">
            A <strong style={{ color: '#10b981' }}>{language === 'hi' ? 'ज़रूरत (Need)' : language === 'ta' ? 'தேவை (Need)' : 'Need'}</strong> {language === 'hi' ? 'वह है जिसके बिना आप जीवित नहीं रह सकते।' : language === 'ta' ? 'என்பது உயிர்வாழ அவசியமான ஒன்று.' : 'is something you must have to survive.'} A <strong style={{ color: '#ec4899' }}>{language === 'hi' ? 'चाहत (Want)' : language === 'ta' ? 'விருப்பம் (Want)' : 'Want'}</strong> {language === 'hi' ? 'वह है जिसे पाना अच्छा लगता है!' : language === 'ta' ? 'என்பது இருந்தால் நன்றாக இருக்கும் ஒன்று!' : 'is something nice to have!'}
          </p>
        </div>

        <div className="spree-grid">
          {/* Needs Column */}
          <div className="spree-column needs-column">
            <h3 className="column-title needs-title">{language === 'hi' ? 'ज़रूरत की बास्केट 🛒' : language === 'ta' ? 'தேவை கூடை 🛒' : 'The Needs Basket 🛒'}</h3>
            {needsList.map((item, idx) => (
              <div className="spree-item" key={`need-${idx}`}>
                <div className="spree-icon">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="spree-info">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Wants Column */}
          <div className="spree-column wants-column">
            <h3 className="column-title wants-title">{language === 'hi' ? 'चाहतों की विशलिस्ट ✨' : language === 'ta' ? 'விருப்பப் பட்டியல் ✨' : 'The Wants Wishlist ✨'}</h3>
            {wantsList.map((item, idx) => (
              <div className="spree-item" key={`want-${idx}`}>
                <div className="spree-icon">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="spree-info">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="money-magic-section container" id="superpowers">
        <div className="money-magic-header" style={{ textAlign: 'center', marginBottom: '14px' }}>
          <h2 className="section-title text-center" style={{ fontSize: isMobile ? '1.08rem' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', margin: '0 auto', letterSpacing: isMobile ? '-0.2px' : undefined, lineHeight: 1.3 }}>
            <span>Unlock Your Kids&apos; Money Superpowers</span> <StaticSiyaCoin size={isMobile ? 32 : 40} />
          </h2>
          <p className="section-subtitle text-center" style={{ fontSize: isMobile ? '0.80rem' : undefined, marginTop: isMobile ? '2px' : undefined }}>
            7 essential financial superpowers every child needs to conquer the real world
          </p>
        </div>
        <div className="magic-stickers-grid">

          <div className="magic-stickers-track">
            {/* We map the stickers twice into marquee-groups. Group 2 is meant as a shadow copy for continuous scrolling in mobile. */}
            {[1, 2].map((groupNum) => (
              <div
                key={`group-${groupNum}`}
                className={`marquee-group ${groupNum === 2 ? 'duplicate-group' : ''}`}
                aria-hidden={groupNum === 2 ? true : undefined}
              >
                {[
                  { color: 'gold', icon: '/sticker_first_earner.jpg', title: 'First Earner', desc: 'Learn the pride of earning your very first rupee' },
                  { color: 'red', icon: '/sticker_goal_achiever.jpg', title: 'Goal Achiever', desc: 'Set targets, aim high, and hit your money goals' },
                  { color: 'green', icon: '/sticker_budget_buddy.jpg', title: 'Budget Buddy', desc: 'Master the art of planning where every rupee goes' },
                  { color: 'blue', icon: '/sticker_investor_mindset.jpg', title: 'Investor Mindset', desc: 'Think long-term and make your money grow' },
                  { color: 'purple', icon: '/sticker_inflation_awareness.jpg', title: 'Inflation Awareness', desc: 'Understand why prices rise and how to stay ahead' },
                  { color: 'orange', icon: '/sticker_smart_spender.jpg', title: 'Smart Spender', desc: 'Know the difference between needs and wants' },
                  { color: 'teal', icon: '/sticker_business_brain.jpg', title: 'Business Brain', desc: 'Think like an entrepreneur and spot opportunities' }
                ].map((s, i) => (
                  <div key={i} className="magic-sticker-float">
                    <div className={`sticker-glow sticker-${s.color}`}></div>
                    <div className="sticker-img-container">
                      <img src={s.icon} alt={s.title} className="magic-sticker-img-proper" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </section>


      <section className="reviews container text-center" style={{ padding: isMobile ? "36px 16px" : "50px 20px", margin: isMobile ? "28px auto" : "44px auto" }}>
        <h2 className="section-title">Customer Reviews</h2>
        <p className="section-subtitle" style={{ marginBottom: "24px" }}>Real feedback from happy parents</p>
        <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", textAlign: "left" }}>
          
          <div className="review-card" style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StarRating rating={5} size={18} />
            </div>
            <h4 style={{ margin: "2px 0", fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Ananya Sharma, Bengaluru</h4>
            <p style={{ fontSize: "0.9rem", color: '#475569', lineHeight: 1.5, margin: 0 }}>
              &quot;My son stopped asking for toys every week. He understands needs vs wants and saves 40% of his pocket money in his Budget Buddy jar!&quot;
            </p>
          </div>

          <div className="review-card" style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StarRating rating={4.5} size={18} />
            </div>
            <h4 style={{ margin: "2px 0", fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Rajesh Patel, Ahmedabad</h4>
            <p style={{ fontSize: "0.9rem", color: '#475569', lineHeight: 1.5, margin: 0 }}>
              &quot;The comic stories made depreciation & smart saving effortless for my daughter. Fantastic physical kit and stickers!&quot;
            </p>
          </div>

          <div className="review-card" style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '18px', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StarRating rating={5} size={18} />
            </div>
            <h4 style={{ margin: "2px 0", fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Priya Venkatesh, Chennai</h4>
            <p style={{ fontSize: "0.9rem", color: '#475569', lineHeight: 1.5, margin: 0 }}>
              &quot;The sibling kit stopped all money arguments at home. Both kids loved trading and proudly earned their superpower medals!&quot;
            </p>
          </div>

        </div>
      </section>

      <section className="faq-section container" id="faq" style={{ maxWidth: "800px", padding: isMobile ? "36px 14px 44px" : "50px 20px 60px", margin: isMobile ? "28px auto 40px auto" : "44px auto 65px auto" }}>
        <h2 className="section-title text-center" style={{ fontSize: isMobile ? '1.35rem' : undefined, fontWeight: 900, letterSpacing: isMobile ? '-0.2px' : undefined, lineHeight: 1.25, marginBottom: isMobile ? '16px' : '24px' }}>
          Frequently Asked Questions
        </h2>
        <div className="product-accordions" style={{ marginTop: "16px" }}>
          {[
            { q: "Is my 5-year-old really ready to learn about money?", a: "Yes, and it is actually the ideal time to start. Research shows that foundational money habits, emotional triggers, and self-regulation patterns are largely formed before age seven. At age five, children don't need complex math or banking terms—they learn through play, visual analogies, and copying what you do. The activities in this book are designed specifically so young children can absorb concepts like patience, choices, and saving through simple, fun routines." },
            { q: "I struggle with my own financial habits. How can I possibly teach my child?", a: "You do not need to be a finance expert or have a flawless financial history to raise a money-smart child. In fact, learning together makes the process more impactful. The book is structured around parent-child mirroring—meaning the simple games and daily prompts will help reset your own relationship with money while naturally guiding your child. It is a shared family journey, not a lecture." },
            { q: "Won't talking about money this early make my child greedy or stressed?", a: "Not at all. Children usually feel stressed about money when it is treated as a secretive, taboo, or tense topic at home. By introducing money as an open tool for solving problems, sharing with others, and building independence, kids develop a healthy, confident mindset rather than fear or obsession." },
            { q: "How much time does this take each week?", a: "As little as 5 to 10 minutes a day. The system is designed to integrate effortlessly into everyday moments you already share—like grocery shopping, distributing pocket money, or doing simple chores. It is about shifting daily conversations, not adding extra homework." },
            { q: "What if my child just wants to spend everything right away?", a: "That is completely normal! Young children are naturally driven by instant gratification. Instead of saying \"no\" and causing tantrums, the book provides gentle frameworks that teach delayed gratification playfully. When children see their savings physically grow to buy something they truly value, the habit sticks for life." }
          ].map((faq, i) => (
            <div key={i} className={`accordion-item ${activeAccordion === `faq-${i}` ? "active" : ""}`}>
              <button className="accordion-header" type="button" onClick={() => toggleAccordion(`faq-${i}`)} suppressHydrationWarning={true}>
                {faq.q}
                <span className="accordion-arrow"></span>
              </button>
              <div className="accordion-content">
                <p style={{ margin: 0 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Mobile Sticky Footer (Only Buy Now disappears when Main CTA is visible; WhatsApp button ALWAYS remains on mobile) */}
      <div 
        className={`mobile-sticky-footer ${isMainCtaVisible ? 'hide-buy-btn' : 'with-buy-bar'}`}
        style={{
          background: isMainCtaVisible ? 'transparent' : 'rgba(255, 255, 255, 0.96)',
          boxShadow: isMainCtaVisible ? 'none' : '0 -4px 20px rgba(0,0,0,0.12)',
          borderTop: isMainCtaVisible ? 'none' : '1px solid rgba(0,0,0,0.08)',
          pointerEvents: isMainCtaVisible ? 'none' : 'auto',
          justifyContent: isMainCtaVisible ? 'flex-end' : 'center',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {!isMainCtaVisible && (
          <Link 
            href={`/checkout?package=${selectedPackage}${activeAffiliateRef ? `&ref=${encodeURIComponent(activeAffiliateRef)}` : ''}`}
            className="sticky-buy-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              pointerEvents: 'auto'
            }}
          >
            <ShoppingCart size={18} strokeWidth={2.4} />
            <span>Buy Now - Rs. {packages[selectedPackage].price.toLocaleString('en-IN')}</span>
          </Link>
        )}
        <a
          href="https://wa.me/919876543210?text=Hi%20KidsGen%20Lab!%20I%20have%20a%20question%20about%20the%20financial%20learning%20kit."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="mobile-attached-wa-btn"
          style={{ pointerEvents: 'auto' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js" strategy="afterInteractive" />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* ORDER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 space-y-5 text-slate-800 relative shadow-2xl border-8 border-slate-900"
            >
              <button suppressHydrationWarning={true} onClick={() => !isProcessingPayment && setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 text-xl font-bold">✕</button>

              <div className="text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="font-display font-bold text-2xl text-slate-900">Your Family Journey Begins!</h3>
                <p className="text-xs text-slate-600">Enter your details to receive the Family Wealth Kit immediately.</p>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parent Full Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isProcessingPayment}
                    suppressHydrationWarning={true}
                    value={orderName}
                    onChange={e => setOrderName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled={isProcessingPayment}
                    suppressHydrationWarning={true}
                    value={orderEmail}
                    onChange={e => setOrderEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      disabled={isProcessingPayment}
                      suppressHydrationWarning={true}
                      value={orderPhone}
                      onChange={e => setOrderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / Location</label>
                    <input
                      type="text"
                      disabled={isProcessingPayment}
                      suppressHydrationWarning={true}
                      value={orderCity}
                      onChange={e => setOrderCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>
                <button
                  suppressHydrationWarning={true}
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-display font-bold py-3.5 rounded-xl shadow-[0_6px_0_#15803D] text-sm border-4 border-emerald-800 mt-2 transition-transform active:translate-y-1 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Proceed to Pay ({packages[selectedPackage].price.toLocaleString('en-IN')})</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Flying Siya Coin Animation from Top Title to Let's Play Button */}
      <AnimatePresence>
        {isTopCoinFlying && (
          <motion.div
            initial={{
              position: "fixed",
              left: flyStart.x,
              top: flyStart.y,
              x: "-50%",
              y: "-50%",
              scale: 1,
              opacity: 1,
              rotate: 0,
              zIndex: 100000
            }}
            animate={{
              left: flyEnd.x,
              top: flyEnd.y,
              scale: [1, 1.2, 0.15],
              rotate: [0, 180, 360],
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: 0.75,
              ease: [0.25, 1, 0.5, 1]
            }}
            onAnimationComplete={handleTopFlightComplete}
            style={{
              pointerEvents: "none",
              filter: "brightness(1.25) saturate(1.25) drop-shadow(0 0 14px rgba(250, 209, 41, 0.7)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))"
            }}
          >
            <img
              src="/siya_coin_clean.png"
              alt="Flying Siya Coin"
              style={{
                width: "56px",
                height: "auto",
                display: "block"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bright Little Stars Burst Effect at Let's Play Button */}
      <AnimatePresence>
        {topCoinSparkles.length > 0 && (
          <div
            style={{
              position: "fixed",
              left: sparkleCenter.x,
              top: sparkleCenter.y,
              width: 0,
              height: 0,
              zIndex: 100001,
              pointerEvents: "none"
            }}
          >
            {topCoinSparkles.map((star) => (
              <motion.div
                key={star.id}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  x: star.x,
                  y: star.y,
                  scale: [0, star.scale, 0],
                  opacity: [1, 1, 0],
                  rotate: star.rotation
                }}
                transition={{
                  duration: 0.8,
                  delay: star.delay,
                  ease: "easeOut"
                }}
                style={{
                  position: "absolute",
                  left: "-10px",
                  top: "-10px",
                  color: star.color,
                  filter: "drop-shadow(0 0 4px currentColor)"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={star.color}>
                  <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <WhatsAppFloatButton />
    </>
  );
}
