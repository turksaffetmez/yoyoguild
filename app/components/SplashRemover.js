"use client";
import { useEffect } from 'react';

export default function SplashRemover() {
  useEffect(() => {
    console.log('🚨 SplashRemover activated');

    // Emergency splash removal function
    const removeSplashElements = () => {
      try {
        // Remove all potential splash elements
        const elementsToRemove = [
          'iframe',
          '[class*="splash"]',
          '[class*="Splash"]', 
          '[class*="loading"]',
          '[class*="Loading"]',
          '[data-farcaster-loading]',
          '[style*="splash"]',
          '[style*="loading"]'
        ];

        elementsToRemove.forEach(selector => {
          document.querySelectorAll(selector).forEach(element => {
            // Check if element looks like a splash screen
            const html = element.outerHTML.toLowerCase();
            if (html.includes('splash') || html.includes('loading') || 
                element.src?.includes('splash') || element.className?.includes('splash')) {
              element.remove();
              console.log('🗑️ Removed splash element:', selector);
            }
          });
        });

        // Force show the body and main content
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        document.body.style.overflow = 'auto';
        
        // Force show all content
        document.querySelectorAll('div, section, main').forEach(el => {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        });

        console.log('✅ Splash removal completed');

      } catch (error) {
        console.warn('⚠️ Splash removal error:', error);
      }
    };

    // Execute immediately
    removeSplashElements();
    
    // Multiple attempts (Farcaster bug workaround)
    const intervals = [100, 500, 1000, 2000, 3000, 5000, 8000, 10000];
    intervals.forEach(timeout => {
      setTimeout(removeSplashElements, timeout);
    });

    // Final emergency removal after 15 seconds
    setTimeout(() => {
      console.log('🚨 FINAL EMERGENCY: Removing all iframes and overlays');
      document.querySelectorAll('iframe, [class*="overlay"], [class*="modal"]').forEach(el => {
        el.remove();
      });
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
    }, 15000);

  }, []);

  return null;
}