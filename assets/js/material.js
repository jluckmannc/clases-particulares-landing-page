// ----- Material por nivel -----
// Es una muestra: como máximo tres guías por nivel.
// Cada guía tiene su PDF en assets/pdfs/guias/<slug>.pdf y sus vistas
// previas en assets/img/material/<slug>-<n>.webp (1 = portada).

const MATERIAL = [
  {
    id: "basica",
    label: "Básica",
    intro: "Guías para imprimir que acompañan los juegos.",
    items: [
      {
        slug: "gran-carrera-enteros",
        title: "La gran carrera: sumar enteros",
        tag: "Positivos y negativos",
        pages: 30,
        views: 3,
        desc: "Sumas con números positivos y negativos a través de recorridos, igual que en la Carrera de perritos.",
        game: { href: "juegos/carrera-de-perritos.html", label: "Carrera de perritos" },
      },
      {
        slug: "vaso-lleno",
        title: "Un vaso lleno es 1",
        tag: "Fracciones y decimales",
        pages: 6,
        views: 3,
        desc: "Cuánta leche hay en cada vaso, cuál tiene más y cómo se escribe como fracción o como decimal.",
      },
      {
        slug: "potencias-carrera",
        title: "La gran carrera: potencias",
        tag: "Potencias",
        pages: 7,
        views: 3,
        desc: "Potencias como multiplicación repetida, con los mismos perritos de la carrera.",
      },
    ],
  },
  {
    id: "media",
    label: "Media",
    intro: "Guías de ejercicios y de autoestudio para enseñanza media.",
    items: [
      {
        slug: "raices",
        title: "Raíces · autoestudio",
        tag: "Enseñanza media",
        pages: 9,
        views: 3,
        desc: "Para estudiar por tu cuenta: qué es una raíz, propiedades, simplificación, suma de radicales y racionalización. Trae las respuestas al final.",
      },
      {
        slug: "logaritmos",
        title: "Logaritmos · ejercicios",
        tag: "Enseñanza media",
        pages: 3,
        views: 3,
        desc: "Conexión con potencias, lectura y conversión, logaritmos exactos y un desafío para cerrar.",
      },
      {
        slug: "proporcionalidad",
        title: "Proporcionalidad",
        tag: "Enseñanza media",
        pages: 3,
        views: 3,
        desc: "Directa, inversa o compuesta: reconocer cuál es y resolver problemas.",
      },
    ],
  },
  {
    id: "universidad",
    label: "Universidad",
    intro: "Ejercicios resueltos paso a paso, con figuras.",
    items: [
      {
        slug: "solidos-revolucion",
        title: "Volumen de un sólido de revolución",
        tag: "Cálculo integral",
        pages: 4,
        views: 4,
        desc: "Un ejercicio resuelto en cuatro pasos: mirar la región, medir el radio, apilar las capas y sumar con la integral.",
      },
      {
        slug: "optimizacion",
        title: "Problemas de optimización resueltos",
        tag: "Cálculo diferencial",
        pages: 15,
        views: 3,
        desc: "Rectángulo bajo un semicírculo, caja de volumen máximo y otros, cada uno con su dibujo y el desarrollo completo.",
      },
    ],
  },
];

