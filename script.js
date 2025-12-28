// Configuration et variables globales
const CONFIG = {
    SCROLL_THRESHOLD: 100,
    ANIMATION_DELAY: 200,
    TYPING_SPEED: 100,
    NAVBAR_SCROLL_THRESHOLD: 50
};

// Gestion de l'état de l'application
class PortfolioApp {
    constructor() {
        this.isMenuOpen = false;
        this.scrollPosition = 0;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.initSkillBars();
        this.setupSmoothScroll();
        this.setupNavbarBehavior();
        this.setupContactForm();
    }

    setupEventListeners() {
        // Menu hamburger
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Fermeture du menu en cliquant sur un lien
        const navLinks = document.querySelectorAll('. nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Gestion du scroll
        window. addEventListener('scroll', () => this.handleScroll());
        
        // Redimensionnement de la fenêtre
        window.addEventListener('resize', () => this.handleResize());

        // Gestion du clavier
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    setupScrollAnimations() {
        // Observer pour les animations au scroll
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold:  0.1,
                rootMargin:  '0px 0px -50px 0px'
            }
        );

        // Ajouter tous les éléments à animer
        const elementsToAnimate = document.querySelectorAll(`
            .skill-category,
            .project-card,
            .timeline-item,
            .about-stats,
            .hero-content,
            .hero-visual
        `);

        elementsToAnimate.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer. observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry. isIntersecting && !this.animatedElements. has(entry.target)) {
                this.animateElement(entry.target);
                this.animatedElements.add(entry. target);
            }
        });
    }

    animateElement(element) {
        // Ajouter l'animation d'apparition
        element.classList.add('animate');

        // Animations spécifiques selon le type d'élément
        if (element.classList.contains('skill-category')) {
            setTimeout(() => this.animateSkillBars(element), 300);
        }

        if (element. classList.contains('about-stats')) {
            setTimeout(() => this.animateCounters(element), 300);
        }
    }

    initSkillBars() {
        // Initialiser toutes les barres de compétences
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.setProperty('--target-width', `${level}%`);
        });
    }

    animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.skill-bar');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const level = bar.getAttribute('data-level');
                bar.style. width = `${level}%`;
            }, index * 100);
        });
    }

    animateCounters(container) {
        const counters = container.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter. textContent);
            const increment = target / 20;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + (counter.textContent. includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent. includes('+') ? '+' : '');
                }
            }, 50);
        });
    }

    setupSmoothScroll() {
        // Smooth scroll pour les liens d'ancrage
        const anchorLinks = document. querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e. preventDefault();
                const targetId = link. getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement. getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior:  'smooth'
                    });
                }
            });
        });
    }

    setupNavbarBehavior() {
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > CONFIG. NAVBAR_SCROLL_THRESHOLD) {
                navbar.classList. add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mise en surbrillance du lien actif
        this.highlightActiveNavLink();
    }

    highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section. offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList. add('active');
                        }
                    });
                }
            });
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (! form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });

        // Validation en temps réel
        const inputs = form. querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData. entries());

        // Validation
        if (!this.validateForm(form)) {
            this.showNotification('Veuillez corriger les erreurs dans le formulaire. ', 'error');
            return;
        }

        // Simulation d'envoi
        this.showNotification('Envoi en cours...', 'info');
        
        setTimeout(() => {
            this.showNotification('Message envoyé avec succès ! ', 'success');
            form.reset();
        }, 1500);
    
