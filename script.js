const CONTACT_EMAIL = "megharajuvakiti124@gmail.com";

const profileShortcutToggle = document.querySelector(".profile-shortcuts-toggle");
const profileShortcutPanel = document.querySelector(".profile-shortcuts-panel");
if (profileShortcutToggle && profileShortcutPanel) {
  const closeProfileShortcuts = () => {
    profileShortcutPanel.hidden = true;
    profileShortcutToggle.setAttribute("aria-expanded", "false");
    profileShortcutToggle.setAttribute("aria-label", "Open profile links");
  };
  profileShortcutToggle.addEventListener("click", () => {
    const isOpening = profileShortcutPanel.hidden;
    profileShortcutPanel.hidden = !isOpening;
    profileShortcutToggle.setAttribute("aria-expanded", String(isOpening));
    profileShortcutToggle.setAttribute("aria-label", isOpening ? "Close profile links" : "Open profile links");
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profile-shortcuts-dock")) closeProfileShortcuts();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !profileShortcutPanel.hidden) {
      closeProfileShortcuts();
      profileShortcutToggle.focus();
    }
  });
}

// Play the Skills solar-system zoom when the overview is shown, including when returning from a skill detail.
if (document.body.classList.contains("skills")) {
  const solarGraphic = document.querySelector(".solar-orbit svg");
  const skillZoomAnimations = new WeakMap();
  const zoomSkillArtwork = (element, fromScale, duration) => {
    if (!element) return;
    skillZoomAnimations.get(element)?.cancel();
    const animation = element.animate(
      [{ transform: `scale(${fromScale})` }, { transform: "scale(1)" }],
      { duration, easing: "cubic-bezier(.18,.72,.22,1)", fill: "none" }
    );
    skillZoomAnimations.set(element, animation);
    animation.onfinish = () => {
      if (skillZoomAnimations.get(element) === animation) {
        skillZoomAnimations.delete(element);
        animation.cancel();
      }
    };
  };
  const zoomPlanetArtwork = (element, fromScale, duration) => {
    if (!element) return;
    skillZoomAnimations.get(element)?.cancel();
    // The individual scale property composes with the planet's CSS spin transform.
    const animation = element.animate(
      [{ scale: String(fromScale) }, { scale: "1" }],
      { duration, easing: "cubic-bezier(.18,.72,.22,1)", fill: "none" }
    );
    skillZoomAnimations.set(element, animation);
    animation.onfinish = () => {
      if (skillZoomAnimations.get(element) === animation) {
        skillZoomAnimations.delete(element);
        animation.cancel();
      }
    };
  };
  const playSkillPlanetZoom = () => {
    const activeDetail = document.querySelector(".skill-detail:target");
    const planetArtwork = activeDetail?.querySelector(".planet img");
    zoomPlanetArtwork(planetArtwork, .36, 1900);
  };
  const playSolarZoom = () => {
    zoomSkillArtwork(solarGraphic, .34, 2200);
  };
  if (!window.location.hash || window.location.hash === "#skills-main") {
    window.requestAnimationFrame(playSolarZoom);
  } else {
    window.requestAnimationFrame(playSkillPlanetZoom);
  }
  window.addEventListener("hashchange", () => {
    if (!window.location.hash || window.location.hash === "#skills-main") playSolarZoom();
    else playSkillPlanetZoom();
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = document.querySelector("#form-note");
    if (!CONTACT_EMAIL) {
      note.textContent = "Add your contact email in script.js to enable sending.";
      return;
    }
    const form = new FormData(contactForm);
    const composeUrl = new URL("https://mail.google.com/mail/");
    composeUrl.searchParams.set("view", "cm");
    composeUrl.searchParams.set("fs", "1");
    composeUrl.searchParams.set("to", CONTACT_EMAIL);
    composeUrl.searchParams.set("su", `Portfolio message from ${form.get("name")}`);
    composeUrl.searchParams.set("body", `${form.get("message")}\n\nReply to: ${form.get("email")}`);
    window.location.href = composeUrl.toString();
  });
}

