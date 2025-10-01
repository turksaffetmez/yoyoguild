// components/SplashRemover.js - BUNUNLA DEĞİŞTİRİN
"use client";
import { useEffect } from 'react';

export default function SplashRemover() {
  useEffect(() => {
    console.log('🚨 NUCLEAR SPLASH REMOVER ACTIVATED');
    
    const nuclearRemoval = () => {
      try {
        // 1. TÜM iframe'leri kaldır
        document.querySelectorAll('iframe').forEach(iframe => {
          if (iframe.src?.includes('farcaster') || iframe.src?.includes('warpcast') || 
              iframe.className?.includes('splash') || iframe.style.display !== 'none') {
            iframe.remove();
            console.log('🗑️ Removed iframe');
          }
        });
        
        // 2. TÜM splash/loading elementlerini kaldır
        document.querySelectorAll('div, section, main, body').forEach(el => {
          const html = el.outerHTML?.toLowerCase() || '';
          const style = el.style?.cssText?.toLowerCase() || '';
          const className = el.className?.toLowerCase() || '';
          
          if (html.includes('splash') || html.includes('loading') || 
              style.includes('splash') || style.includes('loading') ||
              className.includes('splash') || className.includes('loading') ||
              el.id?.includes('splash') || el.id?.includes('loading')) {
            el.remove();
            console.log('🗑️ Removed splash element');
          }
        });
        
        // 3. BODY'yi FORCE göster
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        document.body.style.display = 'block';
        document.body.style.overflow = 'auto';
        document.body.style.position = 'relative';
        
        // 4. Tüm children'ları göster
        document.querySelectorAll('*').forEach(el => {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.display = 'block';
        });
        
        console.log('✅ NUCLEAR SPLASH REMOVAL COMPLETE');
        
      } catch (error) {
        console.warn('Nuclear removal warning:', error);
      }
    };

    // HEMEN uygula
    nuclearRemoval();
    
    // Farcaster çok yavaş - çoklu deneme
    [10, 50, 100, 200, 500, 1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000].forEach(timeout => {
      setTimeout(nuclearRemoval, timeout);
    });

  }, []);

  return null;
}