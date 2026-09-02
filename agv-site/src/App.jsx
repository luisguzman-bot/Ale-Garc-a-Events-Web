import React, { useState, useMemo, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  MessageCircle, Check, ArrowRight, Users, Clock, Camera, Menu, X, Send,
  ChevronRight, PartyPopper, Instagram, Facebook,
} from "lucide-react";

/* ============================================================================
   ALE GARCÍA EVENTS — vista previa del sitio (Coffee Breaks + Planner)
   Paleta y tipografía tomadas directamente de los logotipos reales del cliente.
   Firma visual: la mariposa de línea que ya vive en ambos logos.
============================================================================ */

// ---------------------------------------------------------------------------
// Token system — extraído de los logos (negro + blanco + rosa por sub-marca)
// ---------------------------------------------------------------------------
const COLOR = {
  ink: "#1C1B1A",
  inkSoft: "#6E6864",
  paper: "#FFFFFF",
  cream: "#FBF8F7",
  creamDeep: "#F3EDEC",

  // Planner — rosa magenta exacto del logo
  rose: "#BE4F82",
  roseDeep: "#8F3A63",
  roseSoft: "#F6E4EC",

  // Coffee Breaks — rosa empolvado exacto del logo
  blush: "#C98CA0",
  blushDeep: "#9C6575",
  blushSoft: "#FBF1F3",

  whatsapp: "#25D366",
};

