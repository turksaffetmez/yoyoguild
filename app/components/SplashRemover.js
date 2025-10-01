// components/SplashRemover.js - BU ŞEKİLDE OLSUN
"use client";
import { useEffect } from 'react';

export default function SplashRemover() {
  useEffect(() => {
    console.log('🔄 SplashRemover activated');
    
    const removeSplash = () => {
      try {
        // Sadece splash iframe'leri kaldır
        document.querySelectorAll('iframe').forEach(iframe => {
          if (iframe.src?.includes('splash') || iframe.src?.includes('loading')) {
            iframe.remove();
            console.log('🗑️ Removed splash iframe');
          }
        });
        
        // Body'yi göster
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        
      } catch (error) {
        console.log('Splash removal:', error);
      }
    };

    removeSplash();
    setTimeout(removeSplash, 1000);
    setTimeout(removeSplash, 3000);
    
  }, []);

  return null;
}