"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('FarcasterSDK initialized');
    
    // Sadece Farcaster SDK varsa ready çağır
    if (typeof farcaster !== 'undefined') {
      farcaster.ready();
    }
  }, []);
  
  return null;
}