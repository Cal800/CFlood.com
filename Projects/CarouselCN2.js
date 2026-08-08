document.addEventListener('DOMContentLoaded', () => {
    const finalTrack = document.getElementById('finalTrack');
    const finalSlides = Array.from(finalTrack.children);
    const finalNext = document.getElementById('finalNext');
    const finalPrev = document.getElementById('finalPrev');
    const finalDotContainer = document.getElementById('finalDots');
    
    let finalIndex = 0;

    // 1. Dynamic dot generation
    finalSlides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveFinal(index));
        finalDotContainer.appendChild(dot);
    });

    const finalDots = Array.from(finalDotContainer.children);

    // 2. Slider Logic Engine
    const moveFinal = (index) => {
        finalSlides[finalIndex].classList.remove('active');
        finalDots[finalIndex].classList.remove('active');

        finalIndex = index;

        finalSlides[finalIndex].classList.add('active');
        finalDots[finalIndex].classList.add('active');
        
        finalTrack.style.transform = `translateX(-${finalIndex * 100}%)`;
    };

    // 3. Robust Click-to-Expand Bridge
    finalSlides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                // STRATEGY A: Check if your main portfolio uses a global openModal function
                if (typeof window.openModal === 'function') {
                    window.openModal(img.src);
                } 
                // STRATEGY B: Check for the exact method used on your other pages
                else {
                    const globalModal = document.getElementById('lightboxModal') || 
                                        document.getElementById('imageModal') || 
                                        document.querySelector('.modal');
                    const globalModalImg = document.getElementById('lightboxImg') || 
                                           document.getElementById('modalImage') || 
                                           document.querySelector('.modal-content img');

                    if (globalModal && globalModalImg) {
                        globalModalImg.src = img.src;
                        globalModalImg.alt = img.alt;
                        
                        // Supports class-based showing or display properties
                        globalModal.classList.add('show');
                        globalModal.classList.add('active');
                        globalModal.style.display = 'flex'; 
                    } else {
                        // STRATEGY C: Native browser backup window if elements are completely masked
                        window.open(img.src, '_blank');
                    }
                }
            });
        }
    });

    // 4. Navigation Event Handlers
    if (finalNext) {
        finalNext.addEventListener('click', () => {
            let next = (finalIndex + 1 >= finalSlides.length) ? 0 : finalIndex + 1;
            moveFinal(next);
        });
    }

    if (finalPrev) {
        finalPrev.addEventListener('click', () => {
            let prev = (finalIndex - 1 < 0) ? finalSlides.length - 1 : finalIndex - 1;
            moveFinal(prev);
        });
    }
});