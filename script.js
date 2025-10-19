// Modern JavaScript with ES6+ features and better performance
class ModernWebsite {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.mainNav = document.getElementById('main-nav');
    this.navToggle = document.getElementById('nav-toggle');
    this.themeToggle = document.getElementById('theme-toggle');
    this.slideIndex = 0;
    this.slidesContainer = document.querySelector('.slideshow-container');
    this.totalSlides = document.querySelectorAll('.slide').length;
    
    this.init();
  }

  init() {
    this.initializeAOS();
    this.setupScrollHandler();
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupCounters();
    this.setupSlideshow();
    this.setupTestimonials();
    this.setupSmoothScrolling();
    this.setupAccessibility();
  }

  // Initialize AOS animations
  initializeAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ 
        duration: 800, 
        once: true, 
        offset: 50,
        easing: 'ease-out-cubic'
      });
    }
  }

  // Optimized scroll handler with throttling
  setupScrollHandler() {
    let ticking = false;
    
    const updateHeader = () => {
      const scrolled = window.scrollY > 50;
      this.header?.classList.toggle('scrolled', scrolled);
      this.updateActiveNavLink();
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Modern navigation handling
  setupNavigation() {
    if (!this.navToggle || !this.mainNav) return;

    this.navToggle.addEventListener('click', () => {
      const isOpen = this.mainNav.classList.contains('open');
      this.mainNav.classList.toggle('open');
      this.navToggle.setAttribute('aria-expanded', !isOpen);
      this.navToggle.setAttribute('aria-label', isOpen ? 'فتح القائمة' : 'إغلاق القائمة');
    });

    // Close navigation when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mainNav.classList.contains('open') && 
          !this.mainNav.contains(e.target) && 
          !this.navToggle.contains(e.target)) {
        this.closeNavigation();
      }
    });

    // Close navigation on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mainNav.classList.contains('open')) {
        this.closeNavigation();
      }
    });
  }

  closeNavigation() {
    this.mainNav.classList.remove('open');
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navToggle.setAttribute('aria-label', 'فتح القائمة');
    this.navToggle.focus();
  }

  // Modern theme toggle with system preference detection
  setupThemeToggle() {
    if (!this.themeToggle) return;

    const getSystemTheme = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
      const isDark = theme === 'dark';
      document.body.classList.toggle('dark-mode', isDark);
      
      const icon = this.themeToggle.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      }
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.content = isDark ? '#121212' : '#00695c';
      }
    };

    // Load saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || getSystemTheme();
    applyTheme(initialTheme);

    // Listen for theme toggle clicks
    this.themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // Modern animated counters with Intersection Observer
  setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(target * easeOutQuart);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCount);
  }

  // Modern slideshow with touch support and keyboard navigation
  setupSlideshow() {
    if (!this.slidesContainer || this.totalSlides === 0) return;

    // Load slideshow images
    this.loadSlideshowImages();

    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => this.previousSlide());
      nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch/swipe support
    this.setupTouchNavigation();

    // Auto-play slideshow
    this.startAutoPlay();
  }

  // Load slideshow images with lazy loading
  loadSlideshowImages() {
    const slides = document.querySelectorAll('.slide[data-bg]');
    slides.forEach((slide, index) => {
      const imageSrc = slide.getAttribute('data-bg');
      
      // Load first image immediately, others lazily
      if (index === 0) {
        slide.style.backgroundImage = `url('${imageSrc}')`;
      } else {
        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.backgroundImage = `url('${imageSrc}')`;
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(slide);
      }
    });
  }

  showSlide(index) {
    if (!this.slidesContainer) return;
    this.slideIndex = index;
    const translateX = -index * (100 / this.totalSlides);
    this.slidesContainer.style.transform = `translateX(${translateX}%)`;
  }

  nextSlide() {
    this.slideIndex = (this.slideIndex + 1) % this.totalSlides;
    this.showSlide(this.slideIndex);
    this.resetAutoPlay();
  }

  previousSlide() {
    this.slideIndex = (this.slideIndex - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(this.slideIndex);
    this.resetAutoPlay();
  }

  setupTouchNavigation() {
    let startX = 0;
    let endX = 0;

    this.slidesContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    this.slidesContainer.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    });
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }

  // Update active navigation link on scroll
  updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section, .hero');
    
    if (navLinks.length === 0 || sections.length === 0) return;

    let currentId = '';
    const scrollPosition = window.scrollY + this.header.offsetHeight + 100;

    sections.forEach(section => {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  // Setup testimonials slider
  setupTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    
    if (testimonialCards.length === 0 || testimonialBtns.length === 0) return;

    testimonialBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        this.showTestimonial(index);
      });
    });

    // Auto-rotate testimonials
    this.startTestimonialRotation();
  }

  showTestimonial(index) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialBtns.forEach(btn => btn.classList.remove('active'));
    
    testimonialCards[index]?.classList.add('active');
    testimonialBtns[index]?.classList.add('active');
  }

  startTestimonialRotation() {
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    if (testimonialBtns.length === 0) return;

    setInterval(() => {
      const currentActive = document.querySelector('.testimonial-btn.active');
      const currentIndex = Array.from(testimonialBtns).indexOf(currentActive);
      const nextIndex = (currentIndex + 1) % testimonialBtns.length;
      this.showTestimonial(nextIndex);
    }, 4000);
  }

  // Enhanced smooth scrolling
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - this.header.offsetHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Close mobile navigation if open
          this.closeNavigation();
        }
      });
    });
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'الانتقال إلى المحتوى الرئيسي';
    skipLink.className = 'skip-link sr-only';
    skipLink.addEventListener('focus', () => {
      skipLink.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', () => {
      skipLink.classList.add('sr-only');
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Improve focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

// Initialize the modern website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernWebsite();
});