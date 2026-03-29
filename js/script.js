// script.js
document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Year for Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Hero Background Slideshow
    const slides = document.querySelectorAll('.hero-bg-slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // 2. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            // Stop observing once animated
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Navbar logic (blur effect on scroll)
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.85)';
        }
    });

    // 4. Smooth scrolling for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only affect actual hash links, ignore simple #
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Account for fixed header and maybe bottom bar on mobile
                const isMobile = window.innerWidth <= 768;
                const headerOffset = 80; // navbar height

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Reviews Carousel
    const reviewCards = document.querySelectorAll('.review-card');
    const dotsContainer = document.getElementById('reviewDots');

    if (reviewCards.length > 0 && dotsContainer) {
        let activeReview = 0;
        const total = reviewCards.length;

        // Build dot indicators
        reviewCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('dot-active');
            dot.addEventListener('click', () => goToReview(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function updateCarousel() {
            reviewCards.forEach((card, i) => {
                card.classList.remove('rc-active', 'rc-prev', 'rc-next');
                const prev = (activeReview - 1 + total) % total;
                const next = (activeReview + 1) % total;
                if (i === activeReview) card.classList.add('rc-active');
                else if (i === prev) card.classList.add('rc-prev');
                else if (i === next) card.classList.add('rc-next');
            });
            dots.forEach((d, i) => {
                d.classList.toggle('dot-active', i === activeReview);
            });
        }

        function goToReview(index) {
            activeReview = index;
            updateCarousel();
        }

        // Initialize
        updateCarousel();

        // Auto advance every 5 seconds
        setInterval(() => {
            activeReview = (activeReview + 1) % total;
            updateCarousel();
        }, 5000);
    }

    // 6. Cuisine Fade Carousel (mobile only)
    const cfcCarousel = document.getElementById('cuisineFadeCarousel');
    const cfcDotsContainer = document.getElementById('cfcDots');

    if (cfcCarousel && cfcDotsContainer) {
        const cfcSlides = cfcCarousel.querySelectorAll('.cfc-slide');
        let cfcActive = 0;
        const cfcTotal = cfcSlides.length;

        // Build dots
        cfcSlides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('cfc-dot');
            if (i === 0) dot.classList.add('cfc-dot-active');
            dot.addEventListener('click', () => goToCfc(i));
            cfcDotsContainer.appendChild(dot);
        });

        const cfcDots = cfcDotsContainer.querySelectorAll('.cfc-dot');

        function updateCfc() {
            cfcSlides.forEach((slide, i) => {
                slide.classList.toggle('cfc-active', i === cfcActive);
            });
            cfcDots.forEach((dot, i) => {
                dot.classList.toggle('cfc-dot-active', i === cfcActive);
            });
        }

        function goToCfc(index) {
            cfcActive = index;
            updateCfc();
        }

        // Only run auto-advance on mobile
        function startCfcIfMobile() {
            if (window.innerWidth <= 768) {
                setInterval(() => {
                    cfcActive = (cfcActive + 1) % cfcTotal;
                    updateCfc();
                }, 3500);
            }
        }

        updateCfc();
        startCfcIfMobile();
    }

});
