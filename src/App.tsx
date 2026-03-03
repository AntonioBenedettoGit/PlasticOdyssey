import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Factory, ShoppingCart, Waves, Skull } from 'lucide-react';

// --- TIPI ---
interface SectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

// --- COMPONENTI ---

const Bottle = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1.1, 1, 0.7, 0.5]);
  const rotate = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 10, -5, 20, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0.8, 1], [0, 12]);
  
  // Liquido che si svuota progressivamente durante tutto lo scroll (1 -> 0)
  const liquidLevel = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{ scale, rotate, opacity, filter: `blur(${blur}px)` }}
      className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
    >
      <div className="relative w-56 h-[500px] md:w-72 md:h-[600px]">
        <svg viewBox="0 0 100 200" className="w-full h-full filter drop-shadow-[0_0_80px_rgba(255,255,255,0.15)]">
          <defs>
            {/* Gradiente per il vetro */}
            <linearGradient id="glassBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
            
            {/* Gradiente per il liquido */}
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
            </linearGradient>

            {/* Maschera per il liquido */}
            <clipPath id="bottleMask">
              <path d="M35,15 L65,15 L67,40 Q70,50 82,65 L82,180 Q82,195 65,195 L35,195 Q18,195 18,180 L18,65 Q30,50 33,40 Z" />
            </clipPath>
          </defs>
          
          {/* Strato Base: Ombra interna/Profondità */}
          <path
            d="M35,15 L65,15 L67,40 Q70,50 82,65 L82,180 Q82,195 65,195 L35,195 Q18,195 18,180 L18,65 Q30,50 33,40 Z"
            fill="rgba(0,0,0,0.2)"
          />

          {/* Strato Liquido (mascherato) */}
          <g clipPath="url(#bottleMask)">
            <motion.rect
              x="0"
              width="100"
              fill="url(#liquidGrad)"
              style={{
                y: useTransform(liquidLevel, [0, 1], [200, 20]),
                height: 200,
              }}
            />
          </g>
          
          {/* Strato Vetro: Corpo principale */}
          <path
            d="M35,15 L65,15 L67,40 Q70,50 82,65 L82,180 Q82,195 65,195 L35,195 Q18,195 18,180 L18,65 Q30,50 33,40 Z"
            fill="url(#glassBody)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
          />

          {/* Highlights: Riflessi di luce per volume */}
          <path d="M25,70 Q25,120 25,175" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M75,75 Q75,100 75,130" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" fill="none" />
          
          {/* Dettaglio Tappo/Collo */}
          <rect x="34" y="12" width="32" height="4" rx="1" fill="rgba(255,255,255,0.5)" />
          <path d="M35,18 L65,18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        </svg>
      </div>
    </motion.div>
  );
};

