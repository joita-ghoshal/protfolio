import { useMemo } from 'react';

function Particles({ count = 20, color = 'rgba(0,229,255', minSize = 2, maxSize = 6 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
      driftX: (Math.random() - 0.5) * 40,
      driftY: (Math.random() - 0.5) * 40,
    })),
    [count, minSize, maxSize]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `${color},${0.3 + Math.random() * 0.4})`,
            boxShadow: `0 0 ${p.size * 2}px ${color},0.3)`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function OrbitalRings({ count = 3 }) {
  const rings = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 200 + i * 150,
      borderColor: i % 2 === 0 ? 'rgba(0, 229, 255, 0.06)' : 'rgba(124, 58, 237, 0.06)',
      duration: 15 + i * 5,
      delay: i * 2,
      direction: i % 2 === 0 ? 1 : -1,
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] flex items-center justify-center overflow-hidden">
      {rings.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full"
          style={{
            width: r.size,
            height: r.size,
            border: `1px solid ${r.borderColor}`,
            animation: `spin-slow ${r.duration}s linear ${r.delay}s infinite`,
            animationDirection: r.direction === 1 ? 'normal' : 'reverse',
          }}
        />
      ))}
    </div>
  );
}

function AuroraWaves() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, transparent 30%, rgba(124,58,237,0.06) 50%, transparent 70%, rgba(0,229,255,0.04) 100%)',
          backgroundSize: '200% 200%',
          animation: 'morph-gradient 12s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 30% 60%, rgba(0,229,255,0.06) 0%, transparent 60%)',
          animation: 'aurora 8s ease-in-out infinite',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(124,58,237,0.06) 0%, transparent 50%)',
          animation: 'aurora 10s ease-in-out infinite reverse',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
}

function GridOverlay({ cellSize = 60, opacity = 0.03 }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,${opacity}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)',
          animation: 'breathe 6s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function LightBeams({ count = 5 }) {
  const beams = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      width: 1 + Math.random() * 2,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      opacity: 0.02 + Math.random() * 0.04,
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {beams.map((b) => (
        <div
          key={b.id}
          className="absolute top-0 bottom-0"
          style={{
            left: `${b.left}%`,
            width: b.width,
            background: `linear-gradient(180deg, transparent, rgba(0,229,255,${b.opacity}), transparent)`,
            animation: `scan-line ${b.duration}s linear ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Sparkles({ count = 15 }) {
  const sparkles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            background: '#00E5FF',
            boxShadow: `0 0 ${s.size * 3}px #00E5FF, 0 0 ${s.size * 6}px rgba(0,229,255,0.5)`,
            animation: `pulse-glow ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function NeonBorder({ sections = 3 }) {
  const borders = useMemo(() =>
    Array.from({ length: sections }, (_, i) => ({
      id: i,
      top: 20 + i * 25,
      duration: 4 + i * 2,
      delay: i * 1.5,
    })),
    [sections]
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {borders.map((b) => (
        <div
          key={b.id}
          className="absolute left-[10%] right-[10%] h-px"
          style={{
            top: `${b.top}%`,
            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.1), rgba(124,58,237,0.1), transparent)',
            animation: `pulse-glow ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const variants = {
  about: () => (
    <>
      <AuroraWaves />
      <Particles count={15} color='rgba(0,229,255' minSize={2} maxSize={5} />
      <NeonBorder sections={4} />
    </>
  ),
  skills: () => (
    <>
      <GridOverlay cellSize={50} opacity={0.04} />
      <Particles count={25} color='rgba(0,229,255' minSize={2} maxSize={4} />
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%2300E5FF' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />
    </>
  ),
  projects: () => (
    <>
      <LightBeams count={6} />
      <OrbitalRings count={2} />
      <Particles count={12} color='rgba(124,58,237' minSize={3} maxSize={7} />
    </>
  ),
  experience: () => (
    <>
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,229,255,0.02) 30px, rgba(0,229,255,0.02) 31px)',
          maskImage: 'radial-gradient(ellipse 40% 50% at 50% 50%, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 40% 50% at 50% 50%, black 20%, transparent 70%)',
        }}
      />
      <Particles count={20} color='rgba(0,229,255' minSize={1} maxSize={3} />
      <div className="absolute left-[30%] right-[30%] top-0 bottom-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.5), transparent)',
          animation: 'scan-line 4s linear infinite',
        }}
      />
    </>
  ),
  education: () => (
    <>
      <AuroraWaves />
      <GridOverlay cellSize={80} opacity={0.02} />
      <Particles count={10} color='rgba(124,58,237' minSize={2} maxSize={4} />
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03] flex items-center justify-center overflow-hidden">
        <div className="w-[200px] h-[200px] rounded-full border border-accent/20 animate-spin-slow" />
        <div className="absolute w-[140px] h-[140px] rounded-full border border-accent-alt/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
      </div>
    </>
  ),
  certificates: () => (
    <>
      <Sparkles count={20} />
      <OrbitalRings count={2} />
      <AuroraWaves />
    </>
  ),
  contact: () => (
    <>
      <OrbitalRings count={4} />
      <LightBeams count={3} />
      <Particles count={10} color='rgba(0,229,255' minSize={3} maxSize={6} />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(0deg, rgba(0,229,255,0.04) 0%, transparent 100%)',
          animation: 'breathe 6s ease-in-out infinite',
        }}
      />
    </>
  ),
};

export default function SectionBackground({ variant }) {
  const Component = variants[variant] || variants.about;
  return <Component />;
}
