// Yeni bir hook: useAutoConnect.js
const detectEnvironment = () => {
  const ua = navigator.userAgent;
  
  // Farcaster/Warpcast
  if (ua.includes('Warpcast') || ua.includes('Farcaster') || window.self !== window.top) {
    return 'farcaster';
  }
  
  // Base App
  if (ua.includes('Base') || window.location.href.includes('base.org')) {
    return 'base';
  }
  
  // MetaMask Browser
  if (window.ethereum?.isMetaMask && !window.ethereum?.isRabby) {
    return 'metamask';
  }
  
  // Normal Browser
  return 'browser';
};