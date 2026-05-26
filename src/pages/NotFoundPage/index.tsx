import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';

// --- Sub-components ---

function FloatingOrb({ className }: { className: string }) {
  return <div className={className} aria-hidden="true" />;
}

function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="absolute w-1 h-1 rounded-full bg-primary/30" style={style} aria-hidden="true" />;
}

const PARTICLES: React.CSSProperties[] = [
  { top: '15%', left: '12%', opacity: 0.6, animation: 'float 9s ease-in-out infinite' },
  { top: '75%', left: '8%', opacity: 0.4, animation: 'float-reverse 12s ease-in-out infinite' },
  { top: '30%', right: '10%', opacity: 0.5, animation: 'float 7s ease-in-out infinite 1s' },
  { top: '60%', right: '15%', opacity: 0.7, animation: 'float-reverse 11s ease-in-out infinite 2s' },
  { top: '85%', left: '40%', opacity: 0.3, animation: 'float 8s ease-in-out infinite 0.5s' },
  { top: '20%', left: '55%', opacity: 0.5, animation: 'float-reverse 14s ease-in-out infinite 1.5s' },
];

function GlassCard404() {
  return (
    <div className="relative select-none">
      {/* Glow behind the number */}
      <div
        className="absolute inset-0 blur-3xl opacity-20 dark:opacity-30"
        style={{ background: 'radial-gradient(ellipse at center, oklch(50.992% 0.24211 262.892) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* The 404 digits */}
      <div className="relative flex items-center gap-2 sm:gap-4">
        <Digit label="4" delay="0s" />
        <ZeroDigit />
        <Digit label="4" delay="0.4s" />
      </div>
    </div>
  );
}

function Digit({ label, delay }: { label: string; delay: string }) {
  return (
    <div
      className="
        relative flex items-center justify-center
        w-28 h-32 sm:w-40 sm:h-44 md:w-52 md:h-56
        rounded-2xl border border-border/60
        glassmorphism
        shadow-2xl
      "
      style={{ animation: `float 8s ease-in-out infinite`, animationDelay: delay }}
    >
      <span className="font-sans font-black text-6xl sm:text-8xl md:text-9xl text-foreground tracking-tighter leading-none">
        {label}
      </span>
    </div>
  );
}

function ZeroDigit() {
  return (
    <div
      className="
        relative flex items-center justify-center
        w-28 h-32 sm:w-40 sm:h-44 md:w-52 md:h-56
        rounded-2xl border border-primary/40
        shadow-2xl overflow-hidden
      "
      style={{
        background: 'oklch(50.992% 0.24211 262.892 / 0.12)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'float-reverse 10s ease-in-out infinite',
        animationDelay: '0.2s',
      }}
    >
      {/* Inner glow ring */}
      <div
        className="absolute inset-2 rounded-xl border border-primary/20"
        aria-hidden="true"
      />
      <span
        className="font-sans font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter leading-none"
        style={{ color: 'oklch(50.992% 0.24211 262.892)' }}
      >
        0
      </span>
    </div>
  );
}

// --- Main Page ---

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 bg-background"
      aria-labelledby="not-found-heading"
    >
      {/* ── Layered background ── */}
      <FloatingOrb className="
        absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full
        opacity-10 dark:opacity-[0.07]
        blur-3xl pointer-events-none animate-aurora-1
        bg-primary
      " />
      <FloatingOrb className="
        absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full
        opacity-[0.06] dark:opacity-[0.05]
        blur-3xl pointer-events-none animate-aurora-2
        bg-primary
      " />
      <FloatingOrb className="
        absolute -bottom-40 left-1/4 w-[400px] h-[400px] rounded-full
        opacity-[0.08] dark:opacity-[0.06]
        blur-3xl pointer-events-none animate-aurora-3
        bg-primary
      " />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.145 0 0) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.145 0 0) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((style, i) => (
        <Particle key={i} style={style} />
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full gap-10">

        {/* Badge */}
        <div
          className="
            inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
            border border-border/70 glassmorphism
            text-xs font-semibold tracking-widest uppercase text-muted-foreground
          "
        >
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" aria-hidden="true" />
          Error 404
        </div>

        {/* 404 visual */}
        <GlassCard404 />

        {/* Text content */}
        <div className="space-y-3 max-w-md">
          <h1
            id="not-found-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight"
          >
            Oops! Page not found.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            The page you're looking for has moved, been deleted, or never existed.
            Let's get you back on track.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-sm">
          <div className="relative group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-150"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search for something..."
              className="
                w-full pl-10 pr-4 py-2.5 rounded-xl
                bg-muted/50 border border-border/70
                text-sm text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                transition-all duration-200
              "
              aria-label="Search the site"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  const val = (e.currentTarget.value ?? '').trim();
                  if (val) navigate(`/?q=${encodeURIComponent(val)}`);
                }
              }}
            />
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="
              w-full sm:w-auto gap-2 px-6 py-2.5 rounded-xl
              border-border/70 text-foreground
              hover:bg-muted hover:border-border
              active:scale-[0.98] transition-all duration-150
            "
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
            className="
              w-full sm:w-auto gap-2 px-6 py-2.5 rounded-xl
              bg-primary text-primary-foreground font-semibold
              hover:bg-primary/90 hover:shadow-lg
              active:scale-[0.98] transition-all duration-150
              shadow-md
            "
            style={{ boxShadow: '0 4px 24px oklch(50.992% 0.24211 262.892 / 0.3)' }}
            aria-label="Go to homepage"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </Button>
        </div>

        {/* Helpful links */}
        <nav aria-label="Helpful links" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Exams', href: '/exams' },
            { label: 'Vocabulary', href: '/vocab' },
            { label: 'Grammar', href: '/grammar' },
          ].map(({ label, href }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150 underline-offset-4 hover:underline"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Bottom vignette ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, oklch(1 0 0 / 0.4), transparent)' }}
        aria-hidden="true"
      />
    </main>
  );
}

export default NotFoundPage;