const FONTS = {
  // Serif elegante y MUY legible — sustituye a la cursiva "Adelia" en todo el texto
  // editable del sitio (el logo original en script se conserva tal cual como imagen).
  display: "'Playfair Display', serif",
  body: "'Jost', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const LOGO_PLANNER = "/images/logo-planner.png";
const LOGO_COFFEE = "/images/logo-coffee.png";

// ---------------------------------------------------------------------------
// Datos de negocio — EDITAR AQUÍ cuando cambien precios, WhatsApp o contenido
// ---------------------------------------------------------------------------
const WHATSAPP_NUMBER = "523329712214"; // Número real de WhatsApp Business de Ale García

// Fotos de portada (banner superior) de Coffee Breaks y Planner.
// Súbelas al chat y se reemplaza este null por la foto real (ver PageHero más abajo).
const IMG_HERO_COFFEE = null; // TODO (Ale García): foto de portada de Coffee Breaks
// Videos cortos (mp4, sin audio, loop) para el fondo del hero de Home y de las
// portadas internas. Mientras sean null, se usa Ken Burns sobre la foto o un
// degradado animado — en cuanto subas un video, reemplaza el null y se activa solo.
const VIDEO_HERO_COFFEE = "/videos/coffee-hero.mp4"; // Video del acomodo de bebidas que subiste
const VIDEO_HERO_PLANNER = "/videos/planner-hero.mp4"; // Video del evento nocturno (mesas y candelabros) que subiste
const IMG_HERO_PLANNER = "/images/hero-planner.jpg";
// Fotos de las tarjetas de servicio de Planner:
const IMG_SERVICE_POSADA = "/images/service-posada.jpg";
const IMG_SERVICE_KICKOFF = "/images/service-kickoff.jpg";
const IMG_SERVICE_OTROS = "/images/service-otros.jpg";

const SOCIAL_LINKS = {
  instagramCoffee: "https://instagram.com/alegarciacoffeebreak", // TODO: usuario real de Instagram — Coffee Breaks
  instagramPlanner: "https://instagram.com/alegarciaplanner", // TODO: usuario real de Instagram — Event Planner
  facebookCoffee: "https://facebook.com/alegarciacoffeebreak", // TODO: página real de Facebook — Coffee Breaks
  facebookPlanner: "https://facebook.com/alegarciaplanner", // TODO: página real de Facebook — Event Planner
};

const TESTIMONIALS = [
  { empresa: "Cliente de Coffee Breaks", texto: "La puntualidad, impecable presentación y frescura de los alimentos en cada pausa hicieron que nuestras jornadas de trabajo fluyeran a la perfección." },
  { empresa: "Cliente de Ale García Planner", texto: "Ale transformó nuestra idea inicial en una celebración inolvidable; su capacidad de organización nos permitió disfrutar al máximo sin preocuparnos por un solo detalle." },
  { empresa: "Cliente corporativo, ZMG", texto: "Llevamos más de diez años confiándole la logística de todos nuestros eventos empresariales en la ZMG y mantiene siempre la misma excelencia, resolución y profesionalismo." },
];

// TODO (Ale García): texto borrador — sustituir por la visión, misión y valores reales del negocio
// Imágenes de banco libre (Unsplash / Pexels) para Visión, Misión y Valores.
// Verificadas: uso comercial permitido, sin atribución obligatoria (ver conversación).
const IMG_VISION = "/images/vision.jpg";
const IMG_MISION = "/images/mision.jpg";
const IMG_VALORES = "/images/valores.jpg";

const VISION_MISION_VALORES = [
  {
    titulo: "Visión",
    texto: "Ser la empresa número 1 en creación de experiencias inolvidables internacionalmente.",
    imagen: IMG_VISION,
  },
  {
    titulo: "Misión",
    texto: "Transformar tus momentos importantes en experiencias inolvidables con un equipo comprometido desde la primera idea hasta el último detalle de la ejecución.",
    imagen: IMG_MISION,
  },
  {
    titulo: "Valores",
    valores: [
      { nombre: "Pasión", texto: "Cada evento se vive como si fuera el más importante." },
      { nombre: "Compromiso", texto: "Te acompañamos desde la idea hasta el último detalle." },
      { nombre: "Excelencia", texto: "Cuidamos cada detalle para que nada se sienta a medias." },
      { nombre: "Cercanía", texto: "Escuchamos primero, ejecutamos después." },
      { nombre: "Innovación", texto: "Buscamos siempre una forma mejor de sorprender." },
    ],
    imagen: IMG_VALORES,
  },
];

// Umbral de cotización personalizada: 200 personas.
// Debajo de 200, el sitio calcula y muestra precio. A partir de 200, pide
// cotización directa por WhatsApp — igual que se pidió para 100 en la
// primera versión, ahora extendido a 200 con el rango "Grande" ya cotizado.
const QUOTE_THRESHOLD = 200;

const PRICING = {
  basico: {
    label: "Básico",
    tagline: "La base de un buen coffee break",
    chico: { 2: 90, 4: 120, 8: 180 },
    mediano: { 2: 80, 4: 110, 8: 160 },
    grande: { 2: 70, 4: 100, 8: 160 },
  },
  estandar: {
    label: "Estándar",
    tagline: "Más variedad, más presencia en mesa",
    chico: { 2: 150, 4: 180, 8: 260 },
    mediano: { 2: 130, 4: 170, 8: 240 },
    grande: { 2: 130, 4: 160, 8: 240 },
  },
  vip: {
    label: "VIP",
    tagline: "Café de especialidad y vajilla de presentación",
    chico: { 2: 170, 4: 230, 8: 360 },
    mediano: { 2: 160, 4: 220, 8: 340 },
    grande: { 2: 150, 4: 220, 8: 340 },
  },
};

const INCLUSIONS = {
  basico: [
    "Café normal y descafeinado",
    "Té en variedad de sobres",
    "Agua natural",
    "Azúcar, mascabado y sustitutos",
    "Galletas finas",
    "Vasos y servilletas desechables",
  ],
  estandar: [
    "Todo lo del nivel Básico",
    "Pan dulce variado",
    "Fruta de temporada",
    "Jugos y refrescos",
    "Variedad ampliada de tés",
    "1 empanada garantizada por persona",
  ],
  vip: [
    "Todo lo del nivel Estándar",
    "1 cuernito relleno (jamón y queso) garantizado por persona",
    "Tisanas",
    "Aguas fusionadas / saborizadas premium",
    "Tartaletas",
    "Café de especialidad",
    "Vajilla de presentación",
    "Personalización de marca del cliente incluida",
  ],
};

const PLANNER_SERVICES = [
  { key: "boda", label: "Bodas", blurb: "Desde la propuesta hasta el último baile, cada detalle cuidado.", image: null, route: "/bodas" },
  { key: "xv", label: "15 años", blurb: "La fiesta que marca su transición, sin que a ti te falte nada.", image: null, route: "/xv-anos" },
  { key: "posada", label: "Posadas empresariales", blurb: "La fiesta de fin de año de tu equipo, resuelta de principio a fin.", image: IMG_SERVICE_POSADA, route: "/posadas-empresariales" },
  { key: "kickoff", label: "Kickoffs", blurb: "Arranca el año con un evento que marca el tono.", image: IMG_SERVICE_KICKOFF, route: "/kickoff-empresarial" },
  { key: "otro", label: "Aniversarios y otros", blurb: "Celebraciones a la medida, sin importar el motivo.", image: IMG_SERVICE_OTROS, route: "/aniversarios" },
  { key: "convencion", label: "Convenciones", blurb: "Juntas y congresos de gran formato, con logística que no se nota — solo funciona.", image: null, route: "/convenciones" },
];

// TODO (Ale García): revisar/ajustar esta descripción de las 3 etapas de trabajo — texto borrador.
const PLANNER_PROCESS = [
  { paso: "01", titulo: "Platicamos", texto: "Nos cuentas tu idea, el motivo y cuántos invitados esperas." },
  { paso: "02", titulo: "Cotizamos", texto: "Te armamos una propuesta clara, sin sorpresas de última hora." },
  { paso: "03", titulo: "Lo hacemos realidad", texto: "El día del evento, nosotros resolvemos cada detalle." },
];


// ---------------------------------------------------------------------------
// Helpers de negocio
// ---------------------------------------------------------------------------
function getBracket(people) {
  if (people < 20) return null;
  if (people <= 50) return "chico";
  if (people < 100) return "mediano";
  if (people < QUOTE_THRESHOLD) return "grande";
  return "cotizacion"; // 200+ => cotización personalizada, sin precio visible
}

function getPricePerPerson(tier, people, duration) {
  const bracket = getBracket(people);
  if (bracket !== "chico" && bracket !== "mediano" && bracket !== "grande") return null;
  return PRICING[tier][bracket][duration];
}

function money(n) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ---------------------------------------------------------------------------
// Motion: scroll-reveal + transición de vista, sin librerías externas
// ---------------------------------------------------------------------------
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "", variant = "up" }) {
  const [ref, inView] = useInView();
  const reduced = usePrefersReducedMotion();

  // Dos variantes de entrada en vez de una sola repetida por todo el sitio:
  // "up" (texto/listas), "scale" (fotos). Hubo una tercera variante "mask"
  // con clip-path que se quitó: probada en Chromium real, el IntersectionObserver
  // nunca disparaba con el elemento clipeado al 100% — quedaba invisible para
  // siempre. Si algo pide "mask" cae de vuelta a "up" de forma segura.
  const variants = {
    up: {
      hidden: { opacity: 0, transform: "translateY(28px)" },
      shown: { opacity: 1, transform: "translateY(0)" },
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    },
    scale: {
      hidden: { opacity: 0, transform: "scale(0.94)" },
      shown: { opacity: 1, transform: "scale(1)" },
      transition: `opacity 0.8s ease ${delay}s, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    },
  };
  const v = variants[variant] || variants.up;

  return (
    <div
      ref={ref}
      className={className}
      style={reduced ? {} : { ...(inView ? v.shown : v.hidden), transition: v.transition }}
    >
      {children}
    </div>
  );
}

// Cuenta hacia el nuevo valor en vez de saltar de golpe — se usa en el total
// de la cotización para que se sienta como una calculadora "viva".
function useAnimatedNumber(value, duration = 450) {
  const [display, setDisplay] = useState(value ?? 0);
  const prevRef = useRef(value ?? 0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (value == null) return;
    if (reduced) { setDisplay(value); prevRef.current = value; return; }
    const start = prevRef.current;
    const delta = value - start;
    const startTime = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + delta * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);

  return display;
}

// Mueve una capa un poco más lento que el scroll (profundidad real, no decorativa).
// Se apaga solo si el usuario tiene activado "reducir movimiento".
function useParallax(strength = 0.15) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(centerDelta * strength);
      raf = null;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength, reduced]);

  return [ref, reduced ? 0 : offset];
}

// remonta su contenido cada vez que cambia viewKey, disparando la animación CSS
function ViewTransition({ viewKey, children }) {
  return (
    <div key={viewKey} className="agv-view-transition">
      {children}
    </div>
  );
}

function ButterflyMark({ size = 34, color = COLOR.rose }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 84" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 38 C 36 10, 6 12, 7 32 C 8 48, 30 50, 50 38 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 38 C 64 10, 94 12, 93 32 C 92 48, 70 50, 50 38 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 40 C 41 54, 22 58, 24 68 C 26 76, 42 72, 50 58 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 40 C 59 54, 78 58, 76 68 C 74 76, 58 72, 50 58 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="34" x2="50" y2="62" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PageHero({ headline, accent, imageUrl = null, videoUrl = null, objectPosition = "center" }) {
  const [parallaxRef, offset] = useParallax(0.08);
  const [mounted, setMounted] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={parallaxRef} className="relative overflow-hidden" style={{ height: "420px" }}>
      <div className="absolute inset-0" style={{ transform: reduced ? "none" : `translateY(${offset}px) scale(1.1)` }}>
        {videoUrl ? (
          <video
            className="h-full w-full object-cover"
            style={{ objectPosition }}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={headline}
            className={`h-full w-full object-cover ${reduced ? "" : "agv-kenburns"}`}
            style={{ objectPosition }}
          />
        ) : (
          <div
            className={`h-full w-full ${reduced ? "" : "agv-gradient-drift"}`}
            style={{
              backgroundImage: `linear-gradient(120deg, ${accent}55, ${COLOR.creamDeep} 45%, ${accent}33 75%)`,
              backgroundSize: "220% 220%",
            }}
          />
        )}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center text-center px-6"
        style={{ background: "linear-gradient(180deg, rgba(28,27,26,0.12), rgba(28,27,26,0.55))" }}
      >
        <h1
          className="text-4xl sm:text-6xl uppercase tracking-wide"
          style={{
            fontFamily: FONTS.display,
            color: "#fff",
            fontWeight: 700,
            opacity: reduced || mounted ? 1 : 0,
            transform: reduced || mounted ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.9s ease 0.1s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s",
          }}
        >
          {headline}
        </h1>
      </div>
    </section>
  );
}

function Eyebrow({ children, color = COLOR.rose }) {
  return (
    <span
      className="inline-block text-[11px] uppercase tracking-[0.25em] mb-2"
      style={{ color, fontFamily: FONTS.body, fontWeight: 600 }}
    >
      {children}
    </span>
  );
}

// Fotos del carrusel de galería (Home). null = sigue como placeholder.
const IMG_GALLERY_POSADA = "/images/gallery-posada.jpg";
const IMG_GALLERY_ANIVERSARIO = "/images/gallery-aniversario.jpg";
const IMG_GALLERY_AIRE_LIBRE = "/images/gallery-aire-libre.jpg";
const IMG_GALLERY_KICKOFF = "/images/gallery-kickoff.jpg";
const IMG_GALLERY_VIP = "/images/gallery-vip.jpg";

const GALLERY_ITEMS = [
  { label: "Coffee break corporativo", image: null },
  { label: "Boda", image: null },
  { label: "Posada empresarial", image: IMG_GALLERY_POSADA },
  { label: "XV años", image: null },
  { label: "Aniversario de empresa", image: IMG_GALLERY_ANIVERSARIO },
  { label: "Kickoff de año nuevo", image: IMG_GALLERY_KICKOFF },
  { label: "Montaje nivel VIP", image: IMG_GALLERY_VIP },
  { label: "Evento al aire libre", image: IMG_GALLERY_AIRE_LIBRE },
];

function EventsCarousel() {
  const loop = [...GALLERY_ITEMS, ...GALLERY_ITEMS]; // duplicado para el loop continuo
  return (
    <div className="overflow-hidden py-2" style={{ maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)" }}>
      <div className="agv-marquee flex gap-4 w-max px-6">
        {loop.map((item, i) => (
          <PhotoPlaceholder
            key={i}
            label={item.label}
            accent={i % 2 === 0 ? COLOR.blush : COLOR.rose}
            imageUrl={item.image || null}
            className="shrink-0"
            style={{ width: "220px", height: "220px" }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Piezas reutilizables
// ---------------------------------------------------------------------------
function PhotoPlaceholder({ label, accent = COLOR.rose, className = "", style = {}, rounded = true, bordered = true, hoverLift = true, showLabel = true, imageUrl = null, objectPosition = "center" }) {
  // Si hay una foto real (imageUrl), se muestra la foto y se ignora el placeholder de cámara.
  if (imageUrl) {
    return (
      <div
        className={`relative overflow-hidden ${rounded ? "rounded-xl" : ""} transition-transform duration-300 ${hoverLift ? "hover:-translate-y-1" : ""} ${className}`}
        style={style}
      >
        <img src={imageUrl} alt={label} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition }} />
      </div>
    );
  }
  // Mientras no hay foto real: un degradado que se desliza lento, en vez de una
  // caja punteada estática. Sigue siendo un placeholder, pero no se ve "muerto".
  return (
    <div
      className={`agv-shimmer relative flex flex-col items-center justify-center gap-2 overflow-hidden ${rounded ? "rounded-xl" : ""} ${bordered ? "border border-dashed" : ""} transition-transform duration-300 ${hoverLift ? "hover:-translate-y-1" : ""} ${className}`}
      style={{
        borderColor: accent,
        backgroundImage: `linear-gradient(120deg, ${COLOR.paper} 30%, ${accent}33 50%, ${COLOR.paper} 70%)`,
        backgroundSize: "220% 100%",
        ...style,
      }}
    >
      {showLabel && (
        <>
          <Camera size={24} strokeWidth={1.3} style={{ color: accent, opacity: 0.7 }} />
          <span className="px-4 text-center text-xs" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
            {label}
          </span>
        </>
      )}
    </div>
  );
}

function WhatsAppFAB({ message }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-transform hover:scale-105"
      style={{ backgroundColor: COLOR.whatsapp, color: "#fff" }}
    >
      <MessageCircle size={22} fill="#fff" style={{ color: COLOR.whatsapp }} />
      <span className="hidden sm:inline text-sm font-semibold" style={{ fontFamily: FONTS.body }}>
        Cotizar por WhatsApp
      </span>
    </a>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const plannerRoutes = ["/planner", "/posadas-empresariales", "/kickoff-empresarial", "/bodas", "/xv-anos", "/aniversarios", "/convenciones"];
  const isPlannerSection = plannerRoutes.includes(pathname);
  const view = pathname === "/coffee-breaks" ? "coffee" : isPlannerSection ? "planner" : pathname === "/contacto" ? "contacto" : "home";

  const NavLink = ({ to, k, label }) => (
    <Link
      to={to}
      className="text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
      style={{
        color: view === k ? COLOR.rose : COLOR.ink,
        fontFamily: FONTS.body,
        fontWeight: view === k ? 700 : 500,
        borderBottom: view === k ? `2px solid ${COLOR.rose}` : "2px solid transparent",
        paddingBottom: "4px",
      }}
    >
      {label}
    </Link>
  );

  const CenterLogo = () => {
    if (view === "coffee") {
      return <img src={LOGO_COFFEE} alt="Ale García Coffee Break" className="h-14 sm:h-16 w-auto" />;
    }
    if (view === "planner") {
      return <img src={LOGO_PLANNER} alt="Ale García Event Planner" className="h-14 sm:h-16 w-auto" />;
    }
    return (
      <span className="flex flex-col items-center gap-1">
        <span className="text-2xl sm:text-3xl tracking-wide" style={{ color: COLOR.ink, fontFamily: FONTS.display }}>
          Ale García Events
        </span>
        <ButterflyMark size={20} color={COLOR.rose} />
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40" style={{ backgroundColor: COLOR.paper, borderBottom: `1px solid ${COLOR.creamDeep}` }}>
      <div className="flex items-center justify-between max-w-6xl mx-auto px-5 py-6">
        <div className="flex-1 hidden md:flex items-center">
          <NavLink to="/coffee-breaks" k="coffee" label="Coffee Breaks" />
        </div>

        <Link to="/" className="flex items-center justify-center shrink-0 mx-3">
          <CenterLogo />
        </Link>

        <div className="flex-1 hidden md:flex items-center justify-end gap-6">
          <NavLink to="/planner" k="planner" label="Planner" />
          <NavLink to="/contacto" k="contacto" label="Contacto" />
        </div>

        <button className="md:hidden shrink-0" onClick={() => setOpen((o) => !o)} aria-label="Abrir menú">
          {open ? <X color={COLOR.ink} /> : <Menu color={COLOR.ink} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3">
          {[{ to: "/", key: "home", label: "Inicio" }, { to: "/coffee-breaks", key: "coffee", label: "Coffee Breaks" }, { to: "/planner", key: "planner", label: "Planner" }, { to: "/contacto", key: "contacto", label: "Contacto" }].map((it) => (
            <Link
              key={it.key}
              to={it.to}
              onClick={() => setOpen(false)}
              className="text-left text-xs uppercase tracking-[0.2em] py-1"
              style={{ color: view === it.key ? COLOR.rose : COLOR.ink, fontFamily: FONTS.body }}
            >
              {it.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}


function Footer() {
  return (
    <footer className="mt-16 px-5 py-10" style={{ backgroundColor: COLOR.ink }}>
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <span style={{ color: COLOR.paper, fontFamily: FONTS.display }} className="text-2xl">
          Ale García Events
        </span>
        <span className="text-xs text-center uppercase tracking-[0.15em]" style={{ color: "#B8B2AE", fontFamily: FONTS.body }}>
          Zona Metropolitana de Guadalajara · alegarciaevents.com.mx
        </span>
        <span className="text-xs uppercase tracking-[0.15em]" style={{ color: "#B8B2AE", fontFamily: FONTS.body }}>
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// HOME — diptico Coffee Breaks / Planner
// ---------------------------------------------------------------------------
function HomeView() {
  return (
    <div>
      <section className="relative grid grid-cols-1 md:grid-cols-2 min-h-[560px]">
        <Link
          to="/coffee-breaks"
          className="agv-hero-enter agv-cta group relative flex flex-col justify-end p-10 text-left overflow-hidden transition-transform duration-150 hover:brightness-95"
          style={{ backgroundColor: COLOR.blushSoft, minHeight: "340px" }}
        >
          <div className="absolute inset-0" aria-hidden="true">
            {VIDEO_HERO_COFFEE ? (
              <video className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={VIDEO_HERO_COFFEE} autoPlay muted loop playsInline />
            ) : (
              <div
                className="h-full w-full agv-gradient-drift"
                style={{ backgroundImage: `linear-gradient(120deg, ${COLOR.blushSoft}, ${COLOR.blush}55 50%, ${COLOR.blushSoft})`, backgroundSize: "220% 220%" }}
              />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(255,255,255,0.92) 15%, rgba(255,255,255,0.15) 75%)" }} />
          </div>
          <img src={LOGO_COFFEE} alt="Ale García Coffee Break" className="relative w-64 max-w-full mb-6 transition-transform duration-500 group-hover:-translate-y-1" />
          <p className="relative max-w-sm text-sm mb-6" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
            Café, panadería y servicio para juntas, capacitaciones y eventos corporativos de todos los tamaños.
          </p>
          <span
            className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: COLOR.blushDeep, fontFamily: FONTS.body }}
          >
            Ver paquetes y cotizar <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          to="/planner"
          className="agv-hero-enter agv-cta group relative flex flex-col justify-end p-10 text-left overflow-hidden transition-transform duration-150 hover:brightness-95"
          style={{ backgroundColor: COLOR.roseSoft, minHeight: "340px" }}
        >
          <div className="absolute inset-0" aria-hidden="true">
            {VIDEO_HERO_PLANNER ? (
              <video className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={VIDEO_HERO_PLANNER} autoPlay muted loop playsInline />
            ) : (
              <div
                className="h-full w-full agv-gradient-drift"
                style={{ backgroundImage: `linear-gradient(120deg, ${COLOR.roseSoft}, ${COLOR.rose}45 50%, ${COLOR.roseSoft})`, backgroundSize: "220% 220%" }}
              />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(255,255,255,0.92) 15%, rgba(255,255,255,0.15) 75%)" }} />
          </div>
          <img src={LOGO_PLANNER} alt="Ale García Event Planner" className="relative w-72 max-w-full mb-6 transition-transform duration-500 group-hover:-translate-y-1" />
          <p className="relative max-w-sm text-sm mb-6" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
            Bodas, XV años, posadas empresariales y kickoffs, organizados de principio a fin.
          </p>
          <span
            className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: COLOR.roseDeep, fontFamily: FONTS.body }}
          >
            Conocer servicios <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>

        {/* Emblema de mariposa sobre la costura — solo en pantallas medianas o más */}
        <div
          className="hidden md:flex absolute items-center justify-center rounded-full shadow-lg"
          style={{
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "72px", height: "72px", backgroundColor: COLOR.paper,
          }}
        >
          <ButterflyMark size={32} color={COLOR.ink} />
        </div>
      </section>

      <Reveal className="mx-auto max-w-4xl px-6 py-16 text-center">
        <Eyebrow color={COLOR.rose}>Un mismo equipo</Eyebrow>
        <h3 className="text-3xl mb-3" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
          Dos formas de acompañar tu evento
        </h3>
        <p className="text-sm max-w-xl mx-auto" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
          Ale García Events reúne a Coffee Breaks y Planner bajo un mismo estándar de servicio en la Zona
          Metropolitana de Guadalajara. Cotiza el que necesites, o combina los dos para tu próximo evento.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="pb-6">
        <div className="text-center mb-8 px-6">
          <Eyebrow color={COLOR.blushDeep}>Galería</Eyebrow>
          <h3 className="text-3xl" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
            Nuestros eventos
          </h3>
        </div>
        <EventsCarousel />
      </Reveal>

      <Reveal delay={0.12} className="mx-auto max-w-5xl px-6 py-10">
        <div className="text-center mb-8">
          <Eyebrow color={COLOR.rose}>Lo que dicen de nosotros</Eyebrow>
          <h3 className="text-3xl" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
            Clientes que confiaron en el equipo
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: COLOR.paper, border: `1px solid ${COLOR.creamDeep}` }}
            >
              <span className="block text-4xl mb-2" style={{ fontFamily: FONTS.display, color: COLOR.blush }}>“</span>
              <p className="text-sm italic mb-4" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
                {t.texto}
              </p>
              <p className="text-xs uppercase tracking-[0.15em]" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
                {t.empresa}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {VISION_MISION_VALORES.map((item, i) => {
        const imageRight = i % 2 === 0;
        const bg = i % 2 === 0 ? COLOR.blushSoft : COLOR.roseSoft;
        const accent = i % 2 === 0 ? COLOR.blush : COLOR.rose;
        const textBlock = (
          <div className="flex flex-col justify-center px-8 sm:px-16 py-16" style={{ backgroundColor: bg, minHeight: "360px" }}>
            <Eyebrow color={accent}>Quiénes somos</Eyebrow>
            <h3 className="text-3xl sm:text-4xl uppercase mb-4 max-w-sm" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
              {item.titulo}
            </h3>
            {item.valores ? (
              <ul className="space-y-3 max-w-sm">
                {item.valores.map((v) => (
                  <li key={v.nombre} className="text-sm" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
                    <span className="font-semibold" style={{ color: COLOR.ink, fontFamily: FONTS.display }}>{v.nombre}</span>
                    {" — "}{v.texto}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm max-w-sm" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
                {item.texto}
              </p>
            )}
          </div>
        );
        const imageBlock = (
          <PhotoPlaceholder
            label={item.titulo}
            accent={accent}
            rounded={false}
            bordered={false}
            hoverLift={false}
            imageUrl={item.imagen || null}
            className="w-full h-full min-h-[280px]"
            style={item.imagen ? {} : { background: `linear-gradient(135deg, ${COLOR.creamDeep} 0%, ${bg} 55%, ${COLOR.paper} 100%)` }}
          />
        );
        // Nota: aquí hubo un ParallaxBlock (transform: translateY basado en scroll).
        // Probado en mobile real, dejaba un hueco y recortaba la imagen al apilar
        // a una sola columna — se quitó. El scale(1.12) también se quitó porque
        // ya no hace falta el margen extra sin el desplazamiento del paralaje.
        return (
          <Reveal key={item.titulo} delay={i * 0.1} variant="scale">
            <section className="grid grid-cols-1 md:grid-cols-2 mb-8 overflow-hidden">
              {imageRight ? (
                <>{textBlock}{imageBlock}</>
              ) : (
                <>{imageBlock}{textBlock}</>
              )}
            </section>
          </Reveal>
        );
      })}

      <Reveal delay={0.15} className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <Eyebrow color={COLOR.rose}>Síguenos</Eyebrow>
        <h3 className="text-2xl mb-5" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
          También estamos en redes
        </h3>
        <div className="flex flex-wrap items-start justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
              Coffee Breaks
            </span>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagramCoffee}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Ale García Coffee Breaks"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 hover:shadow-md"
                style={{ backgroundColor: COLOR.blushSoft, color: COLOR.blushDeep }}
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.facebookCoffee}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Ale García Coffee Breaks"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 hover:shadow-md"
                style={{ backgroundColor: COLOR.blushSoft, color: COLOR.blushDeep }}
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
              Event Planner
            </span>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagramPlanner}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Ale García Planner"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 hover:shadow-md"
                style={{ backgroundColor: COLOR.roseSoft, color: COLOR.roseDeep }}
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.facebookPlanner}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Ale García Planner"
                className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 hover:shadow-md"
                style={{ backgroundColor: COLOR.roseSoft, color: COLOR.roseDeep }}
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// COFFEE BREAKS — paquetes + calculadora tipo "recibo"
// ---------------------------------------------------------------------------
function TierCard({ tierKey, tier, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(tierKey)}
      className="text-left rounded-2xl overflow-hidden transition-all flex flex-col w-full h-full"
      style={{
        backgroundColor: selected ? COLOR.blush : COLOR.paper,
        border: `2px solid ${selected ? COLOR.blushDeep : COLOR.blushSoft}`,
        boxShadow: selected ? "0 8px 20px rgba(156,101,117,0.25)" : "none",
      }}
    >
      {/* La foto va arriba, a todo lo ancho: en un coffee break lo visual vende
          primero que la lista de inclusiones. */}
      <PhotoPlaceholder
        label={`Foto: montaje Nivel ${tier.label}`}
        accent={selected ? COLOR.paper : COLOR.blush}
        rounded={false}
        bordered={false}
        hoverLift={false}
        className="w-full h-52"
        style={{ background: `linear-gradient(135deg, ${COLOR.creamDeep} 0%, ${COLOR.blushSoft} 60%, ${COLOR.paper} 100%)` }}
      />
      <div className="p-5 flex-1 flex flex-col">
        <span
          className="inline-block self-start text-[11px] uppercase tracking-widest px-2 py-1 rounded-full mb-3"
          style={{
            backgroundColor: selected ? COLOR.ink : COLOR.blushSoft,
            color: selected ? COLOR.paper : COLOR.blushDeep,
            fontFamily: FONTS.body,
            fontWeight: 700,
          }}
        >
          Nivel {tier.label}
        </span>
        <h4
          className="text-3xl mb-1"
          style={{ fontFamily: FONTS.display, color: selected ? COLOR.paper : COLOR.ink }}
        >
          {tier.label}
        </h4>
        <p className="text-xs mb-4" style={{ color: selected ? COLOR.paper : COLOR.inkSoft, fontFamily: FONTS.body }}>
          {tier.tagline}
        </p>
        <ul className="space-y-1.5">
          {INCLUSIONS[tierKey].map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs" style={{ fontFamily: FONTS.body, color: selected ? COLOR.paper : COLOR.ink }}>
              <Check size={14} className="mt-0.5 shrink-0" style={{ color: selected ? COLOR.paper : COLOR.blushDeep }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}

function ReceiptTicket({ tierKey, people, duration }) {
  const tier = PRICING[tierKey];
  const bracket = getBracket(people);
  const pricePerPerson = getPricePerPerson(tierKey, people, duration);
  const total = pricePerPerson ? pricePerPerson * people : null;

  const needsQuote = bracket === "cotizacion";
  const belowMin = bracket === null;
  const animatedTotal = useAnimatedNumber(total ?? 0, 450);

  const waMsg = needsQuote
    ? `Hola, quiero una cotización personalizada de Coffee Break nivel ${tier.label} para ${people} personas, duración de ${duration} horas.`
    : `Hola, quiero reservar Coffee Break nivel ${tier.label} para ${people} personas, ${duration} horas. Vi un total estimado de ${total ? money(total) : ""}.`;

  return (
    <div className="mx-auto max-w-sm">
      <div
        style={{
          height: "16px",
          backgroundColor: COLOR.paper,
          backgroundImage: `radial-gradient(circle at 10px 10px, ${COLOR.creamDeep} 9px, transparent 10px)`,
          backgroundSize: "20px 20px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "top",
        }}
      />
      <div className="px-6 pt-2 pb-6" style={{ backgroundColor: COLOR.paper }}>
        <p className="text-center text-2xl mb-1" style={{ color: COLOR.ink, fontFamily: FONTS.display }}>
          Ale García Coffee Break
        </p>
        <p className="text-center text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
          — cotización estimada —
        </p>

        <div className="space-y-2 text-sm" style={{ fontFamily: FONTS.mono, color: COLOR.ink }}>
          <div className="flex justify-between"><span>Nivel</span><span>{tier.label}</span></div>
          <div className="flex justify-between"><span>Personas</span><span>{people}</span></div>
          <div className="flex justify-between"><span>Duración</span><span>{duration} h</span></div>
          <div className="border-t border-dashed my-2" style={{ borderColor: COLOR.blushSoft }} />
          {belowMin && (
            <p className="text-xs" style={{ color: COLOR.rose }}>Mínimo 20 personas por paquete.</p>
          )}
          {!belowMin && !needsQuote && (
            <>
              <div className="flex justify-between"><span>Precio / persona</span><span>{money(pricePerPerson)}</span></div>
              <div className="border-t border-dashed my-2" style={{ borderColor: COLOR.blushSoft }} />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{money(animatedTotal)}</span></div>
            </>
          )}
          {needsQuote && (
            <p className="text-xs leading-relaxed" style={{ color: COLOR.roseDeep, fontFamily: FONTS.body }}>
              Para grupos de {QUOTE_THRESHOLD} personas o más, tu coffee break se cotiza a la medida — sin precio de tabla.
              Escríbenos y te respondemos con una propuesta.
            </p>
          )}
        </div>

        <a
          href={waLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold w-full transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: needsQuote ? COLOR.rose : COLOR.whatsapp, color: "#fff", fontFamily: FONTS.body }}
        >
          <MessageCircle size={18} fill="#fff" style={{ color: needsQuote ? COLOR.rose : COLOR.whatsapp }} />
          {needsQuote ? "Solicitar cotización personalizada" : "Reservar por WhatsApp"}
        </a>
      </div>
      <div
        style={{
          height: "16px",
          backgroundColor: COLOR.paper,
          backgroundImage: `radial-gradient(circle at 10px 6px, ${COLOR.creamDeep} 9px, transparent 10px)`,
          backgroundSize: "20px 20px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
        }}
      />
    </div>
  );
}

function CoffeeBreaksView() {
  const [tierKey, setTierKey] = useState("estandar");
  const [people, setPeople] = useState(50);
  const [duration, setDuration] = useState(4);

  return (
    <div>
      <PageHero headline="El coffee break perfecto" accent={COLOR.blush} imageUrl={IMG_HERO_COFFEE} videoUrl={VIDEO_HERO_COFFEE} />
      <p className="max-w-lg mx-auto text-sm text-center px-6 pt-8" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
        Tres niveles, un mismo estándar de servicio. Elige el que va con tu evento y arma tu cotización al instante.
      </p>

      <section className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {Object.entries(PRICING).map(([key, tier], i) => (
          <Reveal key={key} delay={i * 0.08}>
            <TierCard tierKey={key} tier={tier} selected={tierKey === key} onSelect={setTierKey} />
          </Reveal>
        ))}
      </section>

      <section className="px-6 py-14" style={{ backgroundColor: COLOR.creamDeep }}>
        <Reveal>
          <Eyebrow color={COLOR.blushDeep}>Cotizador</Eyebrow>
        </Reveal>
        <h3 className="text-center text-3xl mb-8" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
          Arma tu cotización
        </h3>
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <Reveal className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider mb-2" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
                <Users size={14} /> Número de personas
              </label>
              <input
                type="range" min={20} max={800} step={10} value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: COLOR.blushDeep }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: COLOR.inkSoft, fontFamily: FONTS.mono }}>
                <span>20</span>
                <span className="text-base font-bold" style={{ color: COLOR.ink }}>{people} personas</span>
                <span>800</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider mb-2" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
                <Clock size={14} /> Duración del servicio
              </label>
              <div className="flex gap-2">
                {[2, 4, 8].map((h) => (
                  <button
                    key={h}
                    onClick={() => setDuration(h)}
                    className="flex-1 rounded-full py-2 text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: duration === h ? COLOR.ink : COLOR.paper,
                      color: duration === h ? COLOR.paper : COLOR.ink,
                      border: `1px solid ${COLOR.blushSoft}`,
                      fontFamily: FONTS.body,
                    }}
                  >
                    {h} horas
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
              Los precios de tabla aplican para grupos de hasta {QUOTE_THRESHOLD - 1} personas. A partir de{" "}
              {QUOTE_THRESHOLD} personas, cada coffee break se cotiza a la medida — desliza el número de
              personas para verlo en acción.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ReceiptTicket tierKey={tierKey} people={people} duration={duration} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PLANNER — servicios + formulario de cotización (lead → WhatsApp)
// ---------------------------------------------------------------------------
function PlannerLeadForm({ defaultTipo, serviceOptions, title = "Cuéntanos de tu evento", waIntro = "Hola, quiero cotizar un evento con Ale García Planner." }) {
  const options = serviceOptions || PLANNER_SERVICES.map((s) => s.label);
  const [form, setForm] = useState({
    nombre: "", empresa: "", telefono: "",
    tipo: defaultTipo || options[0], fecha: "", invitados: "", mensaje: "",
  });

  // Campos mínimos que pide la sección 0.3 de la estrategia: nombre, empresa,
  // tipo de evento, número de personas, teléfono — antes solo teníamos 2 de 5.
  const waMsg =
    `${waIntro}\n` +
    `Nombre: ${form.nombre || "—"}\n` +
    `Empresa: ${form.empresa || "—"}\n` +
    `Tipo de evento: ${form.tipo}\n` +
    `Teléfono: ${form.telefono || "—"}\n` +
    `Fecha tentativa: ${form.fecha || "por definir"}\n` +
    `Número de invitados: ${form.invitados || "por definir"}\n` +
    `Mensaje: ${form.mensaje || "—"}`;

  const inputStyle = { border: `1px solid ${COLOR.roseSoft}`, fontFamily: FONTS.body, color: COLOR.ink, backgroundColor: COLOR.cream };
  const labelClass = "block text-xs uppercase tracking-wider mb-1";
  const labelStyle = { color: COLOR.inkSoft, fontFamily: FONTS.body };

  return (
    <div className="mx-auto max-w-lg rounded-2xl p-8" style={{ backgroundColor: COLOR.paper, border: `1px solid ${COLOR.roseSoft}` }}>
      <div className="flex items-center gap-2 mb-5">
        <PartyPopper size={20} style={{ color: COLOR.rose }} />
        <h4 className="text-2xl" style={{ fontFamily: FONTS.display, color: COLOR.roseDeep }}>
          {title}
        </h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass} style={labelStyle}>Tipo de evento</label>
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={inputStyle}
          >
            {options.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} style={labelStyle}>Nombre completo</label>
            <input
              type="text" required placeholder="Tu nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Empresa (opcional)</label>
            <input
              type="text" placeholder="Si aplica" value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} style={labelStyle}>Teléfono</label>
            <input
              type="tel" required placeholder="33 1234 5678" value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Invitados</label>
            <input
              type="number" min={1} placeholder="Ej. 80" value={form.invitados}
              onChange={(e) => setForm({ ...form, invitados: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Fecha tentativa</label>
          <input
            type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={inputStyle}
          />
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>Cuéntanos más (opcional)</label>
          <textarea
            rows={3} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
            placeholder="Venue, estilo del evento, presupuesto aproximado..."
            className="w-full rounded-lg px-3 py-2 text-sm resize-none"
            style={inputStyle}
          />
        </div>

        <a
          href={waLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold w-full transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: COLOR.rose, color: "#fff", fontFamily: FONTS.body }}
        >
          <Send size={16} /> Enviar por WhatsApp
        </a>
      </div>
    </div>
  );
}

// Página dedicada por servicio (Posadas, Kickoff) — existen aparte de /planner
// porque Google Ads necesita un destino que responda exactamente a la búsqueda
// ("posada empresarial guadalajara"), no la página genérica de Planner.
function ServiceLandingPage({ headline, eyebrow, accent, heroImage, heroVideo, intro, bullets, galleryImages, defaultTipo, ctaTitle }) {
  return (
    <div>
      <PageHero headline={headline} accent={accent} imageUrl={heroImage} videoUrl={heroVideo} />

      <Reveal className="mx-auto max-w-2xl px-6 pt-16 pb-4 text-center">
        <Eyebrow color={accent}>{eyebrow}</Eyebrow>
        <p className="text-base max-w-lg mx-auto mt-4" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
          {intro}
        </p>
      </Reveal>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm" style={{ fontFamily: FONTS.body, color: COLOR.ink }}>
              <Check size={16} className="mt-0.5 shrink-0" style={{ color: accent }} />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {galleryImages && galleryImages.length > 0 && (
        <section className={`mx-auto max-w-5xl px-6 pb-16 grid gap-4 ${galleryImages.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {galleryImages.map((g) => (
            <PhotoPlaceholder
              key={g.label}
              label={g.label}
              accent={accent}
              imageUrl={g.src || null}
              rounded
              bordered={false}
              hoverLift={false}
              className={galleryImages.length === 1 ? "h-80 w-full" : "h-64 w-full"}
            />
          ))}
        </section>
      )}

      <section className="px-6 py-16" style={{ backgroundColor: COLOR.creamDeep }}>
        <div className="mx-auto max-w-lg text-center mb-8">
          <h3 className="text-2xl sm:text-3xl uppercase" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
            {ctaTitle}
          </h3>
        </div>
        <PlannerLeadForm defaultTipo={defaultTipo} />
      </section>
    </div>
  );
}

