/* MRB catalogue — six next-gen objects (prices in EUR, VAT included) */
window.MRB_PRODUCTS = [
  {
    id: "horizon-x", no: "01", name: "Horizon X", cat: "vr", price: 1499,
    img: ["horizon", "horizon-2", "neon-2"],
    badge: { en: "New drop", es: "Novedad" },
    catLabel: { en: "Mixed reality", es: "Realidad mixta" },
    short: { en: "Mixed-reality headset with dual 4K micro-OLED and eye tracking.", es: "Gafas de realidad mixta con doble micro-OLED 4K y seguimiento ocular." },
    long: { en: "Our flagship. Pass-through so sharp you forget it is a screen, hand tracking that reads every finger and a 118° field of view that swallows the room. Work, play or create in the same headset.", es: "Nuestro buque insignia. Una visión del entorno tan nítida que olvidas que es una pantalla, seguimiento de manos dedo a dedo y 118° de campo de visión que se tragan la habitación. Trabaja, juega o crea con las mismas gafas." },
    specs: [["Display", "Pantalla", "2× 4K micro-OLED"], ["Refresh", "Refresco", "120 Hz"], ["Field of view", "Campo de visión", "118°"], ["Weight", "Peso", "412 g"], ["Battery", "Batería", "3 h + hot-swap"], ["Tracking", "Seguimiento", "Eye · hand · 6DoF"]],
    colors: [["Polar white", "Blanco polar", "#e8eef8"], ["Deep space", "Espacio profundo", "#1a2236"]],
    demo: true
  },
  {
    id: "aura-one", no: "02", name: "Aura One", cat: "audio", price: 429,
    img: ["aura", "audio-studio"],
    badge: { en: "Studio grade", es: "Calidad estudio" },
    catLabel: { en: "Audio", es: "Audio" },
    short: { en: "Over-ear headphones with adaptive ANC and AI-tuned spatial audio.", es: "Cascos over-ear con cancelación adaptativa y audio espacial afinado por IA." },
    long: { en: "Graphene drivers, adaptive noise cancelling that listens 48,000 times a second and a 60-hour battery. A game mode with 28 ms latency, because footsteps matter.", es: "Drivers de grafeno, cancelación de ruido adaptativa que escucha 48.000 veces por segundo y 60 horas de batería. Con modo juego de 28 ms de latencia, porque los pasos importan." },
    specs: [["Driver", "Driver", "40 mm graphene"], ["ANC", "Cancelación", "Adaptive −42 dB"], ["Battery", "Batería", "60 h"], ["Latency", "Latencia", "28 ms game mode"], ["Codec", "Códec", "LDAC · LE Audio"], ["Weight", "Peso", "268 g"]],
    colors: [["Graphite", "Grafito", "#3a3f4a"], ["Arctic", "Ártico", "#dfe7f2"]]
  },
  {
    id: "pulse-buds", no: "03", name: "Pulse Buds", cat: "audio", price: 229,
    img: ["buds", "buds-2"],
    badge: { en: "Bestseller", es: "Más vendido" },
    catLabel: { en: "Audio", es: "Audio" },
    short: { en: "True wireless earbuds with head-tracked spatial sound.", es: "Auriculares inalámbricos con sonido espacial que sigue tu cabeza." },
    long: { en: "4.6 grams per bud, 45 hours with the case and IP57 for rain, sweat and Madrid in August. Pair them once, they follow you across every device.", es: "4,6 gramos por auricular, 45 horas con el estuche e IP57 para la lluvia, el sudor y Madrid en agosto. Los vinculas una vez y te siguen entre todos tus dispositivos." },
    specs: [["ANC", "Cancelación", "−38 dB"], ["Battery", "Batería", "9 h + 36 h case"], ["Rating", "Protección", "IP57"], ["Charging", "Carga", "Qi2 wireless"], ["Spatial", "Espacial", "Head-tracked"], ["Weight", "Peso", "4.6 g / bud"]],
    colors: [["Onyx", "Ónix", "#15181f"], ["Coral", "Coral", "#ff7d86"]]
  },
  {
    id: "chrono-s", no: "04", name: "Chrono S", cat: "wear", price: 449,
    img: ["watch", "watch-2"],
    badge: { en: "Titanium", es: "Titanio" },
    catLabel: { en: "Wearables", es: "Wearables" },
    short: { en: "Titanium smartwatch with a 3,000-nit display and four-day battery.", es: "Smartwatch de titanio con pantalla de 3.000 nits y cuatro días de batería." },
    long: { en: "ECG, blood oxygen and skin temperature in a 44 mm titanium case. It unlocks your Horizon X, pauses your music and tells you, gently, that it is 3 a.m.", es: "ECG, oxígeno en sangre y temperatura en una caja de titanio de 44 mm. Desbloquea tus Horizon X, pausa tu música y te avisa, con cariño, de que son las 3 de la mañana." },
    specs: [["Display", "Pantalla", "1.9\" LTPO AMOLED"], ["Brightness", "Brillo", "3,000 nits"], ["Battery", "Batería", "4 days"], ["Sensors", "Sensores", "ECG · SpO₂ · temp"], ["Case", "Caja", "Titanium 44 mm"], ["Water", "Agua", "10 ATM"]],
    colors: [["Titanium", "Titanio", "#9aa3ad"], ["Midnight", "Medianoche", "#14171d"]]
  },
  {
    id: "volt-4k", no: "05", name: "Volt 4K", cat: "drone", price: 1190,
    img: ["drone", "drone-2"],
    badge: { en: "Under 250 g", es: "Menos de 250 g" },
    catLabel: { en: "Drones", es: "Drones" },
    short: { en: "Foldable 249 g drone with a 1-inch sensor and 46-minute flight.", es: "Dron plegable de 249 g con sensor de 1 pulgada y 46 minutos de vuelo." },
    long: { en: "Fits in a jacket pocket, films 4K at 120 fps and sees in every direction. Pair it with Horizon X and fly first-person, as if you had grown wings.", es: "Cabe en el bolsillo de la chaqueta, graba 4K a 120 fps y ve en todas direcciones. Conéctalo a las Horizon X y vuela en primera persona, como si te hubieran salido alas." },
    specs: [["Camera", "Cámara", "1\" · 4K/120"], ["Flight time", "Autonomía", "46 min"], ["Range", "Alcance", "20 km"], ["Weight", "Peso", "249 g"], ["Sensing", "Detección", "360° obstacle"], ["Wind", "Viento", "Level 5"]],
    colors: [["Storm grey", "Gris tormenta", "#4a5260"]]
  },
  {
    id: "neural-core", no: "06", name: "Neural Core Q1", cat: "ai", price: 899,
    img: ["chip-core", "chip-mono"],
    badge: { en: "Pre-order", es: "Preventa" },
    catLabel: { en: "AI hardware", es: "Hardware IA" },
    short: { en: "PCIe AI accelerator to run local LLMs and image models on your PC.", es: "Acelerador de IA PCIe para ejecutar LLM y modelos de imagen en tu PC." },
    long: { en: "260 TOPS in a low-profile card. Run language and diffusion models on your own desk: private, offline and without a monthly bill.", es: "260 TOPS en una tarjeta de perfil bajo. Ejecuta modelos de lenguaje y de imagen en tu propio escritorio: privado, sin conexión y sin factura mensual." },
    specs: [["Compute", "Potencia", "260 TOPS INT8"], ["Memory", "Memoria", "32 GB LPDDR6"], ["Interface", "Interfaz", "PCIe 5.0 x8"], ["Power", "Consumo", "75 W"], ["Frameworks", "Frameworks", "PyTorch · ONNX"], ["Form", "Formato", "Low-profile"]],
    colors: [["Black PCB", "PCB negra", "#0b0d12"]]
  }
];