const entranceDirections = ["left", "right", "up", "down"];
const entranceOffsets = {
  left: "translateX(-.8em)",
  right: "translateX(.8em)",
  up: "translateY(-.65em)",
  down: "translateY(.65em)"
};
const activeTextAnimations = new WeakMap();
const animateDirectionalText = (elements, duration, stagger) => {
  elements.forEach((element, index) => {
    const previousAnimation = activeTextAnimations.get(element);
    if (previousAnimation) previousAnimation.cancel();
    const startingTransform = entranceOffsets[element.dataset.entryDirection] || entranceOffsets.left;
    const animation = element.animate([
      { opacity: 0, transform: startingTransform },
      { opacity: 1, transform: "translate(0, 0)" }
    ], {
      duration,
      delay: index * stagger,
      easing: "cubic-bezier(.2,.7,.25,1)",
      fill: "both"
    });
    activeTextAnimations.set(element, animation);
    animation.onfinish = () => {
      animation.cancel();
      if (activeTextAnimations.get(element) === animation) activeTextAnimations.delete(element);
    };
  });
};

/* Reveal the head artwork and Explore control together when either is revisited. */
if (document.body.classList.contains("about")) {
  const exploreScreen = document.querySelector("#about-top");
  const exploreFace = document.querySelector(".explore-face");
  const exploreCta = document.querySelector(".explore-cta");
  const isExploreView = () => !window.location.hash || window.location.hash === "#about-top";
  let exploreFaceLoaded = exploreFace?.dataset.loaded === "true";

  const revealLoadedExplore = () => {
    if (!exploreScreen || !exploreFace || !exploreCta || !isExploreView()) return;
    requestAnimationFrame(() => {
      if (getComputedStyle(exploreScreen).display === "none") return;

      exploreFace.getAnimations().forEach((animation) => animation.cancel());
      exploreCta.getAnimations().forEach((animation) => animation.cancel());
      exploreFace.style.clipPath = "inset(0 50% 0 50%)";
      exploreCta.style.opacity = "0";
      exploreCta.style.transform = "translate(-50%, -50%) translateY(14px)";
      exploreScreen.classList.add("is-ready");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        exploreFace.style.clipPath = "inset(0)";
        exploreCta.style.opacity = "1";
        exploreCta.style.transform = "translate(-50%, -50%)";
        return;
      }

      const timing = {
        duration: 900,
        easing: "cubic-bezier(.2,.72,.25,1)",
        fill: "forwards"
      };
      const faceReveal = exploreFace.animate([
        { clipPath: "inset(0 50% 0 50%)" },
        { clipPath: "inset(0 0 0 0)" }
      ], timing);
      exploreCta.animate([
        { opacity: 0, transform: "translate(-50%, -50%) translateY(14px)" },
        { opacity: 1, transform: "translate(-50%, -50%)" }
      ], timing);
      faceReveal.onfinish = () => { exploreFace.style.clipPath = "inset(0)"; };
    });
  };

  if (exploreFace) {
    exploreFace.addEventListener("load", () => {
      exploreFaceLoaded = true;
      exploreFace.dataset.loaded = "true";
      revealLoadedExplore();
    }, { once: true });
    exploreFace.addEventListener("error", () => {
      exploreFaceLoaded = true;
      revealLoadedExplore();
    }, { once: true });
    try {
      if (exploreFace.contentDocument?.readyState === "complete") {
        exploreFaceLoaded = true;
        exploreFace.dataset.loaded = "true";
        revealLoadedExplore();
      }
    } catch {
      // The iframe load event is the fallback for cross-origin artwork.
    }
  }

  window.setTimeout(() => {
    if (!exploreFaceLoaded) {
      exploreFaceLoaded = true;
      revealLoadedExplore();
    }
  }, 3000);

  const revealExploreFace = () => {
    if (exploreFaceLoaded) revealLoadedExplore();
  };
  revealExploreFace();
  window.addEventListener("hashchange", revealExploreFace);

  const exploreLink = document.querySelector("#about-top h1 a");
  exploreLink?.setAttribute("aria-label", "Explore About categories");

  const horizontalSliceClips = [
    "inset(0 0 75% 0)",
    "inset(25% 0 50% 0)",
    "inset(50% 0 25% 0)",
    "inset(75% 0 0 0)"
  ];
  document.querySelectorAll(".category-card").forEach((card) => {
    const filledArtwork = card.querySelector(".category-art-filled");
    const artWrap = card.querySelector(".category-art-wrap");
    const label = card.querySelector(".category-label");
    if (!filledArtwork || !artWrap || !label) return;

    const isHandCard = card.classList.contains("category-card--hand");
    let active = false;
    let sliceLayer;
    let sliceAnimations = [];
    let filledAnimation;
    let labelAnimation;
    let sliceCleanupTimer;

    const startCardReveal = () => {
      if (active) return;
      active = true;
      card.classList.add("is-revealed");


      sliceLayer = document.createElement("span");
      sliceLayer.className = "category-slice-layer";
      sliceLayer.setAttribute("aria-hidden", "true");
      artWrap.append(sliceLayer);

      const sliceExitDirections = [1, -1, 1, -1];
      sliceAnimations = horizontalSliceClips.map((_, index) => {
        const band = document.createElement("span");
        band.className = "category-slice-band";
        const slice = filledArtwork.cloneNode(false);
        slice.className = "category-art category-slice";
        slice.removeAttribute("id");
        slice.setAttribute("alt", "");
        slice.setAttribute("aria-hidden", "true");
        band.append(slice);
        sliceLayer.append(band);

        const animation = slice.animate([
          { transform: "translateX(0)" },
          { transform: `translateX(${sliceExitDirections[index] * 100}%)` }
        ], {
          duration: isHandCard ? 480 : 720,
          delay: index * (isHandCard ? 55 : 110),
          easing: "cubic-bezier(.22,.7,.2,1)",
          fill: "forwards"
        });
        return animation;
      });

      filledAnimation = filledArtwork.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], { duration: 80, easing: "linear", fill: "forwards" });

      labelAnimation = label.animate([
        { opacity: 0, transform: "translate(-50%, -50%) translateY(12px) scale(.94)" },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1)" }
      ], { duration: 360, delay: isHandCard ? 300 : 620, easing: "cubic-bezier(.2,.7,.25,1)", fill: "forwards" });

      sliceCleanupTimer = window.setTimeout(() => sliceLayer?.remove(), isHandCard ? 720 : 1400);
    };

    const endCardReveal = () => {
      if (!active || card.classList.contains("is-pinned-revealed")) return;
      active = false;
      window.clearTimeout(sliceCleanupTimer);
      sliceAnimations.forEach((animation) => animation.cancel());
      filledAnimation?.cancel();
      labelAnimation?.cancel();
      sliceLayer?.remove();
      sliceLayer = null;
      card.classList.remove("is-revealed");
    };

    card.addEventListener("click", (event) => {
      if (!card.classList.contains("is-pinned-revealed")) {
        event.preventDefault();
        card.classList.add("is-pinned-revealed");
        const title = label.textContent.trim();
        const destination = card.classList.contains("category-card--love")
          ? "What I Love artwork"
          : `${title} page`;
        card.setAttribute("aria-label", `${title} revealed. Click again to open ${destination}`);
        startCardReveal();
      }
    });
    card.addEventListener("pointerleave", endCardReveal);
    card.addEventListener("blur", endCardReveal);
  });
}