(function () {
  const IMG = "assets/img/material/";
  const PDF = "assets/pdfs/guias/";
  const STORE = "material-nivel";

  const img = (it, n) => `${IMG}${it.slug}-${n}.webp`;
  const pdf = (it) => `${PDF}${it.slug}.pdf`;
  const pagesLabel = (n) => `${n} ${n === 1 ? "página" : "páginas"}`;

  function readLevel() {
    try {
      return localStorage.getItem(STORE);
    } catch (e) {
      return null;
    }
  }
  function saveLevel(id) {
    try {
      localStorage.setItem(STORE, id);
    } catch (e) {}
  }

  // Abanico de páginas: la portada adelante y dos páginas interiores detrás
  function fan(it) {
    const back = [];
    for (let n = Math.min(it.views, 3); n >= 2; n--) back.push(n);
    return `
      <a class="fan" href="${pdf(it)}" target="_blank" rel="noopener" aria-label="Abrir ${it.title} (PDF)">
        ${back.map((n, i) => `<img class="fan-page fan-${i ? "left" : "right"}" src="${img(it, n)}" alt="" loading="lazy" width="600" height="776" />`).join("")}
        <img class="fan-page fan-front" src="${img(it, 1)}" alt="Portada de ${it.title}" width="600" height="776" />
      </a>`;
  }

  function featureHTML(level, it) {
    return `
      <div class="mat-feature-media">${fan(it)}</div>
      <div class="mat-feature-body">
        <p class="mat-tag">${it.tag}</p>
        <h3 class="mat-title">${it.title}</h3>
        <p class="mat-desc">${it.desc}</p>
        <p class="mat-meta">${pagesLabel(it.pages)} · PDF</p>
        <div class="mat-actions">
          <a class="btn-primary mat-btn" href="${pdf(it)}" target="_blank" rel="noopener">Ver la guía</a>
          ${it.game ? `<a class="mat-btn mat-btn-ghost" href="${it.game.href}">Jugar ${it.game.label}</a>` : ""}
        </div>
      </div>`;
  }

  function listHTML(level, current) {
    return level.items
      .map(
        (it) => `
        <li>
          <button type="button" class="mat-row${it === current ? " is-current" : ""}" data-slug="${it.slug}" aria-pressed="${it === current}">
            <img src="${img(it, 1)}" alt="" loading="lazy" width="600" height="776" />
            <span class="mat-row-text">
              <span class="mat-row-title">${it.title}</span>
              <span class="mat-row-meta">${it.tag} · ${pagesLabel(it.pages)}</span>
            </span>
          </button>
        </li>`
      )
      .join("");
  }

  function carouselHTML(level) {
    return level.items
      .map(
        (it) => `
        <a class="tile" href="${pdf(it)}" target="_blank" rel="noopener">
          <div class="paper paper-tall"><img src="${img(it, 1)}" alt="Portada de ${it.title}" loading="lazy" width="600" height="776" /></div>
          <span class="mt-3 font-semibold leading-snug">${it.title}</span>
          <span class="text-sm mat-row-meta">${pagesLabel(it.pages)}</span>
        </a>`
      )
      .join("");
  }

  function mount(root) {
    const seg = root.querySelector(".seg");
    const intro = root.querySelector(".mat-intro");
    const feature = root.querySelector(".mat-feature");
    const list = root.querySelector(".mat-list");
    const carousel = root.querySelector(".mat-carousel");

    seg.innerHTML =
      '<span class="seg-thumb" aria-hidden="true"></span>' +
      MATERIAL.map(
        (l) => `<button type="button" role="tab" class="seg-btn" id="seg-${l.id}" data-level="${l.id}" aria-selected="false">${l.label}</button>`
      ).join("");

    const buttons = [...seg.querySelectorAll(".seg-btn")];
    let level = MATERIAL.find((l) => l.id === readLevel()) || MATERIAL[0];
    let current = level.items[0];

    function renderFeature(animate) {
      feature.innerHTML = featureHTML(level, current);
      list.innerHTML = listHTML(level, current);
      if (animate) {
        feature.classList.remove("is-entering");
        void feature.offsetWidth; // reinicia la entrada
        feature.classList.add("is-entering");
      }
    }

    function selectLevel(next, animate) {
      level = next;
      current = level.items[0];
      const i = MATERIAL.indexOf(level);
      seg.style.setProperty("--seg-i", i);
      buttons.forEach((b, j) => {
        b.setAttribute("aria-selected", String(j === i));
        b.tabIndex = j === i ? 0 : -1;
      });
      intro.textContent = level.intro;
      carousel.innerHTML = carouselHTML(level);
      carousel.scrollLeft = 0;
      renderFeature(animate);
      saveLevel(level.id);
    }

    seg.style.setProperty("--seg-n", MATERIAL.length);

    // Cambia en pointerdown para que la respuesta sea inmediata
    buttons.forEach((b, i) => {
      b.addEventListener("pointerdown", (e) => {
        if (e.button === 0 && MATERIAL[i] !== level) selectLevel(MATERIAL[i], true);
      });
      b.addEventListener("click", () => {
        if (MATERIAL[i] !== level) selectLevel(MATERIAL[i], true);
      });
    });

    seg.addEventListener("keydown", (e) => {
      const i = MATERIAL.indexOf(level);
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      const next = (i + step + MATERIAL.length) % MATERIAL.length;
      selectLevel(MATERIAL[next], true);
      buttons[next].focus();
    });

    list.addEventListener("click", (e) => {
      const row = e.target.closest(".mat-row");
      if (!row) return;
      const it = level.items.find((x) => x.slug === row.dataset.slug);
      if (it && it !== current) {
        current = it;
        renderFeature(true);
      }
    });

    selectLevel(level, false);
  }

  // Catálogo completo (página Material): un bloque por nivel.
  // En celular cada nivel es un carrusel con título y páginas;
  // en escritorio, una grilla que además muestra descripción y botones.
  function catalogHTML() {
    return MATERIAL.map(
      (level) => `
      <section class="cat-level" id="nivel-${level.id}" aria-labelledby="cat-${level.id}">
        <div class="cat-head">
          <h2 class="cat-h" id="cat-${level.id}">${level.label}</h2>
          <p class="cat-intro">${level.intro}</p>
        </div>
        <div class="snap-row cat-row">
          ${level.items
            .map(
              (it) => `
            <article class="cat-card">
              <a class="cat-cover" href="${pdf(it)}" target="_blank" rel="noopener" aria-label="Abrir ${it.title} (PDF)">
                <img class="cat-peek" src="${img(it, 2)}" alt="" loading="lazy" width="600" height="776" />
                <img class="cat-front" src="${img(it, 1)}" alt="Portada de ${it.title}" loading="lazy" width="600" height="776" />
              </a>
              <p class="mat-tag cat-extra">${it.tag}</p>
              <h3 class="cat-title">${it.title}</h3>
              <p class="mat-desc cat-extra">${it.desc}</p>
              <p class="mat-meta">${pagesLabel(it.pages)}</p>
              <div class="cat-actions cat-extra">
                <a class="btn-primary mat-btn" href="${pdf(it)}" target="_blank" rel="noopener">Ver la guía</a>
                <a class="mat-btn mat-btn-ghost" href="${pdf(it)}" download>Descargar</a>
              </div>
            </article>`
            )
            .join("")}
        </div>
      </section>`
    ).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-material]").forEach(mount);
    document.querySelectorAll("[data-material-catalog]").forEach((el) => {
      el.innerHTML = catalogHTML();
    });
  });
})();
