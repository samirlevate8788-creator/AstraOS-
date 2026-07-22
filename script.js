/* =====================================================
   AstraOS v3.0
   Part 1 - Core Engine
   ===================================================== */

"use strict";

const AstraOS = {

    /* ==========================
       Cache DOM
    ========================== */

    cache() {

        this.loader = document.getElementById("loader");
        this.progressBar = document.getElementById("progress-bar");
        this.navbar = document.querySelector(".navbar");
        this.hero = document.querySelector(".hero");

    },

    /* ==========================
       Loader
    ========================== */

    initLoader() {

        if (!this.loader) return;

        window.addEventListener("load", () => {

            this.loader.style.opacity = "0";
            this.loader.style.visibility = "hidden";

            setTimeout(() => {

                this.loader.remove();

            }, 700);

        });

    },

    /* ==========================
       Progress Bar
    ========================== */

    initProgressBar() {

        if (!this.progressBar) return;

        const update = () => {

            const height =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const scroll =
                window.scrollY;

            const progress =
                (scroll / height) * 100;

            this.progressBar.style.width =
                progress + "%";

        };

        window.addEventListener("scroll", update);

        update();

    },

    /* ==========================
       Sticky Navbar
    ========================== */

    initNavbar() {

        if (!this.navbar) return;

        const update = () => {

            if (window.scrollY > 70) {

                this.navbar.classList.add("sticky");

            } else {

                this.navbar.classList.remove("sticky");

            }

        };

        window.addEventListener("scroll", update);

        update();

    },

    /* ==========================
       Smooth Scroll
    ========================== */

    smoothScroll() {

        document
            .querySelectorAll('a[href^="#"]')
            .forEach(link => {

                link.addEventListener("click", e => {

                    const target =
                        document.querySelector(
                            link.getAttribute("href")
                        );

                    if (!target) return;

                    e.preventDefault();

                    target.scrollIntoView({

                        behavior: "smooth",
                        block: "start"

                    });

                });

            });

    },

    /* ==========================
       Utility
    ========================== */

    qs(selector) {

        return document.querySelector(selector);

    },

    qsa(selector) {

        return document.querySelectorAll(selector);

    },

    on(element, event, callback) {

        if (!element) return;

        element.addEventListener(

            event,

            callback

        );

    }

};
/* =====================================================
   AstraOS v3.0
   Part 2 - Navigation Engine
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       Navigation
    ========================== */

    initNavigation() {

        this.navLinks = this.qsa(".nav-links a");
        this.sections = this.qsa("section");

        this.initMobileMenu();
        this.initScrollSpy();
        this.initKeyboardShortcuts();

    },

    /* ==========================
       Mobile Menu
    ========================== */

    initMobileMenu() {

        let menuBtn = this.qs(".menu-toggle");

        if (!menuBtn) {

            menuBtn = document.createElement("button");

            menuBtn.className = "menu-toggle";

            menuBtn.innerHTML = "☰";

            this.navbar.appendChild(menuBtn);

        }

        const nav = this.qs(".nav-links");

        this.on(menuBtn, "click", () => {

            nav.classList.toggle("open");

            menuBtn.classList.toggle("active");

        });

    },

    /* ==========================
       Active Navigation
    ========================== */

    initScrollSpy() {

        if (!this.sections.length) return;

        const update = () => {

            let current = "";

            this.sections.forEach(section => {

                const top = section.offsetTop - 120;

                if (window.scrollY >= top) {

                    current = section.id;

                }

            });

            this.navLinks.forEach(link => {

                link.classList.remove("active");

                const href = link.getAttribute("href");

                if (href === "#" + current) {

                    link.classList.add("active");

                }

            });

        };

        window.addEventListener(

            "scroll",

            this.debounce(update, 15)

        );

        update();

    },

    /* ==========================
       Keyboard Shortcuts
    ========================== */

    initKeyboardShortcuts() {

        document.addEventListener("keydown", e => {

            if (e.altKey && e.key === "h") {

                location.href = "index.html";

            }

            if (e.altKey && e.key === "a") {

                location.href = "about.html";

            }

            if (e.altKey && e.key === "d") {

                location.href = "documentation.html";

            }

            if (e.altKey && e.key === "c") {

                location.href = "contact.html";

            }

        });

    },

    /* ==========================
       Debounce
    ========================== */

    debounce(fn, delay = 50) {

        let timer;

        return (...args) => {

            clearTimeout(timer);

            timer = setTimeout(() => {

                fn.apply(this, args);

            }, delay);

        };

    },

    /* ==========================
       Throttle
    ========================== */

    throttle(fn, delay = 100) {

        let waiting = false;

        return (...args) => {

            if (waiting) return;

            fn.apply(this, args);

            waiting = true;

            setTimeout(() => {

                waiting = false;

            }, delay);

        };

    }

});
/* =====================================================
   AstraOS v3.0
   Part 3 - Animation Engine
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       Animation Engine
    ========================== */

    initAnimations() {

        this.initScrollReveal();
        this.initCounters();
        this.initTypingEffect();
        this.initHeroParallax();

    },

    /* ==========================
       Scroll Reveal
    ========================== */

    initScrollReveal() {

        const elements = this.qsa(

            ".feature-card, .team-card, .stat-card, .roadmap-item, .contact-info, .contact-form"

        );

        if (!elements.length) return;

        const observer = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                });

            },

            {
                threshold:0.15
            }

        );

        elements.forEach(el => {

            el.classList.add("hidden");

            observer.observe(el);

        });

    },

    /* ==========================
       Counter Animation
    ========================== */

    initCounters() {

        const counters = this.qsa(".stat-card h2");

        counters.forEach(counter => {

            const target =
                parseInt(counter.textContent);

            if (isNaN(target)) return;

            let current = 0;

            const step =
                Math.ceil(target / 80);

            const update = () => {

                current += step;

                if (current < target) {

                    counter.textContent =
                        current + "+";

                    requestAnimationFrame(update);

                } else {

                    counter.textContent =
                        target + "+";

                }

            };

            update();

        });

    },

    /* ==========================
       Typing Effect
    ========================== */

    initTypingEffect() {

        const element =
            this.qs("[data-typing]");

        if (!element) return;

        const text =
            element.dataset.typing;

        let index = 0;

        element.textContent = "";

        const type = () => {

            if (index >= text.length) return;

            element.textContent +=

                text.charAt(index);

            index++;

            setTimeout(type,70);

        };

        type();

    },

    /* ==========================
       Hero Mouse Parallax
    ========================== */

    initHeroParallax() {

        if (!this.hero) return;

        window.addEventListener(

            "mousemove",

            this.throttle(e => {

                const x =

                    (window.innerWidth / 2 - e.clientX) / 45;

                const y =

                    (window.innerHeight / 2 - e.clientY) / 45;

                this.hero.style.transform =

                    `translate(${x}px,${y}px)`;

            },16)

        );

    }

});
/* =====================================================
   AstraOS v3.0
   Part 4 - UI Components
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       UI Components
    ========================== */

    initUI() {

        this.createThemeButton();
        this.createBackTop();
        this.createToastContainer();

        this.initTheme();
        this.initBackTop();
        this.initRippleEffect();

    },

    /* ==========================
       Theme Button
    ========================== */

    createThemeButton() {

        if (this.qs(".theme-toggle")) return;

        const btn = document.createElement("button");

        btn.className = "theme-toggle";

        btn.innerHTML = "🌙";

        document.body.appendChild(btn);

    },

    initTheme() {

        const btn = this.qs(".theme-toggle");

        if (!btn) return;

        const savedTheme = localStorage.getItem("astra-theme");

        if (savedTheme === "light") {

            document.body.classList.add("light-mode");

            btn.innerHTML = "☀️";

        }

        this.on(btn, "click", () => {

            document.body.classList.toggle("light-mode");

            const isLight =

                document.body.classList.contains("light-mode");

            btn.innerHTML =

                isLight ? "☀️" : "🌙";

            localStorage.setItem(

                "astra-theme",

                isLight ? "light" : "dark"

            );

        });

    },

    /* ==========================
       Back To Top
    ========================== */

    createBackTop() {

        if (this.qs(".back-top")) return;

        const btn = document.createElement("button");

        btn.className = "back-top";

        btn.innerHTML = "↑";

        document.body.appendChild(btn);

    },

    initBackTop() {

        const btn = this.qs(".back-top");

        if (!btn) return;

        window.addEventListener(

            "scroll",

            this.throttle(() => {

                btn.classList.toggle(

                    "show",

                    window.scrollY > 400

                );

            }, 100)

        );

        this.on(btn, "click", () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    },

    /* ==========================
       Toast Container
    ========================== */

    createToastContainer() {

        if (this.qs(".toast-container")) return;

        const container = document.createElement("div");

        container.className = "toast-container";

        document.body.appendChild(container);

    },

    showToast(message, type = "success") {

        const container = this.qs(".toast-container");

        if (!container) return;

        const toast = document.createElement("div");

        toast.className = `toast ${type}`;

        toast.textContent = message;

        container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.classList.add("show");

        });

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 400);

        }, 3000);

    },

    /* ==========================
       Ripple Effect
    ========================== */

    initRippleEffect() {

        this.qsa(

            ".primary-btn,.secondary-btn,.github-btn"

        ).forEach(button => {

            this.on(button, "click", e => {

                const ripple =

                    document.createElement("span");

                ripple.className = "ripple";

                ripple.style.left =

                    e.offsetX + "px";

                ripple.style.top =

                    e.offsetY + "px";

                button.appendChild(ripple);

                setTimeout(() => {

                    ripple.remove();

                }, 700);

            });

        });

    }

});
/* =====================================================
   AstraOS v3.0
   Part 5 - Contact Form Engine
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       Contact Form
    ========================== */

    initContactForm() {

        const form = this.qs(".contact-form");

        if (!form) return;

        this.on(form, "submit", (e) => {

            e.preventDefault();

            const name =
                form.querySelector('input[name="name"]');

            const email =
                form.querySelector('input[name="email"]');

            const subject =
                form.querySelector('input[name="subject"]');

            const message =
                form.querySelector("textarea");

            if (!this.validateName(name.value)) {

                this.showToast("Enter a valid name", "error");

                name.focus();

                return;

            }

            if (!this.validateEmail(email.value)) {

                this.showToast("Invalid email address", "error");

                email.focus();

                return;

            }

            if (subject && subject.value.trim().length < 3) {

                this.showToast("Subject is too short", "warning");

                subject.focus();

                return;

            }

            if (message.value.trim().length < 10) {

                this.showToast("Message is too short", "warning");

                message.focus();

                return;

            }

            this.showToast(

                "Message Sent Successfully 🚀",

                "success"

            );

            form.reset();

        });

    },

    /* ==========================
       Validation
    ========================== */

    validateName(name) {

        return /^[A-Za-z ]{3,40}$/.test(

            name.trim()

        );

    },

    validateEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(

            email.trim()

        );

    },

    validatePhone(phone) {

        return /^[6-9]\d{9}$/.test(

            phone.trim()

        );

    },

    /* ==========================
       Input Animation
    ========================== */

    initInputEffects() {

        this.qsa(

            ".contact-form input, .contact-form textarea"

        ).forEach(input => {

            this.on(input, "focus", () => {

                input.parentElement?.classList.add("focused");

            });

            this.on(input, "blur", () => {

                if (!input.value.trim()) {

                    input.parentElement?.classList.remove("focused");

                }

            });

        });

    },

    /* ==========================
       Character Counter
    ========================== */

    initCharacterCounter() {

        const textarea = this.qs(

            ".contact-form textarea"

        );

        if (!textarea) return;

        const counter = document.createElement("small");

        counter.className = "character-counter";

        counter.innerText = "0 / 500";

        textarea.after(counter);

        this.on(textarea, "input", () => {

            let length = textarea.value.length;

            if (length > 500) {

                textarea.value =

                    textarea.value.substring(0, 500);

                length = 500;

            }

            counter.innerText =

                `${length} / 500`;

        });

    }

});
/* =====================================================
   AstraOS v3.0
   Part 6 - GitHub API Engine
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       GitHub Config
    ========================== */

    github: {

        owner: "samirlevate8788-creator",

        repo: "AstraOS"

    },

    /* ==========================
       Initialize GitHub
    ========================== */

    initGitHub() {

        this.loadRepository();

        this.loadContributors();

        this.loadLatestRelease();

    },

    /* ==========================
       Repository Info
    ========================== */

    async loadRepository() {

        try {

            const url =

                `https://api.github.com/repos/${this.github.owner}/${this.github.repo}`;

            const response = await fetch(url);

            if (!response.ok) throw new Error();

            const repo = await response.json();

            this.updateText(

                "[data-stars]",

                repo.stargazers_count

            );

            this.updateText(

                "[data-forks]",

                repo.forks_count

            );

            this.updateText(

                "[data-watchers]",

                repo.watchers_count

            );

            this.updateText(

                "[data-open-issues]",

                repo.open_issues_count

            );

        }

        catch {

            this.showToast(

                "GitHub API unavailable",

                "warning"

            );

        }

    },

    /* ==========================
       Contributors
    ========================== */

    async loadContributors() {

        try {

            const url =

            `https://api.github.com/repos/${this.github.owner}/${this.github.repo}/contributors`;

            const response =

                await fetch(url);

            if (!response.ok) return;

            const data =

                await response.json();

            this.updateText(

                "[data-contributors]",

                data.length

            );

        }

        catch {}

    },

    /* ==========================
       Latest Release
    ========================== */

    async loadLatestRelease() {

        try {

            const url =

            `https://api.github.com/repos/${this.github.owner}/${this.github.repo}/releases/latest`;

            const response =

                await fetch(url);

            if (!response.ok) return;

            const release =

                await response.json();

            this.updateText(

                "[data-version]",

                release.tag_name

            );

        }

        catch {}

    },

    /* ==========================
       Utility
    ========================== */

    updateText(selector, value) {

        const element =

            this.qs(selector);

        if (!element) return;

        element.textContent = value;

    }

});
/* =====================================================
   AstraOS v3.0
   Part 7 - Performance Engine
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       Performance
    ========================== */

    initPerformance() {

        this.initLazyImages();
        this.initPreloadLinks();
        this.initVisibilityHandler();

    },

    /* ==========================
       Lazy Loading Images
    ========================== */

    initLazyImages() {

        const images = this.qsa("img[data-src]");

        if (!images.length) return;

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const img = entry.target;

                img.src = img.dataset.src;

                img.removeAttribute("data-src");

                img.onload = () => {

                    img.classList.add("loaded");

                };

                observer.unobserve(img);

            });

        }, {
            rootMargin: "100px"
        });

        images.forEach(img => observer.observe(img));

    },

    /* ==========================
       Prefetch Internal Links
    ========================== */

    initPreloadLinks() {

        this.qsa("a[href]").forEach(link => {

            const href = link.getAttribute("href");

            if (!href) return;

            if (href.startsWith("http")) return;

            this.on(link, "mouseenter", () => {

                const preload = document.createElement("link");

                preload.rel = "prefetch";

                preload.href = href;

                document.head.appendChild(preload);

            });

        });

    },

    /* ==========================
       Pause Animation
    ========================== */

    initVisibilityHandler() {

        document.addEventListener(

            "visibilitychange",

            () => {

                document.body.classList.toggle(

                    "page-hidden",

                    document.hidden

                );

            }

        );

    },

    /* ==========================
       Simple Cache
    ========================== */

    cacheData(key, data) {

        localStorage.setItem(

            key,

            JSON.stringify(data)

        );

    },

    getCache(key) {

        const data = localStorage.getItem(key);

        return data

            ? JSON.parse(data)

            : null;

    }

});
/* =====================================================
   AstraOS v3.0
   Part 8 - Premium Effects
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       Premium Effects
    ========================== */

    initPremiumEffects() {

        this.initMagneticButtons();
        this.initCardTilt();
        this.initCursorGlow();

    },

    /* ==========================
       Magnetic Buttons
    ========================== */

    initMagneticButtons() {

        this.qsa(".primary-btn, .secondary-btn, .github-btn").forEach(button => {

            button.addEventListener("mousemove", e => {

                const rect = button.getBoundingClientRect();

                const x = e.clientX - rect.left - rect.width / 2;

                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform =
                    `translate(${x * 0.2}px, ${y * 0.2}px)`;

            });

            button.addEventListener("mouseleave", () => {

                button.style.transform = "";

            });

        });

    },

    /* ==========================
       3D Card Tilt
    ========================== */

    initCardTilt() {

        this.qsa(".feature-card, .team-card, .stat-card").forEach(card => {

            card.addEventListener("mousemove", e => {

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;

                const y = e.clientY - rect.top;

                const rotateY = (x - rect.width / 2) / 15;

                const rotateX = -(y - rect.height / 2) / 15;

                card.style.transform =

                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     scale(1.04)`;

            });

            card.addEventListener("mouseleave", () => {

                card.style.transform =
                    "perspective(1000px) rotateX(0) rotateY(0) scale(1)";

            });

        });

    },

    /* ==========================
       Cursor Glow
    ========================== */

    initCursorGlow() {

        const glow = document.createElement("div");

        glow.className = "cursor-glow";

        document.body.appendChild(glow);

        window.addEventListener("mousemove", e => {

            glow.style.left = e.clientX + "px";

            glow.style.top = e.clientY + "px";

        });

    }

});
/* =====================================================
   AstraOS v3.0
   Part 9 - Easter Eggs & Developer Tools
===================================================== */

Object.assign(AstraOS, {

    /* ==========================
       Easter Eggs
    ========================== */

    initEasterEggs() {

        this.initKonamiCode();
        this.initDeveloperMode();
        this.initConsoleMessage();

    },

    /* ==========================
       Konami Code
    ========================== */

    initKonamiCode() {

        const sequence = [
            "ArrowUp","ArrowUp",
            "ArrowDown","ArrowDown",
            "ArrowLeft","ArrowRight",
            "ArrowLeft","ArrowRight",
            "b","a"
        ];

        let position = 0;

        document.addEventListener("keydown", e => {

            if (e.key === sequence[position]) {

                position++;

                if (position === sequence.length) {

                    position = 0;

                    this.activateSecretMode();

                }

            } else {

                position = 0;

            }

        });

    },

    /* ==========================
       Secret Mode
    ========================== */

    activateSecretMode() {

        document.body.classList.add("secret-mode");

        this.showToast(
            "🚀 AstraOS Secret Mode Activated!",
            "success"
        );

        setTimeout(() => {

            document.body.classList.remove("secret-mode");

        }, 6000);

    },

    /* ==========================
       Developer Mode
    ========================== */

    initDeveloperMode() {

        document.addEventListener("keydown", e => {

            if (!(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d")) {

                return;

            }

            this.showToast(
                "👨‍💻 Developer Mode Enabled",
                "success"
            );

            console.table({

                Project: "AstraOS",

                Version: "3.0",

                Author: this.github?.owner || "Unknown",

                Status: "Development"

            });

        });

    },

    /* ==========================
       Console Welcome
    ========================== */

    initConsoleMessage() {

        console.log(
`%c
 █████╗ ███████╗████████╗██████╗  █████╗ 
██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
███████║███████╗   ██║   ██████╔╝███████║
██╔══██║╚════██║   ██║   ██╔══██╗██╔══██║
██║  ██║███████║   ██║   ██║  ██║██║  ██║
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝

AstraOS v3.0
Open Source Educational Operating System
`,
"color:#00d9ff;font-weight:bold;"
        );

    }

});
/* =====================================================
   AstraOS v3.0
   Part 10 - Final Initialization
===================================================== */

Object.assign(AstraOS, {

    init() {

        try {

            /* ---------- Cache ---------- */

            this.cache();

            /* ---------- Core ---------- */

            this.initLoader();
            this.initProgressBar();
            this.initNavbar();
            this.smoothScroll();

            /* ---------- Navigation ---------- */

            this.initNavigation();
            this.initMobileMenu();
            this.initScrollSpy();

            /* ---------- Animations ---------- */

            this.initAnimations();

            /* ---------- UI ---------- */

            this.initUI();

            /* ---------- Contact ---------- */

            this.initContactForm();
            this.initInputEffects();
            this.initCharacterCounter();

            /* ---------- GitHub ---------- */

            this.initGitHub();

            /* ---------- Performance ---------- */

            this.initPerformance();

            /* ---------- Premium ---------- */

            this.initPremiumEffects();

            /* ---------- Easter Eggs ---------- */

            this.initEasterEggs();

            console.log(
                "%c✅ AstraOS v3.0 Initialized Successfully",
                "color:#00d9ff;font-size:14px;font-weight:bold;"
            );

        }

        catch(error){

            console.error(
                "AstraOS Initialization Error:",
                error
            );

        }

    }

});

/* ==========================================
   Start AstraOS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    AstraOS.init();

});