function PosadasEmpresarialesView() {
  return (
    <ServiceLandingPage
      headline="La posada que tu equipo sí va a recordar"
      eyebrow="Posadas empresariales"
      accent={COLOR.rose}
      heroImage={IMG_SERVICE_POSADA}
      intro="Organizamos la fiesta de fin de año de tu empresa de principio a fin: salón, ambientación, entretenimiento y logística — para que tú también puedas disfrutar la noche con tu equipo, en vez de estar resolviendo pendientes."
      bullets={[
        "Producción completa: sonido, iluminación y escenografía",
        "Coordinación de proveedores el día del evento",
        "Manejo de invitaciones y confirmaciones",
        "Opciones de entretenimiento en vivo",
        "Presupuesto claro desde la primera cotización",
        "Experiencia con grupos de 50 a 500+ personas",
      ]}
      galleryImages={[
        { src: IMG_GALLERY_POSADA, label: "Posada empresarial" },
        { src: IMG_SERVICE_POSADA, label: "Montaje de posada" },
      ]}
      defaultTipo="Posadas empresariales"
      ctaTitle="Cuéntanos de tu posada"
    />
  );
}

function KickoffEmpresarialView() {
  return (
    <ServiceLandingPage
      headline="Arranca el año con el pie derecho"
      eyebrow="Kickoff empresarial"
      accent={COLOR.blush}
      heroImage={IMG_SERVICE_KICKOFF}
      intro="Tu kickoff anual marca el tono del año para todo tu equipo. Nosotros armamos el evento — escenario, producción audiovisual, dinámica del día — para que el mensaje de liderazgo llegue con el impacto que merece."
      bullets={[
        "Escenario y producción audiovisual",
        "Dinámicas de integración y reconocimientos",
        "Coordinación directa con tu equipo de RH o Dirección",
        "Locaciones en toda la Zona Metropolitana de Guadalajara",
        "Igual de sólido para 80 que para 800 personas",
        "Un solo punto de contacto de principio a fin",
      ]}
      galleryImages={[
        { src: IMG_GALLERY_KICKOFF, label: "Kickoff empresarial" },
        { src: IMG_SERVICE_KICKOFF, label: "Escenario de kickoff" },
      ]}
      defaultTipo="Kickoffs"
      ctaTitle="Cuéntanos de tu kickoff"
    />
  );
}