/* Cursor outline effect is limited to Home page headings. */
if (document.body.classList.contains("home")) {
  const hoverDirections = ["exit-left", "exit-right", "exit-up", "exit-down"];
  const hoverResetTimers = new WeakMap();
  const addHoverOutline = (element) => {
    element.addEventListener("pointerenter", () => {
      window.clearTimeout(hoverResetTimers.get(element));
      hoverResetTimers.delete(element);
      const direction = hoverDirections[Math.floor(Math.random() * hoverDirections.length)];
      element.classList.remove(...hoverDirections);
      element.classList.add("is-active", direction);
    });
    element.addEventListener("pointerleave", () => {
      const resetTimer = window.setTimeout(() => {
        element.classList.remove("is-active", ...hoverDirections);
        hoverResetTimers.delete(element);
      }, 1500);
      hoverResetTimers.set(element, resetTimer);
    });
  };

  document.querySelectorAll(".home-slide h1").forEach((heading) => {
    const label = heading.textContent;
    heading.setAttribute("aria-label", label);
    const parts = [];
    let characterIndex = 0;
    for (const character of Array.from(label)) {
      if (/\s/.test(character)) {
        parts.push(document.createTextNode(character));
        continue;
      }
      const span = document.createElement("span");
      span.className = "home-heading-char";
      span.dataset.char = character;
      span.dataset.entryDirection = entranceDirections[characterIndex % entranceDirections.length];
      span.setAttribute("aria-hidden", "true");
      const glyph = document.createElement("span");
      glyph.className = "home-heading-glyph";
      glyph.textContent = character;
      span.append(glyph);
      span.style.setProperty("--heading-char-index", String(characterIndex));
      parts.push(span);
      characterIndex += 1;
    }
    heading.replaceChildren(...parts);

    const characters = [...heading.querySelectorAll(".home-heading-char")];
    characters.forEach(addHoverOutline);
  });

  document.querySelectorAll(".home-slide p").forEach((subtitle) => {
    const label = subtitle.textContent;
    subtitle.setAttribute("aria-label", label);
    let wordIndex = 0;
    const parts = label.split(/(\s+)/).map((part) => {
      if (/^\s+$/.test(part)) return document.createTextNode(part);
      const word = document.createElement("span");
      word.className = "home-heading-word";
      word.dataset.word = part;
      word.dataset.entryDirection = entranceDirections[wordIndex % entranceDirections.length];
      wordIndex += 1;
      word.setAttribute("aria-hidden", "true");
      const glyph = document.createElement("span");
      glyph.className = "home-heading-word-glyph";
      glyph.textContent = part;
      word.append(glyph);
      addHoverOutline(word);
      return word;
    });
    subtitle.replaceChildren(...parts);
  });

  const main = document.querySelector("#main-content");
  const slides = [...document.querySelectorAll(".home-slide")];
  if (main && slides.length) {
    document.body.classList.add("home-dot-navigation-enabled");
    let currentSlide = slides.find((slide) => slide.id === window.location.hash.slice(1)) || slides[0];
    currentSlide.classList.add("is-current");

    const setActiveDot = (slide) => {
      const activeIndex = slides.indexOf(slide);
      document.querySelectorAll(".slide-dots").forEach((dots) => {
        [...dots.querySelectorAll("a")].forEach((dot, index) => {
          dot.classList.toggle("active", index === activeIndex);
          if (index === activeIndex) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
      });
    };
    const animateSlideText = (slide) => {
      animateDirectionalText([...slide.querySelectorAll("h1 .home-heading-char")], 620, 24);
      animateDirectionalText([...slide.querySelectorAll("p .home-heading-word")], 560, 38);
    };
    setActiveDot(currentSlide);
    animateSlideText(currentSlide);

    const navigateTo = (nextSlide, addHistory = true) => {
      if (!nextSlide || nextSlide === currentSlide) return;

      slides.forEach((slide) => {
        slide.classList.remove("is-current");
      });

      nextSlide.classList.add("is-current");
      currentSlide = nextSlide;
      animateSlideText(currentSlide);
      setActiveDot(currentSlide);

      if (addHistory && window.location.hash !== `#${nextSlide.id}`) {
        window.history.pushState(null, "", `#${nextSlide.id}`);
      }

    };

    main.addEventListener("click", (event) => {
      const dot = event.target.closest(".slide-dots a[href^='#slide-']");
      if (!dot) return;
      const nextSlide = document.getElementById(dot.hash.slice(1));
      if (!nextSlide) return;
      event.preventDefault();
      navigateTo(nextSlide);
    });

    window.addEventListener("popstate", () => {
      navigateTo(slides.find((slide) => slide.id === window.location.hash.slice(1)) || slides[0], false);
    });
  }
}

/* Give each Skills button its own orbiting-planet callout and orbit speed. */
if (document.body.classList.contains("skills")) {
  const solarSystem = document.querySelector(".solar-orbit svg");
  const solarStage = solarSystem?.closest(".solar-orbit");
  const skillButtons = document.querySelectorAll(".skill-chips a[data-solar-body]");
  if (solarSystem && solarStage && skillButtons.length) {
    const orbitPeriods = {
      mercury: 8,
      venus: 12.5,
      earth: 16,
      mars: 20,
      jupiter: 26,
      saturn: 32,
      uranus: 42,
      neptune: 52
    };
    const orbitingBodies = [...solarSystem.querySelectorAll("[data-orbit-rx]")].map((element) => ({
      element,
      name: element.dataset.orbitBody,
      radiusX: Number(element.dataset.orbitRx),
      radiusY: Number(element.dataset.orbitRy),
      angle: Number(element.dataset.orbitPhase) * Math.PI * 2,
      angularVelocity: (Math.PI * 2) / orbitPeriods[element.dataset.orbitBody],
      baseTransform: element.dataset.orbitBaseTransform
    }));
    const callout = document.createElement("div");
    callout.className = "planet-callout";
    callout.setAttribute("aria-hidden", "true");
    callout.hidden = true;
    callout.innerHTML = "<span></span>";
    solarStage.append(callout);

    let pausedBody = null;
    let highlightedBody = null;
    let activeButton = null;
    const activeButtons = new Set();

    const drawOrbitingBody = (body) => {
      const x = body.radiusX * (1 - Math.cos(body.angle));
      const y = body.radiusY * Math.sin(body.angle);
      body.element.setAttribute("transform", `translate(${x} ${y}) ${body.baseTransform}`);
    };
    const updateCalloutPosition = () => {
      if (!highlightedBody || callout.hidden) return;
      const bodyBounds = highlightedBody.getBoundingClientRect();
      const stageBounds = solarStage.getBoundingClientRect();
      callout.style.left = `${bodyBounds.left + bodyBounds.width / 2 - stageBounds.left}px`;
      callout.style.top = `${bodyBounds.top - stageBounds.top}px`;
    };
    orbitingBodies.forEach(drawOrbitingBody);

    const highlightButton = (button) => {
      if (highlightedBody) highlightedBody.classList.remove("is-highlighted");
      activeButton = button;
      const name = button.dataset.solarBody;
      highlightedBody = solarSystem.querySelector(`[data-orbit-body="${name}"]`);
      highlightedBody?.classList.add("is-highlighted");
      pausedBody = name === "sun" ? null : name;
      callout.querySelector("span").textContent = button.textContent.trim();
      callout.hidden = !highlightedBody;
      updateCalloutPosition();
    };
    const activateButton = (button) => {
      activeButtons.delete(button);
      activeButtons.add(button);
      highlightButton(button);
    };
    const deactivateButton = (button) => {
      activeButtons.delete(button);
      if (activeButton !== button) return;
      const nextActive = [...activeButtons].at(-1);
      if (nextActive) {
        highlightButton(nextActive);
        return;
      }
      highlightedBody?.classList.remove("is-highlighted");
      highlightedBody = null;
      activeButton = null;
      pausedBody = null;
      callout.hidden = true;
    };

    skillButtons.forEach((button) => {
      button.addEventListener("pointerenter", () => activateButton(button));
      button.addEventListener("pointerleave", () => deactivateButton(button));
      button.addEventListener("focus", () => activateButton(button));
      button.addEventListener("blur", () => deactivateButton(button));
    });

    let previousFrame = performance.now();
    const movePlanets = (now) => {
      const elapsed = Math.min((now - previousFrame) / 1000, .1);
      previousFrame = now;
      for (const body of orbitingBodies) {
        if (body.name !== pausedBody) {
          body.angle = (body.angle + elapsed * body.angularVelocity) % (Math.PI * 2);
          drawOrbitingBody(body);
        }
      }
      updateCalloutPosition();
      window.requestAnimationFrame(movePlanets);
    };
    window.requestAnimationFrame(movePlanets);
  }
}
