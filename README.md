# MRB — Next-gen tech store (concept)

Web concepto para mi portfolio: **MRB**, una tienda ficticia de tecnología de próxima generación en Madrid (gafas de realidad mixta, audio, wearables, drones y hardware de IA).

Diseño, textos (EN/ES) y desarrollo: **María Luisa Ros Bolea** · [Portfolio](https://malurosbolea-ux.github.io/digital-strategy-portfolio/) · [LinkedIn](https://www.linkedin.com/in/marialuisarosbolea/)

> MRB es una marca de ejemplo. Productos, precios, tienda y reservas son ficticios: no se cobra nada ni se envía nada.

---

## Qué incluye

| Página | Qué hace |
|---|---|
| `index.html` | Intro animada del logo MRB (las letras se montan con estelas de velocidad, glitch y apertura en compuertas). Gafas VR en 3D (three.js) que se arrastran para girarlas y se despiezan al hacer scroll con etiquetas HUD. Texto cinético "Next is now" sobre un globo que gira, anillo 3D giratorio con los 6 productos, túnel 3D de imágenes, contadores, sección "warp" y planeta animado |
| `shop.html` | Catálogo de 6 productos con filtros, orden, vista rápida, colores, comparador, pack con descuento del 10 % y carrito |
| `vr-demo.html` | Reserva de demo de las Horizon X: experiencia, calendario real, horas, personas, datos, entrada con código y descarga a calendario (.ics) |
| `lab.html` | Servicios y espacio de la tienda |
| `contact.html` | Formulario que abre el email con el mensaje listo, horario con "hoy" marcado y mapa estilizado |
| `404.html` | Página de error personalizada |

Extras: inglés por defecto con botón **EN / ES**, transiciones de compuerta entre páginas, logo MRB animado (estelas, brillo y escaneo), estela de luz que sigue al cursor, palabras con glitch al pasar el ratón, carrito que se guarda entre páginas, textura de grano, versión móvil y modo de movimiento reducido.

---

## Cómo subirla a GitHub Pages (paso a paso)

1. Entra en **github.com** con tu cuenta `malurosbolea-ux`.
2. Arriba a la derecha pulsa **+ → New repository**.
3. Nombre: `mrb-tech-store` · márcalo como **Public** · pulsa **Create repository**.
4. En la página del repo pulsa **uploading an existing file**.
5. Descomprime el zip en tu ordenador. Abre la carpeta `mrb` y **arrastra TODO lo que hay dentro** (los archivos `.html`, `README.md` y la carpeta `assets`) a la ventana de GitHub.
   - Importante: arrastra el contenido, no la carpeta `mrb` entera. `index.html` tiene que quedar en la raíz del repo.
6. Abajo pulsa **Commit changes**.
7. Ve a **Settings → Pages**. En *Branch* elige `main` y carpeta `/ (root)` → **Save**.
8. Espera 1–2 minutos y recarga. Tu web estará en:
   **https://malurosbolea-ux.github.io/mrb-tech-store/**

Para enlazarla desde tu portfolio, usa esa URL en el botón o tarjeta del proyecto.

### Ojo

- Si abres `index.html` con doble clic desde tu ordenador, las gafas 3D no cargan (los navegadores bloquean ese tipo de script en archivos locales) y verás una foto en su lugar. En GitHub Pages funciona perfecto.
- Para cambiar un precio o un texto de producto: `assets/js/products.js`.
- La intro larga sale la primera vez que se abre la home en cada sesión; para volver a verla, abre la web en una pestaña nueva.
- Para cambiar colores: las variables del principio de `assets/css/mrb.css` (`--blue`, `--cyan`…).

---

## Tecnología

HTML, CSS y JavaScript sin frameworks · three.js (3D) · GSAP + ScrollTrigger (animaciones de scroll) · Lenis (scroll suave) · tipografías Orbitron, Michroma, Exo 2 y Share Tech Mono alojadas en local. Todo funciona sin depender de CDNs externos.

Imágenes: Canva. Logo MRB: diseño propio para este concepto.
