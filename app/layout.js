<head>
  {/* ... diğer meta tag'ler ... */}
  
  {/* ULTRA IMMEDIATE READY - Base App için */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
        // ULTRA IMMEDIATE READY - Base App için
        if (window.parent !== window.self) {
          console.log('🚀 ULTRA IMMEDIATE READY CALL');
          // 0ms delay - en hızlı
          window.parent.postMessage({
            type: 'ready',
            version: '1.0.0',
            app: 'YoYo Guild Battle'
          }, '*');
        }
        
        // 100ms sonra tekrar
        setTimeout(() => {
          if (window.parent !== window.self) {
            window.parent.postMessage({type: 'ready'}, '*');
          }
        }, 100);
        
        // 500ms sonra tekrar  
        setTimeout(() => {
          if (window.parent !== window.self) {
            window.parent.postMessage({type: 'ready'}, '*');
          }
        }, 500);
      `
    }}
  />
</head>