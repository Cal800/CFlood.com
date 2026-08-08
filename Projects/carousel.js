const track = document.getElementById('carouselTrack');
if (track) {
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;

    function updateCarousel(index) {
        // Move the track
        track.style.transform = `translateX(-${index * 100}%)`;

        // Update active slide classes for scaling effects
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(currentIndex);
        });
    }

    // Simple click-to-open-in-new-tab for diagrams
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const imgSrc = slide.querySelector('img').src;
            window.open(imgSrc, '_blank');
        });
    });
}

const uiTrack = document.getElementById('uiTrack');
if (uiTrack) {
    const uiSlides = Array.from(uiTrack.children);
    const uiNext = document.getElementById('uiNext');
    const uiPrev = document.getElementById('uiPrev');
    const uiDots = document.querySelectorAll('#uiDots .dot');

    let uiIndex = 0;

    function updateUICarousel(index) {
        uiTrack.style.transform = `translateX(-${index * 100}%)`;

        uiSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        uiDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    if (uiNext) {
        uiNext.addEventListener('click', () => {
            uiIndex = (uiIndex + 1) % uiSlides.length;
            updateUICarousel(uiIndex);
        });
    }

    if (uiPrev) {
        uiPrev.addEventListener('click', () => {
            uiIndex = (uiIndex - 1 + uiSlides.length) % uiSlides.length;
            updateUICarousel(uiIndex);
        });
    }

    // Re-applying your successful 'Click to Expand' for these too!
    uiSlides.forEach(slide => {
        slide.addEventListener('click', () => {
            window.open(slide.querySelector('img').src, '_blank');
        });
    });
}