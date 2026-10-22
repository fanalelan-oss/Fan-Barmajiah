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
    touchMultiplier: 1.4,
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

    if (animated && themeToggle) {
      gsap.fromTo(themeToggle, 
        { rotate: -45, scale: 0.75 }, 
        { rotate: 0, scale: 1, duration: 0.5, ease: 'back.out(2.5)' }
      );
    }
  }

  // Initialize saved theme on page load
  const savedTheme = localStorage.getItem('fan_theme');
  if (savedTheme === 'light') {
    applyTheme(true, false);
  } else {
    applyTheme(false, false);
  }

  themeToggle?.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light-mode');
    applyTheme(!isCurrentlyLight, true);
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

});
