import { useEffect } from 'react';

interface IntroSceneProps { onComplete: () => void }

export default function IntroScene3D({ onComplete }: IntroSceneProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3_400);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="intro-scene" aria-hidden="true">
      <div className="intro-aura intro-aura--one" />
      <div className="intro-aura intro-aura--two" />
      <div className="intro-lockup">
        <div className="intro-botanical-mark">
          <svg viewBox="0 0 180 180" role="presentation">
            <defs>
              <linearGradient id="leafDeep" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#244c3a" /><stop offset="1" stopColor="#547b62" />
              </linearGradient>
              <linearGradient id="leafSage" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#6f967b" /><stop offset="1" stopColor="#b7cdb5" />
              </linearGradient>
              <filter id="leafShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#183426" floodOpacity=".14" />
              </filter>
            </defs>
            <path className="intro-stem" d="M90 142 C89 116 91 85 92 46" />
            <path className="intro-leaf intro-leaf--back" fill="url(#leafSage)" d="M91 106 C58 109 36 92 36 61 C68 58 89 73 91 106Z" />
            <path className="intro-leaf intro-leaf--left" fill="url(#leafDeep)" d="M91 94 C62 78 57 45 76 20 C103 41 105 67 91 94Z" />
            <path className="intro-leaf intro-leaf--right" fill="url(#leafSage)" d="M92 109 C99 74 123 55 151 62 C150 94 124 114 92 109Z" />
            <path className="intro-leaf intro-leaf--front" fill="#8eac94" d="M91 108 C119 110 132 128 127 151 C101 153 88 136 91 108Z" />
            <path className="intro-vein intro-vein--left" d="M91 91 C80 69 76 48 77 28" />
            <path className="intro-vein intro-vein--right" d="M96 104 C112 88 128 76 144 69" />
          </svg>
        </div>
        <div className="intro-copy">
          <p className="intro-overline"><span />Rooted in beauty<span /></p>
          <h1>Flower <em>&amp;</em> Flora</h1>
          <p className="intro-subtitle">Botanical marketplace</p>
        </div>
      </div>
      <p className="intro-entering">Entering the marketplace</p>
      <div className="intro-progress" />
    </div>
  );
}
