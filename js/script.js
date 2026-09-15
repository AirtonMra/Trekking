/**
 * script.js — Cumbre Salvaje | Trekking & Turismo Aventura
 * JavaScript Vanilla — sin frameworks ni librerías externas
 */



/* ============================================================
   1. HEADER — scroll, hamburger, nav activo
   ============================================================ */


   

(function initHeader() {
  const header = document.querySelector(".header");
  const hamburger = document.querySelector(".header__hamburger");
  const nav = document.querySelector(".header__nav");
  const overlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!header) return; 

  // ── Scroll: agregar clase .scrolled ──────────────────────
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }





  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // ejecutar una vez al cargar

  // ── Hamburger ────────────────────────────────────────────
  function openMenu() {
    hamburger.classList.add("open");
    nav.classList.add("open");
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    hamburger.classList.remove("open");
    nav.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      if (nav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Cerrar al hacer click en un enlace interno
  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // ── Marcar enlace activo según página actual ──────────────
  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
})();

/* ============================================================
   2. ANIMACIONES REVEAL AL SCROLL
   ============================================================ */

(function initReveal() {
  /**
   * Observa elementos con clases:
   * .reveal, .reveal-left, .reveal-right
   * y les agrega .visible cuando entran en el viewport.
   */
  var targets = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );

  if (!targets.length) return;

  // Usar IntersectionObserver si está disponible
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Dejar de observar una vez revelado
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback para navegadores sin soporte
    targets.forEach(function (el) {
      el.classList.add("visible");
    });
  }
})();

/* ============================================================
   3. PARALLAX LIGERO EN HERO
   ============================================================ */

(function initParallax() {
  var heroBg = document.querySelector(".hero__bg");
  if (!heroBg) return;

  // Sólo en pantallas no táctiles (performance)
  if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        var scrollY = window.scrollY;
        var offset = scrollY * 0.3; // velocidad del parallax
        heroBg.style.transform = "scale(1.05) translateY(" + offset + "px)";
      },
      { passive: true },
    );
  }
})();

/* ============================================================
   4. HERO — clase .loaded para animación inicial del bg
   ============================================================ */

(function initHeroLoad() {
  var hero = document.querySelector(".hero");
  if (!hero) return;

  // Pequeño delay para la transición de entrada
  setTimeout(function () {
    hero.classList.add("loaded");
  }, 100);
})();

/* ============================================================
   5. SCROLL SUAVE — botón hero → sección salidas
   ============================================================ */

(function initSmoothScroll() {
  var triggers = document.querySelectorAll("[data-scroll-to]");

  triggers.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = btn.getAttribute("data-scroll-to");
      var targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      var headerH = document.querySelector(".header").offsetHeight || 80;
      var targetY =
        targetEl.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: targetY, behavior: "smooth" });
    });
  });
})();

/* ============================================================
   6. PARALLAX SECCIÓN CTA FINAL
   ============================================================ */

(function initCtaObserver() {
  var ctaEl = document.querySelector(".cta-final");
  if (!ctaEl) return;

  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(ctaEl);
  }
})();

/* ============================================================
   7. CONTADORES ANIMADOS (para página Nosotros)
   ============================================================ */

(function initCounters() {
  var counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-counter"), 10);
    var duration = 1800; // ms
    var start = null;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach(function (el) {
      obs.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      animateCounter(el);
    });
  }
})();

/* ============================================================
   8. FORMULARIO DE CONTACTO — validación básica
   ============================================================ */

function initContactForm() {
  const form = document.getElementById("contactForm");

  // Si la página no tiene formulario, no hacemos nada.
  if (!form) return;

  const feedback = form.querySelector(".form-feedback");
  const submitButton = form.querySelector(".form-submit");

  // Evita errores si falta algún elemento.
  if (!feedback || !submitButton) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Referencias a los campos
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");

    // Limpiar mensajes anteriores
    feedback.textContent = "";
    feedback.className = "form-feedback";
    feedback.style.display = "block";

    // Validación del nombre
    if (!nombre.value.trim()) {
      feedback.textContent = "Por favor, ingresá tu nombre.";
      feedback.classList.add("form-feedback--error");
      nombre.focus();
      return;
    }

    // Validación del email
    if (!email.value.trim() || !email.validity.valid) {
      feedback.textContent = "Por favor, ingresá un email válido.";
      feedback.classList.add("form-feedback--error");
      email.focus();
      return;
    }

    // Validación del mensaje
    if (!mensaje.value.trim()) {
      feedback.textContent = "Por favor, escribí un mensaje.";
      feedback.classList.add("form-feedback--error");
      mensaje.focus();
      return;
    }

    // Estado visual mientras se envía
    submitButton.disabled = true;
    submitButton.innerHTML = `
      Enviando...
      <span class="arrow" aria-hidden="true">→</span>
    `;

    try {
      // Envía los datos al endpoint de Formspree
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Éxito
        feedback.textContent =
          "¡Mensaje enviado correctamente! Te responderemos a la brevedad.";

        feedback.classList.add("form-feedback--success");

        // Limpia los campos
        form.reset();
      } else {
        // Error devuelto por Formspree
        const data = await response.json().catch(() => null);

        if (data && data.errors) {
          feedback.textContent = data.errors
            .map((error) => error.message)
            .join(", ");
        } else {
          feedback.textContent =
            "No se pudo enviar el mensaje. Intentá nuevamente.";
        }

        feedback.classList.add("form-feedback--error");
      }
    } catch (error) {
      // Error de conexión
      feedback.textContent =
        "Ocurrió un error de conexión. Intentá nuevamente.";

      feedback.classList.add("form-feedback--error");

      console.error("Error al enviar el formulario:", error);
    } finally {
      // Restaurar botón
      submitButton.disabled = false;
      submitButton.innerHTML = `
        Enviar mensaje
        <span class="arrow" aria-hidden="true">→</span>
      `;
    }
  });
}
/* ============================================================
   9. HOVER MAGNÉTICO EN BOTONES (efecto sutil)
   ============================================================ */

(function initMagneticBtns() {
  // Sólo en desktop
  if (!window.matchMedia("(hover: hover)").matches) return;

  var btns = document.querySelectorAll(".btn-primary, .btn-orange");

  btns.forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var rect = btn.getBoundingClientRect();
      var dx = e.clientX - (rect.left + rect.width / 2);
      var dy = e.clientY - (rect.top + rect.height / 2);
      var factor = 0.15;

      btn.style.transform =
        "translate(" + dx * factor + "px, " + dy * factor + "px)";
    });

    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });
})();
/* ============================================================
   10. UTILIDAD — Throttle
   ============================================================ */

function throttle(fn, limit) {
  var lastCall = 0;
  return function () {
    var now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, arguments);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});