"use client";
import { useEffect } from 'react';

export default function MetaTags() {
  useEffect(() => {
    // Meta tag'leri dinamik olarak ekle
    const metaTags = [
      // Farcaster Frame Meta Tags
      { property: 'fc:frame', content: 'vNext' },
      { property: 'fc:frame:image', content: 'https://yoyoguild.vercel.app/images/page.png' },
      { property: 'fc:frame:image:aspect_ratio', content: '1.91:1' },
      { property: 'fc:frame:button:1', content: '🎮 Play Game' },
      { property: 'fc:frame:button:1:action', content: 'link' },
      { property: 'fc:frame:button:1:target', content: 'https://yoyoguild.vercel.app?source=farcaster' },
      { property: 'fc:frame:button:2', content: '🏆 Leaderboard' },
      { property: 'fc:frame:button:2:action', content: 'link' },
      { property: 'fc:frame:button:2:target', content: 'https://yoyoguild.vercel.app?source=farcaster&tab=leaderboard' },
      
      // Farcaster Mini App Meta Tags
      { property: 'fc:mini-app:name', content: 'YoYo Guild Battle' },
      { property: 'fc:mini-app:icon', content: 'https://yoyoguild.vercel.app/images/yoyo.png' },
      { property: 'fc:mini-app:description', content: 'Blockchain Battle Arena on Base' },
      { property: 'fc:mini-app:url', content: 'https://yoyoguild.vercel.app' },
      { property: 'fc:mini-app:terms', content: 'https://yoyoguild.vercel.app/terms' },
      { property: 'fc:mini-app:privacy', content: 'https://yoyoguild.vercel.app/privacy' },
      
      // Open Graph Meta Tags
      { property: 'og:title', content: 'YoYo Guild Battle' },
      { property: 'og:description', content: 'Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!' },
      { property: 'og:image', content: 'https://yoyoguild.vercel.app/images/page.png' },
      { property: 'og:url', content: 'https://yoyoguild.vercel.app' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'YoYo Guild Battle' },
      
      // Twitter Card Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'YoYo Guild Battle' },
      { name: 'twitter:description', content: 'Blockchain Battle Arena on Base' },
      { name: 'twitter:image', content: 'https://yoyoguild.vercel.app/images/page.png' },
      { name: 'twitter:site', content: '@yoyoguild' },
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.property) {
        meta.setAttribute('property', tag.property);
      }
      if (tag.name) {
        meta.setAttribute('name', tag.name);
      }
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    });

    // Viewport'u güncelle
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    console.log('Meta tags injected for Farcaster embed');
  }, []);

  return null;
}