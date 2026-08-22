/* ==========================================================================
   ATAD DIGITAL - TWO-WAY SLOW CINEMATIC ASSEMBLY/DISASSEMBLY ENGINE
   GSAP ScrollTrigger (Full Bi-directional Scrub) + Lenis Smooth Scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DYNAMIC MOUSE RADIATION SPOTLIGHT & SHADER TRACKING
  const spotlight = document.getElementById('mouseSpotlight');
  const cursorLaser = document.getElementById('cursorLaser');
  const glassCards = document.querySelectorAll('.glass-element');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentSpotX = mouseX;
  let currentSpotY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorLaser) {
      cursorLaser.style.left = `${mouseX}px`;
      cursorLaser.style.top = `${mouseY}px`;
    }

    glassCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  function animateSpotlight() {
    currentSpotX += (mouseX - currentSpotX) * 0.12;
    currentSpotY += (mouseY - currentSpotY) * 0.12;

    if (spotlight) {
      spotlight.style.left = `${currentSpotX}px`;
      spotlight.style.top = `${currentSpotY}px`;
    }

    requestAnimationFrame(animateSpotlight);
  }
  animateSpotlight();


  // 2. BACKGROUND MATRIX DUST PARTICLES WITH CURIOUS AI BEHAVIOR
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let lastMouseMove = Date.now();
    let isCuriousGathering = false;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const timeSinceLast = now - lastMouseMove;

      // When moving after being stationary/curious: disperse smoothly across the full screen
      if (isCuriousGathering || timeSinceLast > 3000) {
        particles.forEach(p => {
          const angle = Math.atan2(p.y - mouseY, p.x - mouseX) + (Math.random() - 0.5) * 1.4;
          const fleeSpeed = Math.random() * 3.2 + 1.8;
          p.vx = Math.cos(angle) * fleeSpeed;
          p.vy = Math.sin(angle) * fleeSpeed;
        });
      }

      lastMouseMove = now;
      isCuriousGathering = false;
    });

    class MatrixParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2.8 + 1.8; // Enlarged star particles
        this.color = Math.random() > 0.5 ? '#00f0ff' : (Math.random() > 0.3 ? '#b026ff' : '#ffffff');
        this.baseAlpha = Math.random() * 0.45 + 0.25;
        this.alpha = this.baseAlpha;
      }
      update() {
        // Friction to smoothly return high disperse speeds to calm ambient floating
        this.vx *= 0.98;
        this.vy *= 0.98;

        if (isCuriousGathering) {
          // 1. Slow, Gentle Directional Migration Towards Mouse Position
          const toMouseX = mouseX - this.x;
          const toMouseY = mouseY - this.y;
          const dist = Math.max(Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY), 1);

          if (dist > 30) {
            this.vx += (toMouseX / dist) * 0.035;
            this.vy += (toMouseY / dist) * 0.035;
          }

          // Keep drift speed gentle and steady
          const curSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (curSpeed > 1.3) {
            this.vx = (this.vx / curSpeed) * 1.3;
            this.vy = (this.vy / curSpeed) * 1.3;
          }

          this.alpha = Math.min(this.baseAlpha + 0.25, 0.85);
        } else {
          // Normal Ambient Floating Across Full Screen
          const curSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (curSpeed < 0.2) {
            this.vx += (Math.random() - 0.5) * 0.1;
            this.vy += (Math.random() - 0.5) * 0.1;
          }
          this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Continuous Screen Wrapping to Keep Full Screen Evenly Populated
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.radius * (isCuriousGathering ? 3.5 : 2.5);
        ctx.fill();
        ctx.restore();
      }
    }

    const particleCount = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new MatrixParticle());
    }

    function renderCanvas() {
      // Check 3-second stillness timer
      if (Date.now() - lastMouseMove > 3000) {
        isCuriousGathering = true;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw interactive constellation connections
      const maxConnectDist = isCuriousGathering ? 130 : 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxConnectDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isCuriousGathering ? '#00f0ff' : 'rgba(0, 240, 255, 0.8)';
            ctx.globalAlpha = (1 - dist / maxConnectDist) * (isCuriousGathering ? 0.25 : 0.12);
            ctx.lineWidth = isCuriousGathering ? 0.8 : 0.6;
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }


  // 3. LENIS SMOOTH SCROLL (Enhanced damping for luxurious slow, cinematic control)
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  // 4. ANTI-GRAVITY ELASTIC RUBBER SPACE-WARP STRETCH ENGINE
  const rubberPill = document.getElementById('rubberPill');
  const stepper = document.getElementById('stageStepper');
  const indicators = document.querySelectorAll('.step-indicator');
  let currentActiveIndex = 0;

  function moveRubberPill(targetIndex, animate = true) {
    if (!rubberPill || !stepper || !indicators[targetIndex]) return;

    const stepperRect = stepper.getBoundingClientRect();
    const targetEl = indicators[targetIndex];
    const targetRect = targetEl.getBoundingClientRect();

    const targetLeft = targetRect.left - stepperRect.left;
    const targetWidth = targetRect.width;

    const currentLeft = parseFloat(rubberPill.dataset.curLeft != null ? rubberPill.dataset.curLeft : targetLeft);
    const currentWidth = parseFloat(rubberPill.dataset.curWidth != null ? rubberPill.dataset.curWidth : targetWidth);

    rubberPill.dataset.curLeft = targetLeft;
    rubberPill.dataset.curWidth = targetWidth;

    if (!animate || (Math.abs(targetLeft - currentLeft) < 1 && Math.abs(targetWidth - currentWidth) < 1)) {
      gsap.set(rubberPill, {
        left: targetLeft,
        width: targetWidth,
        scaleY: 1
      });
      return;
    }

    gsap.killTweensOf(rubberPill);
    const rubberTl = gsap.timeline();

    if (targetLeft > currentLeft) {
      // Moving Forward:
      // 1. Rubber stretches towards destination (left stays, width expands to cover both)
      const fullSpan = (targetLeft + targetWidth) - currentLeft;
      rubberTl
        .to(rubberPill, {
          width: fullSpan,
          scaleY: 0.78, // Thinning rubber under tension
          duration: 0.18,
          ease: 'power2.in'
        }, 0)
        // 2. Tail snaps forward to destination and rubber contracts with elastic spring
        .to(rubberPill, {
          left: targetLeft,
          width: targetWidth,
          scaleY: 1,
          duration: 0.52,
          ease: 'elastic.out(1.15, 0.42)'
        }, 0.12);
    } else {
      // Moving Backward:
      // 1. Rubber stretches backwards (left moves back to targetLeft, width expands)
      const fullSpan = (currentLeft + currentWidth) - targetLeft;
      rubberTl
        .to(rubberPill, {
          left: targetLeft,
          width: fullSpan,
          scaleY: 0.78, // Thinning rubber under tension
          duration: 0.18,
          ease: 'power2.in'
        }, 0)
        // 2. Head snaps to targetWidth
        .to(rubberPill, {
          width: targetWidth,
          scaleY: 1,
          duration: 0.52,
          ease: 'elastic.out(1.15, 0.42)'
        }, 0.12);
    }
  }

  function setActiveIndicator(index) {
    if (currentActiveIndex === index && indicators[index].classList.contains('active')) return;
    currentActiveIndex = index;
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
    moveRubberPill(index, true);
  }

  // Handle manual clicks with instant feedback + smooth scroll
  indicators.forEach((ind, i) => {
    ind.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveIndicator(i);
      const targetId = ind.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement && lenis) {
        lenis.scrollTo(targetElement, { duration: 1.6 });
      }
    });
  });

  // Init position accurately on load
  function initRubberPosition() {
    const activeEl = document.querySelector('.step-indicator.active') || indicators[0];
    if (activeEl) {
      const idx = parseInt(activeEl.getAttribute('data-index') || '0', 10);
      moveRubberPill(idx, false);
    }
  }

  window.addEventListener('resize', initRubberPosition);
  initRubberPosition();
  window.addEventListener('load', initRubberPosition);
  setTimeout(initRubberPosition, 100);


  // =========================================================================
  // 5. TWO-WAY SLOW CINEMATIC ASSEMBLY & DISASSEMBLY TIMELINES (BI-DIRECTIONAL)
  // Each section now builds up from depth when entering AND dismantles when leaving,
  // in BOTH scroll directions (Downwards AND Upwards)!
  // =========================================================================

  // --- SECTION 1: Launchpad ---
  const sec1Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene1',
      start: 'top top',
      end: 'bottom top',
      scrub: 2.2, // Ultra-slow and visible
      onEnter: () => setActiveIndicator(0),
      onEnterBack: () => setActiveIndicator(0),
    }
  });

  sec1Tl
    .to('#scene1 .capsule', {
      scale: 0.1,
      opacity: 0,
      y: -140,
      rotateZ: 18,
      stagger: 0.08,
      ease: 'power2.inOut'
    }, 0)
    .to('#scene1 .master-hero-title', {
      scale: 0.75,
      opacity: 0,
      y: -100,
      ease: 'power2.inOut'
    }, 0)
    .to('#scene1 .master-hero-desc, #scene1 .hero-chip, #scene1 .scroll-down-hint', {
      opacity: 0,
      y: -60,
      ease: 'power2.inOut'
    }, 0.1);


  // --- SECTION 2: Flutter Lab (Two-way Assembly & Disassembly) ---
  const sec2Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene2',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2.2,
      onEnter: () => setActiveIndicator(1),
      onEnterBack: () => setActiveIndicator(1),
    }
  });

  // Phase 1 (0% -> 40%): Build & Assemble into place
  sec2Tl
    .fromTo('#scene2 .layer-screen', 
      { scale: 0.15, rotationY: 65, rotationX: -25, opacity: 0, z: -600, y: 120 },
      { scale: 1, rotationY: 0, rotationX: 0, opacity: 1, z: 0, y: 0, ease: 'power2.out', duration: 0.4 },
      0
    )
    .fromTo('#scene2 .chip-node', 
      { scale: 0, opacity: 0, y: 80 },
      { scale: 1, opacity: 1, y: 0, stagger: 0.06, ease: 'back.out(1.8)', duration: 0.35 },
      0.1
    )
    .fromTo('#scene2 .scene-narrative', 
      { x: -140, opacity: 0 },
      { x: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
      0
    )
    .fromTo('#scene2 .spec-tile', 
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.06, ease: 'power2.out', duration: 0.35 },
      0.1
    )
    // Phase 2 (40% -> 60%): Rest in view (Full glory)
    .to({}, { duration: 0.2 })
    // Phase 3 (60% -> 100%): Disassemble out into the top
    .to('#scene2 .layer-screen', 
      { scale: 0.2, rotationY: -45, opacity: 0, z: -400, y: -140, ease: 'power2.in', duration: 0.4 },
      0.6
    )
    .to('#scene2 .chip-node', 
      { scale: 0, opacity: 0, y: -60, stagger: 0.05, ease: 'power2.in', duration: 0.3 },
      0.65
    )
    .to('#scene2 .scene-narrative, #scene2 .spec-tile', 
      { x: 100, opacity: 0, ease: 'power2.in', duration: 0.4 },
      0.6
    );


  // --- SECTION 3: E-Commerce Store (Two-way Assembly & Disassembly) ---
  const sec3Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene3',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2.2,
      onEnter: () => setActiveIndicator(2),
      onEnterBack: () => setActiveIndicator(2),
    }
  });

  // Phase 1 (0% -> 40%): Build & Assemble
  sec3Tl
    .fromTo('#scene3 .ecom-cart-visual',
      { scale: 0.15, rotationY: -60, rotationX: 25, opacity: 0, z: -500, y: 120 },
      { scale: 1, rotationY: 0, rotationX: 0, opacity: 1, z: 0, y: 0, ease: 'power2.out', duration: 0.4 },
      0
    )
    .fromTo('#scene3 .card-mada',
      { x: 160, y: -100, scale: 0.3, opacity: 0 },
      { x: 0, y: 0, scale: 1, opacity: 1, ease: 'back.out(1.6)', duration: 0.35 },
      0.1
    )
    .fromTo('#scene3 .card-stats',
      { x: -160, y: 100, scale: 0.3, opacity: 0 },
      { x: 0, y: 0, scale: 1, opacity: 1, ease: 'back.out(1.6)', duration: 0.35 },
      0.15
    )
    .fromTo('#scene3 .scene-narrative',
      { x: 140, opacity: 0 },
      { x: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
      0
    )
    .fromTo('#scene3 .spec-tile',
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.06, ease: 'power2.out', duration: 0.35 },
      0.1
    )
    // Phase 2 (40% -> 60%): Rest in view
    .to({}, { duration: 0.2 })
    // Phase 3 (60% -> 100%): Disassemble out into the top
    .to('#scene3 .ecom-cart-visual',
      { scale: 0.2, rotationY: 45, opacity: 0, z: -400, y: -140, ease: 'power2.in', duration: 0.4 },
      0.6
    )
    .to('#scene3 .card-mada, #scene3 .card-stats',
      { scale: 0, opacity: 0, y: -60, stagger: 0.05, ease: 'power2.in', duration: 0.3 },
      0.65
    )
    .to('#scene3 .scene-narrative, #scene3 .spec-tile',
      { x: -100, opacity: 0, ease: 'power2.in', duration: 0.4 },
      0.6
    );


  // --- SECTION 4: Web Matrix (Two-way Assembly & Disassembly) ---
  const sec4Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene4',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2.2,
      onEnter: () => setActiveIndicator(3),
      onEnterBack: () => setActiveIndicator(3),
    }
  });

  // Phase 1 (0% -> 40%): Build & Assemble
  sec4Tl
    .fromTo('#scene4 .scene-header-center',
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out', duration: 0.35 },
      0
    )
    .fromTo('#scene4 .web-card',
      { y: 180, rotationX: 45, scale: 0.7, opacity: 0 },
      { y: 0, rotationX: 0, scale: 1, opacity: 1, stagger: 0.08, ease: 'back.out(1.5)', duration: 0.4 },
      0.05
    )
    .fromTo('#scene4 .meter-circle',
      { scale: 0, rotation: -260 },
      { scale: 1, rotation: 0, ease: 'back.out(1.8)', duration: 0.35 },
      0.2
    )
    // Phase 2 (40% -> 60%): Rest in view
    .to({}, { duration: 0.2 })
    // Phase 3 (60% -> 100%): Disassemble out into the top
    .to('#scene4 .web-card',
      { y: -160, rotationX: -35, scale: 0.75, opacity: 0, stagger: 0.06, ease: 'power2.in', duration: 0.4 },
      0.6
    )
    .to('#scene4 .scene-header-center',
      { y: -60, opacity: 0, ease: 'power2.in', duration: 0.3 },
      0.65
    );


  // --- SECTION 5: AI Automation (Two-way Assembly & Disassembly) ---
  const sec5Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene5',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2.2,
      onEnter: () => setActiveIndicator(4),
      onEnterBack: () => setActiveIndicator(4),
    }
  });

  // Phase 1 (0% -> 40%): Build & Assemble
  sec5Tl
    .fromTo('#scene5 .ai-core-visual',
      { scale: 0.2, rotationZ: 45, opacity: 0, z: -500 },
      { scale: 1, rotationZ: 0, opacity: 1, z: 0, ease: 'power2.out', duration: 0.4 },
      0
    )
    .fromTo('#scene5 .scene-narrative',
      { x: -140, opacity: 0 },
      { x: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
      0
    )
    .fromTo('#scene5 .pipeline-node',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.08, ease: 'power2.out', duration: 0.35 },
      0.1
    )
    .fromTo('#scene5 .neural-wire',
      { scaleY: 0, transformOrigin: 'top' },
      { scaleY: 1, stagger: 0.08, ease: 'power1.inOut', duration: 0.3 },
      0.15
    )
    // Phase 2 (40% -> 60%): Rest in view
    .to({}, { duration: 0.2 })
    // Phase 3 (60% -> 100%): Disassemble out into the top
    .to('#scene5 .ai-core-visual',
      { scale: 0.2, rotationZ: -30, opacity: 0, y: -120, ease: 'power2.in', duration: 0.4 },
      0.6
    )
    .to('#scene5 .pipeline-node, #scene5 .scene-narrative',
      { x: 100, opacity: 0, ease: 'power2.in', duration: 0.4 },
      0.6
    );


  // --- SECTION 6: Contact & Docking (Two-way Assembly & Disassembly) ---
  const sec6Tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene6',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 2.2,
      onEnter: () => setActiveIndicator(5),
      onEnterBack: () => setActiveIndicator(5),
    }
  });

  sec6Tl
    .fromTo('#scene6 .docking-station-card',
      { scale: 0.65, opacity: 0, y: 140 },
      { scale: 1, opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 },
      0
    )
    .fromTo('#scene6 .channel-btn',
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, ease: 'back.out(1.6)', duration: 0.4 },
      0.15
    )
    .fromTo('#scene6 .bot-docking-pad',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, ease: 'back.out(1.8)', duration: 0.4 },
      0.25
    );


  // 6. SMOOTH NAV LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, { duration: 1.6 });
      }
    });
  });

});
