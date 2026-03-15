document.addEventListener("DOMContentLoaded", () => {
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ----- Modo oscuro / claro -----
  const themeToggleBtn = document.getElementById("theme-toggle");
  const iconTheme = document.getElementById("icon-theme");
  const rootElement = document.documentElement;

  const sunIcon =
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414m0-13.657l1.414 1.414M17.95 17.95l1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />';
  const moonIcon =
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />';

  function setTheme(theme) {
    if (!themeToggleBtn || !iconTheme) return;

    if (theme === "dark") {
      rootElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      iconTheme.innerHTML = moonIcon;
      themeToggleBtn.setAttribute("aria-label", "Cambiar a modo claro");
    } else {
      rootElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      iconTheme.innerHTML = sunIcon;
      themeToggleBtn.setAttribute("aria-label", "Cambiar a modo oscuro");
    }
  }

  if (themeToggleBtn && iconTheme) {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    themeToggleBtn.addEventListener("click", () => {
      const current = localStorage.getItem("theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ----- Menú móvil -----
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // ----- Acordeón FAQ -----
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const answer = question.nextElementSibling;
      const icon = question.querySelector("svg");
      const isOpen = item.classList.contains("faq-open");

      faqQuestions.forEach((otherQuestion) => {
        const otherItem = otherQuestion.closest(".faq-item");
        const otherAnswer = otherQuestion.nextElementSibling;
        const otherIcon = otherQuestion.querySelector("svg");

        otherItem.classList.remove("faq-open", "bg-white", "dark:bg-slate-800/50", "shadow-md");
        otherAnswer.classList.remove("grid-rows-[1fr]", "opacity-100");
        otherAnswer.classList.add("grid-rows-[0fr]", "opacity-0");
        if (otherIcon) otherIcon.classList.remove("rotate-180");
      });

      if (!isOpen) {
        item.classList.add("faq-open", "bg-white", "dark:bg-slate-800/50", "shadow-md");
        answer.classList.remove("grid-rows-[0fr]", "opacity-0");
        answer.classList.add("grid-rows-[1fr]", "opacity-100");
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });

  // ----- Animaciones de aparición -----
  const fadeSections = document.querySelectorAll(".fade-section");

  if (fadeSections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeSections.forEach((section) => observer.observe(section));
  }

  // ----- Cargar testimonios -----
  loadTestimonials(escapeHTML);
});

async function loadTestimonials(escapeHTML) {
  function formatPeriodo(inicio, fin) {
    const inicioLimpio = inicio ? String(inicio).trim() : "";
    const finLimpio = fin ? String(fin).trim() : "";

    if (inicioLimpio && finLimpio) {
      if (inicioLimpio === finLimpio) return inicioLimpio;
      return `${inicioLimpio}–${finLimpio}`;
    }

    if (inicioLimpio) return inicioLimpio;
    if (finLimpio) return finLimpio;

    return "";
  }

  try {
    const container = document.getElementById("testimonials-container");
    if (!container) return;

    const res = await fetch("assets/data/comments.json", { cache: "no-store" });
    const testimonials = await res.json();

    const publicados = testimonials.filter((t) => t.publicado === true);

    container.innerHTML = "";

    if (publicados.length === 0) {
      container.innerHTML = `
        <div class="col-span-1 md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 p-8 md:p-10 text-center shadow-sm">
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            Pronto compartiré aquí algunas experiencias de estudiantes que han querido contar su proceso.
          </p>
        </div>
      `;
      return;
    }

    const mode = container.dataset.mode === "all" ? "all" : "featured";
    const source =
      mode === "all"
        ? publicados
        : [...publicados].sort(() => 0.5 - Math.random()).slice(0, 3);

    source.forEach((t) => {
      const card = document.createElement("article");

      card.className = `
        h-full rounded-2xl border border-slate-200/80 dark:border-slate-700
        bg-white/85 dark:bg-slate-800/70 backdrop-blur-sm
        p-6 md:p-7 shadow-sm hover:shadow-md
        transition-all duration-300 hover:-translate-y-0.5
        flex flex-col
      `;

      const nombre = t.nombre ? escapeHTML(t.nombre) : "Estudiante";
      const edad = t.edad ? `${escapeHTML(t.edad)} años` : "";
      const ciudad = t.ciudad ? escapeHTML(t.ciudad) : "";

      // Campo nuevo principal + compatibilidad con archivos antiguos
      const cursoCarreraNivel = t.curso_carrera_nivel
        ? escapeHTML(t.curso_carrera_nivel)
        : t.nivel
        ? escapeHTML(t.nivel)
        : "";

      const proceso = t.proceso ? escapeHTML(t.proceso) : "";
      // Dejamos la original sin borrar por si algún día necesito mayor seguridad
      // const comentario = t.comentario ? escapeHTML(t.comentario) : "";
      const comentario = t.comentario ? t.comentario : "";
      const periodo = formatPeriodo(t.anio_inicio, t.anio_fin);

      const metaTop = [edad, ciudad].filter(Boolean).join(" · ");
      const metaBottom = [cursoCarreraNivel, periodo].filter(Boolean).join(" · ");

      card.innerHTML = `
        <div class="flex flex-col h-full">
          <header class="mb-4">
            <h3 class="text-lg md:text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              ${nombre}
            </h3>

            ${
              metaTop
                ? `<p class="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${metaTop}</p>`
                : ""
            }

            ${
              metaBottom
                ? `<p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${metaBottom}</p>`
                : ""
            }
          </header>

          ${
            proceso
              ? `
                <div class="mb-4">
                  <span class="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700/70 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                    ${proceso}
                  </span>
                </div>
              `
              : ""
          }

          <div class="text-[15px] md:text-base leading-7 text-slate-700 dark:text-slate-200 flex-grow">
            ${comentario}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando testimonios:", error);

    const container = document.getElementById("testimonials-container");
    if (container) {
      container.innerHTML = `
        <div class="col-span-1 md:col-span-2 xl:col-span-3 rounded-2xl border border-red-200/70 dark:border-red-900/50 bg-white/80 dark:bg-slate-800/70 p-8 md:p-10 text-center shadow-sm">
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            No fue posible cargar los testimonios en este momento.
          </p>
        </div>
      `;
    }
  }
}