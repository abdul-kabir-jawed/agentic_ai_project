if (typeof window !== 'undefined') {
  let cleanup: (() => void) | null = null;

  function initTOCScrollSpy() {
    // Cleanup previous instance if exists
    if (cleanup) {
      cleanup();
      cleanup = null;
    }

    const tocLinks = document.querySelectorAll<HTMLAnchorElement>(
      '.table-of-contents__link'
    );

    if (tocLinks.length === 0) {
      return;
    }

    // Get all heading elements that correspond to TOC items
    const headings = Array.from(tocLinks)
      .map((link) => {
        const href = link.getAttribute('href');
        if (!href) return null;
        
        // Remove the hash and find the element
        const id = href.replace(/^#/, '');
        const element = document.getElementById(id);
        return element;
      })
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) {
      return;
    }

    let activeHeadingId: string | null = null;
    let observer: IntersectionObserver | null = null;
    let cleanupInterval: NodeJS.Timeout | null = null;

    // Update active TOC link
    function updateActiveTOCLink(headingId: string | null) {
      // First, remove all active classes (including any Docusaurus default ones)
      tocLinks.forEach((link) => {
        link.classList.remove('table-of-contents__link--active');
        // Also remove any other potential active classes Docusaurus might use
        link.removeAttribute('data-active');
        link.setAttribute('aria-current', 'false');
      });

      // Then add active class only if we have a valid headingId
      if (headingId) {
        tocLinks.forEach((link) => {
          const href = link.getAttribute('href');
          const linkId = href ? href.replace(/^#/, '') : '';

          if (linkId === headingId) {
            link.classList.add('table-of-contents__link--active');
            link.setAttribute('aria-current', 'true');
          }
        });
      }
    }

    // Get the main content container
    const mainContent = document.querySelector('main') || document.querySelector('.docItemCol') || document.body;
    
    // Account for fixed navbar (60px) + padding
    const navbarOffset = 100;

    // Scroll-based detection - finds the heading currently visible in viewport
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportTop = scrollY + navbarOffset;
          const viewportBottom = scrollY + window.innerHeight;

          let currentHeading: HTMLElement | null = null;
          let bestHeading: HTMLElement | null = null;
          let bestDistance = Infinity;

          // Find the heading that's currently in the viewport
          for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            const rect = heading.getBoundingClientRect();
            const headingTop = rect.top + scrollY;
            const headingBottom = headingTop + rect.height;

            // Check if heading is actually visible in viewport (stricter check)
            // Heading must be within the visible viewport area (accounting for navbar)
            const isInViewport = 
              rect.top >= navbarOffset && 
              rect.top < window.innerHeight && 
              rect.bottom > navbarOffset;

            if (isInViewport) {
              // Calculate distance from top of viewport (accounting for navbar)
              const distanceFromViewportTop = Math.abs(rect.top - navbarOffset);
              
              if (distanceFromViewportTop < bestDistance) {
                bestDistance = distanceFromViewportTop;
                bestHeading = heading;
              }
            }
          }

          // If no heading is in viewport, find the one that was most recently scrolled past
          // Only if we're scrolled down significantly (not at the very top)
          if (!bestHeading && scrollY > 150) {
            for (let i = headings.length - 1; i >= 0; i--) {
              const heading = headings[i];
              const rect = heading.getBoundingClientRect();
              const headingTop = rect.top + scrollY;

              // If heading is above the viewport top (but not too far above)
              if (headingTop <= viewportTop && headingTop >= viewportTop - 300) {
                bestHeading = heading;
                break;
              }
            }
          }

          // Only highlight first heading if we're at the very top AND it's actually visible
          // Don't override bestHeading if we already found a better one
          // Make this very strict - only at absolute top (scrollY < 5) and heading must be in viewport
          if (!bestHeading && scrollY < 5 && headings.length > 0) {
            const firstHeading = headings[0];
            const firstRect = firstHeading.getBoundingClientRect();
            // Only highlight if first heading is actually visible in viewport (strict check)
            // Must be within the visible area accounting for navbar
            const isVisible = firstRect.top >= navbarOffset && 
                             firstRect.top < (window.innerHeight - 50) && 
                             firstRect.bottom > navbarOffset &&
                             firstRect.height > 0;
            if (isVisible) {
              bestHeading = firstHeading;
            }
          }

          // If we're at the bottom, highlight the last heading
          const documentHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          if (scrollY + windowHeight >= documentHeight - 20 && headings.length > 0) {
            bestHeading = headings[headings.length - 1];
          }

          currentHeading = bestHeading;

          // Special check: if we're scrolled down and the active heading is the first one,
          // but it's not actually visible, clear it
          if (activeHeadingId && scrollY > 50) {
            const activeHeading = headings.find(h => h.id === activeHeadingId);
            if (activeHeading) {
              const activeRect = activeHeading.getBoundingClientRect();
              const isActiveVisible = activeRect.top >= navbarOffset && 
                                     activeRect.top < window.innerHeight && 
                                     activeRect.bottom > navbarOffset;
              // If active heading is the first one and it's not visible, clear it
              if (activeHeading === headings[0] && !isActiveVisible) {
                currentHeading = null;
                activeHeadingId = null;
                updateActiveTOCLink(null);
              }
            }
          }

          // Only update if we have a valid heading and it's different from current
          if (currentHeading && currentHeading.id) {
            if (currentHeading.id !== activeHeadingId) {
              activeHeadingId = currentHeading.id;
              updateActiveTOCLink(currentHeading.id);
            }
          } else if (!currentHeading && activeHeadingId) {
            // Clear highlighting if no heading should be active
            activeHeadingId = null;
            updateActiveTOCLink(null);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Intersection Observer for more precise detection
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${navbarOffset}px 0px -60% 0px`, // Trigger when heading is near top of viewport
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    };

    observer = new IntersectionObserver((entries) => {
      // Find the heading that's most visible and closest to the top
      let bestEntry: IntersectionObserverEntry | null = null;
      let bestScore = -1;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          // Only consider headings that are actually visible in the viewport
          // (not too far above or below)
          if (rect.top >= -100 && rect.top <= window.innerHeight + 100) {
            // Score based on how close to top and how much is visible
            // Prefer headings that are near the top of the viewport
            const distanceFromTop = Math.max(0, rect.top - navbarOffset);
            const visibilityRatio = entry.intersectionRatio;
            // Higher score for headings closer to top and more visible
            const score = visibilityRatio * (1 / (1 + distanceFromTop / 200));

            if (score > bestScore) {
              bestScore = score;
              bestEntry = entry;
            }
          }
        }
      });

      // Only update if we have a good candidate with a reasonable score
      // Also check that we're not at the very top (where first heading should be highlighted)
      // Increased threshold to 0.2 and scrollY check to 30 for stricter detection
      if (bestEntry && bestEntry.target.id && bestScore > 0.2 && window.scrollY > 30) {
        const newActiveId = bestEntry.target.id;
        if (newActiveId !== activeHeadingId) {
          activeHeadingId = newActiveId;
          updateActiveTOCLink(newActiveId);
        }
      } else if (window.scrollY <= 30 && activeHeadingId) {
        // If we're near the top, only keep active if it's actually the first heading and visible
        const firstHeading = headings[0];
        if (firstHeading && firstHeading.id === activeHeadingId) {
          const firstRect = firstHeading.getBoundingClientRect();
          const isVisible = firstRect.top >= navbarOffset && 
                           firstRect.top < (window.innerHeight - 50) && 
                           firstRect.bottom > navbarOffset;
          if (!isVisible) {
            activeHeadingId = null;
            updateActiveTOCLink(null);
          }
        } else if (firstHeading && firstHeading.id !== activeHeadingId) {
          // If we're at top but active is not first heading, clear it
          activeHeadingId = null;
          updateActiveTOCLink(null);
        }
      } else if (window.scrollY < 5 && headings.length > 0) {
        // At the very top, only highlight first heading if it's actually visible in viewport
        const firstHeading = headings[0];
        const firstRect = firstHeading.getBoundingClientRect();
        // Strict visibility check
        const isVisible = firstRect.top >= navbarOffset && 
                         firstRect.top < (window.innerHeight - 50) && 
                         firstRect.bottom > navbarOffset &&
                         firstRect.height > 0;
        if (isVisible) {
          const firstHeadingId = firstHeading.id;
          if (firstHeadingId && firstHeadingId !== activeHeadingId) {
            activeHeadingId = firstHeadingId;
            updateActiveTOCLink(firstHeadingId);
          }
        } else {
          // First heading not visible, clear highlighting
          if (activeHeadingId) {
            activeHeadingId = null;
            updateActiveTOCLink(null);
          }
        }
      } else if (bestScore <= 0.2 && activeHeadingId) {
        // No good candidate found, clear highlighting
        // Increased threshold to 0.2 to be more strict
        activeHeadingId = null;
        updateActiveTOCLink(null);
      }
    }, observerOptions);

    // Observe all headings
    headings.forEach((heading) => {
      if (heading.id) {
        observer?.observe(heading);
      }
    });

    // Clear any existing active states first (including Docusaurus defaults)
    updateActiveTOCLink(null);
    
    // Also remove any active classes that Docusaurus might have added
    tocLinks.forEach((link) => {
      link.classList.remove('table-of-contents__link--active');
      link.removeAttribute('data-active');
      link.setAttribute('aria-current', 'false');
    });

    // Periodic check to prevent Docusaurus from re-applying default highlighting
    const clearDocusaurusDefaults = () => {
      tocLinks.forEach((link) => {
        // Only keep our custom active class, remove any others
        if (!link.classList.contains('table-of-contents__link--active')) {
          link.removeAttribute('data-active');
          link.setAttribute('aria-current', 'false');
        }
      });
    };

    // Run periodic cleanup every 500ms
    cleanupInterval = setInterval(clearDocusaurusDefaults, 500);

    // Initial check after a small delay to ensure page is fully loaded
    // Only highlight if we're actually at the very top AND first heading is visible
    setTimeout(() => {
      // Very strict check - only at absolute top (scrollY < 5)
      if (window.scrollY < 5 && headings.length > 0) {
        const firstHeading = headings[0];
        const firstRect = firstHeading.getBoundingClientRect();
        // Strict visibility check - must be in viewport accounting for navbar
        const isVisible = firstRect.top >= navbarOffset && 
                         firstRect.top < (window.innerHeight - 50) && 
                         firstRect.bottom > navbarOffset &&
                         firstRect.height > 0;
        if (isVisible) {
          handleScroll();
        } else {
          // First heading not visible, clear all highlighting
          updateActiveTOCLink(null);
        }
      } else {
        // If not at top, clear all highlighting immediately
        updateActiveTOCLink(null);
      }
    }, 400);

    // Listen to scroll events on window and main content
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (mainContent !== document.body) {
      mainContent.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Cleanup function
    cleanup = () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      window.removeEventListener('scroll', handleScroll);
      if (mainContent !== document.body) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }

  // Initialize when DOM is ready
  function startTOCSpy() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTOCScrollSpy);
    } else {
      // Small delay to ensure TOC is rendered
      setTimeout(initTOCScrollSpy, 100);
    }
  }

  startTOCSpy();

  // Re-initialize on navigation (for SPA navigation)
  let lastUrl = window.location.href;
  const checkUrlChange = () => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      setTimeout(() => {
        startTOCSpy();
      }, 300);
    }
  };

  // Use MutationObserver to detect route changes
  const routeObserver = new MutationObserver(() => {
    checkUrlChange();
  });

  routeObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also listen for popstate (browser back/forward)
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      startTOCSpy();
    }, 300);
  });
}