function BodasView() {
  return (
    <ServiceLandingPage
      headline="La boda que soñaste, sin el estrés de organizarla"
      eyebrow="Bodas"
      accent={COLOR.rose}
      heroImage={null}
      intro="Acompañamos cada boda desde la primera cita hasta el último baile: proveedores, tiempos, montaje y logística del día, para que tú solo tengas que disfrutar."
      bullets={[
        "Selección y coordinación de proveedores (banquete, decoración, música)",
        "Cronograma detallado del día del evento",
        "Presencia el día de la boda de inicio a fin",
        "Opciones para bodas íntimas o de gran formato",
        "Manejo de imprevistos sin que tú te enteres",
        "Presupuesto claro desde la primera reunión",
      ]}
      galleryImages={[]}
      defaultTipo="Bodas"
      ctaTitle="Cuéntanos de tu boda"
    />
  );
}

function XVAnosView() {
  return (
    <ServiceLandingPage
      headline="Una fiesta de XV que se sienta 100% suya"
      eyebrow="XV años"
      accent={COLOR.blush}
      heroImage={null}
      intro="Organizamos la transición que marca esta etapa: del vals a la pista de baile, cuidando el estilo, el presupuesto y cada detalle que la hace única."
      bullets={[
        "Asesoría de estilo y tendencias actuales",
        "Coordinación de vals, protocolo y sorpresas",
        "Selección de venue, banquete y decoración",
        "Producción de audio, luces y animación",
        "Timeline de la noche resuelto de principio a fin",
        "Paquetes ajustables al número de invitados",
      ]}
      galleryImages={[]}
      defaultTipo="15 años"
      ctaTitle="Cuéntanos de la fiesta"
    />
  );
}

