document.addEventListener("DOMContentLoaded", () => {

    // --- 1. MOBILE NAVBAR SCROLL LOCK (TOUCH-BLOCK SYSTEM) ---
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const navLinksContainer = document.getElementById('navLinks');

    function preventDefaultScroll(e) {
        e.preventDefault();
    }

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navLinksContainer.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            if (isActive) {
                document.body.classList.add('no-scroll');
                window.addEventListener('touchmove', preventDefaultScroll, { passive: false });
            } else {
                document.body.classList.remove('no-scroll');
                window.removeEventListener('touchmove', preventDefaultScroll);
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
                document.body.classList.remove('no-scroll');
                window.removeEventListener('touchmove', preventDefaultScroll);
            });
        });
    }

    // --- 2. DYNAMIC GALLERY FILTER LOGIC WITH PREMIUM LIGHTBOX OVERLAY (CMS DRIVEN) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const fullGalleryGrid = document.getElementById('fullGalleryGrid');

    if (fullGalleryGrid) {
        // Pop-up Lightbox Structure Automatic Creation
        const lightbox = document.createElement('div');
        lightbox.id = 'galleryLightbox';
        Object.assign(lightbox.style, {
            position: 'fixed', zIndex: '5000', left: '0', top: '0', width: '100%', height: '100vh',
            backgroundColor: 'rgba(42, 28, 18, 0.95)', display: 'none', justifyContent: 'center',
            alignItems: 'center', flexDirection: 'column', padding: '20px', backdropFilter: 'blur(5px)'
        });
        document.body.appendChild(lightbox);

        // Global store for dynamic designs
        let uploadedDesigns = [];

        // CMS JSON folder se saare data dynamic fetch karne ka rule
        async function loadCMSGallery() {
            try {
                // --- DEFAULT CMS BACKUP ARRAY (Aapki config.yml settings ke exact items mapping) ---
                uploadedDesigns = [
                    { title: 'Classic Bridal Elegance', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600', category: 'bridal' },
                    { title: 'Pastel Gel Polish', image: 'https://images.unsplash.com/photo-1632345031435-8797b2d58045?q=80&w=600', category: 'gel' },
                    { title: 'Minimal Matte Lines', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600', category: 'minimalist' },
                    { title: 'Ombre Acrylic Extensions', image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600', category: 'acrylic' },
                    { title: 'Luxury Stones Bridal Red', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600', category: 'bridal' }
                ];

                renderGallery('all');
            } catch (error) {
                console.error("Error loading portfolio files:", error);
            }
        }

        function renderGallery(filter = 'all') {
            fullGalleryGrid.innerHTML = '';
            uploadedDesigns.forEach(item => {
                if (filter === 'all' || item.category === filter) {
                    const card = document.createElement('div');
                    card.className = 'gallery-item';
                    card.style.cursor = 'pointer';
                    card.innerHTML = `
                        <img src="${item.image}" alt="${item.title}">
                        <h3>${item.title}</h3>
                    `;
                    
                    // Click lagte hi premium Lightbox container overlay toggle logic
                    card.addEventListener('click', () => {
                        const studioNumber = "919724326378"; // Kanvi ka Mobile Number
                        const textMessage = `Hello Kanvi! 💅✨%0A%0AI just saw your gorgeous work in the gallery and want to book an appointment for this exact design:%0A%0A*Design Name:* ${item.title}%0A*Reference Image:* ${window.location.origin}${item.image}`;

                        lightbox.innerHTML = `
                            <span id="closeLightbox" style="position: absolute; top: 20px; right: 25px; color: #EFECE6; font-size: 2.5rem; cursor: pointer;">&times;</span>
                            <img src="${item.image}" style="max-width: 90%; max-height: 70vh; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 20px;">
                            <h3 style="color: #EFECE6; font-family: 'Playfair Display', serif; font-size: 1.4rem; margin-bottom: 15px; text-align: center;">${item.title}</h3>
                            <a href="https://api.whatsapp.com/send?phone=${studioNumber}&text=${textMessage}" 
                               target="_blank" 
                               style="background-color: #25D366; color: white; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 5px 20px rgba(37,211,102,0.3); transition: 0.2s;">
                               <i class="fab fa-whatsapp" style="font-size: 1.2rem;"></i> Book This Design
                            </a>
                        `;
                        lightbox.style.display = 'flex';
                        document.body.classList.add('no-scroll');
                    });

                    fullGalleryGrid.appendChild(card);
                }
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'galleryLightbox' || e.target.id === 'closeLightbox') {
                lightbox.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderGallery(e.target.getAttribute('data-category'));
            });
        });

        // CMS Trigger Call Initialization
        loadCMSGallery();
    }

    // --- 3. WHATSAPP ROUTING FORM LOGIC ---
    const bookingForm = document.getElementById('whatsappBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const service = document.getElementById('selectedService').value;
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;

            const studioWhatsAppNumber = "919724326378"; 
            const structuredText = `Hello Pretty Nails Studio! 💅✨%0A%0A` +
                                   `I'd like to book an appointment slot details below:%0A%0A` +
                                   `*Client Name:* ${name}%0A` +
                                   `*Contact:* ${phone}%0A` +
                                   `*Treatment:* ${service}%0A` +
                                   `*Date:* ${date}%0A` +
                                   `*Time Slot:* ${time}`;

            window.open(`https://api.whatsapp.com/send?phone=${studioWhatsAppNumber}&text=${structuredText}`, '_blank');
        });
    }

    // --- 4. BULLETPROOF AUTOMATIC TESTIMONIAL CAROUSEL SLIDER (FIXED BRACKETS) ---
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    
    if (sliderContainer) {
        let isHovered = false;

        // User touch ya hover kare toh slider ko roko
        sliderContainer.addEventListener('mouseenter', () => isHovered = true);
        sliderContainer.addEventListener('mouseleave', () => isHovered = false);
        sliderContainer.addEventListener('touchstart', () => isHovered = true);
        sliderContainer.addEventListener('touchend', () => isHovered = false);

        // Responsive card element size checker
        const getScrollStep = () => {
            const firstCard = sliderContainer.querySelector('.testimonial-card');
            return firstCard ? firstCard.clientWidth + 24 : 320; 
        };

        setInterval(() => {
            if (!isHovered) {
                const scrollStep = getScrollStep();
                const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
                
                // End par aane par smooth zero par, nahi toh aage slide karo
                if (sliderContainer.scrollLeft >= maxScroll - 15) {
                    sliderContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    sliderContainer.scrollBy({ left: scrollStep, behavior: 'smooth' });
                }
            }
        }, 3000); // Har 3 second me ekdum beautifully auto-slide hoga
    }
});