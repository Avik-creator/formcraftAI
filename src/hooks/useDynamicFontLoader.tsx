import { useEffect } from "react";

const useDynamicFontLoader = (fontFamily: string) => {
  useEffect(() => {
    if (!fontFamily) return;

    // Ensure preconnects exist for faster font loading
    const ensurePreconnect = (href: string, crossOrigin = false) => {
      const selector = `link[rel=preconnect][href='${href}']`;
      let el = document.head.querySelector<HTMLLinkElement>(selector);
      if (!el) {
        el = document.createElement('link');
        el.rel = 'preconnect';
        el.href = href;
        if (crossOrigin) {
          el.crossOrigin = '';
        }
        document.head.appendChild(el);
      }
    };

    ensurePreconnect('https://fonts.googleapis.com');
    ensurePreconnect('https://fonts.gstatic.com', true);

    // load font in document head dynamically
    const id = 'font-link';
    let linkElement = document.head.querySelector<HTMLLinkElement>(`#${id}`);
    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      fontFamily
    ).replaceAll('%20', '+')}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;

    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = id;
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
    }

    // Update href if changed
    if (linkElement.href !== href) {
      linkElement.href = href;
    }
  }, [fontFamily]);

  return null;
};

export default useDynamicFontLoader;