function AniversariosView() {
  return (
    <ServiceLandingPage
      headline="Celebra lo que sea, como se merece"
      eyebrow="Aniversarios y otros"
      accent={COLOR.rose}
      heroImage={IMG_SERVICE_OTROS}
      intro="Bautizos, aniversarios, graduaciones, reuniones familiares — cualquier motivo para celebrar merece la misma atención al detalle que le damos a una boda o un evento corporativo."
      bullets={[
        "Eventos de cualquier tamaño, desde 20 hasta 500+ invitados",
        "Locaciones en toda la Zona Metropolitana de Guadalajara",
        "Decoración a la medida del motivo y el estilo que buscas",
        "Coordinación de proveedores y logística del día",
        "Opciones de catering, música y entretenimiento",
        "Un punto de contacto de principio a fin",
      ]}
      galleryImages={[
        { src: IMG_GALLERY_ANIVERSARIO, label: "Aniversario" },
        { src: IMG_GALLERY_AIRE_LIBRE, label: "Celebración al aire libre" },
      ]}
      defaultTipo="Aniversarios y otros"
      ctaTitle="Cuéntanos qué estás celebrando"
    />
  );
}

function ConvencionesView() {
  return (
    <ServiceLandingPage
      headline="Congresos y convenciones sin sorpresas de logística"
      eyebrow="Convenciones"
      accent={COLOR.blush}
      heroImage={IMG_HERO_PLANNER}
      intro="Juntas anuales, congresos, capacitaciones de varios días — coordinamos la logística completa para que tu equipo se enfoque en el contenido, no en resolver imprevistos."
      bullets={[
        "Producción audiovisual y escenario",
        "Coordinación de ponentes y agenda del evento",
        "Logística de registro y acreditación de asistentes",
        "Catering y coffee breaks integrados (con nuestra propia marca)",
        "Locaciones para 50 hasta 1000+ asistentes",
        "Un solo equipo responsable de principio a fin",
      ]}
      galleryImages={[{ src: IMG_GALLERY_VIP, label: "Convención empresarial" }]}
      defaultTipo="Convenciones"
      ctaTitle="Cuéntanos de tu convención"
    />
  );
}

