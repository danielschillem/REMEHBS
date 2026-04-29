import { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
  context: string;
};

const SLIDES: Slide[] = [
  {
    src: "/photos/hero/hero-1.jpg",
    alt: "Auditoire des Journées Scientifiques REMEHBS",
    caption: "Auditoire des Journées Scientifiques",
    context: "Bobo-Dioulasso · 2025",
  },
  {
    src: "/photos/hero/hero-2.jpg",
    alt: "Cérémonie d'ouverture - allocutions officielles",
    caption: "Cérémonie d'ouverture officielle",
    context: "Hommage aux pionniers · 2025",
  },
  {
    src: "/photos/hero/hero-3.jpg",
    alt: "Équipe de l'industrie pharmaceutique - stand exposition",
    caption: "Partenaires & exposants scientifiques",
    context: "Espace stands · 2025",
  },
  {
    src: "/photos/hero/hero-4.jpg",
    alt: "Échanges entre membres du réseau REMEHBS",
    caption: "Réseau pluri-professionnel en action",
    context: "Networking clinique · 2025",
  },
];

const AUTOPLAY_MS = 6500;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  useEffect(() => {
    if (paused) return;
    startRef.current = performance.now();
    setProgress(0);
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        setActive((i) => (i + 1) % SLIDES.length);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused]);

  const go = (next: number) => {
    setActive((next + SLIDES.length) % SLIDES.length);
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#070A2E",
        isolation: "isolate",
      }}
    >
      {/* Slides plein écran */}
      {SLIDES.map((s, i) => (
        <div
          key={s.src}
          aria-hidden={i !== active ? "true" : "false"}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === active ? 1 : 0,
            transition: "opacity 1300ms cubic-bezier(.4,0,.2,1)",
            zIndex: i === active ? 1 : 0,
          }}
        >
          <img
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? "eager" : "lazy"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
              animation:
                i === active
                  ? `kenBurnsBg ${AUTOPLAY_MS + 2000}ms ease-out forwards`
                  : "none",
              transformOrigin:
                ["center 38%", "center 52%", "center 30%", "center 45%"][
                  i % 4
                ],
            }}
          />
        </div>
      ))}

      {/* Voile sombre uniforme — lisibilité du texte sur l'image */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: "rgba(7,10,46,.55)",
        }}
      />

      {/* Étiquette + caption en haut-droite */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 32,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          maxWidth: 360,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            background: "rgba(7,10,46,.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,.18)",
            borderRadius: 100,
            fontSize: ".66rem",
            fontWeight: 600,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          <Camera size={12} style={{ color: "#F4A28C" }} />
          <span>Journées Scientifiques · 2025</span>
        </div>
        <div
          key={active}
          style={{
            textAlign: "right",
            color: "#fff",
            animation: "captionFade 900ms cubic-bezier(.4,0,.2,1) both",
          }}
        >
          <div
            style={{
              fontSize: ".62rem",
              fontWeight: 600,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#F4A28C",
              marginBottom: 4,
            }}
          >
            {SLIDES[active].context}
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Serif',Georgia,serif",
              fontSize: ".95rem",
              fontWeight: 500,
              lineHeight: 1.35,
              color: "rgba(255,255,255,.92)",
              maxWidth: 280,
            }}
          >
            {SLIDES[active].caption}
          </div>
        </div>
      </div>

      {/* Compteur + Pagination + Nav (bas droite) */}
      <div
        className="hero-carousel-controls"
        style={{
          position: "absolute",
          right: 32,
          bottom: 28,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "10px 14px",
          background: "rgba(7,10,46,.45)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,.14)",
          borderRadius: 100,
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Serif',Georgia,serif",
            fontSize: ".82rem",
            color: "rgba(255,255,255,.85)",
            letterSpacing: ".06em",
            paddingLeft: 6,
          }}
        >
          <span style={{ color: "#fff", fontWeight: 600 }}>
            {String(active + 1).padStart(2, "0")}
          </span>
          <span style={{ opacity: 0.5 }}>
            {" "}
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {SLIDES.map((_, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Aller à l'image ${i + 1}`}
                onClick={() => go(i)}
                style={{
                  width: isActive ? 38 : 18,
                  height: 3,
                  borderRadius: 100,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: "rgba(255,255,255,.22)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "width .5s cubic-bezier(.4,0,.2,1)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#1F9D9C",
                    borderRadius: 100,
                    transformOrigin: "left",
                    transform: `scaleX(${
                      isActive ? progress : i < active ? 1 : 0
                    })`,
                    transition: isActive
                      ? "none"
                      : "transform .35s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
