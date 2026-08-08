document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  }, {
    threshold: 0.1
  });

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));

  // moved inside - now it can actually see `observer`
  const brandLogo = document.querySelector('.animated-brand');
  if (brandLogo) {
    observer.observe(brandLogo);
  }
});
/* Filter Logic */

document.addEventListener('DOMContentLoaded', function() {
    const tagFilter = document.getElementById('tag-filter');
    const monthFilter = document.getElementById('month-filter');
    const yearFilter = document.getElementById('year-filter');
    const noResults = document.getElementById('no-results');

    function filterProjects() {
        const selectedTag = tagFilter.value;
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;
        const cards = document.querySelectorAll('.project-card');
        let visibleCount = 0;

        cards.forEach(card => {
            // 1. Check Category Tag
            const hasTag = selectedTag === 'all' || card.querySelector(`.${selectedTag}`);
            
            // 2. Check Date
            const datePill = card.querySelector('.date-pill');
            if (!datePill) return; 

            const dateText = datePill.textContent.trim(); 
            const parts = dateText.split('/');
            const month = parts[1];
            const year = parts[2];
            
            const matchesMonth = selectedMonth === 'all' || month === selectedMonth;
            const matchesYear = selectedYear === 'all' || year === selectedYear;

            if (hasTag && matchesMonth && matchesYear) {
                // FADE IN CARDS
                card.style.display = "grid"; 
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        card.classList.remove('hidden-card');
                    }, 10);
                });
                visibleCount++;
            } else {
                // FADE OUT CARDS
                card.classList.add('hidden-card');
                setTimeout(() => {
                    if (card.classList.contains('hidden-card')) {
                        card.style.display = "none";
                    }
                }, 600); 
            }
        });

        // "No Results" Liquid Logic
        const noResultsTitle = noResults.querySelector('.animated-title');
        
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            requestAnimationFrame(() => {
                setTimeout(() => {
                    noResults.style.opacity = '1';
                    // Trigger your custom blue line animation
                    if (noResultsTitle) noResultsTitle.classList.add('show');
                }, 10);
            });
        } else {
            noResults.style.opacity = '0';
            // Remove the 'show' class so the line "shrinks" back or resets for next time
            if (noResultsTitle) noResultsTitle.classList.remove('show');
            
            setTimeout(() => {
                if (visibleCount > 0) {
                    noResults.style.display = 'none';
                }
            }, 600);
        }
    }

    tagFilter.addEventListener('change', filterProjects);
    monthFilter.addEventListener('change', filterProjects);
    yearFilter.addEventListener('change', filterProjects);
    
    console.log("Liquid Filter System Online 🌊🚀");
});


// Add the brand group to the list of elements being watched by your observer
const brandLogo = document.querySelector('.animated-brand');
if (brandLogo) {
    observer.observe(brandLogo);
}



//----terminal code ----

function triggerResumeDownload() {
    const btn = document.getElementById('downloadBtn');
    const progressBar = document.getElementById('downloadProgress');
    const btnText = document.getElementById('downloadBtnText');
    
    if (btn.classList.contains('is-loading')) return;
    
    // Explicitly resetting the layer properties on start
    progressBar.style.width = '0%';
    btn.classList.add('is-loading');
    
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 5; 
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
           progressBar.style.width = '100%';
           btnText.innerText = 'Downloaded!';
    
           // FORCED AUTOMATIC BACKGROUND DOWNLOAD TRICK:
           const link = document.createElement('a');
           link.href = 'RESUME/Cal Flood - Resume - Without Details.pdf'; // Your exact file path
           link.download = 'RESUME/Cal Flood - Resume - Without Details.pdf';    // Forces the native "Save As / Download" behavior
           document.body.appendChild(link);
           link.click();                             // Silently triggers the download
           document.body.removeChild(link);          // Clean up the DOM immediately
            
            setTimeout(() => {
                btnText.innerText = 'Download';
                btn.classList.remove('is-loading');
                // The CSS state handles fading the indicator smoothly back out here
            }, 2000);
        } else {
            progressBar.style.width = progress + '%';
            btnText.innerText = `Downloading... ${progress}%`;
        }
    }, 120);
}

