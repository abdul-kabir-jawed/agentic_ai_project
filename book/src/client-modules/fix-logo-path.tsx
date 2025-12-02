if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Fix navbar logo path to remove baseUrl
    const logoImages = document.querySelectorAll('.navbar__brand img, .navbar__logo img');
    logoImages.forEach((img: HTMLImageElement) => {
      if (img.src && img.src.includes('physical-ai-favicon.svg')) {
        // Replace the src with absolute path without baseUrl
        img.src = '/img/physical-ai-favicon.svg';
      }
    });

    // Also handle SVG elements if any
    const logoSvgs = document.querySelectorAll('.navbar__brand svg, .navbar__logo svg');
    logoSvgs.forEach((svg: SVGElement) => {
      const useElement = svg.querySelector('use');
      if (useElement && useElement.getAttribute('href')?.includes('physical-ai-favicon.svg')) {
        useElement.setAttribute('href', '/img/physical-ai-favicon.svg');
      }
    });

    // Use MutationObserver to catch dynamically added logos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as Element;
            const imgs = element.querySelectorAll?.('.navbar__brand img, .navbar__logo img') || [];
            imgs.forEach((img: HTMLImageElement) => {
              if (img.src && img.src.includes('physical-ai-favicon.svg')) {
                img.src = '/img/physical-ai-favicon.svg';
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