// Página de contacto — compartida por las dos marcas, un solo formulario
// (sección 0.3: "Formulario único, WhatsApp, ubicación de zona de cobertura").
const CONTACT_SERVICE_OPTIONS = ["Coffee Break", ...PLANNER_SERVICES.map((s) => s.label)];

function ContactoView() {
  return (
    <div>
      <PageHero headline="Hablemos de tu evento" accent={COLOR.ink} />

      <Reveal className="mx-auto max-w-2xl px-6 pt-16 pb-4 text-center">
        <Eyebrow color={COLOR.ink}>Contacto</Eyebrow>
        <p className="text-base max-w-lg mx-auto mt-4" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
          Coffee Breaks y Event Planner son un mismo equipo — escríbenos aquí sin importar cuál de los dos necesitas, y te contestamos directo por WhatsApp.
        </p>
        <p className="text-sm max-w-md mx-auto mt-3" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
          Atendemos toda la Zona Metropolitana de Guadalajara, con disponibilidad para eventos en el resto de Jalisco.
        </p>
      </Reveal>

      <section className="mx-auto max-w-3xl px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Reveal delay={0.05}>
          <a
            href={waLink("Hola, quiero información sobre los paquetes de Coffee Break.")}
            target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center text-center gap-3 rounded-2xl p-6 h-full transition-transform hover:-translate-y-1"
            style={{ backgroundColor: COLOR.blushSoft, border: `1px solid ${COLOR.blushSoft}` }}
          >
            <img src={LOGO_COFFEE} alt="Ale García Coffee Break" className="h-16 w-auto" />
            <p className="text-xs" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
              Café, panadería y servicio para juntas y eventos corporativos.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: COLOR.blushDeep }}>
              Escribir por WhatsApp <ArrowRight size={14} />
            </span>
          </a>
        </Reveal>
        <Reveal delay={0.12}>
          <a
            href={waLink("Hola, quiero información sobre organización de eventos con Ale García Planner.")}
            target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center text-center gap-3 rounded-2xl p-6 h-full transition-transform hover:-translate-y-1"
            style={{ backgroundColor: COLOR.roseSoft, border: `1px solid ${COLOR.roseSoft}` }}
          >
            <img src={LOGO_PLANNER} alt="Ale García Event Planner" className="h-16 w-auto" />
            <p className="text-xs" style={{ color: COLOR.ink, fontFamily: FONTS.body }}>
              Bodas, XV años, posadas empresariales, kickoffs y más.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: COLOR.roseDeep }}>
              Escribir por WhatsApp <ArrowRight size={14} />
            </span>
          </a>
        </Reveal>
      </section>

      <section className="px-6 py-16" style={{ backgroundColor: COLOR.creamDeep }}>
        <div className="mx-auto max-w-lg text-center mb-8">
          <h3 className="text-2xl sm:text-3xl uppercase" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
            O cuéntanos aquí directo
          </h3>
        </div>
        <PlannerLeadForm
          serviceOptions={CONTACT_SERVICE_OPTIONS}
          defaultTipo="Coffee Break"
          title="Escríbenos"
          waIntro="Hola, vengo de la página de contacto de Ale García Events."
        />
      </section>
    </div>
  );
}

