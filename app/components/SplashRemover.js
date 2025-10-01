// SplashRemover.js - BUNUNLA DEĞİŞTİRİN
"use client";
import { useEffect } from 'react';

export default function SplashRemover() {
  useEffect(() => {
    console.log('🚨 ULTRA SPLASH REMOVER ACTIVATED');
    
    // NÜKLEER seçenek: Tüm iframe'leri kaldır
    const nuclearOption = () => {
      try {
        // 1. Tüm iframe'leri kaldır
        document.querySelectorAll('iframe').forEach(iframe => {
          if (iframe.src?.includes('farcaster') || iframe.src?.includes('splash')) {
            iframe.remove();
            console.log('🗑️ Removed farcaster iframe');
          }
        });
        
        // 2. Body'yi force göster
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        document.body.style.display = 'block';
        document.body.style.overflow = 'auto';
        
        // 3. Tüm elementleri göster
        document.querySelectorAll('*').forEach(el => {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        });
        
        console.log('✅ NUCLEAR SPLASH REMOVAL COMPLETE');
      } catch (e) {
        console.error('Nuclear option failed:', e);
      }
    };

    // HEMEN uygula
    nuclearOption();
    
    // Çoklu deneme
    [100, 500, 1000, 2000, 3000, 5000, 8000, 15000].forEach(timeout => {
      setTimeout(nuclearOption, timeout);
    });

  }, []);

  return null;
}