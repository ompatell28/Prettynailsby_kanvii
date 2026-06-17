document.addEventListener("DOMContentLoaded", () => {

    // --- SANITY CLOUD CONFIGURATION ---
    const sanityConfig = {
        projectId: 'ym8zucubkuifsz43u1rc7iqi', 
        dataset: 'production',
        useCdn: false, // Isko false kiya taaki token ke sath bilkul naya data turant mile
        apiVersion: '2023-05-03', // 👈 Yahan comma lag gaya hai
        token: 'skFuvrxApZdpNnicuSx8xHR8jXSuV4kxbtbBTmWIUe59mkXCCyeAcVRdq4nxevTlm02mubeWRaOlgYggkQlMFU2vp9t2UCC7Lk1Z125EaXmczHGNLuIgIoe10ro45stnEQrj5oFP3ApL3yrm1eP7JVGx9xnJ5IuEvoDl2xbmSigIlqEpe6Pf' // 👈 Quotes ke andar ekdum sahi token
    };

    // --- 1. MOBILE NAVBAR SCROLL LOCK ---
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

    // --- 2. DYNAMIC GALLERY WITH SANITY CLOUD ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const fullGalleryGrid = document.getElementById('fullGalleryGrid');
    const homeGalleryGrid = document.getElementById('homeGalleryGrid');

    const lightbox = document.createElement('div');
    lightbox.id = 'galleryLightbox';
    Object.assign(lightbox.style, {
        position: 'fixed', zIndex: '5000', left: '0', top: '0', width: '100%', height: '100vh',
        backgroundColor: 'rgba(42, 28, 18, 0.95)', display: 'none', justifyContent: 'center',
        alignItems: 'center', flexDirection: 'column', padding: '20px', backdropFilter: 'blur(5px)'
    });
    document.body.appendChild(lightbox);

    async function loadCMSGallery() {
        const query = encodeURIComponent(`*[_type == "portfolio"]{title, "image": image.asset->url, category}`);
        const url = `https://${sanityConfig.projectId}.api.sanity.io/v2021-10-21/data/query/${sanityConfig.dataset}?query=${query}`;

        try {
            // Token authorized fetch
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${sanityConfig.token}` }
            });
            const result = await response.json();
            const uploadedDesigns = result.result || [];

            if (homeGalleryGrid) renderGalleryItems(homeGalleryGrid, uploadedDesigns, 'all', 3);
            if (fullGalleryGrid) renderGalleryItems(fullGalleryGrid, uploadedDesigns, 'all');

            filterButtons.forEach(button => {
                button.replaceWith(button.cloneNode(true)); 
            });
            const newFilterButtons = document.querySelectorAll('.filter-btn');
            newFilterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    newFilterButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    renderGalleryItems(fullGalleryGrid, uploadedDesigns, e.target.getAttribute('data-category'));
                });
            });

        } catch (error) {
            console.error("Error loading photos from Sanity Cloud:", error);
        }
    }

    function renderGalleryItems(targetGrid, itemsList, filter = 'all', limit = null) {
        if (!targetGrid) return;
        targetGrid.innerHTML = '';
        
        let count = 0;
        itemsList.forEach(item => {
            if (filter === 'all' || item.category === filter) {
                if (limit && count >= limit) return;
                
                const card = document.createElement('div');
                card.className = 'gallery-item';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <h3>${item.title}</h3>
                `;
                
                card.addEventListener('click', () => {
                    const studioNumber = "919724326378";
                    const textMessage = `Hello Kanvi! 💅✨%0A%0AI just saw your gorgeous work in the gallery and want to book an appointment for this design:%0A%0A*Design Name:* ${item.title}`;

                    lightbox.innerHTML = `
                        <span id="closeLightbox" style="position: absolute; top: 20px; right: 25px; color: #EFECE6; font-size: 2.5rem; cursor: pointer;">&times;</span>
                        <img src="${item.image}" style="max-width: 90%; max-height: 70vh; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 20px;">
                        <h3 style="color: #EFECE6; font-family: 'Playfair Display', serif; font-size: 1.4rem; margin-bottom: 15px; text-align: center;">${item.title}</h3>
                        <a href="https://api.whatsapp.com/send?phone=${studioNumber}&text=${textMessage}" target="_blank" style="background-color: #25D366; color: white; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 5px 20px rgba(37,211,102,0.3);">
                            <i class="fab fa-whatsapp"></i> Book This Design
                        </a>
                    `;
                    lightbox.style.display = 'flex';
                    document.body.classList.add('no-scroll');
                });

                targetGrid.appendChild(card);
                count++;
            }
        });
    }

    loadCMSGallery();

    lightbox.addEventListener('click', (e) => {
        if (e.target.id === 'galleryLightbox' || e.target.id === 'closeLightbox') {
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });

    // --- 3. DYNAMIC MENU LIST & BOOKING DROP-DOWN VIA SANITY ---
    const servicesContainer = document.getElementById('servicesContainer');
    const selectedServiceDropdown = document.getElementById('selectedService');

    if (servicesContainer) {
        const defaultMenu = [
            { category: 'Nail Services', item_name: 'Gel Extensions', price: '₹1,499', time: '60 Mins' },
            { category: 'Nail Services', item_name: 'Bridal Nail Art', price: '₹2,499', time: '90 Mins' },
            { category: 'Nail Services', item_name: 'Acrylic Overlay', price: '₹1,199', time: '45 Mins' }
        ];

        async function loadCMSMenuData() {
            const query = encodeURIComponent(`*[_type == "menu"]{category, item_name, price, time}`);
            const url = `https://${sanityConfig.projectId}.api.sanity.io/v2021-10-21/data/query/${sanityConfig.dataset}?query=${query}`;

            try {
                // Token authorized fetch
                const response = await fetch(url, {
                    headers: { Authorization: `Bearer ${sanityConfig.token}` }
                });
                const result = await response.json();
                const menuItems = result.result || [];
                
                if (menuItems.length === 0) {
                    renderMenuAndDropdown(defaultMenu);
                } else {
                    renderMenuAndDropdown(menuItems);
                }
            } catch (error) {
                console.error("Error loading menu from Sanity Cloud:", error);
                renderMenuAndDropdown(defaultMenu);
            }
        }

        function renderMenuAndDropdown(menuItems) {
            servicesContainer.innerHTML = '';
            if (selectedServiceDropdown) {
                selectedServiceDropdown.innerHTML = '<option value="" disabled selected>Choose a service...</option>';
            }

            const groups = menuItems.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});

            for (const category in groups) {
                const block = document.createElement('div');
                block.className = 'menu-category-block';
                let rowsHTML = `<h3 class="category-heading">${category}</h3>`;
                
                groups[category].forEach(item => {
                    const timeTarget = item.time ? `<span class="item-time">(${item.time})</span>` : '';
                    rowsHTML += `
                        <div class="menu-list-row">
                            <div class="item-info">
                                <span class="item-title">${item.item_name}</span>
                                ${timeTarget}
                            </div>
                            <span class="item-dots"></span>
                            <span class="item-cost">${item.price}</span>
                        </div>
                    `;

                    if (selectedServiceDropdown) {
                        const option = document.createElement('option');
                        option.value = item.item_name;
                        option.textContent = `${item.item_name} (${item.price})`;
                        selectedServiceDropdown.appendChild(option);
                    }
                });
                block.innerHTML = rowsHTML;
                servicesContainer.appendChild(block);
            }
        }
        loadCMSMenuData();
    }

    // --- 4. WHATSAPP ROUTING FORM LOGIC ---
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

    // --- 5. TESTIMONIAL CAROUSEL SLIDER ---
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    if (sliderContainer) {
        let isHovered = false;
        sliderContainer.addEventListener('mouseenter', () => isHovered = true);
        sliderContainer.addEventListener('mouseleave', () => isHovered = false);
        sliderContainer.addEventListener('touchstart', () => isHovered = true);
        sliderContainer.addEventListener('touchend', () => isHovered = false);

        const getScrollStep = () => {
            const firstCard = sliderContainer.querySelector('.testimonial-card');
            return firstCard ? firstCard.clientWidth + 24 : 320; 
        };

        setInterval(() => {
            if (!isHovered) {
                const scrollStep = getScrollStep();
                const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
                if (sliderContainer.scrollLeft >= maxScroll - 15) {
                    sliderContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    sliderContainer.scrollBy({ left: scrollStep, behavior: 'smooth' });
                }
            }
        }, 3000);
    }
});