function viewResumeFullscreen() {
    // Open your resume path directly in a new dedicated tab
    window.open('RESUME/Cal Flood - Resume - Without Details.png', '_blank');
}

function generateSecureMail(event) {
    // 1. Prevent the default empty anchor link jump behavior
    event.preventDefault();
    
    // 2. Define your parameters (Change 'your.email@domain.com' to your actual inbox address)
    const emailTo = "CFlood.com@gmail.com";
    const emailSubject = encodeURIComponent("[CV Request] Comprehensive Credentials Inquiry");
    const emailBody = encodeURIComponent(
    "Hi Cal,\n\n" +
    "I came across your portfolio and I am interested in reviewing your comprehensive CV. " +
    "Please send over a copy featuring your full contact details and professional credentials at your earliest convenience.\n\n" +
    "Best regards,\n" +
    "[Your Name / Company]"

    ); // Put your pre-copied response here later!
    
    // 3. Assemble the native mailto URL string scheme
    const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
    
    // 4. Update the visual UI elements on click to confirm activation
    const btnText = document.getElementById('emailBtnText');
    const originalText = btnText.innerText;
    
    btnText.innerText = "Opening Mail App...";
    
    // 5. Fire open the recruiter's native app layout stream
    window.location.href = mailtoUrl;
    
    // 6. Gracefully reset button text back after a small window
    setTimeout(() => {
        btnText.innerText = originalText;
    }, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Grab all the specific certificate filter elements
    const tagFilter = document.getElementById("cert-tag-filter");
    const monthFilter = document.getElementById("cert-month-filter");
    const yearFilter = document.getElementById("cert-year-filter");
    const noResults = document.getElementById("no-results");
    const certCards = document.querySelectorAll(".cert-card");

    // 2. Main Filtering Engine Function
    function filterCertificates() {
        const selectedTag = tagFilter.value;
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;
        let visibleCount = 0;

        certCards.forEach(card => {
            // Read data attributes from the card element
            const cardTag = card.getAttribute("data-tags");
            const cardMonth = card.getAttribute("data-month");
            const cardYear = card.getAttribute("data-year");

            // Evaluate if this specific card fits all selected dropdown values
            const matchesTag = (selectedTag === "all" || cardTag === selectedTag);
            const matchesMonth = (selectedMonth === "all" || cardMonth === selectedMonth);
            const matchesYear = (selectedYear === "all" || cardYear === selectedYear);

            if (matchesTag && matchesMonth && matchesYear) {
                // Instantly bring back display to calculate transitions correctly
                card.style.display = "grid"; 
                
                // Micro-delay ensures the browser registers the display switch before animating opacity
                setTimeout(() => {
                    card.classList.remove("cert-hidden-card");
                }, 10);
                
                visibleCount++;
            } else {
                // Transition it out smoothly using your custom CSS rule
                card.classList.add("cert-hidden-card");
            }
        });

        // 3. Handle No Results State Feedback Panel
        if (visibleCount === 0) {
            if (noResults) {
                noResults.style.display = "block";
                setTimeout(() => { noResults.style.opacity = "1"; }, 50);
            }
        } else {
            if (noResults) {
                noResults.style.opacity = "0";
                noResults.style.display = "none";
            }
        }
    }

    //  SAFE TRANSITION LISTENER: Removes layout bounds ONLY when fade finish confirms it's hidden
    certCards.forEach(card => {
        card.addEventListener("transitionend", () => {
            if (card.classList.contains("cert-hidden-card")) {
                card.style.display = "none";
            }
        });
    });

    // 4. Attach event listeners to activate the engine on every change
    if (tagFilter && monthFilter && yearFilter) {
        tagFilter.addEventListener("change", filterCertificates);
        monthFilter.addEventListener("change", filterCertificates);
        yearFilter.addEventListener("change", filterCertificates);
    }
});



