document.addEventListener('DOMContentLoaded', function() {
    // Variables de scroll
    const navbar = document.getElementById('navbar');
    let isScrolling = false;
    let currentSection = 0;
    const sections = Array.from(document.querySelectorAll('section'));
    
    // Configuración del scroll
    const config = {
        duration: 800,    // Duración de la animación en ms
        threshold: 0.3,  // Umbral para detectar la sección activa (0-1)
        wheelSensitivity: 50, // Sensibilidad de la rueda del ratón
    };
    
    // Función para manejar el scroll suave
    function smoothScroll(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, config.duration);
            window.scrollTo(0, run);
            if (timeElapsed < config.duration) requestAnimationFrame(animation);
        }
        
        function easeInOutQuad(t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Manejar clics en enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target === '#') return;
            smoothScroll(target);
        });
    });
    
    // Detectar sección activa durante el scroll
    function setActiveSection() {
        if (isScrolling) return;
        
        const scrollPosition = window.scrollY + (window.innerHeight * config.threshold);
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = index;
                setActiveNavLink(section.getAttribute('id'));
            }
        });
    }
    
    // Resaltar enlace de navegación activo
    function setActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Inicializar
    setActiveSection();
    
    // Actualizar sección activa al hacer scroll
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            setActiveSection();
        }
    }, { passive: true });
    
    // Cambiar estilo del navbar al hacer scroll
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Inicialización del menú móvil
    console.log('=== INICIALIZANDO MENÚ MÓVIL ===');
    
    if (mobileMenuBtn && navLinks) {
        console.log('Elementos del menú encontrados correctamente');
        
        // Cerrar menú al presionar la tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuBtn.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    } else {
        console.error('Error: No se encontraron los elementos necesarios para el menú móvil');
    }
    
    // Inicializar la sección actual
    currentSection = getCurrentSection();
});

// Animación de carga
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
