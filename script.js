(function () {
  "use strict";

  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll("[data-nav]");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const footer = document.querySelector("#page-home-footer");

  // ---------- Navigation ----------
  function showPage(pageId) {
    // hide all pages
    pages.forEach(function (p) {
      p.classList.remove("active");
    });

    // show target
    var target = document.getElementById(pageId);
    if (target) {
      target.classList.add("active");
    }

    // show/hide footer (only on home)
    if (footer) {
      if (pageId === "page-home") {
        footer.style.display = "block";
      } else {
        footer.style.display = "none";
      }
    }

    // update active nav link
    navLinks.forEach(function (link) {
      link.classList.remove("active");
    });
    var activeLink = document.querySelector('[data-nav="' + pageId.replace("page-", "") + '"]');
    if (activeLink) {
      activeLink.classList.add("active");
    }

    // close mobile nav
    nav.classList.remove("open");

    // update url hash
    if (pageId !== "page-home") {
      history.pushState(null, "", "#" + pageId.replace("page-", ""));
    } else {
      history.pushState(null, "", window.location.pathname + window.location.search);
    }
  }

  // click handlers
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = this.getAttribute("data-nav");
      var pageId = target === "home" ? "page-home" : target === "work-page" ? "page-work" : "page-" + target;
      showPage(pageId);
    });
  });

  // back buttons
  document.querySelectorAll(".btn-back").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var target = this.getAttribute("data-nav");
      var pageId = "page-" + target;
      showPage(pageId);
    });
  });

  // logo click
  document.querySelector(".nav-logo").addEventListener("click", function (e) {
    e.preventDefault();
    showPage("page-home");
  });

  // mobile toggle
  navToggle.addEventListener("click", function () {
    nav.classList.toggle("open");
  });

  // ---------- Hash-based routing ----------
  function handleHash() {
    var hash = window.location.hash.replace("#", "");
    if (!hash) {
      showPage("page-home");
      return;
    }
    // map hash to page id
    var pageId = hash;
    if (["work", "about", "contact"].indexOf(hash) !== -1) {
      pageId = "page-" + hash;
    }
    // case study pages keep their hash as id
    if (document.getElementById(pageId)) {
      showPage(pageId);
    } else {
      showPage("page-home");
    }
  }

  window.addEventListener("hashchange", handleHash);

  // ---------- Init ----------
  handleHash();

  // ---------- Scroll reveal (micro-interaction) ----------
  var revealEls = document.querySelectorAll(
    ".project-card, .skill-group, .section-title, .cta-heading, .cta-text, .resume-entry"
  );

  function isInView(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 60;
  }

  function checkReveal() {
    revealEls.forEach(function (el) {
      if (isInView(el)) {
        el.classList.add("revealed");
      }
    });
  }

  // add initial styles
  var style = document.createElement("style");
  style.textContent =
    ".project-card, .skill-group, .section-title, .cta-heading, .cta-text, .resume-entry { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; } .revealed { opacity: 1; transform: translateY(0); }";
  document.head.appendChild(style);

  window.addEventListener("scroll", checkReveal);
  window.addEventListener("load", function () {
    setTimeout(checkReveal, 100);
  });

  // re-check on page switch
  var origShow = showPage;
  showPage = function (id) {
    origShow(id);
    setTimeout(checkReveal, 50);
    // reset back-to-top on page switch
    backToTop.classList.remove("visible");
    window.scrollTo(0, 0);
  };

  // ---------- Back to top ----------
  var backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();