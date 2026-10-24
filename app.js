/* ==========================================================================
   ATAD DIGITAL - TWO-WAY SLOW CINEMATIC ASSEMBLY/DISASSEMBLY ENGINE
   GSAP ScrollTrigger (Full Bi-directional Scrub) + Lenis Smooth Scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 0. LENIS SMOOTH SCROLL INITIALIZATION (Available globally for all modules)
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.0,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


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

    let shockwaves = [];
    let shootingStars = [];

    // 1.1 INTERACTIVE CLICK SHOCKWAVES & COSMIC SHOOTING STARS
    window.addEventListener('pointerdown', (e) => {
      // Don't trigger on interactive buttons or nav
      if (e.target.closest('a, button, input, .step-indicator')) return;

      const clickX = e.clientX;
      const clickY = e.clientY;

      // Spawn Expanding Cyan/Purple Energy Shockwave
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: Math.random() * 80 + 120,
        color: Math.random() > 0.5 ? '#00f0ff' : '#b026ff',
        alpha: 0.85,
        lineWidth: 3
      });

      // Spawn a blazing Cosmic Shooting Star
      const startX = Math.random() * width * 0.8;
      const startY = Math.random() * height * 0.3;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 12 + 16;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 80 + 90,
        color: '#00f0ff',
        alpha: 1,
        life: 1
      });

      // Gently push nearby stars with a water wave ripple
      particles.forEach(p => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        if (dist < 180) {
          const force = (1 - dist / 180) * 8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
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
        this.vx *= 0.98;
        this.vy *= 0.98;

        if (isCuriousGathering) {
          // Slow, Gentle Directional Migration Towards Mouse Position
          const toMouseX = mouseX - this.x;
          const toMouseY = mouseY - this.y;
          const dist = Math.max(Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY), 1);

          if (dist > 30) {
            this.vx += (toMouseX / dist) * 0.035;
            this.vy += (toMouseY / dist) * 0.035;
          }

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

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw(warpScale = 1) {
        ctx.save();
        ctx.beginPath();
        if (warpScale > 1.05) {
          // Scroll Warp Streak
          ctx.ellipse(this.x, this.y, this.radius, this.radius * warpScale, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        }
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

      // 1. Calculate Scroll-Velocity Warp Factor
      const scrollVelocity = lenis ? Math.abs(lenis.velocity || 0) : 0;
      const warpScale = Math.min(1 + scrollVelocity * 0.06, 2.8);

      // 2. Draw Interactive Constellation Connections
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
      particles.forEach(p => { p.update(); p.draw(warpScale); });

      // 3. Draw Click Shockwave Ripples
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 3.5;
        sw.alpha -= 0.022;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = sw.lineWidth * (sw.alpha / 0.85);
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Draw Cosmic Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += star.vx;
        star.y += star.vy;
        star.life -= 0.025;

        if (star.life <= 0 || star.x > width + 100 || star.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        const tailX = star.x - (star.vx / 16) * star.length;
        const tailY = star.y - (star.vy / 16) * star.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        starGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        starGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.6)');
        starGrad.addColorStop(1, '#ffffff');

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = star.life;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }


  // 2.2 3D HOLOGRAPHIC PARALLAX CARD TILT INTERACTION
  const tiltCards = document.querySelectorAll('.glass-element, .spec-tile, .docking-station-card, .capsule');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.025,
        transformPerspective: 1000,
        duration: 0.25,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  });


  // 4. ANTI-GRAVITY ELASTIC RUBBER FOR MAIN PAGES NAVIGATION
  const rubberPill = document.getElementById('rubberPill');
  const navMenu = document.getElementById('navMainMenu');
  const pageLinks = document.querySelectorAll('.nav-page-link');
  let currentActivePageIndex = 0;

  pageLinks.forEach((link, idx) => {
    if (link.classList.contains('active')) currentActivePageIndex = idx;
  });

  function moveRubberPill(targetIndex, animate = true) {
    if (window.innerWidth <= 850 || !rubberPill || !navMenu || !pageLinks[targetIndex]) return;

    const menuRect = navMenu.getBoundingClientRect();
    const targetEl = pageLinks[targetIndex];
    const targetRect = targetEl.getBoundingClientRect();

    const targetLeft = targetRect.left - menuRect.left;
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
      // Moving Forward
      const fullSpan = (targetLeft + targetWidth) - currentLeft;
      rubberTl
        .to(rubberPill, {
          width: fullSpan,
          scaleY: 0.78,
          duration: 0.18,
          ease: 'power2.in'
        }, 0)
        .to(rubberPill, {
          left: targetLeft,
          width: targetWidth,
          scaleY: 1,
          duration: 0.52,
          ease: 'elastic.out(1.15, 0.42)'
        }, 0.12);
    } else {
      // Moving Backward
      const fullSpan = (currentLeft + currentWidth) - targetLeft;
      rubberTl
        .to(rubberPill, {
          left: targetLeft,
          width: fullSpan,
          scaleY: 0.78,
          duration: 0.18,
          ease: 'power2.in'
        }, 0)
        .to(rubberPill, {
          width: targetWidth,
          scaleY: 1,
          duration: 0.52,
          ease: 'elastic.out(1.15, 0.42)'
        }, 0.12);
    }
  }

  // Interactive Hover and Leave Elastic Physics
  pageLinks.forEach((link, idx) => {
    link.addEventListener('mouseenter', () => {
      moveRubberPill(idx, true);
    });
  });

  navMenu?.addEventListener('mouseleave', () => {
    moveRubberPill(currentActivePageIndex, true);
  });

  // Init position accurately on load and resize
  function initRubberPosition() {
    moveRubberPill(currentActivePageIndex, false);
  }

  window.addEventListener('resize', initRubberPosition);
  initRubberPosition();
  window.addEventListener('load', initRubberPosition);
  setTimeout(initRubberPosition, 100);


  // =========================================================================
  // 5. TWO-WAY SLOW CINEMATIC ASSEMBLY & DISASSEMBLY TIMELINES (INDEX ONLY)
  // =========================================================================
  if (document.getElementById('mainFlow')) {
    const mm = gsap.matchMedia();

    // DESKTOP: FULL 3D EXPANSIVE CINEMATICS (Min-width: 851px)
    mm.add("(min-width: 851px)", () => {

      // --- SECTION 1: Launchpad ---
      const sec1Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene1',
        start: 'top top',
        end: 'bottom top',
        scrub: 2.2, // Ultra-slow and visible
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


    // --- SECTION 1.5: Strategic Partnership & Value (Two-way Assembly & Disassembly) ---
    const secValueTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#sceneValue',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2.2,
      }
    });

    secValueTl
      .fromTo('#sceneValue .video-glass-card',
        { scale: 0.2, rotationY: 45, opacity: 0, z: -500, y: 100 },
        { scale: 1, rotationY: 0, opacity: 1, z: 0, y: 0, ease: 'power2.out', duration: 0.4 },
        0
      )
      .fromTo('#sceneValue .scene-narrative',
        { x: 120, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out', duration: 0.4 },
        0
      )
      .fromTo('#sceneValue .usecase-list li',
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.06, ease: 'power2.out', duration: 0.35 },
        0.1
      )
      .fromTo('#sceneValue .cap-pill',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.05, ease: 'back.out(1.6)', duration: 0.35 },
        0.15
      )
      .to({}, { duration: 0.2 })
      .to('#sceneValue .video-glass-card',
        { scale: 0.3, rotationY: -35, opacity: 0, z: -350, y: -120, ease: 'power2.in', duration: 0.4 },
        0.6
      )
      .to('#sceneValue .scene-narrative',
        { x: -100, opacity: 0, ease: 'power2.in', duration: 0.4 },
        0.6
      );


    // --- SECTION 2: Flutter Lab (Two-way Assembly & Disassembly) ---
    const sec2Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2.2,
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

    }); // End Desktop MatchMedia (min-width: 851px)

    // MOBILE: CLEAN, FAST, ROCK-SOLID VERTICAL SCROLL FLOW (Max-width: 850px)
    mm.add("(max-width: 850px)", () => {
      // 1. Scene 1 (Hero): Animate entrance immediately on mobile, never reverse or hide
      gsap.from('#scene1 .anim-node, #scene1 .capsule', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all'
      });

      // 2. Subsequent Scenes: Trigger smooth entrance once when scrolling into view
      const scrollScenes = ['#sceneValue', '#scene2', '#scene3', '#scene4', '#scene5', '#scene6'];
      scrollScenes.forEach(secId => {
        const sec = document.querySelector(secId);
        if (!sec) return;
        const targets = sec.querySelectorAll('.anim-node, .glass-element, .scene-narrative, .web-card, .video-glass-card, .docking-station-card, .scene-badge, .spec-tile');
        if (targets.length) {
          gsap.from(targets, {
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              once: true
            },
            y: 24,
            opacity: 0,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'all'
          });
        }
      });
    });

  }


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


  // 7. FLOATING BACK TO TOP BUTTON & SCROLL PROGRESS RING
  const backToTopBtn = document.getElementById('backToTopBtn');
  const scrollCircle = document.getElementById('scrollProgressCircle');
  const ringCircumference = 125.66; // 2 * PI * 20

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Toggle visibility smoothly
    if (scrollY > 320) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Update circular progress ring
    if (scrollCircle && totalScroll > 0) {
      const progress = Math.min(scrollY / totalScroll, 1);
      const offset = ringCircumference - (progress * ringCircumference);
      scrollCircle.style.strokeDashoffset = offset;
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });


  // 8. SERVICES INTERACTIVE BENTO FILTER TABS
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const bentoCards = document.querySelectorAll('.bento-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      bentoCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCat === filterValue) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
            onStart: () => { card.style.display = card.classList.contains('bento-span-2') ? 'grid' : 'flex'; }
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.94,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
    });
  });


  // 9. CYBER LIGHT/DARK THEME SWITCHER CONTROLLER
  const themeToggle = document.getElementById('themeToggle');

  function applyTheme(isLight, animated = true) {
    if (isLight) {
      document.body.classList.add('light-mode');
      localStorage.setItem('fan_theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('fan_theme', 'dark');
    }

    if (animated) {
      document.querySelectorAll('.theme-toggle-floating').forEach(btn => {
        gsap.fromTo(btn, 
          { rotate: -45, scale: 0.75 }, 
          { rotate: 0, scale: 1, duration: 0.5, ease: 'back.out(2.5)' }
        );
      });
    }
  }

  // Initialize saved theme on page load
  const savedTheme = localStorage.getItem('fan_theme');
  if (savedTheme === 'light') {
    applyTheme(true, false);
  } else {
    applyTheme(false, false);
  }

  document.querySelectorAll('.theme-toggle-floating').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyLight = document.body.classList.contains('light-mode');
      applyTheme(!isCurrentlyLight, true);
    });
  });


  // 10. RESPONSIVE MOBILE NAVIGATION DRAWER CONTROLLER
  const navFolder = document.getElementById('navFolder');
  const navMainMenu = document.getElementById('navMainMenu');
  let mobileMenuBtn = document.getElementById('mobileMenuBtn');

  // Inject mobile toggle button if not already present in HTML
  if (navFolder && !mobileMenuBtn) {
    const controls = document.createElement('div');
    controls.className = 'mobile-nav-controls';
    controls.innerHTML = `
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="فتح القائمة">
        <i class="fa-solid fa-bars"></i>
      </button>
    `;
    navFolder.appendChild(controls);
    mobileMenuBtn = document.getElementById('mobileMenuBtn');
  }

  // Ensure a dedicated mobile CTA exists inside navMainMenu
  if (navMainMenu && !navMainMenu.querySelector('.mobile-only-cta')) {
    const mobileCta = document.createElement('a');
    mobileCta.href = document.getElementById('quickContactBtn')?.getAttribute('href') || '#scene6';
    mobileCta.className = 'nav-page-link mobile-only-cta';
    mobileCta.innerHTML = `<span>طلب مشروع</span> <i class="fas fa-arrow-left"></i>`;
    navMainMenu.appendChild(mobileCta);
  }

  function toggleMobileMenu(forceClose = false) {
    if (!navMainMenu || !mobileMenuBtn) return;
    const isOpen = navMainMenu.classList.contains('open');
    const shouldOpen = forceClose ? false : !isOpen;

    if (shouldOpen) {
      navMainMenu.classList.add('open');
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
      navMainMenu.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }

  mobileMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close mobile drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (navMainMenu && navMainMenu.classList.contains('open')) {
      if (!navMainMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  // Close mobile drawer when selecting any link
  navMainMenu?.querySelectorAll('.nav-page-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 850 && navMainMenu && navMainMenu.classList.contains('open')) {
      toggleMobileMenu(true);
    }
  });



  // =========================================================================
  // 11. BILINGUAL INTERNATIONALIZATION (AR / EN) CONTROLLER
  // =========================================================================
  const i18nContent = {
    ar: {
      btnLabel: 'EN',
      btnTitle: 'Switch to English / تبديل إلى الإنجليزية',
      siteTitle: 'فن البرمجية',
      siteSub: 'حلول رقمية وأتمتة',
      navHome: 'الرئيسية',
      navAbout: 'من نحن',
      navServices: 'خدماتنا',
      navBlog: 'المدونة',
      navCta: 'طلب مشروع',
      // Stepper
      step0: 'منصة الانطلاق',
      step1: 'معمل فلوتر',
      step2: 'متجر المستقبل',
      step3: 'منصة الويب',
      step4: 'شبكة الأتمتة',
      step5: 'محطة التواصل',
      // Scene 1
      heroBadge: 'نظام البناء البرمجي المتكامل 2026',
      heroTitle: 'نصمم ونصنع مستقبلك الرقمي <br><span class="glow-gradient-text">بإتقان استثنائي</span>',
      heroDesc: 'من تطبيقات الموبايل فائقة السرعة، إلى المتاجر الإلكترونية المتطورة، وأنظمة الأتمتة والذكاء الاصطناعي — نبني لك منظومة تقنية متكاملة ترتقي بأعمالك إلى آفاق غير مسبوقة.',
      heroCtaMain: 'ابدأ مشروعك الآن',
      heroCtaSecondary: 'استكشف خدماتنا',
      capsule1Title: 'تطبيقات فلوتر',
      capsule1Sub: 'أداء أصيل خارق',
      capsule2Title: 'متاجر رقمية',
      capsule2Sub: 'تحويل بيع استثنائي',
      capsule3Title: 'هندسة سحابية',
      capsule3Sub: 'سرعة وأمان فائق',
      capsule4Title: 'أتمتة وذكاء',
      capsule4Sub: 'روبوتات تعمل 24/7',
      // Scene 2
      s2Badge: '<i class="fas fa-layer-group"></i> معمل تطبيقات فلوتر',
      s2Title: 'تطبيقات جوال خارقة السرعة <br><span class="glow-cyan-text">تنبض بالحياة في يد عميلك</span>',
      s2Desc: 'نطور تطبيقات هجينة متطورة بتقنية Flutter وDart، تمنحك أداءً سلساً يضاهي التطبيقات الأصلية، مع واجهات تفاعلية مذهلة وتوافق تام عبر iOS وAndroid من قاعدة كود واحدة.',
      s2Cta: 'استكشف تفاصيل التطبيقات',
      // Scene 3
      s3Badge: '<i class="fas fa-shopping-bag"></i> متجر المستقبل الرقمي',
      s3Title: 'منصات تجارة إلكترونية ذكية <br><span class="glow-purple-text">مُصممة لمضاعفة مبيعاتك</span>',
      s3Desc: 'نبني متاجر إلكترونية فائقة الاستجابة، مدمجة مع أحدث بوابات الدفع (Apple Pay، مدى، فيزا، تابي وتمارا)، مع نظام ذكي لإدارة المخزون والطلبات وأعلى معايير الأمان.',
      s3Cta: 'استكشف حلول المتاجر',
      // Scene 4
      s4Badge: '<i class="fas fa-cubes"></i> منصة الويب وهندسة السحابة',
      s4Title: 'مواقع وأنظمة ويب متقدمة <br><span class="glow-gold-text">بأداء سحابي فائق السرعة</span>',
      s4Desc: 'تطوير منصات ويب تفاعلية بأنظمة Full-Stack الحديثة، مع بنية تحتية سحابية مرنة توفر سرعة تحميل فائقة وتجربة مستخدم ساحرة.',
      s4Cta: 'استكشف هندسة الويب',
      // Scene 5
      s5Badge: '<i class="fas fa-robot"></i> مصفوفة الأتمتة والذكاء الاصطناعي',
      s5Title: 'أنظمة وروبوتات ذكية <br><span class="glow-emerald-text">تعمل بدلاً منك 24 ساعة</span>',
      s5Desc: 'نصمم مسارات عمل برمجية (Python, n8n, Webhooks, AI Agents) لربط خدماتك ببعضها وأتمتة الردود، الفواتير، ومزامنة البيانات تلقائياً دون أي تدخل بشري.',
      s5Cta: 'استكشف حلول الأتمتة',
      // Scene 6
      s6Badge: '<i class="fas fa-rocket"></i> محطة هبوط البوت والجاهزية',
      s6Title: 'جاهز لتحويل فكرتك إلى <br><span class="glow-cyan-text">واقع برمجـي استثنائـي؟</span>',
      s6Desc: 'دعنا نبدأ في صياغة مشروعك القادم بنفس الدقة والسحر الذي رأيته في هذه الصفحة.',
      waLabel: 'محادثة فورية',
      waTitle: 'تواصل عبر واتساب',
      emailLabel: 'استفسار أو طلب عرض سعر',
      tgLabel: 'قناة وسرعة رد',
      tgTitle: 'تواصل عبر تليجرام',
      // Bot
      botBubble: 'مرحباً بك! أنا رفيقك البرمجي، انزل بالسكرول لترى العالم وهو يُبنى قطعة قطعة 👇',
      botTag: '<i class="fas fa-microchip"></i> منصة فن الذكية',
      // Footer
      footerCopy: 'جميع الحقوق محفوظة © 2026 فن البرمجية. صُنع بشغف هندسي فائق.'
    },
    en: {
      btnLabel: 'عربي',
      btnTitle: 'تبديل إلى العربية / Switch to Arabic',
      siteTitle: 'Fan Al-Barmajiah',
      siteSub: 'Digital & AI Automation',
      navHome: 'Home',
      navAbout: 'About Us',
      navServices: 'Services',
      navBlog: 'Blog',
      navCta: 'Request Project',
      // Stepper
      step0: 'Launchpad',
      step1: 'Flutter Studio',
      step2: 'Future Store',
      step3: 'Web Platform',
      step4: 'Automation Grid',
      step5: 'Contact Dock',
      // Scene 1
      heroBadge: 'Integrated Software Engineering 2026',
      heroTitle: 'We Engineer Your Digital Future <br><span class="glow-gradient-text">With Pure Precision</span>',
      heroDesc: 'From high-velocity mobile applications to advanced e-commerce platforms and autonomous AI workflows — we craft complete digital ecosystems that scale your enterprise.',
      heroCtaMain: 'Start Project Now',
      heroCtaSecondary: 'Explore Services',
      capsule1Title: 'Flutter Apps',
      capsule1Sub: 'Native 120 FPS',
      capsule2Title: 'Smart Stores',
      capsule2Sub: 'High Conversion',
      capsule3Title: 'Cloud Systems',
      capsule3Sub: 'Speed & Resilience',
      capsule4Title: 'AI & Automation',
      capsule4Sub: '24/7 Smart Bots',
      // Scene 2
      s2Badge: '<i class="fas fa-layer-group"></i> Flutter App Studio',
      s2Title: 'Ultra-Fast Mobile Apps <br><span class="glow-cyan-text">Fluid In Your Users Hands</span>',
      s2Desc: 'We build reactive mobile apps powered by Flutter & Dart, delivering native-grade fluidity, delightful micro-interactions, and seamless cross-platform parity on iOS & Android.',
      s2Cta: 'Explore Mobile Solutions',
      // Scene 3
      s3Badge: '<i class="fas fa-shopping-bag"></i> Future E-Commerce',
      s3Title: 'Intelligent E-Commerce Platforms <br><span class="glow-purple-text">Built to Multiply Sales</span>',
      s3Desc: 'High-converting digital storefronts integrated with modern payment gateways (Apple Pay, Mada, Visa, Tabby & Tamara), intelligent inventory routing, and military-grade security.',
      s3Cta: 'Explore Store Solutions',
      // Scene 4
      s4Badge: '<i class="fas fa-cubes"></i> Cloud & Web Engineering',
      s4Title: 'Advanced Web Applications <br><span class="glow-gold-text">With Blazing Cloud Performance</span>',
      s4Desc: 'Full-stack enterprise web platforms engineered with scalable cloud infrastructure, guaranteeing sub-second load times and fluid digital experiences.',
      s4Cta: 'Explore Web Architecture',
      // Scene 5
      s5Badge: '<i class="fas fa-robot"></i> Automation & AI Matrix',
      s5Title: 'Smart Systems & Autonomous Bots <br><span class="glow-emerald-text">Operating For You 24/7</span>',
      s5Desc: 'We architect enterprise automation pipelines (Python, n8n, Webhooks, AI Agents) connecting workflows, invoices, instant customer messaging, and cross-platform synchronization.',
      s5Cta: 'Explore Automation Solutions',
      // Scene 6
      s6Badge: '<i class="fas fa-rocket"></i> Bot Dock & Readiness Station',
      s6Title: 'Ready to Turn Your Vision into <br><span class="glow-cyan-text">An Extraordinary Software Reality?</span>',
      s6Desc: 'Let us craft your next software breakthrough with the exact precision, velocity, and craftsmanship you experienced here.',
      waLabel: 'Instant Chat',
      waTitle: 'Chat on WhatsApp',
      emailLabel: 'Inquiries & Proposals',
      tgLabel: 'Fast Response Channel',
      tgTitle: 'Chat on Telegram',
      // Bot
      botBubble: 'Welcome! I am your AI code companion. Scroll down to see the world build piece by piece 👇',
      botTag: '<i class="fas fa-microchip"></i> Fan Intelligent Platform',
      // Footer
      footerCopy: 'All rights reserved © 2026 Fan Al-Barmajiah. Crafted with deep engineering passion.'
    }
  };

  function applyLanguage(lang, animated = true) {
    const data = i18nContent[lang] || i18nContent.ar;
    
    // Set HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', lang === 'en');
    document.body.classList.toggle('lang-ar', lang === 'ar');
    localStorage.setItem('fan_lang', lang);

    // Update Lang Toggle Buttons (desktop and mobile)
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      const labelEl = btn.querySelector('.lang-text');
      if (labelEl) labelEl.textContent = data.btnLabel;
      btn.setAttribute('title', data.btnTitle);
      
      if (animated && typeof gsap !== 'undefined') {
        gsap.fromTo(btn, 
          { scale: 0.82, rotate: lang === 'en' ? 15 : -15 }, 
          { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.5)' }
        );
      }
    });

    // 1. Navigation items (across all pages)
    document.querySelectorAll('.site-title').forEach(el => el.textContent = data.siteTitle);
    document.querySelectorAll('.site-sub').forEach(el => el.textContent = data.siteSub);
    
    document.querySelectorAll('a.nav-page-link[href="index.html"]').forEach(el => el.textContent = data.navHome);
    document.querySelectorAll('a.nav-page-link[href="about.html"]').forEach(el => el.textContent = data.navAbout);
    document.querySelectorAll('a.nav-page-link[href="services.html"]').forEach(el => el.textContent = data.navServices);
    document.querySelectorAll('a.nav-page-link[href="blog.html"]').forEach(el => el.textContent = data.navBlog);
    
    document.querySelectorAll('.nav-cta-btn span, .mobile-only-cta span').forEach(el => {
      el.textContent = data.navCta;
    });

    // 2. Stepper indicators tooltips
    const step0 = document.querySelector('.step-indicator[data-index="0"]');
    if (step0) step0.setAttribute('title', data.step0);
    const step1 = document.querySelector('.step-indicator[data-index="1"]');
    if (step1) step1.setAttribute('title', data.step1);
    const step2 = document.querySelector('.step-indicator[data-index="2"]');
    if (step2) step2.setAttribute('title', data.step2);
    const step3 = document.querySelector('.step-indicator[data-index="3"]');
    if (step3) step3.setAttribute('title', data.step3);
    const step4 = document.querySelector('.step-indicator[data-index="4"]');
    if (step4) step4.setAttribute('title', data.step4);
    const step5 = document.querySelector('.step-indicator[data-index="5"]');
    if (step5) step5.setAttribute('title', data.step5);

    // 3. Scene 1 Elements (Hero & Orbiting Capsules)
    const heroChip = document.querySelector('.hero-chip span:nth-child(2)');
    if (heroChip) heroChip.textContent = data.heroBadge;
    const heroHeading = document.querySelector('.hero-title');
    if (heroHeading) heroHeading.innerHTML = data.heroTitle;
    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) heroDesc.textContent = data.heroDesc;
    const heroCtaMain = document.querySelector('.hero-cta-group .primary-action span');
    if (heroCtaMain) heroCtaMain.textContent = data.heroCtaMain;
    const heroCtaSec = document.querySelector('.hero-cta-group .secondary-action span');
    if (heroCtaSec) heroCtaSec.textContent = data.heroCtaSecondary;

    // Orbiting capsules
    const cap1 = document.querySelector('.capsule-1 .capsule-info');
    if (cap1) {
      const strong = cap1.querySelector('strong');
      const span = cap1.querySelector('span');
      if (strong) strong.textContent = data.capsule1Title;
      if (span) span.textContent = data.capsule1Sub;
    }
    const cap2 = document.querySelector('.capsule-2 .capsule-info');
    if (cap2) {
      const strong = cap2.querySelector('strong');
      const span = cap2.querySelector('span');
      if (strong) strong.textContent = data.capsule2Title;
      if (span) span.textContent = data.capsule2Sub;
    }
    const cap3 = document.querySelector('.capsule-3 .capsule-info');
    if (cap3) {
      const strong = cap3.querySelector('strong');
      const span = cap3.querySelector('span');
      if (strong) strong.textContent = data.capsule3Title;
      if (span) span.textContent = data.capsule3Sub;
    }
    const cap4 = document.querySelector('.capsule-4 .capsule-info');
    if (cap4) {
      const strong = cap4.querySelector('strong');
      const span = cap4.querySelector('span');
      if (strong) strong.textContent = data.capsule4Title;
      if (span) span.textContent = data.capsule4Sub;
    }

    // 4. Scene 2 (Flutter)
    const s2 = document.getElementById('scene2');
    if (s2) {
      const badge = s2.querySelector('.scene-badge');
      if (badge) badge.innerHTML = data.s2Badge;
      const heading = s2.querySelector('.scene-heading');
      if (heading) heading.innerHTML = data.s2Title;
      const p = s2.querySelector('.scene-paragraph');
      if (p) p.textContent = data.s2Desc;
      const cta = s2.querySelector('.scene-action-btn span');
      if (cta) cta.textContent = data.s2Cta;
    }

    // 5. Scene 3 (E-Commerce)
    const s3 = document.getElementById('scene3');
    if (s3) {
      const badge = s3.querySelector('.scene-badge');
      if (badge) badge.innerHTML = data.s3Badge;
      const heading = s3.querySelector('.scene-heading');
      if (heading) heading.innerHTML = data.s3Title;
      const p = s3.querySelector('.scene-paragraph');
      if (p) p.textContent = data.s3Desc;
      const cta = s3.querySelector('.scene-action-btn span');
      if (cta) cta.textContent = data.s3Cta;
    }

    // 6. Scene 4 (Web)
    const s4 = document.getElementById('scene4');
    if (s4) {
      const badge = s4.querySelector('.scene-badge');
      if (badge) badge.innerHTML = data.s4Badge;
      const heading = s4.querySelector('.scene-heading');
      if (heading) heading.innerHTML = data.s4Title;
      const p = s4.querySelector('.scene-paragraph');
      if (p) p.textContent = data.s4Desc;
      const cta = s4.querySelector('.scene-action-btn span');
      if (cta) cta.textContent = data.s4Cta;
    }

    // 7. Scene 5 (AI & Automation)
    const s5 = document.getElementById('scene5');
    if (s5) {
      const badge = s5.querySelector('.scene-badge');
      if (badge) badge.innerHTML = data.s5Badge;
      const heading = s5.querySelector('.scene-heading');
      if (heading) heading.innerHTML = data.s5Title;
      const p = s5.querySelector('.scene-paragraph');
      if (p) p.textContent = data.s5Desc;
      const cta = s5.querySelector('.scene-action-btn span');
      if (cta) cta.textContent = data.s5Cta;
    }

    // 8. Scene 6 (Contact)
    const s6 = document.getElementById('scene6');
    if (s6) {
      const badge = s6.querySelector('.scene-badge');
      if (badge) badge.innerHTML = data.s6Badge;
      const heading = s6.querySelector('.scene-heading');
      if (heading) heading.innerHTML = data.s6Title;
      const p = s6.querySelector('.scene-paragraph');
      if (p) p.textContent = data.s6Desc;
      
      const wa = s6.querySelector('.whatsapp-channel .channel-info');
      if (wa) {
        const span = wa.querySelector('span');
        const strong = wa.querySelector('strong');
        if (span) span.textContent = data.waLabel;
        if (strong) strong.textContent = data.waTitle;
      }
      const email = s6.querySelector('.email-channel .channel-info span');
      if (email) email.textContent = data.emailLabel;
      const tg = s6.querySelector('.telegram-channel .channel-info');
      if (tg) {
        const span = tg.querySelector('span');
        const strong = tg.querySelector('strong');
        if (span) span.textContent = data.tgLabel;
        if (strong) strong.textContent = data.tgTitle;
      }
    }

    // 9. Bot Bubble & Tag
    const botTag = document.getElementById('bubbleTag') || document.querySelector('.bubble-tag');
    if (botTag) botTag.innerHTML = data.botTag;
    const botMsg = document.getElementById('bubbleMsg');
    if (botMsg) botMsg.textContent = data.botBubble;

    // 10. Footer Copy
    document.querySelectorAll('.footer-copy, .site-footer p').forEach(el => {
      if (el.textContent.includes('©') || el.textContent.includes('حقوق')) {
        el.textContent = data.footerCopy;
      }
    });

    // 11. Breadcrumbs on subpages
    document.querySelectorAll('.service-breadcrumb a[href="index.html"]').forEach(el => el.textContent = data.navHome);
    document.querySelectorAll('.service-breadcrumb a[href="services.html"]').forEach(el => el.textContent = data.navServices);
  }

  // Initialize saved language
  const savedLang = localStorage.getItem('fan_lang') || 'ar';
  applyLanguage(savedLang, false);

  // Bind click event to all language toggle buttons
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = localStorage.getItem('fan_lang') || 'ar';
      const target = (current === 'ar') ? 'en' : 'ar';
      applyLanguage(target, true);
    });
  });

});
