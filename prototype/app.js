/* ═══════════════════════════════════════════
   REMEHBS — Prototype JS
═══════════════════════════════════════════ */

// ── Header scroll ──────────────────────────
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
});

// ── Burger menu ────────────────────────────
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => nav.classList.toggle("open"));
document
  .querySelectorAll(".nav__link")
  .forEach((l) =>
    l.addEventListener("click", () => nav.classList.remove("open")),
  );

// ── Plan selection → pre-fill form ─────────
let selectedPlan = { key: "", price: 0 };

function selectPlan(key, price) {
  selectedPlan = { key, price };

  // Sync summary
  const labels = {
    medecin: "Médecin / Spécialiste",
    "sage-femme": "Sage-femme / Infirmier(e)",
    etudiant: "Étudiant / Résident",
  };
  document.getElementById("summary-cat").textContent = labels[key] || key;
  document.getElementById("summary-price").textContent =
    price.toLocaleString("fr-FR") + " FCFA";

  // Sync category select in step 2
  const sel = document.getElementById("categorie");
  if (sel) {
    const opt = [...sel.options].find((o) => o.value === key);
    if (opt) sel.value = key;
  }

  // Scroll to form
  document
    .getElementById("adhesion-form")
    .scrollIntoView({ behavior: "smooth", block: "start" });
  goStep(1);
}

// ── Multi-step form ─────────────────────────
let currentStep = 1;

function goStep(n) {
  // Hide all steps
  document
    .querySelectorAll(".form-step")
    .forEach((el) => el.classList.add("form-step--hidden"));
  document.getElementById(`step-${n}`)?.classList.remove("form-step--hidden");

  // Update step indicators
  document.querySelectorAll('[id^="step-indicator-"]').forEach((el, i) => {
    const stepNum = i + 1;
    el.classList.remove("step--active", "step--done");
    if (stepNum < n) el.classList.add("step--done");
    if (stepNum === n) el.classList.add("step--active");
  });

  // Update step numbers to checkmarks for done
  document.querySelectorAll('[id^="step-indicator-"]').forEach((el, i) => {
    const numEl = el.querySelector(".step__num");
    if (!numEl) return;
    if (el.classList.contains("step--done")) {
      numEl.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else numEl.textContent = String(i + 1);
  });

  currentStep = n;
}

// ── Payment method toggle ───────────────────
document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const mobileField = document.getElementById("mobile-field");
    const bankInfo = document.getElementById("bank-info");
    mobileField.style.display = "none";
    bankInfo.style.display = "none";
    if (radio.value === "orange" || radio.value === "moov") {
      mobileField.style.display = "block";
    } else if (radio.value === "coris") {
      bankInfo.style.display = "block";
    }
  });
});

// ── Submit form ─────────────────────────────
function submitForm() {
  const email = document.getElementById("email")?.value || "—";
  document.getElementById("confirm-email").textContent = email;

  // Hide all steps, show success
  document
    .querySelectorAll(".form-step")
    .forEach((el) => el.classList.add("form-step--hidden"));
  document.getElementById("step-success").classList.remove("form-step--hidden");

  // Update all step indicators to done
  document.querySelectorAll('[id^="step-indicator-"]').forEach((el) => {
    el.classList.remove("step--active");
    el.classList.add("step--done");
    const numEl = el.querySelector(".step__num");
    if (numEl) numEl.textContent = "✓";
  });

  // Scroll to confirmation
  document
    .getElementById("adhesion-form")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Active nav link on scroll ───────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("nav__link--active"));
        const active = document.querySelector(
          `.nav__link[href="#${entry.target.id}"]`,
        );
        if (active) active.classList.add("nav__link--active");
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((s) => observer.observe(s));
