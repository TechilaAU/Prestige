/* =====================================================================
   Prestige Concreting Whitsundays — site interactions
   Mobile menu · scroll reveal · service chips · quote form
   No framework, no build step. Safe to run on every page.
   ===================================================================== */
(function () {
  "use strict";

  /* -------------------------------------------------------------------
     CONFIG — edit these two values, then the contact form is live.
     1) WEB3FORMS_KEY: free access key from https://web3forms.com (recommended).
        Leave blank to fall back to opening the visitor's email app instead.
     2) BUSINESS_EMAIL: where the mailto fallback sends quote requests.
     ------------------------------------------------------------------- */
  var WEB3FORMS_KEY = "";                       // e.g. "a1b2c3d4-...."
  var BUSINESS_EMAIL = "your-email@example.com"; // change to Brad's email
  var PHONE = "0455 205 548";

  /* ---------- Mobile menu ---------- */
  var menu = document.getElementById("mobileMenu");
  window.PC = {
    openMenu: function () {
      if (!menu) return;
      menu.classList.add("open");
      document.body.classList.add("menu-open");
      var burger = document.querySelector(".nav-burger");
      if (burger) burger.setAttribute("aria-expanded", "true");
    },
    closeMenu: function () {
      if (!menu) return;
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      var burger = document.querySelector(".nav-burger");
      if (burger) burger.setAttribute("aria-expanded", "false");
    }
  };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("open")) window.PC.closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  function reveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Service chips (contact page) ---------- */
  function initChips() {
    var box = document.getElementById("svcChips");
    if (!box) return;
    box.addEventListener("click", function (e) {
      if (e.target.classList.contains("chip-toggle")) {
        e.target.classList.toggle("on");
        var pressed = e.target.classList.contains("on");
        e.target.setAttribute("aria-pressed", pressed ? "true" : "false");
      }
    });
  }

  /* ---------- Quote form ---------- */
  function initForm() {
    var form = document.getElementById("quoteForm");
    if (!form) return;
    var success = document.getElementById("formSuccess");

    function selectedServices() {
      return Array.prototype.slice
        .call(document.querySelectorAll("#svcChips .chip-toggle.on"))
        .map(function (c) { return c.textContent.trim(); })
        .join(", ");
    }

    function showSuccess() {
      form.style.display = "none";
      if (!success) return;
      success.style.display = "block";
      var y = success.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    function mailtoFallback(data) {
      var subject = "Quote request — " + (data.name || "Website");
      var body =
        "Name: " + (data.name || "") + "\n" +
        "Phone: " + (data.phone || "") + "\n" +
        "Email: " + (data.email || "") + "\n" +
        "Suburb: " + (data.suburb || "") + "\n" +
        "Services: " + (data.services || "") + "\n\n" +
        "Details:\n" + (data.msg || "");
      window.location.href =
        "mailto:" + BUSINESS_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      showSuccess();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name");
      var phone = document.getElementById("phone");
      var suburb = document.getElementById("suburb");
      var ok = true;
      [name, phone, suburb].forEach(function (f) {
        if (!f.value.trim()) {
          f.style.borderColor = "var(--pc-brand)";
          f.style.boxShadow = "0 0 0 3px rgba(196,90,27,0.16)";
          f.setAttribute("aria-invalid", "true");
          ok = false;
        } else {
          f.style.borderColor = "";
          f.style.boxShadow = "";
          f.removeAttribute("aria-invalid");
        }
      });
      if (!ok) { name.focus(); return; }

      var data = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: (document.getElementById("email") || {}).value || "",
        suburb: suburb.value.trim(),
        services: selectedServices(),
        msg: (document.getElementById("msg") || {}).value || ""
      };

      // No Web3Forms key configured → open the visitor's email app.
      if (!WEB3FORMS_KEY) { mailtoFallback(data); return; }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = "0.7"; }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New quote request from the website",
          from_name: "Prestige Concreting Website",
          name: data.name,
          phone: data.phone,
          email: data.email,
          suburb: data.suburb,
          services: data.services,
          message: data.msg
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) { showSuccess(); }
          else { mailtoFallback(data); }
        })
        .catch(function () { mailtoFallback(data); })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.style.opacity = ""; }
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    reveal();
    initChips();
    initForm();
  });
})();
