

document.addEventListener("DOMContentLoaded", () => {
    const brandElement = document.querySelector('.animated-brand');
    
    if (brandElement) {
        // Deliberate micro-timeout to trigger entry horizontal line animation smoothly
        setTimeout(() => {
            brandElement.classList.add('show');
        }, 200);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const brandElement = document.querySelector('.animated-brand');
    const titleElement = document.querySelector('.animated-title');
    
    if (brandElement) {
        setTimeout(() => {
            brandElement.classList.add('show');
        }, 200);
    }

    // 🚀 Triggers your title underline expansion trace cleanly right after the brand tracking
    if (titleElement) {
        setTimeout(() => {
            titleElement.classList.add('show');
        }, 400);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    
    // Optimized threshold and root margins prevent aggressive clipping triggers
    const observerOptions = {
        root: null,
        rootMargin: "-50px 0px -50px 0px", /* Gives a slight padding safety buffer inside the viewport */
        threshold: 0.15 
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Slices cleanly into view
                entry.target.classList.add("show");
            } else {
                // Only strips it if it fully leaves the safe tracking bounds
                // This prevents the flickering issue seen when content changes or micro-scrolling occurs
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove("show");
                }
            }
        });
    }, observerOptions);

    const targetTitles = document.querySelectorAll(".animated-title");
    targetTitles.forEach(title => scrollObserver.observe(title));
});

document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector('.tools-detailed-card');
    const wrappers = document.querySelectorAll('.tool-logo-wrapper');
    const dynamicTitle = document.querySelector('.tool-dynamic-title');

    // Bail out early if this page doesn't have the tools section
    if (!card || !dynamicTitle) return;

    wrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', () => {
            const toolName = wrapper.getAttribute('data-tool-name');
            dynamicTitle.textContent = toolName;
            card.classList.add('item-is-active');
        });

        wrapper.addEventListener('mouseleave', () => {
            card.classList.remove('item-is-active');
        });
    });
});