function PlannerView() {
  return (
    <div>
      <PageHero headline="Creando eventos inolvidables" accent={COLOR.rose} imageUrl={IMG_HERO_PLANNER} videoUrl={VIDEO_HERO_PLANNER} objectPosition="center 80%" />

      <Reveal className="mx-auto max-w-2xl px-6 pt-16 pb-14 text-center">
        <Eyebrow color={COLOR.rose}>Planner</Eyebrow>
        <h3 className="text-2xl sm:text-3xl uppercase mb-3" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
          El detalle nunca es un detalle
        </h3>
        <p className="text-sm max-w-md mx-auto" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
          Organizamos tu evento social o corporativo cuidando cada decisión, por pequeña que parezca — de la primera idea al último brindis.
        </p>
      </Reveal>

      {/* Catálogo de servicios — mosaico de fotos, sin recuadros de color */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLANNER_SERVICES.map((s, i) => {
            const accent = i % 2 === 0 ? COLOR.rose : COLOR.blush;
            const hasPhoto = !!s.image;
            const cardInner = (
              <>
                <PhotoPlaceholder
                  label={`Foto: ${s.label}`}
                  accent={accent}
                  rounded={false}
                  bordered={false}
                  hoverLift={false}
                  imageUrl={s.image || null}
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundColor: COLOR.creamDeep, minHeight: "320px" }}
                />
                {hasPhoto && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, rgba(28,27,26,0) 45%, rgba(28,27,26,0.82) 100%)" }}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span
                    className="block text-[10px] uppercase tracking-[0.25em] mb-1"
                    style={{ fontFamily: FONTS.mono, color: hasPhoto ? "rgba(255,255,255,0.75)" : COLOR.inkSoft }}
                  >
                    ZMG
                  </span>
                  <h4 className="text-xl sm:text-2xl uppercase mb-1 leading-tight" style={{ fontFamily: FONTS.display, color: hasPhoto ? "#fff" : COLOR.ink }}>
                    {s.label}
                  </h4>
                  <p className="text-xs sm:text-sm mb-3 max-w-xs" style={{ color: hasPhoto ? "rgba(255,255,255,0.85)" : COLOR.inkSoft, fontFamily: FONTS.body }}>
                    {s.blurb}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: hasPhoto ? "#fff" : COLOR.roseDeep }}
                  >
                    {s.route ? "Ver más" : "Cotizar"} <ArrowRight size={14} />
                  </span>
                </div>
              </>
            );
            return (
              <Reveal key={s.key} delay={i * 0.08}>
                {/* Posadas y Kickoffs ya tienen página propia (para Google Ads);
                    el resto sigue yendo directo a WhatsApp. */}
                {s.route ? (
                  <Link to={s.route} className="group relative block w-full overflow-hidden rounded-xl">
                    {cardInner}
                  </Link>
                ) : (
                  <a
                    href={waLink(`Hola, quiero cotizar ${s.label}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block w-full overflow-hidden rounded-xl"
                  >
                    {cardInner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Cómo trabajamos — sí es una secuencia real, por eso se numera */}
      <section className="px-6 py-16" style={{ backgroundColor: COLOR.creamDeep }}>
        <div className="mx-auto max-w-5xl">
          <Eyebrow color={COLOR.rose}>Cómo trabajamos</Eyebrow>
          <h3 className="text-3xl sm:text-4xl uppercase mb-10 max-w-md" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
            Tú pones la idea, nosotros el resto
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            {PLANNER_PROCESS.map((p, i) => (
              <Reveal key={p.paso} delay={i * 0.1}>
                <span
                  className="inline-block text-sm mb-4"
                  style={{ fontFamily: FONTS.mono, color: COLOR.roseDeep }}
                >
                  {p.paso}
                </span>
                <h4 className="text-lg uppercase mb-2" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
                  {p.titulo}
                </h4>
                <p className="text-sm max-w-[26ch]" style={{ color: COLOR.inkSoft, fontFamily: FONTS.body }}>
                  {p.texto}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <Reveal className="mx-auto max-w-lg text-center mb-8">
          <Eyebrow color={COLOR.rose}>Cotización</Eyebrow>
          <h3 className="text-3xl uppercase" style={{ fontFamily: FONTS.display, color: COLOR.ink }}>
            Cuéntanos tu idea
          </h3>
        </Reveal>
        <Reveal>
          <PlannerLeadForm />
        </Reveal>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
function AppShell() {
  const { pathname } = useLocation();

  // Al cambiar de página, siempre arrancar arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fabMessage = useMemo(() => {
    if (pathname === "/coffee-breaks") return "Hola, quiero información sobre los paquetes de Coffee Break.";
    if (pathname === "/posadas-empresariales") return "Hola, quiero información sobre la posada empresarial de mi equipo.";
    if (pathname === "/kickoff-empresarial") return "Hola, quiero información sobre nuestro kickoff empresarial.";
    if (pathname === "/bodas") return "Hola, quiero información sobre organización de bodas.";
    if (pathname === "/xv-anos") return "Hola, quiero información sobre organización de XV años.";
    if (pathname === "/aniversarios") return "Hola, quiero información sobre organización de un evento.";
    if (pathname === "/convenciones") return "Hola, quiero información sobre organización de una convención o congreso.";
    if (pathname === "/planner") return "Hola, quiero información sobre organización de eventos con Ale García Planner.";
    return "Hola, quiero más información sobre Ale García Events.";
  }, [pathname]);

  return (
    <div style={{ backgroundColor: COLOR.cream, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,600&family=Jost:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

        .agv-view-transition {
          animation: agvFadeIn 0.55s ease both;
        }
        @keyframes agvFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .agv-marquee {
          animation: agvMarquee 26s linear infinite;
        }
        .agv-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes agvMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .agv-kenburns {
          animation: agvKenburns 22s ease-in-out infinite alternate;
        }
        @keyframes agvKenburns {
          from { transform: scale(1); }
          to { transform: scale(1.12); }
        }
        .agv-gradient-drift {
          animation: agvGradientDrift 9s ease-in-out infinite alternate;
        }
        @keyframes agvGradientDrift {
          from { background-position: 0% 50%; }
          to { background-position: 100% 50%; }
        }
        .agv-shimmer {
          animation: agvShimmer 3.4s ease-in-out infinite;
        }
        @keyframes agvShimmer {
          from { background-position: 0% 0; }
          to { background-position: -220% 0; }
        }
        /* Entrada escalonada del hero de Home: cada hijo directo (logo, texto, link)
           aparece un poco después que el anterior en vez de todos a la vez. */
        .agv-hero-enter > * {
          opacity: 0;
          transform: translateY(22px);
          animation: agvHeroEnter 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .agv-hero-enter > *:nth-child(1) { animation-delay: 0.05s; }
        .agv-hero-enter > *:nth-child(2) { animation-delay: 0.18s; }
        .agv-hero-enter > *:nth-child(3) { animation-delay: 0.3s; }
        @keyframes agvHeroEnter {
          to { opacity: 1; transform: translateY(0); }
        }
        .agv-cta:active {
          transform: scale(0.97);
        }
        @media (prefers-reduced-motion: reduce) {
          .agv-view-transition { animation: none; }
          .agv-marquee { animation: none; }
          .agv-kenburns { animation: none; }
          .agv-gradient-drift { animation: none; }
          .agv-shimmer { animation: none; }
          .agv-hero-enter > * { opacity: 1; transform: none; animation: none; }
        }
      `}</style>

      <NavBar />

      <ViewTransition viewKey={pathname}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/coffee-breaks" element={<CoffeeBreaksView />} />
          <Route path="/planner" element={<PlannerView />} />
          <Route path="/posadas-empresariales" element={<PosadasEmpresarialesView />} />
          <Route path="/kickoff-empresarial" element={<KickoffEmpresarialView />} />
          <Route path="/bodas" element={<BodasView />} />
          <Route path="/xv-anos" element={<XVAnosView />} />
          <Route path="/aniversarios" element={<AniversariosView />} />
          <Route path="/convenciones" element={<ConvencionesView />} />
          <Route path="/contacto" element={<ContactoView />} />
          <Route path="*" element={<HomeView />} />
        </Routes>
      </ViewTransition>

      <Footer />
      <WhatsAppFAB message={fabMessage} />
    </div>
  );
}

export default function AleGarciaEventsSite() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