const Section = ({ title, description, icon, index, image }: SectionProps & { image: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={ref} className="relative h-[150vh] flex items-center px-6 md:px-24 overflow-hidden">
      {/* Immagine di sfondo VIVA con parallax locale */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="w-full h-[140%] bg-cover bg-center opacity-90"
          style={{ 
            backgroundImage: `url(${image})`,
            y
          }}
        />
        {/* Overlay a gradiente più leggero per mostrare l'immagine */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className={`relative z-10 max-w-2xl ${index % 2 === 0 ? 'ml-0' : 'ml-auto text-right'}`}
      >
        <div className={`flex items-center gap-6 mb-8 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
          <div className="p-5 bg-white text-black rounded-full scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {icon}
          </div>
          <div className="h-[1px] w-24 bg-white/40" />
          <span className="text-sm font-display tracking-[0.3em] text-white italic font-bold">FASE 0{index + 1}</span>
        </div>
        <h2 className="text-6xl md:text-9xl font-bold mb-8 leading-[0.85] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-title">
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-white leading-relaxed font-body font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {description}
        </p>
      </motion.div>
    </section>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const sections = [
    {
      title: "La Genesi",
      description: "Ogni secondo vengono prodotte 16.000 bottiglie di plastica. Un processo industriale implacabile che trasforma il petrolio in un oggetto destinato a durare millenni, ma usato per pochi minuti.",
      icon: <Factory className="w-8 h-8" />,
      image: "/genesi.jpg"
    },
    {
      title: "Consumo Rapido",
      description: "La vita media di una bottiglia nelle mani di un consumatore è di circa 15 minuti. Una comodità effimera che nasconde un costo ambientale incalcolabile.",
      icon: <ShoppingCart className="w-8 h-8" />,
      image: "/consumo.jpg"
    },
    {
      title: "L'Abbandono",
      description: "Solo il 9% della plastica viene riciclato. Il resto finisce in discarica o, peggio, nei nostri oceani, dove inizia il suo vero, infinito viaggio.",
      icon: <Waves className="w-8 h-8" />,
      image: "/abbandono.jpg"
    },
    {
      title: "Erosione Infinita",
      description: "In mare, la plastica non scompare mai del tutto. Si frammenta in microplastiche, entrando nella catena alimentare e diventando parte del nostro stesso corpo.",
      icon: <Skull className="w-8 h-8" />,
      image: "/erosione.jpg"
    }
  ];

  return (
    <main className="relative bg-black text-white">
      <div className="grain-overlay" />
      
      {/* Background dinamicamente colorato */}
      <motion.div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          background: useTransform(
            smoothProgress,
            [0, 0.3, 0.6, 1],
            [
              "radial-gradient(circle at 50% 50%, #1e293b 0%, #000 100%)",
              "radial-gradient(circle at 80% 20%, #0c4a6e 0%, #000 100%)",
              "radial-gradient(circle at 20% 80%, #064e3b 0%, #000 100%)",
              "radial-gradient(circle at 50% 50%, #450a0a 0%, #000 100%)"
            ]
          )
        }}
      />

      <section className="relative h-[120vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image Hero */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="w-full h-[120%] bg-cover bg-center opacity-90"
            style={{ 
              backgroundImage: `url(/hero.jpg)`,
              y: useTransform(smoothProgress, [0, 0.2], [0, -100])
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs md:text-sm font-display tracking-[0.6em] text-white uppercase mb-8 block font-bold drop-shadow-lg">Inizia l'Odissea</span>
          <h1 className="text-7xl md:text-[14rem] font-bold mb-6 tracking-tighter leading-[0.8] drop-shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            PLASTIC<br/><span className="text-white/10 text-outline border-t border-b border-white/20 inline-block py-2">ODYSSEY</span>
          </h1>
          <div className="h-24 w-[1px] bg-gradient-to-b from-white to-transparent mx-auto mt-12" />
        </motion.div>
      </section>

      <Bottle scrollYProgress={smoothProgress} />

      {/* Sezioni Storia */}
      <div className="relative z-10">
        {sections.map((section, i) => (
          <Section key={i} {...section} index={i} />
        ))}
      </div>

      {/* Footer / Call to Action */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Image Footer */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="w-full h-[120%] bg-cover bg-center opacity-90"
            style={{ 
              backgroundImage: `url(/footer.jpg)`,
              y: useTransform(smoothProgress, [0.8, 1], [0, -150])
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div 
          className="relative z-10 max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">La storia non finisce qui.</h2>
          <p className="text-xl md:text-2xl text-white font-body font-medium drop-shadow-[0_2px_15px_rgba(0,0,0,1)]">
            Entro il 2050, negli oceani ci sarà più plastica che pesci. 
            Il cambiamento inizia con una scelta consapevole.
          </p>
        </motion.div>
        
        <div className="absolute bottom-12 text-white text-sm uppercase tracking-widest font-title drop-shadow-lg">
          © 2026 Plastic Odyssey — Creato per un futuro pulito
        </div>
      </section>

      {/* Barra di progresso laterale */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-12 bg-white/10 rounded-full overflow-hidden"
          >
            <motion.div 
              className="w-full bg-white origin-top"
              style={{ 
                scaleY: useTransform(smoothProgress, [i * 0.25, (i + 1) * 0.25], [0, 1]) 
              }}
            />
          </motion.div>
        ))}
      </div>
    </main>
  );
}
