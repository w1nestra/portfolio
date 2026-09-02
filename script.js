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

  // Brave Refuge link from About → Art
  document.querySelectorAll("[data-brave-refuge]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      showPage("page-art");
      history.pushState(null, "", "#brave-refuge");
      setTimeout(function () {
        var target = document.getElementById("brave-refuge");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    });
  });

  // logo no longer navigates (Home link now handles it)

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
    // Brave Refuge anchor inside Art page
    if (hash === "brave-refuge") {
      showPage("page-art");
      setTimeout(function () {
        var el = document.getElementById("brave-refuge");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }
    // map hash to page id
    var pageId = hash;
    if (["work", "about", "contact", "art"].indexOf(hash) !== -1) {
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

  // ---------- Theme toggle (light/dark) ----------
  var themeToggle = document.getElementById("theme-toggle");
  var artHintToggle = document.getElementById("art-hint-pill") || document.querySelector(".art-hint-toggle") || document.querySelector(".art-hint");
  var htmlEl = document.documentElement;

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  function toggleTheme() {
    var current = htmlEl.getAttribute("data-theme") || "light";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  }

  function pulseArtMasonry() {
    var art = document.getElementById("page-art");
    if (art && art.classList.contains("active")) {
      var masonry = document.querySelectorAll(".art-masonry");
      masonry.forEach(function (m) {
        m.style.transition = "filter 0.35s, saturate 0.35s";
        m.style.filter = "brightness(1.18) saturate(1.25)";
        setTimeout(function () { m.style.filter = ""; }, 450);
      });
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      toggleTheme();
      pulseArtMasonry();
    });
  }
  if (artHintToggle) {
    artHintToggle.addEventListener("click", function () {
      var art = document.getElementById("page-art");
      if (art && art.classList.contains("active")) {
        toggleTheme();
        pulseArtMasonry();
      } else {
        toggleTheme();
        showPage("page-art");
      }
    });
  }

  // init from storage
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    if (saved === "ryujin" || saved === "original" || saved === "emerald" || saved === "midnight") saved = "dark";
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyTheme("light");
    } else {
      applyTheme("light");
    }
  })();

  // ---------- Top nav sticky — always visible (bottom-nav removed) ----------
  var siteHeader = document.querySelector(".site-header");
  if (siteHeader) siteHeader.classList.remove("hidden");

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

  // ---------- Art lightbox (Option 1: hover overlay + detail) + prev/next ----------
  var artLightbox = document.getElementById("art-lightbox");
  var artLightboxImg = document.getElementById("art-lightbox-img");
  var artLightboxTitle = document.getElementById("art-lightbox-title");
  var artLightboxMeta = document.getElementById("art-lightbox-meta");
  var artLightboxStory = document.getElementById("art-lightbox-story");
  var artLightboxClose = document.querySelector(".art-lightbox-close");
  var artLightboxPrev = document.querySelector(".art-lightbox-prev");
  var artLightboxNext = document.querySelector(".art-lightbox-next");
  var artItems = document.querySelectorAll(".art-masonry-item, .brave-item");
  var homeGraphicsItems = document.querySelectorAll(".home-graphics-item");
  var currentGroupItems = [];
  var currentArtIndex = -1;
  var isHomeGalleryMode = false;

  function getHomeGalleryForItem(item) {
    var title = item.getAttribute("data-title") || "";
    if (title === "Team Building Tarpaulin") {
      return [
        "images/Integr8%20Graphic%20Design/Team%20Building%202026%20-%201.jpg",
        "images/Integr8%20Graphic%20Design/Team%20Building%202026%20-%202.jpg",
        "images/Integr8%20Graphic%20Design/Team%20Building%202026%20-%203.jpg"
      ];
    }
    if (title === "Valentine's Day Vouchers") {
      return [
        "images/Integr8%20Graphic%20Design/Valentines'%20Day%20Jollibee%20Voucher.jpg",
        "images/Integr8%20Graphic%20Design/Valentines'%20Day%20Movie%20Voucher.jpg"
      ];
    }
    if (title === "Gr8 ERP Software") {
      return [
        "images/Integr8%20Graphic%20Design/Gr8%20ERP%20for%20Cooperative2.jpg",
        "images/Integr8%20Graphic%20Design/Gr8%20ERP%20Software.jpg"
      ];
    }
    return null;
  }

  function getCurrentGroupForItem(item) {
    var group = item.closest ? item.closest(".art-group") : null;
    if (group) {
      var brave = group.querySelectorAll(".brave-item");
      if (brave.length) return brave;
      return group.querySelectorAll(".art-masonry-item");
    }
    return artItems;
  }

  function getArtData(index) {
    var item = currentGroupItems[index];
    if (!item) return null;
    var img = item.querySelector("img");
    if (!img) return null;
    return {
      src: img.src,
      alt: img.alt || "",
      title: item.getAttribute("data-title") || img.alt || "",
      meta: item.getAttribute("data-meta") || "",
      story: item.getAttribute("data-story") || ""
    };
  }

  function renderArtAt(index) {
    if (isHomeGalleryMode) {
      var src = currentGroupItems[index];
      if (!src || !artLightboxImg) return;
      currentArtIndex = index;
      artLightboxImg.src = src;
      artLightboxImg.alt = "";
      return;
    }
    var data = getArtData(index);
    if (!data || !artLightboxImg) return;
    currentArtIndex = index;
    artLightboxImg.src = data.src;
    artLightboxImg.alt = data.alt;
    if (artLightboxTitle) artLightboxTitle.textContent = data.title;
    if (artLightboxMeta) artLightboxMeta.textContent = data.meta;
    if (artLightboxStory) artLightboxStory.textContent = data.story;
  }

  function openArtLightbox(src, alt, title, meta, story, triggerItem) {
    if (!artLightbox || !artLightboxImg) return;
    if (triggerItem) {
      currentGroupItems = getCurrentGroupForItem(triggerItem);
    } else {
      currentGroupItems = artItems;
    }
    isHomeGalleryMode = false;
    if (artLightbox) {
      var details = artLightbox.querySelector(".art-lightbox-details");
      if (details) details.style.display = "";
    }
    // find index within current group
    var imgSrc = src;
    currentArtIndex = -1;
    for (var i = 0; i < currentGroupItems.length; i++) {
      var im = currentGroupItems[i].querySelector("img");
      if (im && im.src === imgSrc) { currentArtIndex = i; break; }
    }
    // fallback if not found
    if (currentArtIndex === -1) currentArtIndex = 0;
    artLightboxImg.src = src;
    artLightboxImg.alt = alt || "";
    if (artLightboxTitle) artLightboxTitle.textContent = title || alt || "";
    if (artLightboxMeta) artLightboxMeta.textContent = meta || "";
    if (artLightboxStory) artLightboxStory.textContent = story || "";
    artLightbox.classList.add("open");
    artLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function openHomeGalleryLightbox(triggerItem) {
    if (!artLightbox || !artLightboxImg || !triggerItem) return;
    var gallery = getHomeGalleryForItem(triggerItem);
    if (!gallery || !gallery.length) return;
    isHomeGalleryMode = true;
    currentGroupItems = gallery;
    currentArtIndex = 0;
    artLightboxImg.src = gallery[0];
    artLightboxImg.alt = triggerItem.getAttribute("data-title") || "";
    // hide captions for Home gallery
    var details = artLightbox.querySelector(".art-lightbox-details");
    if (details) details.style.display = "none";
    artLightbox.classList.add("open");
    artLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeArtLightbox() {
    if (!artLightbox || !artLightboxImg) return;
    artLightbox.classList.remove("open");
    artLightbox.setAttribute("aria-hidden", "true");
    artLightboxImg.src = "";
    document.body.style.overflow = "";
    currentArtIndex = -1;
    currentGroupItems = [];
    isHomeGalleryMode = false;
    var details = artLightbox.querySelector(".art-lightbox-details");
    if (details) details.style.display = "";
  }

  function showPrevArt(e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    if (!currentGroupItems.length) return;
    var next = currentArtIndex - 1;
    if (next < 0) next = currentGroupItems.length - 1;
    renderArtAt(next);
  }

  function showNextArt(e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    if (!currentGroupItems.length) return;
    var next = currentArtIndex + 1;
    if (next >= currentGroupItems.length) next = 0;
    renderArtAt(next);
  }

  document.addEventListener("click", function (e) {
    // ignore nav/close clicks
    if (e.target.closest && e.target.closest(".art-lightbox-nav")) return;
    var target = e.target;
    var homeItem = target.closest ? target.closest(".home-graphics-item") : null;
    if (homeItem) {
      openHomeGalleryLightbox(homeItem);
      return;
    }
    var item = target.closest ? target.closest(".art-masonry-item, .brave-item") : null;
    if (item) {
      var img = item.querySelector("img");
      if (!img) return;
      var title = item.getAttribute("data-title") || img.alt || "";
      var meta = item.getAttribute("data-meta") || "";
      var story = item.getAttribute("data-story") || "";
      openArtLightbox(img.src, img.alt, title, meta, story, item);
    }
  });

  if (artLightboxPrev) artLightboxPrev.addEventListener("click", showPrevArt);
  if (artLightboxNext) artLightboxNext.addEventListener("click", showNextArt);

  if (artLightbox) {
    artLightbox.addEventListener("click", function (e) {
      if (e.target === artLightbox || e.target === artLightboxClose || e.target.closest(".art-lightbox-close")) {
        closeArtLightbox();
      }
    });
  }

  if (artLightboxClose) {
    artLightboxClose.addEventListener("click", closeArtLightbox);
  }

  document.addEventListener("keydown", function (e) {
    if (!artLightbox || !artLightbox.classList.contains("open")) return;
    if (e.key === "Escape") {
      closeArtLightbox();
    } else if (e.key === "ArrowLeft") {
      showPrevArt();
    } else if (e.key === "ArrowRight") {
      showNextArt();
    }
  });

  // ---------- About draggable slider (free glide, no snap - smooth aggressive) ----------
  (function () {
    var viewport = document.querySelector("#about-drag .about-drag-viewport");
    if (!viewport) return;
    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;
    var moved = false;
    var velocity = 0;
    var lastX = 0;
    var lastTime = 0;
    var rafId = null;
    var friction = 0.92;
    var minVelocity = 0.15;

    function cancelMomentum() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    function glide() {
      velocity *= friction;
      if (Math.abs(velocity) < minVelocity) {
        rafId = null;
        return;
      }
      var next = viewport.scrollLeft - velocity * 14;
      var max = viewport.scrollWidth - viewport.clientWidth;
      if (next < 0) { next = 0; velocity = 0; }
      else if (next > max) { next = max; velocity = 0; }
      viewport.scrollLeft = next;
      rafId = requestAnimationFrame(glide);
    }

    viewport.addEventListener("mousedown", function (e) {
      isDown = true;
      moved = false;
      cancelMomentum();
      viewport.classList.add("active");
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
      lastX = e.pageX;
      lastTime = Date.now();
      velocity = 0;
    });

    viewport.addEventListener("mouseleave", function () {
      if (!isDown) return;
      isDown = false;
      viewport.classList.remove("active");
      if (Math.abs(velocity) > minVelocity) rafId = requestAnimationFrame(glide);
    });

    viewport.addEventListener("mouseup", function () {
      if (!isDown && !moved) return;
      isDown = false;
      viewport.classList.remove("active");
      if (Math.abs(velocity) > minVelocity) rafId = requestAnimationFrame(glide);
      setTimeout(function () { moved = false; }, 80);
    });

    viewport.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - viewport.offsetLeft;
      var walk = (x - startX) * 1.08;
      if (Math.abs(walk) > 3) moved = true;
      viewport.scrollLeft = scrollLeft - walk;
      var now = Date.now();
      var dt = now - lastTime || 16;
      var dx = e.pageX - lastX;
      velocity = dx / dt;
      lastX = e.pageX;
      lastTime = now;
    });

    viewport.addEventListener("touchstart", function (e) {
      cancelMomentum();
      startX = e.touches[0].pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
      lastX = e.touches[0].pageX;
      lastTime = Date.now();
      velocity = 0;
    }, { passive: true });

    viewport.addEventListener("touchmove", function (e) {
      var x = e.touches[0].pageX - viewport.offsetLeft;
      var walk = (x - startX) * 1.08;
      viewport.scrollLeft = scrollLeft - walk;
      var now = Date.now();
      var dt = now - lastTime || 16;
      velocity = (e.touches[0].pageX - lastX) / dt;
      lastX = e.touches[0].pageX;
      lastTime = now;
    }, { passive: true });

    viewport.addEventListener("touchend", function () {
      if (Math.abs(velocity) > minVelocity) rafId = requestAnimationFrame(glide);
    });

    viewport.addEventListener("dragstart", function (e) { e.preventDefault(); });
    viewport.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  })();
})();