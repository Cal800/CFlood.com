document.addEventListener('DOMContentLoaded', () => {
    const notezTrack = document.getElementById('notezTrack');
    const notezSlides = Array.from(notezTrack.children);
    const notezNext = document.getElementById('notezNext');
    const notezPrev = document.getElementById('notezPrev');
    const notezDotContainer = document.getElementById('notezDots');
    
    let notezIndex = 0;

    // 1. Clean dot generation
    notezSlides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveNotez(index));
        notezDotContainer.appendChild(dot);
    });

    const notezDots = Array.from(notezDotContainer.children);

    // 2. Specialized Move Logic
    const moveNotez = (index) => {
        // Handle Classes
        notezSlides[notezIndex].classList.remove('active');
        notezDots[notezIndex].classList.remove('active');

        notezIndex = index;

        notezSlides[notezIndex].classList.add('active');
        notezDots[notezIndex].classList.add('active');
        
        // The Transform - Ensure it uses 100% of the container width
        notezTrack.style.transform = `translateX(-${notezIndex * 100}%)`;
    };

    // 3. Robust Click-to-Expand Bridge (Added)
    notezSlides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                // STRATEGY A: Check if your main portfolio uses a global openModal function
                if (typeof window.openModal === 'function') {
                    window.openModal(img.src);
                } 
                // STRATEGY B: Check for common global modal element IDs or classes
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

    // 4. Listeners with "Notez" prefix
    if(notezNext) {
        notezNext.addEventListener('click', () => {
            let next = (notezIndex + 1 >= notezSlides.length) ? 0 : notezIndex + 1;
            moveNotez(next);
        });
    }

    if(notezPrev) {
        notezPrev.addEventListener('click', () => {
            let prev = (notezIndex - 1 < 0) ? notezSlides.length - 1 : notezIndex - 1;
            moveNotez(prev);
        });
    }
});