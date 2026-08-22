/* ==========================================================================
   ATAD DIGITAL - SCROLLYTELLING CYBERPORTFOLIO
   GSAP + Lenis + Canvas + Interactive Motion Choreography
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Custom Cursor Follower
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    cursorGlow.animate({
      left: `${mouseX}px`,
      top: `${mouseY}px`
    }, { duration: 400, fill: 'forwards' });
  });

  // Hover scale on interactive elements
  const interactives = document.querySelectorAll('a, button, .glass-card, .tilt-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursorGlow.style.borderColor = 'var(--cyan)';
    });
    el.addEventListener('mouseleave', () => {
      cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorGlow.style.borderColor = 'var(--cyan-glow)';
    });
  });

  // 3. Dynamic Interactive Background Canvas (Cyber Matrix Particles)
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.5 ? '#b026ff' : '#00f59b');
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse subtle repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  const particleCount = Math.min(window.innerWidth < 768 ? 35 : 75, 100);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00f0ff';
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  // 4. Scroll Progress Bar
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? (window.scrollY / totalScroll) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  });


  // 5. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  // 6. FLOATING MASTER BOT SCROLL CHOREOGRAPHY (GSAP SCROLLTRIGGER)
  const bot = document.getElementById('floatingBotContainer');
  const botBubble = document.getElementById('botSpeechBubble');
  const bubbleText = botBubble.querySelector('.bubble-text');

  function updateBotMessage(msg) {
    gsap.to(botBubble, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      onComplete: () => {
        bubbleText.innerHTML = msg;
        gsap.to(botBubble, { opacity: 1, y: 0, duration: 0.3 });
      }
    });
  }

  // Create Main Scroll Timeline for the Bot
  const isMobile = window.innerWidth <= 768;
  const masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#main-content',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
    }
  });

  // Initial Hero Position
  gsap.set(bot, {
    xPercent: isMobile ? 0 : 25,
    yPercent: isMobile ? -15 : -10,
    scale: isMobile ? 0.8 : 1,
    rotation: 0,
  });

  // Master Bot Transitions along sections
  // Step 1: Transition into Flutter Section (Move to Left, tilt down to inspect phone)
  masterTimeline.to(bot, {
    xPercent: isMobile ? -25 : -35,
    yPercent: 0,
    rotation: -12,
    scale: isMobile ? 0.85 : 1.1,
    ease: 'power2.inOut',
  }, 0.15);

  // Step 2: Transition into E-Commerce Section (Fly to Right with a playful spin)
  masterTimeline.to(bot, {
    xPercent: isMobile ? 25 : 35,
    yPercent: 5,
    rotation: 14,
    scale: isMobile ? 0.9 : 1.15,
    ease: 'power2.inOut',
  }, 0.35);

  // Step 3: Transition into Web Dev Section (Float Center-Top, scanning grid)
  masterTimeline.to(bot, {
    xPercent: 0,
    yPercent: isMobile ? -30 : -25,
    rotation: 0,
    scale: isMobile ? 0.75 : 1.05,
    ease: 'power2.inOut',
  }, 0.55);

  // Step 4: Transition into Automation Section (Move to Bottom-Left next to AI node)
  masterTimeline.to(bot, {
    xPercent: isMobile ? -20 : -32,
    yPercent: 15,
    rotation: -8,
    scale: isMobile ? 0.85 : 1.1,
    ease: 'power2.inOut',
  }, 0.75);

  // Step 5: Transition into Portfolio Showcase (Subtle top-right observation)
  masterTimeline.to(bot, {
    xPercent: isMobile ? 20 : 38,
    yPercent: -20,
    rotation: 6,
    scale: isMobile ? 0.7 : 0.9,
    ease: 'power2.inOut',
  }, 0.88);

  // Step 6: Final Destination (Landing on the contact target)
  masterTimeline.to(bot, {
    xPercent: 0,
    yPercent: isMobile ? 32 : 38,
    rotation: 0,
    scale: isMobile ? 0.8 : 0.95,
    ease: 'power3.out',
  }, 1.0);


  // ScrollTrigger Listeners for Dynamic Speech Messages & Lighting
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => updateBotMessage('مرحباً بك! أنا رفيقك البرمجي، انزل معي لنكتشف السحر 👇'),
    onEnterBack: () => updateBotMessage('مرحباً بك في عالم البرمجيات الفائقة! 🚀'),
  });

  ScrollTrigger.create({
    trigger: '#flutter',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => updateBotMessage('هندسة تطبيقات فلوتر بسرعة 60fps لواجهات iOS و Android 📱✨'),
    onEnterBack: () => updateBotMessage('تطبيقات فلوتر بأعلى معايير Clean Architecture 📱'),
  });

  ScrollTrigger.create({
    trigger: '#ecommerce',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => updateBotMessage('متاجر إلكترونية عالية التحويل مع ربط فوري لبوابات الدفع والشحن 🛍️💳'),
    onEnterBack: () => updateBotMessage('تجربة شراء سلسلة وبوابات دفع معتمدة 🛒'),
  });

  ScrollTrigger.create({
    trigger: '#webdev',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => updateBotMessage('منصات وتطبيقات ويب سريعة، متجاوبة ومجهزة لـ SEO ⚡🌐'),
    onEnterBack: () => updateBotMessage('أحدث تقنيات الويب: Next.js و React 💻'),
  });

  ScrollTrigger.create({
    trigger: '#automation',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => updateBotMessage('روبوتات ذكاء اصطناعي وأتمتة مسارات عمل تعمل بدلاً منك 24/7 🤖⚙️'),
    onEnterBack: () => updateBotMessage('أتمتة الأعمال وتوفير آلاف الساعات بدون أخطاء 🧠'),
  });

  ScrollTrigger.create({
    trigger: '#portfolio',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => updateBotMessage('تصفح نماذج من أعمالنا ومشاريعنا المتميزة 🏆'),
    onEnterBack: () => updateBotMessage('مشاريع واقعية مبنية بأعلى جودة 🌟'),
  });

  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top center',
    end: 'bottom bottom',
    onEnter: () => updateBotMessage('وصلنا لمحطة الهبوط! أنا جاهز لنبدأ مشروعك القادم، تواصل الآن 🚀'),
  });


  // 7. Interactive Floating Parallax Props with Mouse Move
  const props = document.querySelectorAll('.prop');
  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    props.forEach(prop => {
      const speed = parseFloat(prop.getAttribute('data-speed')) || 1;
      const moveX = normX * 30 * speed;
      const moveY = normY * 30 * speed;
      prop.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.2}deg)`;
    });

    // Subtle bot 3D mouse look-around
    const botWrapper = document.getElementById('botImageWrapper');
    if (botWrapper) {
      const botTiltX = normY * -15;
      const botTiltY = normX * 20;
      botWrapper.style.transform = `rotateX(${botTiltX}deg) rotateY(${botTiltY}deg)`;
    }
  });


  // 8. 3D Tilt Effect on Cards (VanillaTilt)
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 12,
      speed: 400,
      glare: true,
      'max-glare': 0.25,
      perspective: 1200,
    });
  }


  // 9. Bot Costume Switcher (Toggles between 3D high-res Bot and User Bot)
  const toggleBotBtn = document.getElementById('toggleBotBtn');
  const activeBotImg = document.getElementById('activeBotImg');
  let is3DBot = true;

  if (toggleBotBtn && activeBotImg) {
    toggleBotBtn.addEventListener('click', () => {
      // Quick flip animation
      gsap.to(activeBotImg, {
        scale: 0,
        rotationY: 180,
        duration: 0.3,
        onComplete: () => {
          if (is3DBot) {
            activeBotImg.src = 'assets/user_bot.png';
            is3DBot = false;
            updateBotMessage('تم التبديل إلى المظهر الكلاسيكي للبوت! 👾');
          } else {
            activeBotImg.src = 'assets/bot_3d.png';
            is3DBot = true;
            updateBotMessage('تم التبديل إلى مظهر الـ 3D المستقبلي الفائق! 🤖✨');
          }
          gsap.to(activeBotImg, {
            scale: 1,
            rotationY: 0,
            duration: 0.3,
          });
        }
      });
    });
  }

  // 10. Click anywhere on Bot to play interactive bounce
  bot.addEventListener('click', () => {
    gsap.timeline()
      .to(bot, { scale: 1.25, rotation: "+=20", duration: 0.2, ease: 'power1.out' })
      .to(bot, { scale: 1, rotation: "-=20", duration: 0.3, ease: 'bounce.out' });
    updateBotMessage('أنا هنا لمساعدتك دائماً! اضغط على أي زر للتواصل 🌟');
  });

});
