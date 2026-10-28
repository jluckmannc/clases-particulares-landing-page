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
      // Transición breve para que el cambio de brillo no sea brusco
      rootElement.classList.add("theme-transition");
      setTheme(current === "dark" ? "light" : "dark");
      window.setTimeout(() => rootElement.classList.remove("theme-transition"), 500);
    });
  }

  // En iOS, :active solo funciona si hay un listener de touchstart
  document.addEventListener("touchstart", () => {}, { passive: true });

  // ----- Barra superior: filo visible solo al hacer scroll -----
  const navbar = document.getElementById("navbar");

  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
  }

  // ----- Menú móvil (hoja que nace desde el botón) -----
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenu.classList.remove("hidden", "px-4", "pb-4", "shadow-md", "backdrop-blur");
    mobileMenu.classList.add("menu-sheet");
    mobileMenuButton.innerHTML =
      '<span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span>';
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-controls", "mobile-menu");

    mobileMenu.querySelectorAll("a").forEach((link, i) => {
      link.style.setProperty("--i", i);
    });

    const scrim = document.createElement("div");
    scrim.className = "menu-scrim xl:hidden";
    document.body.appendChild(scrim);

    const setMenu = (open) => {
      mobileMenu.classList.toggle("is-open", open);
      scrim.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      mobileMenuButton.setAttribute("aria-expanded", String(open));
      mobileMenuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };

    // Se abre en pointerdown para que responda al instante
    let openedOnPointerDown = false;
    mobileMenuButton.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      openedOnPointerDown = true;
      setMenu(!mobileMenu.classList.contains("is-open"));
    });
    mobileMenuButton.addEventListener("click", () => {
      if (openedOnPointerDown) {
        openedOnPointerDown = false;
        return;
      }
      setMenu(!mobileMenu.classList.contains("is-open"));
    });

    scrim.addEventListener("click", () => setMenu(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    window.matchMedia("(min-width: 1280px)").addEventListener("change", () => setMenu(false));

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
  }

  // ----- Sección activa en el menú -----
  const sectionLinks = document.querySelectorAll('#navbar a[href^="#"]');

  if (sectionLinks.length > 0) {
    const sections = [...new Set([...sectionLinks].map((a) => a.getAttribute("href")))]
      .map((href) => document.querySelector(href))
      .filter(Boolean);

    const markActive = (id) => {
      sectionLinks.forEach((a) => {
        if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) markActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => spy.observe(s));
  }

  // ----- Acordeón FAQ -----
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.setAttribute("aria-expanded", "false");

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
        otherQuestion.setAttribute("aria-expanded", "false");
        if (otherIcon) otherIcon.classList.remove("rotate-180");
      });

      if (!isOpen) {
        item.classList.add("faq-open", "bg-white", "dark:bg-slate-800/50", "shadow-md");
        answer.classList.remove("grid-rows-[0fr]", "opacity-0");
        answer.classList.add("grid-rows-[1fr]", "opacity-100");
        question.setAttribute("aria-expanded", "true");
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });

  // ----- Animaciones de aparición -----
  document.querySelectorAll(".stagger").forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  });

  const fadeSections = document.querySelectorAll(".fade-section");

  if (fadeSections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    fadeSections.forEach((section) => observer.observe(section));
  }

  // ----- Botón flotante de WhatsApp (móvil) -----
  // Aparece cuando el botón principal sale de la vista y se esconde
  // al llegar a Contacto, donde ya hay uno.
  const floatCta = document.getElementById("float-cta");
  const heroCta = document.getElementById("hero-cta");
  const contactSection = document.getElementById("contacto");

  if (floatCta && heroCta) {
    let heroVisible = true;
    let contactVisible = false;
    const update = () => {
      floatCta.classList.toggle("is-visible", !heroVisible && !contactVisible);
    };

    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting || entry.boundingClientRect.top > 0;
      update();
    }).observe(heroCta);

    if (contactSection) {
      new IntersectionObserver(
        ([entry]) => {
          contactVisible = entry.isIntersecting;
          update();
        },
        { rootMargin: "0px 0px -20% 0px" }
      ).observe(contactSection);
    }
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

    source.forEach((t, i) => {
      const card = document.createElement("article");
      card.style.setProperty("--i", i);

      card.className = `
        h-full rounded-2xl border border-slate-200/80 dark:border-slate-700
        bg-white/85 dark:bg-slate-800/70 backdrop-blur-sm
        p-6 md:p-7 shadow-sm lift
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